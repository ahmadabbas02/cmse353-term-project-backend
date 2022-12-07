import App from "@/app";
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import UsersRoute from "@routes/users.route";
import validateEnv from "@utils/validateEnv";
import ChairRoutes from "./routes/chair.route";
import CoursesRoutes from "./routes/courses.route";
import TeachersRoutes from "./routes/teachers.route";

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new CoursesRoutes(), new TeachersRoutes(), new ChairRoutes()]);

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", err => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

app.listen();
