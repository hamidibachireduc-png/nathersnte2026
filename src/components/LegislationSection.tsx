import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Tag, 
  ExternalLink, 
  Copy, 
  Check, 
  Printer, 
  FileCheck2, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Bookmark
} from 'lucide-react';
import { LawItem } from '../types';
import { LEGISLATION_DATABASE } from '../data/legislationData';

interface LegislationSectionProps {
  onPrintOfficialDocument?: (title: string, content: string) => void;
}

export const LegislationSection: React.FC<LegislationSectionProps> = ({ onPrintOfficialDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedLawId, setExpandedLawId] = useState<string | null>('decree-25-54-2026');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'جميع النصوص القانونية (2026)' },
    { id: 'updated_2026', label: 'مستجدات وتحيينات 2026' },
    { id: 'digital_2026', label: 'تشريعات الرقمنة التربوية' },
    { id: 'decree', label: 'مراسيم تنفيذية (25-54 / 08-315)' },
    { id: 'decision', label: 'قرارات وزارية والجماعة التربوية' },
    { id: 'circular', label: 'مناشير الامتحانات الرسمية' },
    { id: 'civil_service', label: 'الوظيفة العمومية والدرجات' },
  ];

  const filteredLaws = LEGISLATION_DATABASE.filter(law => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'updated_2026' ? Boolean(law.isUpdated2026) : law.category === selectedCategory);
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesCategory;

    const matchesSearch = 
      law.title.toLowerCase().includes(term) ||
      law.number.toLowerCase().includes(term) ||
      law.description.toLowerCase().includes(term) ||
      law.fullText.toLowerCase().includes(term) ||
      law.tags.some(tag => tag.toLowerCase().includes(term)) ||
      law.keyArticles.some(art => art.summary.toLowerCase().includes(term) || art.text.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = (law: LawItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>${law.title}</title>
        <style>
          body { font-family: 'Cairo', 'Amiri', Tahoma, sans-serif; padding: 40px; line-height: 1.8; color: #111; }
          .header { text-align: center; border-bottom: 2px solid #999; padding-bottom: 15px; margin-bottom: 25px; }
          .republic { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
          .ministry { font-size: 15px; color: #333; margin-bottom: 8px; }
          .title { font-size: 20px; font-weight: bold; color: #0f4d2a; margin: 20px 0 10px; }
          .meta { font-size: 13px; color: #666; margin-bottom: 25px; }
          .article { border-right: 4px solid #b38728; padding-right: 15px; margin-bottom: 20px; background: #fafafa; padding: 12px; }
          .art-num { font-weight: bold; color: #8f1414; }
          .full-text { white-space: pre-wrap; font-size: 14px; background: #fff; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="republic">الجمهورية الجزائرية الديمقراطية الشعبية</div>
          <div class="ministry">وزارة التربية الوطنية · البوابة الرقمية لمدير الدراسات SNTE</div>
          <div class="title">${law.title}</div>
          <div class="meta">المرجع: ${law.number} | التاريخ: ${law.date}</div>
        </div>
        <div>
          <h3>المواد والمقتضيات الأساسية:</h3>
          ${law.keyArticles.map(art => `
            <div class="article">
              <div class="art-num">${art.articleNumber}: ${art.summary}</div>
              <p>${art.text}</p>
            </div>
          `).join('')}
          <h3>النص الكامل المرجعي:</h3>
          <div class="full-text">${law.fullText}</div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>الركن التشريعي والتنظيمي المعتمد · تحيين الموسم الدراسي 2025/2026</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              المكتبة التشريعية والتنظيمية المحينة 2026 لمدير الدراسات
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              فهرسة دقيقة ومحدثة لكافة المراسيم التنفيذية (المرسوم الجديد 25-54، 08-315 و12-240)، مناشير الرقمنة الشاملة 2026، قرارات الجماعة التربوية ومجالس الأقسام والتأديب، وقوانين الوظيفة العمومية والترقية في الدرجات.
            </p>
          </div>

          <div className="bg-[#05140d] px-4 py-3 rounded-lg border border-[#d4af37]/30 text-center min-w-[150px]">
            <div className="text-2xl font-black gold-gradient-text">{LEGISLATION_DATABASE.length}</div>
            <div className="text-xs text-slate-300">نصوص قانونية محينة 2026</div>
          </div>
        </div>

        {/* Smart Search & Filter */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-[#d4af37]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بذكاء عن مادة، مرسوم 25-54، الرقمنة 2026، الجماعة التربوية، أو الترقية..."
              className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#8f1414] to-[#690d0d] text-white border border-[#f5d77f]/50 shadow-md'
                  : 'bg-[#06150e] text-slate-300 hover:text-white hover:bg-[#0c2419] border border-[#d4af37]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Laws List */}
      <div className="space-y-4">
        {filteredLaws.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-[#091e14] border border-[#d4af37]/20 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#d4af37]" />
            <p className="text-base font-semibold text-slate-300">لا توجد نصوص تطابق معايير البحث</p>
            <p className="text-xs mt-1">جرب كلمات أخرى مثل: "25-54" أو "الرقمنة" أو "مجالس"</p>
          </div>
        ) : (
          filteredLaws.map((law) => {
            const isExpanded = expandedLawId === law.id;

            return (
              <div 
                key={law.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded 
                    ? 'bg-[#0a2016] border-[#d4af37] shadow-xl ring-1 ring-[#d4af37]/30' 
                    : 'bg-[#081a12] border-[#d4af37]/25 hover:border-[#d4af37]/60'
                }`}
              >
                {/* Law Card Header */}
                <div 
                  onClick={() => setExpandedLawId(isExpanded ? null : law.id)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#8f1414] text-white border border-[#f5d77f]/40">
                        {law.number}
                      </span>
                      {law.isUpdated2026 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] shadow-sm">
                          تحيين رسمي 2026
                        </span>
                      )}
                      <span className="text-xs text-[#d4af37] font-semibold">
                        المؤرخ في: {law.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white hover:text-[#f5d77f] transition-colors">
                      {law.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {law.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <div className="flex flex-wrap gap-1">
                      {law.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] bg-[#05140d] text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#06150e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Law Content */}
                {isExpanded && (
                  <div className="border-t border-[#d4af37]/25 p-5 bg-[#06160e]/80 space-y-5">
                    
                    {/* Key Articles Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-emerald-400" />
                        <span>المواد المفتاحية ذات الصلة المباشرة بمهام الناظر:</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {law.keyArticles.map((art, idx) => (
                          <div 
                            key={idx}
                            className="p-3.5 rounded-lg bg-[#081e13] border border-[#d4af37]/20 space-y-2 relative group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#f5d77f] bg-[#8f1414]/60 px-2 py-0.5 rounded border border-[#f5d77f]/30">
                                {art.articleNumber}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(`${art.articleNumber}: ${art.text}`, `art-${law.id}-${idx}`);
                                }}
                                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                                title="نسخ المادة"
                              >
                                {copiedId === `art-${law.id}-${idx}` ? (
                                  <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> تم النسخ</span>
                                ) : (
                                  <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> نسخ</span>
                                )}
                              </button>
                            </div>
                            <div className="text-xs font-semibold text-white">{art.summary}</div>
                            <p className="text-xs text-slate-300 leading-relaxed">{art.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Official Full Legal Preamble */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400">النص الكامل والديباجة الرسمية:</h4>
                      <pre className="p-4 rounded-lg bg-[#030e09] border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {law.fullText}
                      </pre>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#d4af37]/20">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(law.fullText, law.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0a2618] hover:bg-[#0f3823] text-xs font-bold text-[#e5c158] border border-[#d4af37]/30 flex items-center gap-1.5 transition-colors"
                        >
                          {copiedId === law.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>تم نسخ النص كاملاً</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>نسخ النص الكامل</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handlePrint(law)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-xs font-bold text-white border border-[#f5d77f]/40 flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>طباعة رسمية A4</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>موثق طبقاً للجريدة الرسمية للجمهورية الجزائرية</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
