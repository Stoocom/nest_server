import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserModule } from './user.module';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let app: INestApplication;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        // Use the e2e_test database to run the tests
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '',
          database: 'test_09_12_2024',
          entities: ['./**/*.entity.ts'],
          synchronize: false,
        }),
      ],
      providers: [
        UserService, {
        provide: USER_REPOSITORY_TOKEN,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          save: jest.fn(),
        }
      }, RoleService, {
        provide: getRepositoryToken(Role),
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          save: jest.fn(),
        }

      }],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('1 - create user', () => {
    it('should create a new user', async () => {
      const result = await service.create({
        name: 'Alex',
        login: '111111',
        password: 'A12345a'
      }); 

      expect(result).toEqual({
          login: "111111",
          name: "Alex",
          roles: []
        }
      );
    });

    it('get error after try recreate user', async () => {
      await expect(service.create({
        name: 'Alex',
        login: '111111',
        password: 'A12345a'
      })).rejects.toEqual(new BadRequestException('This user already exist!'));
    });
  });

  describe('2 - update user', () => {
    it('should update login', async () => {
      const result = await service.update(28, {
        login: 'test41_change',
      }); 

      expect(result).toEqual({ success: true });
    });

    it('should update roles', async () => {
      const result = await service.update(28, {
        login: 'test24_change',
        updateRoles: [ 'Architector', 'Analytics' ]
      }); 

      expect(result).toEqual({ success: true });
    });
  });

  describe('3 - delete user', () => {
    it('should delete user', async () => {
      const result = await service.remove(13); 

      expect(result).toEqual({ success: true });
    });
  });
});
