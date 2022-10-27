import { ControleVersaoModule } from './controle_versao/controle-versao.module'
import { ErrosLogController } from './erros_log/erroslog.controller'
import { ErrosLogService } from './erros_log/erroslog.service'
import { ErrosLogModule } from './erros_log/erroslog.module'
import { ConfigParametrosService } from './config_parametros/configparametros.service'
import { ConfigParametrosModule } from './config_parametros/configparametros.module'
import { EventosModule } from './eventos/eventos.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import configuracao from './config/configuracao'
import { DatabaseModule } from './database/database.module'
import { SiteSuccessDatabaseService } from './database/site-success-database.service'
import { UserModule } from './user/user.module'
import { DatabaseService } from './database/database.service'
import { ControleVersaoService } from './controle_versao/controle-versao.service'
import { ControleVersaoController } from './controle_versao/controle-versao.controller'

@Module({
  imports: [
    ControleVersaoModule,
    ErrosLogModule,
    ConfigParametrosModule,
    EventosModule,
    AuthModule,
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuracao],
      isGlobal: true,
    }),
  ],
  controllers: [ErrosLogController, AppController, ControleVersaoController],
  providers: [
    ControleVersaoService,
    ErrosLogService,
    ConfigParametrosService,
    SiteSuccessDatabaseService,
    AppService,
    DatabaseService,
  ],
})
export class AppModule {}
