import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service';
import { UsuarioBody } from 'src/tdo/usuarioDTO';
import { EventoTDO } from './tdo/eventoTDO';
import { Knex } from 'knex';
import { Md5 } from 'md5-typescript';
import { uid } from 'uid';
import { query } from 'express';

@Injectable()
export class EventosService {
	constructor(private readonly siteSuccess: SiteSuccessDatabaseService) { }

	async createEvent(usuario: UsuarioBody, evento: EventoTDO) {
		try {
			const conn = await this.siteSuccess.getConnection();
			const query = conn.raw(
				`insert into eventos values
			(
				default,
				"${evento?.titulo}",
				"${evento?.data_inicial}",
				"${evento?.data_final}",
				${usuario?.userId}, 
				'${evento?.html}',
				'${Md5.init(uid()).toString()}')`);

			await query
			return evento;
		} catch (err) {
			throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
		}

	}
	async getEventos(usuario: UsuarioBody) {
		const query = await this.siteSuccess.getConnection();
		//const resultado = await query.select("*").from("eventos").where('id_usuario', '=', usuario.userId);
		const resultado = await query.raw(
			`select
			 eventos.id, eventos.titulo, eventos.data_inicial, eventos.data_final, eventos.id_usuario, eventos.html,
			 usuarios.nome, eventos.hash_md5
			 from eventos
			 inner join usuarios on usuarios.IdUsuario =  ${usuario.userId}
			 where id_usuario = ${usuario.userId} order by eventos.data_inicial desc `
		)
		//query.destroy();
		return resultado[0];
	}
	async getAllEventosForClientes() {
		const query = await this.siteSuccess.getConnection();
		//const resultado = await query.select("*").from("eventos").where('id_usuario', '=', usuario.userId);
		const resultado = await query.raw(
			`select
			 eventos.id, eventos.titulo, eventos.data_inicial, eventos.data_final, eventos.id_usuario, eventos.html,
			 usuarios.nome, eventos.hash_md5
			 from eventos
			 inner join usuarios on usuarios.IdUsuario =  eventos.id_usuario order by eventos.data_inicial desc `
		)
		//query.destroy();
		return resultado[0];
	}

	async findOne(usuario: UsuarioBody, id: number) {
		if (!id) {
			throw new NotFoundException(`Evento com o id ${id} não existe`)
		}
		const query = await this.siteSuccess.getConnection();
		const resultado =
			await query.select("*").from("eventos")
				.where("id", "=", `${id}`).andWhere("id_usuario", "=", usuario.userId).limit(1);

		if (!resultado.length) {
			throw new NotFoundException(`Evento com o id ${id} não existe`)
		}
		return resultado;
	}

	async findOneCliente(md5_hash: string) {
		if (!md5_hash) {
			throw new NotFoundException(`Evento com o hash ${md5_hash} não existe`)
		}
		const query = await this.siteSuccess.getConnection();
		const resultado =
			await query.select("eventos.id", "eventos.titulo", "eventos.data_inicial", "eventos.data_final", "eventos.id_usuario", "eventos.html", "eventos.hash_md5", "user.nome", "user.empresa").from("eventos")
				.innerJoin("usuarios as user", 'eventos.id_usuario', "=", "user.IdUsuario")
				.where("hash_md5", "=", `${md5_hash}`).limit(1);

		if (!resultado.length) {
			throw new NotFoundException(`Evento com o hash ${md5_hash} não existe`)
		}
		return resultado;
	}

	async findByTitulo(titulo: string, dataInicial: string, dataFinal: string) {
		console.log(dataInicial, dataFinal)
		const db = await this.siteSuccess.getConnection();
		//console.log("service", dataInicial, dataFinal)
		let searchQuery = null;

		if (titulo.includes("")) {
			searchQuery = db.raw(`select * from eventos where data_inicial between
													"${dataInicial}" and "${dataFinal}";`);
		} else {
			searchQuery = db.raw(`select * from eventos where titulo like
													"%${titulo}%" and data_inicial between
													"${dataInicial}" and "${dataFinal}";`);
		}

		// searchQuery = db.raw(`select * from eventos where titulo like
		// 											"%${titulo}%" and data_inicial between
		// 											"${dataInicial}" and "${dataFinal}";`);




		const resultado = await searchQuery;
		return resultado[0];
	}
	mostrar() {
		return 2;
	}

	async getCarrinho(usuario: any) {
		const db = await this.siteSuccess.getConnection();
		const resultado = await db.raw(`select * from carrinho where user = ${usuario.id} limit 1"`);
		return resultado[0];
	}

	async updateItem(usuario: UsuarioBody, evento: EventoTDO) {
		if (!evento.hash_md5) {
			throw new BadRequestException(`Evento sem id_hash`)
		}
		const db = await this.siteSuccess.getConnection();
		try {
			const query = db.raw(`update eventos set titulo = '${evento?.titulo}', html = '${evento?.html}', data_inicial = '${evento?.data_inicial}', data_final = '${evento?.data_final}' where id_usuario = ${usuario?.userId} and hash_md5 = '${evento?.hash_md5}'`);
			const resultado = await query;
			console.log(query.toSQL())
			if (!resultado.length) {
				throw new NotFoundException(`Evento com o hash ${evento.hash_md5} não existe`)
			}
		} catch (e) {
			console.error(e)
			throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
		}
		throw new HttpException('Created', HttpStatus.CREATED);
	}
}
