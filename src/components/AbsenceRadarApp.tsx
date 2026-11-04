import React, { useState } from 'react';
import { 
  UserX, 
  AlertTriangle, 
  Plus, 
  Search, 
  FileText, 
  Printer, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  AlertOctagon, 
  Filter,
  Check,
  UserCheck
} from 'lucide-react';
import { AbsenceRecord, InstitutionProfile, TeacherRecord } from '../types';

interface AbsenceRadarAppProps {
  institution: InstitutionProfile;
  absences: AbsenceRecord[];
  teachers: TeacherRecord[];
  onUpdateAbsences: (absences: AbsenceRecord[]) => void;
  onOpenDocumentGenerator: (templateId: string, customData?: Record<string, string>) => void;
}

export const AbsenceRadarApp: React.FC<AbsenceRadarAppProps> = ({
  institution,
  absences,
  teachers,
  onUpdateAbsences,
  onOpenDocumentGenerator
}) => {
  const [filterType, setFilterType] = useState<'all' | 'teacher' | 'student'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new absence
  const [formType, setFormType] = useState<'teacher' | 'student'>('teacher');
  const [formPersonName, setFormPersonName] = useState('');
  const [formIdentifier, setFormIdentifier] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPeriod, setFormPeriod] = useState('08:00 - 10:00 (ساعتان)');
  const [formHours, setFormHours] = useState(2);
  const [formReason, setFormReason] = useState('');
  const [formIsJustified, setFormIsJustified] = useState(false);
  const [formNotes, setFormNotes] = useState('');

  // Status changes
  const handleUpdateStatus = (id: string, newStatus: AbsenceRecord['status']) => {
    onUpdateAbsences(absences.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleAddAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPersonName.trim()) return;

    const newRec: AbsenceRecord = {
      id: `abs-${Date.now()}`,
      type: formType,
      personName: formPersonName,
      identifier: formIdentifier || (formType === 'teacher' ? 'أستاذ' : 'فوج تربوي'),
      date: formDate,
      period: formPeriod,
      hours: Number(formHours) || 1,
      reason: formReason || (formIsJustified ? 'عذر مقبول' : 'بدون مبرر شرعي'),
      isJustified: formIsJustified,
      status: formIsJustified ? 'justified' : 'warning_sent',
      notes: formNotes
    };

    onUpdateAbsences([newRec, ...absences]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormPersonName('');
    setFormIdentifier('');
    setFormReason('');
    setFormNotes('');
    setFormIsJustified(false);
    setFormHours(2);
  };

  // Generate automated notice for specific absence
  const handleGenerateNotice = (record: AbsenceRecord) => {
    if (record.type === 'teacher') {
      onOpenDocumentGenerator('doc-teacher-explanation', {
        teacherName: record.personName,
        subject: record.identifier,
        absenceDate: record.date,
        periodMissed: record.period,
        classesAffected: record.notes || 'الأفواج المسندة في الحصة',
        deadlineDays: '48 ساعة من تاريخ استلام الإشعار',
        legalReference: 'المادة 207 من الأمر 06-03 المتضمن القانون الأساسي للوظيفة العمومية.',
        consequences: 'يتم تطبيق الخصم التلقائي من الراتب الشهري في حال عدم التبرير القانوني.'
      });
    } else {
      onOpenDocumentGenerator('doc-student-absence-notice', {
        studentName: record.personName,
        classGroup: record.identifier,
        totalAbsenceHours: `${record.hours} ساعات بتاريخ ${record.date}`,
        warningLevel: record.hours >= 4 ? 'إنذار ثاني واستدعاء عاجل' : 'إشعار أول بالغياب',
        meetingDateProposed: 'يوم الخميس القادم الساعة 10:00 صباحاً',
        consequences: 'تطبيق الإجراءات التأديبية المنصوص عليها في القرار 171 والنظام الداخلي للثانوية.'
      });
    }
  };

  const filteredAbsences = absences.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesType;
    return matchesType && (
      item.personName.toLowerCase().includes(term) ||
      item.identifier.toLowerCase().includes(term) ||
      (item.reason && item.reason.toLowerCase().includes(term))
    );
  });

  // Calculate statistics
  const totalTeacherHours = absences.filter(a => a.type === 'teacher').reduce((acc, curr) => acc + curr.hours, 0);
  const totalUnjustified = absences.filter(a => !a.isJustified).length;
  const pendingDeductions = absences.filter(a => a.type === 'teacher' && a.status === 'warning_sent').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <UserX className="w-4 h-4 text-emerald-400" />
              <span>الركن الثالث: راصد المواظبة والغيابات اللحظي</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              راصد الغيابات والمواظبة واستخراج إنذارات الخصم
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              تسجيل الغيابات والتأخرات لحظياً للأساتذة والتلاميذ، مع استخراج تلقائي لاستفسارات الغياب وإنذارات الخصم من الراتب طبقاً للمادة 207 من الأمر 06-03.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:scale-105 border border-[#f5d77f]/40"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل غياب جديد</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-[#0d2818] hover:bg-[#133d25] text-[#f5d77f] text-xs font-bold flex items-center gap-1.5 transition-all border border-[#d4af37]/30"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة سجل المواظبة</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Radar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#05140d] border border-red-900/60 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">غيابات غير مبررة</div>
              <div className="text-2xl font-black text-red-400 mt-1">{totalUnjustified} حالات</div>
              <div className="text-[10px] text-red-300/80 mt-0.5">تتطلب استفساراً أو استدعاء ولي</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">ساعات غياب الأساتذة</div>
              <div className="text-2xl font-black text-[#f5d77f] mt-1">{totalTeacherHours} ساعة</div>
              <div className="text-[10px] text-slate-400 mt-0.5">الحجم الساعي الضائع للشهر</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#082014] border border-[#d4af37]/40 text-[#f5d77f] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05140d] border border-emerald-800/60 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">استفسارات قيد الإجراء</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{pendingDeductions} ملفات</div>
              <div className="text-[10px] text-emerald-300/80 mt-0.5">في انتظار انقضاء 48 ساعة</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#d4af37]/20">
          <div className="flex items-center gap-1 bg-[#05140d] p-1 rounded-xl border border-[#d4af37]/30 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all' ? 'bg-[#105e32] text-[#f5d77f]' : 'text-slate-400 hover:text-white'
              }`}
            >
              الجميع ({absences.length})
            </button>
            <button
              onClick={() => setFilterType('teacher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'teacher' ? 'bg-[#105e32] text-[#f5d77f]' : 'text-slate-400 hover:text-white'
              }`}
            >
              الأساتذة ({absences.filter(a => a.type === 'teacher').length})
            </button>
            <button
              onClick={() => setFilterType('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'student' ? 'bg-[#105e32] text-[#f5d77f]' : 'text-slate-400 hover:text-white'
              }`}
            >
              التلاميذ ({absences.filter(a => a.type === 'student').length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-[#d4af37]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم أو الفوج..."
              className="w-full pl-3 pr-9 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Absences Records Table */}
      <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[#05140d] text-[#f5d77f] border-b border-[#d4af37]/30">
              <tr>
                <th className="p-3.5">النوع</th>
                <th className="p-3.5">الاسم والصفة</th>
                <th className="p-3.5">التاريخ والحصة</th>
                <th className="p-3.5">المدة</th>
                <th className="p-3.5">السبب / المبرر</th>
                <th className="p-3.5">الوضعية القانونية</th>
                <th className="p-3.5 text-center">الإجراء والوثيقة التلقائية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4af37]/15">
              {filteredAbsences.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    لا توجد سجلات غياب مسجلة مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredAbsences.map((record) => {
                  return (
                    <tr key={record.id} className="hover:bg-[#0c2419]/40 transition-colors">
                      <td className="p-3.5 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          record.type === 'teacher'
                            ? 'bg-[#8f1414]/70 text-white border border-red-500/40'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                        }`}>
                          {record.type === 'teacher' ? 'أستاذ' : 'تلميذ'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{record.personName}</div>
                        <div className="text-[11px] text-slate-400">{record.identifier}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="text-white font-medium">{record.date}</div>
                        <div className="text-[11px] text-slate-400">{record.period}</div>
                      </td>

                      <td className="p-3.5 font-bold text-[#f5d77f]">
                        {record.hours} ساعة
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <div className={`font-semibold ${record.isJustified ? 'text-emerald-300' : 'text-red-300'}`}>
                          {record.reason || 'بدون مبرر'}
                        </div>
                        {record.notes && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{record.notes}</div>
                        )}
                      </td>

                      <td className="p-3.5">
                        {record.status === 'justified' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                            <Check className="w-3 h-3" /> مبرر قانوناً
                          </span>
                        )}
                        {record.status === 'warning_sent' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-yellow-300 bg-yellow-950/80 px-2 py-0.5 rounded border border-yellow-800">
                            <Clock className="w-3 h-3" /> تم توجيه الاستفسار
                          </span>
                        )}
                        {record.status === 'deduction_applied' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-300 bg-red-950/90 px-2 py-0.5 rounded border border-red-800">
                            <DollarSign className="w-3 h-3" /> تم تطبيق الخصم
                          </span>
                        )}
                        {record.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                            قيد المعاينة
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleGenerateNotice(record)}
                            className="px-2.5 py-1 rounded bg-[#0d2818] hover:bg-[#133d25] text-[#f5d77f] font-bold text-[11px] border border-[#d4af37]/30 flex items-center gap-1 transition-colors"
                            title={record.type === 'teacher' ? 'توليد استفسار كتابي وإشعار خصم' : 'توليد إشعار غياب واستدعاء ولي'}
                          >
                            <FileText className="w-3 h-3" />
                            <span>استخراج {record.type === 'teacher' ? 'الاستفسار' : 'الإشعار'}</span>
                          </button>

                          {!record.isJustified && (
                            <button
                              onClick={() => handleUpdateStatus(record.id, 'justified')}
                              className="p-1 rounded bg-[#05140d] text-emerald-400 hover:bg-emerald-900 border border-emerald-800 text-[10px]"
                              title="قبول التبرير"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Absence Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#081f14] border-2 border-[#d4af37] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
              <h3 className="font-black text-white text-base">تسجيل غياب أو تأخر في راصد المواظبة</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddAbsence} className="space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#05140d] rounded-lg border border-[#d4af37]/30">
                <button
                  type="button"
                  onClick={() => setFormType('teacher')}
                  className={`py-1.5 rounded text-xs font-bold ${formType === 'teacher' ? 'bg-[#8f1414] text-white' : 'text-slate-400'}`}
                >
                  أستاذ / موظف
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('student')}
                  className={`py-1.5 rounded text-xs font-bold ${formType === 'student' ? 'bg-[#105e32] text-[#f5d77f]' : 'text-slate-400'}`}
                >
                  تلميذ متمدرس
                </button>
              </div>

              {/* Name & Identifier */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {formType === 'teacher' ? 'اسم الأستاذ' : 'اسم التلميذ'}
                  </label>
                  {formType === 'teacher' ? (
                    <select
                      value={formPersonName}
                      onChange={(e) => {
                        setFormPersonName(e.target.value);
                        const t = teachers.find(tch => tch.name === e.target.value);
                        if (t) setFormIdentifier(t.subject);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                      required
                    >
                      <option value="">-- اختر الأستاذ --</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="اسم ولقب التلميذ..."
                      value={formPersonName}
                      onChange={(e) => setFormPersonName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {formType === 'teacher' ? 'المادة والرتبة' : 'الفوج التربوي'}
                  </label>
                  <input
                    type="text"
                    placeholder={formType === 'teacher' ? 'أستاذ الرياضيات' : '3 ع ت 1'}
                    value={formIdentifier}
                    onChange={(e) => setFormIdentifier(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>

              {/* Date, Period & Hours */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تاريخ الغياب</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الفترة والحصة</label>
                  <input
                    type="text"
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(e.target.value)}
                    placeholder="08:00 - 10:00"
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">عدد الساعات</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formHours}
                    onChange={(e) => setFormHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>

              {/* Justification toggle */}
              <div className="flex items-center gap-2 p-2 bg-[#05140d] rounded-lg border border-[#d4af37]/30">
                <input
                  type="checkbox"
                  id="isJustified"
                  checked={formIsJustified}
                  onChange={(e) => setFormIsJustified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="isJustified" className="text-slate-300 font-semibold cursor-pointer">
                  غياب مبرر قانوناً (شهادة طبية، رخصة عائلية للأمر 06-03)
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">السبب أو الملاحظة</label>
                <input
                  type="text"
                  placeholder="سبب الغياب أو الإجراء المتخذ فوراً..."
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-bold"
                >
                  تسجيل الغياب وتحديث الراصد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
