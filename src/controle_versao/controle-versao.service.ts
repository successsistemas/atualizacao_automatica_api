import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'
import { readdir } from 'fs'
@Injectable()
export class ControleVersaoService {
  constructor(private databaseService: DatabaseService) {}

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
      readdir('./versoes', (error, files) => {
        console.log(files)
        return files
      })
    } catch (e) {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentar efetuar a leitura dos arquivos'
      )
    }
  }
}
