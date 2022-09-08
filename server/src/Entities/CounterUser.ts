import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Counter } from "./Counter";


@Entity('counterUser')
export class CounterUser extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        unique:true
    })
    username : string

    @Column()
    password : string

    @CreateDateColumn()
    createAt : Date

    @UpdateDateColumn()
    updateAt : Date

    @OneToMany(() => Counter, (counter) => counter.counterUser)
    counter: Counter[]
}