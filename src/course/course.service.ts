import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/db/entities/course-entity';
import { UserEntity } from 'src/db/entities/user-entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class CourseService {
    constructor(
        @InjectConnection() private readonly pg: Connection,
    ) { }

    async findAllRoleByUser(req) {
        
        const queryListRolesByUserId = `SELECT cur."role_id" 
                                            FROM elearning."connect_user_role" AS cur
                                            JOIN elearning."user" ON cur."user_id" = elearning."user"."id" 
                                            JOIN elearning."role" ON cur."role_id" = elearning."role"."id"
                                            WHERE cur."user_id" = ${req.userId}`
        return await this.pg.query(queryListRolesByUserId);
        
    }

    async updateCourse(req, dataUpdateCourse) {
        try {
            let queryText = `
                        UPDATE elearning."course" 
                        SET 
                        title = $2,
                        description = $3,
                        time_study = $4,
                        image = $5,
                        status = $6
                        WHERE id= $1 RETURNING *
                    `;
            let values = [
                dataUpdateCourse.id,
                        dataUpdateCourse.title,                        
                        dataUpdateCourse.description,       
                        dataUpdateCourse.time_study,
                        dataUpdateCourse.image,
                        dataUpdateCourse.status 
            ]
            //lấy hết roles mà userId có
            const hasRoleCanUpdateCourse = await this.findAllRoleByUser(req)
            //case role_id bằng 1 => là admin
            if (hasRoleCanUpdateCourse.some(role => role.role_id == 1 )) {
                let data = await this.pg.query(queryText, values);
                return {
                    course: dataUpdateCourse.id,
                    status: 'success',
                    message: 'Course update successfully',
                    data:data
                    }
            }
            //case role_id bằng 2 => là teacher sở hữu khoá học
            if(hasRoleCanUpdateCourse.some(role => role.role_id == 2 )){
                
                const res = await this.pg.query(`SELECT course_id FROM elearning.connect_user_course WHERE user_id = ${req.userId}`);
                const hasCourseCanUpdate = res.some(course => course.course_id == dataUpdateCourse.id)
                //case teacher sở hữu khoá học
                if(hasCourseCanUpdate){
                    let data = await this.pg.query(queryText, values);
                return {
                    course: dataUpdateCourse.id,
                    status: 'success',
                    message: 'Course update successfully',
                    data:data
                    }
                }else{
                     //case teacher không sở hữu khoá học
                    throw new NotFoundException('You do not have permission to update this course')
                }
            }
            
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }
    async createCourse(req, dataCreateCourse) {
        try {
            const hasRoleCanCreateCourse = await this.findAllRoleByUser(req)
            if (hasRoleCanCreateCourse.some(role => role.role_id == 1 || role.role_id == 2)) {
                const queryTextCreateCourse = `
                INSERT INTO elearning."course" (
                    title,
                    description,              
                    time_study,
                    image,
                    status             
                   
                ) VALUES (                
                    $1,
                    $2,
                    $3,
                    $4,
                    $5         
                  
                ) RETURNING *
                `;
                const valuesCreateCourse = [
                    dataCreateCourse.title,
                    dataCreateCourse.description,
                    dataCreateCourse.time_study,
                    dataCreateCourse.image,
                    dataCreateCourse.status,
                ];
                
                const res = await this.pg.query(queryTextCreateCourse, valuesCreateCourse);
                let queryTextLinkUserWithCourse = `
                INSERT INTO elearning."connect_user_course" (
                    user_id,
                    course_id
                ) VALUES (                
                    $1,
                    $2
                ) RETURNING *
                `;
                const valuesLinkUserWithCourse = [
                    req.userId,
                    res[0].id
                ];
                await this.pg.query(queryTextLinkUserWithCourse, valuesLinkUserWithCourse);

                return {
                    status: 'success',
                    message: 'Course created successfully',
                    data: res

                }
            } else {
                throw new Error('your rights cannot perform this action')
            }


        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }

    }
    async getAllCourse(req) {
        try {
            const hasRoleCanViewALlCourse = await this.findAllRoleByUser(req)
            
            if (hasRoleCanViewALlCourse.some(role => role.role_id == 1)) {
                const res = await this.pg.query(`SELECT * FROM elearning."course"`);
                return {
                    message: 'Get Data Successfully',
                    data: res,
                }
            } else {
                const queryCoursesByUserId = `
                                        SELECT elearning."course"."title", elearning."course"."description"
                                        FROM elearning."connect_user_course" AS cuc
                                        JOIN elearning."user" ON cuc."user_id" = elearning."user"."id" 
                                        JOIN elearning."course" ON cuc."course_id" = elearning."course"."id"
                                        WHERE elearning."user"."id" = ${req.userId}
                                        `;
                const res = await this.pg.query(queryCoursesByUserId);
                return {
                    message: 'Get Data Successfully',
                    data: res,
                }
            }




        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }
}
