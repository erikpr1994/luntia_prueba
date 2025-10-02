import { query } from "../database/connection";

export class MetricsService {
  // Core engagement metrics
  async getEngagementMetrics(organization?: string) {
    const orgFilter = organization ? "WHERE organization = $1" : "";
    const params = organization ? [organization] : [];

    const [
      volunteerRetention,
      avgHoursPerVolunteer,
      topPerformers,
      engagementTrend,
    ] = await Promise.all([
      // Volunteer retention rate (volunteers active in last 3 months vs total)
      query(
        `
          WITH recent_volunteers AS (
            SELECT DISTINCT v.id 
            FROM volunteers v 
            JOIN shifts s ON v.id = s.volunteer_id 
            ${orgFilter}
            AND s.date >= CURRENT_DATE - INTERVAL '3 months'
          ),
          total_volunteers AS (
            SELECT COUNT(*) as total FROM volunteers ${orgFilter}
          )
          SELECT 
            COALESCE(ROUND((SELECT COUNT(*) FROM recent_volunteers)::DECIMAL / 
            NULLIF((SELECT total FROM total_volunteers), 0) * 100, 1), 0) as retention_rate
        `,
        params
      ),

      // Average hours per volunteer
      query(
        `
          SELECT 
            COALESCE(ROUND(AVG(volunteer_hours.hours), 1), 0) as avg_hours_per_volunteer
          FROM (
            SELECT v.id, COALESCE(SUM(s.hours), 0) as hours
            FROM volunteers v
            LEFT JOIN shifts s ON v.id = s.volunteer_id ${orgFilter}
            GROUP BY v.id
          ) volunteer_hours
        `,
        params
      ),

      // Top 5 performing volunteers
      query(
        `
          SELECT v.name, v.role, COALESCE(SUM(s.hours), 0) as total_hours,
                 COUNT(s.id) as shift_count
          FROM volunteers v
          LEFT JOIN shifts s ON v.id = s.volunteer_id ${orgFilter}
          GROUP BY v.id, v.name, v.role
          ORDER BY total_hours DESC
          LIMIT 5
        `,
        params
      ),

      // Monthly engagement trend (last 6 months)
      query(
        `
          SELECT 
            DATE_TRUNC('month', s.date) as month,
            COUNT(DISTINCT s.volunteer_id) as active_volunteers,
            SUM(s.hours) as total_hours,
            COUNT(s.id) as total_shifts
          FROM shifts s ${orgFilter}
          WHERE s.date >= CURRENT_DATE - INTERVAL '6 months'
          GROUP BY DATE_TRUNC('month', s.date)
          ORDER BY month
        `,
        params
      ),
    ]);

    return {
      retentionRate: parseFloat(
        volunteerRetention.rows[0]?.retention_rate || 0
      ),
      avgHoursPerVolunteer: parseFloat(
        avgHoursPerVolunteer.rows[0]?.avg_hours_per_volunteer || 0
      ),
      topPerformers: topPerformers.rows,
      engagementTrend: engagementTrend.rows,
    };
  }

  // Impact and efficiency metrics
  async getImpactMetrics(organization?: string) {
    const orgFilter = organization ? "WHERE organization = $1" : "";
    const params = organization ? [organization] : [];

    const [
      volunteerValue,
      activityEfficiency,
      donationTrends,
      resourceUtilization,
    ] = await Promise.all([
      // Economic value of volunteer work (assuming $15/hour)
      query(
        `
          SELECT 
            COALESCE(SUM(s.hours * 15), 0) as economic_value,
            COUNT(DISTINCT s.volunteer_id) as contributing_volunteers
          FROM shifts s ${orgFilter}
        `,
        params
      ),

      // Activity efficiency (participants per activity)
      query(
        `
          SELECT 
            COALESCE(AVG(a.participants), 0) as avg_participants_per_activity,
            COUNT(a.id) as total_activities
          FROM activities a ${orgFilter}
        `,
        params
      ),

      // Donation trends (last 12 months)
      query(
        `
          SELECT 
            DATE_TRUNC('month', d.date) as month,
            SUM(d.amount) as monthly_donations,
            COUNT(d.id) as donation_count,
            AVG(d.amount) as avg_donation
          FROM donations d ${orgFilter}
          WHERE d.date >= CURRENT_DATE - INTERVAL '12 months'
          GROUP BY DATE_TRUNC('month', d.date)
          ORDER BY month
        `,
        params
      ),

      // Resource utilization (volunteer hours vs capacity)
      query(
        `
          SELECT 
            COUNT(DISTINCT v.id) as total_volunteers,
            COUNT(DISTINCT CASE WHEN v.active = true THEN v.id END) as active_volunteers,
            COALESCE(SUM(s.hours), 0) as total_hours_this_month,
            COALESCE(AVG(s.hours), 0) as avg_hours_per_shift
          FROM volunteers v
          LEFT JOIN shifts s ON v.id = s.volunteer_id 
          AND s.date >= DATE_TRUNC('month', CURRENT_DATE)
          ${orgFilter}
        `,
        params
      ),
    ]);

    return {
      economicValue: parseFloat(volunteerValue.rows[0]?.economic_value || 0),
      contributingVolunteers: parseInt(
        volunteerValue.rows[0]?.contributing_volunteers || 0
      ),
      activityEfficiency: {
        avgParticipants: parseFloat(
          activityEfficiency.rows[0]?.avg_participants_per_activity || 0
        ),
        totalActivities: parseInt(
          activityEfficiency.rows[0]?.total_activities || 0
        ),
      },
      donationTrends: donationTrends.rows,
      resourceUtilization: {
        totalVolunteers: parseInt(
          resourceUtilization.rows[0]?.total_volunteers || 0
        ),
        activeVolunteers: parseInt(
          resourceUtilization.rows[0]?.active_volunteers || 0
        ),
        hoursThisMonth: parseFloat(
          resourceUtilization.rows[0]?.total_hours_this_month || 0
        ),
        avgHoursPerShift: parseFloat(
          resourceUtilization.rows[0]?.avg_hours_per_shift || 0
        ),
      },
    };
  }

  // Health and sustainability metrics
  async getHealthMetrics(organization?: string) {
    const orgFilter = organization ? "WHERE organization = $1" : "";
    const params = organization ? [organization] : [];

    const [volunteerHealth, programSustainability, riskIndicators] =
      await Promise.all([
        // Volunteer health indicators
        query(
          `
          WITH volunteer_stats AS (
            SELECT 
              v.id,
              v.join_date,
              COALESCE(SUM(s.hours), 0) as total_hours,
              COUNT(s.id) as total_shifts,
              MAX(s.date) as last_shift_date,
              CASE 
                WHEN MAX(s.date) >= CURRENT_DATE - INTERVAL '30 days' THEN 'active'
                WHEN MAX(s.date) >= CURRENT_DATE - INTERVAL '90 days' THEN 'at_risk'
                ELSE 'inactive'
              END as status
            FROM volunteers v
            LEFT JOIN shifts s ON v.id = s.volunteer_id ${orgFilter}
            GROUP BY v.id, v.join_date
          )
          SELECT 
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
            COUNT(CASE WHEN status = 'at_risk' THEN 1 END) as at_risk_count,
            COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_count,
            ROUND(AVG(total_hours), 1) as avg_hours_per_volunteer,
            ROUND(AVG(total_shifts), 1) as avg_shifts_per_volunteer
          FROM volunteer_stats
        `,
          params
        ),

        // Program sustainability indicators
        query(
          `
          SELECT 
            COUNT(DISTINCT v.id) as total_volunteers,
            COUNT(DISTINCT CASE WHEN v.join_date >= CURRENT_DATE - INTERVAL '6 months' THEN v.id END) as new_volunteers_6m,
            COUNT(DISTINCT CASE WHEN v.join_date >= CURRENT_DATE - INTERVAL '12 months' THEN v.id END) as new_volunteers_12m,
            COALESCE(SUM(d.amount), 0) as total_donations,
            COALESCE(AVG(d.amount), 0) as avg_donation_amount
          FROM volunteers v
          LEFT JOIN donations d ON v.organization = d.organization ${orgFilter}
        `,
          params
        ),

        // Risk indicators
        query(
          `
          SELECT 
            COUNT(CASE WHEN s.date < CURRENT_DATE - INTERVAL '90 days' THEN 1 END) as stale_shifts,
            COUNT(CASE WHEN d.date < CURRENT_DATE - INTERVAL '180 days' THEN 1 END) as stale_donations,
            COUNT(CASE WHEN a.date < CURRENT_DATE - INTERVAL '60 days' THEN 1 END) as stale_activities
          FROM shifts s
          FULL OUTER JOIN donations d ON s.organization = d.organization ${orgFilter}
          FULL OUTER JOIN activities a ON COALESCE(s.organization, d.organization) = a.organization ${orgFilter}
        `,
          params
        ),
      ]);

    return {
      volunteerHealth: {
        active: parseInt(volunteerHealth.rows[0]?.active_count || 0),
        atRisk: parseInt(volunteerHealth.rows[0]?.at_risk_count || 0),
        inactive: parseInt(volunteerHealth.rows[0]?.inactive_count || 0),
        avgHoursPerVolunteer: parseFloat(
          volunteerHealth.rows[0]?.avg_hours_per_volunteer || 0
        ),
        avgShiftsPerVolunteer: parseFloat(
          volunteerHealth.rows[0]?.avg_shifts_per_volunteer || 0
        ),
      },
      sustainability: {
        totalVolunteers: parseInt(
          programSustainability.rows[0]?.total_volunteers || 0
        ),
        newVolunteers6m: parseInt(
          programSustainability.rows[0]?.new_volunteers_6m || 0
        ),
        newVolunteers12m: parseInt(
          programSustainability.rows[0]?.new_volunteers_12m || 0
        ),
        totalDonations: parseFloat(
          programSustainability.rows[0]?.total_donations || 0
        ),
        avgDonationAmount: parseFloat(
          programSustainability.rows[0]?.avg_donation_amount || 0
        ),
      },
      riskIndicators: {
        staleShifts: parseInt(riskIndicators.rows[0]?.stale_shifts || 0),
        staleDonations: parseInt(riskIndicators.rows[0]?.stale_donations || 0),
        staleActivities: parseInt(
          riskIndicators.rows[0]?.stale_activities || 0
        ),
      },
    };
  }

  // Legacy methods for backward compatibility
  async getBasicMetrics() {
    const engagement = await this.getEngagementMetrics();
    const impact = await this.getImpactMetrics();
    const health = await this.getHealthMetrics();

    return {
      retentionRate: engagement.retentionRate,
      avgHoursPerVolunteer: engagement.avgHoursPerVolunteer,
      economicValue: impact.economicValue,
      activeVolunteers: health.volunteerHealth.active,
      atRiskVolunteers: health.volunteerHealth.atRisk,
    };
  }

  async getOrganizationMetrics(organization: string) {
    const engagement = await this.getEngagementMetrics(organization);
    const impact = await this.getImpactMetrics(organization);
    const health = await this.getHealthMetrics(organization);

    return {
      engagement,
      impact,
      health,
      organization,
    };
  }

  async getOverallStats() {
    const engagement = await this.getEngagementMetrics();
    const impact = await this.getImpactMetrics();
    const health = await this.getHealthMetrics();

    return {
      engagement,
      impact,
      health,
    };
  }

  // Daily volunteer activity for charts
  async getDailyVolunteerActivity(days: number = 30, organization?: string) {
    const orgFilter = organization ? "AND v.organization = $2" : "";
    const params = organization ? [days, organization] : [days];

    const result = await query(
      `
        SELECT 
          s.date,
          COUNT(DISTINCT s.volunteer_id) as volunteers,
          COALESCE(SUM(s.hours), 0) as hours,
          COUNT(s.id) as shifts
        FROM shifts s
        JOIN volunteers v ON s.volunteer_id = v.id
        WHERE s.date >= CURRENT_DATE - INTERVAL '${days} days'
        ${orgFilter}
        GROUP BY s.date
        ORDER BY s.date ASC
      `,
      params
    );

    return result.rows;
  }
}
