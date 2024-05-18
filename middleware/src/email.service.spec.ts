import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';
import { Readable } from 'typeorm/platform/PlatformTools';

const mockFiles: Express.Multer.File[] = [
  {
    originalname: 'test.pdf',
    buffer: Buffer.from('test content'),
    mimetype: 'application/pdf',
    fieldname: 'file',  // Typically the name of the form field (the file name)
    encoding: '7bit',   // Encoding type of the file
    size: 1024,         // The size of the file in bytes
    stream: new Readable(), // This would be the stream of file data; needs to be a readable stream
    destination: './uploads', // The destination directory where the file would be stored
    filename: 'test.pdf', // The name of the file within the destination
    path: './uploads/test.pdf' // The full path to the uploaded file
  }
];


jest.mock('nodemailer');

const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe('EmailService', () => {
  let service: EmailService;
  let mockSendMail;

  beforeEach(async () => {
    mockSendMail = jest.fn();
    mockedNodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email with correct parameters including file attachments', async () => {
    await service.sendMail('test@example.com', 'Test Subject', '<h1>Test Email</h1>', mockFiles);

    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: process.env.GMAIL_USER,
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<h1>Test Email</h1>',
      attachments: [
        {
          filename: 'test.pdf',
          content: expect.any(Buffer),
          contentType: 'application/pdf'
        }
      ]
    }));
  });

});
