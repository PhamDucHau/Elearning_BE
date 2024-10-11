import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('role')
export class RoleEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    descriptions: string;
}   