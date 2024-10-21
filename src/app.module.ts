import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DbController } from './db/db.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import {TypeOrmModule}  from '@nestjs/typeorm';
import { UserEntity } from './db/entities/user-entity';
import { RoleEntity } from './db/entities/role-entity';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CourseModule } from './course/course.module';
import config from './config/config';
import { CourseEntity } from './db/entities/course-entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CourseDetailModule } from './course-detail/course-detail.module';
import { CourseContentDetailModule } from './course-content-detail/course-content-detail.module';



@Module({
  imports: [
    
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
      load: [config]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('JWT_SECRET'),
      }),
      global: true,
      inject: [ConfigService],
      // secret: '123',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: false, // Đặt là true trong môi trường phát triển (cẩn thận với dữ liệu)
        entities: [UserEntity, RoleEntity,CourseEntity], // Các entity của bạn
        logging: true, // Kích hoạt logging
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    ServeStaticModule.forRoot(
      {
          rootPath: join(__dirname, '../../uploads'), // Đường dẫn đến thư mục uploads
          serveRoot: '/uploads/', // Tiền tố đường dẫn để truy cập tệp
      },
  ),
    // DbModule,
    UserModule,
    RoleModule,
    AuthModule,
    CourseModule,
    CourseDetailModule,
    CourseContentDetailModule,

    // MongooseModule.forRoot(process.env.DB_URI),
    // BookModule
  ],
  controllers: [AppController, DbController,],
  providers: [AppService, ],
})
export class AppModule {}
