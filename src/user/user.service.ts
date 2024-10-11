import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/db/entities/user-entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    private manager: EntityManager;
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {
        // this.manager = this.dataSource.manager;
    }

    //create user
    async createUser(data:CreateUserDto){
        try{
            const user = await this.userRepository.findOneBy({email: data.email});
            
            if(user){
                throw new Error('User is already exists, go to login')
            }
            // const hashedPassword = await bcrypt.hash(data.password, 10);
            const createUser = await this.userRepository.create({
                email: data.email,
                name: data.name,
                password: data.password,
                mobile: data.mobile,
                gender: data.gender,
                role_id: data.role_id,
                date_of_birth: data.date_of_birth,
            });
            
            await this.userRepository.save(createUser);
            return {
                // status: 'success',
                message: 'User created successfully',
                createUser
            }
        }catch(error){
            throw new NotFoundException(`${error.message}`)
        }
    }
    //update user
    async updateUser(id: string,data: UpdateUserDto){
        try {
            const user = await this.userRepository.findOneBy({id})
            if(user){
                throw new Error('User is not found')
            }

            user.date_of_birth = data.date_of_birth,
            user.email = data.email,
            user.gender = data.gender,
            user.mobile = data.mobile,
            user.name = data.name,
            user.password = data.password

            await this.userRepository.update(id, user)
        } catch (error) {
            
        }
    }

    //delete user
    async deleteUser(id: string){
        try{
            const user = await this.userRepository.findOneBy({id})
            if(!user){
                throw new Error('User is not found')
            }

            await this.userRepository.delete({id})
            return "Deleted user successfully"
        }catch(error){
            throw new NotFoundException(`${error.message}`)
        }
    }

    //getAll User
    async getAllUser(){
        try{
            const user = await this.userRepository.find()
            if(user.length == 0){
                throw new Error('Data is not found')
            }

            return {message: 'Get Data Successfully', data: user}
        }catch(error){
            throw new NotFoundException(`${error.message}`)
        }
    }
    //getUser by id

    async getUserById(id: string){
        try{
            const user = await this.userRepository.findOneBy({id})
            if(!user){
                throw new Error('Data is not found')
            }
            return { message: 'Get Data Successfully', data: user}
        }catch(error){
            throw new NotFoundException(`${error.message}`)
        }
    }
}
