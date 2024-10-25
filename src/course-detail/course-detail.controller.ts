import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CourseDetailService } from './course-detail.service';
import { CreateCourseDetailDto } from './dto/createCourseDetail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from './helpers/config';
import { UpdateCourseDetailDto } from './dto/updateCourseDetail.dto';



@UseGuards(AuthGuard)
@Controller('course-detail')
export class CourseDetailController {
    constructor(
        private readonly courseService: CourseDetailService
    ) {
    }
    @Get('/search-by-filter')
    
    async getAllUser(@Req() req){
        return await this.courseService.getAllCourseDetail(req);
    }

    @Post('/create')
    @UseInterceptors(FileInterceptor('image',{storage:storageConfig('image')}))
    async createCourseDetail(@Req() req, @Body() body:CreateCourseDetailDto,@UploadedFile() file: Express.Multer.File){
        // return await this.courseService.createCourseDetail(req, body);
        const imagePath = file ? `${file.destination}/${file.filename}` : body.image;
        return await this.courseService.createCourseDetail(req, body, imagePath);
    }

    @Post('/update')
    @UseInterceptors(FileInterceptor('image',{storage:storageConfig('image')}))
    async updateCourseDetail(@Req() req, @Body() body:UpdateCourseDetailDto,@UploadedFile() file: Express.Multer.File){
        const imagePath = file ? `${file.destination}/${file.filename}` : body.image;
        return await this.courseService.updateCourseDetail(req,body,imagePath);
    }

    @Post('/delete')
    async deleteCourseDetail(@Req() req, @Body() body:any){
        return await this.courseService.deleteCourseDetail(req,body);
    }

    
}
