import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('/search-by-filter')
    async getAllUser(@Req() req){
        return await this.userService.getAllUser(req);
    }

    @Post('/create')
    async createUser(@Req() req, @Body() body: CreateUserDto){
        return await this.userService.createUser(req, body);
    }

    @Post('/update')
    async updateUser(@Req() req, @Body() body: UpdateUserDto){
        return await this.userService.updateUser(req, body);
    }

    @Get('/list-role-by-user')
    async listRoleByUser(@Req() req){
        return await this.userService.listRoleByUser(req);
    }

    @Post('/delete')
    async deleteUser(@Req() req, @Body() body: any){
        return await this.userService.deleteUser(req, body);
    }

}
