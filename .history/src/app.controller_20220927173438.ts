import { Controller, Get, UseGuards } from '@nestjs/common';
import { readFileSync } from 'fs';
import path from 'path';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { SiteSuccessDatabaseService } from './database/site-success-database.service';
import fetch from "node-fetch";

var aiml = require('aiml');

const simsimi = require('simsimi')({
  key: 'WvFEWdgBE4ua.RJUY4NxyInc..TXycxR3Rf3ga1b',
});


@Controller("api")
export class AppController {
  constructor(private readonly siteDatabase: SiteSuccessDatabaseService) { }


  @Get("nivel-feiura")
  async getHello() {
    return { feitura: "76%" }
  }



}
