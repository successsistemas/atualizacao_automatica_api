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


@Controller("tratar-dados")
export class AppController {
  constructor(private readonly siteDatabase: SiteSuccessDatabaseService) { }


  @Get()
  async getHello() {


    aiml.parseFile('sample.aiml', function (err, topics) {
      var engine = new aiml.AiEngine('Default', topics, { name: 'Jonny' });
      var responce = engine.reply({ name: 'Billy' }, "Hi, dude", function (err, responce) {
        console.log(responce);
      });
    });

  }



}
