import { NormalUser } from "../Entities/NormalUser";
import { Response,Request } from "express";
import { Issues } from "../Entities/Issues";
import { Counter } from "../Entities/Counter";
import bcrypt from 'bcrypt'
import { Notification } from "../Entities/Notification";
import { Not } from "typeorm";
import { Solution } from "../Entities/Solution";

const saltRounds : number  = 10

const jwt = require('../jwt/index')
const socket = require('../index')

//Register User Function
const RegisterNormalUser = async (req : Request, res : Response ) =>{

const username : string = req.body.username
const pass : string = req.body.password

//validation
if(!username) return res.status(500).send('username is Required')
if(!pass) return res.status(500).send('password is Required')

//password encrypt
const salt = bcrypt.genSaltSync(saltRounds);
const password = bcrypt.hashSync(pass, salt); 
 

try {
    const user = NormalUser.create({username,password})
    await user.save()
    return res.status(201).send("successfully created")

} catch (error) {
    console.log(error);
    res.status(500).send('Something went to wrong try again!')   
}
}



//login user Function
const LoginNormalUser = async (req : Request , res : Response) => {

    const username : string = req.body.username
    const password : string = req.body.password

    //validation
    if(!username) return res.status(500).send('username is required')
    if(!password) return res.status(500).send('password is required')

     try {
        const user = await NormalUser.findOneOrFail({where:{username:username}})
        if(bcrypt.compareSync(password,user.password))
        {
           //generate jwt Token
           const accessToken : string = jwt.generateAccessToken(user)
           res.status(200).send({accessToken:accessToken,name:user.username})
        }else{ 
            return  res.status(500).send("you entered wrong password")
        }
    
     } catch (error) {
        return  res.status(500).send("user not found!")
     }


}

//Add issues Function
const AddIssues = async (req : Request, res : Response) => {

    const name   : string = req.body.name
    const issue   : string = req.body.issue
    const email   : string = req.body.email
    const phoneNo : string = req.body.phoneno
    const normaluserId: number = req.body.data.data.id

    //validation
    if(!name) return res.status(500).send('name is required')
    if(!issue) return res.status(500).send('issue is required')
    if(!email) return res.status(500).send('email is required')
    if(!phoneNo) return res.status(500).send('Phone Number is required')
    if(!normaluserId) return res.status(500).send('user id  is required')
    
    let counter;
    try {
        counter = await Counter.findOneOrFail({where:{status:true},order:{lasteno:'ASC'}})
   } catch (error) {
    return  res.status(500).send("counter not available")
   }

    try {
         let date : Date 
         const date1 : Date = new Date()
         const lasteIssue = await Issues.findOne({where:{counter:{id:counter.id}},order:{id:'DESC'}})

         if(lasteIssue){
            date=lasteIssue.createAt
         }else{
            date=counter.createAt
         }

         const normaluser = await  NormalUser.findOneOrFail({where:{id:normaluserId,status:true}})
      
         if(date.getDate() === date1.getDate()){
            var token : number = counter.lasteno + 1
            counter.nextno === null ? counter.nextno = token : null
         }else{
            var token : number = 1
            counter.currentno = 0
            counter.nextno = token       
         }
        

        const status : string = 'PENDING'
      
        //insert issue into table
        const issues = await Issues.create({ name,token, status, phoneNo, issue, email, counter , normaluser})
        await issues.save()

        //update laste token of counter
        counter.lasteno = token
        await counter.save()

        //update user status
        normaluser.status = false
        await normaluser.save()
        socket.io.to(counter.id).emit("reference_issue","Refresh_issue");
        return res.status(201).send({msg:"successfully issue created",id:counter.id})   

    } catch (error) {
        res.status(500).send('Something went to wrong try again!')   
    }
}

 //Cancel Issue 
 const CancelIssue = async (req : Request , res : Response) =>{
    const normaluserId: number = req.body.data.data.id
    const id : number = parseInt(req.params.id)

    try {
        const issue = await Issues.findOneOrFail({where:{id:id},relations:{counter:true}})
        const normaluser = await NormalUser.findOneOrFail({where:{id:normaluserId}})
        const counter = await Counter.findOneOrFail({where:{id:issue.counter.id}})

        const issues = await Issues.find({relations:{normaluser:true},order:{token:'ASC'},where:{counter:{id:counter.id},status:Not('COMPLETE')}})

        if(issues.length <= 1){
            counter.nextno = null
            socket.io.to(issue.counter.id).emit("cancel_counter",{next:null});
        }
        else{
            counter.nextno=issues[1].token
            const text : string = "Your the next number in the requested queue. Please be Prepare"
            const user = await NormalUser.findOneOrFail({where:{id:issues[1].normaluser.id}})
            const notification = await Notification.create({notification:text,normaluser:user})
            notification.save()
            socket.io.to(user.username).emit("notification","Refresh_notification");
            socket.io.to(issue.counter.id).emit("cancel_counter",{next:issues[1].token});
        }
 
        //delete the issue
        issue.remove()
        issue.save()
        counter.save()

        //update user status
        normaluser.status = true
        normaluser.save()
        socket.io.to(issue.counter.id).emit("reference_issue","Refresh_issue");
        return res.status(200).send('Successfully Deleted')
    } catch (error) {
        return res.status(401).send('Issue not found!')   
    }
 }

//View Notification Function
const ViewNotification = async (req: Request , res : Response) =>{
    const id : number = req.body.data.data.id

    try {
        const notification = await Notification.find({where:{normaluser:{id:id}},order:{id:"DESC"}})
        return res.status(200).send(notification)
    } catch (error) {
        return res.status(500).send("notification not found")
    }
}

//View Solution Function
const ViewSolution = async (req: Request , res : Response) =>{
    const id : number = req.body.data.data.id

    try {
        const solution = await Solution.find({where:{normaluser:{id:id}},order:{id:"DESC"}})
        return res.status(200).send(solution)
    } catch (error) {
        return res.status(500).send('solution not found')
    }
}
const IssueCheck = async (req:Request ,res:Response)=>{
    const id : number = req.body.data.data.id
    try {
        const user = await NormalUser.findAndCount({where:{id:id,status:false}})
        if(user[1] === 1){
            res.status(200).send(true)
        }else{
            res.status(200).send(false)
        }
           
    } catch (error) {
        return res.status(500).send('something went to wrong')
    }
}

const CounterDetails = async (req: Request, res : Response) =>{
    const id : number = req.body.data.data.id
    try {
        const counter = await Issues.findOne({relations:{normaluser:true,counter:true},where:{normaluser:{id:id},status:Not('COMPLETE')}})
        if(counter){
            return res.status(200).send({current:counter.counter.currentno,next:counter.counter.nextno,issueid:counter.id,id:counter.counter.id,token:counter.token})
        }
           
    } catch (error) {
        return res.status(401).send('not found')
}
}
module.exports = {
    RegisterNormalUser,
    LoginNormalUser,
    AddIssues,
    ViewNotification,
    CancelIssue,
    IssueCheck,
    CounterDetails,
    ViewSolution
}