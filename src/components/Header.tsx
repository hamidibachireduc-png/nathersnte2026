import React from 'react';
import { 
  Building2, 
  Calendar, 
  Sliders, 
  Bell, 
  BookOpen, 
  FileText, 
  CalendarDays, 
  UserX, 
  BarChart3, 
  Users, 
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Landmark,
  Calculator,
  MessageSquare,
  CalendarCheck
} from 'lucide-react';
import { InstitutionProfile, SectionType } from '../types';

interface HeaderProps {
  currentSection: SectionType;
  onSelectSection: (section: SectionType) => void;
  institution: InstitutionProfile;
  onOpenSettings: () => void;
  urgentAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onSelectSection,
  institution,
  onOpenSettings,
  urgentAlertsCount
}) => {
  const navItems: { id: SectionType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'الداشبورد الشامل', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'agenda', label: 'مفكرة الناظر', icon: <CalendarCheck className="w-4 h-4" />, badge: 'استحقاقات' },
    { id: 'legislation', label: 'الركن التشريعي 2026', icon: <BookOpen className="w-4 h-4" />, badge: 'تحيين 2026' },
    { id: 'digitalization', label: 'الربط مع الرقمنة', icon: <Globe className="w-4 h-4" />, badge: 'Amatti' },
    { id: 'documents', label: 'حقيبة الوثائق', icon: <FileText className="w-4 h-4" />, badge: 'نماذج A4' },
    { id: 'timetable', label: 'جداول التوقيت', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'absences', label: 'راصد الغيابات', icon: <UserX className="w-4 h-4" />, badge: urgentAlertsCount > 0 ? `${urgentAlertsCount}` : undefined },
    { id: 'results', label: 'محلل النتائج', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'community', label: 'الجماعة التربوية ودليل الاتصال', icon: <MessageSquare className="w-4 h-4" />, badge: 'دليل الاتصال' },
    { id: 'institutes', label: 'المعاهد الوصية', icon: <Landmark className="w-4 h-4" />, badge: '7 هيئات' },
    { id: 'career', label: 'محاكي الدرجات والترقية', icon: <Calculator className="w-4 h-4" /> },
    { id: 'coordination', label: 'فضاء التنسيق', icon: <Users className="w-4 h-4" /> },
  ];

  const activeLogoUrl = institution.logoUrl || '/assets/aistudio/image_98bcc8c9.png';

  return (
    <header className="sticky top-0 z-40 bg-[#071912]/95 backdrop-blur-md border-b border-[#c59a3f]/30 shadow-2xl">
      {/* Top Algerian National & Royal Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8f1414] via-[#d4af37] to-[#105e32]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer" onClick={() => onSelectSection('dashboard')}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-[#8f1414] via-[#d4af37] to-[#105e32] shadow-lg flex items-center justify-center bg-[#06150e]">
                <img 
                  src={activeLogoUrl} 
                  alt="شعار المؤسسة والبوابة الرقمية SNTE" 
                  className="w-full h-full object-contain rounded-full filter drop-shadow hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider text-[#d4af37] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  الجمهورية الجزائرية الديمقراطية الشعبية · المنظومة التربوية
                </span>
                <span className="hidden md:inline-block text-[10px] bg-[#8f1414] text-white px-2 py-0.5 rounded font-bold border border-[#f5d77f]/30">
                  SNTE 2026
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span className="text-white">منصة الناظر</span>
                <span className="text-[#d4af37] text-sm sm:text-lg font-bold">| البوابة الرقمية لمدير الدراسات</span>
              </h1>
              <p className="text-xs text-slate-300 hidden sm:block">
                النموذج القياسي المعتمد للتسيير البيداغوجي، الجداول، الغيابات ومجالس الأقسام
              </p>
            </div>
          </div>

          {/* Institution Status & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Institution Badge */}
            <div className="hidden lg:flex flex-col items-end border-l border-[#d4af37]/20 pl-4 text-right">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{institution.schoolName}</span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-2">
                <span>{institution.wilaya}</span>
                <span>·</span>
                <span className="text-[#e5c158] font-medium">{institution.directorOfStudies}</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#d4af37]" />
                <span>السنة: {institution.schoolYear} (الفصل {institution.currentTerm})</span>
              </div>
            </div>

            {/* School Profile Customizer Button */}
            <button
              onClick={onOpenSettings}
              className="px-3 py-2 text-xs font-bold bg-[#0c2a1c] text-[#e5c158] hover:text-white hover:bg-[#123826] border border-[#d4af37]/40 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
              title="تعديل بيانات المؤسسة وهوية الناظر"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">بيانات المؤسسة</span>
            </button>

            {/* Urgent Alerts Button */}
            <button
              onClick={() => onSelectSection('absences')}
              className="relative p-2.5 bg-[#8f1414]/80 hover:bg-[#a61b1b] text-white border border-[#f5d77f]/40 rounded-lg transition-all shadow-md"
              title={`${urgentAlertsCount} تنبيهات عاجلة تتطلب متابعة الناظر`}
            >
              <Bell className="w-4 h-4" />
              {urgentAlertsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-[#0d2818] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#091512] animate-pulse">
                  {urgentAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 border-t border-[#d4af37]/15 scrollbar-none text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#105e32] via-[#0d4a27] to-[#0a351c] text-[#f5d77f] font-bold border border-[#d4af37]/60 shadow-md ring-1 ring-[#d4af37]/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#0c281b]/70 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-[#f5d77f]' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    item.id === 'absences' && urgentAlertsCount > 0
                      ? 'bg-[#8f1414] text-white'
                      : isActive 
                        ? 'bg-[#d4af37]/20 text-[#f5d77f]' 
                        : 'bg-slate-800 text-slate-300'
                  }`}>
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
