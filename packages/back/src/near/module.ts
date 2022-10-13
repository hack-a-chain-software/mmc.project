import { Module } from '@nestjs/common';
import { connectionProvider } from './connection.provider';
import { NearService } from './service';

@Module({
  imports: [],
  controllers: [],
  providers: [NearService, connectionProvider],
  exports: [NearService],
})
export class NearModule {}
