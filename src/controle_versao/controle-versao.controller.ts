import { Controller, Get, Post } from '@nestjs/common'
import { readdir, promises } from 'fs'
import { ControleVersaoService } from './controle-versao.service'

@Controller('controle-versao')
export class ControleVersaoController {
  constructor(private controleVersaoService: ControleVersaoService) {}
  @Post()
  criarVersao() {
    return this.controleVersaoService.teste()
  }
  @Get('versionnames')
  async getFilesName() {
    const files = await promises.readdir('./versoes')
    return files
    //return await this.controleVersaoService.getVersionsFileName()
  }
}
