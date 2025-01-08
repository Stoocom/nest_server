import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from "argon2";
import { GetUserDto } from './dto/get-user.dto';
import { Role } from '../role/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { readFile } from 'fs/promises';
import { authorize, saveFileToGoogleDrive } from '../services/googleapis';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role) 
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        login: createUserDto.login
      }
    })
    if (existUser) {
      throw new BadRequestException('This user already exist!');
    }

    const newUser = await this.userRepository.save({
      login: createUserDto.login,
      name: createUserDto.name,
      password: await argon2.hash(createUserDto.password),
    })

    if (createUserDto.roles && createUserDto.roles.length > 0) {
      createUserDto.roles.forEach(async (role) => {
        await this.roleRepository.save({
          title: role,
          user: { id: newUser.id },
        })
      })
    }

    const payload = { id: newUser.id, login: newUser.login };
    const access_token = this.jwtService.sign(payload)

    return { 
      name: newUser.name,
      login: newUser.login,
      roles: newUser.roles ?? [],
      access_token
     };
  }
  
  async findAll() {
    const users = await this.userRepository.find()
    return { users };
  }

  async findOne(login: string) {
    const user = await this.userRepository.findOne({
      where: {
        login: login
      },
      relations: {
        roles: true
      }
    })

    if (!user) {
      throw new NotFoundException('This user not found!');
    }

    return user
  }

  async findByLogin(login: string) {
    const user = await this.userRepository.findOne({
      where: { login },
      relations: {
        roles: true
      }
    })

    if (!user) {
      throw new NotFoundException('This user not found!');
    }

    return user
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      },
      relations: {
        roles: true
      }
    });
  
    if (!user) {
      throw new NotFoundException('This user not found!');
    }
    await this.userRepository.delete(id);
    return { success: true };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('This user not found!');
    }
    const updateRoles = updateUserDto.updateRoles;

    if (updateRoles && updateRoles.length > 0) {
      const roles = await this.roleRepository.find({
        where: { 
          user: { id }
        }
      });

      if (roles.length === 0) {
        console.log('no')
        updateRoles.forEach(async (r) => {
          await this.roleRepository.save({
            title: r,
            user: { id },
          })
        })
      } else {

        let titleRoles = roles.map((r) => {
          return r.title;
        });

        // Search removed roles
        titleRoles.forEach(async (r) => {
          if (!updateRoles.includes(r)) {
            await this.roleRepository.delete({
              title: r,
              user: { id },
            })
          }
        })

        // Search added roles
        updateRoles.forEach(async (r) => {
          if (!titleRoles.includes(r)) {
            await this.roleRepository.save({
              title: r,
              user: { id },
            })
          }
        })
      }
    }

    delete updateUserDto.updateRoles;
    await this.userRepository.update(id, updateUserDto);
    return { success: true }
  }

  async sendFile(filename: string) {
    const res: any = await fetch('https://cloud-api.yandex.net/v1/disk/resources/upload?path=/map_images/' + filename, {
        method: 'GET',
        headers: {
            Authorization:
                "OAuth " +
                "1y0_AgAAAAA89Q_-AAz88gAAAAEc7zBFAAB05-5qeeFHVZQUsTbKnWQceDOXwA",
        }
    })
    const data = await res.json();
    console.log('getDiskProfile data ', data);
    const result = await this.saveFileInYandexDisk(data.href, filename);
    console.log('result', result);
    return result;
  }

  async saveFileInYandexDisk(url: string, filename: string) {
    console.log('saveFileInYandexDisk', url);

    const path = '/2_r.png';
    console.log('__dirname + path', __dirname + '/');
    const formData = new FormData();
    formData.append('file', await this.createBlobFromFile(__dirname + path), filename);
    const res: any = await fetch(url, {
        method: 'POST',
        body: formData
    })
    // const data = await res.json();
    console.log('saveFileInYandexDisk res ', res);
  }

  async createBlobFromFile(path: string): Promise<Blob> {
    const file = await readFile(path);
    return new Blob([file]);
  }

  async saveFile(file: Express.Multer.File, body: any): Promise<any> {
    // TODO Check exist filename in Google Drive

    // Saving file in Google Drive
    const client = await authorize();
    const res = await saveFileToGoogleDrive(file, client);
    console.log('res ', res);

    if (res.status !== 200 && res.status !== 201) {
      throw new NotFoundException('File is not saved!');
    }

    // Saving  in Google Drive



    
    // return {
      //   status: res.status,
      //   data: res.data
      // }
  }

  // async sendFile(filename: string) {
  //   const res: any = await fetch('https://cloud-api.yandex.net/v1/disk/resources/upload?path=/map_images/' + filename, {
  //       method: 'GET',
  //       headers: {
  //           Authorization:
  //               "OAuth " +
  //               "1y0_AgAAAAA89Q_-AAz88gAAAAEc7zBFAAB05-5qeeFHVZQUsTbKnWQceDOXwA",
  //       }
  //   })
  //   const data = await res.json();
  //   console.log('getDiskProfile data ', data);
  //   const result = await this.saveFileInYandexDisk(data.href, filename);
  //   console.log('result', result);
  //   return result;
  // }
}
