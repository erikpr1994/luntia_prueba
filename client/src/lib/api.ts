// API service for consuming backend endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface BasicMetrics {
  retentionRate: number;
  avgHoursPerVolunteer: number;
  economicValue: number;
  activeVolunteers: number;
  atRiskVolunteers: number;
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

  async getOverallStats(): Promise<{ stats: OverallStats }> {
    return this.request<{ stats: OverallStats }>("/api/metrics/stats");
  }

  async uploadCSV(
    endpoint: string,
    file: File
  ): Promise<{ message: string; processed: number; errors: number }> {
    try {
      const formData = new FormData();
      formData.append("csv", file);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`CSV upload failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async uploadVolunteersCSV(file: File) {
    return this.uploadCSV("/api/volunteers/upload", file);
  }

  async uploadMembersCSV(file: File) {
    return this.uploadCSV("/api/members/upload", file);
  }

  async uploadShiftsCSV(file: File) {
    return this.uploadCSV("/api/shifts/upload", file);
  }

  async uploadDonationsCSV(file: File) {
    return this.uploadCSV("/api/donations/upload", file);
  }

  async uploadActivitiesCSV(file: File) {
    return this.uploadCSV("/api/activities/upload", file);
  }
}

export const apiService = new ApiService();