export type EducationStage = 'primary' | 'middle' | 'secondary';

export type SectionId =
  | 'dashboard'
  | 'averages'
  | 'absences'
  | 'analytics'
  | 'agenda'
  | 'legislation'
  | 'digitalization'
  | 'documents'
  | 'timetable'
  | 'community'
  | 'institutes'
  | 'career'
  | 'coordination';

export type SchoolLevelName =
  // الابتدائي
  | '1 ابتدائي'
  | '2 ابتدائي'
  | '3 ابتدائي'
  | '4 ابتدائي'
  | '5 ابتدائي'
  // المتوسط
  | '1 متوسط'
  | '2 متوسط'
  | '3 متوسط'
  | '4 متوسط'
  // الثانوي
  | '1 ج م ع ت'
  | '2 علوم تجريبية'
  | '3 علوم تجريبية'
  | '3 تقني رياضي'
  | '3 آداب وفلسفة';

export type MiddleSchoolLevel = SchoolLevelName;

export interface StageMetadata {
  id: EducationStage;
  name: string;
  shortName: string;
  natherTitle: string;
  principalTitle: string;
  inspectorTitle: string;
  institutionLabel: string;
  maxGradeScale: 10 | 20; // 10 في الابتدائي، 20 في المتوسط والثانوي
  passingGrade: 5 | 10; // 5/10 في الابتدائي، 10/20 في المتوسط والثانوي
  hasSupervisedTest: boolean; // الفرض المحروس في المتوسط والثانوي فقط
  hasCoefficients: boolean; // المعاملات في المتوسط والثانوي، بينما في الابتدائي المعامل 1
  nationalExamName: string;
  teacherWeeklyQuota: number; // 21 في المتوسط، 18 في الثانوي، 22.5/24 في الابتدائي
  classificationCategory: string;
  badgeText: string;
  description: string;
}

export interface InstitutionInfo {
  stage: EducationStage;
  schoolName: string;
  wilaya: string;
  directorOfStudies: string;
  customRoleTitle?: string;
  schoolYear: string;
  currentTerm: 1 | 2 | 3;
  logoUrl?: string;
}

export interface ClassGroupMeta {
  name: string;
  level: SchoolLevelName;
  stage: EducationStage;
  label: string;
  stream?: string;
}

export interface SubjectConfig {
  id: string;
  name: string;
  shortName: string;
  stages: EducationStage[];
  coefficients: Record<string, number>;
}

export interface StudentSubjectGrade {
  eval: number; // التقويم المستمر (/10 في الابتدائي، /20 في المتوسط والثانوي)
  test: number; // الفرض المحروس (/20 في المتوسط والثانوي)
  exam: number; // الاختبار الفصلي (/10 في الابتدائي، /20 في المتوسط والثانوي)
  exempt?: boolean; // معفى
}

export interface StudentRecord {
  id: string;
  stage: EducationStage;
  matricule: string;
  fullName: string;
  birthDate: string;
  classGroup: string;
  level: SchoolLevelName;
  parentName: string;
  parentPhone: string;
  isRepeater?: boolean;
  canteenBeneficiary?: boolean; // خاص بالابتدائي (المطعم المدرسي)
  grades: Record<string, StudentSubjectGrade>;
}

export type FormulaMode =
  | 'ministry_standard'
  | 'four_divisor'
  | 'test_exam_only'
  | 'primary_exam_plus_eval'
  | 'primary_exam_only';

export interface CalculatedSubjectResult {
  subjectId: string;
  subjectName: string;
  coefficient: number;
  eval: number;
  test: number;
  continuousAvg: number;
  exam: number;
  subjectAvg: number;
  weightedScore: number;
  exempt: boolean;
  appreciation: string;
  competencyBadge?: string; // في الابتدائي: تحكم أقصى (أ) / مقبول (ب) / جزئي (ج) / أدنى (د)
}

export interface CalculatedStudentSummary {
  student: StudentRecord;
  subjectResults: CalculatedSubjectResult[];
  totalCoefficients: number;
  totalWeightedScore: number;
  termAverage: number;
  maxScale: 10 | 20;
  passingThreshold: 5 | 10;
  rank: number;
  honorRoll: string;
  councilDecision: string;
  unjustifiedAbsencesCount: number;
  justifiedAbsencesCount: number;
  lateCount: number;
  totalMissedHours: number;
  attendanceScore: number;
  weakSubjects: string[];
}

export type AbsenceStatus =
  | 'unjustified'
  | 'justified'
  | 'late'
  | 'warning_sent'
  | 'parent_summoned'
  | 'pledge_signed'
  | 'council_referred'
  | 'deducted'
  | 'health_uds';

export interface AbsenceRecord {
  id: string;
  stage: EducationStage;
  type: 'student' | 'teacher';
  targetId: string;
  personName: string;
  roleOrClass: string;
  level?: SchoolLevelName;
  date: string;
  period: string;
  durationHours: number;
  reason: string;
  status: AbsenceStatus;
  parentNotified: boolean;
  parentPhone?: string;
  canteenAffected?: boolean; // خاص بالابتدائي (إشعار المطعم المدرسي)
  actionTaken: string;
}

export type RollCallState =
  | 'present'
  | 'absent_unjustified'
  | 'absent_justified'
  | 'late'
  | 'exempt';

export interface TeacherRecord {
  id: string;
  stage: EducationStage;
  name: string;
  subject: string;
  rank: string;
  weeklyQuota: number;
  assignedHours: number;
  phone: string;
  digitalSyncCompleted: boolean;
  assignedClasses: string[];
}

export interface TimetableSlot {
  id: string;
  stage: EducationStage;
  day: string;
  period: string;
  classGroup: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface AgendaTask {
  id: string;
  stage: EducationStage | 'all';
  title: string;
  category: 'daily' | 'term' | 'bem_exams' | 'career';
  dueDate: string;
  periodLabel: string;
  priority: 'urgent' | 'high' | 'normal';
  legalRef: string;
  description: string;
  status: 'completed' | 'in_progress' | 'scheduled';
}

export interface LegislativeArticle {
  articleNumber: string;
  summary: string;
  text: string;
}

export interface LegislativeText {
  id: string;
  stage: EducationStage | 'all';
  title: string;
  number: string;
  category: 'decree' | 'decision' | 'digital_2026' | 'bem_2026';
  isUpdated2026?: boolean;
  date: string;
  description: string;
  tags: string[];
  fullText: string;
  keyArticles: LegislativeArticle[];
}

export interface DocumentField {
  key: string;
  label: string;
  defaultValue: string;
  multiline?: boolean;
}

export interface DocumentTemplate {
  id: string;
  stage: EducationStage | 'all';
  code: string;
  title: string;
  category: 'pedagogical' | 'attendance' | 'exams' | 'councils' | 'correspondence';
  description: string;
  fields: DocumentField[];
}
