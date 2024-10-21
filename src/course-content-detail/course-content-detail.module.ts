import { Module } from '@nestjs/common';
import { CourseContentDetailController } from './course-content-detail.controller';
import { CourseContentDetailService } from './course-content-detail.service';

@Module({
  controllers: [CourseContentDetailController],
  providers: [CourseContentDetailService]
})
export class CourseContentDetailModule {}
