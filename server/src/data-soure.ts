import { DataSource } from "typeorm";
import { Counter } from "./Entities/Counter";
import { CounterUser } from "./Entities/CounterUser";
import { Issues } from "./Entities/Issues";
import { NormalUser } from "./Entities/NormalUser";
import { Notification } from "./Entities/Notification";
import "reflect-metadata"
import { Solution } from "./Entities/Solution";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize:false, 
    logging: false,
    entities: [Counter,CounterUser,NormalUser,Issues,Notification,Solution],
    subscribers: [],
    migrations: [],  
})
 
AppDataSource.initialize()
    .then(() => {
     console.log('DATABSE SUCCESSFULLY CONNECTED'); 
    })
    .catch((error) => console.log(error))