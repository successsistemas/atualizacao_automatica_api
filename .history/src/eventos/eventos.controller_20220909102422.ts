import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/utils/currentUser';
import { UsuarioBody, UsuarioTDO } from 'src/tdo/usuarioDTO';
import { EventosService } from './eventos.service';
import { EventoTDO } from './tdo/eventoTDO';

@Controller("eventos")
export class EventosController {
	constructor(private readonly eventosService: EventosService) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard)
	async createEvento(@Body() payload: EventoTDO, @CurrentUser() user: UsuarioBody) {
		const result = await this.eventosService.createEvent(user, payload);
		return result;
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getEventos(@CurrentUser() user: UsuarioBody) {
		return await this.eventosService.getEventos(user);

	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getCarrinho(@CurrentUser() user: UsuarioBody) {
		return await this.eventosService.getCarrinho(user);

	}

	@Get("all")
	async getAllEventos() {
		return await this.eventosService.getAllEventosForClientes();

	}

	@Get("/:evento_id")
	@UseGuards(JwtAuthGuard)
	getEvento(@CurrentUser() usuario: UsuarioBody, @Param('evento_id') id: number) {
		return this.eventosService.findOne(usuario, id)
	}

	@Get("md5/:md5_hash")
	@UseGuards(JwtAuthGuard)
	getEventoCliente(@Param('md5_hash') md5_hash: string) {
		return this.eventosService.findOneCliente(md5_hash)
	}

	@Get('edit')
	editEvento() {
		return { nome: this.eventosService.mostrar() }
	}
	@Get('delete')
	deleteEvento() {
		return { nome: this.eventosService.mostrar() }
	}
	@Put()
	@UseGuards(JwtAuthGuard)
	atualizarEvento(@CurrentUser() usuario: UsuarioBody, @Body() body: EventoTDO) {
		return this.eventosService.updateItem(usuario, body);
	}

	@Get('getEventByTitulo/:titulo')
	getEventByTitulo(@Param() parametro: any, @Query('data_inicial') dataInicial: string, @Query('data_final') dataFinal: string) {
		const initialDate = dataInicial[0];
		const finalDate = dataFinal[0];
		console.log(dataInicial, dataFinal)
		return this.eventosService.findByTitulo(parametro?.titulo, dataInicial, dataFinal)
	}



	@Get("teste/download")
	getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
		const file = createReadStream(join(process.cwd(), 'pack.rar'));

		res.set({
			'Content-Type': 'application/zip',
			'Content-Disposition': 'attachment; filename="pack.rar"',
		});

		return new StreamableFile(file);
	}
}
