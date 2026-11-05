import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Printer,
  Search,
  Check,
  Clock,
  AlertTriangle,
  Trash2,
  X,
} from 'lucide-react';
import { InstitutionInfo, AgendaTask, EducationStage } from '../types';
import { DEFAULT_EMBLEM_URL, STAGE_METADATA } from '../data/initialData';

interface AgendaViewProps {
  institution: InstitutionInfo;
  agendaItems: AgendaTask[];
  onUpdateAgenda: (items: AgendaTask[]) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  institution,
  agendaItems,
  onUpdateAgenda,
}) => {
  const activeStage: EducationStage = institution.stage;
  const stageMeta = STAGE_METADATA[activeStage];

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'daily' | 'term' | 'bem_exams' | 'career'>('term');
  const [newDueDate, setNewDueDate] = useState('مارس 2026');
  const [newPeriodLabel, setNewPeriodLabel] = useState('نهاية الفصل الثاني');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'normal'>('urgent');
  const [newLegalRef, setNewLegalRef] = useState('المرسوم التنفيذي 25-54 + القرار 157');
  const [newDesc, setNewDesc] = useState('');

  // المهام الخاصة بالطور المختار أو المشتركة بين الأطوار الثلاثة
  const stageAgendaItems = agendaItems.filter(
    (item) => item.stage === activeStage || item.stage === 'all'
  );

  const filteredItems = stageAgendaItems.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (
      searchQuery.trim() &&
      !item.title.includes(searchQuery.trim()) &&
      !item.description.includes(searchQuery.trim())
    ) {
      return false;
    }
    return true;
  });

  const handleCycleStatus = (id: string) => {
    const nextMap: Record<AgendaTask['status'], AgendaTask['status']> = {
      scheduled: 'in_progress',
      in_progress: 'completed',
      completed: 'scheduled',
    };
    onUpdateAgenda(
      agendaItems.map((item) =>
        item.id === id ? { ...item, status: nextMap[item.status] } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    onUpdateAgenda(agendaItems.filter((i) => i.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created: AgendaTask = {
      id: `ag-${Date.now()}`,
      stage: activeStage,
      title: newTitle.trim(),
      category: newCategory,
      dueDate: newDueDate,
      periodLabel: newPeriodLabel,
      priority: newPriority,
      legalRef: newLegalRef,
      description:
        newDesc.trim() || `مهمة مبرمجة ضمن رزنامة أعمال ${stageMeta.natherTitle}.`,
      status: 'scheduled',
    };
    onUpdateAgenda([created, ...agendaItems]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const completedCount = stageAgendaItems.filter((i) => i.status === 'completed').length;
  const inProgressCount = stageAgendaItems.filter((i) => i.status === 'in_progress').length;
  const urgentCount = stageAgendaItems.filter(
    (i) => i.priority === 'urgent' && i.status !== 'completed'
  ).length;
  const logoSrc = institution.logoUrl || DEFAULT_EMBLEM_URL;

  const categoryLabels: Record<AgendaTask['category'], string> = {
    daily: 'مهام يومية وأسبوعية',
    term: 'استحقاقات فصلية ومجالس الأقسام',
    bem_exams: `${stageMeta.nationalExamName} والخريطة التربوية`,
    career: 'المسار المهني والترقية للناظر',
  };

  return (
    <div className="space-y-6">
      {/* الترويسة */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white font-bold">
              التخطيط العملياتي — {stageMeta.natherTitle} ({stageMeta.name})
            </span>
            <span className="text-[#d4af37] font-semibold">
              المرسوم التنفيذي 25-54 + القرار 157 (2026)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-[#d4af37]" />
            <span>مفكرة {stageMeta.natherTitle} والرزنامة الشاملة للمهام والاستحقاقات</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            أجندة تفاعلية لتتبع وتوثيق كافة الالتزامات اليومية، الأسبوعية، الفصلية، وتحضير{' '}
            {stageMeta.nationalExamName} مع إمكانية طباعة مخطط العمل الرسمي A4.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة للطور</span>
          </button>
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2 rounded-xl bg-[#105e32] hover:bg-[#14753e] text-[#f5d77f] border border-[#d4af37]/50 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة مفكرة الناظر (A4)</span>
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#081a12] border border-[#d4af37]/40">
          <div className="text-xs text-slate-400">إجمالي الاستحقاقات ({stageMeta.shortName})</div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            {stageAgendaItems.length} محطات
          </div>
          <div className="text-[11px] text-[#d4af37] mt-0.5">مفهرسة حسب المرجعية القانونية</div>
        </div>
        <div className="p-4 rounded-xl bg-[#081a12] border border-emerald-700/50">
          <div className="text-xs text-slate-400">نسبة إنجاز المهام والمحطات</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">
            {stageAgendaItems.length > 0
              ? Math.round((completedCount / stageAgendaItems.length) * 100)
              : 0}
            %
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5 tabular-nums">
            {completedCount} مكتملة · {inProgressCount} قيد التنفيذ
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#081a12] border border-rose-800/60">
          <div className="text-xs text-slate-400">استحقاقات عاجلة وذات أولوية قصوى</div>
          <div className="text-2xl font-black text-rose-400 mt-1 tabular-nums">
            {urgentCount} استحقاقات
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5">تتطلب تأشيراً قبل مجالس الأقسام</div>
        </div>
        <div className="p-4 rounded-xl bg-[#081a12] border border-amber-700/50">
          <div className="text-xs text-slate-400">الفترة البيداغوجية الجارية</div>
          <div className="text-2xl font-black text-[#f5d77f] mt-1">
            الفصل الدراسي {institution.currentTerm}
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5">متزامن مع الرزنامة الوزارية 2026</div>
        </div>
      </div>

      {/* شريط الفلترة والبحث */}
      <div className="p-4 rounded-xl bg-[#091e14] border border-[#d4af37]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'كل الاستحقاقات' },
            { id: 'daily', label: 'يومية وأسبوعية' },
            { id: 'term', label: 'فصلية ومجالس الأقسام' },
            { id: 'bem_exams', label: stageMeta.nationalExamName },
            { id: 'career', label: 'المسار المهني والترقية' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/50'
                  : 'bg-[#06150e] text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
          >
            <option value="all">جميع الحالات</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="scheduled">مبرمجة</option>
            <option value="completed">منجزة</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في مهام الناظر..."
              className="pr-8 pl-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* قائمة المهام */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#081a12] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => handleCycleStatus(item.id)}
                title="انقر لتغيير حالة الإنجاز"
                className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border cursor-pointer transition-colors ${
                  item.status === 'completed'
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : item.status === 'in_progress'
                    ? 'bg-amber-600 border-amber-300 text-white'
                    : 'bg-[#05140d] border-[#d4af37]/50 text-slate-400'
                }`}
              >
                {item.status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : item.status === 'in_progress' ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : null}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="text-[#d4af37] font-bold">{categoryLabels[item.category]}</span>
                  <span>·</span>
                  <span className="text-emerald-300 font-semibold">المرجع: {item.legalRef}</span>
                  <span>·</span>
                  <span className="text-slate-400">الدورية: {item.periodLabel}</span>
                  {item.priority === 'urgent' && (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      أولوية قصوى
                    </span>
                  )}
                </div>
                <h4
                  className={`text-sm sm:text-base font-black ${
                    item.status === 'completed' ? 'line-through text-slate-400' : 'text-white'
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
              <span className="font-mono text-xs font-bold text-[#f5d77f] tabular-nums">
                {item.dueDate}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCycleStatus(item.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    item.status === 'completed'
                      ? 'bg-emerald-800/70 text-emerald-200'
                      : item.status === 'in_progress'
                      ? 'bg-amber-700/80 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.status === 'completed'
                    ? 'منجزة ومؤشرة'
                    : item.status === 'in_progress'
                    ? 'قيد الإنجاز'
                    : 'مبرمجة'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white cursor-pointer"
                  title="حذف المهمة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة إضافة مهمة */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#091e14] border border-[#d4af37]/50 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#06150e] border-b border-[#d4af37]/30">
              <h3 className="text-base font-black text-white">
                إدراج استحقاق أو مهمة جديدة في مفكرة {stageMeta.natherTitle}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  عنوان المهمة أو الاستحقاق
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: مراقبة وتوقيع كشوف نقاط الفصل الثاني"
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تصنيف الاستحقاق</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AgendaTask['category'])}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    <option value="daily">مهام يومية وأسبوعية</option>
                    <option value="term">استحقاقات فصلية ومجالس</option>
                    <option value="bem_exams">{stageMeta.nationalExamName}</option>
                    <option value="career">المسار المهني والترقية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">درجة الأولوية</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as AgendaTask['priority'])}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    <option value="urgent">مستعجل وأولوية قصوى</option>
                    <option value="high">هام</option>
                    <option value="normal">عادي</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المرجع التشريعي</label>
                  <input
                    type="text"
                    value={newLegalRef}
                    onChange={(e) => setNewLegalRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  تفاصيل الإجراءات والعمليات
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black cursor-pointer"
                >
                  حفظ في المفكرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة معاينة الطباعة A4 */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8 rounded-2xl bg-[#091e14] border border-[#d4af37] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#06150e] border-b border-[#d4af37]/40 no-print">
              <h3 className="text-base font-black text-white">
                معاينة طباعة مفكرة ورزنامة الاستحقاقات الرسمية لـ {stageMeta.natherTitle} (A4)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة فورية A4</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="p-8 bg-white text-black font-['Cairo',sans-serif] print-only-sheet space-y-5 text-xs">
              <div className="text-center border-b-2 border-black pb-4 space-y-1">
                <div className="text-base font-bold">الجمهورية الجزائرية الديمقراطية الشعبية</div>
                <div className="text-sm font-bold">وزارة التربية الوطنية — {stageMeta.name}</div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-right">
                    <div>مديرية التربية لـ: {institution.wilaya}</div>
                    <div>
                      {stageMeta.institutionLabel}: {institution.schoolName}
                    </div>
                  </div>
                  <img
                    src={logoSrc}
                    alt="شعار المؤسسة"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain rounded-full border border-black p-0.5"
                  />
                  <div className="text-left">
                    <div>السنة الدراسية: {institution.schoolYear}</div>
                    <div>
                      {stageMeta.natherTitle}: {institution.directorOfStudies}
                    </div>
                  </div>
                </div>
                <h2 className="text-base font-black pt-2">
                  مفكرة ورزنامة المهام والاستحقاقات البيداغوجية والإدارية لـ {stageMeta.natherTitle}
                </h2>
              </div>

              <table className="w-full border-collapse border border-black text-right">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="border border-black py-2 px-2">المهمة / الاستحقاق</th>
                    <th className="border border-black py-2 px-2">التصنيف</th>
                    <th className="border border-black py-2 px-2">التاريخ / الفترة</th>
                    <th className="border border-black py-2 px-2">المرجع القانوني</th>
                    <th className="border border-black py-2 px-2 text-center">الوضعية</th>
                  </tr>
                </thead>
                <tbody>
                  {stageAgendaItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-black py-1.5 px-2 font-bold">{item.title}</td>
                      <td className="border border-black py-1.5 px-2">
                        {categoryLabels[item.category]}
                      </td>
                      <td className="border border-black py-1.5 px-2 tabular-nums">
                        {item.dueDate}
                      </td>
                      <td className="border border-black py-1.5 px-2">{item.legalRef}</td>
                      <td className="border border-black py-1.5 px-2 text-center font-bold">
                        {item.status === 'completed'
                          ? 'منجزة'
                          : item.status === 'in_progress'
                          ? 'قيد التنفيذ'
                          : 'مبرمجة'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-6 pt-6 text-center font-bold">
                <div>
                  <div>
                    {stageMeta.natherTitle} ({institution.directorOfStudies})
                  </div>
                  <div className="mt-8 text-slate-500">[التوقيع الرسمي]</div>
                </div>
                <div>
                  <div>إطلاع ومصادقة مدير {stageMeta.institutionLabel}</div>
                  <div className="mt-8 text-slate-500">[الختم والتوقيع الرسمي]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
