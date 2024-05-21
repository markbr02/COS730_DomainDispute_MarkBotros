import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PythonApiService } from './python.service';
import { DomainDisputeService } from './domainDisputeConnecter.service';
import { AxiosResponse } from 'axios';
import { EmailService } from './email.service';

function createMockAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data: data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: undefined
    },
  };
}

describe('AppController', () => {
  let controller: AppController;
  let pythonApiService: jest.Mocked<PythonApiService>;
  let domainDisputeService: jest.Mocked<DomainDisputeService>;
  let emailService: jest.Mocked<EmailService>; // Add this

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PythonApiService,
          useValue: {
            sendPdfToPython: jest.fn()
          }
        },
        {
          provide: DomainDisputeService,
          useValue: {
            getAdjudicatorStats: jest.fn(),
            getCasesPerYearStats: jest.fn(),
            getCasesPerTypeStats: jest.fn(),
            getCasesPerTypePerYearStats: jest.fn()
          }
        },
        {
          provide: EmailService,
          useValue: {
            sendMail: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    pythonApiService = module.get(PythonApiService);
    domainDisputeService = module.get(DomainDisputeService);
    emailService = module.get(EmailService); // Initialize the mock
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET endpoints', () => {
    it('should return adjudicator stats', async () => {
      const mockStats = { total: 5, trainees: 2 };
      domainDisputeService.getAdjudicatorStats.mockResolvedValue(mockStats);
      expect(await controller.adjudicators()).toEqual(mockStats);
    });
  
    it('should return cases per year stats', async () => {
      const mockStats = [{ year: 2020, count: 100 }];
      domainDisputeService.getCasesPerYearStats.mockResolvedValue(mockStats);
      expect(await controller.casesPerYear()).toEqual(mockStats);
    });
  
    it('should return cases per type stats', async () => {
      const mockStats = [{ type: 'Type1', count: 50 }];
      domainDisputeService.getCasesPerTypeStats.mockResolvedValue(mockStats);
      expect(await controller.casesPerType()).toEqual(mockStats);
    });
  
    it('should return cases per type per year stats', async () => {
      const mockStats = [{ year: 2020, type: 'Type1', count: 30 }];
      domainDisputeService.getCasesPerTypePerYearStats.mockResolvedValue(mockStats);
      expect(await controller.casesPerTypePerYear()).toEqual(mockStats);
    });
  });
  
  describe('POST upload-pdf', () => {
    it('should handle file upload and return response from the Python API service', async () => {
      const mockFile = { originalname: 'test.pdf', buffer: Buffer.from('fake pdf content') };
      const mockResponseData = { success: true, message: 'Processed' };
      const mockAxiosResponse = createMockAxiosResponse(mockResponseData);

      pythonApiService.sendPdfToPython.mockResolvedValue(mockAxiosResponse);
  
      // Update the expectation to match the full AxiosResponse
      expect(await controller.uploadPdf(mockFile as any)).toEqual(mockAxiosResponse);
    });
  
    it('should throw an error if no file is provided', async () => {
      await expect(controller.uploadPdf(undefined as any)).rejects.toThrow('File is not provided.');
    });
  });

  describe('POST file-dispute', () => {
    it('should process form and send email successfully', async () => {
      const mockFiles = [{ originalname: 'doc.pdf', buffer: Buffer.from('PDF content'), mimetype: 'application/pdf' }];
      const mockFormData = {
        domains: 'example.com',
        complainantName: 'John Doe',
        complainantContact: 'john@example.com',
        registrantName: 'Jane Doe',
        registrantType: 'Individual',
        disputeType: 'Trademark Infringement',
        evidence: 'Evidence text',
        description: 'Description text'
      };

      emailService.sendMail.mockImplementation(() => Promise.resolve());

      const result = await controller.handleSubmit(mockFiles as any, mockFormData);
      
      expect(emailService.sendMail).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Form processed successfully' });
    });

    it('should handle no files case', async () => {
      const mockFormData = {
        domains: 'example.com',
        complainantName: 'John Doe',
        complainantContact: 'john@example.com',
        registrantName: 'Jane Doe',
        registrantType: 'Individual',
        disputeType: 'Trademark Infringement',
        evidence: 'Evidence text',
        description: 'Description text'
      };

      emailService.sendMail.mockImplementation(() => Promise.resolve());

      const result = await controller.handleSubmit([], mockFormData); // No files provided
      
      expect(emailService.sendMail).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Form processed successfully' });
    });
  });
  
});
