import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {  Connection } from 'typeorm';
import { UpdateCourseDetailDto } from './dto/updateCourseDetail.dto';

@Injectable()
export class CourseDetailService {
    UpdateCourseDetailDto(req: any, body: UpdateCourseDetailDto, imagePath: string) {
        throw new Error('Method not implemented.');
    }

    constructor(@InjectConnection() private readonly pg: Connection,) {}

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
        const url = req.url.split('?')[0];
        console.log('url',url)

        const res = uniqueArr.some(permission => permission == url)
        return res
    }

    async updateCourseDetail(req, body, image){
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            console.log('allPermissionByUserId',allPermissionByUserId)
            if (allPermissionByUserId) {
                
                const { id, title, description, time_study } = body;
                const query = `
                UPDATE elearning."course_detail" SET title = '${title}', description = '${description}', time_study = '${time_study}', image = '${image}' WHERE id = ${id}
                `;
                const res = await this.pg.query(query);
                return {
                    status: 'success',  
                    message: 'Course updated successfully',
                    data: res
                }
            } else {
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    async createCourseDetail(req, body, image) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            
            if (allPermissionByUserId) {
                
                const { course_id, title, description, time_study } = body;
                const query = `
                INSERT INTO elearning."course_detail" (course_id, title, description, time_study, image, deleted) 
                VALUES (${course_id}, '${title}', '${description}', '${time_study}', '${image}', false)
                `;
                const res = await this.pg.query(query);
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

    async getAllCourseDetail(req) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            console.log('allPermissionByUserId',allPermissionByUserId)
            if (allPermissionByUserId) {
                const allRoleByUserId = await this.findAllRoleByUser(req)
                console.log('allRoleByUserId',allRoleByUserId)
                const { course_id } = req.query;
                // const isAdmin = await allRoleByUserId.some(role => role.role_id == 1)
                // console.log('isAdmin',isAdmin)
                    const queryCoursesByUserId = `
                    SELECT *
                    FROM elearning."course_detail"
                    WHERE course_id = ${course_id} AND deleted = false
                    ORDER BY id ASC;                    
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

    async deleteCourseDetail(req, body){
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if (allPermissionByUserId) {
                const { id } = body;
                const query = `UPDATE elearning."course_detail" SET deleted = true WHERE id = ${id}`;
                const res = await this.pg.query(query);
                return {
                    status: 'success',
                    message: 'Course deleted successfully',
                    data: res
                }
            } else {    
                throw new Error('your rights cannot perform this action')
            }       
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }           
}
