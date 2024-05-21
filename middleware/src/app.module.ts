import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { PythonApiService } from './python.service';
import { DomainDisputeService } from './domainDisputeConnecter.service';
import { EmailService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      driver: require('mysql2'),
    }),    
  ],
  controllers: [AppController],
  providers: [EmailService, PythonApiService, DomainDisputeService],
})
export class AppModule {}
