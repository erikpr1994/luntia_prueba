import { query } from "../database/connection";
import { parseCSV } from "../utils/csvParser";
import { transformDonations } from "../utils/dataTransformers";
import { Donation } from "../types";

export class DonationService {
  // CSV processing
  async processCSV(csvData: string) {
    const rawData = await parseCSV<Donation>(csvData);
    const transformedData = transformDonations(rawData);

    for (const donation of transformedData) {
      await query(
        `INSERT INTO donations (id, organization, date, donor, amount) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (id) DO UPDATE SET
         organization = EXCLUDED.organization,
         date = EXCLUDED.date,
         donor = EXCLUDED.donor,
         amount = EXCLUDED.amount`,
        [
          donation.id,
          donation.organization,
          donation.date,
          donation.donor,
          donation.amount,
        ]
      );
    }

    return { processed: transformedData.length, type: "donations" };
  }

  // Data retrieval
  async getAll(
    filters: {
      organization?: string;
      date_from?: string;
      date_to?: string;
    } = {}
  ) {
    let queryStr = "SELECT * FROM donations";
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.organization) {
      conditions.push(`organization = $${params.length + 1}`);
      params.push(filters.organization);
    }

    if (filters.date_from) {
      conditions.push(`date >= $${params.length + 1}`);
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      conditions.push(`date <= $${params.length + 1}`);
      params.push(filters.date_to);
    }

    if (conditions.length > 0) {
      queryStr += ` WHERE ${conditions.join(" AND ")}`;
    }

    queryStr += " ORDER BY date DESC";

    const result = await query(queryStr, params);
    return result.rows;
  }

  async getById(id: string) {
    const result = await query("SELECT * FROM donations WHERE id = $1", [id]);
    return result.rows[0];
  }

  async getByOrganization(organization: string) {
    const result = await query(
      "SELECT * FROM donations WHERE organization = $1 ORDER BY date DESC",
      [organization]
    );
    return result.rows;
  }

  async getTotalAmount() {
    const result = await query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE amount IS NOT NULL"
    );
    return parseFloat(result.rows[0].total);
  }

  async getByDateRange(dateFrom: string, dateTo: string) {
    const result = await query(
      "SELECT * FROM donations WHERE date >= $1 AND date <= $2 ORDER BY date DESC",
      [dateFrom, dateTo]
    );
    return result.rows;
  }
}
