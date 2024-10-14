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
    async updateCourse(@Req() req, @Body() body:UpdateCourseDto){

        return await this.courseService.updateCourse(req,body);
    }

    // @Post('/upload-avatar')
    // @UseInterceptors(FileInterceptor('image',{storage:storageConfig('image')}))
    // uploadAvatar(@Req() req:any, @UploadedFile() file: Express.Multer.File) {
    //     console.log('upload Avartar');
    //     console.log('file', file);
    //     console.log('File saved at:', file.path);
    //     this.courseService.updateImage(req, file.destination + '/' + file.filename);
    // }

}
