import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  BookOpen, 
  Calendar, 
  Building2,
  FileCheck2,
  ShieldAlert
} from 'lucide-react';
import { InstitutionProfile, StudentScore } from '../types';

interface AtRiskSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentScore | null;
  institution: InstitutionProfile;
  remedialPlan: {
    riskLevel: 'critical' | 'moderate' | 'watchlist';
    riskLabel: string;
    continuousAvg: number;
    deficitSubjects: { name: string; contScore: number; examScore: number; coef: number }[];
    pedagogicalAction: string;
    guidanceAction: string;
    parentAction: string;
    peerTutor: string;
  } | null;
}

export const AtRiskSupportModal: React.FC<AtRiskSupportModalProps> = ({
  isOpen,
  onClose,
  student,
  institution,
  remedialPlan
}) => {
  if (!isOpen || !student || !remedialPlan) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    const dateStr = new Date().toLocaleDateString('ar-DZ');
    let docHtml = `
      <html xmlns:w="urn:schemas-microsoft-com:office:word">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; padding: 25px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 15pt; font-weight: bold; color: #8f1414; margin: 15px 0 5px; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          th, td { border: 1px solid #444; padding: 6px 8px; text-align: center; font-size: 10pt; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .box { border: 1px solid #999; padding: 10px; margin-bottom: 12px; border-right: 4px solid #8f1414; background: #fafafa; }
          .signatures { margin-top: 35px; width: 100%; }
        </style>
      </head>
      <body>
        <div class="header">
          <h3 style="margin: 0;">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
          <h4 style="margin: 3px 0;">وزارة التربية الوطنية</h4>
          <p style="margin: 2px 0;">مديرية التربية لولاية: ${institution.wilaya} | ${institution.schoolName}</p>
          <div class="title">استمارة التشخيص المبكر وخطة الدعم والمرافقة البيداغوجية الفردية</div>
          <p style="margin: 2px 0; font-size: 9pt;">السنة الدراسية: ${institution.schoolYear} · الفصل الدراسي ${institution.currentTerm}</p>
        </div>

        <table style="margin-bottom: 15px;">
          <tr>
            <td><strong>اسم ولقب التلميذ:</strong> ${student.name}</td>
            <td><strong>الفوج والشعبة:</strong> ${student.classGroup} (${student.stream})</td>
            <td><strong>الرتبة في الفوج:</strong> ${student.rank || '--'}</td>
          </tr>
          <tr>
            <td><strong>معدل التقويم المستمر:</strong> ${remedialPlan.continuousAvg.toFixed(2)} / 20</td>
            <td><strong>المعدل الفصلي العام:</strong> ${student.average.toFixed(2)} / 20</td>
            <td><strong>مستوى الخطورة المشخص:</strong> <span style="color: red; font-weight: bold;">${remedialPlan.riskLabel}</span></td>
          </tr>
        </table>

        <h4>أولاً: المواد التعليمية التي سجلت تعثراً في التقييمات المستمرة:</h4>
        <table>
          <tr>
            <th>المادة المتعثرة</th>
            <th>نقطة التقويم المستمر</th>
            <th>نقطة الاختبار الفصلي</th>
            <th>معامل المادة</th>
            <th>التشخيص البيداغوجي الميداني</th>
          </tr>
          ${remedialPlan.deficitSubjects.map(sub => `
            <tr>
              <td><strong>${sub.name}</strong></td>
              <td style="color: red;">${sub.contScore.toFixed(1)} / 20</td>
              <td>${sub.examScore.toFixed(1)} / 20</td>
              <td>${sub.coef}</td>
              <td>صعوبة في استيعاب المفاهيم الأساسية وحل الوضعيات المركبة</td>
            </tr>
          `).join('')}
        </table>

        <div class="box">
          <strong>1. إجراءات الدعم والاستدراك البيداغوجي الفردي:</strong>
          <p>${remedialPlan.pedagogicalAction}</p>
        </div>

        <div class="box">
          <strong>2. برنامج المرافقة النفسية والتوجيه المدرسي:</strong>
          <p>${remedialPlan.guidanceAction}</p>
        </div>

        <div class="box">
          <strong>3. خطة إشراك الأسرة والمتابعة المنزلية:</strong>
          <p>${remedialPlan.parentAction}</p>
        </div>

        <div class="box">
          <strong>4. نظام التوأمة البيداغوجية والرفيق الدراسي:</strong>
          <p>تم تعيين التلميذ الرفيق: <strong>${remedialPlan.peerTutor}</strong> للمراجعة الثنائية وتبادل الملخصات تحت إشراف الأستاذ الرئيسي.</p>
        </div>

        <table class="signatures" style="border: none;">
          <tr style="border: none;">
            <td style="border: none; width: 33%; text-align: center;">
              <strong>تعهد التلميذ(ة) بالالتزام</strong><br/><br/><br/>
              [التوقيع]
            </td>
            <td style="border: none; width: 33%; text-align: center;">
              <strong>مستشار التوجيه والإرشاد</strong><br/><br/><br/>
              [التوقيع]
            </td>
            <td style="border: none; width: 33%; text-align: center;">
              <strong>ناظر الثانوية / مدير الدراسات</strong><br/>
              ${institution.directorOfStudies}<br/><br/>
              [الختم والتأشيرة]
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
    a.download = `استمارة_دعم_فردي_${student.name.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#081a12] border-2 border-[#d4af37] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden my-auto">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-[#05140d] border-b border-[#d4af37]/30 flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                استمارة الدعم والمرافقة البيداغوجية الفردية
              </h3>
              <p className="text-xs text-[#d4af37]">
                التلميذ: {student.name} · فوج {student.classGroup}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 rounded-lg bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] text-xs font-bold flex items-center gap-1.5 border border-[#d4af37]/40 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل Word</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#f5d77f]/40"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة A4</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/50">
          <div className="printable-document bg-white text-slate-900 rounded-xl p-8 sm:p-10 shadow-2xl border border-slate-300 font-['Cairo',serif] text-xs sm:text-sm">
            
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wide mb-0.5 font-['Amiri',serif]">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </h2>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-2 font-['Amiri',serif]">
                وزارة التربية الوطنية
              </h3>
              
              <div className="flex items-center justify-between text-xs text-slate-700 font-semibold px-2">
                <div className="text-right">
                  <div>مديرية التربية لولاية: <span className="font-bold">{institution.wilaya}</span></div>
                  <div>المؤسسة: <span className="font-bold">{institution.schoolName}</span></div>
                </div>

                <div className="w-12 h-12 flex items-center justify-center">
                  <img src="/assets/aistudio/image_98bcc8c9.png" alt="SNTE" className="w-10 h-10 object-contain" />
                </div>

                <div className="text-left">
                  <div>السنة الدراسية: <span className="font-bold">{institution.schoolYear}</span></div>
                  <div>الفصل: <span className="font-bold">الفصل {institution.currentTerm}</span></div>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-4">
              <div className="inline-block border-2 border-red-900 px-5 py-1.5 rounded bg-red-50 text-red-900 font-black text-sm sm:text-base">
                استمارة التشخيص المبكر وخطة الدعم والمرافقة البيداغوجية الفردية
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                نظام الإنذار المبكر لخطر الرسوب وفق توجيهات المفتشية العامة للبيداغوجيا والقرار 157
              </p>
            </div>

            {/* Student Info Bar */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-2.5 rounded border border-slate-300 my-4 text-xs">
              <div><strong>اسم التلميذ:</strong> <span className="font-bold text-black">{student.name}</span></div>
              <div><strong>الفوج والشعبة:</strong> <span className="font-bold text-black">{student.classGroup}</span></div>
              <div><strong>الرتبة في القسم:</strong> <span className="font-bold text-black">{student.rank || '--'}</span></div>
              <div><strong>معدل التقويم المستمر:</strong> <span className="font-mono font-bold text-red-700">{remedialPlan.continuousAvg.toFixed(2)}/20</span></div>
              <div><strong>المعدل الفصلي العام:</strong> <span className="font-mono font-bold text-red-700">{student.average.toFixed(2)}/20</span></div>
              <div><strong>درجة الخطورة:</strong> <span className="font-bold text-red-700 underline">{remedialPlan.riskLabel}</span></div>
            </div>

            {/* Deficit Subjects Table */}
            <div className="my-4">
              <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-red-700" />
                <span>المواد التي سجلت تعثراً وانخفاضاً في التقييمات المستمرة:</span>
              </h4>

              <table className="w-full text-xs text-center border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 font-bold">
                    <th className="border border-slate-400 p-1.5">المادة التعليمية</th>
                    <th className="border border-slate-400 p-1.5 text-red-800">التقويم المستمر</th>
                    <th className="border border-slate-400 p-1.5">الاختبار الفصلي</th>
                    <th className="border border-slate-400 p-1.5">معامل المادة</th>
                    <th className="border border-slate-400 p-1.5">طبيعة التعثر المشخص</th>
                  </tr>
                </thead>
                <tbody>
                  {remedialPlan.deficitSubjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50 font-medium">
                      <td className="border border-slate-400 p-1.5 font-bold text-right pr-2">{sub.name}</td>
                      <td className="border border-slate-400 p-1.5 font-mono text-red-700 font-bold">{sub.contScore.toFixed(1)}/20</td>
                      <td className="border border-slate-400 p-1.5 font-mono">{sub.examScore.toFixed(1)}/20</td>
                      <td className="border border-slate-400 p-1.5 font-mono font-bold">{sub.coef}</td>
                      <td className="border border-slate-400 p-1.5 text-slate-700 text-[11px]">ضعف في استيعاب المفاهيم وحل الوضعيات</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4 Action Steps Boxes */}
            <div className="space-y-3 my-5 text-xs">
              
              <div className="p-3 bg-red-50 border-r-4 border-red-800 border-y border-l border-red-200 rounded-l">
                <div className="font-bold text-red-900 mb-0.5">1. التدابير البيداغوجية العاجلة وحصص الاستدراك:</div>
                <p className="text-slate-800 leading-relaxed">{remedialPlan.pedagogicalAction}</p>
              </div>

              <div className="p-3 bg-blue-50 border-r-4 border-blue-800 border-y border-l border-blue-200 rounded-l">
                <div className="font-bold text-blue-900 mb-0.5">2. برنامج المرافقة النفسية والتوجيه المدرسي:</div>
                <p className="text-slate-800 leading-relaxed">{remedialPlan.guidanceAction}</p>
              </div>

              <div className="p-3 bg-amber-50 border-r-4 border-amber-800 border-y border-l border-amber-200 rounded-l">
                <div className="font-bold text-amber-900 mb-0.5">3. خطة إشراك الأسرة والمتابعة المنزلية:</div>
                <p className="text-slate-800 leading-relaxed">{remedialPlan.parentAction}</p>
              </div>

              <div className="p-3 bg-emerald-50 border-r-4 border-emerald-800 border-y border-l border-emerald-200 rounded-l">
                <div className="font-bold text-emerald-900 mb-0.5">4. نظام التوأمة البيداغوجية (Peer Tutoring):</div>
                <p className="text-slate-800 leading-relaxed">
                  تم تعيين التلميذ الرفيق: <strong className="text-emerald-900">{remedialPlan.peerTutor}</strong> لمراجعة الدروس وحل التمارين التطبيقية ثنائياً داخل فضاء المكتبة المدرسية.
                </p>
              </div>

            </div>

            {/* Commitments & Signatures */}
            <div className="mt-8 pt-4 border-t-2 border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <p className="font-bold text-slate-900">تعهد التلميذ(ة) بالانضباط</p>
                <div className="h-12 flex items-end justify-center text-slate-400 italic text-[10px]">
                  [توقيع التلميذ]
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">مستشار التوجيه المدرسي</p>
                <div className="h-12 flex items-end justify-center text-slate-400 italic text-[10px]">
                  [تأشيرة المتابعة]
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">ناظر الثانوية / مدير الدراسات</p>
                <p className="text-slate-800 font-semibold text-[11px]">{institution.directorOfStudies}</p>
                <div className="mt-1 border border-dashed border-[#8f1414] text-[#8f1414] rounded p-1 inline-block text-[9px] font-bold">
                  [الختم والتأشيرة]
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
