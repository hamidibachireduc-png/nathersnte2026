import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  BookOpen, 
  Send, 
  Printer, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserX,
  HeartHandshake
} from 'lucide-react';
import { StudentScore, InstitutionProfile } from '../types';
import { AtRiskSupportModal } from './AtRiskSupportModal';

interface AtRiskStudentsRadarProps {
  students: StudentScore[];
  institution: InstitutionProfile;
  classGroup: string;
}

interface RemedialPlanData {
  riskLevel: 'critical' | 'moderate' | 'watchlist';
  riskLabel: string;
  continuousAvg: number;
  deficitSubjects: { name: string; contScore: number; examScore: number; coef: number }[];
  pedagogicalAction: string;
  guidanceAction: string;
  parentAction: string;
  peerTutor: string;
}

export const AtRiskStudentsRadar: React.FC<AtRiskStudentsRadarProps> = ({
  students,
  institution,
  classGroup
}) => {
  const [filterRisk, setFilterRisk] = useState<'all' | 'critical' | 'moderate' | 'watchlist'>('all');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentScore | null>(null);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<RemedialPlanData | null>(null);
  
  // Track actions taken per student in local state
  const [completedActions, setCompletedActions] = useState<Record<string, {
    remedialBooked?: boolean;
    parentCalled?: boolean;
    guidanceMet?: boolean;
  }>>({});

  // Peer tutors pool (top students in the class)
  const topStudents = students.filter(s => s.average >= 14);
  const defaultPeerTutor = topStudents[0]?.name || 'أمير بوعزيز (متفوق الفوج)';

  // Algorithm to detect at-risk students based on continuous assessment
  const analyzedStudents = students.map(student => {
    // Calculate continuous average
    let totalContinuousPoints = 0;
    let totalCoef = 0;
    const deficitSubjects: { name: string; contScore: number; examScore: number; coef: number }[] = [];

    student.scores.forEach(s => {
      totalContinuousPoints += (s.continuousScore * s.coefficient);
      totalCoef += s.coefficient;

      if (s.continuousScore < 10 || s.examScore < 10) {
        deficitSubjects.push({
          name: s.subject,
          contScore: s.continuousScore,
          examScore: s.examScore,
          coef: s.coefficient
        });
      }
    });

    const continuousAvg = totalCoef > 0 ? totalContinuousPoints / totalCoef : student.average;

    // Determine risk level
    let riskLevel: 'critical' | 'moderate' | 'watchlist' | 'safe' = 'safe';
    let riskLabel = 'في وضعية آمنة ومستقرة';

    const highCoefDeficits = deficitSubjects.filter(d => d.coef >= 5);

    if (continuousAvg < 8.5 || student.average < 8.5 || highCoefDeficits.length >= 2) {
      riskLevel = 'critical';
      riskLabel = 'خطر رسوب حرج جداً (تدخل استعجالي)';
    } else if (continuousAvg < 10 || student.average < 10) {
      riskLevel = 'moderate';
      riskLabel = 'خطر رسوب متوسط (يحتاج استدراكاً)';
    } else if (continuousAvg < 11.5 && deficitSubjects.length > 0) {
      riskLevel = 'watchlist';
      riskLabel = 'تحت الملاحظة والمتابعة الوقائية';
    }

    // Generate individual tailored actions based on deficit subjects
    const subjectNames = deficitSubjects.map(d => d.name).join(' و ');
    
    let pedagogicalAction = '';
    if (deficitSubjects.some(d => d.name.includes('الرياضيات'))) {
      pedagogicalAction = `إدراج التلميذ في ورشات الاستدراك الأسبوعية لمادة الرياضيات (ساعتان كل ثلاثاء)، مع التركيز على جبر الدوال وحل المسائل ذات الدلالة.`;
    } else if (deficitSubjects.some(d => d.name.includes('الفيزيائية'))) {
      pedagogicalAction = `برمجة حصص دعم تطبيقي في الفيزياء والكيمياء لمراجعة القوانين الأساسية والمفاهيم المخبرية.`;
    } else {
      pedagogicalAction = `برمجة خطة دعم بيداغوجي مكثفة في ${subjectNames || 'المواد الأساسية'} وتزويد التلميذ ببنك تمارين تدريبية تدرجية.`;
    }

    const guidanceAction = `جلسة استماع وتوجيه فردية مع مستشار التوجيه المدرسي لتشخيص أسباب التعثر، مع إعداد جدول زمني للمذاكرة المنزلية اليومية (ساعتان يومياً).`;
    const parentAction = `إرسال استدعاء رسمي فوري لولي الأمر وتوقيع ميثاق مرافقة تربوية منزلية يحدد مواعيد المراجعة ويحد من المشتتات.`;
    
    // Choose a peer tutor
    const peerTutor = defaultPeerTutor;

    const plan: RemedialPlanData = {
      riskLevel: riskLevel as any,
      riskLabel,
      continuousAvg,
      deficitSubjects,
      pedagogicalAction,
      guidanceAction,
      parentAction,
      peerTutor
    };

    return {
      student,
      plan,
      isAtRisk: riskLevel !== 'safe'
    };
  });

  const atRiskList = analyzedStudents.filter(item => item.isAtRisk);

  const filteredAtRisk = atRiskList.filter(item => {
    if (filterRisk === 'all') return true;
    return item.plan.riskLevel === filterRisk;
  });

  const toggleAction = (studentId: string, actionKey: 'remedialBooked' | 'parentCalled' | 'guidanceMet') => {
    setCompletedActions(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [actionKey]: !prev[studentId]?.[actionKey]
      }
    }));
  };

  const handleOpenModal = (student: StudentScore, plan: RemedialPlanData) => {
    setSelectedStudentForModal(student);
    setSelectedPlanForModal(plan);
  };

  const criticalCount = atRiskList.filter(i => i.plan.riskLevel === 'critical').length;
  const moderateCount = atRiskList.filter(i => i.plan.riskLevel === 'moderate').length;
  const watchlistCount = atRiskList.filter(i => i.plan.riskLevel === 'watchlist').length;

  return (
    <div className="rounded-xl bg-[#081a12] border-2 border-[#8f1414]/70 p-5 shadow-2xl space-y-5 relative overflow-hidden">
      
      {/* Background Subtle Radar Glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#8f1414] text-white animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              نظام الرصد والإنذار المبكر لخطر الرسوب البيداغوجي
            </span>
            <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">
              مبني على التقييمات المستمرة
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>رادار رصد التلاميذ المهددين بالتعثر وخطط الدعم الفردية</span>
            <span className="text-xs bg-[#d4af37] text-[#082014] font-bold px-2 py-0.5 rounded">
              فوج {classGroup}
            </span>
          </h3>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            يحلل هذا النظام الذكي درجات التقويم المستمر والفروض قبل موعد الامتحانات، ويرصد الفجوات البيداغوجية مقترحاً حزمة تدخلات فردية عاجلة لمنع رسوب التلميذ.
          </p>
        </div>

        {/* Counter Widget */}
        <div className="flex items-center gap-2 bg-[#05140d] p-2.5 rounded-xl border border-[#d4af37]/30">
          <div className="text-center px-2.5 border-l border-slate-700">
            <div className="text-xs text-slate-400 font-bold">الحالات الحرجة</div>
            <div className="text-xl font-black text-red-500">{criticalCount}</div>
          </div>
          <div className="text-center px-2.5 border-l border-slate-700">
            <div className="text-xs text-slate-400 font-bold">خطورة متوسطة</div>
            <div className="text-xl font-black text-yellow-400">{moderateCount}</div>
          </div>
          <div className="text-center px-2.5">
            <div className="text-xs text-slate-400 font-bold">تحت المراقبة</div>
            <div className="text-xl font-black text-blue-400">{watchlistCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setFilterRisk('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterRisk === 'all' 
              ? 'bg-[#8f1414] text-white shadow-md' 
              : 'bg-[#05140d] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          كافة الحالات المهددة ({atRiskList.length})
        </button>

        <button
          onClick={() => setFilterRisk('critical')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterRisk === 'critical' 
              ? 'bg-red-700 text-white shadow-md' 
              : 'bg-[#05140d] text-red-300 hover:text-white border border-red-950'
          }`}
        >
          خطر حرج جداً ({criticalCount})
        </button>

        <button
          onClick={() => setFilterRisk('moderate')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterRisk === 'moderate' 
              ? 'bg-yellow-700 text-white shadow-md' 
              : 'bg-[#05140d] text-yellow-300 hover:text-white border border-yellow-950'
          }`}
        >
          خطر متوسط ({moderateCount})
        </button>

        <button
          onClick={() => setFilterRisk('watchlist')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterRisk === 'watchlist' 
              ? 'bg-blue-700 text-white shadow-md' 
              : 'bg-[#05140d] text-blue-300 hover:text-white border border-blue-950'
          }`}
        >
          تحت الملاحظة ({watchlistCount})
        </button>
      </div>

      {/* List of At-Risk Students Cards */}
      <div className="space-y-4">
        {filteredAtRisk.length === 0 ? (
          <div className="p-8 text-center bg-[#05140d] rounded-xl border border-emerald-800 text-emerald-300 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="font-bold text-sm">لا توجد حالات تنبيه مطابقة لمعيار التصفية المختار!</p>
            <p className="text-slate-400 mt-1">المؤشرات البيداغوجية للتلاميذ ضمن النطاق الآمن.</p>
          </div>
        ) : (
          filteredAtRisk.map(({ student, plan }) => {
            const studentActions = completedActions[student.id] || {};
            const isCritical = plan.riskLevel === 'critical';
            const isModerate = plan.riskLevel === 'moderate';

            return (
              <div 
                key={student.id}
                className={`rounded-xl p-4 sm:p-5 transition-all border ${
                  isCritical 
                    ? 'bg-gradient-to-br from-[#1c0808] to-[#0a0303] border-red-700 shadow-xl' 
                    : isModerate
                    ? 'bg-gradient-to-br from-[#1a1306] to-[#090703] border-yellow-700/80 shadow-md'
                    : 'bg-gradient-to-br from-[#0a1622] to-[#04090e] border-blue-700/60 shadow-md'
                }`}
              >
                {/* Top Card Bar: Name + Scores + Risk Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      isCritical ? 'bg-red-900 text-red-200 border border-red-500' :
                      isModerate ? 'bg-yellow-900 text-yellow-200 border border-yellow-500' :
                      'bg-blue-900 text-blue-200 border border-blue-500'
                    }`}>
                      {student.rank ? `ر${student.rank}` : '!'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-white text-base">{student.name}</h4>
                        <span className="text-[11px] text-slate-400">({student.stream})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="text-slate-400">معدل التقويم المستمر:</span>
                        <span className="font-mono font-bold text-red-400">{plan.continuousAvg.toFixed(2)} / 20</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">المعدل الفصلي:</span>
                        <span className="font-mono font-bold text-white">{student.average.toFixed(2)} / 20</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Badge and Primary Modal Action */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 border ${
                      isCritical ? 'bg-red-950 text-red-300 border-red-700 animate-pulse' :
                      isModerate ? 'bg-yellow-950 text-yellow-300 border-yellow-700' :
                      'bg-blue-950 text-blue-300 border-blue-700'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{plan.riskLabel}</span>
                    </span>

                    <button
                      onClick={() => handleOpenModal(student, plan)}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] text-xs font-black flex items-center gap-1 hover:scale-105 shadow transition-all"
                      title="استخراج وطباعة استمارة الدعم والمرافقة الفردية الرسمية"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>استمارة الدعم A4</span>
                    </button>
                  </div>
                </div>

                {/* Deficit Subjects Breakdown */}
                <div className="my-3">
                  <div className="text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-red-400" />
                    <span>المواد المسجلة في دائرة الخطر والتعثر البيداغوجي:</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {plan.deficitSubjects.map((sub, i) => (
                      <div key={i} className="px-2.5 py-1 rounded-lg bg-[#05140d] border border-red-900/60 text-xs flex items-center gap-2">
                        <span className="font-bold text-white">{sub.name}</span>
                        <span className="text-[11px] text-red-400 font-mono font-bold">
                          تقويم: {sub.contScore.toFixed(1)}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-mono">
                          معامل {sub.coef}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4 Tailored Individual Support Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-3 text-xs">
                  
                  {/* Action 1: Pedagogical Support */}
                  <div className="p-2.5 rounded-lg bg-[#05140d]/80 border border-[#d4af37]/20 space-y-1">
                    <div className="font-bold text-[#f5d77f] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>1. التدخل البيداغوجي والاستدراك:</span>
                      </span>
                      <button
                        onClick={() => toggleAction(student.id, 'remedialBooked')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                          studentActions.remedialBooked
                            ? 'bg-emerald-900 text-emerald-300 border border-emerald-600'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {studentActions.remedialBooked ? '✓ تم إدراجه بالاستدراك' : 'تسجيل في الدعم'}
                      </button>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {plan.pedagogicalAction}
                    </p>
                  </div>

                  {/* Action 2: Guidance Counselor */}
                  <div className="p-2.5 rounded-lg bg-[#05140d]/80 border border-[#d4af37]/20 space-y-1">
                    <div className="font-bold text-blue-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>2. المرافقة التوجيهية والنفسية:</span>
                      </span>
                      <button
                        onClick={() => toggleAction(student.id, 'guidanceMet')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                          studentActions.guidanceMet
                            ? 'bg-blue-900 text-blue-300 border border-blue-600'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {studentActions.guidanceMet ? '✓ تمت المقابلة' : 'تحديد موعد'}
                      </button>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {plan.guidanceAction}
                    </p>
                  </div>

                  {/* Action 3: Parent Contact */}
                  <div className="p-2.5 rounded-lg bg-[#05140d]/80 border border-[#d4af37]/20 space-y-1">
                    <div className="font-bold text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>3. التواصل المبكر مع ولي الأمر:</span>
                      </span>
                      <button
                        onClick={() => toggleAction(student.id, 'parentCalled')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                          studentActions.parentCalled
                            ? 'bg-amber-900 text-amber-300 border border-amber-600'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {studentActions.parentCalled ? '✓ تم إشعار الولي' : 'إرسال استدعاء'}
                      </button>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {plan.parentAction}
                    </p>
                  </div>

                  {/* Action 4: Peer Tutoring */}
                  <div className="p-2.5 rounded-lg bg-[#05140d]/80 border border-[#d4af37]/20 space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                      <span>4. التوأمة والرفيق البيداغوجي:</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      مرافقة ثنائية مع التلميذ المتفوق: <strong className="text-white">{plan.peerTutor}</strong> لمراجعة المفاهيم وحل المسائل في المكتبة المدرسية.
                    </p>
                  </div>

                </div>

                {/* Progress Indicators Check */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-300">مؤشرات تنفيذ خطة الدعم:</span>
                    <span className={studentActions.remedialBooked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      • الاستدراك {studentActions.remedialBooked ? 'منجز' : 'معلق'}
                    </span>
                    <span className={studentActions.guidanceMet ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                      • التوجيه {studentActions.guidanceMet ? 'منجز' : 'معلق'}
                    </span>
                    <span className={studentActions.parentCalled ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      • ولي الأمر {studentActions.parentCalled ? 'تم التواصل' : 'معلق'}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#d4af37]">
                    توصية: إعادة تقييم التلميذ في الفرض المحروس الثاني
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Official Modal for Individual Remediation Card */}
      <AtRiskSupportModal
        isOpen={Boolean(selectedStudentForModal && selectedPlanForModal)}
        onClose={() => {
          setSelectedStudentForModal(null);
          setSelectedPlanForModal(null);
        }}
        student={selectedStudentForModal}
        institution={institution}
        remedialPlan={selectedPlanForModal}
      />
    </div>
  );
};
