import { Module } from '@nestjs/common';
import { CourseDetailService } from './course-detail.service';
import { CourseDetailController } from './course-detail.controller';

@Module({
  providers: [CourseDetailService],
  controllers: [CourseDetailController]
})
export class CourseDetailModule {}
