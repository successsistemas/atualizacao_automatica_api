import { Controller, Get, UseGuards } from '@nestjs/common';
import { readFileSync } from 'fs';
import path from 'path';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { SiteSuccessDatabaseService } from './database/site-success-database.service';
import fetch from "node-fetch";

var aiml = require('aiml');

const simsimi = require('simsimi')({
  key: 'WvFEWdgBE4ua.RJUY4NxyInc..TXycxR3Rf3ga1b',
});


@Controller("tratar-dados")
export class AppController {
  constructor(private readonly siteDatabase: SiteSuccessDatabaseService) { }


  @Get()
  async getHello() {


    aiml.parseFile('sample.aiml', function (err, topics) {
      var engine = new aiml.AiEngine('Default', topics, { name: 'Jonny' });
      var responce = engine.reply({ name: 'Billy' }, "Hi, dude", function (err, responce) {
        console.log(responce);
      });
    });

    // return await fetch("http://177.69.195.4/FrameHTML/RM/API/TOTVSEducacional/DisciplinasAlunoPeriodoLetivo?mostraApenasDiscEmCurso=false", {
    //   "headers": {
    //     "accept": "application/json, text/plain, */*",
    //     "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    //     "cookie": "DefaultAlias=CorporeRM; _ga=GA1.1.1975084353.1656000299; ASP.NET_SessionId=pvjjqrhuhh4nizc5mtyr1cvl; EduMascaras={  \"mascaraTelefone\": \"(99) 99999?-9999\",  \"mascaraCEP\": \"99999-999\"}; RMAuthForm=F75E1A2B76D675449184B638FFD16EB6D2807D1803780DDA8322823F89B03D7349A102A675278A68899775141182E4CDCA997A38021A0CE0C64015B17ADAB28D71A21E42CF23FE8E51B8247580DD993893252DA5520F5A6C92D1E55224D7DB05A8BC6DE9ACBEEC924822454B062E3DA1; .ASPXAUTH=182067FFAE0523E86F7EDE7AEE32E05A83373818F8164AEB5A7421D0258BC05A0CCCC1E5A47B972610F369629E08C3F50413853497AA537679C20BEB2710B4376FCD11B54345FE4A9467FFFB409E53A8FC55D46893B4800578A93D440A497453; CorporePrincipal=ZUJvUGd6NTgvb2dPYWgxVmZFZ2NTQ0xRLzc0U1ZUaWtGeVF0bWloYmdEVGhTaEhHbFBlQkhYOWFNN2VCYXJmNVpuQUJJV21tMmNaVllndEdJNmdKR3YwYTRLclk3aUZqYThUd2t3ZDFEaWdoMEVjZHhGRDFBU2pCbW55d2NFalRmdjFFT2FUZmVNdjNXQmFVNGZZTkFqbHZuOFFOekNRdTR5eUZvWld4NXB3RXVmMWx5VWZJNDU3eFdYUldGQ1JQUVhFMGhIbmYwVXg4bWRwczVwYXVmemxnYUgrczJyMXl4blZhSGQ0Rmk1TkVUdklib1Vndys4V3VIaC9QMG5RSnliRXFTejZRRVF3dkxSVm9BQXlNVWlZakcya1R2WXZsZzkyTXpWczJjZU8rc2p1R3d0SzRxSVo4Q0dVQThqMStKTDdvZVV5SFFHSlM2MzloTXZrK3NIc0Z2YmlkWmpONXVNUmhsZ0VJNU1SNG1IK3hEUXpsaHpSNU1CUEY5MzBLK3J1S2hiRU9BOUFWejgzNmlqWEJEUzlqVkRsWDNySmN2K1lTcVVoYnE5czRkVURjOWVVc3pyeFpSNGNvQkp5RnVJend2N2hlY1VseXpFU2hrYzc0a0VTRCtMSElpMjRCV0lxUXRrL1dxZnpXOTNwVStrdGtpd0lwZ21FMTZNWnN5dDQxeEFsMTlITitlRHdXVVZndnhSZDVRZE9SV2t2Q2dQcjZldXM1TWZGdXAvSFFnMUQrSWxkVHdXOVNjbHc5RHQ1UHVwdktGNkhGaWppRUkrVGh0MCt1R1NCQ0ZROTA3RTh2WXgwVFBoMm40TVhuVzVHdE5ieUdOTEFtN05vRld6bEozOEpzdGpyOHkzTXEzZEkxbEhSUFFITEZhZUh2d1V6c1llbHNUOHJIcC82cmtiVzRoRjFFdXRqZ1ltZWJpMmFnWW14aDNMcDN4U3M3YVh5c2JDUjFPcENCOXQyL2FkV1UvVTJEYS8xelZMbGFlY1RJRnd6cnh0SVdsUk1CV3l5OG9pVnBrdkxNdy84OEcxdW5YTGhPS012Tno1bFhDQUh3eUlXT20zVDQ5UWZUOGp2SkdPODFKSXlzdUVESWs3TncrR1ArR3BMbUFUS3E3b1N4b0ZDSGN1Q2pNRXJMT2dkZXltaFV3cjFNNnZHVElFOHlNSnJyYnE5dlhnTmhLT3lNbURROEtsL0pQNFVFRThtUG8wLzBvRlVqZFlZRWIzZFhPOVdpSjgxOC9GMUE1a1V4WFIxU2V6bzVkZEVubWVXOERrNjN6MzhnaTJabVZGbXQ2bE1LNzNjcFdMNENEemJjYmdaU2ZHUEs1b3RPRlZISnp6Rm4vakdZaWkzOGVPM3FvS3diODZyRSsxQk1ETUovc2FLdWhsQVdDNjJJV0t1ckZZWjd5MlBQWVVqK0ZjZFlwaHhJR3NkM0RqUnpMU3hucXdDa29tN3dYaEVDUVFKNGNNVWdja2NhMkRzOUNZUUlqYU83eVJmZVg1eVoxaTJQNUpvY2t6YUNEeWRQbi92Z0RFZktLdTFwOHVBN1p1ZEc3MnQvT1hKQXRVT01EWUg2WW02NnRld3hEcm9uSjJmQmV0TURLOUNXaXIxNERSUWc3Y0pRMm53ZUhCMzRTQzBLUTMwdEIvYzhuSG5wTjZFa0p0eXFsY3laajl6M0dZaU5SSDR2N2NreXE0Z2trVDNiczQ4RG9sTkhmVVhrVkM2c3hmTUFTa1Z3ZXhMbGVWK0lNMG1rUkhmNzIxOXhWN0g3ZysyR3NtMkQ0YjJBOXQ1NCtpU3FlYVB0UUExb2NuaU5yRUs4OFdDNFRaT0NRNWZrRXZXQ1lZdnhkYzlpdlkwQm8vdHNQcG96VGlxMmp6N0g4ZmxVTWdVY3ZGUEFOc05JdUt1djJzbm1ybDFHM2tZZEMrdmVRZmxtWGlldkZ1Z3FFaHBudncwSGJnUWw4MDNUTC9wVHI4a3d5YkFPWndVT0VIZ2ZaV2xPK0xUaVN0ODZDTFFIUGlpa1h2S2RBazBubkw5NWkvSFo0RVFDVS9CUnRIR2kremRoYVJxUW1hNjlUNTBSWWcySkZuS1oyMkNkREJicHd4YXZHTjBMV1p3MDFwVi93VUVNdWg0aFQvV3Q2M1FCRkNTYU1WWXZTOEhiQXJyeEJjV0V2LzduMFozRXN2VTFibWMwNXhEOUFDeEpWNDNRWGZWSzcxSFoyNmUydmxUQjhNTWNvWmt4QzJUeW5KajdlVlNxd3o4NE9yRk9LeTJsb3lXakxZd0UxTDgyU3UrSjlzY05ZNFJSYzRDL25VUWROQ1J0SngyZXVPeGZOMCt6SElCZ0VUUGpLVldUbElPbzZRMy9TWUVvSEtIZkNCQmVQM3lUM1pFWFpMRmJYS0FoOXl2cnBxTGVMa2ozUHkzMTM0TCtDc0xLZ2JGWlRPcUR3VUY0K3RlU01PQUNsdys5N3ZJU1RGMzQvOUVxbTNLSkdObkRRWjN2VXZnQ3I1OGFJcTg2VGgxK3Yxdm4vRmh5ZnJwRytjd1RnK1NETG1LeVdvcWlpSFZiRm0xbjYvdHZMMzNlYkY2ZVZzdStsTWV2TmhGbDJ5ZmQ3QXFNWTBOanI5MFRheDNGTS9UWXZSUDBBS2FhTnBneWh6YUx5M05EYjE3SWlQSSt3WXZlZldrUVJOUTk2aUswcWx6QjhBbjBFeGZ3YUhpVjdIQUp0enVBQS83M0prNHNHbzNFa2xoR1ovalJkV3RNVkxOVVVhUVFkUk5YTjhDKzl6aXZHTk9NdGtuODhoR3Y5Vm4wVVUrMmZDcTd6SXFhU3pTb0ZicHVyWUJZV1NNUGdhc3FDSzRseG0xMWlKSTdYYkVTaXdKM0JFWmNHbjZKZnhpZjBzQ3EwV3J0c3RMZjhYdkorTisySHE2NHpCNnRDR1A2V0FPZWU1ZVFiQ1NXNm0yaGgyS29uaHJKRlNyNXZ1TG55TUR0QVQvQkNyb1dkRGZ6MVBPNEpzWlBxcXZRRU5LQW5nPT0; EduContextoAlunoResponsavelAPI=\\C4Q\\B0\\D0\\E5r\\29f\\22\\0A\\F5\\E1\\D7\\A2j\\DA\\09\\5E\\D6\\99o\\B5P\\03\\0D\\27e\\9A\\3BM\\E6\\F5\\CB\\AA\\CBkx\\2Ez\\89d\\DE\\89H\\BFN\\2FD\\06\\E2\\04\\09\\AA\\B6\\D5\\AB\\B0\\CE\\B8\\E4\\801\\CC\\0C\\7C\\7BEW\\09\\ADm\\2CO\\5D\\BB\\89rs\\B0\\14\\05M\\19\\A2z\\99\\96y\\0D\\F3\\DDb\\60m\\E9\\F0\\E6\\CF\\86\\C0\\FF\\FC\\D4\\E0\\18\\CF7\\A5\\2F\\87\\D3\\29\\20y\\82\\E7Kb\\84\\EE8Z\\B1\\E8\\27zF\\B3\\A4\\2A\\FCZ\\2ED\\AE\\E1\\D2\\85\\28RqWM\\11\\AB\\1E\\A9\\EA\\E6\\9A\\FB\\E2\\BD\\22\\5D\\82\\18\\D5\\B2H\\D4\\5F\\E8\\ACQ\\9B\\E7\\FF\\F3\\8Fq\\17\\E4g\\A5\\AE\\09\\82\\D01\\8F\\B7\\21\\7F; _ga_NMRP9NLL67=GS1.1.1664289735.45.1.1664289818.0.0.0",
    //     "Referer": "http://177.69.195.4/FrameHTML/web/app/edu/PortalEducacional/",
    //     "Referrer-Policy": "strict-origin-when-cross-origin"
    //   },
    //   "body": null,
    //   "method": "GET"
    // }).then((result: any) => {
    //   return result;
    // });
  }



}
