import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';

@UseGuards(AuthGuard)
@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ){}

    @Get('')
    async getAllUser(@Req() req){
        return await this.courseService.getAllCourse(req);
    }

    @Post('/create')
    async createCourse(@Req() req, @Body() body:CreateCourseDto){
        return await this.courseService.createCourse(req,body);
    }

    @Post('/update')
    async updateCourse(@Req() req, @Body() body:UpdateCourseDto){
        return await this.courseService.updateCourse(req,body);
    }

}
