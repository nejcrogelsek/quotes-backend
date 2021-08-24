import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthReturnData } from 'src/interfaces/auth.interface';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    createUser: jest.fn().mockImplementation((dto:CreateUserDto): AuthReturnData=>{
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
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getRepositoryToken(User),
        useValue: {}
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
