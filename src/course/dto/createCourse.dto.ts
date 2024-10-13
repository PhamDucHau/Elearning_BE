
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator'
export class CreateCourseDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    time_study: string;

    
    image: string;

    @IsString()
    status: string;

}