import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) 
    private readonly roleRepository: Repository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const isExist = await this.roleRepository.findBy({
      user: { id: createRoleDto.user_id },
      title: createRoleDto.title
    })
    
    if (isExist.length > 0) {
      throw new NotFoundException('This role already exist!');
    }

    const newRole = {
      title: createRoleDto.title,
      user: { id: createRoleDto.user_id },
    }

    return await this.roleRepository.save(newRole);
  }
}
