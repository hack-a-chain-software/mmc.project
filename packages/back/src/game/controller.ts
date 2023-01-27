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
import { JwtValidatedRequest } from 'src/jwt/types';
import { GAME_URI } from './constants';
import { GameService } from './service';
import { ConfigService } from '@nestjs/config';
import { Guess } from './entities/guess.entity';
import { Configuration } from 'src/config/configuration';
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
  private cluesContract: string;

  constructor(
    private gameService: GameService,
    private nearService: NearService,
    configService: ConfigService<Configuration>,
  ) {
    const nearConfig = configService.get('near', { infer: true });

    this.cluesContract = nearConfig.cluesContract;
  }

  @UseGuards(JwtAuthGuard)
  @Get('scene/:sceneId')
  async verifyOwnership(
    @Param('sceneId') sceneId: string,
    @Request() req: JwtValidatedRequest,
    @Response() res: express.Response,
  ) {
    const viewResult = await this.gameService.findSceneById(sceneId);

    const stakedClues = await this.nearService.getNftTokensForOwner(
      this.cluesContract as string,
    );

    viewResult.clues = (await Promise.all(
      viewResult.clues.map(async (clues) => {
        const isOwner = req.user.clues.includes(clues.nft_id as never);
        const isStaked = stakedClues.includes(clues.nft_id as never);

        return {
          ...clues,
          isOwner,
          placeholder: null,
          isStaked: !isStaked,
          description: isOwner || isStaked ? clues.description : null,
          media: isOwner || isStaked ? clues.media : clues.placeholder,
        };
      }),
    )) as any;

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

    // TODO: Discount ticket on clues contract
    try {
      await this.nearService.discountTicket({
        guessHash: body.hash,
        accountId: req.user.accountId,
      });
    } catch (e) {
      console.warn(e);

      return res
        .status(400)
        .json({ success: false, error: 'Invalid permission for key' });
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
    let viewResult = await this.gameService.findAllClues();

    const stakedClues = await this.nearService.getNftTokensForOwner(
      this.cluesContract as string,
    );

    viewResult = (await Promise.all(
      viewResult.map(async (clues) => {
        const isOwner = req.user.clues.includes(clues.nft_id as never);
        const isStaked = stakedClues.includes(clues.nft_id as never);

        return {
          ...clues,
          isOwner,
          placeholder: null,
          isStaked: !isStaked,
          isMinted: true,
          description: isOwner || isStaked ? clues.description : null,
          media:
            isOwner || isStaked ? clues.media_small : clues.placeholder_small,
        };
      }),
    )) as any;

    return res.status(viewResult ? 200 : 403).json(viewResult);
  }
}
