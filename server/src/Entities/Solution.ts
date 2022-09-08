import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NormalUser } from "./NormalUser";

@Entity('solution')

export class Solution extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    solution : string

    @CreateDateColumn()
    createAt : Date

    @ManyToOne(()=>NormalUser)
    @JoinColumn()
    normaluser : NormalUser

}
