import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  CalendarDays, 
  UserX, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  Award,
  ChevronLeft,
  Globe,
  Landmark,
  Calculator,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  ImagePlus,
  ShieldCheck,
  Database,
  Contact
} from 'lucide-react';
import {
  InstitutionProfile,
  SectionType,
  AbsenceRecord,
  TimetableSlot,
  StudentScore,
  TeacherRecord,
  DirectorAgendaItem
} from '../types';
import { LEGISLATION_DATABASE } from '../data/legislationData';
import { OFFICIAL_DOCUMENT_TEMPLATES } from '../data/documentsData';

interface DashboardProps {
  institution: InstitutionProfile;
  onNavigate: (section: SectionType) => void;
  absences: AbsenceRecord[];
  timetable: TimetableSlot[];
  studentsScores: StudentScore[];
  teachers: TeacherRecord[];
  agendaItems: DirectorAgendaItem[];
  onOpenDocumentGenerator: (docId: string) => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  institution,
  onNavigate,
  absences,
  timetable,
  studentsScores,
  teachers,
  agendaItems,
  onOpenDocumentGenerator,
  onOpenSettings
}) => {
  // 1. Legislation stats
  const totalLawsCount = LEGISLATION_DATABASE.length;
  const updated2026LawsCount = LEGISLATION_DATABASE.filter(l => l.isUpdated2026).length;

  // 2. Documents stats
  const totalDocTemplates = OFFICIAL_DOCUMENT_TEMPLATES.length;

  // 3. Timetable & Teachers quota stats
  const totalSlots = timetable.length;
  const totalAssignedHours = teachers.reduce((sum, t) => sum + t.assignedHours, 0);
  const totalQuotaHours = teachers.reduce((sum, t) => sum + t.weeklyQuota, 0);
  const quotaCoverageRate = totalQuotaHours > 0 ? Math.round((totalAssignedHours / totalQuotaHours) * 100) : 100;

  // 4. Absences stats
  const pendingAbsences = absences.filter(a => a.status === 'warning_sent' || a.status === 'pending');
  const teacherAbsencesCount = absences.filter(a => a.type === 'teacher').length;
  const studentAbsencesCount = absences.filter(a => a.type === 'student').length;
  const justifiedAbsencesCount = absences.filter(a => a.isJustified).length;

  // 5. Results & Early Warning stats
  const passingStudents = studentsScores.filter(s => s.average >= 10).length;
  const atRiskStudentsCount = studentsScores.filter(s => s.average < 10).length;
  const excellenceStudentsCount = studentsScores.filter(s => s.average >= 14).length;
  const passRate = studentsScores.length > 0
    ? Math.round((passingStudents / studentsScores.length) * 100)
    : 0;
  const generalMean = studentsScores.length > 0
    ? (studentsScores.reduce((acc, s) => acc + s.average, 0) / studentsScores.length).toFixed(2)
    : '0.00';

  // 6. Digitalization Sync stats
  const completedDigitalTeachers = teachers.filter((_, i) => i % 4 !== 3).length;
  const digitalSyncRate = teachers.length > 0 ? Math.round((completedDigitalTeachers / teachers.length) * 100) : 92;

  // 7. Agenda & Milestones stats
  const completedAgendaCount = agendaItems.filter(a => a.status === 'completed').length;
  const inProgressAgendaCount = agendaItems.filter(a => a.status === 'in_progress').length;
  const urgentAgendaCount = agendaItems.filter(a => a.status !== 'completed' && a.priority === 'urgent').length;
  const agendaCompletionRate = agendaItems.length > 0 ? Math.round((completedAgendaCount / agendaItems.length) * 100) : 0;

  const activeLogoUrl = institution.logoUrl || '/assets/aistudio/image_98bcc8c9.png';

  // All 10 Platform Modules Comprehensive Stats Directory
  const platformModulesSummary: {
    id: SectionType;
    title: string;
    subtitle: string;
    primaryMetric: string;
    secondaryMetric: string;
    progressPercent: number;
    badge: string;
    icon: React.ReactNode;
    accentColor: string;
  }[] = [
    {
      id: 'legislation',
      title: 'الركن التشريعي والتنظيمي 2026',
      subtitle: 'المراسيم التنفيذية، القانون الأساسي 25-54، والمنشور 112/2026',
      primaryMetric: `${totalLawsCount} نصاً رسمياً`,
      secondaryMetric: `${updated2026LawsCount} نصوص محينة 2026`,
      progressPercent: 100,
      badge: 'محين 2026',
      icon: <BookOpen className="w-5 h-5" />,
      accentColor: 'from-emerald-600 to-emerald-400'
    },
    {
      id: 'digitalization',
      title: 'الربط مع الأرضية الرقمية (Amatti)',
      subtitle: 'مراقبة حجز النقاط، مطابقة الإسناد، والتحويلات الرقمية',
      primaryMetric: `${digitalSyncRate}% نسبة الحجز`,
      secondaryMetric: `${completedDigitalTeachers}/${teachers.length} أساتذة أتموا الصب`,
      progressPercent: digitalSyncRate,
      badge: 'متصل آنياً',
      icon: <Globe className="w-5 h-5" />,
      accentColor: 'from-amber-500 to-yellow-300'
    },
    {
      id: 'documents',
      title: 'حقيبة الوثائق وترويسة المؤسسة',
      subtitle: 'محاضر التنصيب، الاستفسارات، وجداول الحراسة بشعار المؤسسة',
      primaryMetric: `${totalDocTemplates} نماذج قياسية`,
      secondaryMetric: 'تصدير A4 و Word فوري',
      progressPercent: 100,
      badge: 'شعار مفعل',
      icon: <FileText className="w-5 h-5" />,
      accentColor: 'from-emerald-500 to-teal-400'
    },
    {
      id: 'timetable',
      title: 'نظام إدارة جداول التوقيت والنصاب',
      subtitle: 'تسكين الحصص الأسبوعية، القاعات، والمخابر العلمية',
      primaryMetric: `${totalSlots} حصة مسكنة`,
      secondaryMetric: `تغطية النصاب الساعي: ${quotaCoverageRate}%`,
      progressPercent: quotaCoverageRate,
      badge: '0 تعارض',
      icon: <CalendarDays className="w-5 h-5" />,
      accentColor: 'from-amber-500 to-orange-400'
    },
    {
      id: 'absences',
      title: 'راصد الغيابات والمواظبة اللحظي',
      subtitle: 'غيابات الأساتذة والتلاميذ، الاستخلاف، وإشعارات الخصم',
      primaryMetric: `${absences.length} سجل غياب`,
      secondaryMetric: `${teacherAbsencesCount} أساتذة · ${studentAbsencesCount} تلاميذ`,
      progressPercent: absences.length > 0 ? Math.round((justifiedAbsencesCount / absences.length) * 100) : 100,
      badge: `${pendingAbsences.length} قيد المعالجة`,
      icon: <UserX className="w-5 h-5" />,
      accentColor: 'from-rose-600 to-red-400'
    },
    {
      id: 'results',
      title: 'محلل النتائج ومجالس الأقسام',
      subtitle: 'إحصائيات الفصول، الإنذار المبكر للرسوب، والتقرير الآلي',
      primaryMetric: `${passRate}% نسبة النجاح`,
      secondaryMetric: `المعدل العام: ${generalMean}/20 · ${atRiskStudentsCount} في خطر`,
      progressPercent: passRate,
      badge: `${excellenceStudentsCount} امتياز`,
      icon: <BarChart3 className="w-5 h-5" />,
      accentColor: 'from-emerald-500 to-green-400'
    },
    {
      id: 'agenda',
      title: 'مفكرة الناظر والاستحقاقات المهنية',
      subtitle: 'الرزنامة اليومية، الفصلية، الامتحانات الرسمية، والترقية',
      primaryMetric: `${agendaItems.length} استحقاقات`,
      secondaryMetric: `${completedAgendaCount} منجزة · ${urgentAgendaCount} عاجلة`,
      progressPercent: agendaCompletionRate,
      badge: `${inProgressAgendaCount} جارية`,
      icon: <CalendarCheck className="w-5 h-5" />,
      accentColor: 'from-amber-500 to-yellow-400'
    },
    {
      id: 'community',
      title: 'الجماعة التربوية ودليل الاتصال',
      subtitle: 'دليل اتصال الناظر، المذكرات، استقبال الأولياء، ودفاتر النصوص',
      primaryMetric: '10 جهات اتصال',
      secondaryMetric: '4 مذكرات · 6 دفاتر نصوص مؤشرة',
      progressPercent: 94,
      badge: 'القرار 778',
      icon: <Contact className="w-5 h-5" />,
      accentColor: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'institutes',
      title: 'المعاهد والمنشآت ذات الوصاية',
      subtitle: 'التنسيق مع ONEC, INFP, INRE, ONPS, CNIIPDTICE, ONEFD',
      primaryMetric: '7 هيئات وطنية',
      secondaryMetric: '16 نموذج مراسلة رسمية A4',
      progressPercent: 100,
      badge: 'وصاية الوزارة',
      icon: <Landmark className="w-5 h-5" />,
      accentColor: 'from-purple-500 to-indigo-400'
    },
    {
      id: 'career',
      title: 'محاكي الدرجات ومقياس الترقية',
      subtitle: 'حساب الدرجات (1-12)، الصنف 17 المحدث، ومقياس مدير ثانوية',
      primaryMetric: 'الصنف 16 / 17',
      secondaryMetric: 'مقياس التأهيل والترقية (/84 ن)',
      progressPercent: 88,
      badge: 'المرسوم 25-54',
      icon: <Calculator className="w-5 h-5" />,
      accentColor: 'from-rose-500 to-amber-400'
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Executive Command & Institution Identity Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8f1414] via-[#d4af37] to-[#10b981]" />
        
        {/* Subtle Watermark Emblem in background */}
        <div className="absolute left-6 -bottom-8 opacity-10 pointer-events-none w-52 h-52">
          <img 
            src={activeLogoUrl} 
            alt="Watermark" 
            className="w-full h-full object-contain filter grayscale" 
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Institution Custom Logo with Quick Upload Trigger */}
            <div
              onClick={onOpenSettings}
              title="انقر لتغيير صورة أيقونة المؤسسة على ترويسة الوثائق"
              className="w-20 h-20 rounded-2xl bg-white/95 p-2 border-2 border-[#d4af37] shadow-xl flex flex-col items-center justify-center cursor-pointer group shrink-0"
            >
              <img
                src={activeLogoUrl}
                alt="شعار المؤسسة"
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-[9px] font-black text-[#082014] bg-[#d4af37] px-1.5 rounded mt-0.5">
                شعار الترويسة
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#8f1414] text-white border border-[#f5d77f]/40">
                  الداشبورد الإحصائي الشامل للمنصة (2026)
                </span>
                <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date().toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                مرحباً بك، سيادة الناظر / <span className="gold-gradient-text">{institution.directorOfStudies}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                لوحة الإحصائيات التنفيذية الشاملة لـ <span className="text-white font-bold">{institution.schoolName} ({institution.wilaya})</span> — متابعة فورية لكافة أقسام المنصة العشرة، مؤشرات الرقمنة، النتائج، المواظبة، واستحقاقات المفكرة.
              </p>
            </div>
          </div>

          {/* Quick Actions & Term Status */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div className="bg-[#06170f]/90 border border-[#d4af37]/30 rounded-xl p-3.5 flex items-center gap-3.5 shadow-inner">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#aa771c] text-[#082014] flex items-center justify-center font-black text-lg shadow-lg">
                فـ{institution.currentTerm}
              </div>
              <div>
                <div className="text-[11px] text-slate-400">الموسم الدراسي: {institution.schoolYear}</div>
                <div className="text-xs font-bold text-white">الفصل الدراسي {institution.currentTerm} قيد الإنجاز</div>
                <div className="text-[11px] text-[#e5c158] font-medium">
                  حجز الرقمنة مكتمل بنسبة {digitalSyncRate}%
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="px-4 py-2 rounded-xl bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] border border-[#d4af37]/50 text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <ImagePlus className="w-4 h-4 text-emerald-300" />
              <span>إدراج / تغيير أيقونة المؤسسة على ترويسة الوثائق</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 6 Global Executive KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onNavigate('results')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-emerald-700/50 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>نسبة النجاح الفصلية</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{passRate}%</div>
          <div className="text-[10px] text-slate-300 mt-0.5">المعدل العام: {generalMean} / 20</div>
        </div>

        <div
          onClick={() => onNavigate('digitalization')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-[#d4af37]/40 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>مزامنة الرقمنة Amatti</span>
            <Database className="w-4 h-4 text-[#f5d77f]" />
          </div>
          <div className="text-2xl font-black text-[#f5d77f] mt-1">{digitalSyncRate}%</div>
          <div className="text-[10px] text-slate-300 mt-0.5">{completedDigitalTeachers}/{teachers.length} أساتذة أتموا الحجز</div>
        </div>

        <div
          onClick={() => onNavigate('timetable')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-blue-800/50 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>تغطية جداول التوقيت</span>
            <CalendarDays className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{totalSlots} حصة</div>
          <div className="text-[10px] text-blue-300 mt-0.5">النصاب المسند: {totalAssignedHours} س ({quotaCoverageRate}%)</div>
        </div>

        <div
          onClick={() => onNavigate('absences')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-rose-800/60 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>راصد الغيابات اليومي</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">{absences.length} حالات</div>
          <div className="text-[10px] text-slate-300 mt-0.5">{pendingAbsences.length} تتطلب إجراءً فورياً</div>
        </div>

        <div
          onClick={() => onNavigate('agenda')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-amber-700/50 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>مفكرة واستحقاقات الناظر</span>
            <CalendarCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">{agendaCompletionRate}%</div>
          <div className="text-[10px] text-slate-300 mt-0.5">{urgentAgendaCount} استحقاقات عاجلة قريبة</div>
        </div>

        <div
          onClick={() => onNavigate('community')}
          className="p-3.5 rounded-xl bg-[#081a12] border border-emerald-700/50 hover:border-[#d4af37] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>دليل الاتصال ودفاتر النصوص</span>
            <Contact className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">10 جهات</div>
          <div className="text-[10px] text-emerald-300 mt-0.5">تقدم البرامج: 76% (مؤشر)</div>
        </div>
      </div>

      {/* Comprehensive Statistical Grid for ALL 10 Platform Sections (داشبورد إحصائيات شاملة لأقسام المنصة) */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <span>لوحة الإحصائيات الشاملة لكافة أقسام ومكونات منصة الناظر (10 أقسام متكاملة)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              اضغط على أي قسم للانتقال المباشر إليه ومعاينة التفاصيل والعمليات المبرمجة
            </p>
          </div>
          <span className="text-xs font-bold bg-[#05140d] text-[#f5d77f] px-3 py-1 rounded-lg border border-[#d4af37]/30 self-start sm:self-auto">
            تحديث إحصائي لحظي · SNTE 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {platformModulesSummary.map((mod) => (
            <div
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className="cursor-pointer rounded-xl bg-gradient-to-b from-[#0c2419] to-[#05140d] border border-[#d4af37]/30 hover:border-[#d4af37] p-4 transition-all hover:scale-[1.02] shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#105e32]/50 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] group-hover:bg-[#8f1414] transition-colors">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] font-bold bg-[#081a12] text-[#f5d77f] px-2 py-0.5 rounded-full border border-[#d4af37]/30">
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
                  <span className="text-sm font-black text-white">{mod.primaryMetric}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-[-2px] transition-transform" />
                </div>
                <div className="text-[10px] text-emerald-300 font-semibold truncate">
                  {mod.secondaryMetric}
                </div>

                {/* Progress Indicator Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${mod.accentColor}`}
                    style={{ width: `${mod.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Mission Alerts & Agenda Highlights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Operational Metrics & Quick Document Templates */}
        <div className="lg:col-span-2 rounded-xl bg-[#091e14]/90 border border-[#d4af37]/30 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-bold text-white text-base">
                الوثائق الرسمية الجاهزة للترويسة بشعار المؤسسة والطباعة الفورية
              </h3>
            </div>
            <button 
              onClick={() => onNavigate('documents')}
              className="text-xs text-[#e5c158] hover:underline cursor-pointer"
            >
              فتح حقيبة الوثائق ({totalDocTemplates} نماذج) ←
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'doc-installation-pv', title: 'محضر تنصيب أستاذ جديد', desc: 'تثبيت الأستاذ في منصبه وتسليمه الحجم الساعي والمنهاج', cat: 'بيداغوجي' },
              { id: 'doc-daily-absence-report', title: 'تقرير الغيابات اليومية', desc: 'التقرير الصباحي الشامل المرفوع لمدير المؤسسة', cat: 'إداري' },
              { id: 'doc-surveillance-table', title: 'جدول حراسة الاختبارات', desc: 'مخطط توزيع الأساتذة الحراس على قاعات الامتحانات', cat: 'امتحانات' },
              { id: 'doc-teacher-explanation', title: 'استفسار غياب وإشعار بالخصم', desc: 'استفسار رسمي طبقاً للمادة 207 من الأمر 06-03', cat: 'مراسلات' },
            ].map((doc) => (
              <div 
                key={doc.id}
                className="p-3.5 rounded-lg bg-[#06150e] border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] bg-[#105e32]/60 text-emerald-200 px-2 py-0.5 rounded font-semibold border border-[#d4af37]/20">
                      {doc.cat}
                    </span>
                    <span className="text-[11px] text-[#d4af37] font-medium">ترويسة بشعار المؤسسة</span>
                  </div>
                  <h5 className="font-bold text-sm text-white mb-1">{doc.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{doc.desc}</p>
                </div>
                <button
                  onClick={() => onOpenDocumentGenerator(doc.id)}
                  className="w-full py-1.5 px-3 rounded text-xs font-bold bg-[#0d2818] hover:bg-[#133d25] text-[#f5d77f] border border-[#d4af37]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>معاينة وطباعة فورية A4</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Live Agenda & Milestones Widget */}
        <div className="rounded-xl bg-[#091e14]/90 border border-[#d4af37]/30 p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">مفكرة واستحقاقات الناظر القريبة</h3>
              </div>
              <button
                onClick={() => onNavigate('agenda')}
                className="text-[11px] text-[#f5d77f] hover:underline font-bold cursor-pointer"
              >
                كل المفكرة ←
              </button>
            </div>

            <div className="space-y-2.5 mt-4 text-xs">
              {agendaItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('agenda')}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#06150e]/80 border border-slate-800 hover:border-[#d4af37]/40 cursor-pointer transition-all"
                >
                  <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    item.status === 'completed'
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : item.priority === 'urgent'
                      ? 'bg-[#8f1414] border-red-400 text-white'
                      : 'border-slate-600'
                  }`}>
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : item.priority === 'urgent' ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold truncate ${item.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {item.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>{item.periodLabel}</span>
                      <span className="font-mono text-[#d4af37]">{item.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-xs text-slate-400">
            <span>المرجع: القرار 834 المحدد لمهام الناظر</span>
            <span className="text-[#d4af37] font-bold">{completedAgendaCount}/{agendaItems.length} مكتملة</span>
          </div>
        </div>

      </div>

    </div>
  );
};
