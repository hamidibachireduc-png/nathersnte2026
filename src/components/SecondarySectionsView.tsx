import React, { useState } from 'react';
import {
  Server,
  RefreshCw,
  CheckCircle2,
  Send,
  BookOpen,
  Printer,
  Building2,
  Award,
  Users,
  MessageSquarePlus,
  ThumbsUp,
  ExternalLink,
} from 'lucide-react';
import {
  InstitutionInfo,
  TeacherRecord,
  StudentRecord,
  AbsenceRecord,
} from '../types';
import { STAGE_METADATA } from '../data/initialData';

// ============================================================================
// 1. الربط مع الرقمنة (Amatti · Ostad · Awlyaa)
// ============================================================================
export const DigitalizationView: React.FC<{
  institution: InstitutionInfo;
  teachers: TeacherRecord[];
  onUpdateTeachers: (teachers: TeacherRecord[]) => void;
  students: StudentRecord[];
  absences: AbsenceRecord[];
}> = ({ institution, teachers, onUpdateTeachers, students, absences }) => {
  const activeStage = institution.stage;
  const stageMeta = STAGE_METADATA[activeStage];

  const stageTeachers = teachers.filter((t) => t.stage === activeStage);
  const stageStudents = students.filter((s) => s.stage === activeStage);
  const stageAbsences = absences.filter((a) => a.stage === activeStage);

  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const syncedCount = stageTeachers.filter((t) => t.digitalSyncCompleted).length;
  const syncPct =
    stageTeachers.length > 0 ? Math.round((syncedCount / stageTeachers.length) * 100) : 100;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onUpdateTeachers(
        teachers.map((t) =>
          t.stage === activeStage ? { ...t, digitalSyncCompleted: true } : t
        )
      );
      setIsSyncing(false);
      showToast(
        `تمت المزامنة الشاملة لنقاط التلاميذ والغيابات لـ ${stageMeta.name} مع الأرضية الرقمية بنجاح!`
      );
    }, 600);
  };

  const handleToggleTeacherSync = (id: string, name: string, current: boolean) => {
    onUpdateTeachers(
      teachers.map((t) => (t.id === id ? { ...t, digitalSyncCompleted: !current } : t))
    );
    showToast(
      !current
        ? `تم تأشير اكتمال حجز النقاط للأستاذ(ة) ${name} على أرضية الرقمنة`
        : `تم فتح الحجز مجدداً للأستاذ(ة) ${name}`
    );
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#105e32] text-white border-2 border-[#d4af37] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#f5d77f]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded bg-[#105e32] text-emerald-200 font-bold border border-[#d4af37]/30">
              متصل بـ amatti.education.gov.dz ({stageMeta.shortName})
            </span>
            <span className="text-[#d4af37] font-semibold">المنشور الوزاري 112/2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-[#d4af37]" />
            <span>مركز الربط والمزامنة مع الرقمنة التربوية الشاملة ({stageMeta.name})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            إشراف {stageMeta.natherTitle} على تدفق المعطيات البيداغوجية نحو الأرضية الرقمية للوزارة: مراقبة حجز النقاط (سلم /{stageMeta.maxGradeScale})، مزامنة غيابات التلاميذ مع فضاء الأولياء، وتدقيق قوائم {stageMeta.nationalExamName}.
          </p>
        </div>

        <button
          onClick={handleGlobalSync}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'جاري المزامنة الرقمية...' : 'مزامنة شاملة مع الأرضية'}</span>
        </button>
      </div>

      {/* البوابات الرقمية الثلاث */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#081a12] border border-[#d4af37]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#f5d77f]">
              1. الأرضية الرقمية للتسيير (Amatti)
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold tabular-nums">
              {syncPct}% مكتمل
            </span>
          </div>
          <p className="text-xs text-slate-300">
            إسناد الأفواج ({stageMeta.shortName})، مراقبة صب النقاط، واستخراج كشوف المعدلات ومحاضر مجالس الأقسام.
          </p>
          <a
            href="https://amatti.education.gov.dz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#d4af37] hover:underline pt-1"
          >
            <span>فتح فضاء المؤسسة وإشراف الناظر</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-4 rounded-xl bg-[#081a12] border border-emerald-700/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300">
              2. فضاء الأساتذة الرقمي (Ostad)
            </span>
            <span className="text-xs font-mono text-white font-bold tabular-nums">
              {syncedCount}/{stageTeachers.length} أساتذة
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {activeStage === 'primary'
              ? 'حجز علامات التقويم المستمر والاختبارات الفصلية (/10) وشبكة تقييم المكتسبات.'
              : 'حجز علامات التقويم المستمر، الفروض المحروسة، والاختبارات الفصلية (/20) والتقديرات.'}
          </p>
          <span className="inline-block text-[11px] text-slate-400 pt-1">
            الفصل الدراسي {institution.currentTerm} — {institution.schoolYear}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#081a12] border border-cyan-700/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300">
              3. فضاء أولياء التلاميذ (Awlyaa)
            </span>
            <span className="text-xs font-mono text-cyan-300 font-bold tabular-nums">
              {stageStudents.length} تلميذ مسجل
            </span>
          </div>
          <p className="text-xs text-slate-300">
            إشعار آني لأولياء التلاميذ بالغيابات المسجلة ({stageAbsences.filter((a) => a.type === 'student').length} إشعار) وعرض كشوف النقاط الفصلية.
          </p>
          <a
            href="https://awlyaa.education.gov.dz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 hover:underline pt-1"
          >
            <span>معاينة بوابة فضاء الأولياء</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* جدول مراقبة صب النقاط للأساتذة */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#06150e] border-b border-[#d4af37]/20 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-white">
            مراقبة حجز النقاط والتقديرات على الأرضية الرقمية حسب الأساتذة والأفواج ({stageMeta.shortName})
          </h3>
          <span className="text-xs text-[#f5d77f] font-bold tabular-nums">
            نسبة الإنجاز: {syncPct}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                <th className="py-3 px-4 font-bold">الأستاذ(ة)</th>
                <th className="py-3 px-3 font-bold">المادة المسندة</th>
                <th className="py-3 px-3 font-bold">الأفواج التربوية</th>
                <th className="py-3 px-3 font-bold text-center">النصاب الأسبوعي</th>
                <th className="py-3 px-3 font-bold text-center">حالة التدقيق الرقمي</th>
                <th className="py-3 px-4 font-bold text-center">إجراء {stageMeta.natherTitle}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {stageTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-[#0c261a]/60">
                  <td className="py-3 px-4 font-bold text-white">{t.name}</td>
                  <td className="py-3 px-3 text-[#d4af37] font-semibold">{t.subject}</td>
                  <td className="py-3 px-3 text-slate-300">{t.assignedClasses.join(' · ')}</td>
                  <td className="py-3 px-3 text-center font-mono tabular-nums">
                    {t.assignedHours} س
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-bold ${
                        t.digitalSyncCompleted ? 'text-emerald-400' : 'text-amber-300'
                      }`}
                    >
                      {t.digitalSyncCompleted ? 'مكتمل ومؤشر رقمياً' : 'قيد استكمال الحجز'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          handleToggleTeacherSync(t.id, t.name, t.digitalSyncCompleted)
                        }
                        className="px-2.5 py-1 rounded bg-[#105e32] hover:bg-[#14753e] text-[#f5d77f] border border-[#d4af37]/40 font-bold cursor-pointer"
                      >
                        {t.digitalSyncCompleted ? 'إلغاء التأشير' : 'تأشير القائمة'}
                      </button>
                      {!t.digitalSyncCompleted && (
                        <button
                          onClick={() =>
                            showToast(`تم إرسال تذكير رقمي للأستاذ ${t.name} لاستكمال حجز النقاط`)
                          }
                          className="px-2.5 py-1 rounded bg-[#8f1414] text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>تذكير بالحجز</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. الجماعة التربوية، دليل الاتصال، ومراقبة دفاتر النصوص / الكراسات اليومية
// ============================================================================
export const CommunityView: React.FC<{
  institution: InstitutionInfo;
  teachers: TeacherRecord[];
}> = ({ institution, teachers }) => {
  const activeStage = institution.stage;
  const stageMeta = STAGE_METADATA[activeStage];
  const stageTeachers = teachers.filter((t) => t.stage === activeStage);

  const [logStatus, setLogStatus] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const staffContacts =
    activeStage === 'primary'
      ? [
          {
            name: 'السيد مدير المدرسة الابتدائية',
            role: 'المدير / المسؤول الأول عن المدرسة',
            office: 'مكتب الإدارة المركزية',
            hours: 'يومياً (08:00 - 16:00)',
            coord: 'الإشراف العام، المصادقة على الجداول والمحاضر، ورئاسة مجلس الأساتذة.',
          },
          {
            name: institution.directorOfStudies,
            role: `${stageMeta.natherTitle} (التنسيق البيداغوجي)`,
            office: 'مكتب الناظر / مساعد المدير',
            hours: 'يومياً (08:00 - 16:00)',
            coord: 'متابعة التدرجات، الكراس اليومي، الحساب التلقائي للمعدلات (/10)، والمطعم المدرسي.',
          },
          {
            name: 'مسير المطعم المدرسي',
            role: 'الإطعام المدرسي والتموين',
            office: 'جناح المطعم المدرسي',
            hours: 'يومياً (08:00 - 14:00)',
            coord: 'استلام الإحصاء اليومي للوجبات من الناظر بناءً على الحضور الصباحي.',
          },
          {
            name: 'طبيب وحدة الكشف والمتابعة (UDS)',
            role: 'الصحة المدرسية والوقاية',
            office: 'وحدة الكشف والمتابعة المقاطعة',
            hours: 'الأحد والثلاثاء (08:30 - 14:30)',
            coord: 'الفحوص الدورية لتلاميذ التحضيري و1 ابتدائي والتكفل بالحالات الصحية.',
          },
          {
            name: 'مشرف التربية بالابتدائي',
            role: 'تأطير التلاميذ في الساحة والمطعم',
            office: 'مكتب الإشراف التربوي',
            hours: 'يومياً (07:45 - 15:30)',
            coord: 'مرافقة التلاميذ أثناء الدخول والخروج وفي قاعة الإطعام المدرسي.',
          },
          {
            name: 'رئيس جمعية أولياء التلاميذ',
            role: 'الشريك الاجتماعي والتربوي',
            office: 'قاعة الاجتماعات',
            hours: 'كل خميس (10:00 - 12:00)',
            coord: 'مرافقة التلاميذ وتنسيق الأنشطة الثقافية وحفل تقييم المكتسبات.',
          },
        ]
      : [
          {
            name: `السيد مدير ${stageMeta.institutionLabel}`,
            role: 'المدير / المسؤول الأول عن المؤسسة',
            office: 'جناح الإدارة المركزية',
            hours: 'يومياً (08:00 - 16:30)',
            coord: 'الإشراف العام، المصادقة على الجداول والمحاضر، ورئاسة المجالس.',
          },
          {
            name: institution.directorOfStudies,
            role: `${stageMeta.natherTitle} (النيابة البيداغوجية)`,
            office: 'مكتب الناظر والتنسيق البيداغوجي',
            hours: 'يومياً (08:00 - 16:30)',
            coord: 'إعداد الجداول، الحساب التلقائي للمعدلات (/20)، مراقبة دفاتر النصوص، ومتابعة الغيابات.',
          },
          {
            name: 'السيد مستشار التربية',
            role: 'الاستشارة التربوية والانضباط',
            office: 'مكتب الاستشارة التربوية',
            hours: 'يومياً (07:45 - 16:30)',
            coord: 'مراقبة حركة التلاميذ، نداء الحصص، واستقبال الأولياء لتبرير الغيابات.',
          },
          {
            name: 'السيد(ة) مستشار(ة) التوجيه والإرشاد المدرسي',
            role: 'التوجيه المدرسي والمرافقة النفسية',
            office: 'مكتب التوجيه والإرشاد',
            hours: 'الأحد، الثلاثاء، الخميس (08:30 - 15:30)',
            coord: `تحليل نتائج الفصول، توجيه التلاميذ، ومرافقة المترشحين لـ ${stageMeta.nationalExamName}.`,
          },
          {
            name: 'السيد المقتصد / المسير المالي',
            role: 'المصالح الاقتصادية والمالية',
            office: 'جناح المصالح الاقتصادية',
            hours: 'يومياً (08:00 - 16:00)',
            coord: 'توفير الوسائل البيداغوجية، الطبع، تجهيز المخابر، والكتاب المدرسي.',
          },
          {
            name: 'رئيس جمعية أولياء التلاميذ',
            role: 'الشريك الاجتماعي والتربوي',
            office: 'قاعة الاجتماعات / التنسيق',
            hours: 'كل خميس (10:00 - 12:00)',
            coord: 'التنسيق في مرافقة التلاميذ، محاربة التسرب المدرسي، وتحضير الامتحانات.',
          },
        ];

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#105e32] text-white border-2 border-[#d4af37] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#f5d77f]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white text-xs font-bold">
          القرار الوزاري 778 المحدث 2026 · الجماعة التربوية ({stageMeta.name})
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1.5">
          <BookOpen className="w-6 h-6 text-[#d4af37]" />
          <span>
            فضاء الجماعة التربوية، دليل الاتصال، ومراقبة{' '}
            {activeStage === 'primary' ? 'الكراس اليومي والتدرجات' : 'دفاتر النصوص والتدرجات'}
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
          تنسيق عمل {stageMeta.natherTitle} مع الطاقم الإداري والتربوي وأولياء التلاميذ، مرفق بسجل المراقبة الدورية.
        </p>
      </div>

      {/* دليل الاتصال */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffContacts.map((c, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#081a12] border border-[#d4af37]/30 space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#f5d77f]">{c.role}</div>
              <h4 className="text-sm font-black text-white">{c.name}</h4>
              <div className="text-[11px] text-emerald-300">
                {c.office} · {c.hours}
              </div>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">{c.coord}</p>
            </div>
          </div>
        ))}
      </div>

      {/* سجل الرقابة البيداغوجية لدفاتر النصوص / الكراسات اليومية */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#06150e] border-b border-[#d4af37]/20 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              سجل الرقابة البيداغوجية لـ{' '}
              {activeStage === 'primary' ? 'الكراسات اليومية' : 'دفاتر النصوص'} وتنفيذ التدرجات السنوية ({stageMeta.shortName})
            </h3>
            <p className="text-[11px] text-slate-400">
              تأشيرة {stageMeta.natherTitle} الدورية على الوثائق البيداغوجية للأساتذة
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة سجل المراقبة</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                <th className="py-3 px-4 font-bold">الأستاذ(ة) والمادة</th>
                <th className="py-3 px-3 font-bold">الأفواج المراقبة</th>
                <th className="py-3 px-3 font-bold">وضعية التدوين والتدرج</th>
                <th className="py-3 px-4 font-bold text-center">تأشيرة {stageMeta.natherTitle}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {stageTeachers.map((t) => {
                const status = logStatus[t.id] || 'مطابق ومؤشر بانتظام';
                return (
                  <tr key={t.id} className="hover:bg-[#0c261a]/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-[11px] text-[#d4af37]">{t.subject}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{t.assignedClasses.join(' ، ')}</td>
                    <td className="py-3 px-3">
                      <select
                        value={status}
                        onChange={(e) =>
                          setLogStatus((prev) => ({ ...prev, [t.id]: e.target.value }))
                        }
                        className="px-2.5 py-1.5 rounded bg-[#05140d] border border-[#d4af37]/40 text-white text-xs"
                      >
                        <option value="مطابق ومؤشر بانتظام">مطابق ومؤشر بانتظام</option>
                        <option value="تأخر طفيف في تدوين حصة الأعمال التطبيقية">
                          تأخر طفيف في تدوين حصة الأعمال التطبيقية
                        </option>
                        <option value="نقص في تدوين تصحيح التقويم المرحلي">
                          نقص في تدوين تصحيح التقويم المرحلي
                        </option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setToast(
                            `تم تسجيل التأشيرة البيداغوجية لـ ${stageMeta.natherTitle} للأستاذ ${t.name}`
                          );
                          setTimeout(() => setToast(null), 2500);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#105e32] hover:bg-[#14753e] text-[#f5d77f] border border-[#d4af37]/40 font-bold cursor-pointer"
                      >
                        تسجيل التأشيرة البيداغوجية
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. المعاهد والهيئات الوصية (ONEC · INFP · INRE · ONPS)
// ============================================================================
export const InstitutesView: React.FC<{ institution: InstitutionInfo }> = ({ institution }) => {
  const stageMeta = STAGE_METADATA[institution.stage];

  const institutes = [
    {
      code: 'ONEC',
      name: 'الديوان الوطني للامتحانات والمسابقات',
      role: `تنظيم ${stageMeta.nationalExamName} والمسابقات المهنية`,
      tasks: `تأكيد قوائم المترشحين في ${stageMeta.name}، حجز نقاط التربية البدنية والكفاءات، وتأطير مراكز الإجراء.`,
      period: 'أكتوبر - جوان',
    },
    {
      code: 'INFP',
      name: 'المعهد الوطني لتكوين موظفي قطاع التربية الوطنية',
      role: `التكوين المتخصص للنظار ومديري مؤسسات ${stageMeta.name} والأساتذة المتربصين`,
      tasks: `متابعة الأساتذة المتربصين بـ ${stageMeta.institutionLabel}، وتأطير أيام التكوين المستمر والندوات الداخلية.`,
      period: 'طوال السنة الدراسية',
    },
    {
      code: 'ONPS',
      name: 'الديوان الوطني للمطبوعات المدرسية',
      role: `توفير وتوزيع الكتاب المدرسي لمرحلة ${stageMeta.name}`,
      tasks: `ضبط تعداد التلاميذ حسب المستويات في ${stageMeta.name} وتحديد الحاجيات البيداغوجية من الكتب والأدلة.`,
      period: 'سبتمبر و جوان',
    },
    {
      code: 'INRE',
      name: 'المعهد الوطني للبحث في التربية',
      role: `تطوير المناهج البيداغوجية والتقويم المرحلي لـ ${stageMeta.name}`,
      tasks: 'تحليل نتائج التقويمات الفصلية ومرافقة تجريب الوسائل التعليمية الحديثة.',
      period: 'دوري فصلي',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white text-xs font-bold">
          التنسيق المؤسساتي مع الهيئات الوطنية الوصية ({stageMeta.name})
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1.5">
          <Building2 className="w-6 h-6 text-[#d4af37]" />
          <span>دليل المعاهد والهيئات الوصية المرتبطة بمهام {stageMeta.natherTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
          جدول العمليات البيداغوجية والإدارية التي يشرف عليها {stageMeta.natherTitle} بالتنسيق مع هيئات وزارة التربية الوطنية ({institution.schoolName}).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {institutes.map((inst) => (
          <div
            key={inst.code}
            className="p-5 rounded-2xl bg-[#081a12] border border-[#d4af37]/30 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[#105e32] text-[#f5d77f] font-mono font-bold text-xs border border-[#d4af37]/40">
                {inst.code}
              </span>
              <span className="text-xs text-emerald-300 font-semibold">{inst.period}</span>
            </div>
            <h3 className="text-base font-black text-white">{inst.name}</h3>
            <div className="text-xs font-bold text-[#d4af37]">{inst.role}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{inst.tasks}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 4. المحاكي الشامل للدرجات، الأقدمية، الخبرة، المردودية، المنح، والتقاعد (تحيين قوانين 2026)
// ============================================================================
type SimulatorTab =
  | 'echelons'
  | 'seniority'
  | 'experience'
  | 'performance'
  | 'allowances'
  | 'retirement'
  | 'promotion';

export const CareerSimulatorView: React.FC<{ institution: InstitutionInfo }> = ({
  institution,
}) => {
  const activeStage = institution.stage;
  const stageMeta = STAGE_METADATA[activeStage];

  const [activeTab, setActiveTab] = useState<SimulatorTab>('echelons');

  // 1. معطيات الدرجات والصنف الوظيفي (المرسوم 25-54 + الشبكة الاستدلالية 2026)
  const [categoryClass, setCategoryClass] = useState<'14' | '15' | '16' | '17' | 'hc1'>(
    activeStage === 'primary' ? '15' : activeStage === 'middle' ? '16' : '17'
  );
  const [currentEchelon, setCurrentEchelon] = useState<number>(6);
  const [pointValue] = useState<number>(45);
  const [paceMode, setPaceMode] = useState<'min' | 'med' | 'max'>('min');

  // 2. معطيات حساب الأقدمية العامة وفي الرتبة
  const [firstHireDate, setFirstHireDate] = useState<string>('2012-09-04');
  const [rankAppointmentDate, setRankAppointmentDate] = useState<string>('2021-09-01');
  const [lastEchelonDate, setLastEchelonDate] = useState<string>('2024-01-01');
  const [zoneBonusMonthsPerYear, setZoneBonusMonthsPerYear] = useState<number>(0); // 0 شمال، 2 هضاب، 4 جنوب، 6 جنوب كبير
  const [boughtBackYears, setBoughtBackYears] = useState<number>(0); // خدمة وطنية / عقود ما قبل التشغيل

  // 3. معطيات تعويض الخبرة البيداغوجية والمهنية (IEEP / IEP)
  const [iepRatePerYear, setIepRatePerYear] = useState<number>(4); // 4% عن كل درجة/فترة خبرة
  const [extraPedagogicalYears, setExtraPedagogicalYears] = useState<number>(14);

  // 4. معطيات منحة الأداء التربوي والإداري (المردودية)
  const [maxYieldRate, setMaxYieldRate] = useState<30 | 40>(40);
  const [yieldScoreOutOf40, setYieldScoreOutOf40] = useState<number>(39);
  const [unjustifiedAbsenceDays, setUnjustifiedAbsenceDays] = useState<number>(0);

  // 5. معطيات مختلف المنح والعلاوات (النظام التعويضي 2026)
  const [qualificationRate, setQualificationRate] = useState<number>(45); // علاوة التأهيل 45% - 50%
  const [pedagogicalSupportRate, setPedagogicalSupportRate] = useState<number>(15); // الدعم المدرسي 15%
  const [adminResponsibilityRate, setAdminResponsibilityRate] = useState<number>(25); // تعويض التأطير والإدارة البيداغوجية
  const [documentationAllowance, setDocumentationAllowance] = useState<number>(4500); // تعويض التوثيق التربوي
  const [housingAllowance, setHousingAllowance] = useState<number>(4000); // منحة السكن/الاستخلاف عن السكن
  const [zoneAllowanceAmount, setZoneAllowanceAmount] = useState<number>(0); // منحة المنطقة الجغرافية
  const [childrenCount, setChildrenCount] = useState<number>(3);
  const [singleIncomeSpouse, setSingleIncomeSpouse] = useState<boolean>(true);
  const [mutualInsuranceSubscribed, setMutualInsuranceSubscribed] = useState<boolean>(true);

  // 6. معطيات حساب التقاعد (CNR 2026)
  const [employeeAge, setEmployeeAge] = useState<number>(52);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [childrenForMaternityReduction, setChildrenForMaternityReduction] = useState<number>(0);
  const [validatedServiceYears, setValidatedServiceYears] = useState<number>(28);
  const [dependentSpouseInPension, setDependentSpouseInPension] = useState<boolean>(true);

  // 7. معطيات مقياس الترقية والتأهيل
  const [adminScore, setAdminScore] = useState<number>(19.5);
  const [inspectionScore, setInspectionScore] = useState<number>(18.5);
  const [extraDegreePoints, setExtraDegreePoints] = useState<number>(3);
  const [trainingCyclesPoints, setTrainingCyclesPoints] = useState<number>(4);

  // --- الحسابات الرقمية المرجعية ---
  const indexMap: Record<string, { base: number; label: string }> = {
    '14': { base: 821, label: 'الصنف 14 (مساعد مدير مدرسة ابتدائية / مستشار تربية)' },
    '15': { base: 866, label: 'الصنف 15 (ناظر ابتدائية / ناظر متوسطة قاعدي)' },
    '16': { base: 913, label: 'الصنف 16 (ناظر متوسطة محين / ناظر ثانوية)' },
    '17': { base: 962, label: 'الصنف 17 (ناظر ثانوية تصنيف محين / مدير متوسطة)' },
    hc1: { base: 1055, label: 'خارج الصنف ق1 (مدير ثانوية / مفتش التربية الوطنية)' },
  };

  const baseIndex = indexMap[categoryClass]?.base || 913;
  const echelonPoints = Math.round(currentEchelon * (baseIndex * 0.05));
  const totalIndex = baseIndex + echelonPoints;

  const baseSalary = baseIndex * pointValue; // الأجر القاعدي
  const echelonAllowance = echelonPoints * pointValue; // تعويض الدرجة الاستدلالية
  const mainSalary = baseSalary + echelonAllowance; // الأجر الرئيسي (Salaire Principal)

  // حساب الأقدمية بالتفصيل حتى 2026
  const calcYearsMonths = (dateStr: string) => {
    const start = new Date(dateStr);
    const ref = new Date('2026-09-01');
    if (isNaN(start.getTime())) return { years: 0, months: 0, totalYearsFloat: 0 };
    let totalMonths =
      (ref.getFullYear() - start.getFullYear()) * 12 + (ref.getMonth() - start.getMonth());
    if (totalMonths < 0) totalMonths = 0;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return { years, months, totalYearsFloat: +(totalMonths / 12).toFixed(2) };
  };

  const generalSen = calcYearsMonths(firstHireDate);
  const rankSen = calcYearsMonths(rankAppointmentDate);
  const sinceLastEchelon = calcYearsMonths(lastEchelonDate);

  const zoneBonusTotalMonths = Math.round(generalSen.years * zoneBonusMonthsPerYear);
  const zoneBonusYears = +(zoneBonusTotalMonths / 12).toFixed(1);
  const effectiveCareerYears = +(
    generalSen.totalYearsFloat +
    zoneBonusYears +
    boughtBackYears
  ).toFixed(1);

  const requiredMonthsForNextEchelon =
    paceMode === 'min' ? 30 : paceMode === 'med' ? 36 : 42;
  const elapsedMonthsSinceEchelon = sinceLastEchelon.years * 12 + sinceLastEchelon.months;
  const remainingMonthsForNextEchelon = Math.max(
    0,
    requiredMonthsForNextEchelon - elapsedMonthsSinceEchelon
  );

  // حساب تعويض الخبرة البيداغوجية (IEEP)
  const iepPercentage = Math.min(60, Math.round(currentEchelon * iepRatePerYear));
  const iepMonthlyAmount = Math.round((baseSalary * iepPercentage) / 100);
  const totalExperiencePackage = echelonAllowance + iepMonthlyAmount;

  // حساب مختلف العلاوات والمنح (النظام التعويضي 2026)
  const qualificationAmount = Math.round((mainSalary * qualificationRate) / 100);
  const supportAmount = Math.round((mainSalary * pedagogicalSupportRate) / 100);
  const responsibilityAmount = Math.round((mainSalary * adminResponsibilityRate) / 100);

  const subjectToCnasGross =
    mainSalary +
    iepMonthlyAmount +
    qualificationAmount +
    supportAmount +
    responsibilityAmount +
    documentationAllowance +
    zoneAllowanceAmount;

  const cnasDeduction = Math.round(subjectToCnasGross * 0.09); // اقتطاع الضمان الاجتماعي 9%
  const taxableIncome = subjectToCnasGross - cnasDeduction;

  // حساب الضريبة على الدخل الإجمالي IRG وفق السلم التصاعدي الجزائري
  const calculateIRG = (taxable: number) => {
    if (taxable <= 30000) return 0;
    let tax = 0;
    if (taxable > 30000) {
      const slice1 = Math.min(taxable, 35000) - 30000;
      tax += slice1 * 0.23;
    }
    if (taxable > 35000) {
      const slice2 = Math.min(taxable, 40000) - 35000;
      tax += slice2 * 0.27;
    }
    if (taxable > 40000) {
      const slice3 = Math.min(taxable, 80000) - 40000;
      tax += slice3 * 0.3;
    }
    if (taxable > 80000) {
      const slice4 = Math.min(taxable, 160000) - 80000;
      tax += slice4 * 0.33;
    }
    if (taxable > 160000) {
      tax += (taxable - 160000) * 0.35;
    }
    // تخفيض 40% (بين 1000 و 1500 دج)
    const abatement = Math.min(1500, Math.max(1000, tax * 0.4));
    return Math.max(0, Math.round(tax - abatement));
  };

  const irgDeduction = calculateIRG(taxableIncome);
  const mutualDeduction = mutualInsuranceSubscribed
    ? Math.round(subjectToCnasGross * 0.01)
    : 0;

  const familyAllowance =
    childrenCount * 300 + (singleIncomeSpouse ? 800 : 0);
  const totalGrossSalary =
    subjectToCnasGross + housingAllowance + familyAllowance;
  const estimatedNetSalary =
    subjectToCnasGross -
    cnasDeduction -
    irgDeduction -
    mutualDeduction +
    housingAllowance +
    familyAllowance;

  // حساب منحة الأداء التربوي والإداري (المردودية الثلاثية)
  const effectiveYieldPercentage = Math.max(
    0,
    (yieldScoreOutOf40 / 40) * maxYieldRate - unjustifiedAbsenceDays * 5
  );
  const quarterlyYieldGross = Math.round(
    mainSalary * 3 * (effectiveYieldPercentage / 100)
  );
  const quarterlyYieldCnas = Math.round(quarterlyYieldGross * 0.09);
  const quarterlyYieldIrg = Math.round(
    (quarterlyYieldGross - quarterlyYieldCnas) * 0.1
  ); // ضريبة المردودية 10%
  const quarterlyYieldNet =
    quarterlyYieldGross - quarterlyYieldCnas - quarterlyYieldIrg;
  const monthlyYieldNetEquivalent = Math.round(quarterlyYieldNet / 3);

  // حساب التقاعد والمعاش (CNR 2026)
  const totalValidatedYearsWithBonuses = Math.min(
    32,
    validatedServiceYears + zoneBonusYears + boughtBackYears
  );
  const pensionRate = Math.min(80, +(totalValidatedYearsWithBonuses * 2.5).toFixed(2));
  const referenceFiveYearSalary = subjectToCnasGross - cnasDeduction;
  const grossPension = Math.round((referenceFiveYearSalary * pensionRate) / 100);
  const pensionCnasSolidarity = Math.round(grossPension * 0.02);
  const pensionIrg =
    grossPension <= 30000 ? 0 : Math.round((grossPension - 30000) * 0.08);
  const spouseBonus = dependentSpouseInPension ? 2500 : 0;
  const netRetirementPension =
    grossPension - pensionCnasSolidarity - pensionIrg + spouseBonus;

  const legalRetirementAge =
    gender === 'female'
      ? Math.max(50, 55 - Math.min(3, childrenForMaternityReduction) - 3) // تخفيض القانون الأساسي للتربية 25-54
      : 57; // تخفيض 3 سنوات عن 60 سنة لأسلاك التربية في القانون الأساسي 25-54

  // حساب مقياس الترقية
  const promotionScore =
    Math.min(20, rankSen.years * 2) +
    Math.min(10, generalSen.years * 0.5) +
    adminScore +
    inspectionScore +
    extraDegreePoints +
    trainingCyclesPoints;

  const targetPromotionRank =
    activeStage === 'primary'
      ? 'مدير مدرسة ابتدائية / مفتش التعليم الابتدائي'
      : activeStage === 'middle'
      ? 'مدير متوسطة / مفتش إدارة المتوسطات'
      : 'مدير ثانوية / مفتش إدارة الثانويات';

  const simulatorTabs: { id: SimulatorTab; label: string; badge: string }[] = [
    { id: 'echelons', label: '1. حساب الدرجات الـ 12', badge: `الدرجة ${currentEchelon}` },
    {
      id: 'seniority',
      label: '2. حساب الأقدمية (العامة والرتبة)',
      badge: `${generalSen.years} س`,
    },
    {
      id: 'experience',
      label: '3. تعويض الخبرة (IEEP)',
      badge: `${iepPercentage}%`,
    },
    {
      id: 'performance',
      label: '4. منحة الأداء والمردودية',
      badge: `${effectiveYieldPercentage.toFixed(0)}%`,
    },
    {
      id: 'allowances',
      label: '5. مختلف المنح وكشف الراتب',
      badge: 'تفصيلي 2026',
    },
    {
      id: 'retirement',
      label: '6. حساب التقاعد (CNR)',
      badge: `${pensionRate}%`,
    },
    {
      id: 'promotion',
      label: '7. مقياس الترقية للرتب العليا',
      badge: `${promotionScore.toFixed(1)} ن`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* الترويسة الرئيسية للمحاكي الشامل */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white font-bold">
              المحاكي الإداري والمالي الشامل — تحيين القوانين الجزائرية 2026
            </span>
            <span className="text-[#d4af37] font-semibold">
              المرسوم 25-54 · المرسوم 07-304 · النظام التعويضي · قانون التقاعد CNR
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-[#d4af37]" />
            <span>
              منظومة حساب الدرجات، الأقدمية، تعويض الخبرة، المردودية، المنح، والتقاعد ({stageMeta.name})
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            محرك حساب دقيق ومفصل لـ {stageMeta.natherTitle} وكافة رتب التأطير والتعليم وفق الشبكة الاستدلالية والنظام التعويضي المحين لسنة 2026.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة البطاقة المالية والمهنية (A4)</span>
        </button>
      </div>

      {/* ملخص المؤشرات المالية والمهنية الفورية */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#081a12] border border-[#d4af37]/40">
          <div className="text-[11px] text-slate-400">مجموع النقاط الاستدلالية</div>
          <div className="text-lg font-black text-[#f5d77f] font-mono mt-0.5 tabular-nums">
            {totalIndex} نقطة
          </div>
          <div className="text-[10px] text-slate-400 tabular-nums">
            قاعدي {baseIndex} + د{currentEchelon} ({echelonPoints})
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-emerald-700/50">
          <div className="text-[11px] text-slate-400">الأجر الصافي الشهري</div>
          <div className="text-lg font-black text-emerald-400 font-mono mt-0.5 tabular-nums">
            {estimatedNetSalary.toLocaleString('ar-DZ')} دج
          </div>
          <div className="text-[10px] text-emerald-300 tabular-nums">
            الخام: {totalGrossSalary.toLocaleString('ar-DZ')} دج
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-amber-700/50">
          <div className="text-[11px] text-slate-400">منحة الأداء الصافية (ثلاثي)</div>
          <div className="text-lg font-black text-amber-300 font-mono mt-0.5 tabular-nums">
            {quarterlyYieldNet.toLocaleString('ar-DZ')} دج
          </div>
          <div className="text-[10px] text-slate-300 tabular-nums">
            بمعدل {monthlyYieldNetEquivalent.toLocaleString('ar-DZ')} دج/شهر
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-cyan-700/50">
          <div className="text-[11px] text-slate-400">الأقدمية العامة والرتبة</div>
          <div className="text-lg font-black text-cyan-300 font-mono mt-0.5 tabular-nums">
            {generalSen.years} س و {generalSen.months} ش
          </div>
          <div className="text-[10px] text-slate-300 tabular-nums">
            في الرتبة: {rankSen.years} س و {rankSen.months} ش
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-purple-700/50">
          <div className="text-[11px] text-slate-400">حزمة تعويض الخبرة والدرجة</div>
          <div className="text-lg font-black text-purple-300 font-mono mt-0.5 tabular-nums">
            {totalExperiencePackage.toLocaleString('ar-DZ')} دج
          </div>
          <div className="text-[10px] text-slate-300 tabular-nums">
            نسبة الخبرة: {iepPercentage}%
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-rose-700/50">
          <div className="text-[11px] text-slate-400">معاش التقاعد الصافي (CNR)</div>
          <div className="text-lg font-black text-rose-300 font-mono mt-0.5 tabular-nums">
            {netRetirementPension.toLocaleString('ar-DZ')} دج
          </div>
          <div className="text-[10px] text-slate-300 tabular-nums">
            نسبة التصفية: {pensionRate}% ({totalValidatedYearsWithBonuses} س)
          </div>
        </div>
      </div>

      {/* شريط التبويبات للأقسام الـ 7 للمحاكي */}
      <div className="p-2.5 rounded-xl bg-[#091e14] border border-[#d4af37]/30 flex flex-wrap items-center gap-1.5 no-print">
        {simulatorTabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] ${
                isSelected
                  ? 'bg-gradient-to-r from-[#105e32] to-[#0b3f22] text-[#f5d77f] border border-[#d4af37] shadow-md'
                  : 'bg-[#06150e] text-slate-300 hover:text-white border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                  isSelected
                    ? 'bg-[#d4af37] text-[#071710] font-black'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* القسم 1: حساب الدرجات الاستدلالية الـ 12 والشبكة الاستدلالية 2026      */}
      {/* ===================================================================== */}
      {activeTab === 'echelons' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
              <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
                ضبط الصنف الوظيفي والدرجة الاستدلالية (المرسوم 25-54)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    الصنف والرتبة الوظيفية في الشبكة الاستدلالية 2026
                  </label>
                  <select
                    value={categoryClass}
                    onChange={(e) =>
                      setCategoryClass(
                        e.target.value as '14' | '15' | '16' | '17' | 'hc1'
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                  >
                    <option value="14">
                      الصنف 14 — 821 نقطة (مساعد مدير ابتدائية / مستشار تربية)
                    </option>
                    <option value="15">
                      الصنف 15 — 866 نقطة (ناظر ابتدائية / ناظر متوسطة قاعدي)
                    </option>
                    <option value="16">
                      الصنف 16 — 913 نقطة (ناظر متوسطة محين / ناظر ثانوية)
                    </option>
                    <option value="17">
                      الصنف 17 — 962 نقطة (ناظر ثانوية تصنيف محين / مدير متوسطة)
                    </option>
                    <option value="hc1">
                      خارج الصنف ق1 — 1055 نقطة (مدير ثانوية / مفتش التربية الوطنية)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      الدرجة الحالية (0 - 12)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={currentEchelon}
                      onChange={(e) =>
                        setCurrentEchelon(
                          Math.min(12, Math.max(0, Number(e.target.value) || 0))
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-[#f5d77f] font-mono font-black tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      وتيرة الترقية في الدرجة
                    </label>
                    <select
                      value={paceMode}
                      onChange={(e) =>
                        setPaceMode(e.target.value as 'min' | 'med' | 'max')
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                    >
                      <option value="min">المدة الدنيا (سنتان و 6 أشهر)</option>
                      <option value="med">المدة المتوسطة (3 سنوات)</option>
                      <option value="max">المدة القصوى (3 سنوات و 6 أشهر)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#06150e] border border-[#d4af37]/30 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">الأجر القاعدي (الصنف {categoryClass}):</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {baseSalary.toLocaleString('ar-DZ')} دج
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      قيمة الدرجة {currentEchelon} ({echelonPoints} نقطة × 45 دج):
                    </span>
                    <span className="font-mono font-bold text-[#f5d77f] tabular-nums">
                      +{echelonAllowance.toLocaleString('ar-DZ')} دج
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2">
                    <span className="text-emerald-300 font-bold">
                      الأجر الرئيسي (القاعدي + الدرجة):
                    </span>
                    <span className="font-mono font-black text-emerald-400 tabular-nums">
                      {mainSalary.toLocaleString('ar-DZ')} دج
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* جدول سلم الدرجات الـ 12 الكامل */}
            <div className="lg:col-span-7 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 overflow-hidden">
              <div className="p-4 bg-[#06150e] border-b border-[#d4af37]/20 flex items-center justify-between">
                <h3 className="text-sm font-black text-white">
                  جدول تطور الدرجات الـ 12 للصنف المحدد ({indexMap[categoryClass]?.label})
                </h3>
                <span className="text-xs text-[#f5d77f] font-mono">
                  قيمة النقطة: {pointValue} دج
                </span>
              </div>
              <div className="overflow-x-auto max-h-[380px]">
                <table className="w-full text-xs text-right border-collapse">
                  <thead className="sticky top-0 bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                    <tr>
                      <th className="py-2.5 px-3">الدرجة</th>
                      <th className="py-2.5 px-3 text-center">نقاط الدرجة</th>
                      <th className="py-2.5 px-3 text-center">المجموع الاستدلالي</th>
                      <th className="py-2.5 px-3 text-center">قيمة الدرجة الخام</th>
                      <th className="py-2.5 px-3 text-center">الأجر الرئيسي</th>
                      <th className="py-2.5 px-3 text-center">تحديد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {Array.from({ length: 12 }, (_, idx) => idx + 1).map((ech) => {
                      const pts = Math.round(ech * (baseIndex * 0.05));
                      const totIdx = baseIndex + pts;
                      const echVal = pts * pointValue;
                      const mainSal = totIdx * pointValue;
                      const isCurrent = ech === currentEchelon;
                      return (
                        <tr
                          key={ech}
                          className={
                            isCurrent
                              ? 'bg-[#103824] font-bold text-white'
                              : 'hover:bg-[#0b2318]/60 text-slate-300'
                          }
                        >
                          <td className="py-2 px-3 font-mono tabular-nums">
                            الدرجة {ech} {isCurrent && ' (الحالية)'}
                          </td>
                          <td className="py-2 px-3 text-center font-mono text-[#f5d77f] tabular-nums">
                            +{pts}
                          </td>
                          <td className="py-2 px-3 text-center font-mono tabular-nums">
                            {totIdx}
                          </td>
                          <td className="py-2 px-3 text-center font-mono text-emerald-300 tabular-nums">
                            {echVal.toLocaleString('ar-DZ')} دج
                          </td>
                          <td className="py-2 px-3 text-center font-mono tabular-nums">
                            {mainSal.toLocaleString('ar-DZ')} دج
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => setCurrentEchelon(ech)}
                              className="px-2 py-0.5 rounded bg-[#06150e] hover:bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40 text-[10px] cursor-pointer"
                            >
                              معاينة
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* القسم 2: حساب الأقدمية (العامة أو في الرتبة) وامتياز المنطقة          */}
      {/* ===================================================================== */}
      {activeTab === 'seniority' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
              إدخال تواريخ المسار المهني وامتياز المنطقة (تحيين 2026)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  تاريخ أول توظيف في القطاع (الأقدمية العامة)
                </label>
                <input
                  type="date"
                  value={firstHireDate}
                  onChange={(e) => setFirstHireDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  تاريخ التعيين في الرتبة الحالية (أقدمية الرتبة)
                </label>
                <input
                  type="date"
                  value={rankAppointmentDate}
                  onChange={(e) => setRankAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  تاريخ سريان آخر ترقية في الدرجة
                </label>
                <input
                  type="date"
                  value={lastEchelonDate}
                  onChange={(e) => setLastEchelonDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  امتياز الأقدمية للمنطقة الجغرافية (الجنوب / الهضاب)
                </label>
                <select
                  value={zoneBonusMonthsPerYear}
                  onChange={(e) => setZoneBonusMonthsPerYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                >
                  <option value={0}>المنطقة الشمالية (بدون امتياز إضافي)</option>
                  <option value={2}>الهضاب العليا (شهران إضافيان عن كل سنة)</option>
                  <option value={4}>الجنوب (4 أشهر إضافية عن كل سنة)</option>
                  <option value={6}>الجنوب الكبير (6 أشهر إضافية عن كل سنة)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">
                  سنوات الخدمة الوطنية أو عقود ما قبل التشغيل المسترجعة (سنوات)
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step="0.5"
                  value={boughtBackYears}
                  onChange={(e) => setBoughtBackYears(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
              نتائج حساب الأقدمية العامة وفي الرتبة واستحقاق الدرجة القادمة
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-[#06150e] border border-[#d4af37]/30">
                <div className="text-slate-400">الأقدمية العامة الفعلية</div>
                <div className="text-xl font-black text-[#f5d77f] font-mono mt-1 tabular-nums">
                  {generalSen.years} سنة و {generalSen.months} أشهر
                </div>
                <div className="text-[11px] text-emerald-300 mt-1">
                  مع امتياز المنطقة والسنوات المسترجعة: {effectiveCareerYears} سنة
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#06150e] border border-cyan-700/40">
                <div className="text-slate-400">الأقدمية في الرتبة الحالية</div>
                <div className="text-xl font-black text-cyan-300 font-mono mt-1 tabular-nums">
                  {rankSen.years} سنة و {rankSen.months} أشهر
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  نقاط أقدمية الرتبة في المقياس: {Math.min(20, rankSen.years * 2)} / 20 ن
                </div>
              </div>

              <div className="sm:col-span-2 p-4 rounded-xl bg-[#06150e] border border-emerald-700/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    وضعية الترقية إلى الدرجة {Math.min(12, currentEchelon + 1)} (حسب الوتيرة{' '}
                    {paceMode === 'min' ? 'الدنيا 2.5 س' : paceMode === 'med' ? 'المتوسطة 3 س' : 'القصوى 3.5 س'}):
                  </span>
                  <span className="font-mono font-black text-emerald-400 tabular-nums">
                    {remainingMonthsForNextEchelon === 0
                      ? 'مستوفٍ للشرط الزمني للترقية الآن!'
                      : `متبقي ${remainingMonthsForNextEchelon} شهراً`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  المدة المقضية منذ آخر درجة: {sinceLastEchelon.years} سنة و {sinceLastEchelon.months} أشهر ({elapsedMonthsSinceEchelon} شهراً من أصل {requiredMonthsForNextEchelon} شهراً).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* القسم 3: حساب تعويض الخبرة البيداغوجية والمهنية (IEEP / IEP)          */}
      {/* ===================================================================== */}
      {activeTab === 'experience' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
              حاسبة تعويض الخبرة البيداغوجية والمهنية (IEEP / IEP 2026)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  نسبة تعويض الخبرة البيداغوجية عن كل درجة (%)
                </label>
                <input
                  type="number"
                  min={2}
                  max={6}
                  step="0.5"
                  value={iepRatePerYear}
                  onChange={(e) => setIepRatePerYear(Number(e.target.value) || 4)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  سنوات الخبرة البيداغوجية المحتسبة
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={extraPedagogicalYears}
                  onChange={(e) => setExtraPedagogicalYears(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#06150e] border border-[#d4af37]/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">تعويض الدرجة الاستدلالية ({currentEchelon}):</span>
                <span className="font-mono font-bold text-[#f5d77f] tabular-nums">
                  {echelonAllowance.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">
                  تعويض الخبرة البيداغوجية ({iepPercentage}% من الأجر القاعدي):
                </span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  {iepMonthlyAmount.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="font-bold text-white">
                  إجمالي العائد الشهري للخبرة والدرجة:
                </span>
                <span className="font-mono font-black text-[#f5d77f] text-sm tabular-nums">
                  {totalExperiencePackage.toLocaleString('ar-DZ')} دج / شهر
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
              محاكاة الأثر المالي عند الانتقال للدرجة الموالية ({Math.min(12, currentEchelon + 1)})
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              يرتفع كل من الأجر الرئيسي والعلاوات المرتبطة به نسبياً (التأهيل، الدعم المدرسي، التأطير البيداغوجي، والمردودية) فور الترقية في الدرجة:
            </p>
            <div className="p-4 rounded-xl bg-[#06150e] border border-emerald-700/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">الزيادة الخام في قيمة الدرجة الواحدة:</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  +{Math.round(baseIndex * 0.05 * pointValue).toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">الزيادة غير المباشرة في العلاوات النسبية:</span>
                <span className="font-mono font-bold text-emerald-300 tabular-nums">
                  +
                  {Math.round(
                    baseIndex *
                      0.05 *
                      pointValue *
                      ((qualificationRate + pedagogicalSupportRate + adminResponsibilityRate) /
                        100)
                  ).toLocaleString('ar-DZ')}{' '}
                  دج
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* القسم 4: حساب منحة الأداء التربوي والإداري (المردودية)                */}
      {/* ===================================================================== */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
              معطيات حساب منحة تحسين الأداء التربوي والتسيير (المردودية 2026)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">السقف القانوني للمنحة</label>
                <select
                  value={maxYieldRate}
                  onChange={(e) => setMaxYieldRate(Number(e.target.value) as 30 | 40)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                >
                  <option value={40}>40% (النظار، المديرون، الأساتذة)</option>
                  <option value={30}>30% (الأسلاك المشتركة والإدارية)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  نقطة التقييم الفصلية (/40)
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  step="0.5"
                  value={yieldScoreOutOf40}
                  onChange={(e) =>
                    setYieldScoreOutOf40(
                      Math.min(40, Math.max(0, Number(e.target.value) || 0))
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-[#f5d77f] font-mono font-black tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  أيام الغياب غير المبرر في الثلاثي
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={unjustifiedAbsenceDays}
                  onChange={(e) =>
                    setUnjustifiedAbsenceDays(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-rose-300 font-mono font-black tabular-nums"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              ملاحظة تنظيمية: تُصرف منحة تحسين الأداء التربوي كل ثلاثة أشهر (ثلاثي) على أساس الأجر الرئيسي (الأجر القاعدي + تعويض الدرجة)، وتخضع لاقتطاع الضمان الاجتماعي (9%) والضريبة التفضيلية (10%).
            </p>
          </div>

          <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-3 text-xs">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
              تفصيل منحة المردودية الصافية للثلاثي (3 أشهر)
            </h3>

            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-300">النسبة الفعلية المحتسبة بعد التقييم:</span>
              <span className="font-mono font-bold text-[#f5d77f] tabular-nums">
                {effectiveYieldPercentage.toFixed(1)}% من {maxYieldRate}%
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-300">المبلغ الخام للمردودية (3 أشهر):</span>
              <span className="font-mono font-bold text-white tabular-nums">
                {quarterlyYieldGross.toLocaleString('ar-DZ')} دج
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">اقتطاع الضمان الاجتماعي (CNAS 9%):</span>
              <span className="font-mono text-rose-400 tabular-nums">
                -{quarterlyYieldCnas.toLocaleString('ar-DZ')} دج
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">اقتطاع الضريبة على الدخل (IRG 10%):</span>
              <span className="font-mono text-rose-400 tabular-nums">
                -{quarterlyYieldIrg.toLocaleString('ar-DZ')} دج
              </span>
            </div>
            <div className="flex justify-between pt-2 text-sm">
              <span className="font-black text-emerald-300">
                صافي منحة الأداء والمردودية للثلاثي:
              </span>
              <span className="font-mono font-black text-emerald-400 tabular-nums">
                {quarterlyYieldNet.toLocaleString('ar-DZ')} دج
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* القسم 5: حساب مختلف المنح والعلاوات وكشف الراتب المفصل 2026           */}
      {/* ===================================================================== */}
      {activeTab === 'allowances' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-3.5 text-xs">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2">
              تخصيص المنح والعلاوات الشهرية (النظام التعويضي 2026)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  علاوة التأهيل (%)
                </label>
                <input
                  type="number"
                  min={25}
                  max={60}
                  value={qualificationRate}
                  onChange={(e) => setQualificationRate(Number(e.target.value) || 45)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  تعويض الدعم المدرسي (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={pedagogicalSupportRate}
                  onChange={(e) =>
                    setPedagogicalSupportRate(Number(e.target.value) || 15)
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  تعويض التأطير والإدارة للناظر (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={45}
                  value={adminResponsibilityRate}
                  onChange={(e) =>
                    setAdminResponsibilityRate(Number(e.target.value) || 0)
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  تعويض التوثيق التربوي (دج)
                </label>
                <input
                  type="number"
                  step={500}
                  value={documentationAllowance}
                  onChange={(e) =>
                    setDocumentationAllowance(Number(e.target.value) || 0)
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  منحة السكن / تعويض السكن (دج)
                </label>
                <input
                  type="number"
                  step={500}
                  value={housingAllowance}
                  onChange={(e) => setHousingAllowance(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  تعويض المنطقة الجغرافية (دج)
                </label>
                <input
                  type="number"
                  step={1000}
                  value={zoneAllowanceAmount}
                  onChange={(e) => setZoneAllowanceAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  عدد الأطفال المتمدرسين (المنح العائلية)
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div className="flex flex-col justify-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={singleIncomeSpouse}
                    onChange={(e) => setSingleIncomeSpouse(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>منحة الأجر الوحيد (800 دج)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={mutualInsuranceSubscribed}
                    onChange={(e) => setMutualInsuranceSubscribed(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>اشتراك التعاضدية (1%)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2.5">
              <h3 className="text-base font-black text-white">
                كشف الراتب التقديري المفصل ({institution.directorOfStudies} — {stageMeta.natherTitle})
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-[#105e32] text-[#f5d77f] font-mono font-bold">
                الصنف {categoryClass} · الدرجة {currentEchelon}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-[#06150e] flex justify-between">
                <span className="text-slate-300">الأجر القاعدي ({baseIndex} ن):</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {baseSalary.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#06150e] flex justify-between">
                <span className="text-slate-300">تعويض الدرجة ({echelonPoints} ن):</span>
                <span className="font-mono font-bold text-[#f5d77f] tabular-nums">
                  {echelonAllowance.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#06150e] flex justify-between">
                <span className="text-slate-300">تعويض الخبرة البيداغوجية ({iepPercentage}%):</span>
                <span className="font-mono font-bold text-emerald-300 tabular-nums">
                  {iepMonthlyAmount.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#06150e] flex justify-between">
                <span className="text-slate-300">علاوة التأهيل ({qualificationRate}%):</span>
                <span className="font-mono font-bold text-emerald-300 tabular-nums">
                  {qualificationAmount.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#06150e] flex justify-between">
                <span className="text-slate-300">تعويض الدعم المدرسي ({pedagogicalSupportRate}%):</span>
                <span className="font-mono font-bold text-emerald-300 tabular-nums">
                  {supportAmount.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#06150e] flex justify-between">
                <span className="text-slate-300">تعويض التأطير والإدارة ({adminResponsibilityRate}%):</span>
                <span className="font-mono font-bold text-emerald-300 tabular-nums">
                  {responsibilityAmount.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#06150e] flex justify-between">
                <span className="text-slate-300">تعويض التوثيق التربوي:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {documentationAllowance.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#06150e] flex justify-between">
                <span className="text-slate-300">السكن + المنح العائلية + المنطقة:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {(housingAllowance + familyAllowance + zoneAllowanceAmount).toLocaleString(
                    'ar-DZ'
                  )}{' '}
                  دج
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#05120c] border border-[#d4af37]/30 space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>الأجر الخام الإجمالي:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {totalGrossSalary.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>مجموع الاقتطاعات (ضمان اجتماعي 9%: {cnasDeduction.toLocaleString('ar-DZ')} + ضريبة IRG: {irgDeduction.toLocaleString('ar-DZ')} + تعاضدية: {mutualDeduction.toLocaleString('ar-DZ')}):</span>
                <span className="font-mono font-bold tabular-nums">
                  -{(cnasDeduction + irgDeduction + mutualDeduction).toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                <span className="font-black text-[#f5d77f]">
                  الراتب الشهري الصافي التقديري (دون المردودية):
                </span>
                <span className="font-mono font-black text-emerald-400 text-base tabular-nums">
                  {estimatedNetSalary.toLocaleString('ar-DZ')} دج
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* القسم 6: حساب التقاعد والمعاش (الصندوق الوطني للتقاعد CNR 2026)        */}
      {/* ===================================================================== */}
      {activeTab === 'retirement' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
              معطيات حساب معاش التقاعد لأسلاك التربية (CNR — المرسوم 25-54)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">السن الحالي (سنة)</label>
                <input
                  type="number"
                  min={35}
                  max={65}
                  value={employeeAge}
                  onChange={(e) => setEmployeeAge(Number(e.target.value) || 50)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الجنس</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                >
                  <option value="male">ذكر (تخفيض أسلاك التربية)</option>
                  <option value="female">أنثى (تخفيض التربية + الأمومة)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  عدد سنوات الخدمة الفعلية المعتمدة
                </label>
                <input
                  type="number"
                  min={15}
                  max={40}
                  step="0.5"
                  value={validatedServiceYears}
                  onChange={(e) =>
                    setValidatedServiceYears(Number(e.target.value) || 15)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-[#f5d77f] font-mono font-black tabular-nums"
                />
              </div>

              {gender === 'female' ? (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    عدد الأطفال لتخفيض السن (أقصى 3)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={childrenForMaternityReduction}
                    onChange={(e) =>
                      setChildrenForMaternityReduction(
                        Math.min(3, Math.max(0, Number(e.target.value) || 0))
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
                  />
                </div>
              ) : (
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                    <input
                      type="checkbox"
                      checked={dependentSpouseInPension}
                      onChange={(e) => setDependentSpouseInPension(e.target.checked)}
                      className="accent-[#d4af37]"
                    />
                    <span>إضافة منحة الزوج المكفول (2,500 دج)</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-3 text-xs">
            <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
              بطاقة تصفية معاش التقاعد التقديري (CNR 2026)
            </h3>

            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-300">السن القانوني المخفض لأسلاك التربية:</span>
              <span className="font-mono font-bold text-[#f5d77f] tabular-nums">
                {legalRetirementAge} سنة (متبقي {Math.max(0, legalRetirementAge - employeeAge)}{' '}
                سنوات)
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-300">
                مجموع السنوات المحتسبة ({totalValidatedYearsWithBonuses} سنة × 2.5%):
              </span>
              <span className="font-mono font-bold text-emerald-300 tabular-nums">
                نسبة التصفية: {pensionRate}% (السقف الأقصى 80%)
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-300">الأجر المرجعي الخاضع لتصفية المعاش:</span>
              <span className="font-mono font-bold text-white tabular-nums">
                {referenceFiveYearSalary.toLocaleString('ar-DZ')} دج
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">معاش التقاعد الخام:</span>
              <span className="font-mono text-white tabular-nums">
                {grossPension.toLocaleString('ar-DZ')} دج
              </span>
            </div>
            <div className="flex justify-between pt-2 text-sm">
              <span className="font-black text-[#f5d77f]">
                معاش التقاعد الصافي الشهري التقديري:
              </span>
              <span className="font-mono font-black text-emerald-400 text-base tabular-nums">
                {netRetirementPension.toLocaleString('ar-DZ')} دج / شهر
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* القسم 7: مقياس الترقية والتأهيل للرتب العليا (مدير / مفتش)             */}
      {/* ===================================================================== */}
      {activeTab === 'promotion' && (
        <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
          <h3 className="text-base font-black text-white border-b border-[#d4af37]/20 pb-2.5">
            مقياس التأهيل والترقية لرتبة {targetPromotionRank} (المرسوم 25-54)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                العلامة الإدارية للمدير (/20)
              </label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={20}
                value={adminScore}
                onChange={(e) => setAdminScore(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                علامة التفتيش البيداغوجي (/20)
              </label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={20}
                value={inspectionScore}
                onChange={(e) => setInspectionScore(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                نقاط الشهادات العلمية الإضافية (0 - 6)
              </label>
              <input
                type="number"
                min={0}
                max={6}
                value={extraDegreePoints}
                onChange={(e) => setExtraDegreePoints(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                نقاط الدورات التكوينية والأشغال (0 - 6)
              </label>
              <input
                type="number"
                min={0}
                max={6}
                value={trainingCyclesPoints}
                onChange={(e) => setTrainingCyclesPoints(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-mono tabular-nums"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#06150e] border border-[#d4af37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-300 font-bold">
                المجموع العام لنقاط مقياس التأهيل والترقية ({institution.directorOfStudies}):
              </div>
              <div className="text-[11px] text-emerald-300 mt-1">
                {rankSen.years >= 3
                  ? `✓ مستوفٍ لشرط المسابقة المهنية والتأهيل لرتبة ${targetPromotionRank} (${rankSen.years} سنوات في الرتبة)`
                  : 'يتطلب 3 سنوات أقدمية في رتبة ناظر للمسابقة المهنية'}
              </div>
            </div>
            <div className="text-2xl font-black text-[#f5d77f] font-mono tabular-nums">
              {promotionScore.toFixed(1)} / 84 ن
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. فضاء التنسيق الوطني لنظار الأطوار الثلاثة (SNTE 2026)
// ============================================================================
export const CoordinationView: React.FC<{ institution: InstitutionInfo }> = ({
  institution,
}) => {
  const stageMeta = STAGE_METADATA[institution.stage];

  const [topics, setTopics] = useState([
    {
      id: 'top-1',
      author: 'الناظر سليم بوزيان (ولاية سطيف — الطور المتوسط)',
      school: 'متوسطة الشهيد بن بولعيد',
      time: 'منذ ساعتين',
      tag: 'الحساب التلقائي للمعدلات (/20)',
      title: 'توحيد آلية احتساب نقطة المواظبة في التقويم المستمر لتلاميذ السنة الرابعة متوسط',
      body: 'زملائي النظار، نعتمد هذا الموسم ربط راصد الغيابات اليومي بنقطة المواظبة لتحفيز تلاميذ أقسام شهادة التعليم المتوسط BEM على الانضباط الصباحي والمسائي.',
      likes: 24,
    },
    {
      id: 'top-2',
      author: 'الناظر عبد الرحمن قاسمي (ولاية الجزائر — الطور الابتدائي)',
      school: 'مدرسة الشهيد العربي بن مهيدي الابتدائية',
      time: 'منذ 3 ساعات',
      tag: 'الطور الابتدائي (/10 والمطعم المدرسي)',
      title: 'الربط الآلي بين نداء الفترة الصباحية وإحصاء الوجبات الساخنة في المطعم المدرسي',
      body: 'لتفادي الهدر في المطعم المدرسي، يتم غلق قائمة الغيابات على الساعة 08:30 صباحاً وإحالة عدد التلاميذ الحاضرين مباشرة إلى مسير المطعم.',
      likes: 31,
    },
    {
      id: 'top-3',
      author: 'الناظر كمال آيت واعر (ولاية تيزي وزو — الطور الثانوي)',
      school: 'ثانوية العقيد لطفي',
      time: 'منذ 5 ساعات',
      tag: 'الطور الثانوي (معاملات الشعب و BAC)',
      title: 'ضبط جداول حصص الأعمال المخبرية (TP) لأقسام 3 علوم تجريبية وتقني رياضي',
      body: 'لضمان تغطية كافة الأفواج في مخابر الفيزياء والعلوم والهندسة، نقترح برمجة التفويج النصفي بالتناوب الأسبوعي.',
      likes: 19,
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    setTopics([
      {
        id: `top-${Date.now()}`,
        author: `${stageMeta.natherTitle} ${institution.directorOfStudies} (${institution.wilaya})`,
        school: institution.schoolName,
        time: 'الآن',
        tag: `مبادرة بيداغوجية (${stageMeta.shortName})`,
        title: newTitle.trim(),
        body: newBody.trim(),
        likes: 1,
      },
      ...topics,
    ]);
    setNewTitle('');
    setNewBody('');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white text-xs font-bold">
          شبكة التنسيق المهني والنقابي لنظار الأطوار الثلاثة — SNTE 2026
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1.5">
          <Users className="w-6 h-6 text-[#d4af37]" />
          <span>فضاء التنسيق وتبادل الخبرات البيداغوجية (ابتدائي · متوسط · ثانوي)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
          منبر تفاعلي لتقاسم التجارب الميدانية حول هندسة جداول التوقيت، معالجة غيابات التلاميذ، وتحضير مجالس الأقسام والامتحانات الرسمية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <form
            onSubmit={handleAddTopic}
            className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-3.5"
          >
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-[#d4af37]" />
              <span>طرح موضوع أو استشارة بيداغوجية للزملاء النظار</span>
            </h3>
            <div>
              <label className="block text-xs text-slate-300 font-bold mb-1">
                عنوان الموضوع المقتضب
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: تنظيم حصص المعالجة البيداغوجية..."
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 font-bold mb-1">
                تفاصيل المقترح أو الإشكال البيداغوجي
              </label>
              <textarea
                rows={4}
                required
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="اشرح المقترح البيداغوجي أو التنظيمي..."
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs cursor-pointer"
            >
              نشر الموضوع في فضاء النظار ({stageMeta.shortName})
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-3.5">
          {topics.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-[#081a12] border border-[#d4af37]/30 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#f5d77f]">{t.author}</span>
                <span className="text-slate-400">{t.time}</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-semibold">
                {t.school} · {t.tag}
              </div>
              <h4 className="text-sm sm:text-base font-black text-white">{t.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{t.body}</p>
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() =>
                    setTopics(
                      topics.map((x) => (x.id === t.id ? { ...x, likes: x.likes + 1 } : x))
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-[#06150e] hover:bg-[#103824] text-[#f5d77f] border border-[#d4af37]/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer tabular-nums"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>تأييد ({t.likes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
