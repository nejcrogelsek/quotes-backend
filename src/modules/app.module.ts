import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuotesModule } from './quotes/quotes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: 5432,
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        // entities: ['dist/src/**/*.entity.js'],
        autoLoadEntities: true,
        synchronize: true,
        // migrations: ['dist/src/db/migrations/*.js'],
        // cli: {
        //   migrationsDir: 'src/db/migrations'
        // }
      }),
    }),
    UsersModule,
    AuthModule,
    QuotesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
