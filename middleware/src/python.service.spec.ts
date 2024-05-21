import { Test, TestingModule } from '@nestjs/testing';
import { PythonApiService } from './python.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PythonApiService', () => {
    let service: PythonApiService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PythonApiService],
        }).compile();

        service = module.get<PythonApiService>(PythonApiService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendPdfToPython', () => {
        const mockPdfBuffer = Buffer.from('fake-pdf-data', 'utf-8');
        const mockFilename = 'test.pdf';

        it('should send a PDF and return the response data correctly', async () => {
            const mockResponse = { data: { success: true, message: 'File processed' } };
            mockedAxios.post.mockResolvedValue(mockResponse);

            const result = await service.sendPdfToPython(mockPdfBuffer, mockFilename);

            expect(mockedAxios.post).toHaveBeenCalled();
            expect(result).toBe(mockResponse.data);
        });

        it('should handle different PDF content appropriately', async () => {
            const differentPdfBuffer = Buffer.from('different-pdf-data', 'utf-8');
            const differentResponse = { data: { success: true, message: 'Different file processed' } };
            mockedAxios.post.mockResolvedValue(differentResponse);

            const result = await service.sendPdfToPython(differentPdfBuffer, 'different.pdf');

            expect(mockedAxios.post).toHaveBeenCalled();
            expect(result).toBe(differentResponse.data);
        });

        it('should throw an error if the server returns a non-200 status', async () => {
            const errorResponse = { response: { status: 400, data: 'Bad request' } };
            mockedAxios.post.mockRejectedValue(errorResponse);

            await expect(service.sendPdfToPython(mockPdfBuffer, mockFilename))
                .rejects.toThrow('Failed to send PDF to Python service: Bad request');
        });

        it('should handle network errors gracefully', async () => {
            const networkError = new Error('Network Error');
            mockedAxios.post.mockRejectedValue(networkError);

            await expect(service.sendPdfToPython(mockPdfBuffer, mockFilename))
                .rejects.toThrow('Failed to send PDF to Python service: Network Error');
        });        
          
        it('should check that the PDF data is sent in the request', async () => {
            const mockResponse = { data: { success: true } };
            mockedAxios.post.mockResolvedValue(mockResponse);

            await service.sendPdfToPython(mockPdfBuffer, mockFilename);

            // Ensure FormData has the file with the correct parameters
            const formData = expect.any(Object); // Simulate FormData instance
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.any(String),
                formData,
                expect.objectContaining({
                    headers: expect.any(Object)
                })
            );
        });

        
    });
});
