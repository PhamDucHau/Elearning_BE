import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {

    constructor(
        private readonly roleService: RoleService
    ){}

    @Get('')
    async getAllUser(){
        return await this.roleService.getAllUser();
    }

    @Post('createRole')
    async createUser(@Body() data: CreateRoleDto){
        return await this.roleService.createRole(data);
    }

}
