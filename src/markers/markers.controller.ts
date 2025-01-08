import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, createReadStream} from 'fs';
import { BoundsMarkerDto } from './dto/bounds-marker.dto';
import { ConfigService } from '@nestjs/config';

@Controller('markers')
export class MarkersController {
  constructor(
    private readonly markersService: MarkersService,
    configService: ConfigService
  ) {}

  @Post()
  create(@Body() createMarkerDto: CreateMarkerDto) {
    return this.markersService.create(createMarkerDto);
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
    return this.markersService.saveFile(file, body);
    // return { message: 'File uploaded successfully', file: file.filename };
  }

  @Post('bounds')
  @UsePipes(new ValidationPipe())
  findByBounds(@Body() boundsMarkerDto: BoundsMarkerDto) {
    return this.markersService.findByBounds(boundsMarkerDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.markersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarkerDto: UpdateMarkerDto) {
    return this.markersService.update(+id, updateMarkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.markersService.remove(+id);
  }
}
