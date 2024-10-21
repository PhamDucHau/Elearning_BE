import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator'
export class CreateCourseContentDetailDto {

    @IsString()
    @IsNotEmpty()
    value: string;

    
    @IsNotEmpty()
    type_id: number;
    
    @IsNotEmpty()
    course_detail_id: number;

    @IsNotEmpty()
    bold: boolean;

    image: string;

}