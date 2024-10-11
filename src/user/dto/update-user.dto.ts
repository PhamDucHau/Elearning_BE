
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator'
export class UpdateUserDto {

    @IsString() 
    @IsNotEmpty()
    name?: string;

    @IsString() 
    email?: string;

    @IsString() 
    password?: string;

    @IsString() 
    mobile?: string;

    @IsString() 
    gender?: string;

    @Transform(({value}) => value && new Date(value))
    date_of_birth?: Date;

}