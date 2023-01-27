import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scenes } from './entities/scenes.entity';
import { Guess } from './entities/guess.entity';
import { Clues } from './entities/guess.entity';
import { Seasons } from './entities/seasons.entity';

// TODO: move it somewhere else
interface Nep171Token {
  token_id: string;
  owner_id: string;
}

@Injectable()
export class GameService {
  private contractId: string;

  constructor(
    @InjectRepository(Scenes)
    private scenesRepository: Repository<Scenes>,
    @InjectRepository(Guess)
    private guessRepository: Repository<Guess>,
    @InjectRepository(Seasons)
    private seasonsRepository: Repository<Seasons>,
    @InjectRepository(Clues)
    private cluesRepository: Repository<Clues>,
    configService: ConfigService<Configuration>,
  ) {
    const nearConfig = configService.get('near', { infer: true });

    this.contractId = nearConfig.cluesContract;
  }

  findSceneById(sceneId: string): Promise<Scenes> {
    return this.scenesRepository.findOne({
      where: {
        id: sceneId,
      },
      relations: {
        clues: true,
        images: true,
        warps: true,
      },
    });
  }

  findAllScenes(): Promise<Scenes[]> {
    return this.scenesRepository.find({
      relations: {
        clues: true,
        images: true,
        warps: true,
      },
    });
  }

  findAllClues(): Promise<Clues[]> {
    return this.cluesRepository.find();
  }

  findSeasonById(seasonId: string): Promise<Seasons> {
    return this.seasonsRepository.findOne({
      where: {
        id: seasonId,
      },
    });
  }

  saveGuess(guess: any) {
    return this.guessRepository.save(guess);
  }
}
