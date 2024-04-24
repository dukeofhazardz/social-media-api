// This file bootstraps the Express application.
// It configures the view engine, connects to MongoDB, and defines routes.

import express, { Express } from "express";
import router from "../routes/routes";
import path from "path";
import DBClient from "../db/mongo";


const PORT = 8000;
const app: Express = express();
app.set('view engine', 'ejs');
app.set('../views', path.join(__dirname, '../views'));
app.use('/', router);


// Connects to MongoDB before the server starts listening
DBClient.connect().then(() => {
    app.listen(PORT, (err?: Error) => {
        if (err) {
            throw new Error(`Error connecting to server: ${err}`);
        } else {
            console.log(`Server running on port ${PORT}`);
        }
    });    
});

export default app;
