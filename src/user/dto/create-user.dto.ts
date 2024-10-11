
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator'
export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    mobile: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    
    @IsNotEmpty()
    role_id: number;

    @Transform(({value}) => value && new Date(value))
    date_of_birth: Date;

}