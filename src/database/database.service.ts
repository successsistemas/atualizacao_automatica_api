import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import knexFn, { Knex } from 'knex'
import { getOrCreateKnexInstance } from './knexCache'

@Injectable()
export class DatabaseService {
  private knex: Knex
  private registroRestaurado: any
  constructor(configService: ConfigService) {
    const host = configService.get('atualizacaoAutomatica.host')
    if (!host)
      throw new Error(
        'VARIAVEL DE AMBIENTE SITE_SUCCESS_DB_HOST NÃO CONFIGURADA!'
      )
    const port = configService.get('atualizacaoAutomatica.port')
    if (!port)
      throw new Error(
        'VARIAVEL DE AMBIENTE ATUALIZACAO_DB_PORT NÃO CONFIGURADA!'
      )
    const user = configService.get('atualizacaoAutomatica.user')
    if (!user)
      throw new Error(
        'VARIAVEL DE AMBIENTE ATUALIZACAO_DB_USER NÃO CONFIGURADA!'
      )
    const password = configService.get('atualizacaoAutomatica.password')
    if (!password)
      throw new Error(
        'VARIAVEL DE AMBIENTE ATUALIZACAO_DB_PASS NÃO CONFIGURADA!'
      )
    const database = configService.get('atualizacaoAutomatica.name')
    if (!database)
      throw new Error(
        'VARIAVEL DE AMBIENTE ATUALIZACAO_DB_NAME NÃO CONFIGURADA!'
      )

    this.registroRestaurado = {
      servidor: host,
      banco: database,
      usuario: user,
      senha: password,
      porta: port,
      servidorHex: host,
      bcohex: database,
    }

    this.knex = knexFn({
      client: 'mysql2',
      connection: {
        host,
        port,
        user,
        password,
        database,
      },
    })
  }
  async getConnection() {
    const conn = await getOrCreateKnexInstance(this.registroRestaurado)
    return conn
  }
}
