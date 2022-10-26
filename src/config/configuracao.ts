export default () => ({
  chaveCripto: process.env.CHAVE_CRIPTO,
  clientUrl: process.env.URL_CLIENT,
  siteSuccess: {
    host: process.env.SITE_SUCCESS_DB_HOST,
    port: parseInt(process.env.SITE_SUCCESS_DB_PORT ?? '3306', 10),
    user: process.env.SITE_SUCCESS_DB_USER,
    password: process.env.SITE_SUCCESS_DB_PASSWORD,
    name: process.env.SITE_SUCCESS_DB_NAME,
  },
  atualizacaoAutomatica: {
    host: process.env.ATUALIZACAO_DB_HOST,
    port: parseInt(process.env.ATUALIZACAO_DB_PORT ?? '3309', 10),
    user: process.env.ATUALIZACAO_DB_USER,
    password: process.env.ATUALIZACAO_DB_PASS,
    name: process.env.ATUALIZACAO_DB_DATABASE,
  },
})
