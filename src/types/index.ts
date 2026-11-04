export interface InstitutionProfile {
  schoolName: string;
  wilaya: string;
  directorOfStudies: string;
  schoolYear: string;
  currentTerm: 1 | 2 | 3;
  logoUrl?: string;
}

export type SectionType = 
  | 'dashboard'
  | 'legislation'
  | 'documents'
  | 'timetable'
  | 'absences'
  | 'results'
  | 'digitalization'
  | 'institutes'
  | 'community'
  | 'agenda'
  | 'career'
  | 'pedagogical_audit'
  | 'coordination';

export interface LawItem {
  id: string;
  title: string;
  category: 'decree' | 'circular' | 'decision' | 'civil_service' | 'digital_2026';
  number: string;
  date: string;
  description: string;
  fullText: string;
  isUpdated2026?: boolean;
  keyArticles: {
    articleNumber: string;
    summary: string;
    text: string;
  }[];
  tags: string[];
}

export interface OfficialDocumentTemplate {
  id: string;
  title: string;
  code: string;
  category: 'pedagogy' | 'admin' | 'exams' | 'councils' | 'correspondence';
  description: string;
  defaultData: Record<string, string>;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'textarea' | 'number';
    options?: string[];
    placeholder?: string;
  }[];
}

export interface TimetableSlot {
  id: string;
  day: 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  period: '08:00 - 09:00' | '09:00 - 10:00' | '10:00 - 11:00' | '11:00 - 12:00' | '14:00 - 15:00' | '15:00 - 16:00' | '16:00 - 17:00';
  classGroup: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface TeacherRecord {
  id: string;
  name: string;
  subject: string;
  weeklyQuota: number;
  assignedHours: number;
  phone?: string;
  email?: string;
}

export interface AbsenceRecord {
  id: string;
  type: 'teacher' | 'student';
  personName: string;
  identifier: string;
  date: string;
  period: string;
  hours: number;
  reason?: string;
  isJustified: boolean;
  status: 'pending' | 'warning_sent' | 'deduction_applied' | 'justified';
  notes?: string;
}

export interface StudentScore {
  id: string;
  name: string;
  classGroup: string;
  stream: string;
  scores: {
    subject: string;
    continuousScore: number;
    examScore: number;
    coefficient: number;
  }[];
  average: number;
  rank?: number;
  mention?: string;
}

export interface ForumPost {
  id: string;
  author: string;
  wilaya: string;
  school: string;
  date: string;
  title: string;
  content: string;
  category: 'تنظيم امتحانات' | 'جداول توقيت' | 'تطبيق مناشير' | 'مجالس الأقسام' | 'شؤون الأساتذة';
  repliesCount: number;
  likes: number;
  replies?: {
    author: string;
    date: string;
    text: string;
    isOfficialClarification?: boolean;
  }[];
}

export interface SupervisedInstitute {
  id: string;
  acronym: string;
  name: string;
  category: 'امتحانات ومسابقات' | 'بحث وتكوين بيداغوجي' | 'كتاب ومطبوعات' | 'رقمنة وتعليم عن بعد';
  headquarters: string;
  officialPortal: string;
  description: string;
  directorOfStudiesRole: string[];
  annualDeadlines: {
    period: string;
    task: string;
  }[];
  officialDocuments: string[];
}

export interface CommunityAnnouncement {
  id: string;
  targetGroup: 'الأساتذة والمنسقون' | 'أولياء التلاميذ' | 'التلاميذ ومندوبو الأقسام' | 'الطاقم الإداري والتربوي';
  title: string;
  content: string;
  date: string;
  priority: 'عادي' | 'هام' | 'مستعجل جداً';
  channel: 'لوحة الإعلانات والرقمنة' | 'رسالة نصية / استدعاء' | 'محضر تبليغ رسمي';
  status: 'منشور ومبلغ' | 'قيد الإمضاء';
}

export interface TextbookAuditRecord {
  id: string;
  classGroup: string;
  subject: string;
  teacherName: string;
  lastInspectDate: string;
  completionRate: number;
  status: 'منتظم ومؤشر' | 'تأخر طفيف في البرنامج' | 'نقص في تدوين الكفاءات';
  inspectorNotes: string;
}

export interface DirectorAgendaItem {
  id: string;
  title: string;
  category: 'daily_weekly' | 'term_councils' | 'official_exams' | 'career_admin';
  dueDate: string;
  periodLabel: string;
  priority: 'urgent' | 'high' | 'normal';
  status: 'completed' | 'in_progress' | 'upcoming';
  legalReference: string;
  description: string;
}

export interface DirectoryContactItem {
  id: string;
  name: string;
  roleTitle: string;
  category: 'admin_staff' | 'coordinators' | 'parents_students' | 'external_authorities';
  departmentOrSubject: string;
  phone: string;
  email: string;
  officeOrLocation: string;
  availabilityHours: string;
  notes?: string;
}
