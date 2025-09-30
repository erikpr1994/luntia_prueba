import { query } from "../database/connection";
import { parseCSV } from "../utils/csvParser";
import { transformVolunteers } from "../utils/dataTransformers";
import { Volunteer } from "../types";

export class VolunteerService {
  // CSV processing
  async processCSV(csvData: string) {
    const rawData = await parseCSV<Volunteer>(csvData);
    const transformedData = transformVolunteers(rawData);

    for (const volunteer of transformedData) {
      await query(
        `INSERT INTO volunteers (id, organization, name, join_date, active, role) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (id) DO UPDATE SET
         organization = EXCLUDED.organization,
         name = EXCLUDED.name,
         join_date = EXCLUDED.join_date,
         active = EXCLUDED.active,
         role = EXCLUDED.role`,
        [
          volunteer.id,
          volunteer.organization,
          volunteer.name,
          volunteer.join_date,
          volunteer.active,
          volunteer.role,
        ]
      );
    }

    return { processed: transformedData.length, type: "volunteers" };
  }

  // Data retrieval
  async getAll(filters: { active?: boolean; organization?: string } = {}) {
    let queryStr = "SELECT * FROM volunteers";
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.active !== undefined) {
      conditions.push(`active = $${params.length + 1}`);
      params.push(filters.active);
    }

    if (filters.organization) {
      conditions.push(`organization = $${params.length + 1}`);
      params.push(filters.organization);
    }

    if (conditions.length > 0) {
      queryStr += ` WHERE ${conditions.join(" AND ")}`;
    }

    queryStr += " ORDER BY name";

    const result = await query(queryStr, params);
    return result.rows;
  }

  async getById(id: string) {
    const result = await query("SELECT * FROM volunteers WHERE id = $1", [id]);
    return result.rows[0];
  }

  async getActiveCount() {
    const result = await query(
      "SELECT COUNT(*) as count FROM volunteers WHERE active = true"
    );
    return parseInt(result.rows[0].count);
  }

  async getByOrganization(organization: string) {
    const result = await query(
      "SELECT * FROM volunteers WHERE organization = $1 ORDER BY name",
      [organization]
    );
    return result.rows;
  }
}
