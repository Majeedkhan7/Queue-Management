import { Counter } from "../Entities/Counter";
import { Request , Response } from "express";

const CreateCounter = async ( req : Request , res : Response) =>{
    try {
        
        const counter = await Counter.findAndCount({order:{createAt:'DESC'}})
        if(counter[1]=== 0)
        {
        const id : string = 'C001'
        const newCounter = await Counter.create({id})
        await newCounter.save()
        return res.status(201).send("successfully counter created")

        }
        //laste counter id
        const lastID : string = counter[0][0].id
        //increase counter id
        let result : number = parseInt(lastID.substring(1))+1;
        //convert to string
        let output : string = result.toString()

        const id : string = 'C'+output.padStart(3,'0')
        //create counter
        const newCounter = await Counter.create({id})
        await newCounter.save()
        return res.status(201).send("successfully counter created")
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went to wrong try again')
    } 
  
}

module.exports ={
    CreateCounter
}