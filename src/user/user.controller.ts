import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put, UseInterceptors, UploadedFile, StreamableFile, Res, Header, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, createReadStream} from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    console.log('create user');
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Res({ passthrough: true }) res: Response) {
    console.log('res.cookie', res.cookie);
    res.cookie('jwt', '12323434', { httpOnly: true });
    return this.userService.findAll();
  }

  @Post('info')
  @UsePipes(new ValidationPipe())
  findByLogin(@Body() getUserDto: string) {
    return this.userService.findOne(getUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      // destination: ''
      destination: (req, file, cb) => {
        const now = new Date();
        console.log('now.getMonth()', now.getMonth());
        const dirPath = './images/' + now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        console.log('dirPath', dirPath);
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }
        cb(null, dirPath);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname)
      },
    })
  }))
  uploadFile( @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    console.log('body', body);
    return this.userService.saveFile(file, body)
    // return { message: 'File uploaded successfully', file: file.filename };
  }

  @Get('file')
  getFile(@Res() res: any) {
    const file = createReadStream(join(process.cwd(), './images/2024/11/13/2_r.png'));
    file.pipe(res);
  }

  @Get('send_file')
  send(@Res() res: any) {
    const path = join(process.cwd(), './images/2024/11/13/2_r.png');
    console.log('path', path);
    console.log('__dirname', __dirname);
    console.log('__filename',__filename);
    return this.userService.sendFile('2_r.png');
  }
}
