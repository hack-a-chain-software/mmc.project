import { Controller, Get, Response, Request, UseGuards, Param } from '@nestjs/common';
import * as express from 'express';
import { JwtAuthGuard } from 'src/jwt/auth.guard';
import { JwtValidatedRequest } from 'src/jwt/types';
import { NFT_URI } from './constants';
import { NftService } from './service';

@Controller(NFT_URI)
export class NftController {
    constructor(private nftService: NftService) { }

    @UseGuards(JwtAuthGuard)
    @Get('verify/:tokenId')
    async verifyOwnership(
        @Param('tokenId') tokenId: string,
        @Request() req: JwtValidatedRequest,
        @Response() res: express.Response
    ) {
        const viewResult = await this.nftService.getNft(tokenId);

        const accountMatches = viewResult?.['owner_id'] == req.user.accountId ?? false;

        return res.status(accountMatches ? 200 : 403).end();
    }
}
