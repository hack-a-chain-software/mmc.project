import {
  Controller,
  Get,
  Post,
  Response,
  Request,
  UseGuards,
  Param,
  Body,
  Put,
} from '@nestjs/common';
import * as express from 'express';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/jwt/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtValidatedRequest, JwtValidatedUser } from 'src/jwt/types';
import { GAME_URI } from './constants';
import { GameService } from './service';
import { Guess } from './entities/guess.entity';
import { Clues } from './entities/clues.entity';
import { Warps } from './entities/warps.entity';
import { NearService } from 'src/near/service';

interface GuessDto {
  who_murdered: string;
  weapon: string;
  motive: string;
  random_number: string;
  hash: string;
}

@Controller(GAME_URI)
export class GameController {
  constructor(
    private gameService: GameService,
    private nearService: NearService,
    @InjectRepository(Guess)
    private guessRepository: Repository<Guess>,
    @InjectRepository(Clues)
    private cluesRepository: Repository<Clues>,
    @InjectRepository(Warps)
    private warpsRepository: Repository<Warps>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('scene/:sceneId')
  async verifyOwnership(
    @Param('sceneId') sceneId: string,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    console.log('get scene by user: ', req.user);

    const viewResult = await this.gameService.findSceneById(sceneId);

    viewResult.clues = (await this.mapCluesForGame(
      viewResult.clues,
      req.user,
    )) as unknown as Clues[];

    return res.status(viewResult ? 200 : 403).json(viewResult);
  }

  @UseGuards(JwtAuthGuard)
  @Post('guess')
  async saveGuess(
    @Body() body: GuessDto,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.accountId) {
      return res.status(400).json({ success: false, error: 'not validated' });
    }

    try {
      await this.nearService.discountTicket({
        guess_hash: body.hash,
        account_id: req.user.accountId,
      });
    } catch (e) {
      console.warn(e);

      return res.status(400).json({
        success: false,
        error: 'We have a problem to discount your ticket',
      });
    }

    const guess = new Guess({
      ...body,
      wallet_id: req.user.accountId,
    });

    await this.gameService.saveGuess(guess);

    return res.status(200).json(guess);
  }

  @UseGuards(JwtAuthGuard)
  @Get('config')
  async getConfig(
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.seasonId) {
      return res.status(400).json({ success: false, error: 'not validated' });
    }

    const viewResult = await this.gameService.findSeasonById(req.user.seasonId);

    return res.status(200).json(viewResult);
  }

  @UseGuards(JwtAuthGuard)
  @Get('clues')
  async clues(
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    console.log('get clues by user: ', req.user);

    const viewResult = await this.gameService.findAllClues();

    const clues = await this.mapCluesForGame(viewResult, req.user);

    return res.status(viewResult ? 200 : 403).json(clues);
  }

  @UseGuards(JwtAuthGuard)
  @Get('guess')
  async guess(
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.accountId) {
      return res.status(400).json({ success: false, error: 'not validated' });
    }

    const viewResult = await this.gameService.findGuessByWalletId(
      req.user.accountId,
    );

    return res.status(viewResult ? 200 : 403).json(viewResult);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-scene')
  async createScene(
    @Body() body: any,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Only for Admin' });
    }

    const { seasonId, ...baseScene } = body;

    const season = await this.gameService.findSeasonById(seasonId);

    const newScene = await this.gameService.createScene(baseScene, season);

    return res.status(200).json(newScene);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-clues')
  async createClues(
    @Body() body: any,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Only for Admin' });
    }

    const { clues, sceneId } = body;

    const scene = await this.gameService.findSceneById(sceneId);

    const newClues = await Promise.all(
      clues.map(async (clue) => {
        return await this.gameService.createClue(clue, scene);
      }),
    );

    return res.status(200).json(newClues);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-clue')
  async updateClue(
    @Body() body: any,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Only for Admin' });
    }

    const { clue } = body;

    const currentClue = await this.gameService.findClueById(clue.id);

    const updatedClue = await this.cluesRepository.save({
      ...currentClue,
      clue,
    });

    return res.status(200).json(updatedClue);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-warps')
  async createWarps(
    @Body() body: any,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Only for Admin' });
    }

    const { warps, sceneId } = body;

    const scene = await this.gameService.findSceneById(sceneId);

    const newClues = await Promise.all(
      warps.map(async (clue) => {
        return await this.gameService.createWarp(clue, scene);
      }),
    );

    return res.status(200).json(newClues);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-warp')
  async updateWarp(
    @Body() body: any,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Only for Admin' });
    }

    const { warp } = body;

    const currentWarp = await this.gameService.findWarpById(warp.id);

    const updatedWarp = await this.warpsRepository.save({
      ...currentWarp,
      ...warp,
    });

    return res.status(200).json(updatedWarp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-scene-image')
  async createSceneImage(
    @Body() body: any,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Only for Admin' });
    }

    const { image, sceneId } = body;

    const scene = await this.gameService.findSceneById(sceneId);

    const newImage = await this.gameService.createImage(image, scene);

    return res.status(200).json(newImage);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-scene-image')
  async updateSceneImage(
    @Body() body: any,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Only for Admin' });
    }

    const { image } = body;

    const updatedImage = await this.gameService.updateImage(image);

    return res.status(200).json(updatedImage);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-scene')
  async updateSceneAvailability(
    @Body() body: any,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Only for Admin' });
    }

    const { scene } = body;

    const updatedScene = await this.gameService.updateScene(scene);

    return res.status(200).json(updatedScene);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rewards')
  async rewards(
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.accountId) {
      return res.status(400).json({ success: false, error: 'not validated' });
    }

    const guesses = (await this.gameService.findGuessByWalletId(
      req.user.accountId,
    )) as Guess[];

    try {
      const transactions = await Promise.all(
        guesses
          .filter(({ burned }) => !burned)
          .map(
            async ({
              id,
              wallet_id,
              murdered,
              weapon,
              motive,
              random_number,
            }: Guess) => {
              await this.nearService.claimGuessRewards({
                account_id: wallet_id,
                murderer: murdered,
                weapon,
                motive,
                random_number,
              });

              await this.guessRepository.update(
                { id },
                {
                  burned: true,
                },
              );
            },
          ),
      );

      return res.status(200).json(transactions);
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'We have a problem to discount your ticket',
      });
    }
  }

  async mapCluesForGame(clues: Clues[], user: JwtValidatedUser) {
    const stakedClues = await this.nearService.getStakedClues();

    const contractNfts =
      (await this.nearService.getNftTokensForOwner())?.map(
        ({ token_id }) => token_id,
      ) || [];

    return await Promise.all(
      clues.map(async (clue) => {
        const isOwner = user.clues.includes(clue.nft_id as never);
        const isStaked = stakedClues.includes(clue.nft_id as never);
        const isMinted =
          isStaked || (!isStaked && !contractNfts.includes(`${clue.nft_id}`));

        const showMedia = isOwner || isStaked;

        return {
          id: clue.id,
          nft_id: clue.nft_id,

          name: clue.name,

          isOwner,
          isMinted,
          isStaked: isStaked,

          width: clue.width,
          height: clue.height,

          position_left: clue.position_left,
          position_top: clue.position_top,

          media: showMedia ? clue.media : clue.placeholder,
          media_small: showMedia ? clue.media_small : clue.placeholder_small,

          placeholder: null,
          placeholder_small: null,

          description: showMedia ? clue.description : null,
        };
      }),
    );
  }
}
