import * as moment from 'moment'
import { DataGeradata } from 'src/erros_log/types'
moment().locale('pt-br')
export const gerarDatas = async (
  start: moment.Moment,
  end: moment.Moment,
  quantidadeDiasEntreDuasDatas: number
): Promise<DataGeradata[]> => {
  const datas: DataGeradata[] = []
  for (let x = 0; x <= Number(quantidadeDiasEntreDuasDatas); x++) {
    const model = {
      data: moment(new Date(start.format('l')))
        .subtract(x, 'd')
        .format('DD/MM/YYYY'),
      ocorrencia: 0,
    }
    datas.push(model)
  }
  return datas
}
