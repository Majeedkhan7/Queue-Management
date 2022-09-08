import { CounterUser } from "../Entities/CounterUser";
import {Response,Request} from 'express'
import { Counter } from "../Entities/Counter";
import bcrypt from 'bcrypt'
import { Issues } from "../Entities/Issues";
import { Notification } from "../Entities/Notification";
import { NormalUser } from "../Entities/NormalUser";
import { Not } from "typeorm";
import { Solution } from "../Entities/Solution";



const saltRounds  = 10
// jwt
const jwt = require('../jwt/index')

const socket = require('../index')



//create user function
const CreateUser = async (req : Request, res : Response) =>{

    const username : string = req.body.username
    const pass : string = req.body.password

    //validation
    if(!username) return res.status(500).send('username is required')
    if(!pass) return res.status(500).send('password is required')

    //password encrypt
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(pass, salt);

    try {
        const user = await CounterUser.create({username,password })
        await user.save()
        return res.status(201).send("successfully counter user created")
    } catch (error) {
        res.status(500).send('Something went to wrong try again')
    }

}


//login user function
const LoginUser = async (req : Request, res : Response) =>{
   
    const username : string = req.body.username
    const password : string = req.body.password

    //validation
    if(!username) return res.status(500).send('username is required')
    if(!password) return res.status(500).send('password is required')

    try {
        const user = await CounterUser.findOneOrFail({where:{username:username}})
        if(bcrypt.compareSync(password,user.password))
        {
           //generate jwt Token
            const accessToken : string = jwt.generateAccessToken(user)

            const counteruser= await Counter.find({where:{counterUser:{id:user.id},status:true}})
            if(counteruser.length === 1){
                return  res.status(200).send({accessToken:accessToken,counterid:counteruser[0].id,user:user.username})
            }
            let counter : Counter
            try {
             counter  = await Counter.findOneOrFail({where:{status:false}})
        
            } catch (error) {
              return  res.status(500).send("counters are busy now")
            }
            counter.counterUser = user
            counter.status = true
            counter.save()
            return  res.status(200).send({accessToken:accessToken,counterid:counter.id,user:user.username})
        }else{ 
            return  res.status(500).send("you entered wrong password")
        }
    
     } catch (error) {
        return  res.status(500).send("user not found")
     }

}


//view issues function
const ViewIssues = async (req : Request , res : Response) =>{
    const id : number = req.body.data.data.id
    try {
        const counter = await Counter.findOneOrFail({where:{counterUser:{id:id}}})
        const issues = await Issues.find({where:{counter:{id:counter.id},status:Not('COMPLETE')},order:{token:'ASC'},relations:{normaluser:true}})
        return  res.status(200).send(issues)
    } catch (error) {
        return res.status(500).send('Something went to wrong try again')
    }
}

//View Single Issue
const ViewSingleIssue =  async (req : Request ,res : Response) =>{
    const id : number = parseInt(req.params.id)
    try {
        const issue = await Issues.findOneOrFail({where:{id},relations:{normaluser:true}})
        return res.status(200).send(issue)
    } catch (error) {
        return res.status(500).send('Issue not found')
    }
}

//Call Token
const CallToken = async (req: Request, res : Response)=>{
    const id : number = req.body.id
    const userId : number = req.body.data.data.id
    try {
        const issue = await Issues.findOneOrFail({where:{id:id,status:'PENDING'}})
        const counter = await Counter.findOneOrFail({where:{counterUser:{id:userId}}})
        const issues = await Issues.find({where:{counter:{id:counter.id},status:Not('COMPLETE')},order:{token:'ASC'}, relations: {counter:true,normaluser:true}})
        if(issues.length > 1)
        {
            socket.io.to(counter.id).emit("reference_issue",{});
       
            const text : string = "Your the next number in the requested queue. Please be Prepare"
            const user = await NormalUser.findOneOrFail({where:{id:issues[1].normaluser.id}})
            const notification = await Notification.create({notification:text,normaluser:user})
            counter.currentno=issue.token
            counter.nextno=issues[1].token
            socket.io.to(user.username).emit("notification",{});
            counter.save()
            socket.io.to(counter.id).emit("reference_counter",{next:issues[1].token,current:issue.token});
            notification.save()
        }else{
            socket.io.to(counter.id).emit("reference_issue",{ });
            socket.io.to(counter.id).emit("reference_counter",{next:null,current:issue.token});
            counter.currentno=issue.token
            counter.nextno=null
            counter.save()
        }
        issue.status ='ONGOING'
        issue.save()
        return res.status(200).send("Caling success")
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went to wrong try again')
    }
}

const ReCall = async (req: Request, res : Response)=>{
    const id : number = req.body.id
    const userId : number = req.body.data.data.id
    try {
        const issue = await Issues.findOneOrFail({where:{id:id,status:'ONGOING'},relations:{normaluser:true}})
        const counter = await Counter.findOneOrFail({where:{counterUser:{id:userId}}})
    
        const text : string = "Your  number in the request queue. Please be come."
        const user = await NormalUser.findOneOrFail({where:{id:issue.normaluser.id}})
        const notification = await Notification.create({notification:text,normaluser:user})
        socket.io.to(user.username).emit("notification","Refresh_notification");
        notification.save()
        return res.status(200).send("ReCaling success")
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went to wrong try again')
    }
}





//done Issue Function
const DoneIssue = async (req : Request , res : Response) =>{
    const id : number =parseInt(req.params.id)
    const text:string=req.body.solution
    
    try {
        const issue = await Issues.findOneOrFail({where:{id,status:'ONGOING'},relations:{counter:true,normaluser:true}})
        const user = await NormalUser.findOneOrFail({where:{id:issue.normaluser.id}})
        issue.status='COMPLETE'
        issue.save()
        user.status = true
        const solution = await Solution.create({solution:text,normaluser:user})
        solution.save()
        user.save()
        socket.io.to(issue.counter.id).emit("reference_issue","Refresh_issue");
        socket.io.to(issue.counter.id).emit("reference_counter");
        socket.io.to(user.username).emit("solution",{ });
        return res.status(200).send("issue completed")
    } catch (error) {

        return res.status(401).send("Issue not found")
    }
}


//Done And CallNextToken
const DoneAndCallIssue = async (req: Request , res : Response)=>{
    const id : number = parseInt(req.params.id)
    const userId : number = req.body.data.data.id
    const solutionText:string=req.body.solution

    try {
        const issue = await Issues.findOneOrFail({where:{id,status:'ONGOING'},relations:{counter:true,normaluser:true}})
        issue.status= 'COMPLETE'
        issue.save()
        const user = await NormalUser.findOneOrFail({where:{id:issue.normaluser.id}})
        user.status = true
        user.save()
        const solution = await Solution.create({solution:solutionText,normaluser:user})
        solution.save()
        const counter = await Counter.findOneOrFail({where:{counterUser:{id:userId}}})
        const issues = await Issues.find({where:{counter:{id:counter.id},status:'PENDING'},order:{token:'ASC'},relations:{normaluser:true}})

        if(issues.length === 0){
            socket.io.to(counter.id).emit("reference_issue","Refresh_issue");
            socket.io.to(counter.id).emit("reference_counter");
            counter.currentno=issue.token
            counter.nextno=null
            
        }
        if(issues.length === 1){
            socket.io.to(counter.id).emit("reference_issue","Refresh_issue");
            socket.io.to(counter.id).emit("reference_counter",{next:null,current:issues[0].token});
            issues[0].status = 'ONGOING'
            issues[0].save()
            counter.currentno=issues[0].token
            counter.nextno=null
        }
        if(issues.length > 1)
        {
            socket.io.to(counter.id).emit("reference_issue","Refresh_issue");
            socket.io.to(counter.id).emit("reference_counter",{next:issues[1].token,current:issues[0].token});
            issues[0].status = 'ONGOING'
            issues[0].save()
            const text : string = "Your the next number in the requested queue. Please be Prepare"
            const user = await NormalUser.findOneOrFail({where:{id:issues[1].normaluser.id}})
            socket.io.to(user.username).emit("notification","Refresh_notification");
            const notification = await Notification.create({notification:text,normaluser:user})
            counter.currentno=issues[0].token
            counter.nextno=issues[1].token
            notification.save()
        }
        socket.io.to(user.username).emit("solution",solution);
        counter.save()
        return res.status(200).send("successfully issue completed")

    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went to wrong try again')
    }
}


//logout function
const LogOutCouter = async (req : Request , res : Response) =>{

    const id : number = req.body.data.data.id 
    try {
        const counterUser   = await CounterUser.findOneOrFail({where:{id}})
        const counter = await Counter.findOneOrFail({where:{counterUser:{id:counterUser.id}}})
        counter.counterUser = null
        counter.status = false
        await counter.save()
        res.status(200).send("successfully logged out")        
    } catch (error) {
        res.status(500).send('Something went to wrong try again')
    }
} 



module.exports = {
    CreateUser,
    LoginUser,
    CallToken,
    LogOutCouter,
    ViewIssues,
    ViewSingleIssue,
    DoneIssue,
    DoneAndCallIssue,
    ReCall
}