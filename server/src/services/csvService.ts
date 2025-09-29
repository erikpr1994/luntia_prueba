import { query } from "../database/connection";
import { parseCSV } from "../utils/csvParser";
import {
  transformVolunteers,
  transformMembers,
  transformShifts,
  transformDonations,
  transformActivities,
} from "../utils/dataTransformers";
import { Volunteer, Member, Shift, Donation, Activity } from "../types";

export class CSVService {
  async processVolunteers(csvData: string) {
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

  async processMembers(csvData: string) {
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

  async processShifts(csvData: string) {
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

  async processDonations(csvData: string) {
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

  async processActivities(csvData: string) {
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

  async getStats() {
    const [volunteers, members, shifts, donations, activities] =
      await Promise.all([
        query("SELECT COUNT(*) as count FROM volunteers"),
        query("SELECT COUNT(*) as count FROM members"),
        query("SELECT COUNT(*) as count FROM shifts"),
        query("SELECT COUNT(*) as count FROM donations"),
        query("SELECT COUNT(*) as count FROM activities"),
      ]);

    return {
      volunteers: parseInt(volunteers.rows[0].count),
      members: parseInt(members.rows[0].count),
      shifts: parseInt(shifts.rows[0].count),
      donations: parseInt(donations.rows[0].count),
      activities: parseInt(activities.rows[0].count),
    };
  }
}
