import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    mobile: string;

    @Column()
    gender: string;

    @Column()
    role_id: number;

    @Column({type: 'timestamp'})
    date_of_birth: Date;
}   