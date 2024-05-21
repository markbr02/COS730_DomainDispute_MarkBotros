// src/python-api.service.ts
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { Readable } from 'stream';

@Injectable()
export class PythonApiService {
  private pythonServiceUrl = 'http://192.168.33.79:5000/data';

  async sendPdfToPython(pdfBuffer: Buffer, filename: string): Promise<AxiosResponse<any>> {
    const formData = new FormData();
    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null); // Indicates the end of the stream
    formData.append('file', stream, { filename });

    try {
      const response = await axios.post(this.pythonServiceUrl, formData, {
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send PDF to Python service: ' + error.message);
    }
  }
}
