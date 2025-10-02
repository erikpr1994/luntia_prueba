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

export interface DailyActivity {
  date: string;
  volunteers: number;
  hours: number;
  shifts: number;
}

// Data type interfaces
export interface Volunteer {
  id: string;
  organization: string;
  name: string;
  join_date: string;
  active: boolean;
  role: string;
  created_at: string;
}

export interface Member {
  id: string;
  organization: string;
  name: string;
  join_date: string;
  monthly_contribution: number;
  created_at: string;
}

export interface Shift {
  id: string;
  volunteer_id: string;
  organization: string;
  date: string;
  activity: string;
  hours: number;
  created_at: string;
  volunteer_name?: string;
}

export interface Donation {
  id: string;
  organization: string;
  date: string;
  donor: string;
  amount: number;
  created_at: string;
}

export interface Activity {
  id: string;
  organization: string;
  name: string;
  date: string;
  participants: number;
  created_at: string;
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

  async getDailyVolunteerActivity(
    days: number = 30,
    organization?: string
  ): Promise<{ activity: DailyActivity[] }> {
    const queryParam = organization
      ? `?days=${days}&organization=${encodeURIComponent(organization)}`
      : `?days=${days}`;
    return this.request<{ activity: DailyActivity[] }>(
      `/api/metrics/daily-activity${queryParam}`
    );
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

  // Data fetching methods
  async getVolunteers(filters?: { active?: boolean; organization?: string }) {
    const queryParams = new URLSearchParams();
    if (filters?.active !== undefined) {
      queryParams.append("active", filters.active.toString());
    }
    if (filters?.organization) {
      queryParams.append("organization", filters.organization);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/volunteers${queryString ? `?${queryString}` : ""}`;
    return this.request<{ data: Volunteer[] }>(url);
  }

  async getMembers(filters?: { organization?: string }) {
    const queryParams = new URLSearchParams();
    if (filters?.organization) {
      queryParams.append("organization", filters.organization);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/members${queryString ? `?${queryString}` : ""}`;
    return this.request<{ data: Member[] }>(url);
  }

  async getShifts(filters?: { 
    volunteer_id?: string; 
    organization?: string; 
    date_from?: string; 
    date_to?: string; 
  }) {
    const queryParams = new URLSearchParams();
    if (filters?.volunteer_id) {
      queryParams.append("volunteer_id", filters.volunteer_id);
    }
    if (filters?.organization) {
      queryParams.append("organization", filters.organization);
    }
    if (filters?.date_from) {
      queryParams.append("date_from", filters.date_from);
    }
    if (filters?.date_to) {
      queryParams.append("date_to", filters.date_to);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/shifts${queryString ? `?${queryString}` : ""}`;
    return this.request<{ data: Shift[] }>(url);
  }

  async getDonations(filters?: { organization?: string; date_from?: string; date_to?: string }) {
    const queryParams = new URLSearchParams();
    if (filters?.organization) {
      queryParams.append("organization", filters.organization);
    }
    if (filters?.date_from) {
      queryParams.append("date_from", filters.date_from);
    }
    if (filters?.date_to) {
      queryParams.append("date_to", filters.date_to);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/donations${queryString ? `?${queryString}` : ""}`;
    return this.request<{ data: Donation[] }>(url);
  }

  async getActivities(filters?: { organization?: string; date_from?: string; date_to?: string }) {
    const queryParams = new URLSearchParams();
    if (filters?.organization) {
      queryParams.append("organization", filters.organization);
    }
    if (filters?.date_from) {
      queryParams.append("date_from", filters.date_from);
    }
    if (filters?.date_to) {
      queryParams.append("date_to", filters.date_to);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/activities${queryString ? `?${queryString}` : ""}`;
    return this.request<{ data: Activity[] }>(url);
  }
}

export const apiService = new ApiService();
