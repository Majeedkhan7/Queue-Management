//config dotenvfile
require('dotenv').config()

//import database connection
require('./data-soure')

//imports
import express, { Application , Request , Response, urlencoded } from 'express'
import {Server} from 'socket.io'
import http from 'http'
import cors from 'cors'

const app :  Application = express()
app.use(cors())
app.use(express.json())



const server = http.createServer(app)
export const io = new Server(server,{cors:{origin:'*',methods:["POST","PUT","GET","DELETE"]}});

io.on("connection",(socket) => {
console.log(`user connected on ${socket.id}`);
socket.on("join_room",(data)=>{
    socket.join(data)
    console.log("roomn1")
}) 
socket.on("join_room1",(data)=>{
    socket.join(data)
    console.log("roomn2")
}) 
socket.on("disconnect", () => {
    console.log(`disconnect ${socket.id}`);
});
}) 

 

//Normal User Routes
const NormalUserRoutes = require('./Routes/NormalUserRoutes')
app.use('/api',NormalUserRoutes) 

//Counter Routes
const CounterRoutes = require('./Routes/CounterRoutes')
app.use('/api',CounterRoutes)


//CounterUser Routes
const CounterUserRoutes = require('./Routes/CounterUserRoutes')
app.use('/api',CounterUserRoutes)

app.all('*',(req : Request ,res : Response)=>{
    res.status(404).send('not Found')
})

server.listen(process.env.SERVER_PORT,()=>{
    console.log(`SERVER RUN ON ${process.env.SERVER_PORT}`);
})