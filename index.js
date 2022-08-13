import express from "express"
import createMysqlSequelize from "../PLEIDATE_BACKEND/src/models/mysqlSequelizeResult.js"
import SERVER_CONFIG from "../PLEIDATE_BACKEND/src/configs/server.js"
import router from "../PLEIDATE_BACKEND/src/routes/user.js"

const app = express();
const port = SERVER_CONFIG.port;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(router);

createMysqlSequelize().sync()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});