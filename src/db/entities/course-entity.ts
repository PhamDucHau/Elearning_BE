import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('course')
export class CourseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    course_name: string;

    @Column()
    description: string;
}   