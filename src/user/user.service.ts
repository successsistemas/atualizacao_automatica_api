

import { Injectable } from '@nestjs/common';
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service';
import { UsuarioTDO } from 'src/tdo/usuarioDTO';

@Injectable()
export class UserService {
	constructor(private readonly siteSuccess: SiteSuccessDatabaseService) { }

	async findUserByUser(usernName: string, senha: string): Promise<UsuarioTDO> {

		const result = await this.siteSuccess.getConnection();
		const dadosUsuario = await result.select("*").from("usuarios").where("usuario", "=", usernName).andWhere("senha", "=", senha).limit(1);

		const user: UsuarioTDO = {
			IdUsuario: 0,
			nome: dadosUsuario[0]?.nome,
			senha: dadosUsuario[0]?.senha,
			usuario: dadosUsuario[0]?.usuario
		}
		return user;
	}

	async findByUser(username: string) {

		const conn = await this.siteSuccess.getConnection();
		const usuario = await conn.select("*").from("usuarios").where("usuario", "=", username).limit(1);
		return usuario[0];

	}

}
