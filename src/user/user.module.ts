import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { SiteSuccessDatabaseService } from 'src/database/site-success-database.service';

@Module({
    imports: [SiteSuccessDatabaseService],
    controllers: [UserController,],
    providers: [UserService, SiteSuccessDatabaseService],
    exports: [UserService, UserModule]
})
export class UserModule { }
