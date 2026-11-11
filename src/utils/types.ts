export type UserRole = 'owner' | 'user';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  purchasedNotes: string[];
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  purchasedNotes: string[];
}

export interface NotePackage {
  id: string;
  title: string;
  shortTitle: string;
  code: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  features: string[];
  subjectsCount: number;
  totalUnitsCount: number;
  pyqYearsCovered: string;
  thumbnail: string;
}

export interface ExamQuestion {
  q: string;
  a: string;
}

export interface SubjectUnit {
  id: string;
  unitNumber: string;
  title: string;
  hindiTitle: string;
  type: 'Detailed Notes' | 'Solved PYQs' | string;
  pages: number;
  pdfFile: string | null;
  summary: string;
  keyTopics?: string[];
  examQuestions?: ExamQuestion[];
}

export interface SubjectFolder {
  id: string;
  code: string;
  title: string;
  englishTitle: string;
  description: string;
  unitsCount: number;
  units: SubjectUnit[];
}
