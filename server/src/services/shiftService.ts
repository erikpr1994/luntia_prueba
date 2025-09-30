import { query } from "../database/connection";
import { parseCSV } from "../utils/csvParser";
import { transformShifts } from "../utils/dataTransformers";
import { Shift } from "../types";

export class ShiftService {
  // CSV processing
  async processCSV(csvData: string) {
    const rawData = await parseCSV<Shift>(csvData);
    const transformedData = transformShifts(rawData);

    for (const shift of transformedData) {
      await query(
        `INSERT INTO shifts (id, volunteer_id, organization, date, activity, hours) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (id) DO UPDATE SET
         volunteer_id = EXCLUDED.volunteer_id,
         organization = EXCLUDED.organization,
         date = EXCLUDED.date,
         activity = EXCLUDED.activity,
         hours = EXCLUDED.hours`,
        [
          shift.id,
          shift.volunteer_id,
          shift.organization,
          shift.date,
          shift.activity,
          shift.hours,
        ]
      );
    }

    return { processed: transformedData.length, type: "shifts" };
  }

  // Data retrieval
  async getAll(
    filters: {
      volunteer_id?: string;
      organization?: string;
      date_from?: string;
      date_to?: string;
    } = {}
  ) {
    let queryStr =
      "SELECT s.*, v.name as volunteer_name FROM shifts s LEFT JOIN volunteers v ON s.volunteer_id = v.id";
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.volunteer_id) {
      conditions.push(`s.volunteer_id = $${params.length + 1}`);
      params.push(filters.volunteer_id);
    }

    if (filters.organization) {
      conditions.push(`s.organization = $${params.length + 1}`);
      params.push(filters.organization);
    }

    if (filters.date_from) {
      conditions.push(`s.date >= $${params.length + 1}`);
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      conditions.push(`s.date <= $${params.length + 1}`);
      params.push(filters.date_to);
    }

    if (conditions.length > 0) {
      queryStr += ` WHERE ${conditions.join(" AND ")}`;
    }

    queryStr += " ORDER BY s.date DESC";

    const result = await query(queryStr, params);
    return result.rows;
  }

  async getById(id: string) {
    const result = await query(
      "SELECT s.*, v.name as volunteer_name FROM shifts s LEFT JOIN volunteers v ON s.volunteer_id = v.id WHERE s.id = $1",
      [id]
    );
    return result.rows[0];
  }

  async getByVolunteer(volunteerId: string) {
    const result = await query(
      "SELECT s.*, v.name as volunteer_name FROM shifts s LEFT JOIN volunteers v ON s.volunteer_id = v.id WHERE s.volunteer_id = $1 ORDER BY s.date DESC",
      [volunteerId]
    );
    return result.rows;
  }

  async getLastMonthCount() {
    const result = await query(
      "SELECT COUNT(*) as count FROM shifts WHERE date >= CURRENT_DATE - INTERVAL '30 days'"
    );
    return parseInt(result.rows[0].count);
  }

  async getTotalHours() {
    const result = await query(
      "SELECT COALESCE(SUM(hours), 0) as total FROM shifts WHERE hours IS NOT NULL"
    );
    return parseFloat(result.rows[0].total);
  }
}
