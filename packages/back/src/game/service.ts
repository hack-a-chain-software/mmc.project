import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scenes } from './entities/scenes.entity';
import { Guess } from './entities/guess.entity';
import { Clues } from './entities/clues.entity';
import { Seasons } from './entities/seasons.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Scenes)
    private scenesRepository: Repository<Scenes>,
    @InjectRepository(Guess)
    private guessRepository: Repository<Guess>,
    @InjectRepository(Seasons)
    private seasonsRepository: Repository<Seasons>,
    @InjectRepository(Clues)
    private cluesRepository: Repository<Clues>,
  ) {}

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

  findGuessByWalletId(walletId: string): Promise<Guess[]> {
    return this.guessRepository.find({
      where: {
        wallet_id: walletId,
      },
    });
  }

  saveGuess(guess: any) {
    return this.guessRepository.save(guess);
  }
}
