import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Edit3, 
  Eye, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Building2, 
  Calendar,
  Save,
  FileCheck,
  ImagePlus
} from 'lucide-react';
import { InstitutionProfile, OfficialDocumentTemplate } from '../types';
import { OFFICIAL_DOCUMENT_TEMPLATES } from '../data/documentsData';

interface DocumentsSectionProps {
  institution: InstitutionProfile;
  initialSelectedDocId?: string | null;
  onUpdateInstitution?: (updated: InstitutionProfile) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  institution,
  initialSelectedDocId,
  onUpdateInstitution
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialSelectedDocId || OFFICIAL_DOCUMENT_TEMPLATES[0].id
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const activeLogoUrl = institution.logoUrl || '/assets/aistudio/image_98bcc8c9.png';

  const handleQuickLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateInstitution) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateInstitution({
          ...institution,
          logoUrl: reader.result
        });
        showNotify('تم تحديث أيقونة وشعار المؤسسة على ترويسة كافة الوثائق الرسمية بنجاح');
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Custom document field data state
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>(() => {
    const initial: Record<string, Record<string, string>> = {};
    OFFICIAL_DOCUMENT_TEMPLATES.forEach(t => {
      initial[t.id] = { ...t.defaultData };
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
  const [notification, setNotification] = useState<string | null>(null);

  const selectedTemplate = OFFICIAL_DOCUMENT_TEMPLATES.find(t => t.id === selectedTemplateId) || OFFICIAL_DOCUMENT_TEMPLATES[0];
  const currentFields = formData[selectedTemplate.id] || selectedTemplate.defaultData;

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [selectedTemplate.id]: {
        ...prev[selectedTemplate.id],
        [key]: value
      }
    }));
  };

  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      [selectedTemplate.id]: { ...selectedTemplate.defaultData }
    }));
    showNotify('تم استرجاع النموذج الافتراضي بنجاح');
  };

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Generate downloadable Word (.doc) file
  const handleExportWord = () => {
    const dateStr = new Date().toLocaleDateString('ar-DZ');

    let bodyHtml = `
      <div style="font-family: 'Arial', sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #333; padding-bottom: 15px;">
          <h3 style="margin: 0; font-size: 16pt;">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
          <h4 style="margin: 5px 0; font-size: 13pt;">وزارة التربية الوطنية</h4>
          <div style="margin: 8px auto; text-align: center;">
            <img src="${activeLogoUrl}" alt="شعار المؤسسة" style="width: 65px; height: 65px; object-fit: contain;" />
          </div>
          <p style="margin: 2px 0;">مديرية التربية لـ: ${institution.wilaya}</p>
          <p style="margin: 2px 0; font-weight: bold;">${institution.schoolName}</p>
          <p style="margin: 2px 0; font-size: 10pt;">السنة الدراسية: ${institution.schoolYear}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <h2 style="font-size: 18pt; text-decoration: underline; color: #0d2818;">${selectedTemplate.title}</h2>
          <p style="font-size: 10pt; color: #555;">المرجع الإداري: ${selectedTemplate.code}</p>
        </div>

        <div style="margin-top: 20px; font-size: 12pt; line-height: 2;">
    `;

    selectedTemplate.fields.forEach(f => {
      const val = currentFields[f.key] || '';
      bodyHtml += `
        <div style="margin-bottom: 12px;">
          <strong>${f.label}: </strong>
          <span style="border-bottom: 1px dotted #666; padding-right: 5px;">${val.replace(/\n/g, '<br/>')}</span>
        </div>
      `;
    });

    bodyHtml += `
        </div>

        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div style="width: 45%; text-align: right;">
            <p><strong>حرر بـ:</strong> ${institution.wilaya}</p>
            <p><strong>بتاريخ:</strong> ${dateStr}</p>
          </div>
          <div style="width: 45%; text-align: left;">
            <p><strong>ناظر الثانوية / مدير الدراسات</strong></p>
            <p>${institution.directorOfStudies}</p>
            <br/><br/>
            <p style="font-style: italic;">[الختم والتوقيع الرسمي]</p>
          </div>
        </div>

        <div style="margin-top: 60px; text-align: center; font-size: 9pt; color: #888; border-top: 1px solid #ccc; padding-top: 8px;">
          تم استخراج هذه الوثيقة عبر البوابة الرقمية لمدير الدراسات - النقابة الوطنية لعمال التربية SNTE 2026
        </div>
      </div>
    `;

    const blob = new Blob(['\ufeff', bodyHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.title}_${institution.schoolName}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotify('تم تحميل النموذج بصيغة Word (.doc) بنجاح');
  };

  // Official high-fidelity print handler
  const handlePrint = () => {
    window.print();
  };

  const filteredTemplates = OFFICIAL_DOCUMENT_TEMPLATES.filter(t => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#105e32] text-[#f5d77f] px-4 py-2.5 rounded-lg border border-[#d4af37] shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>الركن الثاني: حقيبة الوثائق البيداغوجية والإدارية</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              المحرر الذكي للوثائق والمحاضر الرسمية للناظر
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              نماذج جاهزة، مدققة قانونياً طبقاً لتشريعات وزارة التربية الوطنية، قابلة للتعديل اللحظي والطباعة الفورية A4 مع دمج تلقائي لبيانات مؤسستك وخاتم مدير الدراسات.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleQuickLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              className="px-3.5 py-2 rounded-lg bg-[#105e32] hover:bg-[#157841] text-xs font-bold text-[#f5d77f] border border-[#d4af37]/50 flex items-center gap-2 transition-all shadow-md cursor-pointer"
              title="إدراج أو تغيير صورة أيقونة المؤسسة على ترويسة الوثائق"
            >
              <ImagePlus className="w-4 h-4 text-emerald-300" />
              <span>أيقونة المؤسسة بالترويسة</span>
            </button>

            <button
              onClick={handleExportWord}
              className="px-4 py-2 rounded-lg bg-[#0d2818] hover:bg-[#133d25] text-xs font-bold text-[#f5d77f] border border-[#d4af37]/50 flex items-center gap-2 transition-all shadow-md cursor-pointer"
              title="تحميل النموذج بصيغة Word للتعديل لاحقاً"
            >
              <Download className="w-4 h-4" />
              <span>تحميل Word (DOC)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-xs font-bold text-white border border-[#f5d77f]/50 flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة فورية A4</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'كافة النماذج (6)' },
            { id: 'pedagogy', label: 'بيداغوجية وتنصيب' },
            { id: 'admin', label: 'إدارية ومواظبة' },
            { id: 'exams', label: 'امتحانات وحراسة' },
            { id: 'councils', label: 'مجالس الأقسام والتعليم' },
            { id: 'correspondence', label: 'مراسلات واستفسارات' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white border border-[#f5d77f]/50 shadow-md'
                  : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Sidebar of Templates + Main Editor/Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Templates Selection Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            اختر النموذج المطلوب:
          </div>
          
          <div className="space-y-2">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplateId === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0e2a1b] to-[#081a11] border-[#d4af37] shadow-lg ring-1 ring-[#d4af37]/40'
                      : 'bg-[#081a12] border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#0a2016]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#d4af37] font-mono font-bold">
                      {template.code}
                    </span>
                    <span className="text-[10px] bg-[#05140d] text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      قابل للتعديل
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {template.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor and Printable Document View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Sub Header Switcher: Editor vs Live Official Document */}
          <div className="flex items-center justify-between bg-[#081a12] p-2 rounded-xl border border-[#d4af37]/30">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>معاينة الوثيقة الرسمية A4</span>
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'editor'
                    ? 'bg-[#8f1414] text-white border border-[#f5d77f]/40 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>تعديل الحقول والبيانات</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-[#d4af37] flex items-center gap-1 px-2.5 py-1 rounded"
              title="إعادة ضبط الحقول للقيم الافتراضية"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة تعيين</span>
            </button>
          </div>

          {/* Form Editor Tab */}
          {activeTab === 'editor' && (
            <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#d4af37]" />
                  <span>تخصيص بيانات: {selectedTemplate.title}</span>
                </h3>
                <span className="text-xs text-slate-400">التغييرات تنعكس فورياً على الوثيقة والطباعة</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={currentFields[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={currentFields[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      >
                        {field.options?.map((opt, i) => (
                          <option key={i} value={opt} className="bg-[#091e14] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={currentFields[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#d4af37]/20 flex justify-end">
                <button
                  onClick={() => {
                    setActiveTab('preview');
                    showNotify('تم حفظ التعديلات ومعاينتها في الوثيقة الرسمية');
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة في الوثيقة الرسمية</span>
                </button>
              </div>
            </div>
          )}

          {/* Official Document Preview (A4 Printable Layout) */}
          <div className="printable-document bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl border border-slate-300 min-h-[700px] relative font-['Cairo',serif] selection:bg-yellow-200">
            
            {/* Algerian Official Header */}
            <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide mb-1 font-['Amiri',serif]">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </h2>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 font-['Amiri',serif]">
                وزارة التربية الوطنية
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-700 font-semibold mt-3 px-2">
                <div className="text-right">
                  <div>مديرية التربية لـ: <span className="font-bold text-black">{institution.wilaya}</span></div>
                  <div>المؤسسة: <span className="font-bold text-black">{institution.schoolName}</span></div>
                </div>

                {/* Institution Custom Emblem / Logo in print header */}
                <div
                  onClick={() => logoInputRef.current?.click()}
                  title="انقر لتغيير أيقونة / شعار المؤسسة على الترويسة"
                  className="my-2 sm:my-0 w-20 h-20 flex flex-col items-center justify-center cursor-pointer group relative"
                >
                  <img 
                    src={activeLogoUrl} 
                    alt="شعار المؤسسة" 
                    className="w-16 h-16 object-contain"
                  />
                  <span className="no-print text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                    تغيير الشعار
                  </span>
                </div>

                <div className="text-left">
                  <div>السنة الدراسية: <span className="font-bold text-black">{institution.schoolYear}</span></div>
                  <div>الرقم المرجعي: <span className="font-mono text-black">{selectedTemplate.code}</span></div>
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="text-center my-6">
              <div className="inline-block border-2 border-slate-900 px-6 py-2 rounded bg-slate-50 shadow-sm">
                <h1 className="text-xl sm:text-2xl font-black text-[#0f4d2a] font-['Amiri',serif]">
                  {selectedTemplate.title}
                </h1>
              </div>
            </div>

            {/* Document Body Content */}
            <div className="space-y-4 text-sm sm:text-base text-slate-800 leading-relaxed my-8">
              {selectedTemplate.fields.map((field) => {
                const val = currentFields[field.key] || '---';

                if (field.type === 'textarea') {
                  return (
                    <div key={field.key} className="p-3 bg-slate-50 border border-slate-200 rounded my-3">
                      <span className="font-bold text-slate-900 block mb-1">{field.label}:</span>
                      <p className="whitespace-pre-wrap text-slate-800 text-sm">{val}</p>
                    </div>
                  );
                }

                return (
                  <div key={field.key} className="flex items-baseline gap-2 border-b border-dotted border-slate-300 pb-1.5">
                    <span className="font-bold text-slate-900 min-w-[160px] text-sm">{field.label}:</span>
                    <span className="text-slate-900 font-medium">{val}</span>
                  </div>
                );
              })}
            </div>

            {/* Official Date & Signature Section */}
            <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-sm">
              <div className="text-right">
                <p>حرر بـ: <span className="font-bold">{institution.wilaya}</span></p>
                <p>بتاريخ: <span className="font-bold">{new Date().toLocaleDateString('ar-DZ')}</span></p>
              </div>

              <div className="text-center">
                <p className="font-bold text-slate-900">ناظر الثانوية / مدير الدراسات</p>
                <p className="text-slate-800 font-semibold">{institution.directorOfStudies}</p>
                <div className="mt-6 border-2 border-dashed border-[#8f1414] text-[#8f1414] rounded-lg p-3 inline-block text-xs font-bold uppercase tracking-wider">
                  [ختم وتأشيرة مدير الدراسات]
                </div>
              </div>
            </div>

            {/* Official Footer Note */}
            <div className="mt-12 text-center text-[11px] text-slate-500 border-t border-slate-200 pt-3">
              المنصة النموذجية الموحدة لمدير الدراسات · النقابة الوطنية لعمال التربية SNTE 2026 · وثيقة رسمية معتمدة
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
