import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SingupDto } from './dto/signup.dto';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user-entity';
import { Connection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        // @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectConnection() private readonly pg: Connection,
        private jwtService: JwtService,
    ) { }
    async singup(singupData: SingupDto) {
        // const emailInUse = await this.userRepository.findOneBy({email: singupData.email});
        const emailInUse = await this.pg.query(`SELECT * FROM elearning."user" WHERE elearning."user"."email" = '${singupData.email}'`);
       
        if (emailInUse[0]) {
          
            throw new Error('User is already exists, go to login')
        }

        let queryTextSingup = `
            INSERT INTO elearning."user" (
                email,
                name_user,              
                password,
                mobie,
                gender,               
                date_of_birth
            ) VALUES (                
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
              
            ) RETURNING *
            `;
            const values = [
                singupData.email,
                singupData.name_user,
                singupData.password,
                singupData.mobie,
                singupData.gender,                
                singupData.date_of_birth,
            ];
            let queryTextRole = `
            INSERT INTO elearning."connect_user_role" (
                user_id,
                role_id
            ) VALUES (                
                $1,
                $2
            ) RETURNING *
            `;
            
        try {
            const res = await this.pg.query(queryTextSingup, values);
            const valuesRole = [                
                res[0].id,
                singupData.role_id
                
            ];
            const resRole = await this.pg.query(queryTextRole, valuesRole);
            await delete res[0].password;

        // await this.userRepository.save(createUser);
        
        return {
            status: 'success',
            message: 'User created successfully',
            data:{
                ...res[0],
                ...resRole[0]
            }
        }
            
        } catch (error) {
            throw new NotFoundException(`${error.message}`)
        }
        

    }

    async login(credentials: LoginDto) {
        const { email, password } = credentials;
        
        // const user = await this.userRepository.findOneBy({email: credentials.email});
        const user = await this.pg.query(
            `SELECT * FROM elearning."user" WHERE elearning."user"."email" = $1`, 
            [email]
        );
        const roleByUserId = await this.pg.query(
            `SELECT name_role 
            FROM elearning."connect_user_role" AS usercourse
            JOIN elearning."user" ON usercourse."user_id" = elearning."user"."id" 
            JOIN elearning."role" ON usercourse."role_id" = elearning."role"."id"
            WHERE elearning."user"."id" = $1;`, 
            [user[0].id]
        );
        if(!user[0]){
            
            throw new UnauthorizedException('Wrong credentials');
        }

        // const passwordMatch = await bcrypt.compare(password, user.password);

        if(password !== user[0].password){
            
            throw new UnauthorizedException('Wrong credentials');
        }

        //TODO: Generate JWT Token

        // const rolesByUserId = await this.pg.query(`SELECT elearning."connect_user_role"."role_id" FROM elearning."connect_user_role" WHERE elearning."connect_user_role"."user_id" = ${user[0].id}`);

        
        
        const tokens = await this.generateUserTokens(user[0].id);
        console.log('user',user)
        delete user[0].password
        
       
        return {
            ...tokens,
            userId: user[0].id,
            role: roleByUserId,
            user_info: user[0]
           
        }

    }

    async generateUserTokens(userId){
        const accessToken = this.jwtService.sign({userId}, {
            expiresIn: '1h'});
        return {accessToken}
    }
}
