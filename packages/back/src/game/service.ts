import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scenes } from './entities/scenes.entity';
import { Guess } from './entities/guess.entity';
import { Clues } from './entities/clues.entity';
import { Seasons } from './entities/seasons.entity';
import { Warps } from './entities/warps.entity';
import { Images } from './entities/images.entity';

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
    @InjectRepository(Warps)
    private warpsRepository: Repository<Warps>,
    @InjectRepository(Images)
    private imagesRepository: Repository<Images>,
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

  findClueById(clueId: string ): Promise<Clues> {
    return this.cluesRepository.findOne({
      where: {
        id: clueId,
      },
    });
  }

  findImageById(imageId: string) {
    return this.imagesRepository.findOne({
      where: {
        id: imageId,
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

  async createScene(scene: any, season: Seasons) {
    const newScene = this.scenesRepository.create(scene) as any;

    newScene.seasons = season;

    return this.scenesRepository.save(newScene);
  }

  createClue(clue: any, scene: Scenes) {
    const newClue = this.cluesRepository.create(clue) as any;

    newClue.scenes = scene;

    return this.cluesRepository.save(newClue);
  }

  createWarp(warp: any, scene: Scenes) {
    const newWarp = this.warpsRepository.create(warp) as any;

    newWarp.scenes = scene;

    return this.warpsRepository.save(newWarp);
  }

  createImage(image: any, scene: Scenes) {
    const newImage = this.imagesRepository.create(image) as any;

    newImage.scenes = scene;

    return this.imagesRepository.save(newImage);
  }

  async updateScene(scene: Scenes) {
    const currentScene = await this.findSceneById(scene.id);

    return this.scenesRepository.save({
      ...currentScene,
      ...scene,
    });
  }

  async updateImage(image: Partial<Images>): Promise<Images> {
    const currentImage = await this.findImageById(image.id);

    return await this.imagesRepository.save({
      ...currentImage,
      ...image,
    });
  }
}
