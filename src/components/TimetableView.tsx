import React, { useState, useMemo, useEffect } from 'react';
import {
  Clock,
  Plus,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  X,
} from 'lucide-react';
import { InstitutionInfo, TimetableSlot, TeacherRecord } from '../types';
import { CLASS_GROUPS, INITIAL_SUBJECTS, STAGE_METADATA } from '../data/initialData';

interface TimetableViewProps {
  institution: InstitutionInfo;
  timetable: TimetableSlot[];
  teachers: TeacherRecord[];
  onUpdateTimetable: (slots: TimetableSlot[]) => void;
}

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const PERIODS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:30 - 14:30',
  '14:30 - 15:30',
];
const ROOMS = [
  'حجرة 01',
  'حجرة 02',
  'حجرة 03',
  'مخبر الفيزياء 1',
  'مخبر العلوم 1',
  'قاعة الإعلام الآلي',
  'الملعب الرياضي',
];

export const TimetableView: React.FC<TimetableViewProps> = ({
  institution,
  timetable,
  teachers,
  onUpdateTimetable,
}) => {
  const activeStage = institution.stage;
  const stageMeta = STAGE_METADATA[activeStage];

  const stageClasses = useMemo(
    () => CLASS_GROUPS.filter((c) => c.stage === activeStage),
    [activeStage]
  );
  const stageTeachers = useMemo(
    () => teachers.filter((t) => t.stage === activeStage),
    [teachers, activeStage]
  );
  const stageSubjects = useMemo(
    () => INITIAL_SUBJECTS.filter((s) => s.stages.includes(activeStage)),
    [activeStage]
  );
  const stageTimetable = useMemo(
    () => timetable.filter((s) => s.stage === activeStage),
    [timetable, activeStage]
  );

  const [filterMode, setFilterMode] = useState<'class' | 'teacher' | 'room'>('class');
  const [selectedClass, setSelectedClass] = useState<string>(
    stageClasses[0]?.name || '4 م 1'
  );
  const [selectedTeacher, setSelectedTeacher] = useState<string>(
    stageTeachers[0]?.name || ''
  );
  const [selectedRoom, setSelectedRoom] = useState<string>('حجرة 01');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [slotDay, setSlotDay] = useState<string>('الأحد');
  const [slotPeriod, setSlotPeriod] = useState<string>('08:00 - 09:00');
  const [slotClass, setSlotClass] = useState<string>(stageClasses[0]?.name || '');
  const [slotSubject, setSlotSubject] = useState<string>(stageSubjects[0]?.name || '');
  const [slotTeacher, setSlotTeacher] = useState<string>(stageTeachers[0]?.name || '');
  const [slotRoom, setSlotRoom] = useState<string>('حجرة 01');

  useEffect(() => {
    if (stageClasses.length > 0 && !stageClasses.some((c) => c.name === selectedClass)) {
      setSelectedClass(stageClasses[0].name);
      setSlotClass(stageClasses[0].name);
    }
    if (stageTeachers.length > 0 && !stageTeachers.some((t) => t.name === selectedTeacher)) {
      setSelectedTeacher(stageTeachers[0].name);
      setSlotTeacher(stageTeachers[0].name);
    }
    if (stageSubjects.length > 0) {
      setSlotSubject(stageSubjects[0].name);
    }
  }, [activeStage, stageClasses, stageTeachers, stageSubjects, selectedClass, selectedTeacher]);

  // كاشف التعارضات البيداغوجية الفوري
  const conflicts = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < stageTimetable.length; i++) {
      for (let j = i + 1; j < stageTimetable.length; j++) {
        const a = stageTimetable[i];
        const b = stageTimetable[j];
        if (a.day === b.day && a.period === b.period) {
          if (a.teacher === b.teacher) {
            list.push(
              `تعارض أستاذ: (${a.teacher}) مبرمج في (${a.classGroup}) و (${b.classGroup}) يوم ${a.day} (${a.period})`
            );
          }
          if (a.room === b.room) {
            list.push(
              `تعارض قاعة/مخبر: (${a.room}) محجوزة لـ (${a.classGroup}) و (${b.classGroup}) يوم ${a.day} (${a.period})`
            );
          }
        }
      }
    }
    return list;
  }, [stageTimetable]);

  const filteredSlots = useMemo(() => {
    return stageTimetable.filter((s) => {
      if (filterMode === 'class') return s.classGroup === selectedClass;
      if (filterMode === 'teacher') return s.teacher === selectedTeacher;
      return s.room === selectedRoom;
    });
  }, [stageTimetable, filterMode, selectedClass, selectedTeacher, selectedRoom]);

  const handleOpenAddAt = (day: string, period: string) => {
    setSlotDay(day);
    setSlotPeriod(period);
    if (filterMode === 'class') setSlotClass(selectedClass);
    if (filterMode === 'teacher') setSlotTeacher(selectedTeacher);
    if (filterMode === 'room') setSlotRoom(selectedRoom);
    setShowModal(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimetableSlot = {
      id: `slot-${Date.now()}`,
      stage: activeStage,
      day: slotDay,
      period: slotPeriod,
      classGroup: slotClass,
      subject: slotSubject,
      teacher: slotTeacher,
      room: slotRoom,
    };
    onUpdateTimetable([...timetable, newSlot]);
    setShowModal(false);
  };

  const handleDeleteSlot = (id: string) => {
    onUpdateTimetable(timetable.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white text-xs font-bold">
            نظام إدارة وتوزيع جداول التوقيت الذكي ({stageMeta.name} — نصاب {stageMeta.teacherWeeklyQuota} ساعة)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#d4af37]" />
            <span>هندسة جداول التوقيت، تفويج المخابر، وكاشف التعارضات الفوري</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            تصميم وضبط جداول الأساتذة والأفواج التربوية لـ {stageMeta.name} والقاعات والمخابر مع رقابة آلية على النصاب القانوني ({stageMeta.teacherWeeklyQuota} ساعة أسبوعياً).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة حصة جديدة</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#105e32] hover:bg-[#14753e] text-[#f5d77f] border border-[#d4af37]/50 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الجدول</span>
          </button>
        </div>
      </div>

      {/* شريط كاشف التعارضات */}
      {conflicts.length > 0 ? (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 space-y-1">
          <div className="font-black text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>تنبيه: تم رصد {conflicts.length} تعارضات بيداغوجية في جداول التوقيت!</span>
          </div>
          {conflicts.map((c, idx) => (
            <div key={idx}>• {c}</div>
          ))}
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-xs text-emerald-200 flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            نظام الجداول سليم 100%: لا يوجد أي تضارب في الحجرات أو المخابر أو مواعيد أساتذة {stageMeta.institutionLabel}.
          </span>
        </div>
      )}

      {/* اختيار طريقة العرض */}
      <div className="p-4 rounded-xl bg-[#091e14] border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterMode('class')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              filterMode === 'class'
                ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]'
                : 'bg-[#06150e] text-slate-300'
            }`}
          >
            حسب الفوج التربوي
          </button>
          <button
            onClick={() => setFilterMode('teacher')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              filterMode === 'teacher'
                ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]'
                : 'bg-[#06150e] text-slate-300'
            }`}
          >
            حسب الأستاذ(ة)
          </button>
          <button
            onClick={() => setFilterMode('room')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              filterMode === 'room'
                ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]'
                : 'bg-[#06150e] text-slate-300'
            }`}
          >
            حسب الحجرة / المخبر
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#d4af37]">تحديد العنصر:</span>
          {filterMode === 'class' && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
            >
              {stageClasses.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.level})
                </option>
              ))}
            </select>
          )}
          {filterMode === 'teacher' && (
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
            >
              {stageTeachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.subject})
                </option>
              ))}
            </select>
          )}
          {filterMode === 'room' && (
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
            >
              {ROOMS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* شبكة الجدول الأسبوعي */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-[#05120c] text-[#f5d77f] border-b border-[#d4af37]/30">
                <th className="py-3 px-3 font-bold w-24">اليوم</th>
                {PERIODS.map((p) => (
                  <th key={p} className="py-3 px-3 font-bold text-center tabular-nums">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {DAYS.map((day) => (
                <tr key={day} className="hover:bg-[#0b2318]/40">
                  <td className="py-4 px-3 font-black text-[#f5d77f] bg-[#06150e]">{day}</td>
                  {PERIODS.map((period) => {
                    const slot = filteredSlots.find(
                      (s) => s.day === day && s.period === period
                    );
                    return (
                      <td
                        key={period}
                        className="p-2 border-r border-slate-800/60 align-top min-w-[140px]"
                      >
                        {slot ? (
                          <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#103824] to-[#081f14] border border-[#d4af37]/40 space-y-1 relative group">
                            <div className="font-black text-white text-xs">{slot.subject}</div>
                            <div className="text-[11px] text-[#f5d77f] font-semibold">
                              {slot.teacher}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-emerald-300 pt-1">
                              <span>{slot.classGroup}</span>
                              <span>{slot.room}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 p-1 rounded bg-rose-900/90 text-white cursor-pointer transition-opacity"
                              title="حذف الحصة"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenAddAt(day, period)}
                            className="w-full h-20 rounded-xl border border-dashed border-slate-800 hover:border-[#d4af37]/50 text-slate-500 hover:text-[#f5d77f] text-[11px] flex items-center justify-center cursor-pointer transition-colors"
                          >
                            + إضافة حصة
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* متابعة الحجم الساعي للأساتذة حسب الطور */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
          <h3 className="text-base font-black text-white">
            متابعة النصاب الساعي الأسبوعي لأساتذة {stageMeta.institutionLabel} (النصاب القانوني: {stageMeta.teacherWeeklyQuota} ساعة — المرسوم 25-54)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stageTeachers.map((t) => {
            const pct = Math.round((t.assignedHours / t.weeklyQuota) * 100);
            return (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-[#06150e] border border-[#d4af37]/25 space-y-2"
              >
                <div className="font-bold text-white text-xs">{t.name}</div>
                <div className="text-[11px] text-[#d4af37]">{t.subject}</div>
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="text-emerald-300">
                    {t.assignedHours} / {t.weeklyQuota} س
                  </span>
                  <span className="text-slate-400">{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#d4af37]"
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* نافذة إضافة حصة */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#091e14] border border-[#d4af37]/50 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#06150e] border-b border-[#d4af37]/30">
              <h3 className="text-base font-black text-white">
                إضافة حصة جديدة ({stageMeta.shortName})
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSlot} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">اليوم</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">التوقيت</label>
                  <select
                    value={slotPeriod}
                    onChange={(e) => setSlotPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white tabular-nums"
                  >
                    {PERIODS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الفوج التربوي</label>
                  <select
                    value={slotClass}
                    onChange={(e) => setSlotClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {stageClasses.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الحجرة / المخبر</label>
                  <select
                    value={slotRoom}
                    onChange={(e) => setSlotRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {ROOMS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المادة التعليمية</label>
                <select
                  value={slotSubject}
                  onChange={(e) => setSlotSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {stageSubjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">الأستاذ المكلف</label>
                <select
                  value={slotTeacher}
                  onChange={(e) => setSlotTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {stageTeachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black cursor-pointer"
                >
                  تثبيت الحصة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
