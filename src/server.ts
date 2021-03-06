import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as ejs from "ejs";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { ObjectUtils } from "ts-commons";
import * as apis from "./apis";
import * as routes from "./routes";

export class Server {
  public static bootstrap(): Server {
    return new Server();
  }

  public readonly app: express.Application;
  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    // view engine setup
    this.app.set("views", path.join(__dirname, "public"));
    this.app.engine(".html", ejs.__express);
    this.app.set("view engine", "html");

    // this.app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(logger("dev"));

    this.app.use(cors({ credentials: true, origin: true }));

    this.routes();
    this.apis();
    this.swagger();

    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      const err: any = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    // error handler
    this.app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(ObjectUtils.getOrDefault(err.status, 500));
      res.render("error");
    });
  }

  private routes(): void {
    // visit: http://localhost:3000/
    this.app.use("/", routes.Home.getRoute());
  }

  private apis(): void {
    // visit: http://localhost:3000/api/users
    this.app.use("/users", apis.UserApi.getRoute());
    this.app.use("/sqlite", new apis.SqliteApi().getRoute());
    this.app.use("/mysql", new apis.MysqlApi().getRoute());
  }

  private swagger(): void {
    const apiPath = path.join(__dirname, "apis", "*");
    const options = {
      apis: [apiPath],
      swaggerDefinition: {
        info: {
          title: "ts-express-starter",
          version: "1.0.0"
        }
      }
    };
    const swaggerSpec = swaggerJSDoc(options);
    this.app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
}
