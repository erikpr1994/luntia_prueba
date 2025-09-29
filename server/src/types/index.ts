export interface Volunteer {
  id: string;
  organization: string;
  name: string;
  join_date: string;
  active: string;
  role: string;
}

export interface Member {
  id: string;
  organization: string;
  name: string;
  join_date: string;
  monthly_contribution: string;
}

export interface Shift {
  id: string;
  volunteer_id: string;
  organization: string;
  date: string;
  activity: string;
  hours: string;
}

export interface Donation {
  id: string;
  organization: string;
  date: string;
  donor: string;
  amount: string;
}

export interface Activity {
  id: string;
  organization: string;
  name: string;
  date: string;
  participants: string;
}
