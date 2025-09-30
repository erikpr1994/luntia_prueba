import { query } from "../database/connection";
import { parseCSV } from "../utils/csvParser";
import { transformMembers } from "../utils/dataTransformers";
import { Member } from "../types";

export class MemberService {
  // CSV processing
  async processCSV(csvData: string) {
    const rawData = await parseCSV<Member>(csvData);
    const transformedData = transformMembers(rawData);

    for (const member of transformedData) {
      await query(
        `INSERT INTO members (id, organization, name, join_date, monthly_contribution) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (id) DO UPDATE SET
         organization = EXCLUDED.organization,
         name = EXCLUDED.name,
         join_date = EXCLUDED.join_date,
         monthly_contribution = EXCLUDED.monthly_contribution`,
        [
          member.id,
          member.organization,
          member.name,
          member.join_date,
          member.monthly_contribution,
        ]
      );
    }

    return { processed: transformedData.length, type: "members" };
  }

  // Data retrieval
  async getAll(
    filters: { organization?: string; has_contribution?: boolean } = {}
  ) {
    let queryStr = "SELECT * FROM members";
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.organization) {
      conditions.push(`organization = $${params.length + 1}`);
      params.push(filters.organization);
    }

    if (filters.has_contribution !== undefined) {
      if (filters.has_contribution) {
        conditions.push(
          `monthly_contribution IS NOT NULL AND monthly_contribution > 0`
        );
      } else {
        conditions.push(
          `(monthly_contribution IS NULL OR monthly_contribution = 0)`
        );
      }
    }

    if (conditions.length > 0) {
      queryStr += ` WHERE ${conditions.join(" AND ")}`;
    }

    queryStr += " ORDER BY name";

    const result = await query(queryStr, params);
    return result.rows;
  }

  async getById(id: string) {
    const result = await query("SELECT * FROM members WHERE id = $1", [id]);
    return result.rows[0];
  }

  async getByOrganization(organization: string) {
    const result = await query(
      "SELECT * FROM members WHERE organization = $1 ORDER BY name",
      [organization]
    );
    return result.rows;
  }

  async getWithContributions() {
    const result = await query(
      "SELECT * FROM members WHERE monthly_contribution IS NOT NULL AND monthly_contribution > 0 ORDER BY name"
    );
    return result.rows;
  }
}
