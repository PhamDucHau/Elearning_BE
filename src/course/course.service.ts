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
        const url = req.url.split('?')[0];
        console.log('uniqueArr', uniqueArr)
        console.log('url', url)

        const res = uniqueArr.some(permission => permission == url)
        return res
    }

    async getCourseProminent(req){
        const allPermissionByUserId = await this.getAllPermissionByUserId(req)
        if(allPermissionByUserId){
            const query = `SELECT * FROM elearning."course" WHERE deleted = false ORDER BY registered DESC `
            const res = await this.pg.query(query);
            return {
                message: 'Get Data Successfully',
                data: res
            };
        }else{
            throw new Error('your rights cannot perform this action')
        }
    }


    async removeUserFromCourse(req,body){
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if(allPermissionByUserId){
                const allRoleByUserId = await this.findAllRoleByUser(req)
                const isAdmin = await allRoleByUserId.some(role => role.role_id == 1)
                const isTeacher = await allRoleByUserId.some(role => role.role_id == 2)
                
                
                const { course_id, user_id } = body;
                const reqUserId = {
                    userId: user_id
                }
                const findRoleUserId = await this.findAllRoleByUser(reqUserId)
                const isAdminUserId = await findRoleUserId.some(role => role.role_id == 1)
                const isTeacherUserId = await findRoleUserId.some(role => role.role_id == 2)
                if(isAdmin){
                    if(isAdminUserId){
                        throw new Error('You do not have permission to remove this user from the course')
                    }
                   
                    const query = `DELETE FROM elearning."connect_user_course" WHERE user_id = ${user_id} AND course_id = ${course_id}`
                    const res = await this.pg.query(query);
                    if(res){
                        const countUserByCourseId = await this.pg.query(`SELECT COUNT(*) FROM elearning."connect_user_course" WHERE course_id = ${course_id}`)
                        const registered = countUserByCourseId[0].count
                        this.pg.query(`UPDATE elearning."course" SET registered = ${registered} WHERE id = ${course_id}`)
                    }
                    
                    return {
                        message: 'Remove User From Course Successfully',
                        data: res
                    }
                }
                if(isTeacher){
                    if(isAdminUserId){
                        throw new Error('You do not have permission to remove this user from the course')
                    }
                    if(isTeacherUserId){
                        throw new Error('You do not have permission to remove this user from the course')
                    }
                    const query = `DELETE FROM elearning."connect_user_course" WHERE user_id = ${user_id} AND course_id = ${course_id}`
                    const res = await this.pg.query(query);
                    if(res){
                        const countUserByCourseId = await this.pg.query(`SELECT COUNT(*) FROM elearning."connect_user_course" WHERE course_id = ${course_id}`)
                        const registered = countUserByCourseId[0].count
                        this.pg.query(`UPDATE elearning."course" SET registered = ${registered} WHERE id = ${course_id}`)
                    }
                    
                    return {
                        message: 'Remove User From Course Successfully',
                        data: res
                    }
                }
                
            }else{
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
            
        }
        
    }




    async addUserToCourse(req,body){
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if(allPermissionByUserId){
                const allRoleByUserId = await this.findAllRoleByUser(req)
                const isAdmin = await allRoleByUserId.some(role => role.role_id == 1)
                const isTeacher = await allRoleByUserId.some(role => role.role_id == 2)
                const { course_id, user_id } = body;
                const reqUserId = {
                    userId: user_id
                }
                const findRoleUserId = await this.findAllRoleByUser(reqUserId)
                const isAdminUserId = await findRoleUserId.some(role => role.role_id == 1)
                const isTeacherUserId = await findRoleUserId.some(role => role.role_id == 2)
                
                if(isAdmin){
                    if(isAdminUserId){
                        throw new Error('You do not have permission to add this user to the course')
                    }
                    
                    const query = `INSERT INTO elearning."connect_user_course" (user_id, course_id) VALUES (${user_id}, ${course_id})`
                    const res = await this.pg.query(query);
                    if(res){
                        const countUserByCourseId = await this.pg.query(`SELECT COUNT(*) FROM elearning."connect_user_course" WHERE course_id = ${course_id}`)
                        const registered = countUserByCourseId[0].count
                        this.pg.query(`UPDATE elearning."course" SET registered = ${registered} WHERE id = ${course_id}`)
                    }
                    
                    return {
                        message: 'Add User To Course Successfully',
                        data: res
                    }
                }
                if(isTeacher){
                    if(isAdminUserId){
                        throw new Error('You do not have permission to add this user to the course')
                    }
                    if(isTeacherUserId){
                        throw new Error('You do not have permission to add this user to the course')
                    }
                    const query = `INSERT INTO elearning."connect_user_course" (user_id, course_id) VALUES (${user_id}, ${course_id})`
                    const res = await this.pg.query(query);
                    if(res){
                        const countUserByCourseId = await this.pg.query(`SELECT COUNT(*) FROM elearning."connect_user_course" WHERE course_id = ${course_id}`)
                        const registered = countUserByCourseId[0].count
                        this.pg.query(`UPDATE elearning."course" SET registered = ${registered} WHERE id = ${course_id}`)
                    }
                    
                    return {
                        message: 'Add User To Course Successfully',
                        data: res
                    }
                }
            }else{
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
            
        }
        
    }


    async getUserNotActiveCourse(req){
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if(allPermissionByUserId){
                const { course_id } = req.query;
                const queryListUserByCourseId = `SELECT u.id FROM elearning."connect_user_course" AS usercourse
                                JOIN elearning."user" AS u ON usercourse."user_id" = u."id" 
                                JOIN elearning."course" ON usercourse."course_id" = elearning."course"."id"
                                WHERE course_id = ${course_id}`
                const resListUserByCourseId = await this.pg.query(queryListUserByCourseId);
               
                const idsToExclude = resListUserByCourseId.map(item => item.id);
                const query = idsToExclude.length > 0 
    ? `SELECT u.id, u.name_user, u.email, u.mobie, u.gender FROM elearning."user" AS u
       WHERE u.id NOT IN (${idsToExclude.join(', ')})`
    : `SELECT u.id, u.name_user, u.email, u.mobie, u.gender FROM elearning."user" AS u`;
                const resListUserNotActiveCourse = await this.pg.query(query);
                

                return {
                    message: 'Get Data Successfully',
                    data: resListUserNotActiveCourse
                };
            }else{
                throw new Error('your rights cannot perform this action')
            }
            
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
            
        }
        
    }
    async getUserByCourse(req) {

        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            // const allRoleByUserId = await this.findAllRoleByUser(req)
            // const isAdmin = await allRoleByUserId.some(role => role.role_id == 1)
            if (allPermissionByUserId) {
                const { course_id } = req.query;
                const query = `SELECT u.id, u.name_user , u.email, u.mobie, u.gender FROM elearning."connect_user_course" AS usercourse
                                JOIN elearning."user" AS u ON usercourse."user_id" = u."id" 
                                JOIN elearning."course" ON usercourse."course_id" = elearning."course"."id"
                                WHERE course_id = ${course_id}`
                const res = await this.pg.query(query);
                return {
                    message: 'Get Data Successfully',
                    data: res
                };

            } else {
                throw new Error('your rights cannot perform this action')
            }



        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    async updateCourse(req, dataUpdateCourse, image) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            const allRoleByUserId = await this.findAllRoleByUser(req)
            const isAdmin = await allRoleByUserId.some(role => role.role_id == 1)
            if (allPermissionByUserId) {

                let queryText = `
                        UPDATE elearning."course" 
                        SET 
                        title = $2,
                        description = $3,
                        time_study = $4,
                        image = $5,
                        status = $6,
                        deleted = $7
                        WHERE id= $1 RETURNING *
                    `;
                let values = [
                    dataUpdateCourse.id, //$1
                    dataUpdateCourse.title, //$2
                    dataUpdateCourse.description, //$3
                    dataUpdateCourse.time_study, //$4
                    image, //$6
                    dataUpdateCourse.status, //$6
                    false //$7
                ]
                const res = await this.pg.query(`SELECT course_id FROM elearning.connect_user_course WHERE user_id = ${req.userId}`);
                const hasCourseCanUpdate = await res.some(course => course.course_id == dataUpdateCourse.id)
                if (hasCourseCanUpdate || isAdmin) {
                    let data = await this.pg.query(queryText, values);
                    return {
                        course: dataUpdateCourse.id,
                        status: 'success',
                        message: 'Course update successfully',
                        data: data
                    }
                } else {



                    //case teacher không sở hữu khoá học
                    console.log(allPermissionByUserId)
                    throw new NotFoundException('You do not have permission to update this course')

                }

            } else {
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    async deleteCourse(req, body) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            const allRoleByUserId = await this.findAllRoleByUser(req)
            const isAdmin = await allRoleByUserId.some(role => role.role_id == 1)
            if (allPermissionByUserId) {
                const queryFindCourse =
                    `
                SELECT course_id
                FROM elearning."connect_user_course" AS usercourse
                JOIN elearning."user" ON usercourse."user_id" = elearning."user"."id" 
                JOIN elearning."course" ON usercourse."course_id" = elearning."course"."id"
                WHERE elearning."user"."id" = ${req.userId};                
                `
                const listCourseById = await this.pg.query(queryFindCourse);
                const isHasCourse = await listCourseById.some(course => course.course_id == body.id)
                if (isHasCourse || isAdmin) {
                    await this.pg.query(`UPDATE elearning."course" SET deleted = true WHERE id = ${body.id}`)
                    return {
                        status: 'success',
                        message: 'Course deleted successfully',
                    }
                } else {
                    throw new Error('You do not have permission to update this course')
                }

            }
            else {
                throw new Error('your rights cannot perform this action')
            }


        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }

    }
    async createCourse(req, dataCreateCourse, image) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            console.log('allPermissionByUserIdzz', allPermissionByUserId)
            if (allPermissionByUserId) {
                const allRoleByUserId = await this.findAllRoleByUser(req)
                const isAdmin = await allRoleByUserId.some(role => role.role_id == 1)

                const queryTextCreateCourse = `
                INSERT INTO elearning."course" (
                    title,
                    description,              
                    time_study,
                    image,
                    status,
                    deleted,
                    price,
                    old_price,
                    star
                   
                ) VALUES (                
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                ) RETURNING *
                `;
                const valuesCreateCourse = [
                    dataCreateCourse.title,
                    dataCreateCourse.description,
                    dataCreateCourse.time_study,
                    image || dataCreateCourse.image,
                    dataCreateCourse.status,
                    false,
                    dataCreateCourse.price,
                    dataCreateCourse.old_price,
                    dataCreateCourse.star
                ];
                const res = await this.pg.query(queryTextCreateCourse, valuesCreateCourse);
                if (!isAdmin) {
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
                const allRoleByUserId = await this.findAllRoleByUser(req)
                const isAdmin = await allRoleByUserId.some(role => role.role_id == 1)

                const { page = 1, limit = 10, search = '' } = req.query;
                const offset = (page - 1) * limit;
                if (isAdmin) {

                    const queryCoursesByUserId = `
                    SELECT *
                    FROM elearning."course"
                    WHERE "deleted" = false
                    ORDER BY id DESC;                    
                    `;
                    const res = await this.pg.query(queryCoursesByUserId);
                    return {
                        message: 'Get Data Successfully',
                        data: res,

                    }
                } else {

                    const queryCoursesByUserId = `
                                            SELECT *
                                            FROM elearning."connect_user_course" AS cuc
                                            JOIN elearning."user" ON cuc."user_id" = elearning."user"."id" 
                                            JOIN elearning."course" ON cuc."course_id" = elearning."course"."id"
                                            WHERE elearning."user"."id" = ${req.userId} AND elearning."course"."deleted" = false
                                            ORDER BY course_id DESC                                           
                                            `;
                    const res = await this.pg.query(queryCoursesByUserId);
                    return {
                        message: 'Get Data Successfully',
                        data: res,

                    }
                }
            } else {
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }


}
