import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from './helpers/config';


@UseGuards(AuthGuard)
@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ){}
    

    @Get('/search-by-filter')
    async getAllUser(@Req() req){
        return await this.courseService.getAllCourse(req);
    }

    @Post('/create')
    @UseInterceptors(FileInterceptor('image',{storage:storageConfig('image')}))
    async createCourse(@Req() req, @Body() body:CreateCourseDto,@UploadedFile() file: Express.Multer.File){
 
        return await this.courseService.createCourse(req,body, file.destination + '/' + file.filename);
    }

    @Post('/update')
    @UseInterceptors(FileInterceptor('image',{storage:storageConfig('image')}))
    async updateCourse(@Req() req, @Body() body:UpdateCourseDto,@UploadedFile() file: Express.Multer.File){
        const imagePath = file ? `${file.destination}/${file.filename}` : body.image;
        return await this.courseService.updateCourse(req,body,imagePath);
    }

    @Post('/delete')
    // @UseInterceptors(FileInterceptor('image',{storage:storageConfig('image')}))
    async deleteCourse(@Req() req, @Body() body){
        
        return await this.courseService.deleteCourse(req,body);
    }
}
