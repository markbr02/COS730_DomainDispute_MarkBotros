// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async sendMail(to: string, subject: string, htmlContent: string, attachedFiles: Express.Multer.File[]) {
    const transporter = nodemailer.createTransport({
      // transport configuration
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      }
    });
  
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: attachedFiles.map(file => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      }))
    };
  
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log("Sending....");
      console.log('Email sent successfully', result);
    } catch (error) {
      console.error('Failed to send email', error);
    }
  }
}
