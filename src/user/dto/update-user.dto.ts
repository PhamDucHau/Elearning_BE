
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator'
export class UpdateUserDto {

    @IsString() 
    @IsNotEmpty()
    name_user?: string;

    @IsString() 
    email?: string;

    @IsString() 
    password?: string;

    @IsString() 
    mobie?: string;

    @IsString() 
    gender?: string;

    @Transform(({value}) => value && new Date(value))
    date_of_birth?: Date;

}