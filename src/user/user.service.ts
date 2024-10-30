import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/db/entities/user-entity';
import { Connection, DataSource, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    private manager: EntityManager;
    constructor(
        @InjectConnection() private readonly pg: Connection,
    ) {
        // this.manager = this.dataSource.manager;
    }
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

    async deleteUser(req, body) {
        const allPermissionByUserId = await this.getAllPermissionByUserId(req)
        if (allPermissionByUserId) {
            const query = `DELETE FROM elearning."connect_user_role" WHERE user_id = ${body.id}`
            const res = await this.pg.query(query)
            if (res) {
                await this.pg.query(`DELETE FROM elearning."user" WHERE id = ${body.id}`)
                return { message: 'Delete Data Successfully' }
            } else {
                throw new Error('Delete Data Failed')
            }
        } else {
            throw new Error('your rights cannot perform this action')
        }
    }

    async updateUser(req, body) {
        const allPermissionByUserId = await this.getAllPermissionByUserId(req)
        if (allPermissionByUserId) {
            const res = await this.pg.query(`UPDATE elearning."user" SET email = '${body.email}', name_user = '${body.name_user}', 
                                                mobie = '${body.mobie}', gender = '${body.gender}', date_of_birth = '${body.date_of_birth}',
                                                password = '${body.password}'
                                                WHERE id = ${body.id} RETURNING *`)
            if (res) {
                console.log('res', res)
                const query = `DELETE FROM elearning."connect_user_role" WHERE user_id = ${body.id}`
                await this.pg.query(query)
                await body.role_id.map(async (role_id) => {
                    const query = `INSERT INTO elearning."connect_user_role" (user_id, role_id) VALUES ('${body.id}', '${role_id}')`
                    await this.pg.query(query)
                })
                return {
                    message: 'Update Data Successfully',
                    data: res
                }
            } else {
                throw new Error('Update Data Failed')
            }
        } else {
            throw new Error('your rights cannot perform this action')
        }

    }

    async listRoleByUser(req) {
        const { userId } = req.query
        const reqUserId = {
            userId: userId
        }
        const allPermissionByUserId = await this.getAllPermissionByUserId(req)
        if (allPermissionByUserId) {
            const allRoleByUserId = await this.pg.query(`SELECT * FROM elearning."connect_user_role" 
                                                        JOIN elearning."role" ON elearning."connect_user_role"."role_id" = elearning."role"."id"
                                                        WHERE user_id = ${userId}`)
            return { message: 'Get Data Successfully', data: allRoleByUserId }
        } else {
            throw new Error('your rights cannot perform this action')
        }
    }

    async createUser(req, body) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)

            if (allPermissionByUserId) {
                const emailInUse = await this.pg.query(`SELECT * FROM elearning."user" WHERE elearning."user"."email" = '${body.email}'`);

                if (emailInUse[0]) {

                    throw new Error('User is already exists, go to login')
                }
                const allRoleByUserId = await this.findAllRoleByUser(req)
                const isAdmin = allRoleByUserId.some(role => role.role_id == 1)
                // const isTeacher = await allRoleByUserId.some(role => role.role_id == 2)
                if (!isAdmin) {
                    throw new Error('You do not have permission to create user')
                }
                const query = `INSERT INTO elearning."user" (email, name_user, mobie, gender, date_of_birth, password) 
                               VALUES ('${body.email}', '${body.name_user}', '${body.mobie}', '${body.gender}', '${body.date_of_birth}', '${body.password}') 
                               RETURNING *`
                const res = await this.pg.query(query)
                console.log('res', res)
                if (res) {
                    await body.role_id.map(async (role_id) => {
                        const query = `INSERT INTO elearning."connect_user_role" (user_id, role_id) VALUES ('${res[0].id}', '${role_id}')`
                        await this.pg.query(query)
                    })
                    return { message: 'Create Data Successfully', data: res }


                } else {
                    throw new Error('Create Data Failed')
                }

            } else {
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

    async getAllUser(req) {
        try {
            const allPermissionByUserId = await this.getAllPermissionByUserId(req)
            if (allPermissionByUserId) {
                const { page = 1, size = 10, search = '' } = req.query;

                const pageNumber = parseInt(page, 10);
                const pageSize = parseInt(size, 10);
                const offset = (pageNumber - 1) * pageSize;
                let query = `
                    SELECT * 
                    FROM elearning."user"
                `;
                const values: (string | number)[] = [pageSize, offset];

                // const values = [pageSize, offset];
             
                if (typeof search === 'string' && search.length > 0) {      
                    
                    query += ` WHERE name_user ILIKE $3`;
                    values.push(`%${search}%`); // Thêm `search` vào `values` tại $1
                }           

                // Thêm phân trang
                query += ` ORDER BY id ASC LIMIT $1 OFFSET $2`;   
                
                const res = await this.pg.query(query, values);
                const total = await this.pg.query(`SELECT COUNT(*) FROM elearning."user"`)
                return { message: 'Get Data Successfully', data: res, total: total[0].count }

            } else {
                throw new Error('your rights cannot perform this action')
            }
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
    }

}
