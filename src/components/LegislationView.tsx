import React, { useState } from 'react';
import { Scale, Search, Copy, CheckCircle2, BookOpen, FileCheck } from 'lucide-react';
import { LEGISLATIVE_TEXTS, STAGE_METADATA } from '../data/initialData';
import { LegislativeText, EducationStage } from '../types';

interface LegislationViewProps {
  activeStage?: EducationStage;
}

export const LegislationView: React.FC<LegislationViewProps> = ({ activeStage = 'middle' }) => {
  const stageMeta = STAGE_METADATA[activeStage];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedText, setSelectedText] = useState<LegislativeText>(LEGISLATIVE_TEXTS[0]);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const filteredTexts = LEGISLATIVE_TEXTS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (
      searchQuery.trim() &&
      !item.title.includes(searchQuery.trim()) &&
      !item.description.includes(searchQuery.trim()) &&
      !item.fullText.includes(searchQuery.trim())
    ) {
      return false;
    }
    return true;
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2 text-xs mb-1.5">
          <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white font-bold">
            المرجعية القانونية والتشريعية للأطوار الثلاثة ({stageMeta.name} — تحيين 2026)
          </span>
          <span className="text-[#d4af37] font-semibold">
            المرسوم التنفيذي 25-54 · القرار 157 · القرار 171 · المنشور 112/2026
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-[#d4af37]" />
          <span>الركن التشريعي والتنظيمي الشامل لنظار الأطوار التعليمية الثلاثة</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
          موسوعة النصوص القانونية والمراسيم التنفيذية والقرارات الوزارية المؤطرة لمهام الناظر في الابتدائي والمتوسط والثانوي، حساب المعدلات، مواظبة التلاميذ، والامتحانات الرسمية مع خاصية النسخ المباشر للمواد القانونية.
        </p>
      </div>

      {/* شريط الفلترة والبحث */}
      <div className="p-4 rounded-xl bg-[#091e14] border border-[#d4af37]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `جميع النصوص المرجعية (${LEGISLATIVE_TEXTS.length})` },
            { id: 'decree', label: 'المراسيم والقانون الأساسي 25-54' },
            { id: 'decision', label: 'قرارات المجالس والمواظبة (157 / 171)' },
            { id: 'digital_2026', label: 'الرقمنة وحساب المعدلات 2026' },
            { id: 'bem_2026', label: 'الامتحانات الرسمية (مكتسبات / BEM / BAC)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/50'
                  : 'bg-[#06150e] text-slate-300 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المواد والنصوص القانونية..."
            className="pr-8 pl-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* القائمة الجانبية للنصوص */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTexts.map((item) => {
            const isSelected = selectedText.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedText(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-l from-[#103824] to-[#081a12] border-[#d4af37] shadow-lg'
                    : 'bg-[#081a12] border-[#d4af37]/25 hover:border-[#d4af37]/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#d4af37] font-bold mb-1">
                  <span>{item.number}</span>
                  {item.isUpdated2026 && (
                    <span className="text-emerald-300 font-semibold">تحيين 2026</span>
                  )}
                </div>
                <h4 className="text-sm font-black text-white leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* تفاصيل النص المختار والمواد القانونية */}
        <div className="lg:col-span-7 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 shadow-2xl space-y-5">
          <div className="border-b border-[#d4af37]/20 pb-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#f5d77f]">{selectedText.number}</span>
              <span className="text-xs text-slate-400">{selectedText.date}</span>
            </div>
            <h3 className="text-lg font-black text-white">{selectedText.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedText.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#d4af37] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>النص القانوني المرجعي الكامل</span>
              </h4>
              <button
                onClick={() => handleCopy(selectedText.fullText, 'النص الكامل')}
                className="px-3 py-1 rounded-lg bg-[#105e32] hover:bg-[#14753e] text-[#f5d77f] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLabel === 'النص الكامل' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>
                  {copiedLabel === 'النص الكامل' ? 'تم النسخ!' : 'نسخ النص للاستدلال الإداري'}
                </span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/30 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {selectedText.fullText}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-emerald-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" />
              <span>أبرز المواد الإجرائية الخاصة بـ {stageMeta.natherTitle}:</span>
            </h4>
            <div className="space-y-2.5">
              {selectedText.keyArticles.map((art) => (
                <div
                  key={art.articleNumber}
                  className="p-3.5 rounded-xl bg-[#06150e] border border-[#d4af37]/25 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#f5d77f]">
                      {art.articleNumber} — {art.summary}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(`${art.articleNumber}: ${art.text}`, art.articleNumber)
                      }
                      className="text-[11px] text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>
                        {copiedLabel === art.articleNumber ? 'تم النسخ' : 'نسخ المادة'}
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{art.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
