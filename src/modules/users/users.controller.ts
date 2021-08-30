import { Body, Controller, Delete, Get, Request, Param, ParseIntPipe, Patch, Post, Res, UseGuards, forwardRef, Inject, } from '@nestjs/common';
import { Response } from 'express';
import { AuthReturnData, UserDataFromToken } from '../../interfaces/auth.interface';
import { generateUploadUrl } from '../../../s3'
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService) { }

    @Get('/test')
    test(): string {
        return 'This is test';
    }

    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post('signup')
    createUser(@Body() body: CreateUserDto): Promise<AuthReturnData> {
        const data = this.usersService.createUser(body);
        return data;
    }

    @Patch('me/update-password')
    updateUser(@Body() body: UpdateUserDto): Promise<User> {
        return this.usersService.updateUser(body);
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

    @Post('refresh-token')
    async refreshToken(@Body() body): Promise<{ access_token: string }> {
        const { access_token } = await this.authService.refreshToken(body);
        return {
            access_token
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    async me(@Request() req): Promise<UserDataFromToken> {
        console.log(req.user);
        let userInfo: UserDataFromToken = { id: null, email: null, first_name: null, last_name: null, profile_image: null };
        await this.usersService.findById(req.user.id).then((res) => {
            userInfo = {
                id: res.id,
                email: res.email,
                first_name: res.first_name,
                last_name: res.last_name,
                profile_image: res.profile_image,
            }
        })
        return userInfo;
    }
}
