import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { authorize, saveFileToGoogleDrive } from '../services/googleapis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from './entities/marker.entity';
import { User } from '../user/entities/user.entity';
import { BoundsMarkerDto } from './dto/bounds-marker.dto';

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(Marker)
    private readonly markerRepository: Repository<Marker>,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
  ) {}

  create(createMarkerDto: CreateMarkerDto) {
    return 'This action adds a new marker';
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
    // Find User by Id
    console.log('body.coordinates', body.coordinates);
    console.log('body.coordinates[0]', body.coordinates.split(',')[0]);
    console.log('+body.coordinates[0]', +body.coordinates.split(',')[0]);

    const user = await this.userRepository.findOne({
      where: { id: +body.userId }
    });

    console.log('user ', user);
    // Save in db
    const newMarker = await this.markerRepository.save({
      comment: body.comment,
      rating: body.rating,
      lat: body.coordinates.split(',')[0],
      long: body.coordinates.split(',')[1],
      smallImageLink: 'https://drive.google.com/thumbnail?id=' + res.data.id,
      originImageLink: 'https://drive.google.com/thumbnail?id=' + res.data.id,
      user: user
    })
  }

  async findByBounds(boundsMarkerDto: BoundsMarkerDto) {
    console.log('findByBounds');
    const markers = await this.markerRepository.find();
    return markers;
  }

  findAll() {
    return `This action returns all markers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marker`;
  }

  update(id: number, updateMarkerDto: UpdateMarkerDto) {
    return `This action updates a #${id} marker`;
  }

  remove(id: number) {
    return `This action removes a #${id} marker`;
  }
}
