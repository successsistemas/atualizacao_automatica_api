
import { Request } from "express";
import { UsuarioTDO } from "src/tdo/usuarioDTO";

export interface AuthRequest extends Request {
	user: UsuarioTDO;
}