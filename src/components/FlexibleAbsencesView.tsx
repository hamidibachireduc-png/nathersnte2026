import React, { useState, useMemo, useEffect } from 'react';
import {
  UserX,
  UserCheck,
  Clock,
  CheckCircle2,
  Printer,
  Plus,
  Search,
  FileText,
  Phone,
  ShieldAlert,
  ClipboardCheck,
  X,
  Trash2,
  Layers,
  Utensils,
} from 'lucide-react';
import {
  EducationStage,
  InstitutionInfo,
  AbsenceRecord,
  AbsenceStatus,
  StudentRecord,
  TeacherRecord,
  RollCallState,
  SubjectConfig,
} from '../types';
import {
  CLASS_GROUPS,
  STAGE_METADATA,
  calculateClassSummaries,
  DEFAULT_EMBLEM_URL,
} from '../data/initialData';

interface FlexibleAbsencesViewProps {
  activeStage: EducationStage;
  onSelectStage: (stage: EducationStage) => void;
  institution: InstitutionInfo;
  absences: AbsenceRecord[];
  onUpdateAbsences: (absences: AbsenceRecord[]) => void;
  students: StudentRecord[];
  onUpdateStudents: (students: StudentRecord[]) => void;
  subjects: SubjectConfig[];
  teachers: TeacherRecord[];
  onOpenDocumentGenerator: (docId: string) => void;
}

export const FlexibleAbsencesView: React.FC<FlexibleAbsencesViewProps> = ({
  activeStage,
  onSelectStage,
  institution,
  absences,
  onUpdateAbsences,
  students,
  onUpdateStudents,
  subjects,
  teachers,
  onOpenDocumentGenerator,
}) => {
  const stageMeta = STAGE_METADATA[activeStage];
  const stageClasses = useMemo(
    () => CLASS_GROUPS.filter((c) => c.stage === activeStage),
    [activeStage]
  );
  const stageStudents = useMemo(
    () => students.filter((s) => s.stage === activeStage),
    [students, activeStage]
  );
  const stageTeachers = useMemo(
    () => teachers.filter((t) => t.stage === activeStage),
    [teachers, activeStage]
  );
  const stageAbsences = useMemo(
    () => absences.filter((a) => a.stage === activeStage),
    [absences, activeStage]
  );

  const [activeTab, setActiveTab] = useState<
    'roll_call' | 'student_matrix' | 'full_log'
  >('roll_call');

  // حالة نداء الحصص السريع المرن
  const [rollCallClass, setRollCallClass] = useState<string>(
    stageClasses[0]?.name || '4 م 1'
  );
  const [rollCallDate, setRollCallDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [rollCallPeriod, setRollCallPeriod] = useState<string>(
    'الفترة الصباحية (08:00 - 12:00)'
  );
  const [rollCallDuration, setRollCallDuration] = useState<number>(4);
  const [rollCallMap, setRollCallMap] = useState<Record<string, RollCallState>>(
    {}
  );
  const [rollCallNotes, setRollCallNotes] = useState<Record<string, string>>({});

  // حالة فلترة السجل العام
  const [filterType, setFilterType] = useState<'all' | 'student' | 'teacher'>(
    'all'
  );
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // نافذة تسجيل غياب فردي جديد
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newType, setNewType] = useState<'student' | 'teacher'>('student');
  const [newTargetId, setNewTargetId] = useState<string>(
    stageStudents[0]?.id || ''
  );
  const [newDate, setNewDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newPeriod, setNewPeriod] = useState<string>(
    'الفترة الصباحية (08:00 - 12:00)'
  );
  const [newHours, setNewHours] = useState<number>(3);
  const [newStatus, setNewStatus] = useState<AbsenceStatus>('unjustified');
  const [newReason, setNewReason] = useState<string>('غياب بدون إشعار مسبق');

  useEffect(() => {
    const firstClass = CLASS_GROUPS.find((c) => c.stage === activeStage);
    if (firstClass) {
      setRollCallClass(firstClass.name);
    }
    setFilterClass('all');
    setRollCallMap({});
    const firstSt = students.find((s) => s.stage === activeStage);
    if (firstSt) setNewTargetId(firstSt.id);
  }, [activeStage, students]);

  // نافذة طباعة استدعاء ولي أمر تلميذ مخصص A4
  const [summonPrintData, setSummonPrintData] = useState<{
    studentName: string;
    classGroup: string;
    parentName: string;
    parentPhone: string;
    unjustifiedCount: number;
    totalHours: number;
    attendanceScore: number;
    recentDates: string;
  } | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // تلاميذ الفوج المختار في النداء السريع
  const classStudentsForRollCall = useMemo(
    () => stageStudents.filter((s) => s.classGroup === rollCallClass),
    [stageStudents, rollCallClass]
  );

  const getStudentRollState = (studentId: string): RollCallState => {
    return rollCallMap[studentId] || 'present';
  };

  const handleSetRollState = (studentId: string, state: RollCallState) => {
    setRollCallMap((prev) => ({ ...prev, [studentId]: state }));
  };

  // تبديل استفادة التلميذ من المطعم المدرسي (خاص بالابتدائي)
  const handleToggleCanteen = (studentId: string) => {
    onUpdateStudents(
      students.map((s) =>
        s.id === studentId
          ? { ...s, canteenBeneficiary: !s.canteenBeneficiary }
          : s
      )
    );
  };

  // حفظ نداء الحصة دفعة واحدة في سجل الغيابات
  const handleSaveRollCallBatch = () => {
    const newRecords: AbsenceRecord[] = [];
    classStudentsForRollCall.forEach((st) => {
      const state = getStudentRollState(st.id);
      if (state === 'present' || state === 'exempt') return;

      const statusMap: Record<string, AbsenceStatus> = {
        absent_unjustified: 'unjustified',
        absent_justified: 'justified',
        late: 'late',
      };

      const mappedStatus = statusMap[state] || 'unjustified';
      const note =
        rollCallNotes[st.id]?.trim() ||
        (mappedStatus === 'justified'
          ? 'غياب مبرر بإشعار من الولي / شهادة طبية'
          : mappedStatus === 'late'
          ? 'تأخر عن موعد انطلاق الفترة الدراسية'
          : activeStage === 'primary'
          ? 'غياب مسجل في نداء الفترة — تم إشعار المطعم المدرسي والولي'
          : 'غياب مسجل في نداء الحصة بدون مبرر');

      newRecords.push({
        id: `abs-${Date.now()}-${st.id}`,
        stage: activeStage,
        type: 'student',
        targetId: st.id,
        personName: st.fullName,
        roleOrClass: st.classGroup,
        level: st.level,
        date: rollCallDate,
        period: rollCallPeriod,
        durationHours: mappedStatus === 'late' ? 1 : rollCallDuration,
        reason: note,
        status: mappedStatus,
        parentNotified: mappedStatus === 'justified',
        parentPhone: st.parentPhone,
        canteenAffected: activeStage === 'primary' && Boolean(st.canteenBeneficiary),
        actionTaken:
          mappedStatus === 'justified'
            ? 'تم قبول التبرير وتحيين بطاقة المواظبة.'
            : activeStage === 'primary'
            ? 'الاتصال الفوري بولي التلميذ وتحيين تعداد وجبات المطعم المدرسي.'
            : 'تم رصد الغياب آلياً وإدراجه في الرصيد التراكمي للتلميذ.',
      });
    });

    if (newRecords.length === 0) {
      triggerToast(
        `جميع تلاميذ الفوج ${rollCallClass} حاضرون — لم يتم تسجيل أي غياب.`
      );
      return;
    }

    onUpdateAbsences([...newRecords, ...absences]);
    setRollCallMap({});
    setRollCallNotes({});
    triggerToast(
      `تم حفظ واعتماد ${newRecords.length} حالات غياب/تأخر للفوج ${rollCallClass} (${stageMeta.name}) بنجاح!`
    );
  };

  // مصفوفة المتابعة التراكمية لتلاميذ الطور النشط
  const allStudentSummaries = useMemo(
    () =>
      calculateClassSummaries(
        stageStudents,
        subjects,
        stageAbsences,
        activeStage === 'primary' ? 'primary_exam_plus_eval' : 'ministry_standard',
        false,
        activeStage
      ),
    [stageStudents, subjects, stageAbsences, activeStage]
  );

  const filteredStudentMatrix = useMemo(() => {
    return allStudentSummaries.filter((item) => {
      if (filterClass !== 'all' && item.student.classGroup !== filterClass)
        return false;
      if (
        searchQuery.trim() &&
        !item.student.fullName.includes(searchQuery.trim()) &&
        !item.student.classGroup.includes(searchQuery.trim())
      ) {
        return false;
      }
      return true;
    });
  }, [allStudentSummaries, filterClass, searchQuery]);

  // السجل العام المفلتر
  const filteredAbsences = useMemo(() => {
    return stageAbsences.filter((a) => {
      if (filterType !== 'all' && a.type !== filterType) return false;
      if (filterClass !== 'all' && a.roleOrClass !== filterClass) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (
        searchQuery.trim() &&
        !a.personName.includes(searchQuery.trim()) &&
        !a.roleOrClass.includes(searchQuery.trim()) &&
        !a.reason.includes(searchQuery.trim())
      ) {
        return false;
      }
      return true;
    });
  }, [stageAbsences, filterType, filterClass, filterStatus, searchQuery]);

  // تغيير الحالة القانونية لغياب بمرونة بضغطة واحدة
  const handleQuickStatusChange = (
    id: string,
    nextStatus: AbsenceStatus,
    actionText: string
  ) => {
    const updated = absences.map((a) =>
      a.id === id
        ? {
            ...a,
            status: nextStatus,
            parentNotified:
              nextStatus === 'parent_summoned' ||
              nextStatus === 'pledge_signed' ||
              nextStatus === 'justified'
                ? true
                : a.parentNotified,
            actionTaken: actionText,
          }
        : a
    );
    onUpdateAbsences(updated);
    triggerToast('تم تحديث الوضعية القانونية للغياب وتحيين ملف المواظبة فوراً');
  };

  const handleDeleteAbsence = (id: string) => {
    onUpdateAbsences(absences.filter((a) => a.id !== id));
    triggerToast('تم حذف سجل الغياب وتحديث رصيد المواظبة');
  };

  // إضافة غياب فردي جديد
  const handleAddSingleAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    if (newType === 'student') {
      const st =
        stageStudents.find((s) => s.id === newTargetId) || stageStudents[0];
      if (!st) return;
      const rec: AbsenceRecord = {
        id: `abs-${Date.now()}`,
        stage: activeStage,
        type: 'student',
        targetId: st.id,
        personName: st.fullName,
        roleOrClass: st.classGroup,
        level: st.level,
        date: newDate,
        period: newPeriod,
        durationHours: Number(newHours) || 2,
        reason: newReason,
        status: newStatus,
        parentNotified:
          newStatus === 'justified' || newStatus === 'parent_summoned',
        parentPhone: st.parentPhone,
        canteenAffected: activeStage === 'primary' && Boolean(st.canteenBeneficiary),
        actionTaken:
          newStatus === 'justified'
            ? 'غياب مبرر بشهادة طبية أو حضور الولي.'
            : activeStage === 'primary'
            ? 'إشعار الولي وتحيين قائمة المطعم المدرسي.'
            : 'تم تسجيل الغياب وإشعار مستشار التربية لمتابعة التلميذ.',
      };
      onUpdateAbsences([rec, ...absences]);
      triggerToast(`تم تسجيل غياب التلميذ "${st.fullName}" (${st.classGroup})`);
    } else {
      const tr =
        stageTeachers.find((t) => t.id === newTargetId) || stageTeachers[0];
      if (!tr) return;
      const rec: AbsenceRecord = {
        id: `abs-${Date.now()}`,
        stage: activeStage,
        type: 'teacher',
        targetId: tr.id,
        personName: tr.name,
        roleOrClass: `أستاذ ${tr.subject}`,
        date: newDate,
        period: newPeriod,
        durationHours: Number(newHours) || 2,
        reason: newReason,
        status: newStatus,
        parentNotified: false,
        actionTaken:
          newStatus === 'justified'
            ? 'تم إيداع التبرير القانوني وبرمجة حصة استدراك.'
            : 'توجيه استفسار كتابي طبقاً للمادة 207 من الأمر 06-03.',
      };
      onUpdateAbsences([rec, ...absences]);
      triggerToast(`تم تسجيل غياب الأستاذ "${tr.name}"`);
    }
    setShowAddModal(false);
  };

  // إحصائيات الغيابات
  const studentAbsences = stageAbsences.filter((a) => a.type === 'student');
  const unjustifiedStudentAbsences = studentAbsences.filter(
    (a) =>
      a.status === 'unjustified' ||
      a.status === 'parent_summoned' ||
      a.status === 'council_referred'
  );
  const teacherAbsences = stageAbsences.filter((a) => a.type === 'teacher');
  const totalStudentMissedHours = studentAbsences.reduce(
    (acc, a) => acc + (a.durationHours || 0),
    0
  );

  // إحصائية خاصة بالابتدائي: الحاضرون في المطعم المدرسي
  const registeredCanteenStudents = classStudentsForRollCall.filter(
    (s) => s.canteenBeneficiary
  ).length;
  const presentCanteenStudents = classStudentsForRollCall.filter(
    (s) =>
      s.canteenBeneficiary &&
      (getStudentRollState(s.id) === 'present' ||
        getStudentRollState(s.id) === 'late')
  ).length;

  const maxScale = stageMeta.maxGradeScale;
  const logoSrc = institution.logoUrl || DEFAULT_EMBLEM_URL;

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#105e32] text-white border-2 border-[#d4af37] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#f5d77f] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ترويسة القسم */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white font-bold border border-[#f5d77f]/30">
                متابعة غيابات التلاميذ والأساتذة بمرونة — {stageMeta.name}
              </span>
              <span className="text-[#d4af37] font-semibold">
                {activeStage === 'primary'
                  ? 'مراقبة الفترات · المطعم المدرسي · وحدة الكشف الصحي UDS'
                  : activeStage === 'middle'
                  ? 'مراقبة الحصص · التنسيق مع مستشار التربية · التدرج القانوني'
                  : 'مراقبة الحصص والأعمال المخبرية TP · مواظبة مترشحي البكالوريا'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <UserX className="w-6 h-6 text-[#d4af37]" />
              <span>
                المنظومة المرنة لرصد غيابات التلاميذ واستدعاء الأولياء ({stageMeta.name})
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {activeStage === 'primary' ? (
                <>
                  في <span className="text-[#f5d77f] font-bold">الطور الابتدائي</span>، يركز النظام على{' '}
                  <span className="text-emerald-300 font-bold">
                    مراقبة الحضور بالفترات (صباحاً/مساءً)، الضبط الآلي لتعداد الوجبات الساخنة بالمطعم المدرسي، والمتابعة الصحية UDS
                  </span>{' '}
                  مع إشعار فوري حِمائي لولي الأمر.
                </>
              ) : activeStage === 'middle' ? (
                <>
                  في <span className="text-[#f5d77f] font-bold">الطور المتوسط</span>، يربط النظام نداء الحصص برصيد الساعات ونقطة المواظبة (
                  <span className="text-emerald-300 font-bold">/20</span>) والتدرج القانوني في إشعارات الغياب والتعهد الكتابي للولي.
                </>
              ) : (
                <>
                  في <span className="text-[#f5d77f] font-bold">الطور الثانوي</span>، يتابع النظام حضور التلاميذ في الحصص النظرية و<span className="text-emerald-300 font-bold">الأعمال المخبرية والتطبيقية (TP)</span> ومواظبة أقسام البكالوريا والإنذارات الثلاثة.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              value={activeStage}
              onChange={(e) => onSelectStage(e.target.value as EducationStage)}
              className="px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37] text-[#f5d77f] text-xs font-black cursor-pointer"
            >
              <option value="primary">الطور الابتدائي</option>
              <option value="middle">الطور المتوسط</option>
              <option value="secondary">الطور الثانوي</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل غياب فردي</span>
            </button>

            <button
              onClick={() =>
                onOpenDocumentGenerator(
                  activeStage === 'primary'
                    ? 'doc-primary-canteen-report'
                    : 'doc-student-absence-notice'
                )
              }
              className="px-3.5 py-2 rounded-xl bg-[#105e32] hover:bg-[#157a41] text-[#f5d77f] border border-[#d4af37]/50 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>
                {activeStage === 'primary'
                  ? 'تقرير المطعم والصحة A4'
                  : 'نموذج استدعاء ولي A4'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* مؤشرات المواظبة اللحظية للطور */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#081a12] border border-rose-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>غيابات التلاميذ غير المبررة</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1 tabular-nums">
            {unjustifiedStudentAbsences.length} حالات
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5">
            تستوجب تبرير الولي أو تحرير إشعار غياب
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#081a12] border border-amber-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>إجمالي الساعات الضائعة ({stageMeta.shortName})</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1 tabular-nums">
            {totalStudentMissedHours} ساعة
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5 tabular-nums">
            عبر {studentAbsences.length} سجل غياب وتأخر للتلاميذ
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#081a12] border border-emerald-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {activeStage === 'primary'
                ? 'وجبات المطعم المدرسي للفوج'
                : 'التلاميذ المواظبون بانتظام'}
            </span>
            {activeStage === 'primary' ? (
              <Utensils className="w-4 h-4 text-emerald-400" />
            ) : (
              <UserCheck className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">
            {activeStage === 'primary'
              ? `${presentCanteenStudents} / ${registeredCanteenStudents}`
              : `${allStudentSummaries.filter((s) => s.unjustifiedAbsencesCount === 0).length} / ${stageStudents.length}`}
          </div>
          <div className="text-[11px] text-emerald-300 mt-0.5">
            {activeStage === 'primary'
              ? 'حاضرون لتناول الوجبة الساخنة اليوم'
              : `نقطة مواظبة كاملة (${maxScale}/${maxScale})`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#081a12] border border-[#d4af37]/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>غيابات الأساتذة والاستخلاف</span>
            <ClipboardCheck className="w-4 h-4 text-[#f5d77f]" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            {teacherAbsences.length} حالات
          </div>
          <div className="text-[11px] text-[#e5c158] mt-0.5">
            مرتبطة باستفسارات المادة 207 والمداومة
          </div>
        </div>
      </div>

      {/* أزرار التبديل بين الأنماط الـ 3 المرنة */}
      <div className="flex flex-wrap items-center gap-2 bg-[#091e14] p-2.5 rounded-xl border border-[#d4af37]/30 no-print">
        <button
          onClick={() => setActiveTab('roll_call')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'roll_call'
              ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black shadow-md'
              : 'bg-[#06150e] text-slate-300 hover:text-white'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>
            1. نداء الحضور السريع المرن ({stageMeta.name})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('student_matrix')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'student_matrix'
              ? 'bg-gradient-to-r from-[#105e32] to-[#0b4223] text-[#f5d77f] border border-[#d4af37]/60 shadow-md'
              : 'bg-[#06150e] text-slate-300 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>
            2. البطاقة التراكمية لمواظبة التلاميذ (/{maxScale}) والإجراءات
          </span>
        </button>

        <button
          onClick={() => setActiveTab('full_log')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'full_log'
              ? 'bg-gradient-to-r from-[#105e32] to-[#0b4223] text-[#f5d77f] border border-[#d4af37]/60 shadow-md'
              : 'bg-[#06150e] text-slate-300 hover:text-white'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>
            3. السجل اليومي الشامل وتبرير الغيابات ({stageAbsences.length})
          </span>
        </button>
      </div>

      {/* النمط الأول: نداء الحصص السريع المرن */}
      {activeTab === 'roll_call' && (
        <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 shadow-2xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#06150e] p-4 rounded-xl border border-[#d4af37]/30">
            <div>
              <label className="block text-[11px] font-bold text-[#d4af37] mb-1">
                اختر الفوج التربوي ({stageMeta.name}):
              </label>
              <select
                value={rollCallClass}
                onChange={(e) => {
                  setRollCallClass(e.target.value);
                  setRollCallMap({});
                }}
                className="w-full px-3 py-2 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                {stageClasses.map((cg) => (
                  <option key={cg.name} value={cg.name}>
                    {cg.name} ({cg.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#d4af37] mb-1">
                تاريخ اليوم / الحصة:
              </label>
              <input
                type="date"
                value={rollCallDate}
                onChange={(e) => setRollCallDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#d4af37] mb-1">
                الفترة أو الحصة الدراسية:
              </label>
              <select
                value={rollCallPeriod}
                onChange={(e) => setRollCallPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                <option value="الفترة الصباحية (08:00 - 12:00)">
                  الفترة الصباحية (08:00 - 12:00)
                </option>
                <option value="الفترة المسائية (13:30 - 16:30)">
                  الفترة المسائية (13:30 - 16:30)
                </option>
                {activeStage !== 'primary' && (
                  <>
                    <option value="الحصة الأولى (08:00 - 09:00)">
                      الحصة الأولى (08:00 - 09:00)
                    </option>
                    <option value="الحصة الثانية (09:00 - 10:00)">
                      الحصة الثانية (09:00 - 10:00)
                    </option>
                    <option value="حصة الأعمال المخبرية TP (10:00 - 12:00)">
                      حصة الأعمال المخبرية TP (10:00 - 12:00)
                    </option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#d4af37] mb-1">
                عدد الساعات المحتسبة للغياب:
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={rollCallDuration}
                onChange={(e) => setRollCallDuration(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold tabular-nums"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              انقر بمرونة على حالة كل تلميذ (<span className="text-emerald-400 font-bold">حاضر</span>{' '}
              / <span className="text-rose-400 font-bold">غائب غير مبرر</span> /{' '}
              <span className="text-amber-300 font-bold">تأخر</span> /{' '}
              <span className="text-cyan-300 font-bold">غائب مبرر</span>) ثم اضغط زر الاعتماد لحفظ الغائبين دفعة واحدة.
            </div>
            <button
              onClick={handleSaveRollCallBatch}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-2 shadow-lg hover:brightness-110 cursor-pointer shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ واعتماد النداء في السجل العام</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                  <th className="py-3 px-3 font-bold">رقم التسجيل</th>
                  <th className="py-3 px-4 font-bold">اسم ولقب التلميذ(ة)</th>
                  <th className="py-3 px-3 font-bold">هاتف الولي</th>
                  {activeStage === 'primary' && (
                    <th className="py-3 px-3 font-bold text-center">
                      المطعم المدرسي
                    </th>
                  )}
                  <th className="py-3 px-4 font-bold text-center">
                    تحديد وضعية الحضور في الفترة / الحصة
                  </th>
                  <th className="py-3 px-4 font-bold">
                    ملاحظة أو سبب الغياب (اختياري)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {classStudentsForRollCall.map((st) => {
                  const state = getStudentRollState(st.id);
                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-[#0c261a]/60 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-slate-400 tabular-nums">
                        {st.matricule}
                      </td>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        {st.fullName}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 tabular-nums">
                        {st.parentPhone}
                      </td>
                      {activeStage === 'primary' && (
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleCanteen(st.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                              st.canteenBeneficiary
                                ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {st.canteenBeneficiary ? 'مستفيد من الوجبة ✓' : 'غير مسجل بالمطعم'}
                          </button>
                        </td>
                      )}
                      <td className="py-2.5 px-4">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSetRollState(st.id, 'present')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              state === 'present'
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white'
                            }`}
                          >
                            حاضر
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleSetRollState(st.id, 'absent_unjustified')
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              state === 'absent_unjustified'
                                ? 'bg-[#8f1414] text-white border border-rose-400 shadow'
                                : 'bg-slate-800/80 text-slate-400 hover:text-rose-300'
                            }`}
                          >
                            غائب غير مبرر
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetRollState(st.id, 'late')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              state === 'late'
                                ? 'bg-amber-600 text-white shadow'
                                : 'bg-slate-800/80 text-slate-400 hover:text-amber-300'
                            }`}
                          >
                            متأخر
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleSetRollState(st.id, 'absent_justified')
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              state === 'absent_justified'
                                ? 'bg-cyan-700 text-white shadow'
                                : 'bg-slate-800/80 text-slate-400 hover:text-cyan-300'
                            }`}
                          >
                            غائب مبرر
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={rollCallNotes[st.id] || ''}
                          onChange={(e) =>
                            setRollCallNotes((prev) => ({
                              ...prev,
                              [st.id]: e.target.value,
                            }))
                          }
                          placeholder="أضف مبرراً أو ملاحظة فورية..."
                          className="w-full px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-white text-xs"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* النمط الثاني: البطاقة التراكمية لمواظبة التلاميذ والتدرج القانوني */}
      {activeTab === 'student_matrix' && (
        <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 overflow-hidden shadow-2xl">
          <div className="p-4 bg-[#06150e] border-b border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white">
                المصفوفة التراكمية لمواظبة التلاميذ ({stageMeta.name} — سلم /{maxScale})
              </h3>
              <p className="text-xs text-slate-400">
                يحسب النظام آلياً رصيد الغيابات ونقطة المواظبة (/{maxScale}) ويحدد الإجراء المناسب لخصوصية الطور مع إمكانية طباعة استدعاء الولي مباشرة
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                <option value="all">جميع أفواج {stageMeta.name}</option>
                {stageClasses.map((cg) => (
                  <option key={cg.name} value={cg.name}>
                    {cg.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم التلميذ..."
                  className="pr-8 pl-3 py-1.5 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                  <th className="py-3 px-3 font-bold">التلميذ(ة)</th>
                  <th className="py-3 px-2.5 font-bold text-center">الفوج</th>
                  <th className="py-3 px-3 font-bold">ولي الأمر والهاتف</th>
                  <th className="py-3 px-2.5 font-bold text-center">غياب غير مبرر</th>
                  <th className="py-3 px-2.5 font-bold text-center">غياب مبرر</th>
                  <th className="py-3 px-2.5 font-bold text-center">التأخرات</th>
                  <th className="py-3 px-2.5 font-bold text-center">ساعات الغياب</th>
                  <th className="py-3 px-3 font-black text-center bg-[#0c281b]">
                    نقطة المواظبة (/{maxScale})
                  </th>
                  <th className="py-3 px-3 font-bold text-center">
                    الإجراء المعتمد في {stageMeta.name}
                  </th>
                  <th className="py-3 px-3 font-bold text-center">إجراء فوري A4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredStudentMatrix.map((item) => {
                  const uCount = item.unjustifiedAbsencesCount;
                  const escalationLabel =
                    uCount === 0
                      ? 'مواظبة مثالية ومنتظمة'
                      : activeStage === 'primary'
                      ? 'اتصال فوري بالولي + متابعة صحية UDS'
                      : uCount === 1
                      ? 'تنبيه شفوي + متابعة المستشار'
                      : uCount <= 3
                      ? 'الإشعار الأول بالغياب واستدعاء الولي'
                      : 'الإنذار الثاني + توقيع تعهد كتابي للولي';

                  const studentAbsList = stageAbsences.filter(
                    (a) =>
                      a.type === 'student' &&
                      (a.targetId === item.student.id ||
                        a.personName === item.student.fullName)
                  );

                  return (
                    <tr
                      key={item.student.id}
                      className="hover:bg-[#0d261a]/70 transition-colors"
                    >
                      <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                        {item.student.fullName}
                      </td>
                      <td className="py-3 px-2.5 text-center font-bold text-[#f5d77f]">
                        {item.student.classGroup}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-slate-200 font-semibold">
                          {item.student.parentName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 tabular-nums">
                          <Phone className="w-3 h-3 text-[#d4af37]" />
                          <span>{item.student.parentPhone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono font-black text-rose-400 tabular-nums">
                        {item.unjustifiedAbsencesCount}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono font-bold text-cyan-300 tabular-nums">
                        {item.justifiedAbsencesCount}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono font-bold text-amber-300 tabular-nums">
                        {item.lateCount}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono text-slate-200 tabular-nums">
                        {item.totalMissedHours} س
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black text-emerald-300 bg-[#0c281b]/60 tabular-nums">
                        {item.attendanceScore.toFixed(2)} / {maxScale}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold ${
                            uCount === 0
                              ? 'text-emerald-400'
                              : uCount === 1
                              ? 'text-amber-300'
                              : 'text-rose-400'
                          }`}
                        >
                          {escalationLabel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() =>
                            setSummonPrintData({
                              studentName: item.student.fullName,
                              classGroup: `${item.student.classGroup} (${item.student.level})`,
                              parentName: item.student.parentName,
                              parentPhone: item.student.parentPhone,
                              unjustifiedCount: item.unjustifiedAbsencesCount,
                              totalHours: item.totalMissedHours,
                              attendanceScore: item.attendanceScore,
                              recentDates:
                                studentAbsList
                                  .map((a) => `${a.date} (${a.period})`)
                                  .join(' ، ') || 'لا توجد غيابات غير مبررة مسجلة',
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#105e32] hover:bg-[#14753e] text-[#f5d77f] border border-[#d4af37]/40 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>بطاقة مواظبة / استدعاء A4</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* النمط الثالث: السجل اليومي الشامل وتبرير الغيابات بمرونة */}
      {activeTab === 'full_log' && (
        <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 overflow-hidden shadow-2xl">
          <div className="p-4 bg-[#06150e] border-b border-[#d4af37]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/50'
                    : 'bg-slate-800/80 text-slate-300'
                }`}
              >
                الجميع ({stageAbsences.length})
              </button>
              <button
                onClick={() => setFilterType('student')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  filterType === 'student'
                    ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/50'
                    : 'bg-slate-800/80 text-slate-300'
                }`}
              >
                التلاميذ ({studentAbsences.length})
              </button>
              <button
                onClick={() => setFilterType('teacher')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  filterType === 'teacher'
                    ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/50'
                    : 'bg-slate-800/80 text-slate-300'
                }`}
              >
                الأساتذة ({teacherAbsences.length})
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                <option value="all">جميع الحالات القانونية</option>
                <option value="unjustified">غير مبرر</option>
                <option value="justified">مبرر قانوناً</option>
                <option value="late">تأخر</option>
                <option value="parent_summoned">تم استدعاء الولي</option>
                <option value="warning_sent">استفسار أستاذ</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو القسم..."
                  className="pr-8 pl-3 py-1.5 rounded-lg bg-[#092015] border border-[#d4af37]/40 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                  <th className="py-3 px-3 font-bold">الصفة</th>
                  <th className="py-3 px-3 font-bold">الاسم والقسم / المادة</th>
                  <th className="py-3 px-3 font-bold">التاريخ والحصة</th>
                  <th className="py-3 px-2 font-bold text-center">المدة</th>
                  <th className="py-3 px-3 font-bold">السبب والإجراء المتخذ</th>
                  <th className="py-3 px-3 font-bold text-center">الوضعية القانونية</th>
                  <th className="py-3 px-3 font-bold text-center no-print">
                    معالجة مرنة فورية
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAbsences.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#0d261a]/70 transition-colors"
                  >
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold ${
                          item.type === 'student'
                            ? 'text-emerald-300'
                            : 'text-[#f5d77f]'
                        }`}
                      >
                        {item.type === 'student' ? 'تلميذ متمدرس' : 'أستاذ / موظف'}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-white">{item.personName}</div>
                      <div className="text-[11px] text-[#d4af37]">
                        {item.roleOrClass}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap tabular-nums">
                      <div className="font-mono font-bold text-slate-200">
                        {item.date}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.period}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-white tabular-nums">
                      {item.durationHours} س
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="text-slate-200">{item.reason}</div>
                      <div className="text-[11px] text-emerald-300 mt-0.5">
                        {item.actionTaken}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold ${
                          item.status === 'justified' ||
                          item.status === 'pledge_signed'
                            ? 'text-emerald-400'
                            : item.status === 'late'
                            ? 'text-amber-300'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.status === 'justified'
                          ? 'مبرر قانوناً'
                          : item.status === 'pledge_signed'
                          ? 'تعهد الولي موقع'
                          : item.status === 'parent_summoned'
                          ? 'تم استدعاء الولي'
                          : item.status === 'warning_sent'
                          ? 'تم توجيه استفسار'
                          : item.status === 'late'
                          ? 'تأخر مسجل'
                          : 'بدون مبرر'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap no-print">
                      <div className="flex items-center justify-center gap-1.5">
                        {item.status !== 'justified' && (
                          <button
                            onClick={() =>
                              handleQuickStatusChange(
                                item.id,
                                'justified',
                                'تم قبول التبرير القانوني وتحيين رصيد المواظبة.'
                              )
                            }
                            className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer"
                          >
                            قبول التبرير
                          </button>
                        )}

                        {item.type === 'student' &&
                          item.status !== 'parent_summoned' && (
                            <button
                              onClick={() => {
                                handleQuickStatusChange(
                                  item.id,
                                  'parent_summoned',
                                  'تم تحرير إشعار بالغياب واستدعاء ولي الأمر.'
                                );
                                onOpenDocumentGenerator(
                                  'doc-student-absence-notice'
                                );
                              }}
                              className="px-2 py-1 rounded bg-[#8f1414] hover:bg-red-700 text-white text-[11px] font-bold cursor-pointer"
                            >
                              استدعاء الولي
                            </button>
                          )}

                        {item.type === 'teacher' && (
                          <button
                            onClick={() =>
                              onOpenDocumentGenerator('doc-teacher-explanation')
                            }
                            className="px-2 py-1 rounded bg-[#0c2a1c] hover:bg-[#14422c] text-[#f5d77f] border border-[#d4af37]/40 text-[11px] font-bold cursor-pointer"
                          >
                            استخراج استفسار
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteAbsence(item.id)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white cursor-pointer"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة إضافة غياب أو تأخر فردي */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#091e14] border border-[#d4af37]/50 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#06150e] border-b border-[#d4af37]/30">
              <h3 className="text-base font-black text-white">
                تسجيل غياب أو تأخر جديد ({stageMeta.name})
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleAddSingleAbsence}
              className="p-5 space-y-3.5 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewType('student');
                    setNewTargetId(stageStudents[0]?.id || '');
                  }}
                  className={`py-2 rounded-lg font-bold cursor-pointer ${
                    newType === 'student'
                      ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  تلميذ متمدرس
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewType('teacher');
                    setNewTargetId(stageTeachers[0]?.id || '');
                  }}
                  className={`py-2 rounded-lg font-bold cursor-pointer ${
                    newType === 'teacher'
                      ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  أستاذ / موظف
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {newType === 'student' ? 'اختر التلميذ(ة):' : 'اختر الأستاذ(ة):'}
                </label>
                <select
                  value={newTargetId}
                  onChange={(e) => setNewTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {newType === 'student'
                    ? stageStudents.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.fullName} ({st.classGroup})
                        </option>
                      ))
                    : stageTeachers.map((tr) => (
                        <option key={tr.id} value={tr.id}>
                          {tr.name} ({tr.subject})
                        </option>
                      ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    تاريخ الغياب
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    عدد الساعات
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  الفترة / الحصة
                </label>
                <input
                  type="text"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  الوضعية القانونية
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AbsenceStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  <option value="unjustified">غياب بدون مبرر شرعي</option>
                  <option value="justified">
                    غياب مبرر قانوناً (شهادة طبية / حضور الولي)
                  </option>
                  <option value="late">تأخر عن الفترة / الحصة</option>
                  <option value="parent_summoned">
                    تم توجيه استدعاء لولي الأمر
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  السبب / الملاحظة
                </label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black cursor-pointer"
                >
                  حفظ في السجل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة طباعة بطاقة متابعة مواظبة تلميذ واستدعاء الولي (A4) */}
      {summonPrintData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-8 rounded-2xl bg-[#091e14] border border-[#d4af37] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#06150e] border-b border-[#d4af37]/40 no-print">
              <h3 className="text-base font-black text-white">
                بطاقة متابعة مواظبة تلميذ واستدعاء ولي الأمر ({stageMeta.name} — A4) —{' '}
                {summonPrintData.studentName}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الوثيقة A4</span>
                </button>
                <button
                  onClick={() => setSummonPrintData(null)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="p-8 bg-white text-black font-['Cairo',sans-serif] print-only-sheet space-y-5 text-xs leading-relaxed">
              <div className="text-center border-b-2 border-black pb-4 space-y-1">
                <div className="text-base font-bold">
                  الجمهورية الجزائرية الديمقراطية الشعبية
                </div>
                <div className="text-sm font-bold">وزارة التربية الوطنية</div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-right">
                    <div>{institution.wilaya}</div>
                    <div>{institution.schoolName}</div>
                    <div>مكتب {stageMeta.natherTitle}</div>
                  </div>
                  <img
                    src={logoSrc}
                    alt="شعار المؤسسة"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain rounded-full border border-black p-0.5"
                  />
                  <div className="text-left">
                    <div>السنة الدراسية: {institution.schoolYear}</div>
                    <div>الفصل الدراسي: {institution.currentTerm}</div>
                    <div>التاريخ: {new Date().toLocaleDateString('ar-DZ')}</div>
                  </div>
                </div>
              </div>

              <div className="text-center py-2.5 bg-slate-100 border border-black rounded">
                <h2 className="text-lg font-black">
                  إشعار بوضعية المواظبة واستدعاء رسمي لولي أمر التلميذ(ة) — {stageMeta.name}
                </h2>
                <p className="text-[11px] mt-0.5">
                  المرجع: القرار الوزاري رقم 171 والقرار 778 المتضمن نظام الجماعة التربوية
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border border-black p-4 rounded bg-slate-50">
                <div>
                  <strong>إلى السيد(ة) ولي الأمر:</strong> {summonPrintData.parentName}
                </div>
                <div>
                  <strong>رقم الهاتف المسجل:</strong> {summonPrintData.parentPhone}
                </div>
                <div>
                  <strong>اسم ولقب التلميذ(ة):</strong> {summonPrintData.studentName}
                </div>
                <div>
                  <strong>القسم والفوج التربوي:</strong> {summonPrintData.classGroup}
                </div>
              </div>

              <div className="space-y-3 border border-black p-4 rounded">
                <h4 className="font-bold text-sm underline">
                  حصيلة مواظبة التلميذ(ة) المسجلة بـ {institution.schoolName}:
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center font-bold bg-slate-100 p-2.5 border border-black">
                  <div>
                    الغيابات غير المبررة: {summonPrintData.unjustifiedCount}
                  </div>
                  <div>
                    إجمالي الساعات الضائعة: {summonPrintData.totalHours} ساعة
                  </div>
                  <div>
                    نقطة المواظبة الحالية: {summonPrintData.attendanceScore.toFixed(2)} /{' '}
                    {maxScale}
                  </div>
                </div>
                <div>
                  <strong>تفاصيل التواريخ والحصص المسجلة:</strong>{' '}
                  {summonPrintData.recentDates}
                </div>
                <p className="pt-2">
                  يشرفني أن أنهي إلى علمكم أنه قد لوحظ تغيب ابنكم/ابنتكم عن الحصص الدراسية، وعليه
                  يرجى منكم الحضور شخصياً إلى مكتب <strong>{stageMeta.natherTitle}</strong> لتبرير هذه الغيابات والاطلاع على نتائج التحصيل الدراسي، وذلك حفاظاً على مصلحة التلميذ البيداغوجية.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 text-center font-bold">
                <div>
                  <div>إمضاء ولي أمر التلميذ (بعد الاطلاع والحضور)</div>
                  <div className="mt-10 text-slate-500">[التوقيع وتاريخ الحضور]</div>
                </div>
                <div>
                  <div>
                    {stageMeta.natherTitle} ({institution.directorOfStudies})
                  </div>
                  <div className="mt-10 text-slate-500">[الختم والتوقيع الرسمي]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
