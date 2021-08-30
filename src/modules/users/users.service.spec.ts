import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthReturnData } from '../../interfaces/auth.interface';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    createUser: jest.fn().mockImplementation((dto: CreateUserDto): AuthReturnData => {
      const { email, first_name, last_name, profile_image } = dto;
      return {
        user: {
          id: expect.any(Number),
          email: email,
          first_name: first_name,
          last_name: last_name,
          profile_image: profile_image
        },
        access_token: expect.any(String)
      }
    }),
    save: jest.fn().mockImplementation(user => Promise.resolve({ id: expect.any(Number), ...user }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getRepositoryToken(User),
        useValue: mockUsersRepository
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that', async () => {
    const dto: CreateUserDto = {
      profile_image: 'undefined',
      email: 'mockUser@gmail.com',
      first_name: 'Mock',
      last_name: 'User',
      password: 'Mock123!',
      confirm_password: 'Mock123!'
    };
    expect(await service.createUser(dto)).toEqual({
      user: {
        id: expect.any(Number),
        email: 'mockUser@gmail.com',
        first_name: 'Mock',
        last_name: 'User',
        profile_image: 'undefined'
      },
      access_token: expect.any(String)
    })
  })
});
