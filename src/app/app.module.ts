import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StatEntity } from 'src/stats/stat.entity';
import { StatController } from 'src/stats/stat.controller';
import { StatService } from 'src/stats/stat.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
      ssl: true,
    }),

    TypeOrmModule.forFeature([
      // entities here
      StatEntity,
    ]),
  ],
  controllers: [
    // controllers here
    AppController,
    StatController,
  ],
  providers: [
    // services here
    AppService,
    StatService,
  ],
})
export class AppModule {}
