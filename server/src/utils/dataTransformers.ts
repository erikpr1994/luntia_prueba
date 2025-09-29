import { Volunteer, Member, Shift, Donation, Activity } from "../types";
import {
  normalizeDate,
  normalizeBoolean,
  normalizeNumber,
} from "./dataNormalizers";

export const transformVolunteers = (data: Volunteer[]) => {
  return data.map((vol) => ({
    id: vol.id,
    organization: vol.organization,
    name: vol.name,
    join_date: normalizeDate(vol.join_date),
    active: normalizeBoolean(vol.active),
    role: vol.role,
  }));
};

export const transformMembers = (data: Member[]) => {
  return data.map((member) => ({
    id: member.id,
    organization: member.organization,
    name: member.name,
    join_date: normalizeDate(member.join_date),
    monthly_contribution: normalizeNumber(member.monthly_contribution),
  }));
};

export const transformShifts = (data: Shift[]) => {
  return data.map((shift) => ({
    id: shift.id,
    volunteer_id: shift.volunteer_id,
    organization: shift.organization,
    date: normalizeDate(shift.date),
    activity: shift.activity,
    hours: normalizeNumber(shift.hours),
  }));
};

export const transformDonations = (data: Donation[]) => {
  return data.map((donation) => ({
    id: donation.id,
    organization: donation.organization,
    date: normalizeDate(donation.date),
    donor: donation.donor,
    amount: normalizeNumber(donation.amount),
  }));
};

export const transformActivities = (data: Activity[]) => {
  return data.map((activity) => ({
    id: activity.id,
    organization: activity.organization,
    name: activity.name,
    date: normalizeDate(activity.date),
    participants: normalizeNumber(activity.participants),
  }));
};
