/**
 * This file will be the start point of the application.
 */
const serverConfig = require('./configs/server/server.config');
const {MONGO_DB_URL} = require('./configs/db/mongoDb.config');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const {routeInit} = require('./routes');
const {dbInit} = require(
    './dbOperations/mongoDB/init'
)
app.use(express.json());
app.use(express.urlencoded({extended :true}));


/**
 * Configuring CORS
 * Current configuration ensures access from everywhere
 * Think twice, while doing the same in the Production.
 *
 */
app.use(cors());

/**
 * DB Connection initialization
 */

mongoose.connect(MONGO_DB_URL);
const db = mongoose.connection;
db.on("error", ()=>{
    console.log("error while connecting to DB");
});
db.once("open",async () => {
    console.log("connected to Mongo DB ")
    await dbInit();
});



routeInit(app);

app.listen(serverConfig.PORT, () => {
    console.log(`Application started on the port num : ${serverConfig.PORT}`);
})