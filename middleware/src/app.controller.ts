import { Controller, Get, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { PythonApiService } from './python.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DomainDisputeService } from './domainDisputeConnecter.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly pythonApiService: PythonApiService, private readonly domainDisputeService: DomainDisputeService ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

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
    // Call the Python API service to send the PDF file
    // The file.buffer contains the file data in memory
    const response = await this.pythonApiService.sendPdfToPython(file.buffer, file.originalname);
    // Return the response from the Python service
    return response;
  }
}
