import { Test, TestingModule } from '@nestjs/testing';
import { DomainDisputeService } from './domainDisputeConnecter.service';
import { Connection } from 'typeorm';

describe('DomainDisputeService', () => {
    let service: DomainDisputeService;
    let mockConnection: Partial<Connection>;
    let mockQuery: jest.Mock;

    beforeEach(async () => {
        mockQuery = jest.fn();
        mockConnection = {
            query: mockQuery
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DomainDisputeService,
                { provide: Connection, useValue: mockConnection }
            ],
        }).compile();

        service = module.get<DomainDisputeService>(DomainDisputeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAdjudicatorStats', () => {
        it('should return statistics about adjudicators', async () => {
            const result = { totalAdjudicators: 10, traineeAdjudicators: 3 };
            mockQuery.mockResolvedValue([result]);
            await expect(service.getAdjudicatorStats()).resolves.toEqual(result);
            expect(mockQuery).toHaveBeenCalledWith(expect.any(String));
        });
    });

    describe('getCasesPerYearStats', () => {
        it('should return cases per year statistics', async () => {
            const result = [{ year: 2020, caseCount: 50 }, { year: 2021, caseCount: 70 }];
            mockQuery.mockResolvedValue(result);
            await expect(service.getCasesPerYearStats()).resolves.toEqual(result);
            expect(mockQuery).toHaveBeenCalledWith(expect.any(String));
        });
    });

    describe('getCasesPerTypeStats', () => {
        it('should return cases per type statistics', async () => {
            const result = [{ type: 'Type1', typeCount: 100 }, { type: 'Type2', typeCount: 50 }];
            mockQuery.mockResolvedValue(result);
            await expect(service.getCasesPerTypeStats()).resolves.toEqual(result);
            expect(mockQuery).toHaveBeenCalledWith(expect.any(String));
        });
    });

    describe('getCasesPerTypePerYearStats', () => {
        it('should return detailed cases per type per year statistics', async () => {
            const result = [{ year: 2020, type: 'Type1', typeCount: 40 }, { year: 2021, type: 'Type1', typeCount: 60 }];
            mockQuery.mockResolvedValue(result);
            await expect(service.getCasesPerTypePerYearStats()).resolves.toEqual(result);
            expect(mockQuery).toHaveBeenCalledWith(expect.any(String));
        });
    });
});
