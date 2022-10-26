import { Module } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service'
import { ErrosLogController } from './erroslog.controller'
import { ErrosLogService } from './erroslog.service'

@Module({
  imports: [SiteSuccessDatabaseService, DatabaseService],
  controllers: [ErrosLogController],
  providers: [SiteSuccessDatabaseService, ErrosLogService, DatabaseService],
})
export class ErrosLogModule {}
