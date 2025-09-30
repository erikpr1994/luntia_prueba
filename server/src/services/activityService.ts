import { query } from "../database/connection";
import { parseCSV } from "../utils/csvParser";
import { transformActivities } from "../utils/dataTransformers";
import { Activity } from "../types";

export class ActivityService {
  // CSV processing
  async processCSV(csvData: string) {
    const rawData = await parseCSV<Activity>(csvData);
    const transformedData = transformActivities(rawData);

    for (const activity of transformedData) {
      await query(
        `INSERT INTO activities (id, organization, name, date, participants) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (id) DO UPDATE SET
         organization = EXCLUDED.organization,
         name = EXCLUDED.name,
         date = EXCLUDED.date,
         participants = EXCLUDED.participants`,
        [
          activity.id,
          activity.organization,
          activity.name,
          activity.date,
          activity.participants,
        ]
      );
    }

    return { processed: transformedData.length, type: "activities" };
  }

  // Data retrieval
  async getAll(
    filters: {
      organization?: string;
      date_from?: string;
      date_to?: string;
    } = {}
  ) {
    let queryStr = "SELECT * FROM activities";
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
    const result = await query("SELECT * FROM activities WHERE id = $1", [id]);
    return result.rows[0];
  }

  async getByOrganization(organization: string) {
    const result = await query(
      "SELECT * FROM activities WHERE organization = $1 ORDER BY date DESC",
      [organization]
    );
    return result.rows;
  }

  async getByDateRange(dateFrom: string, dateTo: string) {
    const result = await query(
      "SELECT * FROM activities WHERE date >= $1 AND date <= $2 ORDER BY date DESC",
      [dateFrom, dateTo]
    );
    return result.rows;
  }

  async getUpcoming() {
    const result = await query(
      "SELECT * FROM activities WHERE date >= CURRENT_DATE ORDER BY date ASC"
    );
    return result.rows;
  }
}
