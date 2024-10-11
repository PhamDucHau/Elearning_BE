
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator'
export class CreateRoleDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    descriptions: string;

    
}