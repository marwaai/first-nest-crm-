import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Contact } from './contacts/contact.entity';
import { Company } from './companies/company.entity';
import { Deal } from './deals/deal.entity';
import { Activity } from './activities/activity.entity';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import {ContactsModule} from "./contacts/contacts.module"
import{DealsModule} from "./deals/deals.module"
import { RolesModule } from './roles/roles.module';
import {Permission} from "./roles/permission.entity"
import {Role} from "./roles/roles.entity"
import {SeedModule} from "./database/seed/seed.module"
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),

        entities: [User, Contact, Company, Deal, Activity,Permission,Role],
        synchronize: true,
        logging: true,
      }),
    }),

    UsersModule,
    AuthModule,
    CompaniesModule,
    ContactsModule,DealsModule, RolesModule,SeedModule
  ],
})
export class AppModule {}