import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
export class UpdateCourseDto {

    @IsNotEmpty()
    @IsNumber()    
    id: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    time_study: string;

    @IsString()
    image: string;

    @IsString()
    status: string;

}