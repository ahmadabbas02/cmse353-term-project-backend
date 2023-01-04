import App from "@/app";
import { AdminRoutes, AuthRoute, ChairRoutes, IndexRoute, ParentsRoutes, StudentsRoute, TeachersRoutes } from "@/routes";
import validateEnv from "@utils/validateEnv";

validateEnv();

const app = new App([
  new IndexRoute(),
  new AuthRoute(),
  new AdminRoutes(),
  new TeachersRoutes(),
  new ChairRoutes(),
  new StudentsRoute(),
  new ParentsRoutes(),
]);

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", err => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

app.listen();
