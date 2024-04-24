import mongoose from "mongoose";

const MONGODB_URI: string = 'mongodb://127.0.0.1:27017/';
const DB_NAME: string= 'social-api';

class DBClient {
    private client: mongoose.Connection;

    constructor() {
        this.client = mongoose.connection;
    }

    async connect() {
        try {
            await mongoose.connect(MONGODB_URI + DB_NAME, {
                useUnifiedTopology: true,
                useNewUrlParser: true ,
                useCreateIndex: true,
                useFindAndModify: false
            });
            console.log("Succesfully connected to MongoDB");
        } catch(error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    }
}


export default new DBClient;