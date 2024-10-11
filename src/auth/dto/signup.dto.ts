
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator'
export class SingupDto {

    @IsString()
    @IsNotEmpty()
    name_user: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    mobie: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

   
    @IsNotEmpty()
    role_id: number;

    @Transform(({value}) => value && new Date(value))
    date_of_birth: Date;

}