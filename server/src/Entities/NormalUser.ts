import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Issues } from "./Issues";
import { Notification } from "./Notification";
import { Solution } from "./Solution";


@Entity('normaluser')
export class NormalUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number
    
    @Column({
        unique:true
    })
    username : string

    @Column()
    password : string

    @Column({
        default:true
    })
    status : boolean

    @CreateDateColumn()
    createAt : Date

    @UpdateDateColumn()
    updateAt : Date
    
    @OneToMany(() => Notification, (notification) => notification.normaluser)
    notification : Notification[]
    
    @OneToMany(() => Solution, (solution) => solution.normaluser)
    solution : Solution[]

    @OneToMany(() => Issues, (issues) => issues.normaluser)
    issues : Issues[] 

}