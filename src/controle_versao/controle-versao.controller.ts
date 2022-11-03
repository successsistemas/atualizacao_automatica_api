import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { readdir, promises } from 'fs'
import { StatusCodes } from 'http-status-codes'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/utils/currentUser'
import {
  PaginationQueryVersaoTDO,
  SigleVersionQuery,
} from 'src/erros_log/PaginationQueryTDO'
import { UsuarioBody } from 'src/tdo/usuarioDTO'
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
  @UseGuards(JwtAuthGuard)
  @Get('sigle-version')
  getSingleVersion(@Query() query: SigleVersionQuery) {
    const { id } = query
    if (!id)
      throw new BadRequestException('Precisa de um Id para efetuar a busca.')
    return this.controleVersaoService.getSingleVersion(id)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(StatusCodes.NO_CONTENT)
  @Delete('sigle-version')
  deleteVersion(@Query() query: SigleVersionQuery) {
    const { id } = query
    if (!id)
      throw new BadRequestException(
        'Precisa passar um id para completar a operação.'
      )
    return this.controleVersaoService.deleteSingleVersion(id)
  }

  @UseGuards(JwtAuthGuard)
  @Put('sigle-version')
  atualizar(@Query() query: SigleVersionQuery, @Body() body: Versao) {
    const { id } = query
    if (!id)
      throw new BadRequestException(
        'Precisa passar um id para completar a operação.'
      )

    return this.controleVersaoService.edit(id, body)
  }
}
