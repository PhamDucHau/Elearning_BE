import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { CourseEntity } from 'src/db/entities/course-entity';
// import { UserEntity } from 'src/db/entities/user-entity';


@Module({
  // imports: [TypeOrmModule.forFeature([CourseEntity,UserEntity])],
  controllers: [CourseController],
  providers: [CourseService]
})
export class CourseModule {}
