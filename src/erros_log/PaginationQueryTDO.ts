export type PaginationQueryTDO = {
  limit: number
  page: number
  start: string
  end: string
}
export type PaginationQueryVersaoTDO = {
  limit: number
  page: number
}
export type ErrorOrderByTDO = {
  id: number
}

export interface Empresa {
  razaoSocial: string
}

export type PessoaTDO = {
  nome: string
  cpf: string
  data_nascimento: string
  cep: string
}
