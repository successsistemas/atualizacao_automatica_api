import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { readdir, promises } from 'fs'
import { PaginationQueryVersaoTDO } from 'src/erros_log/PaginationQueryTDO'
import { ControleVersaoService } from './controle-versao.service'
import { Versao } from './types'

@Controller('controle-versao')
export class ControleVersaoController {
  constructor(private controleVersaoService: ControleVersaoService) {}

  @Get()
  async getVersions(@Query() query: PaginationQueryVersaoTDO) {
    const { page, limit } = query
    return await this.controleVersaoService.getVersoes(page ?? 1, limit ?? 5)
  }

  @Post()
  criarVersao(@Body() versao: Versao) {
    return this.controleVersaoService.criarVersao(versao)
  }
  @Get('versionnames')
  async getFilesName() {
    return this.controleVersaoService.getVersionsFileName()
  }
}
