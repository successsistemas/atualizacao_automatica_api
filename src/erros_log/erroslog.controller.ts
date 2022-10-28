import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  Response,
} from '@nestjs/common'
import { Response as Res } from 'express'
import * as moment from 'moment'
import { gerarDatas } from 'src/utils/util'
moment().locale('pt-br')
import { ErrosLogService } from './erroslog.service'
import { ErrorOrderByTDO, PaginationQueryTDO } from './PaginationQueryTDO'
import { DataGeradata, Ocorrencia } from './types'

@Controller('logs')
export class ErrosLogController {
  constructor(readonly errosLogService: ErrosLogService) {}
  @Get()
  getContratos() {
    return this.errosLogService.pagination(1, 5)
  }

  @Get('pagination')
  async pagination(@Query() query: PaginationQueryTDO, @Response() res: Res) {
    const { page, limit, end, start } = query

    if (!start || !end) {
      throw new BadRequestException(' cadê a data??')
    }

    const { total, erros } = await this.errosLogService.getErros(
      page ?? 1,
      limit ?? 5,
      start,
      end
    )
    return res
      .set({ 'x-total': Math.ceil(total / limit) })
      .json({ erros, total })
  }

  @Get('eventos-erro')
  getEventosErro() {
    return this.errosLogService.diasSemana()
  }

  @Get('orderBy')
  async errosById(@Query() query: ErrorOrderByTDO) {
    const { id } = query
    const { erro } = await this.errosLogService.getErroDetail(id)
    return erro[0]
  }

  @Get('datas')
  async getDatas(
    @Query('start') start_date: string,
    @Query('end') end_date: string
  ) {
    if (!start_date || !end_date) {
      throw new BadRequestException(
        'start_date ou end_date não pode ser nulos.'
      )
    }

    var start = moment(start_date, 'DD-MM-YYYY')
    var end = moment(end_date, 'DD-MM-YYYY')

    var quantidadeDiasEntreDuasDatas = moment.duration(start.diff(end)).asDays()

    //deixar número positivo
    if (quantidadeDiasEntreDuasDatas < 0) {
      quantidadeDiasEntreDuasDatas = quantidadeDiasEntreDuasDatas * -1
    }

    const result = await this.errosLogService.getChartData(start, end)

    let datas = await gerarDatas(start, end, quantidadeDiasEntreDuasDatas)

    result.forEach((element: Ocorrencia) => {
      const currentDate = moment(element.data_ocorrencia).format('DD/MM/YYYY')
      const dateString = currentDate.split('T')[0]
      datas.forEach((data: DataGeradata, index: number) => {
        if (data.data === dateString) {
          datas[index] = {
            data: data.data,
            ocorrencia: element.ocorrencia,
          }
        }
      })
    })
    datas.reverse()
    return datas
  }
}

//  @Get('datas')
//   async getDatas(
//     @Query('start') start_date: string,
//     @Query('start') end_date: string
//   ) {
//     const currentDate = new Date()
//     const currentDateString = moment(currentDate).format('DD-MM-YYYY')
//     var start = moment(start_date, 'DD-MM-YYYY')
//     var end = moment(end_date, 'DD-MM-YYYY')

//     const quantidadeDiasEntreDuasDatas = moment
//       .duration(start.diff(end))
//       .asDays()

//     console.log('quantidade:', quantidadeDiasEntreDuasDatas)
//     const datas = gerarDatas(5)
//     await this.errosLogService.getChartData()

//     return datas
//   }
