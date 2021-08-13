import { Body, Controller, Delete, Get, Request, Param, ParseIntPipe, Patch, Post, Res, UseGuards, forwardRef, Inject, } from '@nestjs/common';
import { Response } from 'express';
import { AuthReturnData } from 'src/interfaces/auth.interface';
import { generateUploadUrl } from '../../../s3'
import { User } from '../../entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService) { }

    @Get('/find-by-email')
    test(@Body() body: { email: string }): Promise<User> {
        return this.usersService.findByEmail(body.email);
    }

    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post('create')
    createUser(@Body() body: CreateUserDto): Promise<AuthReturnData> {
        const data = this.usersService.createUser(body);
        return data;
    }

    @Patch('/:id')
    updateUser(@Body() body: UpdateUserDto, @Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.updateUser(id, body);
    }

    @Delete('/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.deleteUser(id);
    }

    @Get('upload')
    async uploadFile(@Res() res: Response) {
        const url = await generateUploadUrl();
        res.send({ url });
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req): Promise<AuthReturnData> {
        const { access_token } = await this.authService.login(req.user);
        const { id, email, first_name, last_name, profile_image } = await this.usersService.findByEmail(req.user.email)
        return {
            user: {
                id,
                email,
                first_name,
                last_name,
                profile_image
            },
            access_token
        };
    }
}
