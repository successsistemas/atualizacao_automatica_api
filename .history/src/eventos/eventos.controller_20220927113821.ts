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
import fetch from "node-fetch";

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

	@Get('teste')
	async getTeste() {
		return await fetch("http://177.69.195.4/FrameHTML/RM/API/TOTVSEducacional/AvaliacaoAlunoPeriodoLetivo", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
				"cookie": "DefaultAlias=CorporeRM; _ga=GA1.1.1975084353.1656000299; ASP.NET_SessionId=pvjjqrhuhh4nizc5mtyr1cvl; RMAuthForm=E17A691DF714CA62B8C87DC2211836794AE2552D24F78F58332B635D293204D81814C47BFDFD36A7280CE59161CF34144B1897C94B6D1AD8F97D554FDE97BC5AE7557C7F760006EAD749E2886D6FCF46A74A2683AAE833A892C3B1BDC79091E09AE0E0BBFE37167228613E0AFC7A432D; .ASPXAUTH=2EEB043CF0E5308C3ACBAF80B60B96B83FE859B8F226E78B0D45A2A843E6DBD2054EE342D0CF921CC8E120B2748E4347B29047C6E9DC9CF29A04BBAB3BC02A7B0332C2C4EDE06A6ADF7D4FC1730E571F0435B2B108320B287D571C785D329486; CorporePrincipal=MVZPU282Vm5pQjFjSndlMlZlVVZvYVpPbmtHRDQyc0w0TEJKTFIxSG9yVTRFQ3lFem1LbUVjY1JYZEU3NXA2ZzB6S2lIekVHck40YlQwR0pqRld5cEQyVGZpZDhKNUtiVmVFSkxyTEZodDZFTml5b2crUGhQR1ZFV0pIbnF1eCt2ZEw4U2lkUW1RTUZveFRGaENXV09NNG1YZ2Z6WHVLWHp4eTZQSCs2aUI5dGgwTVhSNUVvbG1LSTJxWDF5Z0U5NUZWQkRwVnZYNEdPK0hqNkh6bXduNHp5OUFJNGQxTE8wT1NOc3p5WHJNQmZiS3dsL2xPY2JBU2JvVHVFNGJ0d09OazlRLzcySi9VakxGdXRWeTdPQ2dsakRqT3NMeGNvaXRIWFg2cXgxakdtanJMWG1oVFVIV1FWdmZ5YS9iVjdSYXZpc0dZVW5pUmdoQk1MaXoxekdnL2FKTnRtM2p5S1VHdEZXOUNvckp5REdVWlh5bk55VVVGbXJiTWNBa2FEVHJ6MnhIN2hIZ2FjRnFSanNnczlPSkM2YklFSVhsVW4zWTNacGYrcVdnY3cwUWpYaHpyYy8vZTl5UWg5Q1lHZC84NS83Lzc0d0VKcnBQb1V5YUVLT0hKWDBseko0ZExqUTNqME9IaFNYM0tqVjR3a3l1emRFeUM5eEpYM3dyZjlpeFlrNi9GR2tlMmRpSkNXbnhaN1BOTFhMb1ZlbjFVakNzSks0R0JqRUtucS9sVFdmdmNZRnpkdkk0Q25oMUhrSWw5SGlPRVRyeW9SN3EzenBtUFRhYkhOVHFwVHBtSkIyazhYUUtJRE82T0NtRGQxZXpHNURYRG1KQ1E2dllOSUFQNmdqc1RCdmU4bDEvZjRBL3VxSDVmeFhDSDZRWHV2eWhkd25mM2hBK0JjeGVyUEtFM0hscnhGYVVKL3J2TWpVcEFqSkpnRzltTm9vQjIrY3Y3dFFtVzBFZDY2L3J0eGswWEZZTE9mWWFRVXcwb2FsN0x6TzhVUHQ2bkpnQUJGS0MwM21mQXgrWlhLUHlqdWxpQkNSZEIvTGI1ZXBWalRhbHFyRzJOaHRyZktPVStLaGR5YnE2aDNtSU04ZndBeTZEdGdYK1YrbUVDaVFOKy9oaC8xOWJRVnhoWk4zNkNieVM3VXk1Qkd4cFJoU3NZTEh1M2tkZ05qSU9KQjBnejR4VVU0UkJDOVRraEdGWVpJRElOeTBIeHppM2wyVHlTcllmQ0lMVEQyc25QWjNobmxBcXZlTHFvVUtiU2EveDNwc1E2T2tjaXZHQ3c2NVViV2FBaGhtYTVOWXNrOVU4WkJQejFhWTNodlpvNHQ2bnRwanZTZ2lJOXhETkRTMFF1b0FmY3hyMVVsbE1wL2dsK01NM0ZrM2JXVDZjeENGMU1qZzJOU1p4RHNHaGJ3UXdpSFUxVjdXbVVNNEFDMm5YUmhVRlZ6SWxDTHltcXAyOG8wZE50cVlsSHVGcXJlZENtcHp2QjhSZVl6RGQ5K21xcW96NVF1S1JjSnVQQUFvdFEvRXlnaUlFTGZhdnd1WS9uSVEybktEeVNiZVRTaVVNbnhCMEUzblRqYmp5NGtoZS9sdU84YzlaWGlrQXlvNlpWalgwdzVTeUFGSE1YOUZVd1dFTUV5cFhCT1JmZnV2aWhDUmdQVXVZUWlvR1ZmVlpzZmxMYzNqWXlGYXlyV1B2cGhMT1VGdW5zdXkySTIvYmVHZlpuRmMwS0t1TExuTHdlSitOV1dnZFBkVG9Xc0tRSEczNTI0eW5Oc0k1REdnR1hTMk9UUzVZd05BbERZRTVQaTJIcktGRVRza0JHTGc2MFJLMDFMNzJDL3RZQVpyUVZDTitGaDdlWmVGWkF6MmdJekxJaVFpYzFLcTJQczIzYXhFOGZhVkpsaXhGTG5ZbEhFTElTN3B5RmhUUE5CTVZBRDZkTEFRaklGTjM4RTBFZVUyRUhIZ3grQ05VYUd6UnNZTGxHMXd0ZlIxZFdKZGtjOEJGek96MTYwSVVTUFMyQTducCsrc0xIYUxUb0ttdmlOMXBxQno1M3lqaHZHam9JM1cvYkdIb09xeGw4R01Nb29IZmx5bXdnNGhGa3lNRi9vZ0w0V2FVc1lPckk1cmgxVnVaMnJMcDZwQ2Yxd1VuSTdmQTZDdytuNWErQW5tMFpkZDRQK0NPYkZ2WmtWTHRkV0NZUjllNG44WndXNUZ5MEcxVzRGNlR0aUNaZ2RJZUsxd2I5dW1lL3hDTC9hVkxlR3EweGNVQk5qVjR5WElZRDNqNjV5YkZMV3ZkMmxoRDc5UzFheHNMVUgxd2w4K3FJMU5HakkrT2g1NWIzRVpIQjljWEVVamlxcm0rVEorYVhpTFF1NytGM2JNNUZUdTNlTUoyeVpwazdpOXJBb0FGV2s0Q1FRNHVxWjJkb2dFaCtkK1ExeERUU1hDQllsSG1UVkpNdXdSRUcwRXpkSUZ3cmd6YUU2V1k0eVBGSjhhWFI3WWxyWkhLTGQ4alRKSUxXUTFFWGYzNVNZbC9udllJNWdReUtqQldXNHM0RytsL1BMZmIxb1M0ekY0SyswNS82VStXN1ZDd1ZsekloRWozOVVBWkIvNHhuRVFkUlRweTZ0L3JuQVdrbkhSUGVIUzBreERBcXlrSGJ6a21Ic2Z1K2IyQ3FlVTYxdmZteExsbEFLbnE1dTdzbWNYbnRvajM3NVJZMEtpd290N09ESnJja2Qwbm0wRm1vU2xIY3FDL1R3UWtTQ3pMY3pQekxSTVcrckJJUDFkZ2svSWIrSHdOU0tzZCtvNVhJd2xaRGp2TlpXcU9CR2cxS3RvVWpURmtLejg2MUtWdVAvS01WdEZRRHZGTldESFdob2pIV2YzMHl5Qlg1Rzl6dzBMdGdraW5CTG5heE91VFR5MGwwc3VNdk5COEtCbk8vTkk5cStvVngydmE4YW80U1RrUFdHLy9pNVpGWHpTd3JnUjVDUFVscGVYS2lyZjdTMnJWZzF4bDRnTTBHaXZRPT0; EduContextoAlunoResponsavelAPI=\\C4Q\\B0\\D0\\E5r\\29f\\22\\0A\\F5\\E1\\D7\\A2j\\DA\\09\\5E\\D6\\99o\\B5P\\03\\0D\\27e\\9A\\3BM\\E6\\F5\\CB\\AA\\CBkx\\2Ez\\89d\\DE\\89H\\BFN\\2FD\\06\\E2\\04\\09\\AA\\B6\\D5\\AB\\B0\\CE\\B8\\E4\\801\\CC\\0C\\7C\\7BEW\\09\\ADm\\2CO\\5D\\BB\\89rs\\B0\\14\\05M\\19\\A2z\\99\\96y\\0D\\F3\\DDb\\60m\\E9\\F0\\E6\\CF\\86\\C0\\FF\\FC\\D4\\E0\\18\\CF7\\A5\\2F\\87\\D3\\29\\20y\\82\\E7Kb\\84\\EE8Z\\B1\\E8\\27zF\\B3\\A4\\2A\\FCZ\\2ED\\AE\\E1\\D2\\85\\28RqWM\\11\\AB\\1E\\A9\\EA\\E6\\9A\\FB\\E2\\BD\\22\\5D\\82\\18\\D5\\B2H\\D4\\5F\\E8\\ACQ\\9B\\E7\\FF\\F3\\8Fq\\17\\E4g\\A5\\AE\\09\\82\\D01\\8F\\B7\\21\\7F; EduMascaras={  \"mascaraTelefone\": \"(99) 99999?-9999\",  \"mascaraCEP\": \"99999-999\"}; _ga_NMRP9NLL67=GS1.1.1664287098.44.1.1664287113.0.0.0",
				"Referer": "http://177.69.195.4/FrameHTML/web/app/edu/PortalEducacional/",
				"Referrer-Policy": "strict-origin-when-cross-origin"
			},
			"body": null,
			"method": "GET"
		}).then(result => {
			console.log(result);
		}).catch(error => {
			console.log(error.message);
		});
	}

}
