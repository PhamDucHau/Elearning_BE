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

    async getAllPermissionByUserId(req) {
        const allRoleByUserId = await this.findAllRoleByUser(req)

        let arr = [];
        for (let item of allRoleByUserId) {

            const query = `SELECT * 
                        FROM elearning."connect_role_permission" AS urp
                        JOIN elearning."role" ON urp."role_id" = elearning."role"."id" 
                        JOIN elearning."permission" ON urp."permission_id" = elearning."permission"."id"
                        WHERE elearning."role"."id" = ${item.role_id};`
            const res = await this.pg.query(query);
            for (let item of res) {
                arr.push(item.name_permission)
            }


        }
        const uniqueArr = await [...new Set(arr)];
        const res = uniqueArr.some(permission => permission == req.url)
        return res
    }

    async updateCourse(req, dataUpdateCourse) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if (allPermissionByUserId) {
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
                const res = await this.pg.query(`SELECT course_id FROM elearning.connect_user_course WHERE user_id = ${req.userId}`);
                const hasCourseCanUpdate = await res.some(course => course.course_id == dataUpdateCourse.id)
                
                if (hasCourseCanUpdate) {
                    let data = await this.pg.query(queryText, values);
                    return {
                        course: dataUpdateCourse.id,
                        status: 'success',
                        message: 'Course update successfully',
                        data: data
                    }
                } else {
                    //case teacher không sở hữu khoá học
                    throw new NotFoundException('You do not have permission to update this course')
                }

            } else {
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }
    async createCourse(req, dataCreateCourse,image) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if (allPermissionByUserId) {
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
                    image || dataCreateCourse.image,
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
                if (req.userId != 1) {
                    const valuesLinkAdminWithCourse = [
                        1,
                        res[0].id
                    ];
                    await this.pg.query(queryTextLinkUserWithCourse, valuesLinkAdminWithCourse);
                }

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

            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if (allPermissionByUserId) {
                const { page = 1, limit = 10, search = '' } = req.query;
                const offset = (page - 1) * limit;
                const queryCoursesByUserId = `
                                            SELECT elearning."course"."title", elearning."course"."description"
                                            FROM elearning."connect_user_course" AS cuc
                                            JOIN elearning."user" ON cuc."user_id" = elearning."user"."id" 
                                            JOIN elearning."course" ON cuc."course_id" = elearning."course"."id"
                                            WHERE elearning."user"."id" = ${req.userId}
                                            AND (elearning."course"."title" ILIKE '%${search}%' OR elearning."course"."description" ILIKE '%${search}%')
                                            LIMIT ${limit} OFFSET ${offset}
                                            `;
                const res = await this.pg.query(queryCoursesByUserId);
                return {
                    message: 'Get Data Successfully',
                    data: res,

                }
            } else {
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    async updateImage(req, image){
        console.log('image', image)
    }
}