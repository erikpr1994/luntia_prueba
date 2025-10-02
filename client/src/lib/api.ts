// API service for consuming backend endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Legacy interfaces for backward compatibility
export interface BasicMetrics {
  retentionRate: number;
  avgHoursPerVolunteer: number;
  economicValue: number;
  activeVolunteers: number;
  atRiskVolunteers: number;
}

export interface OrganizationMetrics {
  engagement: EngagementMetrics;
  impact: ImpactMetrics;
  health: HealthMetrics;
  organization: string;
}

export interface OverallStats {
  engagement: EngagementMetrics;
  impact: ImpactMetrics;
  health: HealthMetrics;
}

// New comprehensive metrics interfaces
export interface EngagementMetrics {
  retentionRate: number;
  avgHoursPerVolunteer: number;
  topPerformers: Array<{
    name: string;
    role: string;
    total_hours: number;
    shift_count: number;
  }>;
  engagementTrend: Array<{
    month: string;
    active_volunteers: number;
    total_hours: number;
    total_shifts: number;
  }>;
}

export interface ImpactMetrics {
  economicValue: number;
  contributingVolunteers: number;
  activityEfficiency: {
    avgParticipants: number;
    totalActivities: number;
  };
  donationTrends: Array<{
    month: string;
    monthly_donations: number;
    donation_count: number;
    avg_donation: number;
  }>;
  resourceUtilization: {
    totalVolunteers: number;
    activeVolunteers: number;
    hoursThisMonth: number;
    avgHoursPerShift: number;
  };
}

export interface HealthMetrics {
  volunteerHealth: {
    active: number;
    atRisk: number;
    inactive: number;
    avgHoursPerVolunteer: number;
    avgShiftsPerVolunteer: number;
  };
  sustainability: {
    totalVolunteers: number;
    newVolunteers6m: number;
    newVolunteers12m: number;
    totalDonations: number;
    avgDonationAmount: number;
  };
  riskIndicators: {
    staleShifts: number;
    staleDonations: number;
    staleActivities: number;
  };
}

export interface DashboardMetrics {
  engagement: EngagementMetrics;
  impact: ImpactMetrics;
  health: HealthMetrics;
  organization: string;
}

class ApiService {
  private async request<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async getBasicMetrics(): Promise<{ metrics: BasicMetrics }> {
    return this.request<{ metrics: BasicMetrics }>("/api/metrics");
  }

  async getOrganizationMetrics(
    organization: string,
  ): Promise<{ metrics: OrganizationMetrics }> {
    return this.request<{ metrics: OrganizationMetrics }>(
      `/api/metrics/organization/${organization}`,
    );
  }

  async getOverallStats(): Promise<{ stats: OverallStats }> {
    return this.request<{ stats: OverallStats }>("/api/metrics/stats");
  }

  // New comprehensive metrics methods
  async getEngagementMetrics(organization?: string): Promise<{ metrics: EngagementMetrics }> {
    const queryParam = organization ? `?organization=${encodeURIComponent(organization)}` : '';
    return this.request<{ metrics: EngagementMetrics }>(`/api/metrics/engagement${queryParam}`);
  }

  async getImpactMetrics(organization?: string): Promise<{ metrics: ImpactMetrics }> {
    const queryParam = organization ? `?organization=${encodeURIComponent(organization)}` : '';
    return this.request<{ metrics: ImpactMetrics }>(`/api/metrics/impact${queryParam}`);
  }

  async getHealthMetrics(organization?: string): Promise<{ metrics: HealthMetrics }> {
    const queryParam = organization ? `?organization=${encodeURIComponent(organization)}` : '';
    return this.request<{ metrics: HealthMetrics }>(`/api/metrics/health${queryParam}`);
  }

  async getDashboardMetrics(organization?: string): Promise<DashboardMetrics> {
    const queryParam = organization ? `?organization=${encodeURIComponent(organization)}` : '';
    return this.request<DashboardMetrics>(`/api/metrics/dashboard${queryParam}`);
  }
}

export const apiService = new ApiService();
