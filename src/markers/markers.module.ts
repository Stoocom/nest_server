import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marker } from './entities/marker.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marker, User])],
  controllers: [MarkersController],
  providers: [MarkersService],
})
export class MarkersModule {}
