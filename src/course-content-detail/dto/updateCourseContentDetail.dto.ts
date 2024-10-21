import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator'
export class UpdateCourseContentDetailDto {

    @IsString()
   
    value: string;    
    @IsNotEmpty()
    type_id: number;

    @IsNotEmpty()
    bold: boolean;



}