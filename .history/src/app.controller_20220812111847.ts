import { Controller, Get, UseGuards } from '@nestjs/common';
import { readFileSync } from 'fs';
import path from 'path';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { SiteSuccessDatabaseService } from './database/site-success-database.service';

@Controller("tratar-dados")
export class AppController {
  constructor(private readonly siteDatabase: SiteSuccessDatabaseService) { }


  @Get()
  async getHello() {

    try {
      const absolutePath = path.resolve('./dados.txt');
      console.log(absolutePath)
      // const buffer: Buffer = readFileSync(absolutePath);
      //return buffer.toString();
    } catch (e) {
      console.log(e)
      return e;
    }


  }
}
