import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module';
import { configuration } from './config/configuration';
import { GameModule } from './game/module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clues } from './game/entities/clues.entity';
import { Warps } from './game/entities/warps.entity';
import { Images } from './game/entities/images.entity';
import { Scenes } from './game/entities/scenes.entity';
import { Guess } from './game/entities/guess.entity';
import { Seasons } from './game/entities/seasons.entity';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    GameModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      logging: true,
      url: process.env.DB_URL,
      entities: [Seasons, Guess, Scenes, Clues, Warps, Images],
    }),
  ],
})
export class AppModule {}
