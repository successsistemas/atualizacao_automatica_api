import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { SiteSuccessDatabaseService } from './database/site-success-database.service';

@Injectable()
export class AppService {
  constructor(private siteSuccessDatabaseService: SiteSuccessDatabaseService) { }
  getHello(): string {

    const conn = this.siteSuccessDatabaseService.getConnection();


    return 'Hello World!';
  }
}
