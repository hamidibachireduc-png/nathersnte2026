import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Printer,
  Search,
  Filter,
  Bookmark,
  Trash2,
  Award,
  FileText,
  Sparkles,
  Check
} from 'lucide-react';
import { DirectorAgendaItem, InstitutionProfile } from '../types';

interface DirectorAgendaSectionProps {
  institution: InstitutionProfile;
  agendaItems: DirectorAgendaItem[];
  onUpdateAgenda: (items: DirectorAgendaItem[]) => void;
}

export const INITIAL_DIRECTOR_AGENDA: DirectorAgendaItem[] = [
  {
    id: 'ag-1',
    title: 'المراقبة الصباحية لحضور الأساتذة وتكليفات الاستخلاف الفوري (08:00)',
    category: 'daily_weekly',
    dueDate: '2026-03-22',
    periodLabel: 'مهمة يومية (صباحاً ومساءً)',
    priority: 'urgent',
    status: 'in_progress',
    legalReference: 'القرار الوزاري 834 - المادة 6 و 8',
    description: 'ضبط سجل غيابات الأساتذة عند بداية الفترة الصباحية والمسائية، تحرير تكليفات الاستخلاف الفوري للأفواج الشاغرة، ورفع التقرير اليومي لمدير المؤسسة.'
  },
  {
    id: 'ag-2',
    title: 'المراقبة الدورية والتأشير على دفاتر النصوص ومطابقة التدرجات السنوية',
    category: 'daily_weekly',
    dueDate: '2026-03-26',
    periodLabel: 'نهاية كل أسبوع / نصف شهرية',
    priority: 'high',
    status: 'in_progress',
    legalReference: 'القرار الوزاري 834 - المادة 12 + المنشور 19/2026',
    description: 'فحص دفاتر النصوص لجميع الأفواج التربوية، التحقق من تدوين العناوين، الفروض المحروسة وتصحيحها، ومطابقة الحصص المنجزة للتدرج السنوي المفتشي.'
  },
  {
    id: 'ag-3',
    title: 'غلق حجز نقاط الفصل الثاني وتدقيق المعطيات على أرضية الرقمنة (Amatti)',
    category: 'term_councils',
    dueDate: '2026-03-24',
    periodLabel: 'استحقاق نهاية الفصل الثاني',
    priority: 'urgent',
    status: 'upcoming',
    legalReference: 'المنشور الوزاري 112/2026 الخاص بالرقمنة',
    description: 'مراقبة اكتمال صب النقاط والتقديرات لجميع المواد، التأكد من عدم وجود خانات فارغة، وتأشير الإعفاءات الطبية قبل قفل الحجز واستخراج كشوف النقاط.'
  },
  {
    id: 'ag-4',
    title: 'إعداد رزنامة وتحضير ملفات مجالس الأقسام لنهاية الفصل الثاني',
    category: 'term_councils',
    dueDate: '2026-03-25',
    periodLabel: 'مارس 2026 (نهاية الفصل 2)',
    priority: 'urgent',
    status: 'upcoming',
    legalReference: 'القرار الوزاري 157 المنظم لمجالس الأقسام',
    description: 'تحضير الجداول الإحصائية الشاملة للأفواج، كشوف التلاميذ المتعثرين، وملحق تأثير الغيابات لعرضها في مداولات مجالس الأقسام وتدوين محاضر الجلسات.'
  },
  {
    id: 'ag-5',
    title: 'تدقيق القوائم النهائية لمترشحي شهادة البكالوريا واختبارات التربية البدنية (ONEC)',
    category: 'official_exams',
    dueDate: '2026-04-05',
    periodLabel: 'أفريل - ماي 2026',
    priority: 'high',
    status: 'upcoming',
    legalReference: 'مناشير الديوان الوطني للامتحانات والمسابقات ONEC',
    description: 'مطابقة الهويات الرسمية لتلاميذ الأقسام النهائية، ضبط قوائم الكفء والمعفى في التربية البدنية، وتحضير البطاقات التركيبية للتقويم المستمر.'
  },
  {
    id: 'ag-6',
    title: 'تنظيم وإجراء امتحان البكالوريا التجريبي وضبط جداول الحراسة والتصحيح',
    category: 'official_exams',
    dueDate: '2026-05-10',
    periodLabel: 'الأسبوع الثاني من ماي 2026',
    priority: 'high',
    status: 'upcoming',
    legalReference: 'الرزنامة الرسمية للاختبارات الفصلية 2025/2026',
    description: 'استلام مواضيع البكالوريا التجريبية من الأساتذة المنسقين، تصميم مخطط توزيع المترشحين على القاعات، وإصدار جداول حراسة الأساتذة.'
  },
  {
    id: 'ag-7',
    title: 'إيداع ملفات التسجيل في قوائم التأهيل والمسابقات المهنية لرتبة مدير ثانوية / مفتش',
    category: 'career_admin',
    dueDate: '2026-04-15',
    periodLabel: 'استحقاق المسار المهني 2026',
    priority: 'high',
    status: 'in_progress',
    legalReference: 'المرسوم التنفيذي 25-54 المحدث 2026',
    description: 'تجهيز ملف الترقية الاختيارية أو المسابقة المهنية (مقرر التسمية، مجمل الخدمات، تقارير التفتيش، الشهادات العلمية، ومحاضر تأطير المراكز).'
  },
  {
    id: 'ag-8',
    title: 'إعداد مشروع الخريطة التربوية والتنظيم البيداغوجي للموسم الدراسي القادم',
    category: 'career_admin',
    dueDate: '2026-06-15',
    periodLabel: 'جوان 2026 (أعمال نهاية السنة)',
    priority: 'normal',
    status: 'upcoming',
    legalReference: 'القرار الوزاري 834 + منشور الدخول المدرسي',
    description: 'توقع التعدادات حسب المستويات والشعب، حساب المناصب المالية البيداغوجية المفتوحة، وضبط الحاجيات من الكتب المدرسية (ONPS).'
  },
  {
    id: 'ag-9',
    title: 'عقد المجالس التعليمية للمواد مطلع الفصل وضبط خطة المعالجة البيداغوجية',
    category: 'term_councils',
    dueDate: '2026-01-15',
    periodLabel: 'بداية الفصل الدراسي',
    priority: 'normal',
    status: 'completed',
    legalReference: 'القرار الوزاري 172 المنظم للمجالس التعليمية',
    description: 'تم عقد المجالس التعليمية لجميع المواد وتعيين الأساتذة المنسقين وضبط رزنامة الندوات الداخلية وأفواج الدعم.'
  }
];

export const DirectorAgendaSection: React.FC<DirectorAgendaSectionProps> = ({
  institution,
  agendaItems,
  onUpdateAgenda
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // New Agenda Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DirectorAgendaItem['category']>('daily_weekly');
  const [newDueDate, setNewDueDate] = useState('2026-04-01');
  const [newPeriodLabel, setNewPeriodLabel] = useState('استحقاق فصلي');
  const [newPriority, setNewPriority] = useState<DirectorAgendaItem['priority']>('high');
  const [newLegalRef, setNewLegalRef] = useState('القرار الوزاري 834');
  const [newDesc, setNewDesc] = useState('');

  const filteredItems = agendaItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.legalReference.toLowerCase().includes(q);
    return matchesCat && matchesStatus && matchesSearch;
  });

  const completedCount = agendaItems.filter(i => i.status === 'completed').length;
  const inProgressCount = agendaItems.filter(i => i.status === 'in_progress').length;
  const upcomingUrgentCount = agendaItems.filter(i => i.status !== 'completed' && i.priority === 'urgent').length;
  const completionRate = agendaItems.length > 0 ? Math.round((completedCount / agendaItems.length) * 100) : 0;

  const handleToggleStatus = (id: string) => {
    const updated = agendaItems.map(item => {
      if (item.id !== id) return item;
      const nextStatus: DirectorAgendaItem['status'] =
        item.status === 'completed'
          ? 'in_progress'
          : item.status === 'in_progress'
          ? 'completed'
          : 'in_progress';
      return { ...item, status: nextStatus };
    });
    onUpdateAgenda(updated);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateAgenda(agendaItems.filter(i => i.id !== id));
  };

  const handleAddAgendaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created: DirectorAgendaItem = {
      id: `ag-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      dueDate: newDueDate,
      periodLabel: newPeriodLabel.trim() || 'مهمة مبرمجة',
      priority: newPriority,
      status: 'upcoming',
      legalReference: newLegalRef.trim() || 'القرار الوزاري 834',
      description: newDesc.trim() || 'مهمة مبرمجة ضمن رزنامة أعمال الناظر.'
    };
    onUpdateAgenda([created, ...agendaItems]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const getCategoryLabel = (cat: DirectorAgendaItem['category']) => {
    switch (cat) {
      case 'daily_weekly': return 'مهام يومية وأسبوعية';
      case 'term_councils': return 'استحقاقات فصلية ومجالس';
      case 'official_exams': return 'امتحانات رسمية وخريطة تربوية';
      case 'career_admin': return 'المسار المهني والترقية للناظر';
    }
  };

  const getCategoryColor = (cat: DirectorAgendaItem['category']) => {
    switch (cat) {
      case 'daily_weekly': return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'term_councils': return 'bg-amber-950 text-amber-300 border-amber-700';
      case 'official_exams': return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'career_admin': return 'bg-rose-950 text-rose-300 border-rose-700';
    }
  };

  const activeLogoUrl = institution.logoUrl || '/assets/aistudio/image_98bcc8c9.png';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-[#105e32]/40 border border-[#d4af37]/50 p-3.5 rounded-2xl">
              <CalendarCheck className="w-8 h-8 text-[#f5d77f]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#d4af37] text-[#081a12] text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  القرار 834 + المرسوم 25-54 (2026)
                </span>
                <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-700">
                  التخطيط العملياتي لرتبة ناظر ثانوية
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                مفكرة الناظر والرزنامة الشاملة للمهام والاستحقاقات
              </h2>
              <p className="text-slate-300 text-xs mt-1 max-w-3xl leading-relaxed">
                أجندة ذكية لتتبع وتوثيق كافة الالتزامات اليومية، الأسبوعية، الفصلية، والسنوية الخاصة برتبة ناظر الثانوية (مدير الدراسات)، مع تذكير بالآجال القانونية وإمكانية طباعة مخطط العمل الرسمي A4.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مهمة أو استحقاق جديد</span>
            </button>
            <button
              onClick={() => setShowPrintPreview(true)}
              className="px-4 py-2.5 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-white font-bold text-xs flex items-center gap-2 border border-[#f5d77f]/40 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة مفكرة ومخطط الناظر (A4)</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#05140d] border border-[#d4af37]/40">
            <div className="text-[11px] text-slate-400">إجمالي الاستحقاقات المسجلة</div>
            <div className="text-2xl font-black text-white mt-1">{agendaItems.length} محطات</div>
            <div className="text-[10px] text-[#d4af37] mt-0.5">مفهرسة حسب المرجعية القانونية</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-emerald-700/50">
            <div className="text-[11px] text-slate-400">نسبة إنجاز المهام والمحطات</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{completionRate}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{completedCount} مكتملة · {inProgressCount} قيد التنفيذ</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-rose-800/60">
            <div className="text-[11px] text-slate-400">استحقاقات عاجلة وذات أولوية قصوى</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{upcomingUrgentCount} استحقاقات</div>
            <div className="text-[10px] text-rose-300 mt-0.5">تتطلب تأشيراً قبل مجالس الأقسام</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-blue-800/60">
            <div className="text-[11px] text-slate-400">الفترة البيداغوجية الجارية</div>
            <div className="text-base font-black text-[#f5d77f] mt-1.5">الفصل الدراسي {institution.currentTerm} ({institution.schoolYear})</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">متزامن مع الرزنامة الوزارية 2026</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-[#081a12] p-4 rounded-xl border border-[#d4af37]/30 flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#d4af37] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في مهام واستحقاقات الناظر..."
            className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {[
            { id: 'all', label: 'كل الاستحقاقات' },
            { id: 'daily_weekly', label: 'يومية وأسبوعية' },
            { id: 'term_councils', label: 'فصلية ومجالس الأقسام' },
            { id: 'official_exams', label: 'امتحانات رسمية وخريطة' },
            { id: 'career_admin', label: 'المسار المهني والترقية' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/50'
                  : 'bg-[#05140d] text-slate-300 hover:text-white border border-[#d4af37]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 w-full lg:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
          {[
            { id: 'all', label: 'الكل' },
            { id: 'in_progress', label: 'قيد التنفيذ' },
            { id: 'upcoming', label: 'مبرمجة' },
            { id: 'completed', label: 'منجزة' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                selectedStatus === st.id
                  ? 'bg-[#8f1414] text-white border border-[#f5d77f]/40'
                  : 'bg-[#05140d] text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agenda Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl bg-[#081a12] border p-5 shadow-lg flex flex-col justify-between transition-all ${
              item.status === 'completed'
                ? 'border-emerald-800/60 opacity-85'
                : item.priority === 'urgent'
                ? 'border-[#8f1414] ring-1 ring-[#8f1414]/40'
                : 'border-[#d4af37]/30 hover:border-[#d4af37]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${getCategoryColor(item.category)}`}>
                    {getCategoryLabel(item.category)}
                  </span>
                  {item.priority === 'urgent' && item.status !== 'completed' && (
                    <span className="bg-[#8f1414] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      أولوية قصوى
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-mono text-[#f5d77f] bg-[#05140d] px-2.5 py-0.5 rounded border border-[#d4af37]/20 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#d4af37]" />
                  {item.dueDate}
                </span>
              </div>

              <h3 className={`text-base font-black ${item.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#05140d] p-3 rounded-lg border border-[#d4af37]/15">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-[#d4af37] font-semibold">
                  <Bookmark className="w-3.5 h-3.5" />
                  المرجع: {item.legalReference}
                </span>
                <span>الدورية: {item.periodLabel}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#d4af37]/20 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  item.status === 'completed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : item.status === 'in_progress'
                    ? 'bg-amber-950 text-amber-300 border border-amber-700 hover:bg-emerald-900'
                    : 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40 hover:bg-[#157841]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {item.status === 'completed'
                    ? 'مهمة منجزة ومؤشرة (انقر للتغيير)'
                    : item.status === 'in_progress'
                    ? 'قيد الإنجاز — انقر لتأشير الاكتمال'
                    : 'مبرمجة — انقر للبدء أو التأشير'}
                </span>
              </button>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1.5 rounded-lg bg-[#05140d] hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="حذف المهمة من المفكرة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Agenda Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#081a12] border-2 border-[#d4af37] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>إدراج استحقاق أو مهمة جديدة في مفكرة الناظر</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">
                إغلاق
              </button>
            </div>

            <form onSubmit={handleAddAgendaItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">عنوان المهمة أو الاستحقاق</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: مراقبة وتوقيع كشوف نقاط الاختبار الاستدراكي"
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">تصنيف الاستحقاق</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DirectorAgendaItem['category'])}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                  >
                    <option value="daily_weekly">مهام يومية وأسبوعية</option>
                    <option value="term_councils">استحقاقات فصلية ومجالس</option>
                    <option value="official_exams">امتحانات رسمية وخريطة تربوية</option>
                    <option value="career_admin">المسار المهني والترقية للناظر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">الدورية / الفترة</label>
                  <input
                    type="text"
                    value={newPeriodLabel}
                    onChange={(e) => setNewPeriodLabel(e.target.value)}
                    placeholder="مثال: نهاية الفصل الثاني"
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">درجة الأولوية</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as DirectorAgendaItem['priority'])}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                  >
                    <option value="urgent">مستعجل وأولوية قصوى</option>
                    <option value="high">هام</option>
                    <option value="normal">عادي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">المرجع التشريعي أو التنظيمي</label>
                <input
                  type="text"
                  value={newLegalRef}
                  onChange={(e) => setNewLegalRef(e.target.value)}
                  placeholder="مثال: القرار الوزاري 834 - المادة 14"
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">تفاصيل الإجراءات والعمليات</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="وصف مختصر للترتيبات المطلوبة من طرف الناظر..."
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-black cursor-pointer"
                >
                  حفظ في المفكرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Official Agenda Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#081a12] border-2 border-[#d4af37] rounded-2xl max-w-4xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#d4af37]/30 no-print">
              <h3 className="font-black text-white text-sm">
                معاينة طباعة مفكرة ورزنامة الاستحقاقات الرسمية للناظر (A4)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-[#8f1414] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة فورية A4</span>
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="printable-document bg-white text-slate-900 rounded-xl p-8 border-2 border-slate-900 space-y-5">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h2 className="text-base font-black">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
                <h3 className="text-sm font-bold">وزارة التربية الوطنية</h3>
                <div className="flex items-center justify-between text-xs font-bold mt-3">
                  <div className="text-right">
                    <div>مديرية التربية لـ: {institution.wilaya}</div>
                    <div>المؤسسة: {institution.schoolName}</div>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img src={activeLogoUrl} alt="شعار المؤسسة" className="w-14 h-14 object-contain" />
                  </div>
                  <div className="text-left">
                    <div>السنة الدراسية: {institution.schoolYear}</div>
                    <div>الناظر: {institution.directorOfStudies}</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block border-2 border-slate-900 px-6 py-2 bg-slate-50 font-black text-base text-[#0f4d2a]">
                  مفكرة ورزنامة المهام والاستحقاقات البيداغوجية والإدارية لناظر الثانوية
                </span>
              </div>

              <table className="w-full text-right border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 font-black">
                    <th className="border border-slate-900 p-2">المهمة / الاستحقاق</th>
                    <th className="border border-slate-900 p-2">التصنيف</th>
                    <th className="border border-slate-900 p-2">التاريخ / الفترة</th>
                    <th className="border border-slate-900 p-2">المرجع القانوني</th>
                    <th className="border border-slate-900 p-2">الوضعية</th>
                  </tr>
                </thead>
                <tbody>
                  {agendaItems.map(item => (
                    <tr key={item.id} className="border-b border-slate-400">
                      <td className="border border-slate-400 p-2 font-bold">{item.title}</td>
                      <td className="border border-slate-400 p-2">{getCategoryLabel(item.category)}</td>
                      <td className="border border-slate-400 p-2">{item.dueDate} ({item.periodLabel})</td>
                      <td className="border border-slate-400 p-2">{item.legalReference}</td>
                      <td className="border border-slate-400 p-2 font-bold">
                        {item.status === 'completed' ? 'منجزة' : item.status === 'in_progress' ? 'قيد التنفيذ' : 'مبرمجة'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 pt-6 text-xs font-black text-center">
                <div>
                  <p>ناظر الثانوية / مدير الدراسات</p>
                  <p className="mt-1 text-slate-700">{institution.directorOfStudies}</p>
                </div>
                <div>
                  <p>إطلاع ومصادقة مدير الثانوية</p>
                  <p className="mt-4 text-[#8f1414]">[الختم والتوقيع الرسمي]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
