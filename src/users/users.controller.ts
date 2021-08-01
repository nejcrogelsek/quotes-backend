import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post('create')
    createUser(@Body() body: CreateUpdateUserDto): Promise<User> {
        return this.usersService.createUser(body);
    }

    @Patch('update')
    updateUser(@Body() body: CreateUpdateUserDto, @Query('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.updateUser(id, body);
    }

    @Delete('delete')
    deleteUser(@Query('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.deleteUser(id);
    }
}
