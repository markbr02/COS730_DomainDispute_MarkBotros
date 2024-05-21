import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DomainDisputeService {
    constructor(private connection: Connection) { }

    async getAdjudicatorStats(): Promise<any> {
        const query = `
      SELECT 
        COUNT(*) AS totalAdjudicators,
        SUM(CASE WHEN type = 3 THEN 1 ELSE 0 END) AS traineeAdjudicators
      FROM adjudicators;
    `;

        const rawData = await this.connection.query(query);
        return rawData[0];  // Assuming the query returns an array, we take the first element.
    }

    async getCasesPerYearStats(): Promise<any> {
        const query = `
          SELECT 
            YEAR(CaseDate) AS year, 
            COUNT(*) AS caseCount
          FROM cases
          GROUP BY YEAR(CaseDate)
          ORDER BY YEAR(CaseDate);
        `;
    
        const rawData = await this.connection.query(query);
        return rawData;  // The query returns an array with { year, caseCount } for each year.
    }

    async getCasesPerTypeStats(): Promise<any> {
        const query = `
          SELECT 
            decisionType2 AS type, 
            COUNT(*) AS typeCount
          FROM cases
          GROUP BY decisionType2
          ORDER BY decisionType2;
        `;
    
        const rawData = await this.connection.query(query);
        return rawData;  // The query returns an array with { year, caseCount } for each year.
    }

    async getCasesPerTypePerYearStats(): Promise<any> {
        const query = `
          SELECT 
            YEAR(CaseDate) AS year, 
            decisionType2 AS type, 
            COUNT(*) AS typeCount
          FROM cases
          GROUP BY decisionType2, YEAR(CaseDate)
          ORDER BY decisionType2, YEAR(CaseDate);
        `;
    
        const rawData = await this.connection.query(query);
        return rawData;  // The query returns an array with { year, caseCount } for each year.
    }

}
