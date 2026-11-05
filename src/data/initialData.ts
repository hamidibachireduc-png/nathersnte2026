import {
  EducationStage,
  StageMetadata,
  InstitutionInfo,
  ClassGroupMeta,
  SubjectConfig,
  StudentRecord,
  AbsenceRecord,
  TeacherRecord,
  TimetableSlot,
  AgendaTask,
  LegislativeText,
  DocumentTemplate,
  FormulaMode,
  CalculatedSubjectResult,
  CalculatedStudentSummary,
} from '../types';

export const DEFAULT_EMBLEM_URL = '/src/assets/images/nather_cem_emblem_1793877101181.jpg';

export const STAGE_METADATA: Record<EducationStage, StageMetadata> = {
  primary: {
    id: 'primary',
    name: 'الطور الابتدائي',
    shortName: 'ابتدائي',
    natherTitle: 'ناظر المدرسة الابتدائية / مساعد المدير',
    principalTitle: 'مدير المدرسة الابتدائية',
    inspectorTitle: 'مفتش التعليم الابتدائي (إدارة المدارس الابتدائية)',
    institutionLabel: 'المدرسة الابتدائية',
    maxGradeScale: 10,
    passingGrade: 5,
    hasSupervisedTest: false,
    hasCoefficients: false,
    nationalExamName: 'امتحان تقييم المكتسبات لمرحلة التعليم الابتدائي (5 ابتدائي)',
    teacherWeeklyQuota: 22.5,
    classificationCategory: 'الصنف 14 / 15 (المرسوم التنفيذي 25-54)',
    badgeText: 'سلم التنقيط /10 · تقييم المكتسبات · المطعم والصحة المدرسية',
    description:
      'يعتمد الطور الابتدائي سلم التنقيط من 10 (/10) ومعدل الانتقال 5.00/10 بدون معاملات معقدة، مع تقييم الكفاءات والمكتسبات، ومتابعة الغيابات بالفترات (صباحاً/مساءً) وربطها بالمطعم المدرسي ووحدة الكشف الصحي UDS.',
  },
  middle: {
    id: 'middle',
    name: 'الطور المتوسط',
    shortName: 'متوسط',
    natherTitle: 'ناظر المتوسطة',
    principalTitle: 'مدير المتوسطة',
    inspectorTitle: 'مفتش التعليم المتوسط (إدارة المتوسطات)',
    institutionLabel: 'المتوسطة',
    maxGradeScale: 20,
    passingGrade: 10,
    hasSupervisedTest: true,
    hasCoefficients: true,
    nationalExamName: 'امتحان شهادة التعليم المتوسط (BEM 2026)',
    teacherWeeklyQuota: 21,
    classificationCategory: 'الصنف 15 / 16 (المرسوم التنفيذي 25-54)',
    badgeText: 'سلم التنقيط /20 · المعاملات الرسمية (1م-4م) · شهادة التعليم المتوسط BEM',
    description:
      'يعتمد الطور المتوسط سلم التنقيط من 20 (/20) بمعادلة [(التقويم + الفرض)/2 + الاختبار×2] ÷ 3 ومعاملات متدرجة حسب المستويات الأربعة (1م إلى 4م)، ونصاب أستاذ التعليم المتوسط 21 ساعة أسبوعياً.',
  },
  secondary: {
    id: 'secondary',
    name: 'الطور الثانوي',
    shortName: 'ثانوي',
    natherTitle: 'ناظر الثانوية (مدير الدراسات)',
    principalTitle: 'مدير الثانوية',
    inspectorTitle: 'مفتش التربية الوطنية (إدارة الثانويات)',
    institutionLabel: 'الثانوية',
    maxGradeScale: 20,
    passingGrade: 10,
    hasSupervisedTest: true,
    hasCoefficients: true,
    nationalExamName: 'امتحان شهادة البكالوريا (BAC 2026)',
    teacherWeeklyQuota: 18,
    classificationCategory: 'الصنف 16 / 17 (المرسوم التنفيذي 25-54 والقرار 834)',
    badgeText: 'سلم التنقيط /20 · معاملات الشعب والجذوع · شهادة البكالوريا BAC',
    description:
      'يعتمد الطور الثانوي سلم التنقيط من 20 (/20) مع خصوصية الجذوع المشتركة والشعب (علوم تجريبية، تقني رياضي، آداب وفلسفة) ذات المعاملات العالية للمواد المميزة، وتفويج الأعمال المخبرية ونصاب 18 ساعة أسبوعياً.',
  },
};

export const INITIAL_INSTITUTIONS_BY_STAGE: Record<EducationStage, InstitutionInfo> = {
  primary: {
    stage: 'primary',
    schoolName: 'المدرسة الابتدائية الشهيد محمد العربي بن مهيدي',
    wilaya: 'ولاية قسنطينة (025)',
    directorOfStudies: 'الأستاذ عبد الرزاق بوقرة',
    schoolYear: '2025 / 2026',
    currentTerm: 2,
    logoUrl: DEFAULT_EMBLEM_URL,
  },
  middle: {
    stage: 'middle',
    schoolName: 'متوسطة الشهيد العربي بن مهيدي',
    wilaya: 'ولاية قسنطينة (025)',
    directorOfStudies: 'الأستاذ عبد الرزاق بوقرة',
    schoolYear: '2025 / 2026',
    currentTerm: 2,
    logoUrl: DEFAULT_EMBLEM_URL,
  },
  secondary: {
    stage: 'secondary',
    schoolName: 'ثانوية الشهيد زيغود يوسف',
    wilaya: 'ولاية قسنطينة (025)',
    directorOfStudies: 'الأستاذ عبد الرزاق بوقرة',
    schoolYear: '2025 / 2026',
    currentTerm: 2,
    logoUrl: DEFAULT_EMBLEM_URL,
  },
};

export const INITIAL_INSTITUTION: InstitutionInfo = INITIAL_INSTITUTIONS_BY_STAGE.middle;

export const CLASS_GROUPS: ClassGroupMeta[] = [
  // أقسام الطور الابتدائي
  {
    name: '5 إب 1',
    level: '5 ابتدائي',
    stage: 'primary',
    label: 'السنة الخامسة ابتدائي — فوج 1 (قسم تقييم المكتسبات)',
  },
  {
    name: '4 إب 1',
    level: '4 ابتدائي',
    stage: 'primary',
    label: 'السنة الرابعة ابتدائي — فوج 1',
  },
  {
    name: '3 إب 1',
    level: '3 ابتدائي',
    stage: 'primary',
    label: 'السنة الثالثة ابتدائي — فوج 1',
  },
  {
    name: '2 إب 1',
    level: '2 ابتدائي',
    stage: 'primary',
    label: 'السنة الثانية ابتدائي — فوج 1',
  },
  {
    name: '1 إب 1',
    level: '1 ابتدائي',
    stage: 'primary',
    label: 'السنة الأولى ابتدائي — فوج 1 (الطور الأول التأسيسي)',
  },

  // أقسام الطور المتوسط
  {
    name: '4 م 1',
    level: '4 متوسط',
    stage: 'middle',
    label: 'السنة الرابعة متوسط — فوج 1 (قسم شهادة التعليم المتوسط BEM)',
  },
  {
    name: '4 م 2',
    level: '4 متوسط',
    stage: 'middle',
    label: 'السنة الرابعة متوسط — فوج 2 (قسم شهادة التعليم المتوسط BEM)',
  },
  {
    name: '3 م 1',
    level: '3 متوسط',
    stage: 'middle',
    label: 'السنة الثالثة متوسط — فوج 1',
  },
  {
    name: '2 م 1',
    level: '2 متوسط',
    stage: 'middle',
    label: 'السنة الثانية متوسط — فوج 1',
  },
  {
    name: '1 م 1',
    level: '1 متوسط',
    stage: 'middle',
    label: 'السنة الأولى متوسط — فوج 1 (جذع مشترك مرحلة متوسطة)',
  },

  // أقسام الطور الثانوي
  {
    name: '3 ع ت 1',
    level: '3 علوم تجريبية',
    stage: 'secondary',
    stream: 'شعبة العلوم التجريبية',
    label: 'السنة الثالثة ثانوي — علوم تجريبية 1 (قسم البكالوريا BAC)',
  },
  {
    name: '3 ت ر 1',
    level: '3 تقني رياضي',
    stage: 'secondary',
    stream: 'شعبة تقني رياضي',
    label: 'السنة الثالثة ثانوي — تقني رياضي 1 (قسم البكالوريا BAC)',
  },
  {
    name: '3 آ ف 1',
    level: '3 آداب وفلسفة',
    stage: 'secondary',
    stream: 'شعبة آداب وفلسفة',
    label: 'السنة الثالثة ثانوي — آداب وفلسفة 1 (قسم البكالوريا BAC)',
  },
  {
    name: '2 ع ت 1',
    level: '2 علوم تجريبية',
    stage: 'secondary',
    stream: 'شعبة العلوم التجريبية',
    label: 'السنة الثانية ثانوي — علوم تجريبية 1',
  },
  {
    name: '1 ج م ع ت 1',
    level: '1 ج م ع ت',
    stage: 'secondary',
    stream: 'جذع مشترك علوم وتكنولوجيا',
    label: 'السنة الأولى ثانوي — جذع مشترك علوم وتكنولوجيا 1',
  },
];

export const INITIAL_SUBJECTS: SubjectConfig[] = [
  {
    id: 'arabic',
    name: 'اللغة العربية وآدابها',
    shortName: 'اللغة العربية',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 3,
      '2 متوسط': 4,
      '3 متوسط': 4,
      '4 متوسط': 5,
      '1 ج م ع ت': 3,
      '2 علوم تجريبية': 2,
      '3 علوم تجريبية': 3,
      '3 تقني رياضي': 3,
      '3 آداب وفلسفة': 6,
    },
  },
  {
    id: 'math',
    name: 'الرياضيات',
    shortName: 'الرياضيات',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 3,
      '2 متوسط': 3,
      '3 متوسط': 3,
      '4 متوسط': 4,
      '1 ج م ع ت': 5,
      '2 علوم تجريبية': 5,
      '3 علوم تجريبية': 5,
      '3 تقني رياضي': 6,
      '3 آداب وفلسفة': 2,
    },
  },
  {
    id: 'physics',
    name: 'العلوم الفيزيائية والتكنولوجيا',
    shortName: 'الفيزياء والتكنولوجيا',
    stages: ['middle', 'secondary'],
    coefficients: {
      '1 متوسط': 2,
      '2 متوسط': 2,
      '3 متوسط': 2,
      '4 متوسط': 2,
      '1 ج م ع ت': 4,
      '2 علوم تجريبية': 5,
      '3 علوم تجريبية': 5,
      '3 تقني رياضي': 6,
      '3 آداب وفلسفة': 1,
    },
  },
  {
    id: 'science',
    name: 'علوم الطبيعة والحياة / التربية العلمية',
    shortName: 'العلوم / ت. علمية',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 2,
      '2 متوسط': 2,
      '3 متوسط': 2,
      '4 متوسط': 2,
      '1 ج م ع ت': 4,
      '2 علوم تجريبية': 6,
      '3 علوم تجريبية': 6,
      '3 تقني رياضي': 2,
      '3 آداب وفلسفة': 1,
    },
  },
  {
    id: 'french',
    name: 'اللغة الفرنسية',
    shortName: 'الفرنسية',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 2,
      '2 متوسط': 2,
      '3 متوسط': 2,
      '4 متوسط': 3,
      '1 ج م ع ت': 2,
      '2 علوم تجريبية': 2,
      '3 علوم تجريبية': 2,
      '3 تقني رياضي': 2,
      '3 آداب وفلسفة': 3,
    },
  },
  {
    id: 'english',
    name: 'اللغة الإنجليزية',
    shortName: 'الإنجليزية',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 1,
      '2 متوسط': 1,
      '3 متوسط': 1,
      '4 متوسط': 2,
      '1 ج م ع ت': 2,
      '2 علوم تجريبية': 2,
      '3 علوم تجريبية': 2,
      '3 تقني رياضي': 2,
      '3 آداب وفلسفة': 3,
    },
  },
  {
    id: 'hist_geo',
    name: 'التاريخ والجغرافيا',
    shortName: 'تاريخ وجغرافيا',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 2,
      '2 متوسط': 2,
      '3 متوسط': 2,
      '4 متوسط': 3,
      '1 ج م ع ت': 2,
      '2 علوم تجريبية': 2,
      '3 علوم تجريبية': 2,
      '3 تقني رياضي': 2,
      '3 آداب وفلسفة': 4,
    },
  },
  {
    id: 'islamic',
    name: 'التربية / العلوم الإسلامية',
    shortName: 'تربية إسلامية',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 1,
      '2 متوسط': 1,
      '3 متوسط': 1,
      '4 متوسط': 2,
      '1 ج م ع ت': 2,
      '2 علوم تجريبية': 2,
      '3 علوم تجريبية': 2,
      '3 تقني رياضي': 2,
      '3 آداب وفلسفة': 2,
    },
  },
  {
    id: 'civics',
    name: 'التربية المدنية',
    shortName: 'تربية مدنية',
    stages: ['primary', 'middle'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 1,
      '2 متوسط': 1,
      '3 متوسط': 1,
      '4 متوسط': 1,
    },
  },
  {
    id: 'philosophy',
    name: 'الفلسفة',
    shortName: 'الفلسفة',
    stages: ['secondary'],
    coefficients: {
      '1 ج م ع ت': 1,
      '2 علوم تجريبية': 2,
      '3 علوم تجريبية': 2,
      '3 تقني رياضي': 2,
      '3 آداب وفلسفة': 6,
    },
  },
  {
    id: 'informatics',
    name: 'الإعلام الآلي / التربية الفنية والتشكيلية',
    shortName: 'إعلام آلي / فنية',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 1,
      '2 متوسط': 1,
      '3 متوسط': 1,
      '4 متوسط': 1,
      '1 ج م ع ت': 2,
      '2 علوم تجريبية': 1,
      '3 علوم تجريبية': 1,
      '3 تقني رياضي': 2,
      '3 آداب وفلسفة': 1,
    },
  },
  {
    id: 'sports',
    name: 'التربية البدنية والرياضية',
    shortName: 'تربية بدنية',
    stages: ['primary', 'middle', 'secondary'],
    coefficients: {
      '1 ابتدائي': 1,
      '2 ابتدائي': 1,
      '3 ابتدائي': 1,
      '4 ابتدائي': 1,
      '5 ابتدائي': 1,
      '1 متوسط': 1,
      '2 متوسط': 1,
      '3 متوسط': 1,
      '4 متوسط': 1,
      '1 ج م ع ت': 1,
      '2 علوم تجريبية': 1,
      '3 علوم تجريبية': 1,
      '3 تقني رياضي': 1,
      '3 آداب وفلسفة': 1,
    },
  },
];

export const INITIAL_STUDENTS: StudentRecord[] = [
  // ==================== تلاميذ الطور الابتدائي (سلم التنقيط /10) ====================
  {
    id: 'st-p1',
    stage: 'primary',
    matricule: '2026050101',
    fullName: 'نور اليقين بوعلام',
    birthDate: '2015-03-14',
    classGroup: '5 إب 1',
    level: '5 ابتدائي',
    parentName: 'حكيم بوعلام',
    parentPhone: '0551 10 20 30',
    canteenBeneficiary: true,
    grades: {
      arabic: { eval: 9.5, test: 9.5, exam: 9.5 },
      math: { eval: 9.25, test: 9.25, exam: 9.5 },
      science: { eval: 9.0, test: 9.0, exam: 9.25 },
      french: { eval: 8.75, test: 8.75, exam: 9.0 },
      english: { eval: 9.5, test: 9.5, exam: 9.5 },
      hist_geo: { eval: 9.0, test: 9.0, exam: 9.0 },
      islamic: { eval: 10, test: 10, exam: 10 },
      civics: { eval: 9.5, test: 9.5, exam: 9.5 },
      informatics: { eval: 9.5, test: 9.5, exam: 9.5 },
      sports: { eval: 9.5, test: 9.5, exam: 9.5 },
    },
  },
  {
    id: 'st-p2',
    stage: 'primary',
    matricule: '2026050102',
    fullName: 'آدم بن ساحلي',
    birthDate: '2015-07-22',
    classGroup: '5 إب 1',
    level: '5 ابتدائي',
    parentName: 'يوسف بن ساحلي',
    parentPhone: '0662 45 78 90',
    canteenBeneficiary: true,
    grades: {
      arabic: { eval: 7.5, test: 7.5, exam: 8.0 },
      math: { eval: 8.0, test: 8.0, exam: 8.25 },
      science: { eval: 7.75, test: 7.75, exam: 8.0 },
      french: { eval: 6.5, test: 6.5, exam: 7.0 },
      english: { eval: 7.5, test: 7.5, exam: 8.0 },
      hist_geo: { eval: 7.5, test: 7.5, exam: 7.5 },
      islamic: { eval: 9.0, test: 9.0, exam: 9.0 },
      civics: { eval: 8.5, test: 8.5, exam: 8.5 },
      informatics: { eval: 9.0, test: 9.0, exam: 9.0 },
      sports: { eval: 9.0, test: 9.0, exam: 9.0 },
    },
  },
  {
    id: 'st-p3',
    stage: 'primary',
    matricule: '2026050103',
    fullName: 'صهيب دردار',
    birthDate: '2015-11-04',
    classGroup: '5 إب 1',
    level: '5 ابتدائي',
    parentName: 'عمر دردار',
    parentPhone: '0773 88 12 44',
    canteenBeneficiary: false,
    grades: {
      arabic: { eval: 5.5, test: 5.5, exam: 5.0 },
      math: { eval: 4.5, test: 4.5, exam: 4.5 },
      science: { eval: 6.0, test: 6.0, exam: 5.5 },
      french: { eval: 4.0, test: 4.0, exam: 4.5 },
      english: { eval: 5.5, test: 5.5, exam: 5.5 },
      hist_geo: { eval: 5.5, test: 5.5, exam: 5.0 },
      islamic: { eval: 7.5, test: 7.5, exam: 7.0 },
      civics: { eval: 6.5, test: 6.5, exam: 6.0 },
      informatics: { eval: 8.0, test: 8.0, exam: 8.0 },
      sports: { eval: 8.5, test: 8.5, exam: 8.5 },
    },
  },
  {
    id: 'st-p4',
    stage: 'primary',
    matricule: '2026050104',
    fullName: 'جنى رحماني',
    birthDate: '2015-09-18',
    classGroup: '5 إب 1',
    level: '5 ابتدائي',
    parentName: 'سمير رحماني',
    parentPhone: '0557 33 21 09',
    canteenBeneficiary: true,
    grades: {
      arabic: { eval: 4.5, test: 4.5, exam: 4.0 },
      math: { eval: 3.5, test: 3.5, exam: 4.0 },
      science: { eval: 4.5, test: 4.5, exam: 4.5 },
      french: { eval: 3.5, test: 3.5, exam: 3.5 },
      english: { eval: 4.5, test: 4.5, exam: 4.5 },
      hist_geo: { eval: 4.5, test: 4.5, exam: 4.0 },
      islamic: { eval: 6.5, test: 6.5, exam: 6.5 },
      civics: { eval: 5.5, test: 5.5, exam: 5.5 },
      informatics: { eval: 7.0, test: 7.0, exam: 7.0 },
      sports: { eval: 8.0, test: 8.0, exam: 8.0 },
    },
  },
  {
    id: 'st-p5',
    stage: 'primary',
    matricule: '2026040101',
    fullName: 'إياد بوقرة',
    birthDate: '2016-04-02',
    classGroup: '4 إب 1',
    level: '4 ابتدائي',
    parentName: 'نبيل بوقرة',
    parentPhone: '0661 70 80 90',
    canteenBeneficiary: true,
    grades: {
      arabic: { eval: 8.5, test: 8.5, exam: 9.0 },
      math: { eval: 8.75, test: 8.75, exam: 9.0 },
      science: { eval: 8.5, test: 8.5, exam: 8.5 },
      french: { eval: 8.0, test: 8.0, exam: 8.5 },
      english: { eval: 8.5, test: 8.5, exam: 9.0 },
      hist_geo: { eval: 8.5, test: 8.5, exam: 8.5 },
      islamic: { eval: 9.5, test: 9.5, exam: 9.5 },
      civics: { eval: 9.0, test: 9.0, exam: 9.0 },
      informatics: { eval: 9.0, test: 9.0, exam: 9.0 },
      sports: { eval: 9.5, test: 9.5, exam: 9.5 },
    },
  },

  // ==================== تلاميذ الطور المتوسط (سلم التنقيط /20) ====================
  {
    id: 'st-1',
    stage: 'middle',
    matricule: '2026040101',
    fullName: 'آية الرحمان بن عيسى',
    birthDate: '2011-04-12',
    classGroup: '4 م 1',
    level: '4 متوسط',
    parentName: 'كمال بن عيسى',
    parentPhone: '0550 18 22 90',
    grades: {
      arabic: { eval: 18, test: 17.5, exam: 18 },
      math: { eval: 19, test: 18.5, exam: 19 },
      physics: { eval: 17.5, test: 17, exam: 18 },
      science: { eval: 18, test: 17.5, exam: 17.5 },
      french: { eval: 16.5, test: 16, exam: 17 },
      english: { eval: 18, test: 18, exam: 18.5 },
      hist_geo: { eval: 17, test: 16.5, exam: 17.5 },
      islamic: { eval: 19, test: 19, exam: 19.5 },
      civics: { eval: 18, test: 18, exam: 18.5 },
      informatics: { eval: 19, test: 18.5, exam: 19 },
      sports: { eval: 18, test: 18, exam: 18.5 },
    },
  },
  {
    id: 'st-2',
    stage: 'middle',
    matricule: '2026040102',
    fullName: 'محمد أمين بوعزيز',
    birthDate: '2011-08-23',
    classGroup: '4 م 1',
    level: '4 متوسط',
    parentName: 'رشيد بوعزيز',
    parentPhone: '0661 44 12 77',
    grades: {
      arabic: { eval: 15.5, test: 15, exam: 16 },
      math: { eval: 16.5, test: 16, exam: 17 },
      physics: { eval: 15, test: 14.5, exam: 15.5 },
      science: { eval: 16, test: 15, exam: 15.5 },
      french: { eval: 14, test: 13.5, exam: 14.5 },
      english: { eval: 15, test: 15, exam: 16 },
      hist_geo: { eval: 15.5, test: 15, exam: 15.5 },
      islamic: { eval: 17, test: 16.5, exam: 17.5 },
      civics: { eval: 16, test: 15.5, exam: 16 },
      informatics: { eval: 17.5, test: 17, exam: 18 },
      sports: { eval: 17, test: 17, exam: 17.5 },
    },
  },
  {
    id: 'st-3',
    stage: 'middle',
    matricule: '2026040103',
    fullName: 'ياسين خالدي',
    birthDate: '2011-01-19',
    classGroup: '4 م 1',
    level: '4 متوسط',
    parentName: 'محفوظ خالدي',
    parentPhone: '0772 91 33 40',
    grades: {
      arabic: { eval: 13, test: 12.5, exam: 13.5 },
      math: { eval: 14, test: 13, exam: 14.5 },
      physics: { eval: 12.5, test: 12, exam: 13 },
      science: { eval: 13.5, test: 13, exam: 14 },
      french: { eval: 11.5, test: 11, exam: 12 },
      english: { eval: 13, test: 12.5, exam: 13 },
      hist_geo: { eval: 14, test: 13.5, exam: 14 },
      islamic: { eval: 15.5, test: 15, exam: 16 },
      civics: { eval: 14.5, test: 14, exam: 15 },
      informatics: { eval: 16, test: 15.5, exam: 16.5 },
      sports: { eval: 16.5, test: 16, exam: 17 },
    },
  },
  {
    id: 'st-4',
    stage: 'middle',
    matricule: '2026040104',
    fullName: 'سارة منصوري',
    birthDate: '2011-11-05',
    classGroup: '4 م 1',
    level: '4 متوسط',
    parentName: 'نور الدين منصوري',
    parentPhone: '0558 60 11 29',
    grades: {
      arabic: { eval: 14.5, test: 14, exam: 15 },
      math: { eval: 12, test: 11.5, exam: 12.5 },
      physics: { eval: 13, test: 12.5, exam: 13.5 },
      science: { eval: 14.5, test: 14, exam: 15 },
      french: { eval: 15, test: 14.5, exam: 15.5 },
      english: { eval: 16, test: 15.5, exam: 16 },
      hist_geo: { eval: 14.5, test: 14, exam: 14.5 },
      islamic: { eval: 16.5, test: 16, exam: 17 },
      civics: { eval: 15, test: 15, exam: 15.5 },
      informatics: { eval: 15.5, test: 15, exam: 16 },
      sports: { eval: 15, test: 15, exam: 15, exempt: true },
    },
  },
  {
    id: 'st-5',
    stage: 'middle',
    matricule: '2026040105',
    fullName: 'عبد الرحمان زروقي',
    birthDate: '2010-12-17',
    classGroup: '4 م 1',
    level: '4 متوسط',
    parentName: 'بلقاسم زروقي',
    parentPhone: '0663 87 45 12',
    isRepeater: true,
    grades: {
      arabic: { eval: 10.5, test: 9.5, exam: 10 },
      math: { eval: 8.5, test: 7.5, exam: 8 },
      physics: { eval: 9.5, test: 9, exam: 9.5 },
      science: { eval: 11, test: 10, exam: 10.5 },
      french: { eval: 8, test: 7.5, exam: 8.5 },
      english: { eval: 10, test: 9.5, exam: 10 },
      hist_geo: { eval: 11.5, test: 11, exam: 11 },
      islamic: { eval: 13.5, test: 13, exam: 14 },
      civics: { eval: 12, test: 11.5, exam: 12 },
      informatics: { eval: 14, test: 13.5, exam: 14 },
      sports: { eval: 16, test: 15.5, exam: 16.5 },
    },
  },
  {
    id: 'st-6',
    stage: 'middle',
    matricule: '2026040106',
    fullName: 'أيمن بن طوبال',
    birthDate: '2011-03-28',
    classGroup: '4 م 1',
    level: '4 متوسط',
    parentName: 'حسان بن طوبال',
    parentPhone: '0790 22 49 81',
    grades: {
      arabic: { eval: 9, test: 8.5, exam: 8 },
      math: { eval: 7, test: 6.5, exam: 7 },
      physics: { eval: 8.5, test: 8, exam: 8.5 },
      science: { eval: 9.5, test: 9, exam: 9 },
      french: { eval: 7.5, test: 7, exam: 7.5 },
      english: { eval: 8.5, test: 8, exam: 8.5 },
      hist_geo: { eval: 10, test: 9.5, exam: 9.5 },
      islamic: { eval: 12, test: 11.5, exam: 12 },
      civics: { eval: 11, test: 10.5, exam: 11 },
      informatics: { eval: 13, test: 12.5, exam: 13 },
      sports: { eval: 15.5, test: 15, exam: 16 },
    },
  },

  // ==================== تلاميذ الطور الثانوي (سلم التنقيط /20 ومعاملات الشعب) ====================
  {
    id: 'st-s1',
    stage: 'secondary',
    matricule: '2026030101',
    fullName: 'أمير بوعزيز',
    birthDate: '2008-05-11',
    classGroup: '3 ع ت 1',
    level: '3 علوم تجريبية',
    parentName: 'عبد القادر بوعزيز',
    parentPhone: '0550 91 82 73',
    grades: {
      arabic: { eval: 16.5, test: 16, exam: 17 },
      math: { eval: 18, test: 17.5, exam: 18.5 },
      physics: { eval: 17.5, test: 17, exam: 18 },
      science: { eval: 18.5, test: 18, exam: 18.5 },
      french: { eval: 15.5, test: 15, exam: 16 },
      english: { eval: 17, test: 16.5, exam: 17.5 },
      hist_geo: { eval: 16, test: 15.5, exam: 16.5 },
      islamic: { eval: 18, test: 18, exam: 18.5 },
      philosophy: { eval: 14.5, test: 14, exam: 15 },
      informatics: { eval: 18, test: 17.5, exam: 18 },
      sports: { eval: 18, test: 18, exam: 18 },
    },
  },
  {
    id: 'st-s2',
    stage: 'secondary',
    matricule: '2026030102',
    fullName: 'خالد بن يطو',
    birthDate: '2008-09-20',
    classGroup: '3 ع ت 1',
    level: '3 علوم تجريبية',
    parentName: 'سليمان بن يطو',
    parentPhone: '0661 23 45 67',
    grades: {
      arabic: { eval: 14, test: 13.5, exam: 14.5 },
      math: { eval: 15, test: 14.5, exam: 15.5 },
      physics: { eval: 14.5, test: 14, exam: 15 },
      science: { eval: 15.5, test: 15, exam: 16 },
      french: { eval: 13, test: 12.5, exam: 13.5 },
      english: { eval: 14.5, test: 14, exam: 15 },
      hist_geo: { eval: 14, test: 13.5, exam: 14.5 },
      islamic: { eval: 16.5, test: 16, exam: 17 },
      philosophy: { eval: 13, test: 12.5, exam: 13.5 },
      informatics: { eval: 16, test: 15.5, exam: 16 },
      sports: { eval: 17, test: 17, exam: 17.5 },
    },
  },
  {
    id: 'st-s3',
    stage: 'secondary',
    matricule: '2026030103',
    fullName: 'إيمان زايدي',
    birthDate: '2008-02-14',
    classGroup: '3 ع ت 1',
    level: '3 علوم تجريبية',
    parentName: 'لخضر زايدي',
    parentPhone: '0770 11 22 33',
    grades: {
      arabic: { eval: 12.5, test: 12, exam: 13 },
      math: { eval: 11.5, test: 11, exam: 12 },
      physics: { eval: 12, test: 11.5, exam: 12.5 },
      science: { eval: 13, test: 12.5, exam: 13.5 },
      french: { eval: 14, test: 13.5, exam: 14.5 },
      english: { eval: 14.5, test: 14, exam: 15 },
      hist_geo: { eval: 13.5, test: 13, exam: 14 },
      islamic: { eval: 15, test: 14.5, exam: 15.5 },
      philosophy: { eval: 12.5, test: 12, exam: 13 },
      informatics: { eval: 15, test: 14.5, exam: 15 },
      sports: { eval: 16, test: 16, exam: 16, exempt: true },
    },
  },
  {
    id: 'st-s4',
    stage: 'secondary',
    matricule: '2026030104',
    fullName: 'وليد قندوز',
    birthDate: '2007-11-30',
    classGroup: '3 ع ت 1',
    level: '3 علوم تجريبية',
    parentName: 'رشيد قندوز',
    parentPhone: '0555 88 99 00',
    isRepeater: true,
    grades: {
      arabic: { eval: 10, test: 9.5, exam: 9.5 },
      math: { eval: 8.5, test: 8, exam: 8.5 },
      physics: { eval: 9, test: 8.5, exam: 9 },
      science: { eval: 9.5, test: 9, exam: 9.5 },
      french: { eval: 8.5, test: 8, exam: 8.5 },
      english: { eval: 9.5, test: 9, exam: 9.5 },
      hist_geo: { eval: 10.5, test: 10, exam: 10.5 },
      islamic: { eval: 12.5, test: 12, exam: 13 },
      philosophy: { eval: 9.5, test: 9, exam: 9.5 },
      informatics: { eval: 13, test: 12.5, exam: 13 },
      sports: { eval: 16, test: 15.5, exam: 16 },
    },
  },
];

export const INITIAL_ABSENCES: AbsenceRecord[] = [
  // غيابات الطور الابتدائي
  {
    id: 'abs-p1',
    stage: 'primary',
    type: 'student',
    targetId: 'st-p4',
    personName: 'جنى رحماني',
    roleOrClass: '5 إب 1',
    level: '5 ابتدائي',
    date: '2026-03-04',
    period: 'الفترة الصباحية (08:00 - 11:15)',
    durationHours: 3,
    reason: 'وعكة صحية (حمى موسمية) — تم إشعار المطعم المدرسي ووحدة الكشف الصحي UDS',
    status: 'parent_summoned',
    parentNotified: true,
    parentPhone: '0557 33 21 09',
    canteenAffected: true,
    actionTaken: 'تم الاتصال الهاتفي الفوري بالولي للاطمئنان على صحة التلميذة وتحيين تعداد وجبات المطعم المدرسي.',
  },
  {
    id: 'abs-p2',
    stage: 'primary',
    type: 'student',
    targetId: 'st-p3',
    personName: 'صهيب دردار',
    roleOrClass: '5 إب 1',
    level: '5 ابتدائي',
    date: '2026-03-03',
    period: 'الفترة المسائية (13:00 - 15:15)',
    durationHours: 2,
    reason: 'غياب بعد فترة الغداء بدون إشعار مسبق من الولي',
    status: 'unjustified',
    parentNotified: false,
    parentPhone: '0773 88 12 44',
    canteenAffected: false,
    actionTaken: 'تحرير بطاقة اتصال فورية بولي الأمر للحضور شخصياً ومرافقة التلميذ.',
  },

  // غيابات الطور المتوسط
  {
    id: 'abs-1',
    stage: 'middle',
    type: 'student',
    targetId: 'st-6',
    personName: 'أيمن بن طوبال',
    roleOrClass: '4 م 1',
    level: '4 متوسط',
    date: '2026-03-04',
    period: 'الفترة الصباحية (08:00 - 12:00)',
    durationHours: 4,
    reason: 'غياب متكرر بدون مبرر قانوني (الغياب الرابع خلال الفصل)',
    status: 'parent_summoned',
    parentNotified: true,
    parentPhone: '0790 22 49 81',
    actionTaken: 'تم تحرير الإشعار الأول بالغياب واستدعاء ولي الأمر لمكتب الناظر ومستشار التربية.',
  },
  {
    id: 'abs-2',
    stage: 'middle',
    type: 'student',
    targetId: 'st-5',
    personName: 'عبد الرحمان زروقي',
    roleOrClass: '4 م 1',
    level: '4 متوسط',
    date: '2026-03-04',
    period: 'الفترة المسائية (13:30 - 16:30)',
    durationHours: 3,
    reason: 'تأخر صباحي متبوع بغياب في الفترة المسائية بدون مبرر',
    status: 'unjustified',
    parentNotified: false,
    parentPhone: '0663 87 45 12',
    actionTaken: 'بانتظار حضور الولي وتوقيع التزام المواظبة.',
  },
  {
    id: 'abs-3',
    stage: 'middle',
    type: 'student',
    targetId: 'st-4',
    personName: 'سارة منصوري',
    roleOrClass: '4 م 1',
    level: '4 متوسط',
    date: '2026-03-02',
    period: 'اليوم الكامل',
    durationHours: 6,
    reason: 'موعد طبي متخصص مرفق بشهادة طبية معتمدة من وحدة الكشف UDS',
    status: 'justified',
    parentNotified: true,
    parentPhone: '0558 60 11 29',
    actionTaken: 'تم قبول التبرير الطبي وبرمجة فرض تعويضي بالتنسيق مع أساتذة الفوج.',
  },
  {
    id: 'abs-5',
    stage: 'middle',
    type: 'teacher',
    targetId: 't-2',
    personName: 'أ. مراد دحمان',
    roleOrClass: 'أستاذ العلوم الفيزيائية والتكنولوجيا',
    date: '2026-03-04',
    period: 'الفترة الصباحية (08:00 - 11:00)',
    durationHours: 3,
    reason: 'غياب طارئ دون إشعار مسبق (أفواج 4 م 1 و 3 م 1)',
    status: 'warning_sent',
    parentNotified: false,
    actionTaken: 'توجيه استفسار كتابي رسمي طبقاً للمادة 207 من الأمر 06-03 وتغطية الحصص بنظام المداومة التربوية.',
  },

  // غيابات الطور الثانوي
  {
    id: 'abs-s1',
    stage: 'secondary',
    type: 'student',
    targetId: 'st-s4',
    personName: 'وليد قندوز',
    roleOrClass: '3 ع ت 1',
    level: '3 علوم تجريبية',
    date: '2026-03-04',
    period: 'حصة الأعمال المخبرية (10:00 - 12:00)',
    durationHours: 2,
    reason: 'غياب غير مبرر عن حصة الأعمال التطبيقية لمادة العلوم الفيزيائية (قسم بكالوريا)',
    status: 'parent_summoned',
    parentNotified: true,
    parentPhone: '0555 88 99 00',
    actionTaken: 'إصدار الإنذار الثاني واستدعاء عاجل لولي الأمر لمكتب ناظر الثانوية (مدير الدراسات).',
  },
  {
    id: 'abs-s2',
    stage: 'secondary',
    type: 'teacher',
    targetId: 't-s2',
    personName: 'أ. نبيل لعموري',
    roleOrClass: 'أستاذ مادة الفلسفة',
    date: '2026-03-04',
    period: 'الفترة الصباحية (08:00 - 10:00)',
    durationHours: 2,
    reason: 'وعكة صحية طارئة — شهادة طبية قيد الإيداع',
    status: 'warning_sent',
    parentNotified: false,
    actionTaken: 'توجيه الفوج لقاعة المداومة التربوية وتحرير إشعار استفسار.',
  },
];

export const INITIAL_TEACHERS: TeacherRecord[] = [
  // أساتذة الابتدائي
  {
    id: 't-p1',
    stage: 'primary',
    name: 'أ. عبد الحفيظ بن سالم',
    subject: 'اللغة العربية والرياضيات والتربية الإسلامية',
    rank: 'أستاذ مكون في المدرسة الابتدائية',
    weeklyQuota: 22.5,
    assignedHours: 22.5,
    phone: '0551 22 33 44',
    digitalSyncCompleted: true,
    assignedClasses: ['5 إب 1'],
  },
  {
    id: 't-p2',
    stage: 'primary',
    name: 'أ. نسرين بوزيدي',
    subject: 'اللغة الفرنسية (الطور الابتدائي)',
    rank: 'أستاذ رئيسي في المدرسة الابتدائية',
    weeklyQuota: 22.5,
    assignedHours: 21,
    phone: '0662 11 44 88',
    digitalSyncCompleted: true,
    assignedClasses: ['5 إب 1', '4 إب 1', '3 إب 1'],
  },
  {
    id: 't-p3',
    stage: 'primary',
    name: 'أ. ياسين طويل',
    subject: 'اللغة الإنجليزية (الطور الابتدائي)',
    rank: 'أستاذ المدرسة الابتدائية',
    weeklyQuota: 22.5,
    assignedHours: 19.5,
    phone: '0771 99 00 11',
    digitalSyncCompleted: true,
    assignedClasses: ['5 إب 1', '4 إب 1', '3 إب 1'],
  },
  {
    id: 't-p4',
    stage: 'primary',
    name: 'أ. حمزة مرابط',
    subject: 'التربية البدنية والرياضية (الطور الابتدائي)',
    rank: 'أستاذ التربية البدنية بالمدرسة الابتدائية',
    weeklyQuota: 22.5,
    assignedHours: 20,
    phone: '0554 66 77 88',
    digitalSyncCompleted: false,
    assignedClasses: ['5 إب 1', '4 إب 1', '3 إب 1', '2 إب 1', '1 إب 1'],
  },

  // أساتذة المتوسط (21 ساعة)
  {
    id: 't-1',
    stage: 'middle',
    name: 'أ. سفيان بن عمار',
    subject: 'الرياضيات',
    rank: 'أستاذ مكون في التعليم المتوسط',
    weeklyQuota: 21,
    assignedHours: 20,
    phone: '0550 12 34 56',
    digitalSyncCompleted: true,
    assignedClasses: ['4 م 1', '4 م 2', '3 م 1'],
  },
  {
    id: 't-2',
    stage: 'middle',
    name: 'أ. مراد دحمان',
    subject: 'العلوم الفيزيائية والتكنولوجيا',
    rank: 'أستاذ التعليم المتوسط (أ.ت.م)',
    weeklyQuota: 21,
    assignedHours: 21,
    phone: '0661 98 76 54',
    digitalSyncCompleted: false,
    assignedClasses: ['4 م 1', '4 م 2', '3 م 1', '2 م 1'],
  },
  {
    id: 't-3',
    stage: 'middle',
    name: 'أ. فاطمة الزهراء قاسمي',
    subject: 'علوم الطبيعة والحياة',
    rank: 'أستاذ رئيسي في التعليم المتوسط',
    weeklyQuota: 21,
    assignedHours: 19,
    phone: '0772 44 55 66',
    digitalSyncCompleted: true,
    assignedClasses: ['4 م 1', '4 م 2', '3 م 1', '1 م 1'],
  },
  {
    id: 't-4',
    stage: 'middle',
    name: 'أ. عمار شريفي',
    subject: 'اللغة العربية وآدابها',
    rank: 'أستاذ مكون في التعليم المتوسط',
    weeklyQuota: 21,
    assignedHours: 21,
    phone: '0560 33 22 11',
    digitalSyncCompleted: true,
    assignedClasses: ['4 م 1', '4 م 2', '2 م 1'],
  },
  {
    id: 't-5',
    stage: 'middle',
    name: 'أ. سعيدة بوزيد',
    subject: 'اللغة الفرنسية',
    rank: 'أستاذ رئيسي في التعليم المتوسط',
    weeklyQuota: 21,
    assignedHours: 21,
    phone: '0799 11 22 33',
    digitalSyncCompleted: true,
    assignedClasses: ['4 م 1', '4 م 2', '3 م 1', '1 م 1'],
  },

  // أساتذة الثانوي (18 ساعة)
  {
    id: 't-s1',
    stage: 'secondary',
    name: 'أ. قدور بن عيسى',
    subject: 'الرياضيات',
    rank: 'أستاذ مكون في التعليم الثانوي',
    weeklyQuota: 18,
    assignedHours: 18,
    phone: '0550 88 77 66',
    digitalSyncCompleted: true,
    assignedClasses: ['3 ع ت 1', '3 ت ر 1', '2 ع ت 1'],
  },
  {
    id: 't-s2',
    stage: 'secondary',
    name: 'أ. نبيل لعموري',
    subject: 'الفلسفة',
    rank: 'أستاذ التعليم الثانوي (أ.ت.ث)',
    weeklyQuota: 18,
    assignedHours: 16,
    phone: '0655 77 88 99',
    digitalSyncCompleted: false,
    assignedClasses: ['3 ع ت 1', '3 آ ف 1', '2 ع ت 1'],
  },
  {
    id: 't-s3',
    stage: 'secondary',
    name: 'أ. سليم مرابط',
    subject: 'علوم الطبيعة والحياة',
    rank: 'أستاذ رئيسي في التعليم الثانوي',
    weeklyQuota: 18,
    assignedHours: 18,
    phone: '0772 33 44 55',
    digitalSyncCompleted: true,
    assignedClasses: ['3 ع ت 1', '2 ع ت 1', '1 ج م ع ت 1'],
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // جدول الابتدائي
  { id: 'slot-p1', stage: 'primary', day: 'الأحد', period: '08:00 - 09:00', classGroup: '5 إب 1', subject: 'اللغة العربية وآدابها', teacher: 'أ. عبد الحفيظ بن سالم', room: 'حجرة 01' },
  { id: 'slot-p2', stage: 'primary', day: 'الأحد', period: '09:00 - 10:00', classGroup: '5 إب 1', subject: 'الرياضيات', teacher: 'أ. عبد الحفيظ بن سالم', room: 'حجرة 01' },
  { id: 'slot-p3', stage: 'primary', day: 'الأحد', period: '10:00 - 11:00', classGroup: '5 إب 1', subject: 'اللغة الفرنسية', teacher: 'أ. نسرين بوزيدي', room: 'حجرة 01' },
  { id: 'slot-p4', stage: 'primary', day: 'الإثنين', period: '08:00 - 09:00', classGroup: '5 إب 1', subject: 'اللغة الإنجليزية', teacher: 'أ. ياسين طويل', room: 'حجرة 01' },
  { id: 'slot-p5', stage: 'primary', day: 'الإثنين', period: '13:30 - 14:30', classGroup: '5 إب 1', subject: 'التربية البدنية والرياضية', teacher: 'أ. حمزة مرابط', room: 'الساحة الرياضية' },

  // جدول المتوسط
  { id: 'slot-1', stage: 'middle', day: 'الأحد', period: '08:00 - 09:00', classGroup: '4 م 1', subject: 'اللغة العربية وآدابها', teacher: 'أ. عمار شريفي', room: 'حجرة 01' },
  { id: 'slot-2', stage: 'middle', day: 'الأحد', period: '09:00 - 10:00', classGroup: '4 م 1', subject: 'الرياضيات', teacher: 'أ. سفيان بن عمار', room: 'حجرة 01' },
  { id: 'slot-3', stage: 'middle', day: 'الأحد', period: '10:00 - 11:00', classGroup: '4 م 1', subject: 'العلوم الفيزيائية والتكنولوجيا', teacher: 'أ. مراد دحمان', room: 'مخبر الفيزياء 1' },
  { id: 'slot-4', stage: 'middle', day: 'الأحد', period: '11:00 - 12:00', classGroup: '4 م 1', subject: 'اللغة الفرنسية', teacher: 'أ. سعيدة بوزيد', room: 'حجرة 01' },
  { id: 'slot-7', stage: 'middle', day: 'الإثنين', period: '08:00 - 09:00', classGroup: '4 م 1', subject: 'الرياضيات', teacher: 'أ. سفيان بن عمار', room: 'حجرة 01' },
  { id: 'slot-8', stage: 'middle', day: 'الإثنين', period: '09:00 - 10:00', classGroup: '4 م 1', subject: 'علوم الطبيعة والحياة', teacher: 'أ. فاطمة الزهراء قاسمي', room: 'مخبر العلوم 1' },

  // جدول الثانوي
  { id: 'slot-s1', stage: 'secondary', day: 'الأحد', period: '08:00 - 09:00', classGroup: '3 ع ت 1', subject: 'الرياضيات', teacher: 'أ. قدور بن عيسى', room: 'قاعة 12' },
  { id: 'slot-s2', stage: 'secondary', day: 'الأحد', period: '09:00 - 10:00', classGroup: '3 ع ت 1', subject: 'الرياضيات', teacher: 'أ. قدور بن عيسى', room: 'قاعة 12' },
  { id: 'slot-s3', stage: 'secondary', day: 'الأحد', period: '10:00 - 11:00', classGroup: '3 ع ت 1', subject: 'علوم الطبيعة والحياة', teacher: 'أ. سليم مرابط', room: 'مخبر العلوم 1' },
  { id: 'slot-s4', stage: 'secondary', day: 'الإثنين', period: '10:00 - 11:00', classGroup: '3 ع ت 1', subject: 'الفلسفة', teacher: 'أ. نبيل لعموري', room: 'قاعة 12' },
];

export const INITIAL_AGENDA: AgendaTask[] = [
  {
    id: 'ag-1',
    stage: 'all',
    title: 'المراقبة الصباحية لحضور الأساتذة وتغطية الأفواج الشاغرة وتفقد نداء التلاميذ',
    category: 'daily',
    dueDate: 'يومياً (08:00 و 13:30)',
    periodLabel: 'مهمة يومية مستمرة للأطوار الثلاثة',
    priority: 'urgent',
    legalRef: 'المرسوم التنفيذي 25-54 + القرار 834',
    description: 'ضبط سجل غيابات الأساتذة، مطابقة الغيابات اللحظية للتلاميذ حسب خصوصية الطور (المطعم في الابتدائي / الاستشارة في المتوسط والثانوي).',
    status: 'completed',
  },
  {
    id: 'ag-p1',
    stage: 'primary',
    title: 'مراقبة التعداد اليومي للمطعم المدرسي ومتابعة فحوصات وحدة الكشف الصحي UDS',
    category: 'daily',
    dueDate: 'يومياً (09:00 صباحاً)',
    periodLabel: 'خاص بالطور الابتدائي',
    priority: 'urgent',
    legalRef: 'المرسوم التنفيذي المنظم للمطاعم المدرسية + القرار 778',
    description: 'حصر التلاميذ الحاضرين المستفيدين من الوجبة الساخنة، وإشعار أولياء التلاميذ المتغيبين فوراً.',
    status: 'in_progress',
  },
  {
    id: 'ag-p2',
    stage: 'primary',
    title: 'ضبط شبكات تقييم المكتسبات لتلاميذ السنة الخامسة ابتدائي على الأرضية الرقمية',
    category: 'bem_exams',
    dueDate: 'أفريل - ماي 2026',
    periodLabel: 'امتحان تقييم المكتسبات (5 ابتدائي)',
    priority: 'urgent',
    legalRef: 'المنشور الوزاري المنظم لتقييم مكتسبات التعليم الابتدائي 2026',
    description: 'مراقبة حجز تقديرات الكفاءات (أ، ب، ج، د) واستخراج دفاتر تقييم المكتسبات والشهادات.',
    status: 'scheduled',
  },
  {
    id: 'ag-3',
    stage: 'all',
    title: 'غلق حجز نقاط الفصل الثاني وتوليد المعدلات التلقائية على الأرضية الرقمية (Amatti)',
    category: 'term',
    dueDate: '15 مارس 2026',
    periodLabel: 'استحقاق نهاية الفصل الثاني',
    priority: 'urgent',
    legalRef: 'المنشور الوزاري 112/2026 للرقمنة',
    description: 'التدقيق الآلي في العلامات (من 10 في الابتدائي ومن 20 في المتوسط والثانوي) واستخراج كشوف النقاط ومحاضر مجالس الأقسام.',
    status: 'in_progress',
  },
  {
    id: 'ag-5',
    stage: 'middle',
    title: 'تدقيق قوائم المترشحين لشهادة التعليم المتوسط (BEM 2026) واختبارات التربية البدنية',
    category: 'bem_exams',
    dueDate: 'أفريل 2026',
    periodLabel: 'تحضيرات شهادة التعليم المتوسط BEM',
    priority: 'urgent',
    legalRef: 'مناشير الديوان الوطني للامتحانات والمسابقات ONEC',
    description: 'مطابقة الهويات الرسمية لتلاميذ السنة الرابعة متوسط وضبط قوائم الكفء والمعفى.',
    status: 'scheduled',
  },
  {
    id: 'ag-s1',
    stage: 'secondary',
    title: 'تدقيق قوائم مترشحي شهادة البكالوريا (BAC 2026) ورغبات التوجيه لـ 1 و 2 ثانوي',
    category: 'bem_exams',
    dueDate: 'أفريل - ماي 2026',
    periodLabel: 'تحضيرات البكالوريا والتوجيه المدرسي',
    priority: 'urgent',
    legalRef: 'مناشير ONEC + المنشور الإطار للتوجيه المدرسي',
    description: 'مراجعة البطاقات التركيبية لأقسام النهائي ورقمنة رغبات التوجيه والطعون للجذوع المشتركة.',
    status: 'scheduled',
  },
];

export const LEGISLATIVE_TEXTS: LegislativeText[] = [
  {
    id: 'decree-25-54-three-stages-2026',
    stage: 'all',
    title: 'المرسوم التنفيذي 25-54 المحدث 2026 المتضمن القانون الأساسي لنظار الأطوار الثلاثة (ابتدائي · متوسط · ثانوي)',
    number: 'المرسوم التنفيذي 25-54 (تحيين 2026)',
    category: 'decree',
    isUpdated2026: true,
    date: 'جانفي 2025 / سريان المفعول التنظيمي 2026',
    description: 'التأطير القانوني الشامل لرتب التأطير البيداغوجي في المدارس الابتدائية والمتوسطات والثانويات، وتحديد التصنيف والترقية لرتب المديرين والمفتشين.',
    tags: ['الأطوار الثلاثة', 'ناظر ابتدائي', 'ناظر متوسطة', 'ناظر ثانوية', 'المرسوم 25-54'],
    fullText: `الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية
المرسوم التنفيذي المتضمن القانون الأساسي الخاص بالموظفين المنتمين للأسلاك الخاصة بالتربية الوطنية (تحيين 2025-2026):
1. الطور الابتدائي (ناظر مدرسة ابتدائية / مساعد مدير): يشرف تحت سلطة مدير المدرسة الابتدائية على التنسيق البيداغوجي للأفواج، متابعة تقييم المكتسبات، مراقبة مواظبة التلاميذ والإطعام المدرسي، وينوب عن المدير عند الغياب.
2. الطور المتوسط (ناظر المتوسطة): يشرف تحت سلطة مدير المتوسطة على التنظيم التربوي، هندسة جداول التوقيت (نصاب 21 ساعة)، حساب المعدلات الفصلية، ومجالس الأقسام وامتحان شهادة التعليم المتوسط BEM.
3. الطور الثانوي (ناظر الثانوية / مدير الدراسات): يشرف تحت سلطة مدير الثانوية على التنسيق البيداغوجي للشعب والجذوع المشتركة، تفويج المخابر (نصاب 18 ساعة)، التوجيه المدرسي، وامتحان شهادة البكالوريا BAC.`,
    keyArticles: [
      {
        articleNumber: 'أحكام الطور الابتدائي (تحيين 2026)',
        summary: 'مهام وتصنيف ناظر / مساعد مدير المدرسة الابتدائية.',
        text: 'يسهر على متابعة تنفيذ المناهج في السنوات الخمس، التنسيق بين أساتذة العربية والفرنسية والإنجليزية والتربية البدنية، ومتابعة دفاتر تقييم المكتسبات والترقية لرتبة مدير مدرسة ابتدائية.',
      },
      {
        articleNumber: 'أحكام الطور المتوسط (المادة 138 محدثة)',
        summary: 'مهام وتصنيف ناظر المتوسطة والترقية لمدير متوسطة.',
        text: 'يتولى ناظر المتوسطة ضبط التنظيم التربوي وجداول التوقيت ومراقبة دفاتر النصوص وتدقيق نتائج الفروض والاختبارات الفصلية، والترقية لرتبة مدير متوسطة أو مفتش.',
      },
      {
        articleNumber: 'أحكام الطور الثانوي (المادة 142 محدثة)',
        summary: 'مهام وتصنيف ناظر الثانوية (مدير الدراسات) في الصنف 17.',
        text: 'يقود المشروع البيداغوجي للثانوية، هندسة جداول الشعب والأعمال المخبرية، التوجيه الرقمي، والترقية لرتبة مدير ثانوية أو مفتش التربية الوطنية.',
      },
    ],
  },
  {
    id: 'circular-digitalization-2026',
    stage: 'all',
    title: 'المنشور الوزاري 112/2026 المتعلق بالرقمنة الشاملة والحساب الآلي للمعدلات في الأطوار الثلاثة',
    number: 'المنشور الوزاري 112 / و.ت.و / 2026',
    category: 'digital_2026',
    isUpdated2026: true,
    date: 'الموسم الدراسي 2025-2026',
    description: 'يحدد قواعد حساب المعدلات آلياً (من 10 في الابتدائي، ومن 20 بالمعاملات في المتوسط والثانوي) وآليات إشعار الأولياء بالغيابات عبر فضاء الأولياء.',
    tags: ['الرقمنة Amatti', 'سلم /10 بالابتدائي', 'سلم /20 بالمتوسط والثانوي', 'فضاء الأولياء'],
    fullText: `قواعد الاحتساب الآلي للمعدلات الفصلية حسب كل طور تعليمي على الأرضية الرقمية:
أولاً — مرحلة التعليم الابتدائي:
- سلم التنقيط من 10 (/10)، ولا توجد فروض محروسة ولا معاملات ترجيحية (المعامل = 1 لجميع المواد).
- يحسب المعدل الفصلي للتلميذ من علامات الاختبارات الفصلية والتقويم المستمر للمكتسبات، ويعد ناجحاً كل تلميذ يتحصل على معدل يساوي أو يفوق 5.00 / 10.
ثانياً — مرحلة التعليم المتوسط:
- سلم التنقيط من 20 (/20)، ومعادلة المادة: [(التقويم المستمر + الفرض المحروس)/2 + الاختبار×2] ÷ 3 مضروباً في معامل المستوى (1م إلى 4م).
ثالثاً — مرحلة التعليم الثانوي:
- سلم التنقيط من 20 (/20)، وتطبق المعاملات المميزة لكل جذع مشترك أو شعبة (علوم تجريبية، تقني رياضي، آداب وفلسفة، إلخ) مع احتساب الأعمال التطبيقية والمخبرية.`,
    keyArticles: [
      {
        articleNumber: 'البند 01 (خصوصية التقويم في الابتدائي)',
        summary: 'سلم التنقيط من 10 وتقديرات التحكم في الكفاءات.',
        text: 'تصنف مكتسبات تلميذ الابتدائي إلى 4 مستويات تحكم: تحكم أقصى (أ: 8.5 إلى 10)، تحكم مقبول (ب: 6.5 إلى 8.49)، تحكم جزئي (ج: 5.0 إلى 6.49)، وتحكم أدنى (د: أقل من 5/10 يستوجب معالجة بيداغوجية).',
      },
      {
        articleNumber: 'البند 02 (خصوصية التقويم في المتوسط والثانوي)',
        summary: 'سلم التنقيط من 20 ومعاملات المواد والشعب.',
        text: 'تمنح إجازات مجلس القسم (تهنئة >=16، تشجيع >=14، لوحة شرف >=12) آلياً للتلاميذ المنضبطين والمواظبين.',
      },
    ],
  },
  {
    id: 'decision-157-councils',
    stage: 'all',
    title: 'القرار الوزاري 157 والقرارات المنظمة لمجالس الأقسام ومجالس الأساتذة في الأطوار الثلاثة',
    number: 'القرار الوزاري 157 + القرار 778',
    category: 'decision',
    date: 'تحيين الترتيبات البيداغوجية 2026',
    description: 'يضبط تسيير مجالس الأساتذة في الابتدائي ومجالس الأقسام في المتوسط والثانوي، وقواعد الانتقال والمرافقة البيداغوجية.',
    tags: ['مجلس الأساتذة بالابتدائي', 'مجلس القسم بالمتوسط والثانوي', 'المعالجة البيداغوجية'],
    fullText: `تنظيم المجالس البيداغوجية نهاية كل فصل دراسي:
- في المدرسة الابتدائية: ينعقد "مجلس الأساتذة" لدراسة حصيلة تقييم المكتسبات، ضبط قوائم التلاميذ المعنيين بحصص المعالجة التربوية في اللغة العربية والرياضيات واللغات، ومتابعة الحالات الصحية والاجتماعية.
- في المتوسطة والثانوية: ينعقد "مجلس القسم" لدراسة الحصيلة الإحصائية للفوج، منح المكافآت (تهنئة، تشجيع، لوحة شرف)، ودراسة التوجيه المدرسي في الثانوي.`,
    keyArticles: [
      {
        articleNumber: 'المادة 07',
        summary: 'تحضير الجداول الإحصائية قبل انعقاد المجالس.',
        text: 'يتولى الناظر استخراج الكشوف الإحصائية للمعدلات وحصيلة الغيابات لعرضها خلال المداولات.',
      },
    ],
  },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'doc-student-absence-notice',
    stage: 'all',
    code: 'نموذج مواظبة / و.ت.و / 01',
    title: 'إشعار بغياب تلميذ واستدعاء رسمي لولي الأمر',
    category: 'attendance',
    description: 'إشعار رسمي يوجه لولي أمر التلميذ المتغيب في الابتدائي أو المتوسط أو الثانوي للحضور وتسوية وضعية ابنه.',
    fields: [
      { key: 'studentName', label: 'اسم ولقب التلميذ(ة)', defaultValue: 'أيمن بن طوبال' },
      { key: 'classGroup', label: 'القسم والفوج والطور التعليمي', defaultValue: 'الفوج التربوي المعتمد بالمؤسسة' },
      { key: 'parentName', label: 'اسم ولقب السيد ولي الأمر', defaultValue: 'السيد حسان بن طوبال' },
      { key: 'absenceDates', label: 'تواريخ ومدة الغياب المسجلة', defaultValue: 'يوم 04 مارس 2026 — الفترة الصباحية' },
      { key: 'noticeLevel', label: 'طبيعة الإجراء القانوني', defaultValue: 'الإشعار الأول بالغياب واستدعاء الولي للمؤسسة' },
      { key: 'meetingTime', label: 'موعد حضور الولي لمكتب الإدارة / الناظر', defaultValue: 'يوم الخميس القادم على الساعة 09:30 صباحاً' },
      { key: 'pedagogicalNotes', label: 'ملاحظات وتوجيهات الناظر حسب الطور', defaultValue: 'نذكركم بأن المواظبة المنتظمة شرط أساسي للتحصيل الدراسي السليم، وأن حضوركم الشخصي إجباري لتبرير الغياب.', multiline: true },
    ],
  },
  {
    id: 'doc-parent-pledge',
    stage: 'all',
    code: 'نموذج انضباط / و.ت.و / 02',
    title: 'تعهد والتزام كتابي لولي التلميذ بالمواظبة والانضباط',
    category: 'attendance',
    description: 'وثيقة التزام رسمية يوقعها ولي أمر التلميذ بعد تكرر الغيابات أو التأخرات لضمان انضباط التلميذ.',
    fields: [
      { key: 'parentName', label: 'أنا الممضي أسفله السيد(ة) ولي الأمر', defaultValue: 'بلقاسم زروقي' },
      { key: 'nationalId', label: 'رقم بطاقة التعريف الوطنية وتاريخ صدورها', defaultValue: '109845231 — الصادرة بـ قسنطينة' },
      { key: 'studentName', label: 'بصفتي الولي الشرعي للتلميذ(ة)', defaultValue: 'عبد الرحمان زروقي' },
      { key: 'classGroup', label: 'المتمدرس بالقسم / الفوج', defaultValue: 'الفوج التربوي بالمؤسسة' },
      { key: 'pledgeText', label: 'نص التعهد والالتزام', defaultValue: 'أتعهد أمام إدارة المؤسسة بالسهر الكامل على مواظبة ابني وعدم تغيبه أو تأخره عن الفترات والحصص الدراسية إلا لعذر قاهر مبرر قانوناً.', multiline: true },
    ],
  },
  {
    id: 'doc-class-council-pv',
    stage: 'all',
    code: 'نموذج بيداغوجي / م.ق / 03',
    title: 'محضر مداولات مجلس القسم / مجلس الأساتذة والحصيلة الإحصائية',
    category: 'councils',
    description: 'المحضر الرسمي لاجتماع نهاية الفصل الدراسي مع جدول النتائج والمكافآت وخطة المعالجة البيداغوجية.',
    fields: [
      { key: 'classGroup', label: 'القسم والفوج التربوي', defaultValue: 'الفوج التربوي الأول' },
      { key: 'headTeacher', label: 'الأستاذ(ة) المسؤول / الرئيسي للفوج', defaultValue: 'أ. سفيان بن عمار' },
      { key: 'meetingDate', label: 'تاريخ وتوقيت انعقاد المجلس', defaultValue: '19 مارس 2026 على الساعة 14:00 زوالاً بقاعة الاجتماعات' },
      { key: 'statsSummary', label: 'الحصيلة الإحصائية للفوج', defaultValue: 'تعداد الفوج: 32 تلميذاً | نسبة التحكم والنجاح: 85.4%', multiline: true },
      { key: 'rewardsList', label: 'قائمة التلاميذ المتفوقين والمكافآت', defaultValue: 'تثمين النتائج المتميزة وتوزيع شهادات التقدير والتهنئة.', multiline: true },
      { key: 'remediationPlan', label: 'توصيات المجلس وخطة المعالجة البيداغوجية', defaultValue: 'برمجة حصص معالجة بيداغوجية أسبوعية للتلاميذ المتعثرين واستدعاء أوليائهم.', multiline: true },
    ],
  },
  {
    id: 'doc-primary-canteen-report',
    stage: 'primary',
    code: 'نموذج ابتدائي / م.م / 04',
    title: 'كشف المراقبة اليومية للمطعم المدرسي والصحة المدرسية (الطور الابتدائي)',
    category: 'attendance',
    description: 'وثيقة خاصة بناظر المدرسة الابتدائية لضبط تعداد التلاميذ الحاضرين بالمطعم المدرسي والمتابعة الصحية UDS.',
    fields: [
      { key: 'reportDate', label: 'تاريخ المراقبة اليومية', defaultValue: 'الأربعاء 04 مارس 2026' },
      { key: 'registeredCount', label: 'إجمالي المسجلين في المطعم المدرسي', defaultValue: '185 تلميذاً مستفيداً عبر الأفواج الخمسة' },
      { key: 'presentCount', label: 'عدد الحاضرين الفعليين لتناول الوجبة الساخنة', defaultValue: '181 تلميذاً (غياب 4 تلاميذ تم إشعار أوليائهم)' },
      { key: 'mealQuality', label: 'مراقبة الوجبة الغذائية والنظافة الصحية', defaultValue: 'وجبة متوازنة مطابقة لجدول الوجبات الأسبوعي المصادق عليه، مع حفظ عينة الشاهد القانونية (48 ساعة).', multiline: true },
      { key: 'healthNotes', label: 'المتابعة الصحية (وحدة الكشف UDS)', defaultValue: 'تم توجيه تلميذين للفحص الدوري بوحدة الكشف والمتابعة الصحية.', multiline: true },
    ],
  },
  {
    id: 'doc-installation-pv',
    stage: 'all',
    code: 'نموذج بيداغوجي / و.ت.و / 05',
    title: 'محضر تنصيب أستاذ جديد في المنصب',
    category: 'pedagogical',
    description: 'الوثيقة الإدارية القانونية التي تثبت استلام الأستاذ لمهامه البيداغوجية وجدول توقيته بالمؤسسة.',
    fields: [
      { key: 'teacherName', label: 'اسم ولقب الأستاذ(ة)', defaultValue: 'أحمد بن عبد الله' },
      { key: 'subject', label: 'مادة التدريس / الاختصاص', defaultValue: 'الرياضيات / اللغة العربية' },
      { key: 'rank', label: 'الرتبة والإطار القانوني (المرسوم 25-54)', defaultValue: 'أستاذ مرسم — القانون الأساسي لموظفي التربية 2026' },
      { key: 'decisionNumber', label: 'رقم وتاريخ مقرر التعيين', defaultValue: '1428 / م.ت / 2025 المؤرخ في 02 سبتمبر 2025' },
      { key: 'handoverDetails', label: 'الوثائق المسلمة من طرف الناظر', defaultValue: 'تم تسليم الأستاذ المنهاج الرسمي، التدرج السنوي للتعلمات، جدول التوقيت الأسبوعي، وقوائم تلاميذ الأفواج المسندة.', multiline: true },
    ],
  },
  {
    id: 'doc-teacher-explanation',
    stage: 'all',
    code: 'مراسلة إدارية داخلية / 06',
    title: 'استفسار عن غياب أستاذ وإشعار بالخصم من الراتب (المادة 207)',
    category: 'correspondence',
    description: 'استفسار رسمي يوجه للأستاذ المتغيب لتقديم مبرراته القانونية خلال 48 ساعة طبقاً للأمر 06-03.',
    fields: [
      { key: 'teacherName', label: 'إلى السيد(ة) الأستاذ(ة)', defaultValue: 'أ. مراد دحمان' },
      { key: 'subjectRank', label: 'الرتبة ومادة التدريس', defaultValue: 'أستاذ مادة العلوم الفيزيائية' },
      { key: 'absenceDate', label: 'تاريخ وتوقيت الغياب المسجل', defaultValue: 'يوم الأربعاء 04 مارس 2026 من الساعة 08:00 إلى 11:00 (3 ساعات)' },
      { key: 'legalNotice', label: 'التذكير القانوني والمهلة الممنوحة', defaultValue: 'تطبيقاً لأحكام المادة 207 من الأمر 06-03، يطلب منكم موافاة إدارة المؤسسة بمبرر غيابكم كتابياً في أجل أقصاه 48 ساعة.', multiline: true },
    ],
  },
];

// ============================================================================
// محرك الحساب التلقائي الموحد للأطوار الثلاثة (ابتدائي /10 · متوسط /20 · ثانوي /20)
// ============================================================================

export function getPrimaryCompetencyBadge(avgOut10: number): {
  badge: string;
  appreciation: string;
} {
  if (avgOut10 >= 8.5) {
    return { badge: 'أ (تحكم أقصى)', appreciation: 'تحكم أقصى في الكفاءات المستهدفة' };
  }
  if (avgOut10 >= 6.5) {
    return { badge: 'ب (تحكم مقبول)', appreciation: 'تحكم مقبول وجيد في التعلمات' };
  }
  if (avgOut10 >= 5.0) {
    return { badge: 'ج (تحكم جزئي)', appreciation: 'تحكم جزئي — يحتاج تثبيت المكتسبات' };
  }
  return { badge: 'د (تحكم أدنى)', appreciation: 'تحكم أدنى — يدرج في المعالجة البيداغوجية' };
}

export function getSubjectAppreciation20(avg: number): string {
  if (avg >= 18) return 'امتياز وتفوق باهر';
  if (avg >= 16) return 'نتائج ممتازة جداً';
  if (avg >= 14) return 'عمل جيد ومثمر';
  if (avg >= 12) return 'نتائج حسنة ومقبولة';
  if (avg >= 10) return 'متوسط — بإمكانك التحسن';
  if (avg >= 8) return 'دون المتوسط — ضاعف المجهود';
  return 'ضعيف جداً — يحتاج معالجة فورية';
}

export function getStageHonorAndDecision(
  avg: number,
  unjustifiedAbsences: number,
  stage: EducationStage
): { honorRoll: string; councilDecision: string } {
  if (stage === 'primary') {
    // في الطور الابتدائي السلم من 10
    if (avg >= 8.5) {
      return {
        honorRoll: 'امتياز · تحكم أقصى (أ)',
        councilDecision: 'تحكم أقصى في الكفاءات — تهنئة وتشجيع مجلس الأساتذة',
      };
    }
    if (avg >= 7.0) {
      return {
        honorRoll: 'جدير بالتشجيع · تحكم مقبول (ب)',
        councilDecision: 'تحصيل جيد ومواظبة منتظمة — لوحة شرف وتشجيع',
      };
    }
    if (avg >= 5.0) {
      return {
        honorRoll: 'متحكم جزئياً (ج) · ناجح',
        councilDecision: 'مكتسبات مقبولة تسمح بمواصلة التعلمات مع تعزيز القراءة والحساب',
      };
    }
    return {
      honorRoll: 'تحكم أدنى (د) · معالجة بيداغوجية',
      councilDecision: 'إدراج التلميذ في حصص المعالجة التربوية الأسبوعية ومرافقة الولي',
    };
  }

  // في الطورين المتوسط والثانوي السلم من 20
  if (avg >= 16 && unjustifiedAbsences === 0) {
    return {
      honorRoll: 'تهنئة مجلس القسم',
      councilDecision:
        stage === 'secondary'
          ? 'امتياز وتفوق في الشعبة — تهنئة رسمية من مجلس القسم'
          : 'نتائج ممتازة ومواظبة مثالية — تهنئة رسمية من مجلس القسم',
    };
  }
  if (avg >= 14 && unjustifiedAbsences <= 1) {
    return {
      honorRoll: 'تشجيع مجلس القسم',
      councilDecision: 'نتائج جيدة جداً ومواظبة منتظمة — تشجيع من مجلس القسم',
    };
  }
  if (avg >= 12 && unjustifiedAbsences <= 2) {
    return {
      honorRoll: 'لوحة شرف',
      councilDecision: 'تحصيل حسن — يسجل في لوحة الشرف للفصل',
    };
  }
  if (avg >= 10) {
    return {
      honorRoll: unjustifiedAbsences >= 3 ? 'تحفظ بسبب الغياب' : 'ناجح متوسط',
      councilDecision:
        unjustifiedAbsences >= 3
          ? 'نتائج مقبولة لكن كثرة الغيابات غير المبررة حرمت التلميذ من الإجازة'
          : 'نتائج متوسطة مقبولة — يوصى بمضاعفة التركيز في المواد الأساسية',
    };
  }
  if (avg >= 8) {
    return {
      honorRoll: 'إنذار بالتقصير + دعم',
      councilDecision: 'دون المعدل — إدراج إجباري في حصص الدعم والمعالجة البيداغوجية واستدعاء الولي',
    };
  }
  return {
    honorRoll: 'خطر تعثر — مرافقة عاجلة',
    councilDecision: 'تعثر شديد — تفعيل مخطط المرافقة الفردية مع مستشار التوجيه والأستاذ الرئيسي',
  };
}

export function calculateClassSummaries(
  students: StudentRecord[],
  subjects: SubjectConfig[],
  absences: AbsenceRecord[],
  formulaMode: FormulaMode = 'ministry_standard',
  includeAttendanceBonusInEval = false,
  stage: EducationStage = 'middle'
): CalculatedStudentSummary[] {
  const stageMeta = STAGE_METADATA[stage];
  const maxScale = stageMeta.maxGradeScale;
  const passingThreshold = stageMeta.passingGrade;

  // المواد المقررة لهذا الطور فقط
  const stageSubjects = subjects.filter((s) => s.stages.includes(stage));

  const rawSummaries: CalculatedStudentSummary[] = students.map((student) => {
    const studentAbsences = absences.filter(
      (a) =>
        a.type === 'student' &&
        (a.targetId === student.id || a.personName === student.fullName)
    );
    const unjustifiedAbsencesCount = studentAbsences.filter(
      (a) =>
        a.status === 'unjustified' ||
        a.status === 'parent_summoned' ||
        a.status === 'warning_sent' ||
        a.status === 'council_referred'
    ).length;
    const justifiedAbsencesCount = studentAbsences.filter(
      (a) => a.status === 'justified' || a.status === 'pledge_signed' || a.status === 'health_uds'
    ).length;
    const lateCount = studentAbsences.filter((a) => a.status === 'late').length;
    const totalMissedHours = studentAbsences.reduce(
      (acc, a) => acc + (a.durationHours || 0),
      0
    );

    // نقطة المواظبة: من 10 في الابتدائي ومن 20 في المتوسط والثانوي
    const penaltyFactor = maxScale === 10 ? 0.5 : 1.5;
    const latePenalty = maxScale === 10 ? 0.25 : 0.5;
    const rawAttendanceScore = Math.max(
      0,
      maxScale - unjustifiedAbsencesCount * penaltyFactor - lateCount * latePenalty
    );
    const attendanceScore = Number(rawAttendanceScore.toFixed(2));

    let totalCoefficients = 0;
    let totalWeightedScore = 0;
    const weakSubjects: string[] = [];

    const subjectResults: CalculatedSubjectResult[] = stageSubjects.map((subj) => {
      const coeff = stage === 'primary' ? 1 : subj.coefficients[student.level] ?? 1;
      const defaultMark = maxScale === 10 ? 6 : 10;
      const gradeObj = student.grades[subj.id] || {
        eval: defaultMark,
        test: defaultMark,
        exam: defaultMark,
        exempt: false,
      };

      if (gradeObj.exempt) {
        return {
          subjectId: subj.id,
          subjectName: subj.name,
          coefficient: coeff,
          eval: gradeObj.eval,
          test: gradeObj.test,
          continuousAvg: 0,
          exam: gradeObj.exam,
          subjectAvg: 0,
          weightedScore: 0,
          exempt: true,
          appreciation: 'معفى طبياً (لا يحتسب في المعامل)',
          competencyBadge: 'معفى',
        };
      }

      const clampedEval = Math.min(maxScale, Math.max(0, gradeObj.eval));
      const clampedTest = Math.min(maxScale, Math.max(0, gradeObj.test));
      const clampedExam = Math.min(maxScale, Math.max(0, gradeObj.exam));

      const effectiveEval = includeAttendanceBonusInEval
        ? Number((clampedEval * 0.8 + attendanceScore * 0.2).toFixed(2))
        : clampedEval;

      let continuousAvg = effectiveEval;
      let subjectAvg = 0;

      if (stage === 'primary') {
        // في الطور الابتدائي (السلم /10): إما (التقويم + الاختبار) / 2 أو علامة الاختبار مباشرة
        continuousAvg = effectiveEval;
        if (formulaMode === 'primary_exam_only') {
          subjectAvg = Number(clampedExam.toFixed(2));
        } else {
          subjectAvg = Number(((effectiveEval + clampedExam) / 2).toFixed(2));
        }
      } else {
        // في المتوسط والثانوي (السلم /20)
        continuousAvg = Number(((effectiveEval + clampedTest) / 2).toFixed(2));
        if (formulaMode === 'four_divisor') {
          subjectAvg = Number(((effectiveEval + clampedTest + clampedExam * 2) / 4).toFixed(2));
        } else if (formulaMode === 'test_exam_only') {
          subjectAvg = Number(((clampedTest + clampedExam * 2) / 3).toFixed(2));
        } else {
          subjectAvg = Number(((continuousAvg + clampedExam * 2) / 3).toFixed(2));
        }
      }

      const weightedScore = Number((subjectAvg * coeff).toFixed(2));
      totalCoefficients += coeff;
      totalWeightedScore += weightedScore;

      if (subjectAvg < passingThreshold) {
        weakSubjects.push(subj.shortName);
      }

      if (stage === 'primary') {
        const comp = getPrimaryCompetencyBadge(subjectAvg);
        return {
          subjectId: subj.id,
          subjectName: subj.name,
          coefficient: 1,
          eval: effectiveEval,
          test: clampedTest,
          continuousAvg,
          exam: clampedExam,
          subjectAvg,
          weightedScore,
          exempt: false,
          appreciation: comp.appreciation,
          competencyBadge: comp.badge,
        };
      }

      return {
        subjectId: subj.id,
        subjectName: subj.name,
        coefficient: coeff,
        eval: effectiveEval,
        test: clampedTest,
        continuousAvg,
        exam: clampedExam,
        subjectAvg,
        weightedScore,
        exempt: false,
        appreciation: getSubjectAppreciation20(subjectAvg),
      };
    });

    const termAverage =
      totalCoefficients > 0
        ? Number((totalWeightedScore / totalCoefficients).toFixed(2))
        : 0;
    const { honorRoll, councilDecision } = getStageHonorAndDecision(
      termAverage,
      unjustifiedAbsencesCount,
      stage
    );

    return {
      student,
      subjectResults,
      totalCoefficients,
      totalWeightedScore: Number(totalWeightedScore.toFixed(2)),
      termAverage,
      maxScale,
      passingThreshold,
      rank: 1,
      honorRoll,
      councilDecision,
      unjustifiedAbsencesCount,
      justifiedAbsencesCount,
      lateCount,
      totalMissedHours,
      attendanceScore,
      weakSubjects,
    };
  });

  const sorted = [...rawSummaries].sort((a, b) => b.termAverage - a.termAverage);
  sorted.forEach((item, index) => {
    item.rank = index + 1;
  });

  return sorted;
}
