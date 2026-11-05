import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Printer,
  Download,
  UserPlus,
  SlidersHorizontal,
  CheckCircle2,
  Award,
  FileSpreadsheet,
  Eye,
  X,
  RotateCcw,
  BookOpen,
  Layers,
} from 'lucide-react';
import {
  EducationStage,
  InstitutionInfo,
  StudentRecord,
  SubjectConfig,
  AbsenceRecord,
  FormulaMode,
  SchoolLevelName,
  CalculatedStudentSummary,
} from '../types';
import {
  CLASS_GROUPS,
  INITIAL_SUBJECTS,
  STAGE_METADATA,
  calculateClassSummaries,
  DEFAULT_EMBLEM_URL,
} from '../data/initialData';

interface AutomaticAveragesViewProps {
  activeStage: EducationStage;
  onSelectStage: (stage: EducationStage) => void;
  institution: InstitutionInfo;
  students: StudentRecord[];
  onUpdateStudents: (students: StudentRecord[]) => void;
  subjects: SubjectConfig[];
  onUpdateSubjects: (subjects: SubjectConfig[]) => void;
  absences: AbsenceRecord[];
}

export const AutomaticAveragesView: React.FC<AutomaticAveragesViewProps> = ({
  activeStage,
  onSelectStage,
  institution,
  students,
  onUpdateStudents,
  subjects,
  onUpdateSubjects,
  absences,
}) => {
  const stageMeta = STAGE_METADATA[activeStage];
  const stageClasses = useMemo(
    () => CLASS_GROUPS.filter((c) => c.stage === activeStage),
    [activeStage]
  );
  const stageSubjects = useMemo(
    () => subjects.filter((s) => s.stages.includes(activeStage)),
    [subjects, activeStage]
  );

  const [selectedClass, setSelectedClass] = useState<string>(
    stageClasses[0]?.name || '4 م 1'
  );
  const [viewMode, setViewMode] = useState<'master' | 'subject_entry'>('master');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [formulaMode, setFormulaMode] = useState<FormulaMode>(
    activeStage === 'primary' ? 'primary_exam_plus_eval' : 'ministry_standard'
  );
  const [includeAttendanceInEval, setIncludeAttendanceInEval] =
    useState<boolean>(false);
  const [showCoeffEditor, setShowCoeffEditor] = useState<boolean>(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [selectedStudentForBulletin, setSelectedStudentForBulletin] =
    useState<CalculatedStudentSummary | null>(null);
  const [showCouncilReportPrint, setShowCouncilReportPrint] =
    useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // عند تغيير الطور التعليمي، اضبط الفوج والصيغة الافتراضية تلقائياً
  useEffect(() => {
    const firstClass = CLASS_GROUPS.find((c) => c.stage === activeStage);
    if (firstClass) {
      setSelectedClass(firstClass.name);
    }
    setFormulaMode(
      activeStage === 'primary' ? 'primary_exam_plus_eval' : 'ministry_standard'
    );
    setSelectedStudentForBulletin(null);
  }, [activeStage]);

  // حقول إضافة تلميذ جديد
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentBirth, setNewStudentBirth] = useState('2012-05-15');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('0550 00 00 00');

  const currentClassMeta =
    stageClasses.find((c) => c.name === selectedClass) || stageClasses[0];

  const classStudents = useMemo(
    () =>
      students.filter(
        (s) => s.stage === activeStage && s.classGroup === selectedClass
      ),
    [students, activeStage, selectedClass]
  );

  const stageAbsences = useMemo(
    () => absences.filter((a) => a.stage === activeStage),
    [absences, activeStage]
  );

  const summaries = useMemo(
    () =>
      calculateClassSummaries(
        classStudents,
        subjects,
        stageAbsences,
        formulaMode,
        includeAttendanceInEval,
        activeStage
      ),
    [
      classStudents,
      subjects,
      stageAbsences,
      formulaMode,
      includeAttendanceInEval,
      activeStage,
    ]
  );

  const selectedSubject =
    stageSubjects.find((s) => s.id === selectedSubjectId) || stageSubjects[0];

  const maxScale = stageMeta.maxGradeScale;
  const passMark = stageMeta.passingGrade;

  // إحصائيات الفوج التلقائية حسب سلم الطور (/10 للابتدائي، /20 للمتوسط والثانوي)
  const stats = useMemo(() => {
    const count = summaries.length;
    if (count === 0) {
      return {
        count: 0,
        classAvg: '0.00',
        maxAvg: '0.00',
        minAvg: '0.00',
        passCount: 0,
        passRate: '0.0',
        excellentCount: 0,
        goodCount: 0,
        averageCount: 0,
        weakCount: 0,
      };
    }
    const avgSum = summaries.reduce((acc, s) => acc + s.termAverage, 0);
    const classAvg = (avgSum / count).toFixed(2);
    const maxAvg = summaries[0].termAverage.toFixed(2);
    const minAvg = summaries[summaries.length - 1].termAverage.toFixed(2);
    const passCount = summaries.filter((s) => s.termAverage >= passMark).length;
    const passRate = ((passCount / count) * 100).toFixed(1);

    const excThreshold = maxScale === 10 ? 8.5 : 16;
    const goodThreshold = maxScale === 10 ? 7.0 : 14;

    const excellentCount = summaries.filter(
      (s) => s.termAverage >= excThreshold
    ).length;
    const goodCount = summaries.filter(
      (s) => s.termAverage >= goodThreshold && s.termAverage < excThreshold
    ).length;
    const averageCount = summaries.filter(
      (s) => s.termAverage >= passMark && s.termAverage < goodThreshold
    ).length;
    const weakCount = summaries.filter((s) => s.termAverage < passMark).length;

    return {
      count,
      classAvg,
      maxAvg,
      minAvg,
      passCount,
      passRate,
      excellentCount,
      goodCount,
      averageCount,
      weakCount,
    };
  }, [summaries, maxScale, passMark]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // تحديث نقطة تلميذ في مادة معينة
  const handleUpdateStudentMark = (
    studentId: string,
    subjectId: string,
    field: 'eval' | 'test' | 'exam' | 'exempt',
    value: number | boolean
  ) => {
    const defaultMark = maxScale === 10 ? 6 : 10;
    const updated = students.map((st) => {
      if (st.id !== studentId) return st;
      const currentGrade = st.grades[subjectId] || {
        eval: defaultMark,
        test: defaultMark,
        exam: defaultMark,
        exempt: false,
      };
      if (field === 'exempt') {
        return {
          ...st,
          grades: {
            ...st.grades,
            [subjectId]: { ...currentGrade, exempt: Boolean(value) },
          },
        };
      }
      const clampedNum = Math.min(maxScale, Math.max(0, Number(value) || 0));
      return {
        ...st,
        grades: {
          ...st.grades,
          [subjectId]: { ...currentGrade, [field]: clampedNum },
        },
      };
    });
    onUpdateStudents(updated);
  };

  // تحديث معامل مادة لمستوى معين
  const handleUpdateCoefficient = (
    subjectId: string,
    level: SchoolLevelName,
    newCoeff: number
  ) => {
    const clamped = Math.min(10, Math.max(1, Math.round(newCoeff) || 1));
    const updated = subjects.map((subj) =>
      subj.id === subjectId
        ? {
            ...subj,
            coefficients: { ...subj.coefficients, [level]: clamped },
          }
        : subj
    );
    onUpdateSubjects(updated);
  };

  // إضافة تلميذ جديد للفوج الحالي
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const defaultMark = maxScale === 10 ? 7 : 12;
    const defaultGrades: Record<
      string,
      { eval: number; test: number; exam: number; exempt?: boolean }
    > = {};
    stageSubjects.forEach((subj) => {
      defaultGrades[subj.id] = {
        eval: defaultMark,
        test: defaultMark,
        exam: defaultMark,
        exempt: false,
      };
    });

    const newRecord: StudentRecord = {
      id: `st-${Date.now()}`,
      stage: activeStage,
      matricule: `20260${students.length + 21}`,
      fullName: newStudentName.trim(),
      birthDate: newStudentBirth,
      classGroup: selectedClass,
      level: currentClassMeta.level,
      parentName: newParentName.trim() || 'ولي التلميذ',
      parentPhone: newParentPhone.trim() || '0550 00 00 00',
      canteenBeneficiary: activeStage === 'primary',
      grades: defaultGrades,
    };

    onUpdateStudents([...students, newRecord]);
    setNewStudentName('');
    setNewParentName('');
    setShowAddStudentModal(false);
    triggerToast(
      `تم إدراج التلميذ "${newRecord.fullName}" وحساب معدله تلقائياً (/${maxScale}) في الفوج ${selectedClass}`
    );
  };

  // تصدير الجدول الشامل إلى CSV متوافق مع Excel
  const handleExportCSV = () => {
    if (summaries.length === 0) return;
    const headers = [
      'الرتبة',
      'رقم التسجيل',
      'اسم ولقب التلميذ',
      ...stageSubjects.map((s) =>
        activeStage === 'primary'
          ? `${s.shortName} (/10)`
          : `${s.shortName} (مع ${s.coefficients[currentClassMeta.level] || 1})`
      ),
      'مجموع المعاملات',
      'المجموع العام',
      `المعدل الفصلي (/${maxScale})`,
      'الغيابات غير المبررة',
      `نقطة المواظبة (/${maxScale})`,
      'الإجازة / قرار المجلس',
    ];

    const rows = summaries.map((item) => [
      item.rank,
      item.student.matricule,
      `"${item.student.fullName}"`,
      ...item.subjectResults.map((r) =>
        r.exempt ? 'معفى' : r.subjectAvg.toFixed(2)
      ),
      item.totalCoefficients,
      item.totalWeightedScore.toFixed(2),
      item.termAverage.toFixed(2),
      item.unjustifiedAbsencesCount,
      item.attendanceScore.toFixed(2),
      `"${item.honorRoll}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n') +
      `\n\nالطور التعليمي,${stageMeta.name}\nالمعدل العام للقسم,${stats.classAvg} / ${maxScale}\nنسبة النجاح,${stats.passRate}%\nأعلى معدل,${stats.maxAvg} / ${maxScale}\nأدنى معدل,${stats.minAvg} / ${maxScale}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `كشف_معدلات_${stageMeta.shortName}_${selectedClass.replace(/\s+/g, '_')}_الفصل_${institution.currentTerm}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(
      `تم تصدير جدول المعدلات (${stageMeta.name}) بصيغة CSV متوافقة مع Excel`
    );
  };

  const logoSrc = institution.logoUrl || DEFAULT_EMBLEM_URL;

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#105e32] text-white border-2 border-[#d4af37] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#f5d77f] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* رأس القسم المكيف مع الطور المختار */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#081f15] to-[#103624] border border-[#d4af37]/50 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white font-bold border border-[#f5d77f]/30">
                محرك الحساب التلقائي للمعدلات — {stageMeta.name} (سلم /{maxScale})
              </span>
              <span className="text-[#d4af37] font-semibold">
                {stageMeta.badgeText}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[#d4af37]" />
              <span>
                الحساب التلقائي للمعدلات الفصلية ({stageMeta.name} — من {maxScale})
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {activeStage === 'primary' ? (
                <>
                  مخصص لخصوصية <span className="text-[#f5d77f] font-bold">الطور الابتدائي</span>: سلم التنقيط من{' '}
                  <span className="text-emerald-300 font-bold">10 (/10)</span> ومعدل النجاح{' '}
                  <span className="text-emerald-300 font-bold">5.00 / 10</span> بدون فروض محروسة ولا معاملات معقدة، مع تصنيف آلي لمستويات التحكم في الكفاءات (<span className="text-[#f5d77f] font-bold">أ، ب، ج، د</span>).
                </>
              ) : activeStage === 'middle' ? (
                <>
                  مخصص لخصوصية <span className="text-[#f5d77f] font-bold">الطور المتوسط</span>: سلم التنقيط من{' '}
                  <span className="text-emerald-300 font-bold">20 (/20)</span> وفق المعادلة الرسمية{' '}
                  <span className="text-[#f5d77f] font-bold">[(التقويم + الفرض)/2 + الاختبار×2] ÷ 3</span> ومعاملات المستويات الأربعة (1م إلى 4م BEM).
                </>
              ) : (
                <>
                  مخصص لخصوصية <span className="text-[#f5d77f] font-bold">الطور الثانوي</span>: سلم التنقيط من{' '}
                  <span className="text-emerald-300 font-bold">20 (/20)</span> مع تطبيق المعاملات المميزة لكل جذع مشترك وشعبة (علوم تجريبية، تقني رياضي، آداب وفلسفة) وتحضير البكالوريا BAC.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة تلميذ للفوج</span>
            </button>

            {stageMeta.hasCoefficients && (
              <button
                onClick={() => setShowCoeffEditor(!showCoeffEditor)}
                className="px-3.5 py-2 rounded-xl bg-[#0c2a1c] hover:bg-[#133d28] text-[#f5d77f] border border-[#d4af37]/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>ضبط المعاملات ({currentClassMeta?.level})</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#0c2a1c] hover:bg-[#133d28] text-emerald-300 border border-emerald-600/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تصدير Excel / CSV</span>
            </button>

            <button
              onClick={() => setShowCouncilReportPrint(true)}
              className="px-3.5 py-2 rounded-xl bg-[#105e32] hover:bg-[#157a41] text-white border border-[#d4af37]/50 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#f5d77f]" />
              <span>
                {activeStage === 'primary'
                  ? 'محضر مجلس الأساتذة A4'
                  : 'محضر مجلس القسم A4'}
              </span>
            </button>
          </div>
        </div>

        {/* شريط الإعدادات الحسابية والمرونة حسب الطور */}
        <div className="mt-5 pt-4 border-t border-[#d4af37]/20 grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* تبديل سريع للطور */}
          <div className="bg-[#06150e]/90 p-3 rounded-xl border border-[#d4af37]/30">
            <label className="block text-[11px] font-bold text-[#d4af37] mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>1. الطور التعليمي:</span>
            </label>
            <select
              value={activeStage}
              onChange={(e) => onSelectStage(e.target.value as EducationStage)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-black focus:outline-none"
            >
              <option value="primary">الطور الابتدائي (سلم /10)</option>
              <option value="middle">الطور المتوسط (سلم /20 · BEM)</option>
              <option value="secondary">الطور الثانوي (سلم /20 · BAC)</option>
            </select>
          </div>

          {/* اختيار الفوج */}
          <div className="bg-[#06150e]/90 p-3 rounded-xl border border-[#d4af37]/30">
            <label className="block text-[11px] font-bold text-[#d4af37] mb-1">
              2. الفوج التربوي والمستوى / الشعبة:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold focus:outline-none"
            >
              {stageClasses.map((cg) => (
                <option key={cg.name} value={cg.name}>
                  {cg.name} — {cg.label}
                </option>
              ))}
            </select>
          </div>

          {/* اختيار صيغة الحساب التلقائي */}
          <div className="bg-[#06150e]/90 p-3 rounded-xl border border-[#d4af37]/30">
            <label className="block text-[11px] font-bold text-[#d4af37] mb-1">
              3. المعادلة الحسابية لـ {stageMeta.name}:
            </label>
            {activeStage === 'primary' ? (
              <select
                value={formulaMode}
                onChange={(e) => setFormulaMode(e.target.value as FormulaMode)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold focus:outline-none"
              >
                <option value="primary_exam_plus_eval">
                  (التقويم المستمر للمكتسبات + الاختبار) ÷ 2 (/10)
                </option>
                <option value="primary_exam_only">
                  علامة اختبار التحصيل الفصلي مباشرة (/10)
                </option>
              </select>
            ) : (
              <select
                value={formulaMode}
                onChange={(e) => setFormulaMode(e.target.value as FormulaMode)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold focus:outline-none"
              >
                <option value="ministry_standard">
                  الصيغة الرسمية: [(التقويم + الفرض)/2 + الاختبار×2] ÷ 3
                </option>
                <option value="four_divisor">
                  صيغة القسمة على 4: (التقويم + الفرض + الاختبار×2) ÷ 4
                </option>
                <option value="test_exam_only">
                  صيغة الفرض والاختبار: (الفرض + الاختبار×2) ÷ 3
                </option>
              </select>
            )}
          </div>

          {/* ربط الغيابات بالتقويم المستمر */}
          <div className="bg-[#06150e]/90 p-3 rounded-xl border border-[#d4af37]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#d4af37]">
                4. الربط التلقائي بالمواظبة:
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold">
                سلم /{maxScale}
              </span>
            </div>
            <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-xs text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={includeAttendanceInEval}
                onChange={(e) => setIncludeAttendanceInEval(e.target.checked)}
                className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
              />
              <span>دمج نقطة المواظبة (20%) في التقويم المستمر آلياً</span>
            </label>
          </div>
        </div>
      </div>

      {/* محرر المعاملات (يظهر في المتوسط والثانوي) */}
      {showCoeffEditor && stageMeta.hasCoefficients && currentClassMeta && (
        <div className="rounded-2xl bg-[#091e14] border-2 border-[#d4af37]/60 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
                <span>
                  جدول معاملات المواد الرسمية لـ ({currentClassMeta.level}) — قابل للتعديل الفوري
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                أي تعديل في المعاملات يعيد حساب المجموع المعامل والمعدل الفصلي والرتب لجميع تلاميذ الفوج تلقائياً
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onUpdateSubjects(INITIAL_SUBJECTS);
                  triggerToast('تمت استعادة المعاملات الرسمية لوزارة التربية الوطنية');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة المعاملات الرسمية</span>
              </button>
              <button
                onClick={() => setShowCoeffEditor(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {stageSubjects.map((subj) => {
              const coeff = subj.coefficients[currentClassMeta.level] ?? 1;
              return (
                <div
                  key={subj.id}
                  className="p-3 rounded-xl bg-[#06150e] border border-[#d4af37]/30 flex flex-col justify-between gap-2"
                >
                  <div className="text-xs font-bold text-white truncate" title={subj.name}>
                    {subj.shortName}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">المعامل:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={coeff}
                      onChange={(e) =>
                        handleUpdateCoefficient(
                          subj.id,
                          currentClassMeta.level,
                          Number(e.target.value)
                        )
                      }
                      className="w-16 px-2 py-1 rounded bg-[#0c261a] border border-[#d4af37]/50 text-center font-mono font-black text-sm text-[#f5d77f] tabular-nums"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* بطاقات الحصيلة الإحصائية اللحظية للفوج */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#081a12] border border-[#d4af37]/40">
          <div className="text-[11px] text-slate-400">
            المعدل العام للفوج ({selectedClass})
          </div>
          <div className="text-2xl font-black text-[#f5d77f] mt-1 tabular-nums">
            {stats.classAvg}{' '}
            <span className="text-xs font-normal text-slate-400">/ {maxScale}</span>
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5 tabular-nums">
            {activeStage === 'primary'
              ? `عدد المواد: ${stageSubjects.length} (معامل 1)`
              : `مجموع المعاملات: ${summaries[0]?.totalCoefficients || 26}`}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-emerald-700/50">
          <div className="text-[11px] text-slate-400">
            نسبة النجاح (&ge; {passMark}/{maxScale})
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">
            {stats.passRate}%
          </div>
          <div className="text-[10px] text-emerald-300 mt-0.5 tabular-nums">
            {stats.passCount} ناجح من أصل {stats.count} تلميذ
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-teal-700/50">
          <div className="text-[11px] text-slate-400">أعلى معدل في الفوج</div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            {stats.maxAvg}{' '}
            <span className="text-xs font-normal text-slate-400">/ {maxScale}</span>
          </div>
          <div className="text-[10px] text-teal-300 mt-0.5 truncate">
            المرتبة 1: {summaries[0]?.student.fullName || '—'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-amber-700/50">
          <div className="text-[11px] text-slate-400">
            {activeStage === 'primary' ? 'تحكم أقصى ومقبول (أ + ب)' : 'إجازات التهنئة والتشجيع'}
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1 tabular-nums">
            {stats.excellentCount + stats.goodCount}
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5 tabular-nums">
            {stats.excellentCount} امتياز · {stats.goodCount} جيد جداً
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-blue-800/50">
          <div className="text-[11px] text-slate-400">
            {activeStage === 'primary' ? 'تحكم جزئي (ج: 5 إلى 6.99)' : 'فئة المتوسط (10 إلى 13.99)'}
          </div>
          <div className="text-2xl font-black text-blue-300 mt-1 tabular-nums">
            {stats.averageCount} تلميذ
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">مكتسبات مقبولة قابلة للتحسين</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#081a12] border border-rose-800/60">
          <div className="text-[11px] text-slate-400">
            بحاجة لمعالجة (&lt; {passMark}/{maxScale})
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1 tabular-nums">
            {stats.weakCount} تلميذ
          </div>
          <div className="text-[10px] text-rose-300 mt-0.5 tabular-nums">
            أدنى معدل: {stats.minAvg} / {maxScale}
          </div>
        </div>
      </div>

      {/* أزرار التبديل بين الكشف الإجمالي الشامل وحجز النقاط التفصيلي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#091e14] p-3.5 rounded-xl border border-[#d4af37]/30">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewMode('master')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'master'
                ? 'bg-gradient-to-r from-[#105e32] to-[#0a3c20] text-[#f5d77f] border border-[#d4af37]/60 shadow'
                : 'bg-[#06150e] text-slate-300 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>
              الجدول الجامع للمعدلات المحسوبة تلقائياً ({stageMeta.name} /{maxScale})
            </span>
          </button>

          <button
            onClick={() => setViewMode('subject_entry')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'subject_entry'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black shadow'
                : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {activeStage === 'primary'
                ? 'حجز وتعديل نقاط المادة وتقييم الكفاءات (/10)'
                : 'حجز وتعديل النقاط التفصيلية (التقويم · الفرض · الاختبار /20)'}
            </span>
          </button>
        </div>

        {viewMode === 'subject_entry' && currentClassMeta && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#d4af37] whitespace-nowrap">
              اختر المادة لتعديل نقاطها:
            </span>
            <select
              value={selectedSubject.id}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/60 text-white text-xs font-bold focus:outline-none"
            >
              {stageSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}{' '}
                  {activeStage === 'primary'
                    ? '(/10)'
                    : `(المعامل ${s.coefficients[currentClassMeta.level] ?? 1})`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* الوضع الأول: الجدول الجامع للمعدلات المحسوبة تلقائياً */}
      {viewMode === 'master' ? (
        <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 bg-[#06150e] border-b border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                الكشف الجامع للمعدلات الفصلية المحسوبة آلياً — {stageMeta.name} · الفوج:{' '}
                {selectedClass} ({currentClassMeta?.level})
              </h3>
              <p className="text-[11px] text-slate-400">
                انقر على اسم أي مادة في رأس الجدول لتعديل نقاط التلاميذ فيها، أو على زر &quot;كشف النقاط A4&quot; لطباعة الكشف الرسمي لولي التلميذ.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-300 bg-[#0c2a1c] px-2.5 py-1 rounded border border-emerald-600/30 whitespace-nowrap">
              سلم التنقيط الرسمي: /{maxScale} (النجاح &ge; {passMark})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                  <th className="py-3 px-2.5 font-bold text-center">الرتبة</th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap">
                    اسم ولقب التلميذ(ة)
                  </th>
                  {stageSubjects.map((subj) => (
                    <th
                      key={subj.id}
                      onClick={() => {
                        setSelectedSubjectId(subj.id);
                        setViewMode('subject_entry');
                      }}
                      title="انقر لتعديل علامات هذه المادة"
                      className="py-2.5 px-2 font-bold text-center whitespace-nowrap cursor-pointer hover:bg-[#0d2818] transition-colors"
                    >
                      <div>{subj.shortName}</div>
                      <div className="text-[10px] text-emerald-300 font-normal tabular-nums">
                        {activeStage === 'primary'
                          ? 'سلم /10'
                          : `معامل ${subj.coefficients[currentClassMeta?.level || '4 متوسط'] ?? 1}`}
                      </div>
                    </th>
                  ))}
                  <th className="py-3 px-2.5 font-bold text-center whitespace-nowrap bg-[#0b2418]">
                    المجموع
                  </th>
                  <th className="py-3 px-3 font-black text-center whitespace-nowrap bg-[#103824] text-[#f5d77f]">
                    المعدل (/{maxScale})
                  </th>
                  <th className="py-3 px-2.5 font-bold text-center whitespace-nowrap">
                    الغياب / المواظبة
                  </th>
                  <th className="py-3 px-3 font-bold text-center whitespace-nowrap">
                    {activeStage === 'primary'
                      ? 'مستوى التحكم / القرار'
                      : 'الإجازة / قرار المجلس'}
                  </th>
                  <th className="py-3 px-3 font-bold text-center whitespace-nowrap">
                    كشف التلميذ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {summaries.map((item) => {
                  const isPassing = item.termAverage >= passMark;
                  return (
                    <tr
                      key={item.student.id}
                      className="hover:bg-[#0d261a]/80 transition-colors"
                    >
                      <td className="py-2.5 px-2.5 text-center font-mono font-black tabular-nums">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            item.rank === 1
                              ? 'bg-[#d4af37] text-[#071710]'
                              : item.rank <= 3
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.rank}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                        <div>{item.student.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-normal tabular-nums">
                          {activeStage === 'primary' && item.student.canteenBeneficiary
                            ? 'مطعم مدرسي · '
                            : item.student.isRepeater
                            ? 'معيد · '
                            : ''}
                          رقـم: {item.student.matricule}
                        </div>
                      </td>

                      {item.subjectResults.map((res) => {
                        const highMark = maxScale === 10 ? 8 : 15;
                        return (
                          <td
                            key={res.subjectId}
                            className={`py-2.5 px-2 text-center font-mono tabular-nums ${
                              res.exempt
                                ? 'text-slate-500 text-[11px]'
                                : res.subjectAvg >= highMark
                                ? 'text-emerald-300 font-bold'
                                : res.subjectAvg < passMark
                                ? 'text-rose-400 font-bold'
                                : 'text-slate-200'
                            }`}
                          >
                            {res.exempt ? 'معفى' : res.subjectAvg.toFixed(2)}
                          </td>
                        );
                      })}

                      <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-200 bg-[#0b2418]/60 tabular-nums">
                        {item.totalWeightedScore.toFixed(2)}
                      </td>

                      <td
                        className={`py-2.5 px-3 text-center font-mono text-sm font-black bg-[#103824]/70 tabular-nums ${
                          isPassing ? 'text-[#f5d77f]' : 'text-rose-400'
                        }`}
                      >
                        {item.termAverage.toFixed(2)}
                      </td>

                      <td className="py-2.5 px-2.5 text-center whitespace-nowrap tabular-nums">
                        <div
                          className={`text-[11px] font-bold ${
                            item.unjustifiedAbsencesCount > 0
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {item.unjustifiedAbsencesCount > 0
                            ? `${item.unjustifiedAbsencesCount} غياب غير مبرر`
                            : 'مواظب (0 غياب)'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          مواظبة: {item.attendanceScore.toFixed(1)}/{maxScale}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold ${
                            item.termAverage >= (maxScale === 10 ? 7.5 : 14)
                              ? 'text-[#f5d77f]'
                              : isPassing
                              ? 'text-emerald-300'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.honorRoll}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedStudentForBulletin(item)}
                          className="px-2.5 py-1 rounded-lg bg-[#105e32] hover:bg-[#157a41] text-[#f5d77f] border border-[#d4af37]/40 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>كشف النقاط A4</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* الوضع الثاني: حجز وتعديل النقاط التفصيلية للمادة المختارة */
        <div className="rounded-2xl bg-[#081a12] border-2 border-[#d4af37]/50 overflow-hidden shadow-2xl">
          <div className="px-5 py-4 bg-[#06150e] border-b border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-[#d4af37] font-bold">
                ورقة الحجز والتنقيط التفاعلية ({stageMeta.name} — سلم /{maxScale}){' '}
                {stageMeta.hasCoefficients &&
                  currentClassMeta &&
                  `— المعامل الرسمي: ${selectedSubject.coefficients[currentClassMeta.level] ?? 1}`}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                مادة: {selectedSubject.name} — الفوج التربوي {selectedClass}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-[#0d2818] text-emerald-300 border border-emerald-600/30 font-semibold">
                عدّل أي علامة (0 - {maxScale}) ليتم حساب معدل المادة والمعدل العام فوراً
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-right border-collapse">
              <thead>
                <tr className="bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                  <th className="py-3 px-3 font-bold text-center">الرتبة العامة</th>
                  <th className="py-3 px-4 font-bold">اسم ولقب التلميذ(ة)</th>
                  <th className="py-3 px-3 font-bold text-center">
                    التقويم المستمر (/{maxScale})
                  </th>
                  {stageMeta.hasSupervisedTest && (
                    <>
                      <th className="py-3 px-3 font-bold text-center">
                        الفرض المحروس (/{maxScale})
                      </th>
                      <th className="py-3 px-3 font-bold text-center bg-[#0a2116]">
                        معدل المراقبة (/{maxScale})
                      </th>
                    </>
                  )}
                  <th className="py-3 px-3 font-bold text-center">
                    الاختبار الفصلي (/{maxScale})
                  </th>
                  <th className="py-3 px-3 font-black text-center bg-[#103824] text-[#f5d77f]">
                    معدل المادة (/{maxScale})
                  </th>
                  {stageMeta.hasCoefficients ? (
                    <th className="py-3 px-3 font-bold text-center">
                      المجموع المعامل (×
                      {selectedSubject.coefficients[currentClassMeta?.level || '4 متوسط'] ?? 1})
                    </th>
                  ) : (
                    <th className="py-3 px-3 font-bold text-center">
                      مستوى التحكم (الكفاءة)
                    </th>
                  )}
                  <th className="py-3 px-3 font-bold text-center">إعفاء طبي</th>
                  <th className="py-3 px-4 font-bold">التقدير البيداغوجي التلقائي</th>
                  <th className="py-3 px-3 font-black text-center bg-[#0c2a1c]">
                    المعدل الفصلي العام
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {summaries.map((item) => {
                  const defaultMark = maxScale === 10 ? 6 : 10;
                  const rawGrade = item.student.grades[selectedSubject.id] || {
                    eval: defaultMark,
                    test: defaultMark,
                    exam: defaultMark,
                    exempt: false,
                  };
                  const calcSubj =
                    item.subjectResults.find(
                      (r) => r.subjectId === selectedSubject.id
                    ) || item.subjectResults[0];

                  return (
                    <tr
                      key={item.student.id}
                      className="hover:bg-[#0d261a]/70 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#d4af37] tabular-nums">
                        #{item.rank}
                      </td>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        {item.student.fullName}
                      </td>

                      {/* التقويم المستمر */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min={0}
                          max={maxScale}
                          disabled={Boolean(rawGrade.exempt)}
                          value={rawGrade.eval}
                          onChange={(e) =>
                            handleUpdateStudentMark(
                              item.student.id,
                              selectedSubject.id,
                              'eval',
                              Number(e.target.value)
                            )
                          }
                          className="w-20 px-2 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 focus:border-[#d4af37] text-center font-mono font-bold text-white tabular-nums disabled:opacity-40"
                        />
                      </td>

                      {/* الفرض المحروس ومعدل المراقبة (للمتوسط والثانوي) */}
                      {stageMeta.hasSupervisedTest && (
                        <>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              step="0.25"
                              min={0}
                              max={maxScale}
                              disabled={Boolean(rawGrade.exempt)}
                              value={rawGrade.test}
                              onChange={(e) =>
                                handleUpdateStudentMark(
                                  item.student.id,
                                  selectedSubject.id,
                                  'test',
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 focus:border-[#d4af37] text-center font-mono font-bold text-white tabular-nums disabled:opacity-40"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-300 bg-[#0a2116]/60 tabular-nums">
                            {calcSubj.exempt ? '—' : calcSubj.continuousAvg.toFixed(2)}
                          </td>
                        </>
                      )}

                      {/* الاختبار الفصلي */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min={0}
                          max={maxScale}
                          disabled={Boolean(rawGrade.exempt)}
                          value={rawGrade.exam}
                          onChange={(e) =>
                            handleUpdateStudentMark(
                              item.student.id,
                              selectedSubject.id,
                              'exam',
                              Number(e.target.value)
                            )
                          }
                          className="w-20 px-2 py-1.5 rounded-lg bg-[#05140d] border border-emerald-500/50 focus:border-[#d4af37] text-center font-mono font-bold text-[#f5d77f] tabular-nums disabled:opacity-40"
                        />
                      </td>

                      {/* معدل المادة التلقائي */}
                      <td
                        className={`py-2.5 px-3 text-center font-mono text-sm font-black bg-[#103824]/70 tabular-nums ${
                          calcSubj.exempt
                            ? 'text-slate-400'
                            : calcSubj.subjectAvg >= passMark
                            ? 'text-[#f5d77f]'
                            : 'text-rose-400'
                        }`}
                      >
                        {calcSubj.exempt ? 'معفى' : calcSubj.subjectAvg.toFixed(2)}
                      </td>

                      {/* المجموع المعامل أو مستوى التحكم في الابتدائي */}
                      {stageMeta.hasCoefficients ? (
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-200 tabular-nums">
                          {calcSubj.exempt ? '0.00' : calcSubj.weightedScore.toFixed(2)}
                        </td>
                      ) : (
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-300">
                          {calcSubj.competencyBadge || '—'}
                        </td>
                      )}

                      {/* إعفاء طبي */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(rawGrade.exempt)}
                          onChange={(e) =>
                            handleUpdateStudentMark(
                              item.student.id,
                              selectedSubject.id,
                              'exempt',
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 accent-[#d4af37] cursor-pointer"
                        />
                      </td>

                      {/* التقدير التلقائي */}
                      <td className="py-2.5 px-4 text-xs text-slate-300">
                        {calcSubj.appreciation}
                      </td>

                      {/* المعدل الفصلي العام للتلميذ */}
                      <td className="py-2.5 px-3 text-center font-mono font-black text-emerald-300 bg-[#0c2a1c]/60 tabular-nums">
                        {item.termAverage.toFixed(2)} / {maxScale}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة إضافة تلميذ جديد */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#091e14] border border-[#d4af37]/50 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#06150e] border-b border-[#d4af37]/30">
              <h3 className="text-base font-black text-white">
                إدراج تلميذ جديد في الفوج ({selectedClass} — {stageMeta.name})
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  اسم ولقب التلميذ(ة) الكامل
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="مثال: عبد الله بوقرة"
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  value={newStudentBirth}
                  onChange={(e) => setNewStudentBirth(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  اسم ولي الأمر
                </label>
                <input
                  type="text"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  placeholder="مثال: محمد بوقرة"
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  هاتف ولي الأمر
                </label>
                <input
                  type="text"
                  value={newParentPhone}
                  onChange={(e) => setNewParentPhone(e.target.value)}
                  placeholder="0550 12 34 56"
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white tabular-nums"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black cursor-pointer"
                >
                  إدراج التلميذ وحساب المعدل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة معاينة وطباعة كشف النقاط الفردي الرسمي للتلميذ (A4) */}
      {selectedStudentForBulletin && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8 rounded-2xl bg-[#091e14] border border-[#d4af37] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#06150e] border-b border-[#d4af37]/40 no-print">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-base font-black text-white">
                  كشف النقاط الفصلي الرسمي ({stageMeta.name} — A4) — التلميذ(ة):{' '}
                  {selectedStudentForBulletin.student.fullName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الكشف A4</span>
                </button>
                <button
                  onClick={() => setSelectedStudentForBulletin(null)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-bold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* ورقة A4 الرسمية */}
            <div className="p-8 bg-white text-black font-['Amiri',serif] print-only-sheet space-y-5">
              <div className="text-center border-b-2 border-black pb-4 space-y-1">
                <div className="text-base font-bold">
                  الجمهورية الجزائرية الديمقراطية الشعبية
                </div>
                <div className="text-sm font-bold">وزارة التربية الوطنية</div>
                <div className="flex items-center justify-between pt-2 text-xs font-['Cairo',sans-serif]">
                  <div className="text-right space-y-0.5">
                    <div>
                      <strong>المديرية:</strong> {institution.wilaya}
                    </div>
                    <div>
                      <strong>{stageMeta.institutionLabel}:</strong> {institution.schoolName}
                    </div>
                  </div>
                  <img
                    src={logoSrc}
                    alt="شعار المؤسسة"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain rounded-full border border-black p-0.5"
                  />
                  <div className="text-left space-y-0.5">
                    <div>
                      <strong>السنة الدراسية:</strong> {institution.schoolYear}
                    </div>
                    <div>
                      <strong>الفصل الدراسي:</strong> الفصل {institution.currentTerm}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center py-2 bg-slate-100 border border-black rounded">
                <h2 className="text-lg font-bold font-['Cairo',sans-serif]">
                  {activeStage === 'primary'
                    ? 'كشف نقاط التقويم الفصلي وتقييم المكتسبات لمرحلة التعليم الابتدائي (السلم /10)'
                    : activeStage === 'middle'
                    ? 'كشف نقاط التقويم المستمر والاختبارات الفصلية لمرحلة التعليم المتوسط (السلم /20)'
                    : 'كشف النقاط الفصلي الرسمي لمرحلة التعليم الثانوي العام والتكنولوجي (السلم /20)'}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-['Cairo',sans-serif] border border-black p-3 rounded">
                <div>
                  <strong>اسم ولقب التلميذ(ة):</strong>{' '}
                  {selectedStudentForBulletin.student.fullName}
                </div>
                <div>
                  <strong>تاريخ الميلاد:</strong>{' '}
                  {selectedStudentForBulletin.student.birthDate}
                </div>
                <div>
                  <strong>القسم والمستوى:</strong>{' '}
                  {selectedStudentForBulletin.student.classGroup} (
                  {selectedStudentForBulletin.student.level})
                </div>
                <div>
                  <strong>الرتبة في الفوج:</strong> {selectedStudentForBulletin.rank} من أصل{' '}
                  {summaries.length}
                </div>
              </div>

              <table className="w-full text-xs font-['Cairo',sans-serif] border-collapse border border-black text-center">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="border border-black py-2 px-2 text-right">
                      المادة التعليمية
                    </th>
                    <th className="border border-black py-2 px-2">
                      التقويم (/{maxScale})
                    </th>
                    {stageMeta.hasSupervisedTest && (
                      <>
                        <th className="border border-black py-2 px-2">
                          الفرض (/{maxScale})
                        </th>
                        <th className="border border-black py-2 px-2">م. المراقبة</th>
                      </>
                    )}
                    <th className="border border-black py-2 px-2">
                      الاختبار (/{maxScale})
                    </th>
                    <th className="border border-black py-2 px-2 font-bold">
                      معدل المادة (/{maxScale})
                    </th>
                    {stageMeta.hasCoefficients ? (
                      <>
                        <th className="border border-black py-2 px-2">المعامل</th>
                        <th className="border border-black py-2 px-2 font-bold">
                          المجموع المعامل
                        </th>
                      </>
                    ) : (
                      <th className="border border-black py-2 px-2 font-bold">
                        مستوى التحكم
                      </th>
                    )}
                    <th className="border border-black py-2 px-2 text-right">
                      ملاحظات وتقدير الأستاذ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudentForBulletin.subjectResults.map((res) => (
                    <tr key={res.subjectId}>
                      <td className="border border-black py-1.5 px-2 text-right font-bold">
                        {res.subjectName}
                      </td>
                      <td className="border border-black py-1.5 px-2 tabular-nums">
                        {res.exempt ? '—' : res.eval.toFixed(2)}
                      </td>
                      {stageMeta.hasSupervisedTest && (
                        <>
                          <td className="border border-black py-1.5 px-2 tabular-nums">
                            {res.exempt ? '—' : res.test.toFixed(2)}
                          </td>
                          <td className="border border-black py-1.5 px-2 tabular-nums">
                            {res.exempt ? '—' : res.continuousAvg.toFixed(2)}
                          </td>
                        </>
                      )}
                      <td className="border border-black py-1.5 px-2 tabular-nums">
                        {res.exempt ? '—' : res.exam.toFixed(2)}
                      </td>
                      <td className="border border-black py-1.5 px-2 font-bold tabular-nums">
                        {res.exempt ? 'معفى' : res.subjectAvg.toFixed(2)}
                      </td>
                      {stageMeta.hasCoefficients ? (
                        <>
                          <td className="border border-black py-1.5 px-2 tabular-nums">
                            {res.exempt ? '—' : res.coefficient}
                          </td>
                          <td className="border border-black py-1.5 px-2 font-bold tabular-nums">
                            {res.exempt ? '—' : res.weightedScore.toFixed(2)}
                          </td>
                        </>
                      ) : (
                        <td className="border border-black py-1.5 px-2 font-bold">
                          {res.competencyBadge || '—'}
                        </td>
                      )}
                      <td className="border border-black py-1.5 px-2 text-right">
                        {res.appreciation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-['Cairo',sans-serif] border-2 border-black p-3 bg-slate-100 font-bold text-center">
                <div>
                  المجموع العام:{' '}
                  {selectedStudentForBulletin.totalWeightedScore.toFixed(2)} (مجموع المعاملات:{' '}
                  {selectedStudentForBulletin.totalCoefficients})
                </div>
                <div className="text-sm font-black">
                  المعدل الفصلي العام:{' '}
                  {selectedStudentForBulletin.termAverage.toFixed(2)} / {maxScale}
                </div>
                <div>
                  التقدير: {selectedStudentForBulletin.honorRoll}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-['Cairo',sans-serif] border border-black p-3 rounded">
                <div>
                  <div>
                    <strong>قرار وتقدير المجلس البيداغوجي:</strong>{' '}
                    {selectedStudentForBulletin.councilDecision}
                  </div>
                  <div className="mt-1">
                    <strong>حصيلة المواظبة والانضباط:</strong> غيابات غير مبررة (
                    {selectedStudentForBulletin.unjustifiedAbsencesCount}) · غيابات مبررة (
                    {selectedStudentForBulletin.justifiedAbsencesCount}) · نقطة المواظبة (
                    {selectedStudentForBulletin.attendanceScore.toFixed(2)}/{maxScale})
                  </div>
                </div>
                <div className="text-left space-y-6">
                  <div>
                    <strong>توقيع {stageMeta.natherTitle}</strong> (
                    {institution.directorOfStudies}) وختم {stageMeta.principalTitle}:
                  </div>
                  <div className="text-slate-500">[الختم والتوقيع الرسمي]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة معاينة وطباعة محضر مجلس القسم / الأساتذة الشامل (A4) */}
      {showCouncilReportPrint && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8 rounded-2xl bg-[#091e14] border border-[#d4af37] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#06150e] border-b border-[#d4af37]/40 no-print">
              <h3 className="text-base font-black text-white">
                محضر المداولات والحصيلة الإحصائية الشاملة ({stageMeta.name} — A4) —{' '}
                {selectedClass}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة المحضر A4</span>
                </button>
                <button
                  onClick={() => setShowCouncilReportPrint(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="p-8 bg-white text-black font-['Cairo',sans-serif] print-only-sheet space-y-5 text-xs">
              <div className="text-center border-b-2 border-black pb-4 space-y-1">
                <div className="text-base font-bold">
                  الجمهورية الجزائرية الديمقراطية الشعبية
                </div>
                <div className="text-sm font-bold">وزارة التربية الوطنية</div>
                <div className="text-xs">
                  {institution.wilaya} · {institution.schoolName} · السنة الدراسية:{' '}
                  {institution.schoolYear}
                </div>
                <div className="text-base font-black mt-2">
                  {activeStage === 'primary'
                    ? `محضر مجلس الأساتذة وتقييم المكتسبات — الفصل الدراسي ${institution.currentTerm} (${selectedClass})`
                    : `محضر مداولات مجلس القسم والحصيلة الإحصائية — الفصل الدراسي ${institution.currentTerm} (${selectedClass})`}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 border border-black p-3 text-center font-bold bg-slate-100">
                <div>تعداد الفوج: {stats.count} تلميذ</div>
                <div>
                  المعدل العام للقسم: {stats.classAvg} / {maxScale}
                </div>
                <div>نسبة النجاح والتحكم: {stats.passRate}%</div>
                <div>
                  أعلى معدل: {stats.maxAvg} | أدنى معدل: {stats.minAvg}
                </div>
              </div>

              <table className="w-full border-collapse border border-black text-center">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="border border-black py-1.5 px-2">الرتبة</th>
                    <th className="border border-black py-1.5 px-2 text-right">
                      اسم ولقب التلميذ(ة)
                    </th>
                    <th className="border border-black py-1.5 px-2">المجموع العام</th>
                    <th className="border border-black py-1.5 px-2">
                      المعدل الفصلي (/{maxScale})
                    </th>
                    <th className="border border-black py-1.5 px-2">
                      الغيابات غير المبررة
                    </th>
                    <th className="border border-black py-1.5 px-2">
                      الإجازة / مستوى التحكم
                    </th>
                    <th className="border border-black py-1.5 px-2 text-right">
                      ملاحظات وقرار المجلس
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((item) => (
                    <tr key={item.student.id}>
                      <td className="border border-black py-1.5 px-2 font-bold tabular-nums">
                        {item.rank}
                      </td>
                      <td className="border border-black py-1.5 px-2 text-right font-bold">
                        {item.student.fullName}
                      </td>
                      <td className="border border-black py-1.5 px-2 tabular-nums">
                        {item.totalWeightedScore.toFixed(2)}
                      </td>
                      <td className="border border-black py-1.5 px-2 font-black tabular-nums">
                        {item.termAverage.toFixed(2)}
                      </td>
                      <td className="border border-black py-1.5 px-2 tabular-nums">
                        {item.unjustifiedAbsencesCount}
                      </td>
                      <td className="border border-black py-1.5 px-2 font-bold">
                        {item.honorRoll}
                      </td>
                      <td className="border border-black py-1.5 px-2 text-right">
                        {item.councilDecision}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-3 gap-4 pt-6 text-center font-bold">
                <div>
                  <div>
                    {activeStage === 'primary'
                      ? 'أستاذ(ة) الفوج التربوي'
                      : 'الأستاذ الرئيسي للقسم'}
                  </div>
                  <div className="mt-8 text-slate-500">[التوقيع]</div>
                </div>
                <div>
                  <div>
                    {stageMeta.natherTitle} ({institution.directorOfStudies})
                  </div>
                  <div className="mt-8 text-slate-500">[التأشيرة والختم]</div>
                </div>
                <div>
                  <div>{stageMeta.principalTitle} (رئيس المجلس)</div>
                  <div className="mt-8 text-slate-500">[الختم والتوقيع الرسمي]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
