import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { CounterUser } from "./CounterUser";
import { Issues } from "./Issues";


@Entity('counter')
export class Counter extends BaseEntity {
    @PrimaryColumn({
        unique:true
    })
    id : string

    @Column({
        nullable:true,
        default:0

    })
    currentno : number

    @Column({
        nullable:true,
        default:1
    })

    nextno : number

    @Column({
        nullable:true,
        default:0
    })
    
    lasteno : number

    @Column({
        default:false
    })
    status : boolean

    @CreateDateColumn()
    createAt : Date

    @UpdateDateColumn()
    updateAt : Date

    @ManyToOne(()=>CounterUser)
    @JoinColumn()
    counterUser : CounterUser
    
    @OneToMany(() => Issues, (issues) => issues.counter)
    @JoinColumn()
    issues : Issues[]
}
