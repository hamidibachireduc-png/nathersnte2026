import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Award,
  TrendingUp,
  Printer,
  CheckCircle2,
  Calendar,
  Scale,
  BadgeCheck,
  Sparkles,
  FileSpreadsheet,
  ArrowUpRight,
  Landmark
} from 'lucide-react';
import { InstitutionProfile } from '../types';

interface CareerPromotionSimulatorProps {
  institution: InstitutionProfile;
}

// Official Index Grid for Category 16 & Category 17 (Updated 2026 Decree 25-54)
const CATEGORY_DATA: Record<
  'cat16' | 'cat17_2026',
  {
    label: string;
    decreeRef: string;
    baseIndex: number;
    echelons: number[];
  }
> = {
  cat16: {
    label: 'الصنف 16 — رتبة ناظر ثانوية (الشبكة الاستدلالية السارية)',
    decreeRef: 'المرسوم الرئاسي 07-304 + المرسوم التنفيذي 12-240',
    baseIndex: 913,
    echelons: [0, 46, 91, 137, 183, 228, 274, 320, 365, 411, 457, 502, 548]
  },
  cat17_2026: {
    label: 'الصنف 17 (تحيين 2026) — ناظر ثانوية / مدير دراسات (القانون الأساسي الجديد)',
    decreeRef: 'المرسوم التنفيذي 25-54 المؤرخ في 2025/2026 (التصنيف المحدث)',
    baseIndex: 962,
    echelons: [0, 48, 96, 144, 192, 241, 289, 337, 385, 433, 481, 529, 577]
  }
};

export const CareerPromotionSimulator: React.FC<CareerPromotionSimulatorProps> = ({ institution }) => {
  const [activeTab, setActiveTab] = useState<'echelon_simulator' | 'promotion_scale'>('echelon_simulator');

  // --- Tab 1 State: Echelon & Salary Simulator ---
  const [selectedCategory, setSelectedCategory] = useState<'cat16' | 'cat17_2026'>('cat17_2026');
  const [currentEchelon, setCurrentEchelon] = useState<number>(6);
  const [lastPromotionDate, setLastPromotionDate] = useState<string>('2023-09-01');
  const [retainedMonths, setRetainedMonths] = useState<number>(4); // الأقدمية المحتفظ بها بالأشهر
  const [promotionPace, setPromotionPace] = useState<'min' | 'med' | 'max'>('min'); // الدنيا 30 شهر، المتوسطة 36 شهر، القصوى 42 شهر
  const [pointValueDZD, setPointValueDZD] = useState<number>(45); // قيمة النقطة الاستدلالية (45 دج)
  const [familyStatusBonus, setFamilyStatusBonus] = useState<number>(3000);

  // --- Tab 2 State: Qualification & Promotion Scale (مقياس التأهيل والترقية لرتبة مدير ثانوية / مفتش) ---
  const [yearsAsDirectorOfStudies, setYearsAsDirectorOfStudies] = useState<number>(5);
  const [yearsGeneralSeniority, setYearsGeneralSeniority] = useState<number>(16);
  const [adminMark, setAdminMark] = useState<number>(19.5); // نقطة المدير / الإدارة من 20
  const [inspectorMark, setInspectorMark] = useState<number>(18.5); // نقطة المفتش من 20
  const [extraDiploma, setExtraDiploma] = useState<'none' | 'master' | 'magister_phd'>('master');
  const [studyDaysCount, setStudyDaysCount] = useState<number>(4); // ملتقيات وأيام دراسية مؤطرة
  const [examCenterRole, setExamCenterRole] = useState<number>(3); // عدد دورات أمانة مراكز الامتحانات الرسمية

  // Calculate Echelon & Salary results
  const echelonResults = useMemo(() => {
    const cat = CATEGORY_DATA[selectedCategory];
    const currentEchelonPoints = cat.echelons[currentEchelon] ?? 0;
    const nextEchelon = Math.min(12, currentEchelon + 1);
    const nextEchelonPoints = cat.echelons[nextEchelon] ?? currentEchelonPoints;

    const totalCurrentIndex = cat.baseIndex + currentEchelonPoints;
    const totalNextIndex = cat.baseIndex + nextEchelonPoints;

    const baseSalary = totalCurrentIndex * pointValueDZD;
    const echelonAllowance = currentEchelonPoints * pointValueDZD;
    const nextEchelonAllowance = nextEchelonPoints * pointValueDZD;

    // Pedagogical & administrative allowances for Director of Studies (approx realistic structure)
    const pedagogicalFramingBonus = Math.round(baseSalary * 0.45); // علاوة التأطير البيداغوجي والتسيير
    const documentationBonus = 4500; // منحة التوثيق التربوي
    const qualificationAllowance = Math.round(baseSalary * 0.25); // تعويض التأهيل
    const grossMonthlyEstimate = baseSalary + pedagogicalFramingBonus + documentationBonus + qualificationAllowance;
    const socialSecurityAndIRG = Math.round(grossMonthlyEstimate * 0.19);
    const estimatedNetMonthly = grossMonthlyEstimate - socialSecurityAndIRG + familyStatusBonus;

    // Quarterly Yield Bonus (منحة المردودية 40%)
    const quarterlyYieldNet = Math.round(grossMonthlyEstimate * 0.40 * 3 * 0.81);

    // Monthly increase after promotion to next echelon
    const monthlyNetIncrease = Math.round((nextEchelonAllowance - echelonAllowance) * 1.35 * 0.81);

    // Required months for next echelon
    const requiredMonths = promotionPace === 'min' ? 30 : promotionPace === 'med' ? 36 : 42;
    const effectiveMonthsNeeded = Math.max(0, requiredMonths - retainedMonths);

    const baseDate = new Date(lastPromotionDate || '2023-09-01');
    const nextDate = new Date(baseDate);
    nextDate.setMonth(nextDate.getMonth() + effectiveMonthsNeeded);
    const nextDateStr = isNaN(nextDate.getTime())
      ? 'غير محدد'
      : nextDate.toISOString().split('T')[0];

    return {
      cat,
      currentEchelonPoints,
      nextEchelon,
      nextEchelonPoints,
      totalCurrentIndex,
      totalNextIndex,
      baseSalary,
      echelonAllowance,
      estimatedNetMonthly,
      quarterlyYieldNet,
      monthlyNetIncrease,
      requiredMonths,
      effectiveMonthsNeeded,
      nextDateStr
    };
  }, [
    selectedCategory,
    currentEchelon,
    lastPromotionDate,
    retainedMonths,
    promotionPace,
    pointValueDZD,
    familyStatusBonus
  ]);

  // Calculate Qualification & Promotion Score (مقياس التأهيل والترقية لرتبة مدير ثانوية)
  const promotionScaleResults = useMemo(() => {
    // 1. Seniority in current rank (الناظر): 2 points per year (max 20)
    const rankSeniorityPoints = Math.min(20, yearsAsDirectorOfStudies * 2);

    // 2. General seniority in education: 0.5 point per year outside current rank (max 10)
    const previousYears = Math.max(0, yearsGeneralSeniority - yearsAsDirectorOfStudies);
    const generalSeniorityPoints = Math.min(10, previousYears * 0.5);

    // 3. Administrative Mark (/20) + Inspector Mark (/20) = /40
    const evaluationPoints = Number(adminMark) + Number(inspectorMark);

    // 4. Diplomas bonus
    const diplomaPoints = extraDiploma === 'magister_phd' ? 6 : extraDiploma === 'master' ? 3 : 0;

    // 5. Pedagogical initiatives & study days (0.5 per session, max 3)
    const studyDaysPoints = Math.min(3, studyDaysCount * 0.5);

    // 6. Official Exam Center Vice-Head / Secretariat (1 pt per session, max 5)
    const examPoints = Math.min(5, examCenterRole * 1);

    const totalScore = Number(
      (
        rankSeniorityPoints +
        generalSeniorityPoints +
        evaluationPoints +
        diplomaPoints +
        studyDaysPoints +
        examPoints
      ).toFixed(2)
    );

    const eligibleForContest = yearsAsDirectorOfStudies >= 3; // المسابقة المهنية: 3 سنوات خدمة فعلية
    const eligibleForPromotionList = yearsAsDirectorOfStudies >= 5; // قائمة التأهيل (الاختيار): 5 سنوات خدمة فعلية
    const eligibleForInspectorContest = yearsAsDirectorOfStudies >= 5 && inspectorMark >= 16;

    return {
      rankSeniorityPoints,
      generalSeniorityPoints,
      evaluationPoints,
      diplomaPoints,
      studyDaysPoints,
      examPoints,
      totalScore,
      eligibleForContest,
      eligibleForPromotionList,
      eligibleForInspectorContest
    };
  }, [
    yearsAsDirectorOfStudies,
    yearsGeneralSeniority,
    adminMark,
    inspectorMark,
    extraDiploma,
    studyDaysCount,
    examCenterRole
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#081a12] via-[#104629] to-[#4a0f14] rounded-2xl p-6 text-white shadow-xl border-b-4 border-amber-500">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-amber-400/20 border-2 border-amber-400/50 p-3.5 rounded-2xl">
              <Calculator className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-400 text-[#081a12] text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  المرسوم التنفيذي 25-54 (تحيين 2026)
                </span>
                <span className="bg-emerald-900/80 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-600/40">
                  المرسوم الرئاسي 07-304
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                محاكي حساب الدرجات ومقياس التأهيل والترقية الخاص بالناظر
              </h2>
              <p className="text-emerald-100/90 text-sm mt-1 max-w-3xl">
                حساب دقيق للترقية في الدرجات (الأقدمية الدنيا، المتوسطة، القصوى)، الشبكة الاستدلالية المحدثة 2026، ومقياس نقاط التأهيل والترقية لرتبة مدير ثانوية أو مفتش التربية الوطنية.
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer self-start lg:self-center"
          >
            <Printer className="w-4 h-4" />
            طباعة بطاقة المحاكاة والتقييم الذاتي (A4)
          </button>
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('echelon_simulator')}
          className={`flex-1 min-w-[240px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'echelon_simulator'
              ? 'bg-[#0c3b22] text-amber-300 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          محاكي الترقية في الدرجات (1 إلى 12) والشبكة الاستدلالية 2026
        </button>

        <button
          onClick={() => setActiveTab('promotion_scale')}
          className={`flex-1 min-w-[240px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'promotion_scale'
              ? 'bg-[#7a1219] text-amber-300 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          مقياس التأهيل والترقية لرتبة مدير ثانوية / مفتش (2026)
        </button>
      </div>

      {/* TAB 1: ECHELON & INDEX SIMULATOR */}
      {activeTab === 'echelon_simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Scale className="w-4 h-4 text-emerald-700" />
              معطيات التصنيف والدرجة الحالية للناظر
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">التصنيف القاعدي للرتبة</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as 'cat16' | 'cat17_2026')}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-emerald-50/50 font-bold text-slate-900"
                >
                  <option value="cat17_2026">الصنف 17 (التصنيف المحدث 2026 - المرسوم 25-54)</option>
                  <option value="cat16">الصنف 16 (التصنيف السابق - المرسوم 12-240)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الدرجة الحالية (من الدرجة 1 إلى 12): <span className="text-emerald-800 font-black">الدرجة {currentEchelon}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={currentEchelon}
                  onChange={(e) => setCurrentEchelon(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>الدرجة 1</span>
                  <span>الدرجة 6</span>
                  <span>الدرجة 12</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ سريان آخر درجة</label>
                  <input
                    type="date"
                    value={lastPromotionDate}
                    onChange={(e) => setLastPromotionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الأقدمية المحتفظ بها (أشهر)</label>
                  <input
                    type="number"
                    min={0}
                    max={29}
                    value={retainedMonths}
                    onChange={(e) => setRetainedMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وتيرة الترقية في الجدول السنوي</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'min', label: 'الدنيا (2.5 سنة)', sub: '30 شهراً (4 ن)' },
                    { id: 'med', label: 'المتوسطة (3 سنوات)', sub: '36 شهراً (4 ن)' },
                    { id: 'max', label: 'القصوى (3.5 سنة)', sub: '42 شهراً (2 ن)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPromotionPace(p.id as 'min' | 'med' | 'max')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        promotionPace === p.id
                          ? 'bg-[#0c3b22] text-amber-300 border-emerald-800 font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px]">{p.label}</div>
                      <div className="text-[9px] opacity-80 mt-0.5">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">قيمة النقطة الاستدلالية (دج)</label>
                  <input
                    type="number"
                    value={pointValueDZD}
                    onChange={(e) => setPointValueDZD(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المنح العائلية (دج)</label>
                  <input
                    type="number"
                    value={familyStatusBonus}
                    onChange={(e) => setFamilyStatusBonus(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Dashboard & Full 12-Echelon Grid */}
          <div className="lg:col-span-2 space-y-5">
            {/* Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border-2 border-emerald-600 shadow-sm">
                <span className="text-xs font-bold text-slate-500">مجموع النقاط الاستدلالية الحالي</span>
                <div className="text-2xl font-black text-emerald-900 mt-1">
                  {echelonResults.totalCurrentIndex} نقطة
                </div>
                <p className="text-[11px] text-emerald-700 font-bold mt-1">
                  القاعدي ({echelonResults.cat.baseIndex}) + الدرجة {currentEchelon} ({echelonResults.currentEchelonPoints})
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border-2 border-amber-500 shadow-sm">
                <span className="text-xs font-bold text-slate-500">تاريخ الاستحقاق المتوقع للدرجة {echelonResults.nextEchelon}</span>
                <div className="text-2xl font-black text-amber-800 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  {echelonResults.nextDateStr}
                </div>
                <p className="text-[11px] text-amber-700 font-bold mt-1">
                  بعد خصم {retainedMonths} أشهر أقدمية محتفظ بها
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border-2 border-rose-700 shadow-sm">
                <span className="text-xs font-bold text-slate-500">الزيادة الصافية الشهرية عند الترقية</span>
                <div className="text-2xl font-black text-rose-800 mt-1 flex items-center gap-1">
                  +{echelonResults.monthlyNetIncrease.toLocaleString('ar-DZ')} دج
                </div>
                <p className="text-[11px] text-slate-600 font-bold mt-1">
                  الراتب التقديري: {echelonResults.estimatedNetMonthly.toLocaleString('ar-DZ')} دج
                </p>
              </div>
            </div>

            {/* Complete 12 Echelons Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-black text-xs text-amber-300 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    جدول الشبكة الاستدلالية الكاملة للدرجات (1 إلى 12) — {echelonResults.cat.label}
                  </h4>
                  <p className="text-[11px] text-slate-300">{echelonResults.cat.decreeRef}</p>
                </div>
                <span className="text-xs bg-emerald-800 text-emerald-100 px-3 py-1 rounded-lg font-bold">
                  منحة المردودية (40%): ~{echelonResults.quarterlyYieldNet.toLocaleString('ar-DZ')} دج / ثلاثي
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-black">
                      <th className="py-2.5 px-3">الدرجة</th>
                      <th className="py-2.5 px-3">الرقم الاستدلالي القاعدي</th>
                      <th className="py-2.5 px-3">نقاط الدرجة</th>
                      <th className="py-2.5 px-3">المجموع الاستدلالي</th>
                      <th className="py-2.5 px-3">قيمة الخبرة المهنية (دج)</th>
                      <th className="py-2.5 px-3">الوضعية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {echelonResults.cat.echelons.slice(1).map((pts, idx) => {
                      const echNum = idx + 1;
                      const isCurrent = echNum === currentEchelon;
                      const isNext = echNum === echelonResults.nextEchelon && currentEchelon < 12;
                      return (
                        <tr
                          key={echNum}
                          onClick={() => setCurrentEchelon(echNum)}
                          className={`cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-emerald-100/90 font-black text-emerald-950'
                              : isNext
                              ? 'bg-amber-50 font-bold text-amber-950'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-black">الدرجة {echNum}</td>
                          <td className="py-2.5 px-3">{echelonResults.cat.baseIndex}</td>
                          <td className="py-2.5 px-3 text-emerald-800 font-bold">+{pts}</td>
                          <td className="py-2.5 px-3 font-black">{echelonResults.cat.baseIndex + pts}</td>
                          <td className="py-2.5 px-3">{(pts * pointValueDZD).toLocaleString('ar-DZ')} دج</td>
                          <td className="py-2.5 px-3">
                            {isCurrent && (
                              <span className="bg-emerald-800 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-black">
                                درجتك الحالية
                              </span>
                            )}
                            {isNext && (
                              <span className="bg-amber-500 text-slate-950 text-[10px] px-2.5 py-0.5 rounded-full font-black">
                                الدرجة الموالية ({echelonResults.nextDateStr})
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUALIFICATION & PROMOTION SCALE (مقياس التأهيل والترقية للناظر) */}
      {activeTab === 'promotion_scale' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input criteria */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BadgeCheck className="w-5 h-5 text-[#7a1219]" />
              معايير مقياس التأهيل والترقية لرتبة أعلى (مدير ثانوية / مفتش)
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الأقدمية في رتبة ناظر (سنوات)</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={yearsAsDirectorOfStudies}
                    onChange={(e) => setYearsAsDirectorOfStudies(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الأقدمية العامة في التعليم</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={yearsGeneralSeniority}
                    onChange={(e) => setYearsGeneralSeniority(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">العلامة الإدارية (/20)</label>
                  <input
                    type="number"
                    step="0.25"
                    min={10}
                    max={20}
                    value={adminMark}
                    onChange={(e) => setAdminMark(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">علامة التفتيش البيداغوجي (/20)</label>
                  <input
                    type="number"
                    step="0.25"
                    min={10}
                    max={20}
                    value={inspectorMark}
                    onChange={(e) => setInspectorMark(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الشهادات العلمية الإضافية بعد التوظيف</label>
                <select
                  value={extraDiploma}
                  onChange={(e) => setExtraDiploma(e.target.value as 'none' | 'master' | 'magister_phd')}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                >
                  <option value="none">شهادة التوظيف الأصلية (ليسانس / مهندس)</option>
                  <option value="master">شهادة ماستر أو شهادة معادلة (+3 نقاط)</option>
                  <option value="magister_phd">شهادة ماجستير أو دكتوراه (+6 نقاط)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الأيام الدراسية والملتقيات المؤطرة</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={studyDaysCount}
                    onChange={(e) => setStudyDaysCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">أمانة مراكز الامتحانات الرسمية</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={examCenterRole}
                    onChange={(e) => setExamCenterRole(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Score Breakdown & Eligibility Cards */}
          <div className="lg:col-span-2 space-y-5">
            {/* Total Score Banner */}
            <div className="bg-gradient-to-l from-[#0c3b22] to-slate-900 rounded-2xl p-6 text-white border-2 border-amber-400 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase">
                  المجموع العام لنقاط مقياس التأهيل والترقية (تقدير 2026)
                </span>
                <div className="text-4xl font-black text-white mt-1">
                  {promotionScaleResults.totalScore} <span className="text-lg text-amber-300">/ 84 نقطة</span>
                </div>
                <p className="text-xs text-emerald-200 mt-1">
                  الناظر: {institution.directorOfStudies} — {institution.schoolName}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${
                    promotionScaleResults.eligibleForContest
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                      : 'bg-rose-500/20 text-rose-200 border border-rose-400/40'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {promotionScaleResults.eligibleForContest
                    ? 'مستوفٍ لشرط المسابقة المهنية لرتبة مدير ثانوية (3 سنوات)'
                    : 'غير مستوفٍ بعد لشرط المسابقة المهنية (يتطلب 3 سنوات في الرتبة)'}
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${
                    promotionScaleResults.eligibleForPromotionList
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-slate-700 text-slate-300 border border-slate-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {promotionScaleResults.eligibleForPromotionList
                    ? 'مستوفٍ لشرط التسجيل في قوائم التأهيل (الاختيار - 5 سنوات)'
                    : `متبقٍ ${Math.max(0, 5 - yearsAsDirectorOfStudies)} سنة للتسجيل على قائمة التأهيل`}
                </div>
              </div>
            </div>

            {/* Detailed Points Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <h4 className="font-black text-xs text-slate-800 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-800" />
                  تفصيل عناصر التنقيط في شبكة الترقية والتأهيل لرتبة مدير ثانوية (2026)
                </h4>
                <span className="text-[11px] font-bold text-slate-500">
                  المنشور الإطاري للترقية الاختيارية والمسابقات المهنية
                </span>
              </div>

              <div className="divide-y divide-slate-200 text-xs">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900">1. الأقدمية في رتبة ناظر ثانوية (مدير الدراسات)</div>
                    <div className="text-[11px] text-slate-500">نقطتان (2.0) عن كل سنة خدمة فعلية في الرتبة (الحد الأقصى 20 ن)</div>
                  </div>
                  <span className="font-black text-sm text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    {promotionScaleResults.rankSeniorityPoints} / 20 ن
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900">2. الأقدمية العامة في قطاع التربية الوطنية</div>
                    <div className="text-[11px] text-slate-500">0.5 نقطة عن كل سنة في الرتب السابقة (الحد الأقصى 10 ن)</div>
                  </div>
                  <span className="font-black text-sm text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    {promotionScaleResults.generalSeniorityPoints} / 10 ن
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900">3. التقييم الإداري والتفتيش البيداغوجي</div>
                    <div className="text-[11px] text-slate-500">علامة المدير ({adminMark}/20) + علامة مفتش التربية الوطنية ({inspectorMark}/20)</div>
                  </div>
                  <span className="font-black text-sm text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                    {promotionScaleResults.evaluationPoints} / 40 ن
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900">4. الشهادات والمؤهلات العلمية العليا</div>
                    <div className="text-[11px] text-slate-500">تثمين الشهادات المحصل عليها (ماستر +3 ن / ماجستير أو دكتوراه +6 ن)</div>
                  </div>
                  <span className="font-black text-sm text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {promotionScaleResults.diplomaPoints} / 6 ن
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900">5. المبادرات التربوية وتأطير الملتقيات وأمانة مراكز الامتحانات</div>
                    <div className="text-[11px] text-slate-500">نقاط النشاط البيداغوجي ({promotionScaleResults.studyDaysPoints} ن) + مراكز الامتحانات الرسمية ({promotionScaleResults.examPoints} ن)</div>
                  </div>
                  <span className="font-black text-sm text-rose-800 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                    {promotionScaleResults.studyDaysPoints + promotionScaleResults.examPoints} / 8 ن
                  </span>
                </div>
              </div>

              <div className="p-4 bg-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">
                    مسار الترقية لرتبة مفتش التربية الوطنية (تخصص إدارة الثانويات):
                  </span>
                </div>
                <span className="font-black text-amber-300">
                  {promotionScaleResults.eligibleForInspectorContest
                    ? 'مؤهل للمشاركة في مسابقة التفتيش (أقدمية >= 5 سنوات ونقطة تفتيش >= 16)'
                    : 'يتطلب 5 سنوات خدمة فعلية في رتبة ناظر ونقطة تفتيش لا تقل عن 16/20'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
