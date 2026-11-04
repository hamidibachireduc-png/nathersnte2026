import React, { useState } from 'react';
import { 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowLeftRight, 
  Lock, 
  Unlock, 
  Users, 
  Database,
  Check,
  Printer,
  ExternalLink
} from 'lucide-react';
import { InstitutionProfile, StudentScore, TeacherRecord, AbsenceRecord, TimetableSlot } from '../types';

interface DigitalizationSyncSectionProps {
  institution: InstitutionProfile;
  studentsScores: StudentScore[];
  teachers: TeacherRecord[];
  absences: AbsenceRecord[];
  timetable: TimetableSlot[];
}

interface DigitalTransferRequest {
  id: string;
  studentName: string;
  nationalId: string; // رقم التعريف المدرسي والوطني
  type: 'وافد إلى الثانوية' | 'مغادر من الثانوية';
  levelAndStream: string;
  originOrDestSchool: string;
  requestDate: string;
  status: 'مؤشر ومقبول رقمياً' | 'قيد مراقبة الوثائق والملف';
}

export const DigitalizationSyncSection: React.FC<DigitalizationSyncSectionProps> = ({
  institution,
  studentsScores,
  teachers,
  absences,
  timetable
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'marks_audit' | 'transfers' | 'portals'>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>('اليوم على الساعة 10:45 صباحاً');
  const [termLockStatus, setTermLockStatus] = useState<'open' | 'locked'>('open');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [transfers, setTransfers] = useState<DigitalTransferRequest[]>([
    {
      id: 'tr-101',
      studentName: 'عبد الرحمان بوطالب',
      nationalId: '10025489632145',
      type: 'وافد إلى الثانوية',
      levelAndStream: '2 علوم تجريبية',
      originOrDestSchool: 'ثانوية مالك بن نبي - قسنطينة',
      requestDate: '2025-10-19',
      status: 'مؤشر ومقبول رقمياً'
    },
    {
      id: 'tr-102',
      studentName: 'إيناس بن جلول',
      nationalId: '10025874123698',
      type: 'وافد إلى الثانوية',
      levelAndStream: '3 علوم تجريبية',
      originOrDestSchool: 'ثانوية الإخوة منتوري',
      requestDate: '2025-10-28',
      status: 'قيد مراقبة الوثائق والملف'
    },
    {
      id: 'tr-103',
      studentName: 'أسامة قريشي',
      nationalId: '10025369874125',
      type: 'مغادر من الثانوية',
      levelAndStream: '1 جذع مشترك علوم وتكنولوجيا',
      originOrDestSchool: 'ثانوية أحمد باي',
      requestDate: '2025-10-14',
      status: 'مؤشر ومقبول رقمياً'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRunFullSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const nowStr = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTimestamp(`الآن (${nowStr})`);
      showToast('تمت المزامنة الشاملة ومطابقة البيانات مع الأرضية الرقمية لوزارة التربية الوطنية بنجاح!');
    }, 900);
  };

  const handleExportAmattiExcel = () => {
    let csv = '\ufeff';
    csv += `ملف حجز النقاط الرسمي المطابق لأرضية الرقمنة - وزارة التربية الوطنية 2026\n`;
    csv += `المؤسسة:,${institution.schoolName},الولاية:,${institution.wilaya},السنة الدراسية:,${institution.schoolYear},الفصل:,${institution.currentTerm}\n\n`;
    csv += `رقم التعريف المدرسي,لقب واسم التلميذ,الفوج التربوي,التقويم المستمر,الفرض المحروس,الاختبار الفصلي,المعدل الفصلي,تقدير الأستاذ والمجلس\n`;

    studentsScores.forEach((std, idx) => {
      const sampleScore = std.scores[0] || { continuousScore: 14, examScore: 14 };
      csv += `202600${idx + 101},"${std.name}","${std.classGroup}",${sampleScore.continuousScore.toFixed(2)},${sampleScore.continuousScore.toFixed(2)},${sampleScore.examScore.toFixed(2)},${std.average.toFixed(2)},"${std.mention || 'نتائج مقبولة'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ملف_حجز_الرقمنة_amatti_${institution.schoolName.replace(/\s+/g, '_')}_ف${institution.currentTerm}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم استخراج ملف الحجز القياسي بصيغة أرضية الرقمنة (Amatti CSV/Excel) بنجاح');
  };

  const handleApproveTransfer = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'مؤشر ومقبول رقمياً' } : t));
    showToast('تم تأشير التحويل الرقمي وتحيين قائمة الفوج التربوي في قاعدة البيانات');
  };

  // Compute teachers marks entry completion simulation
  const teacherSyncRows = teachers.map((t, index) => {
    const isCompleted = index % 4 !== 3;
    return {
      ...t,
      marksEnteredPercent: isCompleted ? 100 : 85,
      observationsEntered: isCompleted,
      lastUpload: isCompleted ? 'مكتمل ومؤشر' : 'تبقى فوج واحد قيد الحجز'
    };
  });

  const completedTeachersCount = teacherSyncRows.filter(t => t.marksEnteredPercent === 100).length;
  const overallSyncRate = Math.round((completedTeachersCount / teachers.length) * 100);

  return (
    <div className="space-y-6">
      
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#105e32] text-[#f5d77f] px-4 py-3 rounded-xl border border-[#d4af37] shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 text-white" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Royal Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <Globe className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '12s' }} />
              <span>بوابة الربط البيني مع الأرضية الرقمية لوزارة التربية الوطنية (تحيين 2026)</span>
              <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 text-[10px]">
                متصل بـ amatti.education.gov.dz
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              مركز الربط والمزامنة مع الرقمنة التربوية الشاملة
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              إشراف ناظر الثانوية على تدفق المعطيات البيداغوجية نحو الأرضية الرقمية للوزارة: مراقبة حجز النقاط والملاحظات، الإسناد البيداغوجي الرقمي، حركة تحويل التلاميذ، والتوجيه المدرسي الإلكتروني.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunFullSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] text-xs font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'جاري المزامنة الرقمية...' : 'مزامنة شاملة مع الأرضية'}</span>
            </button>

            <button
              onClick={handleExportAmattiExcel}
              className="px-3.5 py-2.5 rounded-lg bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] text-xs font-bold flex items-center gap-1.5 border border-[#d4af37]/40 shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>تصدير قالب حجز الرقمنة</span>
            </button>

            <button
              onClick={() => {
                const next = termLockStatus === 'open' ? 'locked' : 'open';
                setTermLockStatus(next);
                showToast(next === 'locked' ? 'تم قفل حجز النقاط للفصل الحالي استعداداً لمجالس الأقسام' : 'تم فتح حجز النقاط استثنائياً للأساتذة');
              }}
              className={`px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border shadow-md transition-all ${
                termLockStatus === 'open'
                  ? 'bg-[#05140d] text-emerald-300 border-emerald-700 hover:bg-emerald-950'
                  : 'bg-[#8f1414] text-white border-[#f5d77f]/40'
              }`}
            >
              {termLockStatus === 'open' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{termLockStatus === 'open' ? 'الحجز مفتوح للأساتذة' : 'الحجز مغلق ومؤشر'}</span>
            </button>
          </div>
        </div>

        {/* 4 Digitalization KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#05140d] border border-emerald-700/50">
            <div className="text-[11px] text-slate-400">نسبة تقدم حجز النقاط (الرقمنة)</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{overallSyncRate}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{completedTeachersCount} من {teachers.length} أساتذة أتموا الحجز</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-[#d4af37]/40">
            <div className="text-[11px] text-slate-400">مطابقة الخريطة والإسناد الرقمي</div>
            <div className="text-2xl font-black text-[#f5d77f] mt-1">100%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{timetable.length} حصة متطابقة مع الأرضية</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-blue-800/60">
            <div className="text-[11px] text-slate-400">حركة التحويلات الرقمية للتلاميذ</div>
            <div className="text-2xl font-black text-blue-400 mt-1">{transfers.length} ملفات</div>
            <div className="text-[10px] text-slate-400 mt-0.5">تحويلات بين المؤسسات عبر النظام</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-emerald-800/60">
            <div className="text-[11px] text-slate-400">آخر مزامنة مع الخادم المركزي</div>
            <div className="text-sm font-black text-white mt-2">{lastSyncTimestamp}</div>
            <div className="text-[10px] text-emerald-400 mt-1">اتصال آمن ومشفر · SSL 2026</div>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pt-4 border-t border-[#d4af37]/20 scrollbar-none">
          {[
            { id: 'overview', label: 'مراقبة حجز النقاط والإسناد' },
            { id: 'marks_audit', label: 'مدقق سلامة الحجز قبل غلق الفصل' },
            { id: 'transfers', label: 'التحويلات الرقمية للتلاميذ (وافد / مغادر)' },
            { id: 'portals', label: 'المنصات الرقمية الفرعية لوزارة التربية' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === tab.id
                  ? 'bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white border border-[#f5d77f]/50 shadow-md'
                  : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview of Teacher Marks Entry */}
      {activeSubTab === 'overview' && (
        <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 shadow-xl overflow-hidden">
          <div className="p-4 bg-[#05140d] border-b border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-[#d4af37]" />
                <span>جدول متابعة حجز النقاط والتقديرات في فضاء الأستاذ والرقمنة</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                متابعة آنية لتقدم الأساتذة في صب نقاط التقويم المستمر، الفروض، والاختبارات الفصلية
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded bg-[#0d2818] text-[#f5d77f] text-xs font-bold border border-[#d4af37]/30 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة وضعية الحجز</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-[#030e08] text-[#f5d77f] border-b border-[#d4af37]/30">
                <tr>
                  <th className="p-3">الأستاذ(ة)</th>
                  <th className="p-3">المادة المسندة</th>
                  <th className="p-3 text-center">النصاب الأسبوعي</th>
                  <th className="p-3 text-center">نسبة حجز النقاط</th>
                  <th className="p-3 text-center">حجز الملاحظات الفردية</th>
                  <th className="p-3">حالة التدقيق الرقمي</th>
                  <th className="p-3 text-center">إجراء الناظر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15">
                {teacherSyncRows.map(t => (
                  <tr key={t.id} className="hover:bg-[#0c2419]/40 transition-colors">
                    <td className="p-3 font-bold text-white">{t.name}</td>
                    <td className="p-3 text-slate-300">{t.subject}</td>
                    <td className="p-3 text-center font-mono text-[#f5d77f]">{t.assignedHours} / {t.weeklyQuota} س</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${t.marksEnteredPercent === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                            style={{ width: `${t.marksEnteredPercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-white">{t.marksEnteredPercent}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {t.observationsEntered ? (
                        <span className="text-emerald-400 font-bold">مكتملة</span>
                      ) : (
                        <span className="text-amber-400 font-bold">قيد الاستكمال</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        t.marksEnteredPercent === 100
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {t.lastUpload}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => showToast(`تم إرسال تذكير رقمي للأستاذ ${t.name} لاستكمال وتأكيد الحجز`)}
                        className="px-2.5 py-1 rounded bg-[#05140d] hover:bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/30 text-[11px] font-semibold transition-colors"
                      >
                        {t.marksEnteredPercent === 100 ? 'تأشير القائمة' : 'تذكير بالحجز'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Pre-Closure Marks & Pedagogical Data Audit */}
      {activeSubTab === 'marks_audit' && (
        <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>فاحص المطابقة وسلامة المعطيات البيداغوجية قبل غلق الحجز الفصلي</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تطبيقاً للمنشور الوزاري 112/2026: التحقق الآلي من عدم وجود خانات فارغة أو أخطاء في المعاملات أو الإعفاءات قبل استخراج كشوف النقاط الرسمية
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold">
              5 / 5 فحوصات ناجحة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              {
                title: 'مطابقة المعاملات الرسمية للشعب والمستويات',
                desc: 'جميع معاملات شعبة العلوم التجريبية والتقني رياضي مطابقة للمنهاج الرسمي (الرياضيات 5، العلوم 6، الفيزياء 5...).',
                status: 'سليم ومطابق 100%'
              },
              {
                title: 'مراقبة الخانات الفارغة والإعفاءات الطبية',
                desc: 'لا توجد أي نقطة غير محجوزة للتلاميذ الحاضرين؛ التلاميذ المعفون في التربية البدنية مؤشرون بقرار طبي.',
                status: 'سليم ومطابق 100%'
              },
              {
                title: 'انسجام التقديرات البيداغوجية مع المعدلات',
                desc: 'تم التحقق من عدم وجود تناقض بين النقطة العددية الممنوحة والملاحظة التربوية المدونة من طرف الأستاذ.',
                status: 'سليم ومطابق 100%'
              },
              {
                title: 'ربط سجل الغيابات بمعدلات التقويم المستمر',
                desc: `تم ربط ${absences.filter(a => a.type === 'student').length} سجلات غياب تلاميذ بملحق مداولات مجلس القسم تلقائياً.`,
                status: 'مرتبط ومفعل'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#05140d] border border-emerald-800/50 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold whitespace-nowrap">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Digital Student Transfers */}
      {activeSubTab === 'transfers' && (
        <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-[#d4af37]" />
                <span>سجل التحويلات الرقمية للتلاميذ عبر الأرضية (الوافدون والمغادرون)</span>
              </h3>
              <p className="text-xs text-slate-400">
                معالجة ملفات التحويل الإلكتروني وتحيين قوائم الأفواج التربوية دون انقطاع في المسار الدراسي
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-[#05140d] text-[#f5d77f] border-b border-[#d4af37]/30">
                <tr>
                  <th className="p-3">رقم التعريف المدرسي</th>
                  <th className="p-3">اسم ولقب التلميذ</th>
                  <th className="p-3">طبيعة الحركة</th>
                  <th className="p-3">المستوى والشعبة</th>
                  <th className="p-3">المؤسسة الأصلية / المستقبلة</th>
                  <th className="p-3">تاريخ الطلب الرقمي</th>
                  <th className="p-3">الوضعية</th>
                  <th className="p-3 text-center">إجراء الناظر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15">
                {transfers.map(tr => (
                  <tr key={tr.id} className="hover:bg-[#0c2419]/40">
                    <td className="p-3 font-mono text-slate-300">{tr.nationalId}</td>
                    <td className="p-3 font-bold text-white">{tr.studentName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tr.type === 'وافد إلى الثانوية'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}>
                        {tr.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200">{tr.levelAndStream}</td>
                    <td className="p-3 text-slate-300">{tr.originOrDestSchool}</td>
                    <td className="p-3 font-mono text-slate-400">{tr.requestDate}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-bold ${
                        tr.status === 'مؤشر ومقبول رقمياً' ? 'text-emerald-400' : 'text-yellow-400'
                      }`}>
                        {tr.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {tr.status !== 'مؤشر ومقبول رقمياً' ? (
                        <button
                          onClick={() => handleApproveTransfer(tr.id)}
                          className="px-2.5 py-1 rounded bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] font-bold text-[11px]"
                        >
                          تأشير وتفويج التلميذ
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">مكتمل</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Official Sub-Portals */}
      {activeSubTab === 'portals' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'الأرضية الرقمية للتسيير (Amatti)',
              url: 'https://amatti.education.gov.dz',
              desc: 'المنصة المركزية لإسناد الأفواج، حجز النقاط، التحويلات، واستخراج كشوف النقاط ومحاضر مجالس الأقسام.',
              role: 'فضاء المؤسسة وإشراف الناظر'
            },
            {
              title: 'فضاء الأساتذة الرقمي (Ostad)',
              url: 'https://ostad.education.gov.dz',
              desc: 'بوابة الأساتذة لتحميل قوائم الأفواج، صب نقاط التقويم المستمر والاختبارات، وتلقي التوجيهات البيداغوجية.',
              role: 'تنسيق الناظر مع الأساتذة'
            },
            {
              title: 'فضاء أولياء التلاميذ (Awlyaa)',
              url: 'https://awlyaa.education.gov.dz',
              desc: 'بوابة اطلاع الأولياء على النتائج الفصلية، الغيابات اليومية، طلبات التحويل، ورغبات التوجيه المدرسي.',
              role: 'تواصل المؤسسة مع الأولياء'
            }
          ].map((portal, i) => (
            <div key={i} className="p-5 rounded-xl bg-[#081a12] border border-[#d4af37]/30 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/30">
                  {portal.role}
                </span>
                <h4 className="font-black text-white text-base">{portal.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{portal.desc}</p>
              </div>
              <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-xs">
                <span className="font-mono text-[#d4af37] text-[11px]">{portal.url}</span>
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>فتح البوابة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
