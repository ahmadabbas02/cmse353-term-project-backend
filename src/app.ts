import sanitizedConfig from "@config";
import { Routes } from "@interfaces/routes.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "@utils/db";
import { logger, stream } from "@utils/logger";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = process.env.NODE_ENV || "development";
    this.port = sanitizedConfig.PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(sanitizedConfig.LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: sanitizedConfig.ORIGIN, credentials: sanitizedConfig.CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      expressSession({
        cookie: {
          secure: false,
          maxAge: 1 * 24 * 60 * 60 * 1000, // ms
        },
        secret: sanitizedConfig.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(prisma, {
          checkPeriod: 2 * 60 * 1000, // ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }),
      }),
    );
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "Secure Attendance System API Docs",
          version: "1.0.0",
          description: "This was created as CMSE353 term project for EMU.",
        },
      },
      apis: ["swagger.yaml"],
    };
    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    logger.info(`Docs available at http://localhost:${this.port}/api-docs`);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
