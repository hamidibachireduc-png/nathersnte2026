import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  RotateCcw,
  School,
  MapPin,
  UserCheck,
  Calendar,
  Check,
  Layers,
} from 'lucide-react';
import { EducationStage, InstitutionInfo } from '../types';
import { DEFAULT_EMBLEM_URL, STAGE_METADATA } from '../data/initialData';

interface InstitutionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionInfo;
  onSave: (updated: InstitutionInfo) => void;
  onSwitchStage: (stage: EducationStage) => void;
}

export const InstitutionSettingsModal: React.FC<InstitutionSettingsModalProps> = ({
  isOpen,
  onClose,
  institution,
  onSave,
  onSwitchStage,
}) => {
  const [schoolName, setSchoolName] = useState(institution.schoolName);
  const [wilaya, setWilaya] = useState(institution.wilaya);
  const [directorOfStudies, setDirectorOfStudies] = useState(institution.directorOfStudies);
  const [schoolYear, setSchoolYear] = useState(institution.schoolYear);
  const [currentTerm, setCurrentTerm] = useState<1 | 2 | 3>(institution.currentTerm);
  const [logoUrl, setLogoUrl] = useState(institution.logoUrl || DEFAULT_EMBLEM_URL);

  useEffect(() => {
    if (isOpen) {
      setSchoolName(institution.schoolName);
      setWilaya(institution.wilaya);
      setDirectorOfStudies(institution.directorOfStudies);
      setSchoolYear(institution.schoolYear);
      setCurrentTerm(institution.currentTerm);
      setLogoUrl(institution.logoUrl || DEFAULT_EMBLEM_URL);
    }
  }, [isOpen, institution]);

  if (!isOpen) return null;

  const stageMeta = STAGE_METADATA[institution.stage];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      stage: institution.stage,
      schoolName,
      wilaya,
      directorOfStudies,
      schoolYear,
      currentTerm,
      logoUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[#091e14] border border-[#d4af37]/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#06150e] border-b border-[#d4af37]/30">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              تخصيص بيانات {stageMeta.institutionLabel} والطور التعليمي
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تنعكس هذه البيانات تلقائياً على كشوف النقاط، استدعاءات الغياب، ومحاضر المجالس A4
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* اختيار الطور التعليمي */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>الطور التعليمي النشط (يخصص المعادلات والمعاملات تلقائياً):</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['primary', 'middle', 'secondary'] as EducationStage[]).map((st) => {
                const meta = STAGE_METADATA[st];
                const isSelected = institution.stage === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onSwitchStage(st)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] border-[#d4af37] font-black shadow'
                        : 'bg-[#05140d] text-slate-300 border-[#d4af37]/30 hover:text-white'
                    }`}
                  >
                    <div>{meta.name}</div>
                    <div className="text-[10px] opacity-80">سلم /{meta.maxGradeScale}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* رفع شعار المؤسسة */}
          <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/30 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-white p-1.5 border-2 border-[#d4af37] flex items-center justify-center shrink-0">
              <img
                src={logoUrl || DEFAULT_EMBLEM_URL}
                alt="شعار المؤسسة"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-right">
              <div className="font-bold text-white text-xs">
                صورة الأيقونة / الشعار الخاص بـ {stageMeta.institutionLabel} على ترويسة الوثائق
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <label className="px-3 py-1.5 rounded-lg bg-[#105e32] hover:bg-[#14753e] text-[#f5d77f] font-bold text-xs border border-[#d4af37]/40 flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع شعار من الجهاز</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => setLogoUrl(DEFAULT_EMBLEM_URL)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة الشعار الافتراضي</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>اسم المؤسسة التعليمية ({stageMeta.institutionLabel})</span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>الولاية ومديرية التربية المعنية</span>
            </label>
            <input
              type="text"
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>اسم ولقب {stageMeta.natherTitle}</span>
            </label>
            <input
              type="text"
              value={directorOfStudies}
              onChange={(e) => setDirectorOfStudies(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>السنة الدراسية</span>
              </label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">الفصل الدراسي النشط</label>
              <select
                value={currentTerm}
                onChange={(e) => setCurrentTerm(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-medium focus:outline-none focus:border-[#d4af37]"
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
              <Check className="w-4 h-4" />
              <span>حفظ بيانات وشعار المؤسسة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
