import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { InstitutionInfo, DocumentTemplate } from '../types';
import { DOCUMENT_TEMPLATES, DEFAULT_EMBLEM_URL, STAGE_METADATA } from '../data/initialData';

interface DocumentsViewProps {
  institution: InstitutionInfo;
  initialSelectedDocId: string | null;
  onOpenSettings: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  institution,
  initialSelectedDocId,
  onOpenSettings,
}) => {
  const stageMeta = STAGE_METADATA[institution.stage];
  const stageTemplates = DOCUMENT_TEMPLATES.filter(
    (t) => t.stage === institution.stage || t.stage === 'all'
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(
    stageTemplates[0] || DOCUMENT_TEMPLATES[0]
  );
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialSelectedDocId) {
      const found = DOCUMENT_TEMPLATES.find((d) => d.id === initialSelectedDocId);
      if (found) {
        setSelectedTemplate(found);
      }
    }
  }, [initialSelectedDocId]);

  useEffect(() => {
    const initial: Record<string, string> = {};
    selectedTemplate.fields.forEach((f) => {
      initial[f.key] = f.defaultValue;
    });
    setFieldValues(initial);
  }, [selectedTemplate]);

  const filteredTemplates = stageTemplates.filter((t) =>
    selectedCategory === 'all' ? true : t.category === selectedCategory
  );

  const handleReset = () => {
    const resetValues: Record<string, string> = {};
    selectedTemplate.fields.forEach((f) => {
      resetValues[f.key] = f.defaultValue;
    });
    setFieldValues(resetValues);
    setToastMsg('تمت استعادة القيم النموذجية للوثيقة');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleDownloadWord = () => {
    const fieldsHtml = selectedTemplate.fields
      .map(
        (f) => `
        <div style="margin-bottom: 14px;">
          <p style="font-weight: bold; margin: 0 0 4px 0; color: #0b3b24;">${f.label}:</p>
          <p style="margin: 0; padding: 8px; border: 1px solid #ccc; background: #f9fafb; white-space: pre-line;">${
            fieldValues[f.key] || ''
          }</p>
        </div>`
      )
      .join('');

    const htmlDoc = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40" dir="rtl" lang="ar">
      <head><meta charset="utf-8"><title>${selectedTemplate.title}</title></head>
      <body style="font-family: 'Cairo', 'Simplified Arabic', Arial, sans-serif; direction: rtl; text-align: right; padding: 24px;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px;">
          <h3 style="margin: 0;">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
          <h4 style="margin: 4px 0;">وزارة التربية الوطنية — ${stageMeta.name}</h4>
          <p style="margin: 4px 0;">${institution.wilaya} — ${institution.schoolName}</p>
          <p style="margin: 4px 0;">السنة الدراسية: ${institution.schoolYear} · الفصل الدراسي ${institution.currentTerm}</p>
          <p style="margin: 4px 0; font-size: 12px;">المرجع الإداري: ${selectedTemplate.code}</p>
        </div>
        <h2 style="text-align: center; background: #f1f5f9; padding: 10px; border: 1px solid #000;">${selectedTemplate.title}</h2>
        ${fieldsHtml}
        <table style="width: 100%; margin-top: 40px; text-align: center; font-weight: bold;">
          <tr>
            <td>حرر بـ: ${institution.wilaya}<br>بتاريخ: ${new Date().toLocaleDateString('ar-DZ')}</td>
            <td>${stageMeta.natherTitle}<br>${institution.directorOfStudies}<br><br>[الختم والتوقيع الرسمي]</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlDoc], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.title.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMsg('تم تحميل النموذج الرسمي بصيغة Word (.doc) بنجاح');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const logoSrc = institution.logoUrl || DEFAULT_EMBLEM_URL;

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#105e32] text-white border-2 border-[#d4af37] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#f5d77f]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* الترويسة */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white text-xs font-bold">
            حقيبة الوثائق البيداغوجية والإدارية — {stageMeta.natherTitle} ({stageMeta.name})
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#d4af37]" />
            <span>المحرر الذكي للوثائق والمحاضر الرسمية (A4 & Word)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            نماذج رسمية مدققة قانونياً لـ {stageMeta.name}، قابلة للتعديل الفوري والطباعة المباشرة A4 أو التحميل بصيغة Word.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenSettings}
            className="px-3.5 py-2 rounded-xl bg-[#0c2a1c] hover:bg-[#133d28] text-[#f5d77f] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>تخصيص شعار الترويسة</span>
          </button>
          <button
            onClick={handleDownloadWord}
            className="px-3.5 py-2 rounded-xl bg-[#105e32] hover:bg-[#157a41] text-white border border-[#d4af37]/50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#f5d77f]" />
            <span>تحميل Word (.DOC)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة فورية A4</span>
          </button>
        </div>
      </div>

      {/* شريط التصنيفات */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#091e14] p-3 rounded-xl border border-[#d4af37]/30 no-print">
        {[
          { id: 'all', label: `كافة النماذج (${stageTemplates.length})` },
          { id: 'attendance', label: 'مواظبة وغيابات التلاميذ' },
          { id: 'councils', label: 'مجالس الأقسام والمعدلات' },
          { id: 'pedagogical', label: 'تنصيب الأساتذة والبيداغوجيا' },
          { id: 'exams', label: `الاختبارات و ${stageMeta.nationalExamName}` },
          { id: 'correspondence', label: 'مراسلات واستفسارات الأساتذة' },
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* محرر الحقول على اليمين */}
        <div className="lg:col-span-5 space-y-4 no-print">
          <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-4 space-y-2.5">
            <label className="block text-xs font-bold text-[#d4af37]">
              اختر النموذج الرسمي المطلوب ({stageMeta.shortName}):
            </label>
            <div className="space-y-2">
              {filteredTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTemplate.id === tmpl.id
                      ? 'bg-[#103824] border-[#d4af37] text-white shadow'
                      : 'bg-[#05140d] border-slate-800 text-slate-300 hover:border-[#d4af37]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#f5d77f] mb-0.5">
                    <span>{tmpl.code}</span>
                    <span>قابل للتعديل</span>
                  </div>
                  <div className="font-bold text-xs">{tmpl.title}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/40 p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2.5">
              <h4 className="text-xs font-black text-white">تعديل الحقول والبيانات اللحظي:</h4>
              <button
                onClick={handleReset}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة تعيين</span>
              </button>
            </div>

            {selectedTemplate.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-[11px] font-bold text-[#d4af37] mb-1">
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    rows={3}
                    value={fieldValues[field.key] || ''}
                    onChange={(e) =>
                      setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-white text-xs leading-relaxed"
                  />
                ) : (
                  <input
                    type="text"
                    value={fieldValues[field.key] || ''}
                    onChange={(e) =>
                      setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-white text-xs"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* معاينة الوثيقة الرسمية A4 على اليسار */}
        <div className="lg:col-span-7">
          <div className="p-8 bg-white text-black rounded-2xl shadow-2xl border-2 border-[#d4af37] print-only-sheet space-y-5 font-['Cairo',sans-serif] text-xs leading-relaxed">
            <div className="text-center border-b-2 border-black pb-4 space-y-1">
              <div className="text-base font-bold">الجمهورية الجزائرية الديمقراطية الشعبية</div>
              <div className="text-sm font-bold">وزارة التربية الوطنية — {stageMeta.name}</div>
              <div className="flex items-center justify-between pt-3">
                <div className="text-right space-y-0.5">
                  <div>
                    <strong>مديرية التربية:</strong> {institution.wilaya}
                  </div>
                  <div>
                    <strong>{stageMeta.institutionLabel}:</strong> {institution.schoolName}
                  </div>
                  <div>
                    <strong>المصلحة:</strong> مكتب {stageMeta.natherTitle}
                  </div>
                </div>

                <div
                  onClick={onOpenSettings}
                  title="انقر لتغيير شعار الترويسة"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <img
                    src={logoSrc}
                    alt="شعار المؤسسة"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain rounded-full border border-black p-0.5"
                  />
                </div>

                <div className="text-left space-y-0.5">
                  <div>
                    <strong>السنة الدراسية:</strong> {institution.schoolYear}
                  </div>
                  <div>
                    <strong>الفصل الدراسي:</strong> الفصل {institution.currentTerm}
                  </div>
                  <div>
                    <strong>الرقم المرجعي:</strong> {selectedTemplate.code}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-2.5 bg-slate-100 border border-black rounded">
              <h2 className="text-base sm:text-lg font-black">{selectedTemplate.title}</h2>
            </div>

            <div className="space-y-3.5">
              {selectedTemplate.fields.map((field) => (
                <div key={field.key} className="border border-slate-300 rounded p-3 bg-slate-50/60">
                  <div className="font-bold text-slate-900 mb-1 underline">{field.label}:</div>
                  <div className="whitespace-pre-line text-slate-900 font-medium">
                    {fieldValues[field.key] || ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-black text-center font-bold">
              <div>
                <div>حرر بـ: {institution.wilaya}</div>
                <div>بتاريخ: {new Date().toLocaleDateString('ar-DZ')}</div>
              </div>
              <div>
                <div>{stageMeta.natherTitle}</div>
                <div>{institution.directorOfStudies}</div>
                <div className="mt-8 text-slate-400">[ختم وتأشيرة {stageMeta.natherTitle}]</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
