
import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/utils/currentUser';
import { UserService } from './user.service';

@Controller("user")
export class UserController {

	constructor(private userService: UserService) { }

	//usuario by decorator 
	@UseGuards(JwtAuthGuard)
	@Get()
	getUser(@CurrentUser() usuario: any) {
		return usuario;
	}

} 
