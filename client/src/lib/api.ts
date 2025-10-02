// API service for consuming backend endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface BasicMetrics {
  activeVolunteers: number;
  totalHours: number;
  lastMonthShifts: number;
  totalDonations: number;
}

export interface OrganizationMetrics {
  volunteers: number;
  members: number;
  shifts: number;
  donations: number;
  activities: number;
}

export interface OverallStats {
  volunteers: number;
  members: number;
  shifts: number;
  donations: number;
  activities: number;
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
}

export const apiService = new ApiService();
