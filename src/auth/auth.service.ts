import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UserService } from '../user/user.service';
import * as argon2 from "argon2";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { SignInDto } from './dto/sing-in.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
) {}

  async validateUser(login: string, password: string) {
    console.log('validateUser');
    const user = await this.userService.findOne(login);
    const isPasswordMatch = await argon2.verify(user.password, password);
    if (user && isPasswordMatch) {
      return user;
    }
    throw new UnauthorizedException("Login or password are incorrect!");
  }

  async signIn(
    login: string,
    pass: string,
  ): Promise<{ id: number, login: string, access_token: string }> {
    console.log('signIn', login, pass);
    const user = await this.userService.findOne(login);
    const payload = { id: user.id, login: user.login };
    const access_token = await this.jwtService.signAsync(payload);
    
    return {
        id: user.id, 
        login: user.login,
        access_token
    };
  }

//   async signIn(signInDto: SignInDto): Promise<any> {
//     const user = await this.userService.findOne(signInDto.login)
//     // if (!user) {
//     //     throw new UnauthorizedException("User is not found!");
//     // }
//     // const isPasswordRight = await argon2.verify(user.password, signInDto.password);
//     // if (!isPasswordRight) {
//     //   throw new UnauthorizedException();
//     // }
//     // // TODO: Generate a JWT and return it here
//     // // instead of the user object
//     // return user;
//   }
}