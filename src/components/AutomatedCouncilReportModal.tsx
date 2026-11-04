import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  Check, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  Calendar,
  RotateCcw,
  Edit3,
  UserX
} from 'lucide-react';
import { InstitutionProfile, StudentScore } from '../types';
import { StudentAbsenceImpact } from './AbsenceImpactAnnexSection';

interface AutomatedCouncilReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionProfile;
  classGroup: string;
  students: StudentScore[];
  absenceImpacts?: StudentAbsenceImpact[];
}

export const AutomatedCouncilReportModal: React.FC<AutomatedCouncilReportModalProps> = ({
  isOpen,
  onClose,
  institution,
  classGroup,
  students,
  absenceImpacts
}) => {
  if (!isOpen) return null;

  const totalStudents = students.length;
  const passingStudents = students.filter(s => s.average >= 10);
  const passRate = totalStudents > 0 ? Math.round((passingStudents.length / totalStudents) * 100) : 0;
  
  const classAverage = totalStudents > 0
    ? (students.reduce((acc, curr) => acc + curr.average, 0) / totalStudents).toFixed(2)
    : '0.00';

  const highestScore = totalStudents > 0
    ? Math.max(...students.map(s => s.average)).toFixed(2)
    : '0.00';

  const lowestScore = totalStudents > 0
    ? Math.min(...students.map(s => s.average)).toFixed(2)
    : '0.00';

  const congratulationsCount = students.filter(s => s.average >= 16).length;
  const honorBoardCount = students.filter(s => s.average >= 14 && s.average < 16).length;
  const encouragementCount = students.filter(s => s.average >= 12 && s.average < 14).length;
  const warningCount = students.filter(s => s.average < 10).length;

  // Automated generation of Strengths based on metrics
  const generateInitialStrengths = () => {
    const list: string[] = [];
    if (passRate >= 70) {
      list.push(`تحقيق نسبة نجاح عامة مشجعة ومتميزة بالفوج بلغت ${passRate}%، متجاوزة المعدل المرجعي للمؤسسة.`);
    } else if (passRate >= 50) {
      list.push(`تحقيق نسبة نجاح مقبولة بلغت ${passRate}% مع استقرار مؤشرات الفوج عموماً.`);
    } else {
      list.push(`تسجيل ديناميكية إيجابية لدى الفئة المتوسطة وتحقيق ${passRate}% كنسبة نجاح تسعى للتحسن.`);
    }

    if (congratulationsCount + honorBoardCount > 0) {
      list.push(`بروز نخبة متميزة من التلاميذ في فئتي ممتاز وجيد (${congratulationsCount + honorBoardCount} تلاميذ) حققوا أعلى معدل (${highestScore}/20) مع تفوق لافت في المواد الأساسية.`);
    }

    list.push(`انتظام وتيرة إنجاز البرامج والمناهج التعليمية طبقاً للتوزيع السنوي والتزام الأساتذة بدفاتر النصوص.`);
    list.push(`مواظبة وانضباط سلوكي ملحوظ داخل حجرات الدراسة والمخابر مع انعدام المخالفات التأديبية الجسيمة بالفوج.`);
    return list.join('\n• ');
  };

  // Automated generation of Areas for Improvement based on metrics
  const generateInitialWeaknesses = () => {
    const list: string[] = [];
    if (warningCount > 0) {
      list.push(`تسجيل تعثر بيداغوجي لـ (${warningCount}) تلاميذ تحصلوا على معدل فصلي دون 10/20 (أدنى معدل مسجل: ${lowestScore}/20)، مما يعرضهم لخطر الرسوب ما لم يتم تدارك وضعهم.`);
    }

    list.push(`صعوبات منهجية مشخصة لدى بعض المتعثرين في التعامل مع أسئلة التحليل والتركيب وحل الوضعيات الإدماجية المركبة.`);
    list.push(`تذبذب نتائج الاختبارات التحصيلية في المواد العلمية واللغات الأجنبية مقارنة بنقاط التقويم المستمر والفروض.`);
    list.push(`حاجة فئة التلاميذ ذوي المعدلات (10 - 11.99) إلى تكثيف المراجعة والتمارين لتثبيت مكتسباتهم قبل الاختبارات الرسمية.`);
    return list.join('\n• ');
  };

  // Automated Remedial Recommendations & Council Decisions
  const generateInitialRecommendations = () => {
    const list: string[] = [];
    list.push(`برمجة حصص دعم واستدراك بيداغوجي أسبوعية موجهة للتلاميذ المتعثرين (${warningCount} تلاميذ) بالتنسيق مع أساتذة المواد الأساسية.`);
    list.push(`إشعار أولياء التلاميذ المعرضين للرسوب كتابياً ودعوتهم فوراً لمقابلة ناظر الثانوية ومستشار التوجيه لضبط خطة متابعة منزلية مشتركة.`);
    list.push(`تثبيت قرارات المجلس بمنح شهادات التهنئة ولوحة الشرف والتشجيع للتلاميذ المستحقين تشجيعاً للمنافسة التربوية الشريفة.`);
    list.push(`تكليف الأستاذ الرئيسي ومستشار التوجيه بمرافقة نفسية وتربوية للحالات التي تعاني من قلق الامتحانات أو نقص الدافعية.`);
    list.push(`التركيز في الفروض القادمة على معالجة الاختلالات المنهجية وإعطاء نماذج تطبيقية تحاكي مواضيع البكالوريا الرسمية.`);
    return list.join('\n• ');
  };

  const [strengths, setStrengths] = useState(generateInitialStrengths());
  const [weaknesses, setWeaknesses] = useState(generateInitialWeaknesses());
  const [recommendations, setRecommendations] = useState(generateInitialRecommendations());
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const resetToAuto = () => {
    setStrengths(generateInitialStrengths());
    setWeaknesses(generateInitialWeaknesses());
    setRecommendations(generateInitialRecommendations());
    setToast('تمت إعادة توليد النتائج والتوصيات آلياً');
    setTimeout(() => setToast(null), 3000);
  };

  // Export report to Word (.doc)
  const handleExportWord = () => {
    const dateStr = new Date().toLocaleDateString('ar-DZ');
    let docHtml = `
      <html xmlns:w="urn:schemas-microsoft-com:office:word">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; padding: 25px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 16pt; font-weight: bold; color: #0d2818; margin: 15px 0 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #444; padding: 6px 10px; text-align: center; font-size: 10pt; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .section-title { font-size: 12pt; font-weight: bold; background-color: #e6f4ea; padding: 6px; margin-top: 15px; border-right: 4px solid #105e32; }
          .content-block { font-size: 10pt; line-height: 1.8; margin-bottom: 12px; }
          .signatures { margin-top: 40px; width: 100%; }
        </style>
      </head>
      <body>
        <div class="header">
          <h3 style="margin: 0; font-size: 14pt;">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
          <h4 style="margin: 4px 0; font-size: 12pt;">وزارة التربية الوطنية</h4>
          <p style="margin: 2px 0;">مديرية التربية لـ: ${institution.wilaya} | ${institution.schoolName}</p>
          <p style="margin: 2px 0; font-size: 9pt;">السنة الدراسية: ${institution.schoolYear} · الفصل الدراسي ${institution.currentTerm}</p>
          <div class="title">محضر مداولات مجلس القسم والتقرير البيداغوجي الشامل</div>
          <p style="margin: 2px 0; font-size: 10pt;">المرجع: القرار الوزاري رقم 157 المؤرخ في 26 فيفري 1991</p>
          <p style="margin: 2px 0; font-weight: bold; font-size: 11pt;">الفوج التربوي: ${classGroup}</p>
        </div>

        <h4>أولاً: الحصيلة الإحصائية العامة لنتائج الفوج:</h4>
        <table>
          <tr>
            <th>إجمالي المسجلين</th>
            <th>الناجحون (معدل >= 10)</th>
            <th>نسبة النجاح العامة</th>
            <th>معدل الفوج العام</th>
            <th>أعلى معدل</th>
            <th>أدنى معدل</th>
          </tr>
          <tr>
            <td>${totalStudents}</td>
            <td>${passingStudents.length}</td>
            <td><strong>${passRate}%</strong></td>
            <td><strong>${classAverage} / 20</strong></td>
            <td>${highestScore} / 20</td>
            <td>${lowestScore} / 20</td>
          </tr>
        </table>

        <h4>ثانياً: توزيع الملاحظات الشرفية:</h4>
        <table>
          <tr>
            <th>تهنئة (16 فما فوق)</th>
            <th>لوحة شرف (14 - 15.99)</th>
            <th>تشجيع (12 - 13.99)</th>
            <th>إنذار وتنبيه (أقل من 10)</th>
          </tr>
          <tr>
            <td>${congratulationsCount} تلميذ</td>
            <td>${honorBoardCount} تلميذ</td>
            <td>${encouragementCount} تلميذ</td>
            <td style="color: red; font-weight: bold;">${warningCount} تلميذ</td>
          </tr>
        </table>

        <div class="section-title">1. نقاط القوة والمكتسبات البيداغوجية للفوج:</div>
        <div class="content-block">• ${strengths.replace(/\n/g, '<br/>')}</div>

        <div class="section-title">2. نقاط التحسين والتعثرات البيداغوجية المشخصة:</div>
        <div class="content-block">• ${weaknesses.replace(/\n/g, '<br/>')}</div>

        <div class="section-title">3. القرارات والتدابير العلاجية المعتمدة من مجلس القسم:</div>
        <div class="content-block">• ${recommendations.replace(/\n/g, '<br/>')}</div>

        ${absenceImpacts && absenceImpacts.length > 0 ? `
        <div class="section-title" style="background-color: #fce8e6; border-right: 4px solid #8f1414;">ملحق رقم (01): جدول أثر الغيابات والمواظبة على النتائج المدرسية (مستورد من راصد الغيابات AbsenceRadarApp):</div>
        <table>
          <tr>
            <th>اسم ولقب التلميذ</th>
            <th>المعدل الفصلي</th>
            <th>ساعات الغياب</th>
            <th>غير مبررة</th>
            <th>مؤشر الأثر على المعدل</th>
            <th>التشخيص البيداغوجي المباشر</th>
            <th>توصية مجلس القسم</th>
          </tr>
          ${absenceImpacts.map(imp => `
            <tr>
              <td><strong>${imp.studentName}</strong></td>
              <td>${imp.average.toFixed(2)}</td>
              <td>${imp.totalHours} س</td>
              <td style="color: ${imp.unjustifiedHours > 0 ? 'red' : 'inherit'}; font-weight: bold;">${imp.unjustifiedHours} س</td>
              <td>${imp.impactLevel === 'severe' ? 'تأثير سلبي حاد' : imp.impactLevel === 'moderate' ? 'تأثير متوسط' : imp.impactLevel === 'low' ? 'تأثير طفيف' : 'مواظبة تامة'}</td>
              <td style="font-size: 8.5pt; text-align: right;">${imp.impactDescription}</td>
              <td style="font-size: 8.5pt;">${imp.councilAction}</td>
            </tr>
          `).join('')}
        </table>
        ` : ''}

        <table class="signatures" style="border: none; margin-top: 50px;">
          <tr style="border: none;">
            <td style="border: none; width: 33%; text-align: center;">
              <strong>الأستاذ الرئيسي للفوج</strong><br/><br/><br/>
              [التوقيع]
            </td>
            <td style="border: none; width: 33%; text-align: center;">
              <strong>مستشار التوجيه المدرسي</strong><br/><br/><br/>
              [التوقيع]
            </td>
            <td style="border: none; width: 33%; text-align: center;">
              <strong>ناظر الثانوية / مدير الدراسات</strong><br/>
              ${institution.directorOfStudies}<br/><br/>
              [الختم والتأشيرة الرسمية]
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_مجلس_القسم_${classGroup.replace(/\s+/g, '_')}_${institution.schoolName.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast('تم تحميل التقرير بصيغة Word (.doc) بنجاح');
    setTimeout(() => setToast(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#081a12] border-2 border-[#d4af37] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden my-auto">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#105e32] text-[#f5d77f] px-4 py-2 rounded-xl border border-[#d4af37] shadow-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-white" />
            <span>{toast}</span>
          </div>
        )}

        {/* Modal Top Control Bar (No-print) */}
        <div className="p-4 bg-[#05140d] border-b border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#aa771c] text-[#082014] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>تقرير مجلس القسم الآلي (Automated Council Report)</span>
                <span className="text-xs bg-[#8f1414] text-white px-2 py-0.5 rounded font-bold border border-[#f5d77f]/40">
                  القرار 157
                </span>
              </h3>
              <p className="text-xs text-[#d4af37]">
                فوج {classGroup} · ثانوية {institution.schoolName} · الفصل {institution.currentTerm}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                isEditing
                  ? 'bg-[#d4af37] text-[#082014] border-[#d4af37]'
                  : 'bg-[#0d2818] text-[#f5d77f] border-[#d4af37]/30 hover:bg-[#123824]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'معاينة الوثيقة الرسمية' : 'تعديل الملاحظات'}</span>
            </button>

            <button
              onClick={resetToAuto}
              className="px-2.5 py-1.5 rounded-lg bg-[#05140d] text-slate-300 hover:text-white text-xs border border-slate-700 flex items-center gap-1"
              title="إعادة التوليد الآلي للنتائج والتوصيات"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة التوليد الآلي</span>
            </button>

            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 rounded-lg bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] text-xs font-bold flex items-center gap-1.5 border border-[#d4af37]/40 shadow-sm"
              title="تصدير بصيغة Word قابلة للتعديل"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل Word</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#f5d77f]/40"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة فورية A4</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/50">
          
          {/* If Editing Mode is active */}
          {isEditing && (
            <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/40 mb-6 space-y-4 no-print text-xs">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
                <span className="font-bold text-[#f5d77f] flex items-center gap-1.5 text-sm">
                  <Edit3 className="w-4 h-4" />
                  <span>تخصيص فقرات التقرير البيداغوجي قبل الطباعة</span>
                </span>
                <span className="text-slate-400">التعديلات تنعكس فورياً في كشف الطباعة الرسمي أدناه</span>
              </div>

              <div>
                <label className="block text-emerald-400 font-bold mb-1">
                  1. نقاط القوة والمكتسبات البيداغوجية للفوج:
                </label>
                <textarea
                  rows={3}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#081a12] border border-[#d4af37]/30 text-white font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-red-400 font-bold mb-1">
                  2. نقاط التحسين والتعثرات البيداغوجية المشخصة:
                </label>
                <textarea
                  rows={3}
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#081a12] border border-[#d4af37]/30 text-white font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-yellow-400 font-bold mb-1">
                  3. القرارات والتدابير العلاجية المعتمدة من مجلس القسم:
                </label>
                <textarea
                  rows={3}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#081a12] border border-[#d4af37]/30 text-white font-medium focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Official Printable Algerian Education Document (Print-ready layout) */}
          <div className="printable-document bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl border border-slate-300 font-['Cairo',serif] selection:bg-yellow-200">
            
            {/* Algerian Official Header */}
            <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
              <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-wide mb-1 font-['Amiri',serif]">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </h2>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 font-['Amiri',serif]">
                وزارة التربية الوطنية
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-700 font-semibold mt-3 px-2">
                <div className="text-right">
                  <div>مديرية التربية لولاية: <span className="font-bold text-black">{institution.wilaya}</span></div>
                  <div>المؤسسة: <span className="font-bold text-black">{institution.schoolName}</span></div>
                </div>

                <div className="my-2 sm:my-0 w-16 h-16 flex items-center justify-center">
                  <img 
                    src={institution.logoUrl || '/assets/aistudio/image_98bcc8c9.png'} 
                    alt="شعار المؤسسة" 
                    className="w-14 h-14 object-contain"
                  />
                </div>

                <div className="text-left">
                  <div>السنة الدراسية: <span className="font-bold text-black">{institution.schoolYear}</span></div>
                  <div>الفترة: <span className="font-bold text-black">الفصل الدراسي {institution.currentTerm}</span></div>
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="text-center my-6">
              <div className="inline-block border-2 border-slate-900 px-6 py-2.5 rounded bg-slate-50 shadow-sm">
                <h1 className="text-lg sm:text-2xl font-black text-[#0f4d2a] font-['Amiri',serif]">
                  محضر مداولات مجلس القسم والتقرير البيداغوجي الشامل
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  تطبيقاً لمقتضيات القرار الوزاري رقم 157 المؤرخ في 26 فيفري 1991
                </p>
              </div>

              <div className="mt-3 text-sm font-bold text-slate-800">
                الفوج التربوي: <span className="text-[#8f1414] font-black text-base">{classGroup}</span>
                <span className="mx-2">·</span>
                تاريخ الانعقاد: <span>{new Date().toLocaleDateString('ar-DZ')}</span>
              </div>
            </div>

            {/* General Class Statistics Matrix Table */}
            <div className="my-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#0f4d2a]" />
                <span>أولاً: الحصيلة الإحصائية العامة لنتائج الفوج:</span>
              </h4>

              <table className="w-full text-xs text-center border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-400 p-2">إجمالي المسجلين</th>
                    <th className="border border-slate-400 p-2">التلاميذ الناجحون (&gt;= 10)</th>
                    <th className="border border-slate-400 p-2 text-[#0f4d2a]">نسبة النجاح العامة</th>
                    <th className="border border-slate-400 p-2">معدل الفوج الحسابي</th>
                    <th className="border border-slate-400 p-2 text-emerald-800">أعلى معدل مسجل</th>
                    <th className="border border-slate-400 p-2 text-red-800">أدنى معدل مسجل</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-semibold text-slate-800">
                    <td className="border border-slate-400 p-2 font-mono text-sm">{totalStudents}</td>
                    <td className="border border-slate-400 p-2 font-mono text-sm">{passingStudents.length}</td>
                    <td className="border border-slate-400 p-2 font-mono text-base font-black text-[#0f4d2a] bg-emerald-50">
                      {passRate}%
                    </td>
                    <td className="border border-slate-400 p-2 font-mono text-sm font-bold bg-slate-50">
                      {classAverage} / 20
                    </td>
                    <td className="border border-slate-400 p-2 font-mono text-sm font-bold text-emerald-800">
                      {highestScore} / 20
                    </td>
                    <td className="border border-slate-400 p-2 font-mono text-sm font-bold text-red-700">
                      {lowestScore} / 20
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Honors Distribution Table */}
              <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <span className="text-slate-600 block text-[10px]">تهنئة (&gt;= 16):</span>
                  <span className="font-black text-slate-900 font-mono text-sm">{congratulationsCount}</span>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <span className="text-slate-600 block text-[10px]">لوحة شرف (14-15.99):</span>
                  <span className="font-black text-slate-900 font-mono text-sm">{honorBoardCount}</span>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <span className="text-slate-600 block text-[10px]">تشجيع (12-13.99):</span>
                  <span className="font-black text-slate-900 font-mono text-sm">{encouragementCount}</span>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-red-50 text-red-900">
                  <span className="block text-[10px] font-bold">إنذار وتنبيه (&lt; 10):</span>
                  <span className="font-black font-mono text-sm text-red-700">{warningCount}</span>
                </div>
              </div>
            </div>

            {/* Findings Section: Strengths, Areas for Improvement, Action Plan */}
            <div className="space-y-5 my-6 text-xs sm:text-sm text-slate-800 leading-relaxed">
              
              {/* 1. Class-wide Strengths */}
              <div className="p-4 bg-emerald-50/70 border-r-4 border-[#105e32] border-y border-l border-emerald-200 rounded-l">
                <h4 className="font-black text-sm text-[#0f4d2a] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#105e32]" />
                  <span>1. نقاط القوة والمكتسبات البيداغوجية للفوج:</span>
                </h4>
                <div className="whitespace-pre-wrap font-medium space-y-1 text-slate-800 pr-1">
                  • {strengths}
                </div>
              </div>

              {/* 2. Areas for Improvement */}
              <div className="p-4 bg-red-50/70 border-r-4 border-[#8f1414] border-y border-l border-red-200 rounded-l">
                <h4 className="font-black text-sm text-[#8f1414] mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#8f1414]" />
                  <span>2. نقاط التحسين والتعثرات البيداغوجية المشخصة:</span>
                </h4>
                <div className="whitespace-pre-wrap font-medium space-y-1 text-slate-800 pr-1">
                  • {weaknesses}
                </div>
              </div>

              {/* 3. Remedial Action Plan */}
              <div className="p-4 bg-amber-50/70 border-r-4 border-[#d4af37] border-y border-l border-amber-200 rounded-l">
                <h4 className="font-black text-sm text-[#92600b] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>3. القرارات والتدابير العلاجية المعتمدة من مجلس القسم:</span>
                </h4>
                <div className="whitespace-pre-wrap font-medium space-y-1 text-slate-800 pr-1">
                  • {recommendations}
                </div>
              </div>

            </div>

            {/* Official Annex 1: Absences Correlation Table */}
            {absenceImpacts && absenceImpacts.length > 0 && (
              <div className="my-8 pt-4 border-t-2 border-slate-300">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black text-[#8f1414] uppercase tracking-wider flex items-center gap-1.5">
                    <UserX className="w-4 h-4 text-[#8f1414]" />
                    <span>ملحق رقم (01): جدول رصد أثر الغيابات والمواظبة على النتائج المدرسية (مستورد من راصد الغيابات):</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    سند إجرائي: القرار الوزاري 157
                  </span>
                </div>

                <table className="w-full text-[11px] text-center border-collapse border border-slate-400">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold">
                      <th className="border border-slate-400 p-1.5 text-right pr-2">اسم ولقب التلميذ</th>
                      <th className="border border-slate-400 p-1.5">المعدل</th>
                      <th className="border border-slate-400 p-1.5">ساعات الغياب</th>
                      <th className="border border-slate-400 p-1.5 text-red-700">غير مبررة</th>
                      <th className="border border-slate-400 p-1.5">مؤشر التأثير على المعدل</th>
                      <th className="border border-slate-400 p-1.5 text-right pr-2">التشخيص والأثر البيداغوجي المباشر</th>
                      <th className="border border-slate-400 p-1.5">قرار وتوصية المجلس</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absenceImpacts.map((imp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-400 p-1.5 font-bold text-right pr-2">{imp.studentName}</td>
                        <td className="border border-slate-400 p-1.5 font-mono font-bold">{imp.average.toFixed(2)}</td>
                        <td className="border border-slate-400 p-1.5 font-mono">{imp.totalHours > 0 ? `${imp.totalHours} س` : '0'}</td>
                        <td className="border border-slate-400 p-1.5 font-mono font-bold text-red-700">
                          {imp.unjustifiedHours > 0 ? `${imp.unjustifiedHours} س` : '0'}
                        </td>
                        <td className="border border-slate-400 p-1.5 font-semibold">
                          <span className={
                            imp.impactLevel === 'severe' ? 'text-red-700 font-black' :
                            imp.impactLevel === 'moderate' ? 'text-amber-700 font-bold' :
                            imp.impactLevel === 'low' ? 'text-blue-700' : 'text-emerald-700'
                          }>
                            {imp.impactLevel === 'severe' ? 'تأثير سلبي حاد' :
                             imp.impactLevel === 'moderate' ? 'تأثير متوسط' :
                             imp.impactLevel === 'low' ? 'تأثير طفيف' : 'مواظبة تامة'}
                          </span>
                        </td>
                        <td className="border border-slate-400 p-1.5 text-right pr-2 text-[10px] text-slate-700">
                          {imp.impactDescription}
                        </td>
                        <td className="border border-slate-400 p-1.5 text-[10px] font-medium text-slate-800">
                          {imp.councilAction}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Official Signatures Grid */}
            <div className="mt-10 pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-900">الأستاذ الرئيسي للفوج</p>
                <p className="text-slate-600 text-[11px]">مقرر الجلسة</p>
                <div className="h-16 flex items-end justify-center text-slate-400 italic text-[10px]">
                  [التوقيع الرسمي]
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-900">مستشار التوجيه والإرشاد</p>
                <p className="text-slate-600 text-[11px]">المتابعة النفسية والبيداغوجية</p>
                <div className="h-16 flex items-end justify-center text-slate-400 italic text-[10px]">
                  [التوقيع الرسمي]
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-900">ناظر الثانوية / رئيس الجلسة</p>
                <p className="text-slate-800 font-semibold">{institution.directorOfStudies}</p>
                <div className="mt-2 border-2 border-dashed border-[#8f1414] text-[#8f1414] rounded p-2 inline-block text-[10px] font-bold uppercase tracking-wider">
                  [الختم والتأشيرة الرسمية]
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-10 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500">
              وثيقة إدارية بيداغوجية رسمية معتمدة من مديرية الدراسات · البوابة الرقمية للنقابة الوطنية لعمال التربية SNTE 2026
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
