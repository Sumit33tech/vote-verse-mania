
export enum UserRole {
  ADMIN = "admin",
  VOTER = "voter"
}

export interface User {
  id: string;
  name: string;
  email: string;
  contact?: string;
  role: UserRole;
  aadharNumber?: string; // Only for voters
}

export interface VotingOption {
  id: string;
  text: string;
}

export interface VotingSchedule {
  id: string;
  code: string;
  title: string;
  startDate: Date;
  endDate: Date;
  options: VotingOption[];
  imageUrl?: string;
  createdBy: string;
}

export interface Vote {
  id: string;
  votingId: string;
  voterId: string;
  optionId: string;
  timestamp: Date;
}
