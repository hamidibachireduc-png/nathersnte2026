import React, { useState } from 'react';
import { 
  UserX, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  FileSpreadsheet, 
  FileText, 
  Clock, 
  ArrowDownRight,
  ShieldAlert,
  Printer
} from 'lucide-react';
import { AbsenceRecord, StudentScore } from '../types';

export interface StudentAbsenceImpact {
  studentName: string;
  classGroup: string;
  average: number;
  totalHours: number;
  unjustifiedHours: number;
  justifiedHours: number;
  impactLevel: 'none' | 'low' | 'moderate' | 'severe';
  impactDescription: string;
  councilAction: string;
}

export function calculateStudentAbsenceImpacts(
  students: StudentScore[],
  absences: AbsenceRecord[]
): StudentAbsenceImpact[] {
  return students.map(student => {
    const studentAbs = absences.filter(
      a => a.type === 'student' && (
        a.personName.trim() === student.name.trim() ||
        a.personName.includes(student.name) ||
        student.name.includes(a.personName)
      )
    );

    const totalHours = studentAbs.reduce((acc, curr) => acc + curr.hours, 0);
    const unjustifiedHours = studentAbs.filter(a => !a.isJustified).reduce((acc, curr) => acc + curr.hours, 0);
    const justifiedHours = studentAbs.filter(a => a.isJustified).reduce((acc, curr) => acc + curr.hours, 0);

    let impactLevel: StudentAbsenceImpact['impactLevel'] = 'none';
    let impactDescription = 'مواظبة ممتازة؛ لا يوجد أي تأثير سلبي على النتائج والتقويم المستمر.';
    let councilAction = 'تثبيت نقطة انضباط كاملة وتوجيه تشجيع.';

    if (totalHours >= 12 || unjustifiedHours >= 8) {
      impactLevel = 'severe';
      impactDescription = `تأثير سلبي حاد: ضياع ${totalHours} ساعة (منها ${unjustifiedHours}س غير مبررة) تسبب في فقدان نحو 2.0 إلى 3.5 نقاط من التقويم وفروض الاستيعاب.`;
      councilAction = 'استدعاء فوري للولي، إنذار بالغياب، والخصم من نقطة التقويم المستمر.';
    } else if (totalHours >= 6 || unjustifiedHours >= 4) {
      impactLevel = 'moderate';
      impactDescription = `تأثير متوسط: ضياع ${totalHours} ساعات أدى لتراجع ملحوظ في الحصص الصباحية وفروض المادة الأساسية.`;
      councilAction = 'إشعار الولي مع توجيه تنبيه شفهي وإلزام التلميذ ببرنامج استدراك.';
    } else if (totalHours > 0) {
      impactLevel = 'low';
      impactDescription = `تأثير طفيف ومتحكم فيه: ${totalHours} ساعات ${justifiedHours > 0 ? 'معظمها مبررة قانوناً' : ''} مع تعويض الدروس.`;
      councilAction = 'متابعة دورية من الأستاذ الرئيسي.';
    }

    return {
      studentName: student.name,
      classGroup: student.classGroup,
      average: student.average,
      totalHours,
      unjustifiedHours,
      justifiedHours,
      impactLevel,
      impactDescription,
      councilAction
    };
  });
}

interface AbsenceImpactAnnexSectionProps {
  students: StudentScore[];
  absences: AbsenceRecord[];
  classGroup: string;
  impacts: StudentAbsenceImpact[];
  onOpenReportModal: () => void;
  onRefreshSync?: () => void;
}

export const AbsenceImpactAnnexSection: React.FC<AbsenceImpactAnnexSectionProps> = ({
  students,
  absences,
  classGroup,
  impacts,
  onOpenReportModal,
  onRefreshSync
}) => {
  const [lastSyncTime, setLastSyncTime] = useState<string>('منذ قليل');

  const handleManualSync = () => {
    setLastSyncTime(new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }));
    if (onRefreshSync) {
      onRefreshSync();
    }
  };

  const totalClassAbsenceHours = impacts.reduce((acc, curr) => acc + curr.totalHours, 0);
  const totalUnjustifiedClassHours = impacts.reduce((acc, curr) => acc + curr.unjustifiedHours, 0);
  const severeImpactStudents = impacts.filter(i => i.impactLevel === 'severe');

  return (
    <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/40 p-5 shadow-xl space-y-4">
      
      {/* Top Banner & Sync Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#8f1414] text-white">
              <UserX className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
              ملحق التنسيق والربط البيداغوجي: راصد الغيابات ↔ محلل النتائج
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              متصل بـ AbsenceRadarApp
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>ملحق رصد أثر الغيابات والمواظبة على المعدلات الفصلية</span>
            <span className="text-xs bg-[#d4af37] text-[#082014] font-bold px-2 py-0.5 rounded">
              فوج {classGroup}
            </span>
          </h3>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            يستورد النظام تلقائياً سجلات الغياب من راصد المواظبة، ويحلل إحصائياً مدى تأثير الغيابات غير المبررة على تراجع المعدل الفصلي ونقاط التقويم المستمر، لدمجه كملحق رسمي في تقرير مجلس القسم.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            className="px-3 py-1.5 rounded-lg bg-[#0d2818] hover:bg-[#133d25] text-[#f5d77f] text-xs font-bold flex items-center gap-1.5 border border-[#d4af37]/40 shadow-sm transition-all"
            title="تحديث واستيراد أحدث بيانات الغياب المسجلة في راصد المواظبة"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>مزامنة الغيابات ({lastSyncTime})</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>عرض في تقرير المجلس</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-center">
          <div className="text-slate-400 text-[11px]">إجمالي غيابات الفوج</div>
          <div className="text-xl font-black text-white font-mono my-0.5">{totalClassAbsenceHours} ساعة</div>
          <div className="text-[10px] text-slate-400">خلال الفصل الدراسي</div>
        </div>

        <div className="p-3 rounded-lg bg-[#05140d] border border-red-900/60 text-center">
          <div className="text-red-300 text-[11px]">غيابات غير مبررة</div>
          <div className="text-xl font-black text-red-400 font-mono my-0.5">{totalUnjustifiedClassHours} ساعة</div>
          <div className="text-[10px] text-red-300/80">تستوجب إجراءات تأديبية</div>
        </div>

        <div className="p-3 rounded-lg bg-[#05140d] border border-red-800/80 text-center">
          <div className="text-red-300 text-[11px]">تلاميذ بتأثير سلبي حاد</div>
          <div className="text-xl font-black text-red-500 font-mono my-0.5">{severeImpactStudents.length} تلاميذ</div>
          <div className="text-[10px] text-slate-400">انخفاض المعدل &gt; 2 نقاط</div>
        </div>

        <div className="p-3 rounded-lg bg-[#05140d] border border-emerald-800/60 text-center">
          <div className="text-emerald-300 text-[11px]">تلاميذ بمواظبة تامة</div>
          <div className="text-xl font-black text-emerald-400 font-mono my-0.5">
            {impacts.filter(i => i.totalHours === 0).length} تلاميذ
          </div>
          <div className="text-[10px] text-emerald-300/80">مواظبة 100% وانضباط</div>
        </div>
      </div>

      {/* Impact Correlation Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-[#d4af37]/20">
        <table className="w-full text-xs text-right min-w-[700px]">
          <thead className="bg-[#05140d] text-[#f5d77f] border-b border-[#d4af37]/30">
            <tr>
              <th className="p-3">اسم ولقب التلميذ</th>
              <th className="p-3 text-center">المعدل الفصلي</th>
              <th className="p-3 text-center">ساعات الغياب</th>
              <th className="p-3 text-center">غير مبررة</th>
              <th className="p-3 text-center">مؤشر التأثير على المعدل</th>
              <th className="p-3">التشخيص والأثر البيداغوجي المباشر</th>
              <th className="p-3">التوصية التأديبية لمجلس القسم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d4af37]/15">
            {impacts.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#0c2419]/40 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-white text-sm">{item.studentName}</div>
                  <div className="text-[10px] text-slate-400">{item.classGroup}</div>
                </td>

                <td className="p-3 text-center">
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                    item.average >= 10 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {item.average.toFixed(2)}
                  </span>
                </td>

                <td className="p-3 text-center font-mono font-bold text-white">
                  {item.totalHours > 0 ? `${item.totalHours} س` : '0 س'}
                </td>

                <td className="p-3 text-center font-mono font-bold">
                  {item.unjustifiedHours > 0 ? (
                    <span className="text-red-400">{item.unjustifiedHours} س</span>
                  ) : (
                    <span className="text-slate-500">0</span>
                  )}
                </td>

                <td className="p-3 text-center">
                  {item.impactLevel === 'severe' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 animate-pulse">
                      <TrendingDown className="w-3 h-3 text-red-400" />
                      تأثير سلبي حاد
                    </span>
                  )}
                  {item.impactLevel === 'moderate' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-700">
                      <Clock className="w-3 h-3 text-yellow-400" />
                      تأثير متوسط
                    </span>
                  )}
                  {item.impactLevel === 'low' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700">
                      تأثير طفيف
                    </span>
                  )}
                  {item.impactLevel === 'none' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      مواظبة ممتازة
                    </span>
                  )}
                </td>

                <td className="p-3 max-w-xs">
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {item.impactDescription}
                  </p>
                </td>

                <td className="p-3 max-w-xs">
                  <p className="text-amber-300 text-xs font-medium leading-relaxed">
                    {item.councilAction}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
        <span>المرجع: القرار 157 (المواظبة والانضباط كمعيار في مداولات مجالس الأقسام)</span>
        <span className="text-[#d4af37] font-semibold">مدمج آلياً في ملحق تقرير مجلس القسم A4 و Word</span>
      </div>
    </div>
  );
};
