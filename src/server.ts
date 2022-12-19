import App from "@/app";
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import validateEnv from "@utils/validateEnv";
import ChairRoutes from "./routes/chair.route";
import AdminRoutes from "./routes/admin.route";
import StudentsRoute from "./routes/students.route";
import TeachersRoutes from "./routes/teachers.route";
import ParentsRoutes from "./routes/parents.route";

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
