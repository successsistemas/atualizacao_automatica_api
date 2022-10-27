import { ControleVersaoController } from './controle-versao.controller'
import { ControleVersaoService } from './controle-versao.service'
import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { DatabaseService } from 'src/database/database.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ControleVersaoController],
  providers: [ControleVersaoService, DatabaseService],
})
export class ControleVersaoModule {}
