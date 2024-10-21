import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class CourseContentDetailService {
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
        const url = req.url.split('?')[0];

        console.log('url',url)

        const res = uniqueArr.some(permission => permission == url)
        return res
    }

    async deleteCourseContentDetail(req,body){
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if(allPermissionByUserId){

                const queryDeleteCourseContentDetail = `DELETE FROM elearning."course_content_detail" WHERE "id" = $1 RETURNING *;`
                const values = [body.id];
                const res = await this.pg.query(queryDeleteCourseContentDetail, values);
                return {
                    message: 'Delete Data Successfully',
                    data: res,
                }

            }else{
                throw new Error('your rights cannot perform this action')
            }
            
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
            
        }

    }

    async updateCourseContentDetail(req,body){
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)            
            if(allPermissionByUserId){                       

                const queryUpdateCourseContentDetail = `
                UPDATE elearning."course_content_detail" SET "value" = $1, "type_id" = $2, "bold" = $3 WHERE "id" = $4 RETURNING *;
                `
                const values = [body.value, body.type_id, body.bold, body.id];
                const res = await this.pg.query(queryUpdateCourseContentDetail, values);
                return {
                    message: 'Create Data Successfully',
                    data: res,
                }
            }else{
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    async createCourseContentDetail(req,body){
       
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if(allPermissionByUserId){               

                console.log('body.value',body.value)

                const queryCreateCourseContentDetail = `INSERT INTO elearning."course_content_detail" ("value", "type_id", "course_detail_id", "bold") 
                VALUES ($1, $2, $3, $4) RETURNING *;`
                const values = [body.value, body.type_id, body.course_detail_id, body.bold];
                const res = await this.pg.query(queryCreateCourseContentDetail, values);
                return {
                    message: 'Create Data Successfully',
                    data: res,
                }
            }else{
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    async getAllCourseContentDetail(req) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
           
            if (allPermissionByUserId) {

                const { course_detail_id } = req.query;

                    const queryCoursesByUserId = `
                    SELECT usercourse.id, usercourse.bold, usercourse.value, usercourse."type_id", elearning."type".name_type
                    FROM elearning."course_content_detail" AS usercourse
                    JOIN elearning."type" ON usercourse."type_id" = elearning."type"."id" 
                    WHERE course_detail_id = ${course_detail_id}
                    ORDER BY usercourse.id ASC;                                     
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
    
}
