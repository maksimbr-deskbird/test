import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { User } from './users/entities/user.entity';
import { Patient } from './patients/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production' 
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User, Patient],
            synchronize: false,
            ssl: { rejectUnauthorized: false },
            logging: false,
          }
        : {
            type: 'sqlite',
            database: 'patients.db',
            entities: [User, Patient],
            synchronize: true,
            logging: true,
          }
    ),
    AuthModule,
    UsersModule,
    PatientsModule,
  ],
})
export class AppModule {} 