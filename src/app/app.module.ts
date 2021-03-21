import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StatEntity } from 'src/stats/stat.entity';
import { StatController } from 'src/stats/stat.controller';
import { StatService } from 'src/stats/stat.service';
import { AllTimeStatController } from 'src/allTimeStats/allTimeStats.controller';
import { AllTimeStatService } from 'src/allTimeStats/allTimeStats.service';
import { AllTimeStatEntity } from 'src/allTimeStats/allTimeStats.entity';

const getssl = () => {
  if (process.env.DB_SSL && process.env.DB_SSL === 'TRUE') {
    console.log('1');
    return {
      ssl: {
        rejectUnauthorized: false,
      },
    };
  } else {
    console.log('2');
    return {};
  }
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...getssl(),
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),

    TypeOrmModule.forFeature([
      // entities here
      StatEntity,
      AllTimeStatEntity,
    ]),
  ],
  controllers: [
    // controllers here
    AppController,
    StatController,
    AllTimeStatController,
  ],
  providers: [
    // services here
    AppService,
    StatService,
    AllTimeStatService,
  ],
})
export class AppModule {}
