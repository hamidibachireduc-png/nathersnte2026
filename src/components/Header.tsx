import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Calculator,
  UserX,
  CalendarCheck,
  Scale,
  Server,
  FileText,
  Clock,
  BookOpen,
  Building2,
  Award,
  Users,
  ShieldCheck,
  SlidersVertical,
  Bell,
  School,
  Calendar,
  Layers,
  Pencil,
  Check,
  RotateCcw,
  BarChart3,
} from 'lucide-react';
import { EducationStage, InstitutionInfo, SectionId } from '../types';
import { DEFAULT_EMBLEM_URL, STAGE_METADATA } from '../data/initialData';

interface HeaderProps {
  activeStage: EducationStage;
  onSelectStage: (stage: EducationStage) => void;
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  institution: InstitutionInfo;
  onUpdateInstitution?: (updated: InstitutionInfo) => void;
  onOpenSettings: () => void;
  urgentAlertsCount: number;
}

const STAGE_ROLE_PRESETS: Record<EducationStage, string[]> = {
  primary: [
    'ناظر المدرسة الابتدائية',
    'مدير المدرسة الابتدائية',
    'مساعد تربوي بالابتدائي',
    'مساعد المدير للابتدائية',
  ],
  middle: [
    'ناظر المتوسطة',
    'مدير المتوسطة',
    'مساعد تربوي بالمتوسطة',
    'مستشار التربية بالمتوسطة',
  ],
  secondary: [
    'ناظر الثانوية (مدير الدراسات)',
    'مدير الثانوية',
    'مساعد تربوي بالثانوية',
    'مستشار التربية بالثانوية',
  ],
};

export const Header: React.FC<HeaderProps> = ({
  activeStage,
  onSelectStage,
  currentSection,
  onSelectSection,
  institution,
  onUpdateInstitution,
  onOpenSettings,
  urgentAlertsCount,
}) => {
  const stageMeta = STAGE_METADATA[activeStage];
  const activeRoleTitle = institution.customRoleTitle?.trim() || stageMeta.natherTitle;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(activeRoleTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftTitle(institution.customRoleTitle?.trim() || stageMeta.natherTitle);
    setIsEditingTitle(false);
  }, [activeStage, institution.customRoleTitle, stageMeta.natherTitle]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const applyRoleTitle = (newTitle: string) => {
    const cleaned = newTitle.trim() || stageMeta.natherTitle;
    setDraftTitle(cleaned);
    if (onUpdateInstitution) {
      onUpdateInstitution({
        ...institution,
        customRoleTitle: cleaned,
      });
    }
    setIsEditingTitle(false);
  };

  const resetRoleTitle = () => {
    setDraftTitle(stageMeta.natherTitle);
    if (onUpdateInstitution) {
      onUpdateInstitution({
        ...institution,
        customRoleTitle: undefined,
      });
    }
    setIsEditingTitle(false);
  };

  const navItems: { id: SectionId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'الداشبورد الشامل', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'averages',
      label: 'الحساب التلقائي للمعدلات',
      icon: <Calculator className="w-4 h-4" />,
      badge: `سلم /${stageMeta.maxGradeScale}`,
    },
    {
      id: 'absences',
      label: 'متابعة غيابات التلاميذ بمرونة',
      icon: <UserX className="w-4 h-4" />,
      badge: urgentAlertsCount > 0 ? `${urgentAlertsCount} تنبيه` : 'مرن',
    },
    {
      id: 'analytics',
      label: 'تحليلات الأداء والمواظبة',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: 'بياني',
    },
    { id: 'agenda', label: 'مفكرة الناظر', icon: <CalendarCheck className="w-4 h-4" />, badge: 'استحقاقات' },
    { id: 'legislation', label: 'الركن التشريعي 2026', icon: <Scale className="w-4 h-4" />, badge: 'تحيين 2026' },
    { id: 'digitalization', label: 'الربط مع الرقمنة', icon: <Server className="w-4 h-4" />, badge: 'Amatti' },
    { id: 'documents', label: 'حقيبة الوثائق', icon: <FileText className="w-4 h-4" />, badge: 'نماذج A4' },
    {
      id: 'timetable',
      label: 'جداول التوقيت',
      icon: <Clock className="w-4 h-4" />,
      badge: `${stageMeta.teacherWeeklyQuota} س`,
    },
    { id: 'community', label: 'الجماعة التربوية ودليل الاتصال', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'institutes', label: 'المعاهد الوصية', icon: <Building2 className="w-4 h-4" />, badge: '7 هيئات' },
    { id: 'career', label: 'محاكي الدرجات والترقية', icon: <Award className="w-4 h-4" /> },
    { id: 'coordination', label: 'فضاء التنسيق', icon: <Users className="w-4 h-4" /> },
  ];

  const logoSrc = institution.logoUrl || DEFAULT_EMBLEM_URL;

  return (
    <header className="sticky top-0 z-40 bg-[#071912]/95 backdrop-blur-md border-b border-[#c59a3f]/30 shadow-2xl no-print">
      {/* الشريط العلوي بألوان الهوية الوطنية والنقابية */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8f1414] via-[#d4af37] to-[#105e32]" />

      {/* شريط التبديل الفوري بين الأطوار التعليمية الثلاثة (ابتدائي · متوسط · ثانوي) */}
      <div className="bg-[#05120c] border-b border-[#d4af37]/25 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <Layers className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="font-bold text-slate-200">
              اختر الطور التعليمي لتكييف المعادلات، المعاملات، والوثائق تلقائياً:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {(['primary', 'middle', 'secondary'] as EducationStage[]).map((stKey) => {
              const meta = STAGE_METADATA[stKey];
              const isSelected = activeStage === stKey;
              return (
                <button
                  key={stKey}
                  onClick={() => onSelectStage(stKey)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] shadow-md'
                      : 'bg-[#0b2318] text-slate-300 hover:text-white border border-[#d4af37]/30'
                  }`}
                >
                  <span>{meta.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      isSelected
                        ? 'bg-[#071710]/20 text-[#071710] font-black'
                        : 'bg-black/30 text-[#f5d77f]'
                    }`}
                  >
                    سلم /{meta.maxGradeScale}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* الهوية والشعار */}
          <div className="flex items-center gap-3.5">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => onSelectSection('dashboard')}
              title="العودة للداشبورد الشامل"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-[#8f1414] via-[#d4af37] to-[#105e32] shadow-lg flex items-center justify-center bg-[#06150e]">
                <img
                  src={logoSrc}
                  alt="شعار منصة الناظر SNTE 2026"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full filter drop-shadow hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider text-[#d4af37] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>الجمهورية الجزائرية الديمقراطية الشعبية · {stageMeta.name}</span>
                </span>
                <span className="hidden md:inline-block text-[10px] bg-[#8f1414] text-white px-2 py-0.5 rounded font-bold border border-[#f5d77f]/30">
                  SNTE 2026
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 mt-0.5 relative">
                {!isEditingTitle ? (
                  <span
                    onClick={() => setIsEditingTitle(true)}
                    title="انقر لتعديل اللقب يدوياً أو اختيار لقب مخصص (ناظر، مدير، مساعد تربوي)"
                    className="text-white hover:text-[#f5d77f] cursor-pointer inline-flex items-center gap-1.5 border-b border-dashed border-[#d4af37]/60 hover:border-[#f5d77f] pb-0.5 transition-colors group"
                  >
                    <span>منصة {activeRoleTitle}</span>
                    <Pencil className="w-3.5 h-3.5 text-[#d4af37] opacity-75 group-hover:opacity-100 transition-opacity" />
                  </span>
                ) : (
                  <span className="inline-flex flex-col gap-2 bg-[#05140d] border border-[#d4af37] rounded-xl p-2.5 shadow-2xl z-50">
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#d4af37] whitespace-nowrap">منصة</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') applyRoleTitle(draftTitle);
                          if (e.key === 'Escape') setIsEditingTitle(false);
                        }}
                        placeholder="أدخل اللقب الوظيفي..."
                        className="px-2.5 py-1 rounded-lg bg-[#092116] border border-[#d4af37]/60 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#f5d77f] min-w-[180px]"
                      />
                      <button
                        type="button"
                        onClick={() => applyRoleTitle(draftTitle)}
                        title="تثبيت اللقب"
                        className="p-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] hover:brightness-110 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={resetRoleTitle}
                        title="استعادة اللقب الافتراضي للطور"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </span>

                    <span className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-slate-400 ml-1">ألقاب سريعة ({stageMeta.shortName}):</span>
                      {STAGE_ROLE_PRESETS[activeStage].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => applyRoleTitle(preset)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            draftTitle === preset
                              ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]'
                              : 'bg-[#0b2318] text-slate-300 hover:text-white border border-[#d4af37]/30'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </span>
                  </span>
                )}
                <span className="text-[#d4af37] text-xs sm:text-base font-bold">
                  | البوابة الرقمية للأطوار الثلاثة (ابتدائي · متوسط · ثانوي)
                </span>
              </h1>

              <p className="text-xs text-slate-300 hidden sm:block mt-0.5">
                {stageMeta.badgeText}
              </p>
            </div>
          </div>

          {/* بيانات المؤسسة وأزرار التحكم السريع */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden xl:flex flex-col items-end border-l border-[#d4af37]/20 pl-4 text-right">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <School className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{institution.schoolName}</span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-2">
                <span>{institution.wilaya}</span>
                <span>·</span>
                <span className="text-[#e5c158] font-medium">{institution.directorOfStudies}</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 tabular-nums">
                <Calendar className="w-3 h-3 text-[#d4af37]" />
                <span>
                  السنة: {institution.schoolYear} (الفصل {institution.currentTerm})
                </span>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="px-3 py-2 text-xs font-bold bg-[#0c2a1c] text-[#e5c158] hover:text-white hover:bg-[#123826] border border-[#d4af37]/40 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
              title="تعديل بيانات المؤسسة وهوية الناظر"
            >
              <SlidersVertical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">بيانات المؤسسة</span>
            </button>

            <button
              onClick={() => onSelectSection('absences')}
              className="relative p-2.5 bg-[#8f1414]/85 hover:bg-[#a61b1b] text-white border border-[#f5d77f]/40 rounded-lg transition-all shadow-md cursor-pointer shrink-0"
              title={`${urgentAlertsCount} حالات غياب تتطلب متابعة الناظر`}
            >
              <Bell className="w-4 h-4" />
              {urgentAlertsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-[#0d2818] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#091512] tabular-nums">
                  {urgentAlertsCount}
                </span>
              )}
            </button>

            <a
              href="https://hamidibachireduc-png.github.io/sntedz2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#006633] to-[#004d26] text-white font-bold text-xs border border-[#FFD700]/70 shadow hover:scale-[1.02] transition-transform whitespace-nowrap shrink-0"
            >
              <span>العودة للبوابة ↩</span>
            </a>
          </div>
        </div>

        {/* شريط التنقل بين الأقسام الـ 12 */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-[#d4af37]/15 scrollbar-none text-xs sm:text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  item.id === 'career' ? 'hover:scale-105' : ''
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-[#105e32] via-[#0d4a27] to-[#0a351c] text-[#f5d77f] font-bold border border-[#d4af37]/60 shadow-md ring-1 ring-[#d4af37]/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#0c281b]/70 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-[#f5d77f]' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold tabular-nums ${
                      item.id === 'absences' && urgentAlertsCount > 0
                        ? 'bg-[#8f1414] text-white'
                        : item.id === 'averages'
                        ? 'bg-emerald-700/80 text-emerald-100 border border-[#d4af37]/30'
                        : isActive
                        ? 'bg-[#d4af37]/20 text-[#f5d77f]'
                        : 'bg-slate-800/90 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
