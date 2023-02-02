import {
  Controller,
  Get,
  Post,
  Response,
  Request,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import * as express from 'express';
import { JwtAuthGuard } from 'src/jwt/auth.guard';
import { JwtValidatedRequest, JwtValidatedUser } from 'src/jwt/types';
import { GAME_URI } from './constants';
import { GameService } from './service';
import { Guess } from './entities/guess.entity';
import { Clues } from './entities/clues.entity';
import { NearService } from 'src/near/service';

interface GuessDto {
  who_murdered: string;
  weapon: string;
  motive: string;
  random_number: number;
  hash: string;
}

@Controller(GAME_URI)
export class GameController {
  constructor(
    private gameService: GameService,
    private nearService: NearService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('scene/:sceneId')
  async verifyOwnership(
    @Param('sceneId') sceneId: string,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    const viewResult = await this.gameService.findSceneById(sceneId);

    viewResult.clues = (await this.mapCluesForGame(
      viewResult.clues,
      req.user,
      (clue, isOwner, isStaked) =>
        isOwner || isStaked ? clue.media : clue.placeholder,
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

    // try {
    //   await this.nearService.discountTicket({
    //     guess_hash: body.hash,
    //     account_id: req.user.accountId,
    //   });
    // } catch (e) {
    //   console.warn(e);

    //   return res
    //     .status(400)
    //     .json({ success: false, error: 'Invalid permission for key' });
    // }

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
    const viewResult = await this.gameService.findAllClues();

    const clues = await this.mapCluesForGame(
      viewResult,
      req.user,
      (clue, isOwner, isStaked) =>
        isOwner || isStaked ? clue.media_small : clue.placeholder_small,
    );

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
  @Post('rewards')
  async rewards(
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    if (!req.user.accountId) {
      return res.status(400).json({ success: false, error: 'not validated' });
    }

    return res.status(200);
  }

  async mapCluesForGame(
    clues: Clues[],
    user: JwtValidatedUser,
    callbackMedia: (clue: Clues, isOwner, isStaked) => string,
  ) {
    // TODO: use view call to get all staked clues: view_staked_clues;
    // TODO: use view call to get all minted clues: view_minted_clues;
    const stakedClues = [];

    // [] = todas as nfts -> filtro esse array por todas as nfts que o contrato é dono
    // [] = todas as staked nfts -> pego todas as nfts stakads
    // isMinted <- filtro de nfts que não estão em staked nfts

    return await Promise.all(
      clues.map(async (clue) => {
        const isOwner = !!user.accountId;
        // const isOwner = user.clues.includes(clue.nft_id as never);
        const isStaked = stakedClues.includes(clue.nft_id as never);

        return {
          id: clue.id,
          nft_id: clue.nft_id,

          name: clue.name,

          isOwner,
          isMinted: true,
          isStaked: isStaked,

          width: clue.width,
          height: clue.height,

          position_left: clue.position_left,
          position_top: clue.position_top,

          media: callbackMedia(clue, isOwner, isStaked),
          media_small: null,

          placeholder: null,
          placeholder_small: null,

          description: isOwner || isStaked ? clue.description : null,
        };
      }),
    );
  }
}
