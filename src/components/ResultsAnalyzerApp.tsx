import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertCircle, 
  Printer, 
  Plus, 
  Users, 
  CheckCircle2, 
  FileSpreadsheet, 
  ArrowUpRight,
  BookOpen,
  Download,
  FileDown,
  Check
} from 'lucide-react';
import { StudentScore, InstitutionProfile } from '../types';
import { GradeDistributionChart } from './GradeDistributionChart';
import { AutomatedCouncilReportModal } from './AutomatedCouncilReportModal';
import { AtRiskStudentsRadar } from './AtRiskStudentsRadar';
import { AbsenceImpactAnnexSection, StudentAbsenceImpact, calculateStudentAbsenceImpacts } from './AbsenceImpactAnnexSection';
import { Sparkles, ShieldAlert, UserX } from 'lucide-react';
import { AbsenceRecord } from '../types';

interface ResultsAnalyzerAppProps {
  institution: InstitutionProfile;
  studentsScores: StudentScore[];
  onUpdateStudentsScores: (scores: StudentScore[]) => void;
  absences?: AbsenceRecord[];
}

export const ResultsAnalyzerApp: React.FC<ResultsAnalyzerAppProps> = ({
  institution,
  studentsScores,
  onUpdateStudentsScores,
  absences = []
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('3 ع ت 1');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isCouncilReportOpen, setIsCouncilReportOpen] = useState(false);

  // New Student Form
  const [newStudentName, setNewStudentName] = useState('');
  const [mathExam, setMathExam] = useState('14');
  const [scienceExam, setScienceExam] = useState('15');
  const [physicsExam, setPhysicsExam] = useState('13');
  const [arabicExam, setArabicExam] = useState('14');

  const filteredStudents = useMemo(() => {
    return studentsScores.filter(s => s.classGroup === selectedClass);
  }, [studentsScores, selectedClass]);

  const absenceImpacts = useMemo(() => {
    return calculateStudentAbsenceImpacts(filteredStudents, absences);
  }, [filteredStudents, absences]);

  // Compute key analytics
  const totalStudents = filteredStudents.length;
  const passingStudents = filteredStudents.filter(s => s.average >= 10);
  const passRate = totalStudents > 0 ? Math.round((passingStudents.length / totalStudents) * 100) : 0;
  
  const classAverage = totalStudents > 0
    ? (filteredStudents.reduce((acc, curr) => acc + curr.average, 0) / totalStudents).toFixed(2)
    : '0.00';

  const highestScore = totalStudents > 0
    ? Math.max(...filteredStudents.map(s => s.average)).toFixed(2)
    : '0.00';

  const lowestScore = totalStudents > 0
    ? Math.min(...filteredStudents.map(s => s.average)).toFixed(2)
    : '0.00';

  // Honors breakdown
  const congratulationsCount = filteredStudents.filter(s => s.average >= 16).length;
  const honorBoardCount = filteredStudents.filter(s => s.average >= 14 && s.average < 16).length;
  const encouragementCount = filteredStudents.filter(s => s.average >= 12 && s.average < 14).length;
  const warningCount = filteredStudents.filter(s => s.average < 10).length;

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const m = Number(mathExam) || 10;
    const sc = Number(scienceExam) || 10;
    const ph = Number(physicsExam) || 10;
    const ar = Number(arabicExam) || 10;

    // Weights: Math (5), Science (6), Physics (5), Arabic (3) = 19
    const totalPoints = (m * 5) + (sc * 6) + (ph * 5) + (ar * 3);
    const avg = Number((totalPoints / 19).toFixed(2));

    let mention = 'مقبول';
    if (avg >= 16) mention = 'تهنئة ولوحة شرف';
    else if (avg >= 14) mention = 'لوحة شرف';
    else if (avg >= 12) mention = 'تشجيع';
    else if (avg < 10) mention = 'إنذار بالتقصير';

    const newStudent: StudentScore = {
      id: `std-${Date.now()}`,
      name: newStudentName,
      classGroup: selectedClass,
      stream: 'علوم تجريبية',
      scores: [
        { subject: 'الرياضيات', continuousScore: m, examScore: m, coefficient: 5 },
        { subject: 'علوم الطبيعة والحياة', continuousScore: sc, examScore: sc, coefficient: 6 },
        { subject: 'العلوم الفيزيائية', continuousScore: ph, examScore: ph, coefficient: 5 },
        { subject: 'الأدب العربي', continuousScore: ar, examScore: ar, coefficient: 3 },
      ],
      average: avg,
      mention
    };

    // Re-rank students
    const updated = [...studentsScores, newStudent].sort((a, b) => b.average - a.average).map((s, idx) => ({
      ...s,
      rank: idx + 1
    }));

    onUpdateStudentsScores(updated);
    setIsAddStudentOpen(false);
    setNewStudentName('');
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Export to standard CSV with UTF-8 BOM
  const exportToCSV = () => {
    if (filteredStudents.length === 0) {
      showToast('لا توجد بيانات تلاميذ في هذا الفوج لتصديرها');
      return;
    }

    const headers = [
      'الرتبة',
      'اسم ولقب التلميذ',
      'الشعبة',
      'الرياضيات (مع 5)',
      'علوم الطبيعة والحياة (مع 6)',
      'العلوم الفيزيائية (مع 5)',
      'الأدب العربي (مع 3)',
      'المعدل الفصلي',
      'الملاحظة الشرفية',
      'قرار مجلس القسم'
    ];

    const rows = filteredStudents.map((s, idx) => {
      const math = s.scores.find(sc => sc.subject.includes('الرياضيات'))?.examScore.toFixed(2) || '--';
      const science = s.scores.find(sc => sc.subject.includes('علوم الطبيعة'))?.examScore.toFixed(2) || '--';
      const physics = s.scores.find(sc => sc.subject.includes('الفيزيائية'))?.examScore.toFixed(2) || '--';
      const arabic = s.scores.find(sc => sc.subject.includes('الأدب'))?.examScore.toFixed(2) || '--';
      const decision = s.average >= 10 ? 'ناجح / ينتقل' : 'إنذار بالتقصير ومتابعة';

      return [
        idx + 1,
        `"${s.name}"`,
        `"${s.stream}"`,
        math,
        science,
        physics,
        arabic,
        s.average.toFixed(2),
        `"${s.mention || ''}"`,
        `"${decision}"`
      ];
    });

    let csvContent = '\ufeff'; // UTF-8 BOM for perfect Excel Arabic support
    csvContent += `الجمهورية الجزائرية الديمقراطية الشعبية - وزارة التربية الوطنية\n`;
    csvContent += `المؤسسة:,"${institution.schoolName}",الولاية:,"${institution.wilaya}",السنة الدراسية:,"${institution.schoolYear}"\n`;
    csvContent += `الفوج التربوي:,"${selectedClass}",الفصل الدراسي:,"الفصل ${institution.currentTerm}",ناظر المؤسسة:,"${institution.directorOfStudies}"\n`;
    csvContent += `تاريخ التصدير:,"${new Date().toLocaleDateString('ar-DZ')}"\n\n`;

    csvContent += headers.join(',') + '\n';
    rows.forEach(r => {
      csvContent += r.join(',') + '\n';
    });

    csvContent += `\n--- ملخص إحصائيات مجلس القسم ---\n`;
    csvContent += `إجمالي التلاميذ,${totalStudents}\n`;
    csvContent += `نسبة النجاح العامة,${passRate}%\n`;
    csvContent += `معدل الفوج العام,${classAverage} / 20\n`;
    csvContent += `أعلى معدل,${highestScore} / 20\n`;
    csvContent += `أدنى معدل,${lowestScore} / 20\n`;
    csvContent += `فئة ممتاز (16 فما فوق),${congratulationsCount}\n`;
    csvContent += `فئة جيد (14 - 15.99),${honorBoardCount}\n`;
    csvContent += `فئة متوسط (10 - 13.99),${encouragementCount}\n`;
    csvContent += `فئة ضعيف (أقل من 10),${warningCount}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `كشف_نقاط_${selectedClass.replace(/\s+/g, '_')}_${institution.schoolName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف CSV بنجاح متوافقاً مع Excel والمراسلات الإدارية.');
  };

  // Export to structured Excel spreadsheet (.xls)
  const exportToExcel = () => {
    if (filteredStudents.length === 0) {
      showToast('لا توجد بيانات تلاميذ في هذا الفوج لتصديرها');
      return;
    }

    let excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>كشف نتائج ${selectedClass}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayRightToLeft/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
          .header-title { font-size: 16pt; font-weight: bold; text-align: center; color: #0d2818; }
          .meta-table td { padding: 4px 8px; font-size: 11pt; }
          .data-table { border-collapse: collapse; width: 100%; margin-top: 15px; }
          .data-table th { background-color: #105e32; color: #ffffff; border: 1px solid #000; padding: 8px; text-align: center; font-size: 11pt; }
          .data-table td { border: 1px solid #444; padding: 6px; text-align: center; font-size: 10pt; }
          .pass { background-color: #e6f4ea; color: #137333; font-weight: bold; }
          .fail { background-color: #fce8e6; color: #c5221f; font-weight: bold; }
          .stats-table { border-collapse: collapse; margin-top: 20px; width: 60%; }
          .stats-table th { background-color: #d4af37; color: #000; padding: 6px; border: 1px solid #777; }
          .stats-table td { border: 1px solid #777; padding: 6px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header-title">الجمهورية الجزائرية الديمقراطية الشعبية</div>
        <div style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 10px;">وزارة التربية الوطنية · مديرية الدراسات</div>
        
        <table class="meta-table" style="width: 100%; margin-bottom: 15px;">
          <tr>
            <td><strong>المؤسسة:</strong> ${institution.schoolName}</td>
            <td><strong>الولاية:</strong> ${institution.wilaya}</td>
            <td><strong>السنة الدراسية:</strong> ${institution.schoolYear}</td>
          </tr>
          <tr>
            <td><strong>الفوج التربوي:</strong> ${selectedClass}</td>
            <td><strong>الفصل الدراسي:</strong> الفصل ${institution.currentTerm}</td>
            <td><strong>مدير الدراسات / الناظر:</strong> ${institution.directorOfStudies}</td>
          </tr>
          <tr>
            <td><strong>تاريخ الاستخراج:</strong> ${new Date().toLocaleDateString('ar-DZ')}</td>
            <td colspan="2"><strong>المرجع:</strong> القرار الوزاري رقم 157 المنظم لمجالس الأقسام</td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th>الرتبة</th>
              <th>اسم ولقب التلميذ</th>
              <th>الشعبة</th>
              <th>الرياضيات (مع 5)</th>
              <th>علوم الطبيعة والحياة (مع 6)</th>
              <th>العلوم الفيزيائية (مع 5)</th>
              <th>الأدب العربي (مع 3)</th>
              <th>المعدل الفصلي</th>
              <th>الملاحظة الشرفية</th>
              <th>قرار مجلس القسم</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredStudents.forEach((s, idx) => {
      const math = s.scores.find(sc => sc.subject.includes('الرياضيات'))?.examScore.toFixed(2) || '--';
      const science = s.scores.find(sc => sc.subject.includes('علوم الطبيعة'))?.examScore.toFixed(2) || '--';
      const physics = s.scores.find(sc => sc.subject.includes('الفيزيائية'))?.examScore.toFixed(2) || '--';
      const arabic = s.scores.find(sc => sc.subject.includes('الأدب'))?.examScore.toFixed(2) || '--';
      const isPass = s.average >= 10;
      const decision = isPass ? 'ناجح / ينتقل' : 'إنذار بالتقصير ومتابعة';

      excelHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td style="text-align: right; font-weight: bold;">${s.name}</td>
          <td>${s.stream}</td>
          <td>${math}</td>
          <td>${science}</td>
          <td>${physics}</td>
          <td>${arabic}</td>
          <td class="${isPass ? 'pass' : 'fail'}">${s.average.toFixed(2)}</td>
          <td>${s.mention || ''}</td>
          <td>${decision}</td>
        </tr>
      `;
    });

    excelHtml += `
          </tbody>
        </table>

        <h3 style="margin-top: 25px;">ملخص إحصائيات مجلس القسم:</h3>
        <table class="stats-table">
          <tr><th>المؤشر الإحصائي</th><th>القيمة المحققة</th></tr>
          <tr><td>إجمالي التلاميذ</td><td>${totalStudents}</td></tr>
          <tr><td>نسبة النجاح العامة</td><td>${passRate}%</td></tr>
          <tr><td>المعدل العام للفوج</td><td>${classAverage} / 20</td></tr>
          <tr><td>أعلى معدل مسجل</td><td>${highestScore} / 20</td></tr>
          <tr><td>أدنى معدل مسجل</td><td>${lowestScore} / 20</td></tr>
          <tr><td>فئة ممتاز (16 فما فوق)</td><td>${congratulationsCount}</td></tr>
          <tr><td>فئة جيد (14 - 15.99)</td><td>${honorBoardCount}</td></tr>
          <tr><td>فئة متوسط (10 - 13.99)</td><td>${encouragementCount}</td></tr>
          <tr><td>فئة ضعيف (دون المعدل)</td><td>${warningCount}</td></tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `كشف_نتائج_${selectedClass.replace(/\s+/g, '_')}_${institution.schoolName.replace(/\s+/g, '_')}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف Excel (.xls) منسقاً وجاهزاً للتقارير الإدارية.');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#105e32] text-[#f5d77f] px-4 py-3 rounded-xl border border-[#d4af37] shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 text-white" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
      
      {/* Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>الركن الثالث: محلل النتائج المدرسية ومجالس الأقسام</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              محلل النتائج المدرسية والإحصائيات البيداغوجية
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              استيراد وتحليل نقاط التلاميذ، حساب المعدلات الفردية والجماعية بالمعاملات الوزارية، وتوليد تقرير إحصائي فوري جاهز لمجلس القسم طبقاً للقرار 157.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCouncilReportOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa771c] text-[#082014] text-xs font-black flex items-center gap-2 shadow-lg border border-[#f5d77f] hover:scale-105 transition-all"
              title="توليد تقرير مجلس القسم البيداغوجي الآلي وتلخيص نقاط القوة والتحسين طبقاً للقرار 157"
            >
              <Sparkles className="w-4 h-4 text-[#8f1414]" />
              <span>تقرير مجلس القسم الآلي</span>
            </button>

            <button
              onClick={exportToExcel}
              className="px-3.5 py-2 rounded-lg bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#d4af37]/40 transition-all hover:scale-105"
              title="تصدير جدول النتائج إلى مصنف Excel منسق مع الإحصائيات"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-3.5 py-2 rounded-lg bg-[#0d2818] hover:bg-[#133d25] text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#d4af37]/30 transition-all"
              title="تصدير جدول النتائج إلى ملف CSV لبرامج الجداول والتقارير"
            >
              <Download className="w-4 h-4 text-[#d4af37]" />
              <span>تصدير CSV</span>
            </button>

            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تلميذ</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكشف</span>
            </button>
          </div>
        </div>

        {/* Class Filter & Key Stats Cards */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#d4af37]/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">الفوج التربوي المعني:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-xs font-bold text-[#f5d77f] focus:outline-none"
            >
              <option value="3 ع ت 1">3 علوم تجريبية 1 (شعبة البكالوريا)</option>
              <option value="3 ت ر 1">3 تقني رياضي 1</option>
              <option value="2 ع ت 1">2 علوم تجريبية 1</option>
            </select>
          </div>

          <div className="text-xs text-[#d4af37] font-semibold">
            {totalStudents} تلاميذ مسجلين في الفوج · الفصل الدراسي الثاني
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-3.5 rounded-xl bg-[#05140d] border border-emerald-700/60 text-right">
            <div className="text-[11px] text-slate-400">نسبة النجاح العامة</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{passRate}%</div>
            <div className="text-[10px] text-slate-400">{passingStudents.length} ناجحين من {totalStudents}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-right">
            <div className="text-[11px] text-slate-400">معدل الفوج العام</div>
            <div className="text-2xl font-black text-[#f5d77f] mt-1">{classAverage} / 20</div>
            <div className="text-[10px] text-slate-400">المعدل الحسابي الموزون</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-emerald-600/40 text-right">
            <div className="text-[11px] text-slate-400">أعلى معدل في القسم</div>
            <div className="text-2xl font-black text-white mt-1">{highestScore} / 20</div>
            <div className="text-[10px] text-emerald-400">المرتبة الأولى (تهنئة)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05140d] border border-red-900/60 text-right">
            <div className="text-[11px] text-slate-400">التلاميذ المتعثرون</div>
            <div className="text-2xl font-black text-red-400 mt-1">{warningCount} تلاميذ</div>
            <div className="text-[10px] text-red-300/80">معدل أقل من 10 (يحتاجون دعماً)</div>
          </div>
        </div>
      </div>

      {/* Early Warning Smart Alert Radar for At-Risk Students */}
      <AtRiskStudentsRadar
        students={filteredStudents}
        institution={institution}
        classGroup={selectedClass}
      />

      {/* Absence Impact on Academic Performance Annex (Synced with AbsenceRadarApp) */}
      <AbsenceImpactAnnexSection
        students={filteredStudents}
        absences={absences}
        classGroup={selectedClass}
        impacts={absenceImpacts}
        onOpenReportModal={() => setIsCouncilReportOpen(true)}
      />

      {/* Recharts Grade Distribution Bar Chart */}
      <GradeDistributionChart 
        students={filteredStudents} 
        classGroup={selectedClass} 
      />

      {/* Honors Distribution Bar */}
      <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#d4af37]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              توزيع الملاحظات الشرفية لمجلس القسم (القرار 157):
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">المكافآت والعقوبات التربوية</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#05140d] border border-yellow-500/40 text-center">
            <div className="font-bold text-[#f5d77f]">تهنئة (16 فما فوق)</div>
            <div className="text-xl font-black text-white my-1">{congratulationsCount}</div>
            <div className="text-[10px] text-slate-400">تلميذ متفوق جداً</div>
          </div>

          <div className="p-3 rounded-lg bg-[#05140d] border border-emerald-600/40 text-center">
            <div className="font-bold text-emerald-300">لوحة شرف (14 - 15.99)</div>
            <div className="text-xl font-black text-white my-1">{honorBoardCount}</div>
            <div className="text-[10px] text-slate-400">تلميذ جيد</div>
          </div>

          <div className="p-3 rounded-lg bg-[#05140d] border border-blue-600/40 text-center">
            <div className="font-bold text-blue-300">تشجيع (12 - 13.99)</div>
            <div className="text-xl font-black text-white my-1">{encouragementCount}</div>
            <div className="text-[10px] text-slate-400">تلميذ متوسط إلى حسن</div>
          </div>

          <div className="p-3 rounded-lg bg-[#05140d] border border-red-800/60 text-center">
            <div className="font-bold text-red-400">إنذار وتنبيه (أقل من 10)</div>
            <div className="text-xl font-black text-white my-1">{warningCount}</div>
            <div className="text-[10px] text-slate-400">معرض للرسوب أو الإعادة</div>
          </div>
        </div>
      </div>

      {/* Class Council Scores Table */}
      <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 shadow-xl overflow-hidden">
        <div className="p-4 bg-[#05140d] border-b border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
            <h4 className="font-bold text-white text-sm">
              جدول كشف النقاط التفصيلي ورتب التلاميذ لمجلس القسم
            </h4>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              (مرتب تنازلياً حسب المعدل)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCouncilReportOpen(true)}
              className="px-3 py-1 rounded bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-black text-xs flex items-center gap-1.5 shadow border border-[#f5d77f] hover:scale-105 transition-all"
              title="توليد تقرير مجلس القسم الآلي"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8f1414]" />
              <span>تقرير المجلس الآلي</span>
            </button>

            <button
              onClick={exportToExcel}
              className="px-2.5 py-1 rounded bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] font-bold text-xs flex items-center gap-1 border border-[#d4af37]/30 transition-colors"
              title="تصدير إلى Excel (.xls)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-2.5 py-1 rounded bg-[#0d2818] hover:bg-[#133d25] text-white font-bold text-xs flex items-center gap-1 border border-[#d4af37]/30 transition-colors"
              title="تصدير إلى CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>تصدير CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right min-w-[700px]">
            <thead className="bg-[#030e08] text-[#f5d77f] border-b border-[#d4af37]/30">
              <tr>
                <th className="p-3 text-center w-12">الرتبة</th>
                <th className="p-3">اسم ولقب التلميذ</th>
                <th className="p-3 text-center">الرياضيات (مع 5)</th>
                <th className="p-3 text-center">العلوم الطبيعية (مع 6)</th>
                <th className="p-3 text-center">الفيزياء (مع 5)</th>
                <th className="p-3 text-center">الأدب العربي (مع 3)</th>
                <th className="p-3 text-center font-bold">المعدل الفصلي</th>
                <th className="p-3">قرار مجلس القسم والملاحظة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4af37]/15">
              {filteredStudents.map((student, idx) => {
                const isPass = student.average >= 10;

                const getSubjectExam = (subName: string) => {
                  const s = student.scores.find(sc => sc.subject.includes(subName));
                  return s ? s.examScore.toFixed(1) : '--';
                };

                return (
                  <tr key={student.id} className="hover:bg-[#0c2419]/40 transition-colors">
                    <td className="p-3 text-center font-bold">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black' :
                        idx === 1 ? 'bg-slate-300 text-black' :
                        idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-white text-sm">{student.name}</div>
                      <div className="text-[10px] text-slate-400">{student.stream}</div>
                    </td>

                    <td className="p-3 text-center font-mono text-slate-200">
                      {getSubjectExam('الرياضيات')}
                    </td>

                    <td className="p-3 text-center font-mono text-slate-200">
                      {getSubjectExam('علوم الطبيعة')}
                    </td>

                    <td className="p-3 text-center font-mono text-slate-200">
                      {getSubjectExam('الفيزيائية')}
                    </td>

                    <td className="p-3 text-center font-mono text-slate-200">
                      {getSubjectExam('الأدب العربي')}
                    </td>

                    <td className="p-3 text-center">
                      <span className={`text-sm font-black px-2.5 py-1 rounded-md ${
                        isPass 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' 
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {student.average.toFixed(2)}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className={`text-[11px] font-semibold ${
                        student.average >= 14 ? 'text-[#f5d77f]' :
                        student.average >= 10 ? 'text-emerald-300' : 'text-red-400'
                      }`}>
                        {student.mention || (isPass ? 'مقبول' : 'إنذار بالتقصير')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#081f14] border-2 border-[#d4af37] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
              <h3 className="font-bold text-white text-base">إضافة تلميذ ونقاط الاختبار للفوج</h3>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم ولقب التلميذ</label>
                <input
                  type="text"
                  placeholder="محمد الأمين بوزيان..."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نقطة الرياضيات (مع 5)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    value={mathExam}
                    onChange={(e) => setMathExam(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نقطة العلوم الطبيعية (مع 6)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    value={scienceExam}
                    onChange={(e) => setScienceExam(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نقطة الفيزياء (مع 5)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    value={physicsExam}
                    onChange={(e) => setPhysicsExam(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نقطة الأدب العربي (مع 3)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    value={arabicExam}
                    onChange={(e) => setArabicExam(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-bold"
                >
                  حساب المعدل وإضافته للمجلس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Automated Council Report Modal */}
      <AutomatedCouncilReportModal
        isOpen={isCouncilReportOpen}
        onClose={() => setIsCouncilReportOpen(false)}
        institution={institution}
        classGroup={selectedClass}
        students={filteredStudents}
        absenceImpacts={absenceImpacts}
      />

    </div>
  );
};
