export interface CanvasState {
  agentName: string;
  problem: string;
  target: string;
  allowedInputs: {
    teamNumber: boolean;
    nickname: boolean;
    realName: boolean;
    phoneNumber: boolean;
    address: boolean;
    birthDate: boolean;
  };
  forbiddenActions: string;
  humanCheckMoment: string;
  privacyRules: string;
  fairnessRules: string;
}

export interface Booth {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  capacity: number; // 10
  bookedCount: number; // current booked count
}

export interface Booking {
  id: string;
  teamNumber: string;
  nickname: string;
  boothId: string;
  timeSlotId: string;
  status: 'pending' | 'confirmed' | 'waitlist';
  timestamp: string;
}

export interface AttackTemplate {
  id: string;
  prompt: string;
  title: string;
  category: 'quantity' | 'privilege' | 'transparency' | 'privacy' | 'human';
}

export interface ImprovementState {
  problemsFound: string;
  defenseRules: string;
  finalImprovement: string;
  reflections: string;
}
