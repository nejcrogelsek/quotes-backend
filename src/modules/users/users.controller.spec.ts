import { Test, TestingModule } from '@nestjs/testing';
import { AuthReturnData } from '../../interfaces/auth.interface';
import { IUser } from '../../interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    createUser: jest.fn((dto: CreateUserDto): AuthReturnData => {
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
    updateUser: jest.fn((dto: UpdateUserDto): IUser => {
      const { confirm_password, id, password, ...rest } = dto
      return {
        id: id,
        ...rest,
        profile_image: expect.any(String),
        password: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).overrideProvider(UsersService).useValue(mockUserService).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto: CreateUserDto = {
      profile_image: 'undefined',
      email: 'mockUser@gmail.com',
      first_name: 'Mock',
      last_name: 'User',
      password: 'Mock123!',
      confirm_password: 'Mock123!'
    };
    expect(controller.createUser(dto)).toEqual({
      user: {
        id: expect.any(Number),
        email: 'mockUser@gmail.com',
        first_name: 'Mock',
        last_name: 'User',
        profile_image: 'undefined'
      },
      access_token: expect.any(String)
    })

    expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
  })

  it('should update a user', () => {
    const dto: UpdateUserDto = {
      id: 14,
      email: 'neki@gmail.com',
      first_name: 'Mock Updated',
      last_name: 'Uporabnik',
      password: 'Neki123!',
      confirm_password: 'Neki123!'
    };
    expect(controller.updateUser(dto)).toEqual({
      id: 14,
      email: 'neki@gmail.com',
      first_name: 'Mock Updated',
      last_name: 'Uporabnik',
      profile_image: expect.any(String),
      password: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    })

    expect(mockUserService.updateUser).toHaveBeenCalledWith(dto);
  })

});
