const express = require("express")
const { Server } = require('socket.io')
// import EventEmitter = require( 'events'
const {createClient} = require('redis');
const createMysqlSequelize = require("../PLEIDATE_BACKEND/src/models/mysqlSequelizeResult.js")
const SERVER_CONFIG = require("../PLEIDATE_BACKEND/src/config/server.js")
const router = require("../PLEIDATE_BACKEND/src/routes/user.js")
const { authChecker } =require( "./src/services/auth.js")

const app = express();
const port = SERVER_CONFIG.PORT;
const io = new Server(8001);

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// const emitter = new EventEmitter()
// emitter.setMaxListeners(1000)
// emitter.defaultMaxListeners = 1000
io.setMaxListeners(1000);
app.all("*", authChecker)
app.set('socketio', io);
app.set('redisClient', redisClient);
app.use(router);

createMysqlSequelize().sync()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});