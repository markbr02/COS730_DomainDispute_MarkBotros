import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Req, UploadedFiles } from '@nestjs/common';
import { PythonApiService } from './python.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DomainDisputeService } from './domainDisputeConnecter.service';
import { EmailService } from './email.service';

@Controller()
export class AppController {
  constructor(private readonly emailService: EmailService, private readonly pythonApiService: PythonApiService, private readonly domainDisputeService: DomainDisputeService) { }


  @Get('adjudicators')
  adjudicators(): any {
    return this.domainDisputeService.getAdjudicatorStats();
  }

  @Get('casesPerYear')
  casesPerYear(): any {
    return this.domainDisputeService.getCasesPerYearStats();
  }

  @Get('casesPerType')
  casesPerType(): any {
    return this.domainDisputeService.getCasesPerTypeStats();
  }

  @Get('casesPerTypePerYear')
  casesPerTypePerYear(): any {
    return this.domainDisputeService.getCasesPerTypePerYearStats();
  }

  // Use the @Post decorator to handle POST requests to '/upload-pdf'
  @Post('upload-pdf')
  // UseInterceptors is a method decorator that binds interceptors to the scope of the method
  @UseInterceptors(FileInterceptor('file'))
  // The UploadedFile decorator extracts a single file from the incoming HTTP request
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is not provided.');
    }
    console.log("check");
    // Call the Python API service to send the PDF file
    // The file.buffer contains the file data in memory
    const response = await this.pythonApiService.sendPdfToPython(file.buffer, file.originalname);
    // Return the response from the Python service
    return response;
  }

  @Post('file-dispute')
  @UseInterceptors(FilesInterceptor('files', 10)) // Adjust '10' based on your needs
  async handleSubmit(@UploadedFiles() files: Express.Multer.File[], @Body() formData: any) {
    const filesInfo = files?.map(file => file.originalname).join(', ') || 'No files';

    const emailBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>New Domain Dispute Submission</h1>
  <p><strong>Domains:</strong> ${formData.domains}</p>
  <p><strong>Complainant Name:</strong> ${formData.complainantName}</p>
  <p><strong>Complainant Contact:</strong> ${formData.complainantContact}</p>
  <p><strong>Registrant Name:</strong> ${formData.registrantName}</p>
  <p><strong>Registrant Type:</strong> ${formData.registrantType}</p>
  <p><strong>Dispute Type:</strong> ${formData.disputeType}</p>
  <p><strong>Evidence:</strong> ${formData.evidence}</p>
  <p><strong>Description:</strong> ${formData.description}</p>
  <p><strong>Attached Files:</strong> ${filesInfo}</p>
</body>
</html>
`;

    // Send this HTML as part of an email
    await this.emailService.sendMail('u21448109@tuks.co.za', 'New Form Submission', emailBody, files);


    return { message: 'Form processed successfully' };
  }
}
