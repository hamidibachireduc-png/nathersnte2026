import React from 'react';
import {
  TrendingUp,
  Calculator,
  UserX,
  Clock,
  CalendarCheck,
  BookOpen,
  Scale,
  Server,
  FileText,
  Building2,
  Award,
  Users,
  ArrowLeft,
  Check,
  AlertTriangle,
  Calendar,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import {
  EducationStage,
  InstitutionInfo,
  SectionId,
  AbsenceRecord,
  TimetableSlot,
  StudentRecord,
  TeacherRecord,
  AgendaTask,
  SubjectConfig,
} from '../types';
import {
  calculateClassSummaries,
  DEFAULT_EMBLEM_URL,
  STAGE_METADATA,
} from '../data/initialData';

interface DashboardViewProps {
  activeStage: EducationStage;
  onSelectStage: (stage: EducationStage) => void;
  institution: InstitutionInfo;
  onNavigate: (section: SectionId) => void;
  absences: AbsenceRecord[];
  timetable: TimetableSlot[];
  students: StudentRecord[];
  subjects: SubjectConfig[];
  teachers: TeacherRecord[];
  agendaItems: AgendaTask[];
  onOpenDocumentGenerator: (docId: string) => void;
  onOpenSettings: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeStage,
  onSelectStage,
  institution,
  onNavigate,
  absences,
  timetable,
  students,
  subjects,
  teachers,
  agendaItems,
  onOpenDocumentGenerator,
  onOpenSettings,
}) => {
  const stageMeta = STAGE_METADATA[activeStage];

  const stageStudents = students.filter((s) => s.stage === activeStage);
  const stageAbsences = absences.filter((a) => a.stage === activeStage);
  const stageTeachers = teachers.filter((t) => t.stage === activeStage);
  const stageTimetable = timetable.filter((t) => t.stage === activeStage);
  const stageAgenda = agendaItems.filter(
    (a) => a.stage === activeStage || a.stage === 'all'
  );

  const summaries = calculateClassSummaries(
    stageStudents,
    subjects,
    stageAbsences,
    activeStage === 'primary' ? 'primary_exam_plus_eval' : 'ministry_standard',
    false,
    activeStage
  );

  const passingCount = summaries.filter(
    (s) => s.termAverage >= stageMeta.passingGrade
  ).length;
  const passRate =
    summaries.length > 0
      ? ((passingCount / summaries.length) * 100).toFixed(1)
      : '0.0';
  const overallAvg =
    summaries.length > 0
      ? (
          summaries.reduce((acc, s) => acc + s.termAverage, 0) / summaries.length
        ).toFixed(2)
      : '0.00';

  const syncedTeachers = stageTeachers.filter((t) => t.digitalSyncCompleted).length;
  const syncPercentage =
    stageTeachers.length > 0
      ? Math.round((syncedTeachers / stageTeachers.length) * 100)
      : 100;

  const totalAssignedHours = stageTeachers.reduce(
    (acc, t) => acc + t.assignedHours,
    0
  );
  const totalQuotaHours = stageTeachers.reduce((acc, t) => acc + t.weeklyQuota, 0);
  const quotaPercentage =
    totalQuotaHours > 0
      ? Math.round((totalAssignedHours / totalQuotaHours) * 100)
      : 100;

  const studentAbsencesCount = stageAbsences.filter(
    (a) => a.type === 'student'
  ).length;
  const urgentAbsencesCount = stageAbsences.filter(
    (a) =>
      a.status === 'unjustified' ||
      a.status === 'parent_summoned' ||
      a.status === 'warning_sent'
  ).length;

  const completedAgenda = stageAgenda.filter(
    (a) => a.status === 'completed'
  ).length;
  const agendaProgress =
    stageAgenda.length > 0
      ? Math.round((completedAgenda / stageAgenda.length) * 100)
      : 0;
  const urgentAgendaCount = stageAgenda.filter(
    (a) => a.priority === 'urgent' && a.status !== 'completed'
  ).length;

  const logoSrc = institution.logoUrl || DEFAULT_EMBLEM_URL;

  const platformModules: {
    id: SectionId;
    title: string;
    subtitle: string;
    badge: string;
    primaryMetric: string;
    secondaryMetric: string;
    progressPercent: number;
    accentColor: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'averages',
      title: `الحساب التلقائي للمعدلات (/${stageMeta.maxGradeScale})`,
      subtitle:
        activeStage === 'primary'
          ? 'حساب فوري من 10 وتقييم الكفاءات (أ، ب، ج، د) لتلاميذ الطور الابتدائي'
          : activeStage === 'middle'
          ? 'حساب فوري من 20 بمعاملات التعليم المتوسط (1م - 4م BEM) والإجازات'
          : 'حساب فوري من 20 بمعاملات الشعب والجذوع المشتركة وبكالوريا 2026',
      badge: `سلم /${stageMeta.maxGradeScale}`,
      primaryMetric: `المعدل العام: ${overallAvg} / ${stageMeta.maxGradeScale}`,
      secondaryMetric: `نسبة النجاح: ${passRate}% (${passingCount}/${summaries.length} تلميذ)`,
      progressPercent: Number(passRate),
      accentColor: 'from-emerald-500 to-teal-400',
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      id: 'absences',
      title: 'متابعة غيابات التلاميذ بمرونة',
      subtitle:
        activeStage === 'primary'
          ? 'نداء الفترات، متابعة المطعم المدرسي والصحة المدرسية UDS وإشعار الأولياء'
          : 'نداء الحصص التفاعلي، حساب الرصيد التراكمي، وتوليد آلي لاستدعاءات الأولياء',
      badge: 'مرونة كاملة',
      primaryMetric: `${stageAbsences.length} سجل مواظبة`,
      secondaryMetric: `${studentAbsencesCount} غياب تلاميذ · ${urgentAbsencesCount} قيد المتابعة`,
      progressPercent: 88,
      accentColor: 'from-rose-500 to-amber-500',
      icon: <UserX className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      title: 'تحليلات الأداء والمواظبة (Recharts)',
      subtitle: 'رسوم بيانية تفاعلية لنسب التعثر، توزيع المعدلات حسب المواد، ومنحنى الغيابات',
      badge: 'تحليل بياني',
      primaryMetric: `نجاح ${passRate}% · تعثر ${100 - Number(passRate)}%`,
      secondaryMetric: `تحليل ${subjects.filter((s) => s.stages.includes(activeStage)).length} مواد تعليمية و ${summaries.length} تلميذ`,
      progressPercent: Number(passRate),
      accentColor: 'from-purple-500 to-amber-400',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'agenda',
      title: `مفكرة ${stageMeta.natherTitle}`,
      subtitle: `التخطيط العملياتي اليومي والفصلي وتحضير ${stageMeta.nationalExamName}`,
      badge: 'رزنامة 2026',
      primaryMetric: `${stageAgenda.length} محطات مسجلة`,
      secondaryMetric: `نسبة الإنجاز: ${agendaProgress}% (${urgentAgendaCount} عاجلة)`,
      progressPercent: agendaProgress,
      accentColor: 'from-amber-400 to-yellow-500',
      icon: <CalendarCheck className="w-5 h-5" />,
    },
    {
      id: 'legislation',
      title: 'الركن التشريعي للأطوار الثلاثة',
      subtitle: 'المرسوم التنفيذي 25-54 المحدث لنظار الابتدائي والمتوسط والثانوي والقرار 157',
      badge: 'تحيين 2026',
      primaryMetric: 'نصوص الأطوار الـ 3',
      secondaryMetric: 'مفهرسة بالمواد القانونية القابلة للنسخ',
      progressPercent: 100,
      accentColor: 'from-[#d4af37] to-amber-600',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: 'digitalization',
      title: 'الربط مع الرقمنة (Amatti)',
      subtitle: 'مراقبة صب النقاط، التقديرات، وإشعارات الغياب الرقمية عبر فضاء الأولياء',
      badge: 'Amatti 2026',
      primaryMetric: `مزامنة ${syncPercentage}%`,
      secondaryMetric: `${syncedTeachers}/${stageTeachers.length} أساتذة أتموا الحجز`,
      progressPercent: syncPercentage,
      accentColor: 'from-cyan-500 to-blue-500',
      icon: <Server className="w-5 h-5" />,
    },
    {
      id: 'documents',
      title: 'حقيبة الوثائق الرسمية A4',
      subtitle: 'محرر ذكي لاستدعاءات الأولياء، كشوف المطعم، ومحاضر المجالس والطباعة الفورية',
      badge: 'نماذج رسمية',
      primaryMetric: 'ترويسة رسمية جاهزة',
      secondaryMetric: 'طباعة A4 وتحميل بصيغة Word (.doc)',
      progressPercent: 100,
      accentColor: 'from-emerald-600 to-[#d4af37]',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'timetable',
      title: `جداول التوقيت (${stageMeta.teacherWeeklyQuota} س)`,
      subtitle: `توزيع الحصص وكاشف التعارضات وفق النصاب القانوني لطور الـ${stageMeta.shortName}`,
      badge: `نصاب ${stageMeta.teacherWeeklyQuota} س`,
      primaryMetric: `${stageTimetable.length} حصة مبرمجة`,
      secondaryMetric: `تغطية النصاب: ${totalAssignedHours} س (${quotaPercentage}%)`,
      progressPercent: quotaPercentage,
      accentColor: 'from-blue-500 to-indigo-500',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 'community',
      title: 'الجماعة التربوية ودفاتر النصوص',
      subtitle: 'دليل اتصال الطاقم الإداري والتربوي، استقبال الأولياء، ومراقبة التدرجات',
      badge: 'القرار 778',
      primaryMetric: 'دليل اتصال متكامل',
      secondaryMetric: 'مطابقة التدرجات السنوية: 86%',
      progressPercent: 86,
      accentColor: 'from-teal-500 to-emerald-500',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'institutes',
      title: 'المعاهد والهيئات الوصية',
      subtitle: 'الربط مع الديوان الوطني للامتحانات ONEC ومعهد التكوين INFP و ONPS',
      badge: '7 هيئات وطنية',
      primaryMetric: 'ONEC · INFP · ONPS',
      secondaryMetric: 'رزنامة المراسلات الرسمية 2026',
      progressPercent: 92,
      accentColor: 'from-purple-500 to-indigo-500',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'career',
      title: 'محاكي الدرجات والترقية للناظر',
      subtitle: `حساب الشبكة الاستدلالية (${stageMeta.classificationCategory}) والترقية لـ ${stageMeta.principalTitle}`,
      badge: 'المرسوم 25-54',
      primaryMetric: '12 درجة استدلالية',
      secondaryMetric: `محاكاة مقياس ${stageMeta.principalTitle}`,
      progressPercent: 95,
      accentColor: 'from-[#d4af37] to-emerald-500',
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* بطاقات مقارنة واختيار الأطوار التعليمية الثلاثة (ابتدائي · متوسط · ثانوي) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {(['primary', 'middle', 'secondary'] as EducationStage[]).map((stKey) => {
          const meta = STAGE_METADATA[stKey];
          const isSelected = activeStage === stKey;
          return (
            <div
              key={stKey}
              onClick={() => onSelectStage(stKey)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#13462c] via-[#0c2d1c] to-[#081b11] border-2 border-[#d4af37] shadow-xl'
                  : 'bg-[#081a12]/80 border-[#d4af37]/25 hover:border-[#d4af37]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{meta.name}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#071710] font-black'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isSelected ? 'الطور النشط حالياً ✓' : 'انقر للتفعيل'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                {meta.natherTitle}
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
                {meta.description}
              </p>
              <div className="mt-2.5 pt-2 border-t border-[#d4af37]/15 flex items-center justify-between text-[10px] text-emerald-300 font-semibold tabular-nums">
                <span>سلم النقاط: /{meta.maxGradeScale}</span>
                <span>·</span>
                <span>النصاب: {meta.teacherWeeklyQuota} س</span>
                <span>·</span>
                <span>{meta.hasCoefficients ? 'نظام المعاملات' : 'تقييم المكتسبات'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ترويسة الترحيب التنفيذية للطور المختار */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8f1414] via-[#d4af37] to-[#10b981]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              onClick={onOpenSettings}
              title="انقر لتغيير صورة أيقونة المؤسسة على ترويسة الوثائق"
              className="w-20 h-20 rounded-2xl bg-white/95 p-1.5 border-2 border-[#d4af37] shadow-xl flex flex-col items-center justify-center cursor-pointer group shrink-0"
            >
              <img
                src={logoSrc}
                alt="شعار المؤسسة"
                referrerPolicy="no-referrer"
                className="w-13 h-13 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
              <span className="text-[9px] font-black text-[#082014] bg-[#d4af37] px-1.5 rounded mt-0.5">
                شعار الترويسة
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded font-bold bg-[#8f1414] text-white border border-[#f5d77f]/40">
                  {stageMeta.name} · {stageMeta.classificationCategory}
                </span>
                <span className="text-[#d4af37] font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date().toLocaleDateString('ar-DZ', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                مرحباً بك، سيادة {stageMeta.natherTitle} /{' '}
                <span className="gold-gradient-text">{institution.directorOfStudies}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                لوحة القيادة التنفيذية لـ{' '}
                <span className="text-white font-bold">
                  {institution.schoolName} ({institution.wilaya})
                </span>{' '}
                — مكيّفة بالكامل مع خصوصية <span className="text-[#f5d77f] font-bold">{stageMeta.name}</span>{' '}
                (سلم التنقيط <span className="text-emerald-300 font-bold">/{stageMeta.maxGradeScale}</span> ·{' '}
                {stageMeta.nationalExamName}).
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigate('averages')}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 shadow hover:brightness-110 transition-all cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>
                    فتح حاسبة المعدلات ({stageMeta.name} /{stageMeta.maxGradeScale})
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('absences')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#105e32] hover:bg-[#14753e] text-white border border-[#d4af37]/50 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5 text-[#f5d77f]" />
                  <span>متابعة غيابات التلاميذ بمرونة ({stageMeta.shortName})</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div className="bg-[#06170f]/90 border border-[#d4af37]/30 rounded-xl p-3.5 flex items-center gap-3.5 shadow-inner">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#aa771c] text-[#082014] flex items-center justify-center font-black text-lg shadow-lg tabular-nums">
                فـ{institution.currentTerm}
              </div>
              <div>
                <div className="text-[11px] text-slate-400 tabular-nums">
                  الموسم الدراسي: {institution.schoolYear}
                </div>
                <div className="text-xs font-bold text-white">
                  الفصل الدراسي {institution.currentTerm} ({stageMeta.name})
                </div>
                <div className="text-[11px] text-[#e5c158] font-medium tabular-nums">
                  حجز الرقمنة مكتمل بنسبة {syncPercentage}%
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="px-4 py-2 rounded-xl bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] border border-[#d4af37]/50 text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <ImageIcon className="w-4 h-4 text-emerald-300" />
              <span>تخصيص بيانات وشعار {stageMeta.institutionLabel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* شريط المؤشرات القياسية الـ 6 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onNavigate('averages')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-emerald-700/50 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>الحساب التلقائي للمعدلات</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">{passRate}%</div>
          <div className="text-[10px] text-slate-300 mt-0.5 tabular-nums">
            المعدل العام: {overallAvg} / {stageMeta.maxGradeScale}
          </div>
        </div>

        <div
          onClick={() => onNavigate('absences')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-rose-800/60 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>غيابات التلاميذ ({stageMeta.shortName})</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1 tabular-nums">
            {stageAbsences.length} حالات
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5 tabular-nums">
            {urgentAbsencesCount} تتطلب متابعة أو استدعاء ولي
          </div>
        </div>

        <div
          onClick={() => onNavigate('digitalization')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-[#d4af37]/40 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>مزامنة الرقمنة Amatti</span>
            <Server className="w-4 h-4 text-[#f5d77f]" />
          </div>
          <div className="text-2xl font-black text-[#f5d77f] mt-1 tabular-nums">
            {syncPercentage}%
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5 tabular-nums">
            {syncedTeachers}/{stageTeachers.length} أساتذة أتموا الحجز
          </div>
        </div>

        <div
          onClick={() => onNavigate('timetable')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-blue-800/50 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>تغطية جداول التوقيت</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            {stageTimetable.length} حصة
          </div>
          <div className="text-[10px] text-blue-300 mt-0.5 tabular-nums">
            النصاب القانوني: {stageMeta.teacherWeeklyQuota} س/أسبوع
          </div>
        </div>

        <div
          onClick={() => onNavigate('agenda')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-amber-700/50 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>مفكرة واستحقاقات الناظر</span>
            <CalendarCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1 tabular-nums">
            {agendaProgress}%
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5 tabular-nums">
            {urgentAgendaCount} استحقاقات عاجلة قريبة
          </div>
        </div>

        <div
          onClick={() => onNavigate('community')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-emerald-700/50 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>الجماعة التربوية والتدرجات</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            {stageTeachers.length + 5} مؤطرين
          </div>
          <div className="text-[10px] text-emerald-300 mt-0.5">تقدم البرامج: 86% (مؤشر)</div>
        </div>
      </div>

      {/* شبكة الأقسام العشرة المتكاملة */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
          <div>
            <h3 className="text-lg font-black text-white">
              لوحة الإحصائيات الشاملة لأركان المنصة العشرة — مخصصة لـ ({stageMeta.name})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              اضغط على أي ركن للانتقال المباشر إليه ومعاينة الجداول والحسابات التلقائية والوثائق الخاصة بـ {stageMeta.natherTitle}
            </p>
          </div>
          <span className="text-xs font-bold bg-[#05140d] text-[#f5d77f] px-3 py-1 rounded-lg border border-[#d4af37]/30 self-start sm:self-auto">
            المرسوم التنفيذي 25-54 · SNTE 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {platformModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className="cursor-pointer rounded-xl bg-gradient-to-b from-[#0c2419] to-[#05140d] border border-[#d4af37]/30 hover:border-[#d4af37] p-4 transition-all hover:scale-[1.01] shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#105e32]/50 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] group-hover:bg-[#8f1414] transition-colors">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] font-bold bg-[#081a12] text-[#f5d77f] px-2 py-0.5 rounded border border-[#d4af37]/30">
                    {mod.badge}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-white text-sm group-hover:text-[#f5d77f] transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                    {mod.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#d4af37]/15 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-black text-white tabular-nums">
                    {mod.primaryMetric}
                  </span>
                  <ArrowLeft className="w-4 h-4 text-[#d4af37] group-hover:-translate-x-1 transition-transform" />
                </div>
                <div className="text-[10px] text-emerald-300 font-semibold truncate tabular-nums">
                  {mod.secondaryMetric}
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${mod.accentColor}`}
                    style={{ width: `${Math.min(100, Math.max(10, mod.progressPercent))}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* القسم السفلي: الوثائق الرسمية الجاهزة للطباعة + مفكرة الاستحقاقات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-[#091e14]/90 border border-[#d4af37]/30 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-bold text-white text-base">
                الوثائق الرسمية الجاهزة للترويسة بشعار {stageMeta.institutionLabel} والطباعة الفورية (A4)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('documents')}
              className="text-xs text-[#e5c158] hover:underline cursor-pointer font-bold"
            >
              فتح حقيبة الوثائق ←
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'doc-student-absence-notice',
                title: 'إشعار غياب تلميذ واستدعاء الولي',
                desc: 'استدعاء رسمي لولي أمر التلميذ المتغيب لتبرير الغياب ومتابعة المواظبة',
                cat: 'مواظبة التلاميذ',
              },
              activeStage === 'primary'
                ? {
                    id: 'doc-primary-canteen-report',
                    title: 'كشف المراقبة اليومية للمطعم والصحة UDS',
                    desc: 'ضبط التعداد اليومي للوجبات الساخنة والمتابعة الصحية لتلاميذ الابتدائي',
                    cat: 'خاص بالابتدائي',
                  }
                : {
                    id: 'doc-parent-pledge',
                    title: 'تعهد والتزام كتابي لولي التلميذ',
                    desc: 'وثيقة التزام رسمية يوقعها الولي لضمان انضباط ومواظبة التلميذ',
                    cat: 'انضباط ومواظبة',
                  },
              {
                id: 'doc-class-council-pv',
                title:
                  activeStage === 'primary'
                    ? 'محضر مجلس الأساتذة وتقييم المكتسبات'
                    : 'محضر مداولات مجلس القسم والنتائج',
                desc: 'المحضر الفصلي الشامل للنتائج والإجازات وخطة المعالجة البيداغوجية',
                cat: 'المجالس البيداغوجية',
              },
              {
                id: 'doc-teacher-explanation',
                title: 'استفسار غياب أستاذ وإشعار بالخصم',
                desc: 'استفسار رسمي طبقاً للمادة 207 من الأمر 06-03 والمرسوم 25-54',
                cat: 'شؤون الأساتذة',
              },
            ].map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-lg bg-[#06150e] border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                    <span className="text-emerald-300 font-semibold">{doc.cat}</span>
                    <span>·</span>
                    <span className="text-[#d4af37] font-medium">ترويسة رسمية A4</span>
                  </div>
                  <h5 className="font-bold text-sm text-white mb-1">{doc.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{doc.desc}</p>
                </div>
                <button
                  onClick={() => onOpenDocumentGenerator(doc.id)}
                  className="w-full py-1.5 px-3 rounded text-xs font-bold bg-[#0d2818] hover:bg-[#133d25] text-[#f5d77f] border border-[#d4af37]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>معاينة وطباعة فورية A4</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* مفكرة واستحقاقات الناظر القريبة */}
        <div className="rounded-xl bg-[#091e14]/90 border border-[#d4af37]/30 p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  استحقاقات {stageMeta.natherTitle}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('agenda')}
                className="text-[11px] text-[#f5d77f] hover:underline font-bold cursor-pointer"
              >
                كل المفكرة ←
              </button>
            </div>

            <div className="space-y-2.5 mt-4 text-xs">
              {stageAgenda.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('agenda')}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#06150e]/80 border border-slate-800 hover:border-[#d4af37]/40 cursor-pointer transition-all"
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      item.status === 'completed'
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : item.priority === 'urgent'
                        ? 'bg-[#8f1414] border-red-400 text-white'
                        : 'border-slate-600'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <Check className="w-3 h-3" />
                    ) : item.priority === 'urgent' ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-bold truncate ${
                        item.status === 'completed'
                          ? 'line-through text-slate-500'
                          : 'text-slate-100'
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>{item.periodLabel}</span>
                      <span className="font-mono text-[#d4af37] tabular-nums">
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('coordination')}
            className="w-full py-2 px-3 rounded-lg bg-[#06150e] hover:bg-[#0d2818] text-slate-200 border border-[#d4af37]/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Users className="w-4 h-4 text-[#d4af37]" />
            <span>فتح فضاء تنسيق نظار الأطوار الثلاثة (SNTE)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
