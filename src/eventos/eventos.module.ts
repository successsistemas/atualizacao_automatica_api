import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';

import { Module } from '@nestjs/common';
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service';

@Module({
    imports: [SiteSuccessDatabaseService],
    controllers: [EventosController],
    providers: [EventosService, SiteSuccessDatabaseService],
    exports: [SiteSuccessDatabaseService]
})
export class EventosModule { }
