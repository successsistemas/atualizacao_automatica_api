import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'
import { readdir, promises } from 'fs'
import { Versao } from './types'
@Injectable()
export class ControleVersaoService {
  constructor(private databaseService: DatabaseService) {}
  async criarVersao(versao: Versao) {
    try {
      const conn = await this.databaseService.getConnection()
      await conn.raw(
        `insert into versoes values(default, "${versao.versao}", "${versao.codigo}", current_timestamp(), "${versao.titulo}", "${versao.descricao}");`
      )
    } catch (e) {
      throw new BadRequestException()
    }
  }
  async teste() {
    readdir('./versoes', (error, files) => {
      console.log(files)
    })
    const conn = await this.databaseService.getConnection()
    const result = conn.select('*').from('erros_logs').limit(2)
    return result
  }
  async getVersionsFileName() {
    try {
      return await promises.readdir('./versoes')
    } catch (e) {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentar efetuar a leitura dos arquivos'
      )
    }
  }

  async getVersoes(page: number, limite: number) {
    const conn = await this.databaseService.getConnection()
    const query = conn.select().from('versoes')

    const queryTotal = query
      .clone()
      .select()
      .count('id as quant')
      .from('versoes')
      .groupBy('id')

    query.limit(limite).offset((page - 1) * limite)

    const totalRegistro = await conn.raw(
      `select count(quant) as total from (${queryTotal.toQuery()}) as total`
    )

    console.log(totalRegistro[0][0].total)

    //const total = await queryTotal
    // const total = await conn.count('id as quant').from('erros_logs')

    const versoes = await query

    // console.log(usuariosAfetados)

    return {
      versoes,
      total: totalRegistro[0][0].total,
    }
  }

  async getSingleVersion(id: string) {
    try {
      const conn = await this.databaseService.getConnection()
      const query = conn.select().from('versoes').where('id', '=', id)
      const result = await query
      if (result.length <= 0)
        throw new NotFoundException(`Versão com o id ${id} não foi encontrado`)
      return result
    } catch (e) {
      throw new InternalServerErrorException(e?.message)
    }
  }

  async edit(id: string, versao: Versao) {
    const conn = await this.databaseService.getConnection()
    const query = conn.select().from('versoes').where('id', '=', id)
    const result = await query
    if (result.length <= 0)
      throw new NotFoundException(`Versão com o id ${id} não foi encontrado`)

    const update = await conn
      .update(versao)
      .into('versoes')
      .where('id', '=', id)

    return update
  }

  async deleteSingleVersion(id: string) {
    const conn = await this.databaseService.getConnection()
    const query = conn.select().from('versoes').where('id', '=', id)
    const result = await query
    if (result.length <= 0)
      throw new NotFoundException(`Versão com o id ${id} não foi encontrado`)
    const resultDelete = conn
      .delete()
      .from('versoes')
      .where('id', '=', id)
      .then(result => {
        console.log(result)
      })
      .catch(error => {
        throw new BadRequestException(error?.message)
      })
    console.log(resultDelete)
    return result
  }
}
