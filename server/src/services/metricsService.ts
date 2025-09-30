import { query } from "../database/connection";
import { VolunteerService } from "./volunteerService";
import { ShiftService } from "./shiftService";
import { DonationService } from "./donationService";

export class MetricsService {
  private volunteerService = new VolunteerService();
  private shiftService = new ShiftService();
  private donationService = new DonationService();

  async getBasicMetrics() {
    const [activeVolunteers, totalHours, lastMonthShifts, totalDonations] =
      await Promise.all([
        this.volunteerService.getActiveCount(),
        this.shiftService.getTotalHours(),
        this.shiftService.getLastMonthCount(),
        this.donationService.getTotalAmount(),
      ]);

    return {
      activeVolunteers,
      totalHours,
      lastMonthShifts,
      totalDonations,
    };
  }

  async getOrganizationMetrics(organization: string) {
    const [volunteers, members, shifts, donations, activities] =
      await Promise.all([
        query(
          "SELECT COUNT(*) as count FROM volunteers WHERE organization = $1",
          [organization]
        ),
        query("SELECT COUNT(*) as count FROM members WHERE organization = $1", [
          organization,
        ]),
        query("SELECT COUNT(*) as count FROM shifts WHERE organization = $1", [
          organization,
        ]),
        query(
          "SELECT COUNT(*) as count FROM donations WHERE organization = $1",
          [organization]
        ),
        query(
          "SELECT COUNT(*) as count FROM activities WHERE organization = $1",
          [organization]
        ),
      ]);

    return {
      volunteers: parseInt(volunteers.rows[0].count),
      members: parseInt(members.rows[0].count),
      shifts: parseInt(shifts.rows[0].count),
      donations: parseInt(donations.rows[0].count),
      activities: parseInt(activities.rows[0].count),
    };
  }

  async getOverallStats() {
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
