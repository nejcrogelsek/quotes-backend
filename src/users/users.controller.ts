import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('test')
    test(): Promise<User> {
        return this.usersService.findByEmail('test@gmail.com');
    }

    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post('create')
    createUser(@Body() body: CreateUserDto): Promise<User> {
        return this.usersService.createUser(body);
    }

    @Patch('/:id')
    updateUser(@Body() body: UpdateUserDto, @Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.updateUser(id, body);
    }

    @Delete('/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.deleteUser(id);
    }
}
