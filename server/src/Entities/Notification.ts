import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NormalUser } from "./NormalUser";

@Entity('notification')

export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    notification : string

    @CreateDateColumn()
    createAt : Date

    @ManyToOne(()=>NormalUser)
    @JoinColumn()
    normaluser : NormalUser

}
