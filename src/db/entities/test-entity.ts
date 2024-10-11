import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('test')
export class TestEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Column({type: 'varchar', length: 200})
    // nameTest: string;

    // @Column({type: 'varchar', length: 100})
    // email: string;

    // @Column({type: 'varchar', length: 100})
    // password: string;

    // @Column({type: 'varchar', length: 10})
    // mobile: string;

    // @Column({type: 'varchar', length: 10})
    // gender: string;

    // @Column({type: 'timestamp'})
    // date_of_birth: Date;
}