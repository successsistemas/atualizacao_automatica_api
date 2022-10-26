import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/utils/currentUser'
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service'
import { UsuarioBody } from 'src/tdo/usuarioDTO'
import { ConfigParametrosService } from './configparametros.service'
import { ConfigParamTDO } from './types'

@Controller('config-parametros')
export class ConfigParametrosController {
  constructor(private configurarParametros: ConfigParametrosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  configurar(@Body() body: ConfigParamTDO, @CurrentUser() user: UsuarioBody) {
    this.configurarParametros.setConfig(body, user)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  get(@CurrentUser() user: UsuarioBody) {
    return this.configurarParametros.getConfig(user)
  }
}
