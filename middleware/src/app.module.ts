import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PythonApiService } from './python.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainDisputeService } from './domainDisputeConnecter.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Type of our database
      host: 'localhost', // Database host
      port: 3306, // Database port
      username: 'root', // Database username
      password: 'dudi2002', // Database password
      database: 'domaindispute', // Database name
      synchronize: true,
      driver: require('mysql2'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PythonApiService, DomainDisputeService],
})
export class AppModule {}
