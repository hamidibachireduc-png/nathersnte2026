import { InstitutionProfile, TeacherRecord, TimetableSlot, AbsenceRecord, StudentScore, ForumPost } from '../types';

export const INITIAL_INSTITUTION: InstitutionProfile = {
  schoolName: 'ثانوية الشهيد زيغود يوسف',
  wilaya: 'ولاية قسنطينة (025)',
  directorOfStudies: 'الأستاذ عبد الرزاق بوقرة',
  schoolYear: '2025 / 2026',
  currentTerm: 2
};

export const INITIAL_TEACHERS: TeacherRecord[] = [
  { id: 't1', name: 'أ. سفيان بن عمار', subject: 'الرياضيات', weeklyQuota: 18, assignedHours: 17, phone: '0550 12 34 56' },
  { id: 't2', name: 'أ. مراد دحمان', subject: 'العلوم الفيزيائية', weeklyQuota: 18, assignedHours: 18, phone: '0661 98 76 54' },
  { id: 't3', name: 'أ. فاطمة الزهراء قاسمي', subject: 'علوم الطبيعة والحياة', weeklyQuota: 18, assignedHours: 16, phone: '0772 44 55 66' },
  { id: 't4', name: 'أ. عمار شريفي', subject: 'الأدب العربي', weeklyQuota: 18, assignedHours: 18, phone: '0560 33 22 11' },
  { id: 't5', name: 'أ. نبيل لعموري', subject: 'الفلسفة', weeklyQuota: 18, assignedHours: 15, phone: '0655 77 88 99' },
  { id: 't6', name: 'أ. سعيدة بوزيد', subject: 'اللغة الفرنسية', weeklyQuota: 18, assignedHours: 18, phone: '0799 11 22 33' },
  { id: 't7', name: 'أ. كريم منصوري', subject: 'اللغة الإنجليزية', weeklyQuota: 18, assignedHours: 16, phone: '0541 66 77 88' },
  { id: 't8', name: 'أ. يوسف حداد', subject: 'التاريخ والجغرافيا', weeklyQuota: 18, assignedHours: 18, phone: '0663 55 44 33' },
  { id: 't9', name: 'أ. رابح سعدي', subject: 'العلوم الإسلامية', weeklyQuota: 18, assignedHours: 14, phone: '0770 99 88 77' },
  { id: 't10', name: 'أ. مروان حمداوي', subject: 'الإعلام الآلي', weeklyQuota: 18, assignedHours: 12, phone: '0555 44 33 22' }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Sunday
  { id: 'slot-1', day: 'الأحد', period: '08:00 - 09:00', classGroup: '3 ع ت 1', subject: 'الرياضيات', teacher: 'أ. سفيان بن عمار', room: 'قاعة 12' },
  { id: 'slot-2', day: 'الأحد', period: '09:00 - 10:00', classGroup: '3 ع ت 1', subject: 'الرياضيات', teacher: 'أ. سفيان بن عمار', room: 'قاعة 12' },
  { id: 'slot-3', day: 'الأحد', period: '10:00 - 11:00', classGroup: '3 ع ت 1', subject: 'علوم الطبيعة والحياة', teacher: 'أ. فاطمة الزهراء قاسمي', room: 'مخبر العلوم 1' },
  { id: 'slot-4', day: 'الأحد', period: '11:00 - 12:00', classGroup: '3 ع ت 1', subject: 'علوم الطبيعة والحياة', teacher: 'أ. فاطمة الزهراء قاسمي', room: 'مخبر العلوم 1' },
  { id: 'slot-5', day: 'الأحد', period: '14:00 - 15:00', classGroup: '3 ع ت 1', subject: 'الأدب العربي', teacher: 'أ. عمار شريفي', room: 'قاعة 12' },
  { id: 'slot-6', day: 'الأحد', period: '15:00 - 16:00', classGroup: '3 ع ت 1', subject: 'اللغة الإنجليزية', teacher: 'أ. كريم منصوري', room: 'قاعة 12' },

  // Monday
  { id: 'slot-7', day: 'الإثنين', period: '08:00 - 09:00', classGroup: '3 ع ت 1', subject: 'العلوم الفيزيائية', teacher: 'أ. مراد دحمان', room: 'مخبر الفيزياء 2' },
  { id: 'slot-8', day: 'الإثنين', period: '09:00 - 10:00', classGroup: '3 ع ت 1', subject: 'العلوم الفيزيائية', teacher: 'أ. مراد دحمان', room: 'مخبر الفيزياء 2' },
  { id: 'slot-9', day: 'الإثنين', period: '10:00 - 11:00', classGroup: '3 ع ت 1', subject: 'الفلسفة', teacher: 'أ. نبيل لعموري', room: 'قاعة 12' },
  { id: 'slot-10', day: 'الإثنين', period: '11:00 - 12:00', classGroup: '3 ع ت 1', subject: 'التاريخ والجغرافيا', teacher: 'أ. يوسف حداد', room: 'قاعة 12' },
  { id: 'slot-11', day: 'الإثنين', period: '14:00 - 15:00', classGroup: '3 ع ت 1', subject: 'اللغة الفرنسية', teacher: 'أ. سعيدة بوزيد', room: 'قاعة 12' },

  // Tuesday
  { id: 'slot-12', day: 'الثلاثاء', period: '08:00 - 09:00', classGroup: '3 ع ت 1', subject: 'علوم الطبيعة والحياة', teacher: 'أ. فاطمة الزهراء قاسمي', room: 'مخبر العلوم 1' },
  { id: 'slot-13', day: 'الثلاثاء', period: '09:00 - 10:00', classGroup: '3 ع ت 1', subject: 'الرياضيات', teacher: 'أ. سفيان بن عمار', room: 'قاعة 12' },
  { id: 'slot-14', day: 'الثلاثاء', period: '10:00 - 11:00', classGroup: '3 ع ت 1', subject: 'العلوم الإسلامية', teacher: 'أ. رابح سعدي', room: 'قاعة 12' },
  { id: 'slot-15', day: 'الثلاثاء', period: '11:00 - 12:00', classGroup: '3 ع ت 1', subject: 'الإعلام الآلي', teacher: 'أ. مروان حمداوي', room: 'قاعة الإعلام' },

  // Wednesday
  { id: 'slot-16', day: 'الأربعاء', period: '08:00 - 09:00', classGroup: '3 ع ت 1', subject: 'العلوم الفيزيائية', teacher: 'أ. مراد دحمان', room: 'مخبر الفيزياء 2' },
  { id: 'slot-17', day: 'الأربعاء', period: '09:00 - 10:00', classGroup: '3 ع ت 1', subject: 'الفلسفة', teacher: 'أ. نبيل لعموري', room: 'قاعة 12' },
  { id: 'slot-18', day: 'الأربعاء', period: '10:00 - 11:00', classGroup: '3 ع ت 1', subject: 'الأدب العربي', teacher: 'أ. عمار شريفي', room: 'قاعة 12' },
  { id: 'slot-19', day: 'الأربعاء', period: '11:00 - 12:00', classGroup: '3 ع ت 1', subject: 'التاريخ والجغرافيا', teacher: 'أ. يوسف حداد', room: 'قاعة 12' },

  // Thursday
  { id: 'slot-20', day: 'الخميس', period: '08:00 - 09:00', classGroup: '3 ع ت 1', subject: 'الرياضيات', teacher: 'أ. سفيان بن عمار', room: 'قاعة 12' },
  { id: 'slot-21', day: 'الخميس', period: '09:00 - 10:00', classGroup: '3 ع ت 1', subject: 'العلوم الفيزيائية', teacher: 'أ. مراد دحمان', room: 'قاعة 12' },
  { id: 'slot-22', day: 'الخميس', period: '10:00 - 11:00', classGroup: '3 ع ت 1', subject: 'علوم الطبيعة والحياة', teacher: 'أ. فاطمة الزهراء قاسمي', room: 'مخبر العلوم 1' },
  { id: 'slot-23', day: 'الخميس', period: '11:00 - 12:00', classGroup: '3 ع ت 1', subject: 'اللغة الفرنسية', teacher: 'أ. سعيدة بوزيد', room: 'قاعة 12' },

  // Other class slots (2 ت ر 1)
  { id: 'slot-24', day: 'الأحد', period: '08:00 - 09:00', classGroup: '2 ت ر 1', subject: 'العلوم الفيزيائية', teacher: 'أ. مراد دحمان', room: 'قاعة 08' },
  { id: 'slot-25', day: 'الأحد', period: '09:00 - 10:00', classGroup: '2 ت ر 1', subject: 'الرياضيات', teacher: 'أ. رابح سعدي', room: 'قاعة 08' },
  { id: 'slot-26', day: 'الإثنين', period: '08:00 - 09:00', classGroup: '2 ت ر 1', subject: 'الأدب العربي', teacher: 'أ. عمار شريفي', room: 'قاعة 08' }
];

export const INITIAL_ABSENCES: AbsenceRecord[] = [
  {
    id: 'abs-1',
    type: 'teacher',
    personName: 'أ. نبيل لعموري',
    identifier: 'أستاذ الفلسفة',
    date: '2025-11-03',
    period: '08:00 - 10:00',
    hours: 2,
    reason: 'وعكة صحية طارئة - شهادة طبية قيد الإيداع',
    isJustified: true,
    status: 'justified',
    notes: 'تم توجيه الفوج لقاعة المداومة تحت إشراف المساعد التربوي.'
  },
  {
    id: 'abs-2',
    type: 'teacher',
    personName: 'أ. مراد دحمان',
    identifier: 'أستاذ العلوم الفيزيائية',
    date: '2025-11-03',
    period: '14:00 - 16:00',
    hours: 2,
    reason: 'غياب بدون إشعار مسبق',
    isJustified: false,
    status: 'warning_sent',
    notes: 'تم إرسال استفسار كتابي رقم 144 بتاريخ اليوم.'
  },
  {
    id: 'abs-3',
    type: 'student',
    personName: 'بلال بوجمعة',
    identifier: '3 ع ت 1',
    date: '2025-11-02',
    period: 'كامل اليوم',
    hours: 7,
    reason: 'غياب غير مبرر (تكرار الغياب للمرة الثالثة)',
    isJustified: false,
    status: 'warning_sent',
    notes: 'تم استدعاء ولي الأمر للحضور يوم الثلاثاء.'
  },
  {
    id: 'abs-4',
    type: 'student',
    personName: 'سارة مهدي',
    identifier: '2 ت ر 1',
    date: '2025-11-03',
    period: 'الفترة الصباحية',
    hours: 4,
    reason: 'عذر عائلي قاهر مبرر من طرف الولي',
    isJustified: true,
    status: 'justified',
    notes: 'تم قبول المبرر وإشعار أساتذة الفترة.'
  },
  {
    id: 'abs-5',
    type: 'teacher',
    personName: 'أ. كريم منصوري',
    identifier: 'أستاذ اللغة الإنجليزية',
    date: '2025-10-28',
    period: '11:00 - 12:00',
    hours: 1,
    reason: 'تأخر غير مبرر تجاوز 45 دقيقة',
    isJustified: false,
    status: 'deduction_applied',
    notes: 'تم تسجيل غياب ساعة وإحالة التقرير للمدير لتطبيق الخصم القانوني.'
  },
  {
    id: 'abs-6',
    type: 'student',
    personName: 'يونس مكناسي',
    identifier: '3 ع ت 1',
    date: '2025-11-01',
    period: 'يومان كاملان (14 ساعة)',
    hours: 14,
    reason: 'غياب غير مبرر - تكرار الغياب للمرة الرابعة',
    isJustified: false,
    status: 'warning_sent',
    notes: 'إشعار ثاني لولي الأمر. تأثير سلبي مباشر على حصص الرياضيات والفيزياء.'
  },
  {
    id: 'abs-7',
    type: 'student',
    personName: 'خالد بن يطو',
    identifier: '3 ع ت 1',
    date: '2025-10-29',
    period: 'الفترة الصباحية',
    hours: 8,
    reason: 'تأخرات متكررة وغياب جزئي غير مبرر',
    isJustified: false,
    status: 'warning_sent',
    notes: 'تراجع نقطة التقويم المستمر بسبب ضياع الفرض الأول.'
  },
  {
    id: 'abs-8',
    type: 'student',
    personName: 'أنس زروقي',
    identifier: '3 ع ت 1',
    date: '2025-10-25',
    period: '08:00 - 12:00',
    hours: 4,
    reason: 'عذر مرضي مبرر بوصفة طبية معتمدة',
    isJustified: true,
    status: 'justified',
    notes: 'تم تسوية الوضعية البيداغوجية وبرمجة فرض تعويضي.'
  }
];

export const INITIAL_STUDENTS_SCORES: StudentScore[] = [
  {
    id: 'std-1',
    name: 'أمير بوعزيز',
    classGroup: '3 ع ت 1',
    stream: 'علوم تجريبية',
    scores: [
      { subject: 'الرياضيات', continuousScore: 16.5, examScore: 15.0, coefficient: 5 },
      { subject: 'علوم الطبيعة والحياة', continuousScore: 17.0, examScore: 16.5, coefficient: 6 },
      { subject: 'العلوم الفيزيائية', continuousScore: 15.5, examScore: 14.5, coefficient: 5 },
      { subject: 'الأدب العربي', continuousScore: 14.0, examScore: 13.5, coefficient: 3 },
      { subject: 'الفلسفة', continuousScore: 13.0, examScore: 12.0, coefficient: 2 },
      { subject: 'اللغة الفرنسية', continuousScore: 15.0, examScore: 14.0, coefficient: 2 },
      { subject: 'اللغة الإنجليزية', continuousScore: 16.0, examScore: 16.0, coefficient: 2 },
      { subject: 'التاريخ والجغرافيا', continuousScore: 15.0, examScore: 14.0, coefficient: 2 },
      { subject: 'العلوم الإسلامية', continuousScore: 17.5, examScore: 18.0, coefficient: 2 }
    ],
    average: 15.28,
    rank: 1,
    mention: 'تهنئة ولوحة شرف'
  },
  {
    id: 'std-2',
    name: 'مريم حيدوش',
    classGroup: '3 ع ت 1',
    stream: 'علوم تجريبية',
    scores: [
      { subject: 'الرياضيات', continuousScore: 15.0, examScore: 14.5, coefficient: 5 },
      { subject: 'علوم الطبيعة والحياة', continuousScore: 16.0, examScore: 15.5, coefficient: 6 },
      { subject: 'العلوم الفيزيائية', continuousScore: 14.5, examScore: 13.5, coefficient: 5 },
      { subject: 'الأدب العربي', continuousScore: 16.0, examScore: 15.5, coefficient: 3 },
      { subject: 'الفلسفة', continuousScore: 14.0, examScore: 13.0, coefficient: 2 },
      { subject: 'اللغة الفرنسية', continuousScore: 16.0, examScore: 16.0, coefficient: 2 },
      { subject: 'اللغة الإنجليزية', continuousScore: 15.5, examScore: 15.0, coefficient: 2 },
      { subject: 'التاريخ والجغرافيا', continuousScore: 16.0, examScore: 16.0, coefficient: 2 },
      { subject: 'العلوم الإسلامية', continuousScore: 18.0, examScore: 17.5, coefficient: 2 }
    ],
    average: 14.94,
    rank: 2,
    mention: 'لوحة شرف'
  },
  {
    id: 'std-3',
    name: 'أنس زروقي',
    classGroup: '3 ع ت 1',
    stream: 'علوم تجريبية',
    scores: [
      { subject: 'الرياضيات', continuousScore: 13.0, examScore: 11.5, coefficient: 5 },
      { subject: 'علوم الطبيعة والحياة', continuousScore: 13.5, examScore: 12.0, coefficient: 6 },
      { subject: 'العلوم الفيزيائية', continuousScore: 12.0, examScore: 10.5, coefficient: 5 },
      { subject: 'الأدب العربي', continuousScore: 13.0, examScore: 12.0, coefficient: 3 },
      { subject: 'الفلسفة', continuousScore: 11.0, examScore: 10.0, coefficient: 2 },
      { subject: 'اللغة الفرنسية', continuousScore: 12.0, examScore: 11.0, coefficient: 2 },
      { subject: 'اللغة الإنجليزية', continuousScore: 13.0, examScore: 12.5, coefficient: 2 },
      { subject: 'التاريخ والجغرافيا', continuousScore: 13.5, examScore: 12.5, coefficient: 2 },
      { subject: 'العلوم الإسلامية', continuousScore: 15.0, examScore: 14.5, coefficient: 2 }
    ],
    average: 11.98,
    rank: 3,
    mention: 'تشجيع'
  },
  {
    id: 'std-4',
    name: 'خالد بن يطو',
    classGroup: '3 ع ت 1',
    stream: 'علوم تجريبية',
    scores: [
      { subject: 'الرياضيات', continuousScore: 10.0, examScore: 9.0, coefficient: 5 },
      { subject: 'علوم الطبيعة والحياة', continuousScore: 11.0, examScore: 10.0, coefficient: 6 },
      { subject: 'العلوم الفيزيائية', continuousScore: 9.5, examScore: 8.5, coefficient: 5 },
      { subject: 'الأدب العربي', continuousScore: 11.0, examScore: 10.5, coefficient: 3 },
      { subject: 'الفلسفة', continuousScore: 10.0, examScore: 8.0, coefficient: 2 },
      { subject: 'اللغة الفرنسية', continuousScore: 9.0, examScore: 8.5, coefficient: 2 },
      { subject: 'اللغة الإنجليزية', continuousScore: 10.5, examScore: 9.5, coefficient: 2 },
      { subject: 'التاريخ والجغرافيا', continuousScore: 12.0, examScore: 11.0, coefficient: 2 },
      { subject: 'العلوم الإسلامية', continuousScore: 14.0, examScore: 13.0, coefficient: 2 }
    ],
    average: 9.88,
    rank: 4,
    mention: 'تنبيه بالعمل وتكثيف المراجعة'
  },
  {
    id: 'std-5',
    name: 'يونس مكناسي',
    classGroup: '3 ع ت 1',
    stream: 'علوم تجريبية',
    scores: [
      { subject: 'الرياضيات', continuousScore: 8.0, examScore: 6.5, coefficient: 5 },
      { subject: 'علوم الطبيعة والحياة', continuousScore: 9.0, examScore: 7.5, coefficient: 6 },
      { subject: 'العلوم الفيزيائية', continuousScore: 7.5, examScore: 6.0, coefficient: 5 },
      { subject: 'الأدب العربي', continuousScore: 10.0, examScore: 9.0, coefficient: 3 },
      { subject: 'الفلسفة', continuousScore: 8.0, examScore: 7.0, coefficient: 2 },
      { subject: 'اللغة الفرنسية', continuousScore: 8.5, examScore: 7.5, coefficient: 2 },
      { subject: 'اللغة الإنجليزية', continuousScore: 9.0, examScore: 8.0, coefficient: 2 },
      { subject: 'التاريخ والجغرافيا', continuousScore: 10.0, examScore: 9.5, coefficient: 2 },
      { subject: 'العلوم الإسلامية', continuousScore: 12.0, examScore: 11.0, coefficient: 2 }
    ],
    average: 7.85,
    rank: 5,
    mention: 'إنذار بالتقصير وبرمجة دعم مستعجل'
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    author: 'الناظر لخضر بن حامد',
    wilaya: 'الجزائر العاصمة (016)',
    school: 'ثانوية الرياضيات بالقبة',
    date: 'منذ ساعتين',
    title: 'إشكالية تنظيم جداول التوقيت في مادة العلوم الفيزيائية مع نظام التفويج للأعمال المخبرية',
    content: 'زملائي النظار ومديري الدراسات الأفاضل، نواجه إشكالاً في ثانوية تضم 18 فوجاً تربوياً ومخبرين اثنين فقط للفيزياء، مما يسبب تعارضاً متكرراً في الساعات المتتالية للأفواج العلمية. كيف نظمتم توزيع حصص الساعتين للأعمال التطبيقية دون التضحية بالراحة البيداغوجية للأساتذة؟',
    category: 'جداول توقيت',
    repliesCount: 4,
    likes: 19,
    replies: [
      {
        author: 'الناظر سليم بوزيان (ولاية سطيف)',
        date: 'منذ ساعة',
        text: 'أهلاً زميلي. نعتمد نظام التبادل الدوري الثنائي بين مادة علوم الطبيعة والحياة ومادة العلوم الفيزيائية، حيث يستغل الفوج "أ" مخبر الفيزياء بينما يستغل الفوج "ب" مخبر العلوم في نفس الحصة ثم يتبادلان في الأسبوع الموالي.',
        isOfficialClarification: false
      },
      {
        author: 'الناظر مراد كواشي (ولاية تيزي وزو)',
        date: 'منذ 30 دقيقة',
        text: 'توصية مفتشية الإدارة تؤكد على إعطاء الأولوية لأقسام السنة الثالثة ثانوي (البكالوريا) في الحصص الصباحية، ونقل حصص الأعمال التطبيقية لأقسام الأولى ثانوي للفترة بعد الزوال لتفادي الضغط على المخابر.',
        isOfficialClarification: true
      }
    ]
  },
  {
    id: 'post-2',
    author: 'الناظرة نورة بلحاج',
    wilaya: 'ولاية وهران (031)',
    school: 'ثانوية عبد الحميد بن باديس',
    date: 'أمس',
    title: 'تطبيق منشور الخصم المالي للغيابات في حالة الإضراب أو التوقف غير المرخص',
    content: 'يرجى التوضيح حول المسار الإجرائي الدقيق عند استلام إشعار الإضراب: هل يحرر محضر المعاينة الفردي للغياب أم يكتفى بالجدول الجماعي اليومي المحال لمصلحة الرواتب والمستخدمين؟ وما هو الأجل الأقصى للرد على الاستفسارات؟',
    category: 'تطبيق مناشير',
    repliesCount: 6,
    likes: 27,
    replies: [
      {
        author: 'المستشار القانوني بالنقابة الوطنية لعمال التربية SNTE',
        date: 'منذ 18 ساعة',
        text: 'طبقاً لأحكام القانون 90-14 والأمر 06-03 والمنشور الوزاري المحدد لإجراءات الخصم، يحرر جدول اسمي جماعي يثبت التوقف الفعلي، ولا يعد الإضراب خطأ تأديبياً بل يعلق علاقة العمل في الشق المالي فقط (يوم بيوم أو ساعة بساعة). أما في الغيابات الفردية العادية، فيجب إرسال استفسار كتابي يمنح فيه الأستاذ 48 ساعة للرد القانوني.',
        isOfficialClarification: true
      }
    ]
  },
  {
    id: 'post-3',
    author: 'الناظر أحمد صيد',
    wilaya: 'ولاية باتنة (005)',
    school: 'ثانوية الشهداء الإخوة عمراني',
    date: 'منذ يومين',
    title: 'معايير ترتيب التلاميذ وإسناد المكافآت الشرفية في مجالس الأقسام طبقاً للقرار 157',
    content: 'نناقش في مجلس الأساتذة معيار منح لوحة الشرف والتشجيع: هل تعتمد المعدلات العامة المجردة فقط أم يؤخذ بعين الاعتبار الانضباط والمواظبة والمعدل التقديري للمواد الأساسية؟',
    category: 'مجالس الأقسام',
    repliesCount: 3,
    likes: 15
  }
];
