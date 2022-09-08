import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Counter } from "./Counter";
import { NormalUser } from "./NormalUser";

@Entity('issues')
export class Issues extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name : string
    
    @Column()
    token : number

    @Column()
    status : string

    @Column()
    issue : string

    @Column()
    email : string

    @Column()
    phoneNo : string

    @CreateDateColumn()
    createAt : Date

    @UpdateDateColumn()
    updateAt : Date

    @ManyToOne(()=>NormalUser)
    @JoinColumn()
    normaluser : NormalUser

    @ManyToOne(()=>Counter)
    @JoinColumn()
    counter : Counter
}