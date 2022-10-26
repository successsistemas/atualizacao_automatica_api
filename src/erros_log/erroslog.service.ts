import { Injectable } from '@nestjs/common'
import { query } from 'express'
import knex from 'knex'
import * as moment from 'moment'
moment().locale('pt-br')
import { DatabaseService } from 'src/database/database.service'
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service'
import { Ocorrencia } from './types'

@Injectable()
export class ErrosLogService {
  constructor(
    private siteSuccess: SiteSuccessDatabaseService,
    private databaseService: DatabaseService
  ) {}

  async getContratos() {
    const conn = await this.siteSuccess.getConnection()
    const result = await conn
      .select(
        'codcon as codigo',
        'tposer as tipo_conexao',
        'nommaq as nome_maquina'
      )
      .from('cfgw')
    return result
  }
  async pagination(page: number, limite: number) {
    const conn = await this.siteSuccess.getConnection()
    const usuarios = await conn
      .select('praca', 'nome', 'email')
      .limit(limite)
      .offset((page - 1) * limite)
      .from('usuarios')
      .orderBy('nome', 'asc')
    const total = await conn.count('IdUsuario as quant').from('usuarios')

    const conn2 = await this.databaseService.getConnection()
    const result2 = await conn2.select('*').from('erros_logs')
    console.log(result2)

    return {
      usuarios,
      total: Number(total[0].quant),
    }
  }
  async getErros(page: number, limite: number, start: string, end: string) {
    const start_date = moment(start, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const end_date = moment(end, 'DD-MM-YYYY').format('YYYY-MM-DD')

    const conn = await this.databaseService.getConnection()
    const query = conn
      .select(
        'contrato',
        'id',
        'titulo',
        'detalhe',
        'versao',
        'data_ocorrencia',
        'programa',
        'os'
      )
      .from('erros_logs')
      .whereBetween('data_ocorrencia', [end_date, start_date])

    const queryTotal = query
      .clone()
      .select()
      .count('id as quant')
      .from('erros_logs')
      .groupBy('id')

    query.limit(limite).offset((page - 1) * limite)

    //console.log(queryTotal.toQuery())
    const totalRegistro = await conn.raw(
      `select count(id) as total from (${queryTotal.toQuery()}) as total`
    )

    const total = await queryTotal
    // const total = await conn.count('id as quant').from('erros_logs')

    const erros = await query

    const usuariosAfetados = await conn
      .count('contrato as quant')
      .from('erros_logs')
    // console.log(usuariosAfetados)

    return {
      erros,
      total: Number(totalRegistro[0][0].total),
    }
  }
  async getErroDetail(id: number) {
    const conn = await this.databaseService.getConnection()
    const erro = await conn
      .select('id', 'titulo', 'detalhe', 'data_ocorrencia', 'erro')
      .from('erros_logs')
      .where('id', '=', id)

    return {
      erro,
    }
  }

  async getChartData(start: any, end: moment.Moment): Promise<Ocorrencia[]> {
    const conn = await this.databaseService.getConnection()

    const query = conn.raw(
      `select CAST(data_ocorrencia AS DATE) as data_ocorrencia,
      count(*) as ocorrencia from erros_logs where data_ocorrencia between '${end.format(
        'YYYY-MM-DD'
      )}' and '${start.format('YYYY-MM-DD')}' group by data_ocorrencia
order by count(*) desc;`
    )
    // console.log(query.toSQL().toNative())

    const [result] = await query
    return result
  }

  async diasSemana() {
    const conn = await this.databaseService.getConnection()
    await conn.raw(`SET lc_time_names = 'pt_BR';`)

    const dias: any = await conn.raw(
      `
      select (
select count("id") as segunda from autualizacao_automatica.erros_logs where data_ocorrencia = current_date() 
) as sete,
(
select count("id") as segunda from autualizacao_automatica.erros_logs where data_ocorrencia = current_date() -1
) as seis,
(
select count("id") as segunda from autualizacao_automatica.erros_logs where data_ocorrencia = current_date() -2
) as cinco,
(
select count("id") as segunda from autualizacao_automatica.erros_logs where data_ocorrencia = current_date() -3
) as quatro,
(
select count("id") as segunda from autualizacao_automatica.erros_logs where data_ocorrencia = current_date() -4
) as tres,
(
select count("id") as segunda from autualizacao_automatica.erros_logs where data_ocorrencia = current_date() -5
) as dois,
(
select count("id") as segunda from autualizacao_automatica.erros_logs where data_ocorrencia = current_date() -6
) as um,
(
select date_format(current_date() , "%d %a")
) as seteData,
(
select date_format(current_date() -1, "%d %a")
) as seisData,
(
select date_format(current_date() -2, "%d %a")
) as cincoData,
(
select date_format(current_date() -3, "%d %a")
) as quatroData,
(
select date_format(current_date() -4, "%d %a")
) as tresData,
(
select date_format(current_date() -5, "%d %a")
) as doisData,
(
select date_format(current_date() -6, "%d %a")
) as umData;
      `
    )
    type DiaSemana = {
      dia: string
      ocorrencia: number
    }
    const array: DiaSemana[] = []

    array.push({ dia: dias[0][0].um, ocorrencia: dias[0][0].umData })
    array.push({ dia: dias[0][0].dois, ocorrencia: dias[0][0].doisData })
    array.push({ dia: dias[0][0].tres, ocorrencia: dias[0][0].tresData })
    array.push({ dia: dias[0][0].quatro, ocorrencia: dias[0][0].quatroData })
    array.push({ dia: dias[0][0].cinco, ocorrencia: dias[0][0].cincoData })
    array.push({ dia: dias[0][0].seis, ocorrencia: dias[0][0].seisData })
    array.push({ dia: dias[0][0].sete, ocorrencia: dias[0][0].seteData })

    var total = array.reduce(
      (total, numero: DiaSemana) => total + Number(numero.dia),
      0
    )
    return { array, total }
  }
}
