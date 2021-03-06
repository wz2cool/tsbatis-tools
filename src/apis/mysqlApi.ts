import * as express from "express";
import * as path from "path";
import { MysqlService } from "../services/mysqlService";

export class MysqlApi {
    private readonly mysqlService = new MysqlService();
    public getRoute(): express.Router {
        const mysqlApi = express.Router();

        mysqlApi.get("/", (req, res, next) => {
            res.json({ results: "mysqlApi" });
        });

        mysqlApi.post("/getTableNames", (req, res, next) => {
            const uri = req.body.uri;
            const user = req.body.user;
            const pwd = req.body.pwd;
            const database = req.body.database;
            console.log(JSON.stringify(req.body));
            this.mysqlService.getTableNames(uri, user, pwd, database)
                .then((names) => {
                    res.json(names);
                })
                .catch((e) => {
                    res.status(500);
                    res.json({ error: e.message });
                });
        });

        mysqlApi.post("/getColumnInfos", (req, res, next) => {
            const uri = req.body.uri;
            const user = req.body.user;
            const pwd = req.body.pwd;
            const database = req.body.database;
            const tableName = req.body.tableName;
            this.mysqlService.getDbColumnInfos(uri, user, pwd, database, tableName)
                .then((infos) => {
                    res.json({ results: infos });
                })
                .catch((e) => {
                    res.status(500);
                    res.json({ error: e.message });
                });
        });

        mysqlApi.post("/generateEntities", (req, res, next) => {
            const uri = req.body.uri;
            const user = req.body.user;
            const pwd = req.body.pwd;
            const database = req.body.database;
            const tableNames = req.body.tableNames;
            this.mysqlService.generateTableEntitiesZipFile(uri, user, pwd, database, tableNames)
                .then((zipFile) => {
                    res.download(zipFile, path.basename(zipFile));
                })
                .catch((e) => {
                    res.status(500);
                    res.json({ error: e.message });
                });
        });

        return mysqlApi;
    }
}
