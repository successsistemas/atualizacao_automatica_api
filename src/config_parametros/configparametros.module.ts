import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service'
import { ConfigParametrosController } from './configparametros.controller'
import { ConfigParametrosService } from './configparametros.service'

@Module({
  imports: [SiteSuccessDatabaseService],
  controllers: [ConfigParametrosController],
  providers: [ConfigParametrosService, SiteSuccessDatabaseService],
})
export class ConfigParametrosModule {}
