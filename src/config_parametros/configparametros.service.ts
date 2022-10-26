import { BadRequestException, Injectable } from '@nestjs/common'
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service'
import { UsuarioBody } from 'src/tdo/usuarioDTO'
import { ConfigParamTDO } from './types'

@Injectable()
export class ConfigParametrosService {
  constructor(private siteSuccess: SiteSuccessDatabaseService) {}

  async getConfig(user: UsuarioBody) {
    const conn = await this.siteSuccess.getConnection()
    try {
      const result = await conn.raw(
        `select * from configuracao_parametro_logs limit 1`
      )
      return result[0]
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  async setConfig(body: ConfigParamTDO, user: UsuarioBody) {
    const conn = await this.siteSuccess.getConnection()
    const config = await this.getConfig(user)
    const result = config[0]?.id_usuario ? true : false
    try {
      if (result) {
        return await conn.raw(
          `update configuracao_parametro_logs set id_usuario = '${user?.userId}', em_dias = ${body.tempo_eliminacao_log}`
        )
      } else {
        return await conn.raw(
          `insert into configuracao_parametro_logs values(1, '${user.userId}', ${body.tempo_eliminacao_log})`
        )
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
