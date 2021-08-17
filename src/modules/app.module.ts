import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuotesModule } from './quotes/quotes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.DATABASE_DB,
      name: 'DatabaseConnection',
      entities: ['dist/src/**/*.entity.js'],
      synchronize: true, // only for development
      migrations: ['dist/src/db/migrations/*.js'],
      cli: {
        migrationsDir: 'src/db/migrations'
      }
    }),
    UsersModule,
    AuthModule,
    QuotesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
