import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { PythonApiService } from './python.service';
import { DomainDisputeService } from './domainDisputeConnecter.service';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppModule', () => {
  let app: INestApplication;
  let appController: AppController;
  let pythonApiService: PythonApiService;
  let domainDisputeService: DomainDisputeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    appController = module.get<AppController>(AppController);
    pythonApiService = module.get<PythonApiService>(PythonApiService);
    domainDisputeService = module.get<DomainDisputeService>(DomainDisputeService);
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(appController).toBeDefined();
    expect(pythonApiService).toBeDefined();
    expect(domainDisputeService).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
