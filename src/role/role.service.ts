import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/db/entities/role-entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>
    ){}

    async getAllUser(){
        try{
            const user = await this.roleRepository.find()
            if(user.length == 0){
                throw new Error('Data is not found')
            }

            return {message: 'Get Data Successfully', data: user}
        }catch(error){
            throw new NotFoundException(`${error.message}`)
        }
    }

    async createRole(data:CreateRoleDto){
        try{
            const user = await this.roleRepository.findOneBy({name: data.name});
            
            if(user){
                throw new Error('Role is already exists')
            }
            // const hashedPassword = await bcrypt.hash(data.password, 10);
            const createRole = await this.roleRepository.create({
                name: data.name,
                descriptions: data.descriptions,
                
            });
            
            await this.roleRepository.save(createRole);
            return {
                // status: 'success',
                message: 'Role created successfully',
                createRole
            }
        }catch(error){
            throw new NotFoundException(`${error.message}`)
        }
    }
}
