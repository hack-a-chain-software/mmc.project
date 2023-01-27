import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from 'src/jwt/module';
import { NearModule } from 'src/near/module';
import { GameController } from './controller';
import { GameService } from './service';
import { Clues } from './entities/clues.entity';
import { Warps } from './entities/warps.entity';
import { Images } from './entities/images.entity';
import { Scenes } from './entities/scenes.entity';
import { Guess } from './entities/guess.entity';
import { Seasons } from './entities/seasons.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    NearModule,
    JwtModule,
    TypeOrmModule.forFeature([Seasons, Guess, Scenes, Clues, Images, Warps]),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule { }
