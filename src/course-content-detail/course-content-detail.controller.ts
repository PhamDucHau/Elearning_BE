import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CourseContentDetailService } from './course-content-detail.service';
import {  UpdateCourseContentDetailDto } from './dto/updateCourseContentDetail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/course/helpers/config';
import { CreateCourseContentDetailDto } from './dto/createCourseContentDetail.dto copy';

@UseGuards(AuthGuard)
@Controller('course-content-detail')
export class CourseContentDetailController {
    constructor(
        private readonly courseContentDetailService: CourseContentDetailService
    ){}

    @Get('/search-by-filter')
    async getAllUser(@Req() req){
        return await this.courseContentDetailService.getAllCourseContentDetail(req);
    }

    @Post('/create')      
    async createContentCourseDetail(@Req() req, @Body() body:CreateCourseContentDetailDto){       
        return await this.courseContentDetailService.createCourseContentDetail(req, body);
    }

    @Post('/update')      
    async updateContentCourseDetail(@Req() req, @Body() body:UpdateCourseContentDetailDto){       
        return await this.courseContentDetailService.updateCourseContentDetail(req, body);
    }
    @Post('/delete')      
    async deleteContentCourseDetail(@Req() req, @Body() body:any){       
        return await this.courseContentDetailService.deleteCourseContentDetail(req, body);
    }
    
}
