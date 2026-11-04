import React, { useState, useRef } from 'react';
import { Sliders, Building2, MapPin, UserCheck, Calendar, ImagePlus, RotateCcw, CheckCircle2 } from 'lucide-react';
import { InstitutionProfile } from '../types';

interface InstitutionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionProfile;
  onSave: (updated: InstitutionProfile) => void;
}

const DEFAULT_LOGO = '/assets/aistudio/image_98bcc8c9.png';

export const InstitutionSettingsModal: React.FC<InstitutionSettingsModalProps> = ({
  isOpen,
  onClose,
  institution,
  onSave
}) => {
  const [schoolName, setSchoolName] = useState(institution.schoolName);
  const [wilaya, setWilaya] = useState(institution.wilaya);
  const [directorOfStudies, setDirectorOfStudies] = useState(institution.directorOfStudies);
  const [schoolYear, setSchoolYear] = useState(institution.schoolYear);
  const [currentTerm, setCurrentTerm] = useState<1 | 2 | 3>(institution.currentTerm);
  const [logoUrl, setLogoUrl] = useState<string>(institution.logoUrl || DEFAULT_LOGO);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      schoolName,
      wilaya,
      directorOfStudies,
      schoolYear,
      currentTerm,
      logoUrl: logoUrl || DEFAULT_LOGO
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#081f14] border-2 border-[#d4af37] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-white text-base">
              تخصيص بيانات المؤسسة وأيقونة ترويسة الوثائق الرسمية
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          تنعكس هذه البيانات وأيقونة المؤسسة تلقائياً على كافة الترويسات الرسمية للجمهورية الجزائرية، الوثائق البيداغوجية، الاستدعاءات، ومحاضر مجالس الأقسام عند المعاينة والطباعة A4 أو التحميل بصيغة Word.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Institution Logo / Emblem Uploader for Document Headers */}
          <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[#f5d77f] font-black flex items-center gap-1.5">
                <ImagePlus className="w-4 h-4 text-[#d4af37]" />
                <span>صورة الأيقونة / الشعار الخاص بالمؤسسة على ترويسة الوثائق</span>
              </label>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 font-bold">
                يظهر في ترويسة A4 و Word
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Live Header Emblem Preview */}
              <div className="w-20 h-20 rounded-xl bg-white p-2 border-2 border-[#d4af37] shadow-md flex items-center justify-center shrink-0">
                <img
                  src={logoUrl || DEFAULT_LOGO}
                  alt="شعار المؤسسة"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  قم برفع شعار الثانوية أو مديرية التربية (PNG / JPG / SVG) ليتم اعتماده في منتصف ترويسة جميع الوثائق والمحاضر الرسمية المطبوعة.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-lg bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] font-bold border border-[#d4af37]/40 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>رفع شعار / أيقونة المؤسسة من الجهاز</span>
                  </button>

                  {logoUrl !== DEFAULT_LOGO && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl(DEFAULT_LOGO)}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة الشعار الافتراضي</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>اسم المؤسسة التعليمية (الثانوية)</span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="مثال: ثانوية الشهيد زيغود يوسف"
              className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>الولاية والمديرية المعنية</span>
            </label>
            <input
              type="text"
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              placeholder="مثال: ولاية قسنطينة (025)"
              className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>اسم ولقب ناظر الثانوية / مدير الدراسات</span>
            </label>
            <input
              type="text"
              value={directorOfStudies}
              onChange={(e) => setDirectorOfStudies(e.target.value)}
              placeholder="مثال: الأستاذ عبد الرزاق بوقرة"
              className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>السنة الدراسية</span>
              </label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                placeholder="2025 / 2026"
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">الفصل الدراسي النشط</label>
              <select
                value={currentTerm}
                onChange={(e) => setCurrentTerm(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none"
              >
                <option value={1}>الفصل الأول</option>
                <option value={2}>الفصل الثاني</option>
                <option value={3}>الفصل الثالث</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ بيانات وشعار المؤسسة</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
