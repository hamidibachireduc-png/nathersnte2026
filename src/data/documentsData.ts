import { OfficialDocumentTemplate } from '../types';

export const OFFICIAL_DOCUMENT_TEMPLATES: OfficialDocumentTemplate[] = [
  {
    id: 'doc-installation-pv',
    title: 'محضر تنصيب أستاذ جديد في المنصب',
    code: 'نموذج بيداغوجي / و.ت.و / 01',
    category: 'pedagogy',
    description: 'الوثيقة الإدارية القانونية التي تثبت استلام الأستاذ (متربص أو متعاقد أو مرقى) لمهامه البيداغوجية بالمؤسسة.',
    defaultData: {
      teacherName: 'أحمد بن عبد الله',
      subject: 'الرياضيات',
      grade: 'أستاذ التعليم الثانوي (أ.ت.ث)',
      status: 'متربص / معين بمقتضى القرار الوزاري',
      appointmentNumber: '1428 / م.ت / 2025',
      appointmentDate: '2025-09-01',
      installationDate: '2025-09-07',
      assignedQuota: '18 ساعة أسبوعياً',
      notes: 'تم تسليم الأستاذ المنهاج الرسمي والتوزيع السنوي وجدول التوقيت الأسبوعي والتوصيات التربوية الخاصة بالمادة.'
    },
    fields: [
      { key: 'teacherName', label: 'اسم ولقب الأستاذ', type: 'text' },
      { key: 'subject', label: 'مادة التدريس', type: 'text' },
      { key: 'grade', label: 'الرتبة والإطار', type: 'select', options: ['أستاذ التعليم الثانوي (أ.ت.ث)', 'أستاذ رئيسي للتعليم الثانوي', 'أستاذ مكون في التعليم الثانوي', 'أستاذ متعاقد'] },
      { key: 'appointmentNumber', label: 'رقم قرار التعيين', type: 'text' },
      { key: 'appointmentDate', label: 'تاريخ قرار التعيين', type: 'date' },
      { key: 'installationDate', label: 'تاريخ التنصيب الفعلي', type: 'date' },
      { key: 'assignedQuota', label: 'الحجم الساعي الأسبوعي', type: 'text' },
      { key: 'notes', label: 'ملاحظات والتزامات البيداغوجيا', type: 'textarea' }
    ]
  },
  {
    id: 'doc-daily-absence-report',
    title: 'تقرير الغيابات اليومية للأساتذة والتلاميذ',
    code: 'نموذج تسيير يومي / 02',
    category: 'admin',
    description: 'التقرير الصباحي والمسائي المرفوع يومياً لمدير المؤسسة لرصد الشغور والغيابات وحصص الاستخلاف الضرورية.',
    defaultData: {
      reportDate: new Date().toISOString().split('T')[0],
      session: 'الفترة الصباحية (08:00 - 12:00)',
      absentTeachersCount: '2',
      absentTeachersDetails: 'الأستاذ (ق. سمير) - مادة الفيزياء - إشعار مرضي مسبق.\nالأستاذة (م. نادية) - مادة الأدب العربي - غياب طارئ بدون إشعار (الحصة 1 و2).',
      absentStudentsCount: '14 تلميذاً عبر 8 أفواج تربوية',
      coveredSessions: 'تم تغطية حصة الفيزياء عبر استخلاف الأستاذ ب. كمال وتوجيه الفوج للمكتبة المدرسية.',
      directorInstructions: 'اتخاذ إجراء الاستفسار الكتابي الفوري وإشعار أولياء التلاميذ المتغيبين.'
    },
    fields: [
      { key: 'reportDate', label: 'تاريخ التقرير اليومي', type: 'date' },
      { key: 'session', label: 'الفترة المعنية', type: 'select', options: ['الفترة الصباحية (08:00 - 12:00)', 'الفترة المسائية (14:00 - 17:00)', 'اليوم الكامل'] },
      { key: 'absentTeachersCount', label: 'عدد الأساتذة المتغيبين', type: 'text' },
      { key: 'absentTeachersDetails', label: 'بيانات الأساتذة المتغيبين والأسباب', type: 'textarea' },
      { key: 'absentStudentsCount', label: 'عدد التلاميذ المتغيبين', type: 'text' },
      { key: 'coveredSessions', label: 'إجراءات تغطية الحصص والاستخلاف', type: 'textarea' },
      { key: 'directorInstructions', label: 'توجيهات الإدارة والناظر', type: 'textarea' }
    ]
  },
  {
    id: 'doc-surveillance-table',
    title: 'جدول حراسة الاختبارات الفصلية والامتحانات',
    code: 'نموذج امتحانات / 03',
    category: 'exams',
    description: 'مخطط توزيع الأساتذة على قاعات الاختبارات مع تحديد الحراس الرئيسيين والاحتياطيين وقاعات التصحيح.',
    defaultData: {
      examTitle: 'اختبارات الفصل الدراسي الأول - دورة ديسمبر 2025',
      examDate: '2025-12-03',
      examDuration: 'من 08:00 إلى 11:00 (3 ساعات)',
      subjectExamined: 'الفلسفة / الرياضيات / العلوم الطبيعية',
      levelsInvolved: 'أقسام السنة الثالثة ثانوي (جميع الشعب)',
      chiefExaminer: 'ناظر المؤسسة ومساعدو التربية',
      surveillanceDetails: 'القاعة 01: أ. بن عمار + أ. زايدي\nالقاعة 02: أ. قدور + أ. بوعلام\nالقاعة 03: أ. منصوري + أ. رحماني\nالقاعة 04 (احتياط وسحب): أ. سلطاني + أ. حداد',
      specialInstructions: 'منع إدخال الهواتف الذكية والساعات الإلكترونية. التواجد في القاعة قبل ربع ساعة من توزيع المواضيع.'
    },
    fields: [
      { key: 'examTitle', label: 'عنوان الامتحان أو الاختبار', type: 'text' },
      { key: 'examDate', label: 'تاريخ الإجراء', type: 'date' },
      { key: 'examDuration', label: 'التوقيت والمدة', type: 'text' },
      { key: 'subjectExamined', label: 'المواد الممتحنة', type: 'text' },
      { key: 'levelsInvolved', label: 'المستويات والأقسام المعنية', type: 'text' },
      { key: 'surveillanceDetails', label: 'قائمة توزيع الحراس على القاعات', type: 'textarea' },
      { key: 'specialInstructions', label: 'تعليمات الانضباط ومكافحة الغش', type: 'textarea' }
    ]
  },
  {
    id: 'doc-teacher-explanation',
    title: 'استفسار عن غياب أستاذ وإشعار بالخصم من الراتب',
    code: 'مراسلة إدارية داخلية / 04',
    category: 'correspondence',
    description: 'استفسار رسمي يوجه للأستاذ المتغيب لتقديم مبرراته القانونية طبقاً للأمر 06-03 والمرسوم 08-315.',
    defaultData: {
      teacherName: 'أ. عبد القادر مسعودي',
      subject: 'أستاذ مادة العلوم الفيزيائية',
      absenceDate: '2025-11-18',
      periodMissed: 'من الساعة 10:00 إلى 12:00 (ساعتان)',
      classesAffected: 'فوج 2 علوم تجريبية 1 وفوج 2 رياضي',
      deadlineDays: '48 ساعة من تاريخ استلام هذا الإشعار',
      legalReference: 'تطبيقاً لأحكام الأمر 06-03 المتضمن القانون الأساسي للوظيفة العمومية لاسيما المادة 207 منه، والمنشور الوزاري رقم 08-315.',
      consequences: 'في حال عدم موافاة الإدارة بالتبرير المقبول في الآجال، سيتم اتخاذ الإجراءات الإدارية المترتبة عنها الخصم من الراتب.'
    },
    fields: [
      { key: 'teacherName', label: 'اسم ولقب الأستاذ', type: 'text' },
      { key: 'subject', label: 'المادة والرتبة', type: 'text' },
      { key: 'absenceDate', label: 'تاريخ الغياب', type: 'date' },
      { key: 'periodMissed', label: 'الفترة والحصص الضائعة', type: 'text' },
      { key: 'classesAffected', label: 'الأفواج المتضررة', type: 'text' },
      { key: 'deadlineDays', label: 'أجل تقديم التبرير', type: 'text' },
      { key: 'consequences', label: 'التنبيه بالإجراءات والخصم', type: 'textarea' }
    ]
  },
  {
    id: 'doc-council-minutes',
    title: 'محضر المجلس التعليمي لمادة التنسيق البيداغوجي',
    code: 'محضر بيداغوجي / مجالس / 05',
    category: 'councils',
    description: 'محضر اجتماع أساتذة المادة الواحدة برئاسة الأستاذ المنسق أو الناظر لتوحيد وتيرة الدروس والفروض والمشاريع.',
    defaultData: {
      subject: 'مادة العلوم الفيزيائية والتكنولوجيا',
      meetingDate: '2025-10-15',
      coordinatorName: 'أ. دحمان مراد (أستاذ رئيسي)',
      attendees: 'أ. بن صالح، أ. مرواني، أ. قاسمي، أ. بوعروج (حضور كامل الأساتذة)',
      agenda: '1. تقييم تقدم البرامج والمقاربة بالكفاءات.\n2. برمجة الفروض المحروسة الموحدة.\n3. تحديد احتياجات المخابر والمواد الكيميائية والأجهزة.\n4. معالجة النقائص المشخصة في تقويم المستلزمات.',
      decisions: 'توحيد مواعيد الفروض في الأسبوع الثاني من نوفمبر، تجهيز مخبر 3 بالدارات الكهربائية، وتنظيم حصص دعم للتلاميذ المتعثرين في الرياضيات التطبيقية.',
      recommendations: 'الالتزام التام بكراس النصوص والتنسيق الأسبوعي المستمر.'
    },
    fields: [
      { key: 'subject', label: 'المادة التعليمية', type: 'text' },
      { key: 'meetingDate', label: 'تاريخ انعقاد المجلس', type: 'date' },
      { key: 'coordinatorName', label: 'الأستاذ المنسق / رئيس الجلسة', type: 'text' },
      { key: 'attendees', label: 'قائمة الأساتذة الحاضرين', type: 'textarea' },
      { key: 'agenda', label: 'جدول الأعمال المسطر', type: 'textarea' },
      { key: 'decisions', label: 'القرارات المتفق عليها', type: 'textarea' },
      { key: 'recommendations', label: 'توصيات الناظر والمفتشية', type: 'textarea' }
    ]
  },
  {
    id: 'doc-student-absence-notice',
    title: 'إشعار بغياب تلميذ واستدعاء ولي الأمر',
    code: 'مراسلة تربوية / 06',
    category: 'correspondence',
    description: 'إشعار قانوني يرسل لولي أمر التلميذ عند تكرار الغيابات أو التأخرات غير المبررة طبقاً للنظام الداخلي للثانوية.',
    defaultData: {
      studentName: 'ياسين بلخير',
      classGroup: '2 تقني رياضي - فرع هندسة ميكانيكية',
      totalAbsenceHours: '18 ساعة غير مبررة خلال الشهر الجاري',
      warningLevel: 'إنذار أول موجه لولي الأمر',
      meetingDateProposed: 'يوم الخميس القادم على الساعة 10:00 صباحاً',
      consequences: 'نلفت انتباهكم إلى أنه في حال استمرار الغياب دون مبرر شرعي سيعرض التلميذ للشطب المؤقت أو الإحالة على مجلس التأديب طبقاً للقرار 171.'
    },
    fields: [
      { key: 'studentName', label: 'اسم ولقب التلميذ', type: 'text' },
      { key: 'classGroup', label: 'الفوج التربوي والشعبة', type: 'text' },
      { key: 'totalAbsenceHours', label: 'عدد الساعات المتغيب فيها', type: 'text' },
      { key: 'warningLevel', label: 'درجة الإشعار', type: 'select', options: ['إشعار أول بالغياب', 'إنذار ثاني واستدعاء عاجل', 'إعذار أخير قبل الشطب'] },
      { key: 'meetingDateProposed', label: 'الموعد المحدد لمقابلة الناظر', type: 'text' },
      { key: 'consequences', label: 'التذكير بالعقوبات والنظام الداخلي', type: 'textarea' }
    ]
  }
];
