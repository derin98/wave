/**
 * This file will be the start point of the application.
 */
const serverConfig = require('./configs/server/server.config');
const {MONGO_DB_URL} = require('./configs/db/mongoDb.config');
const mongoose = require('mongoose');
const User = require('./models/mongoDB/userManagement/user/user.model');
const express = require('express');
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :true}));


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
db.once("open",()=>{
    console.log("connected to Mongo DB ")
    init();
});

/**
 *
 * @returns
 * This method is for the demonstration purpose,
 * ideally one ADMIN userManagement should have been created in the backend
 */
async function init() {


    var user = await User.findOne({ userId: "admin" });

    if (user) {
        console.log("Admin user already present");
        return;
    }

    try {

        user = await User.create({
            firstName: "admin",
            lastName: "crion",
            name: "admin crion",
            userId: "admin", // It should be atleat 16, else will throw error
            email: "admin@admin.com",  // If we don't pass this, it will throw the error
            userType: "ADMIN",
            password :bcrypt.hashSync("derinb", 8) //this field should be hidden from the end userManagement

        });
        console.log(user);

    } catch (e) {
        console.log(e.message);
    }

}



/**
 * importing the routes
 */
require('./routes/organizationManagement/userType/userType.routes')(app);
require('./routes/organizationManagement/department/department.routes')(app);
require('./routes/organizationManagement/businessUnit/businessUnit.routes')(app);
require('./routes/userManagement/auth/auth.routes')(app);
require('./routes/userManagement/user/user.routes')(app);

app.listen(serverConfig.PORT, () => {
    console.log(`Application started on the port num : ${serverConfig.PORT}`);
})