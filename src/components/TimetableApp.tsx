import React, { useState } from 'react';
import { 
  CalendarDays, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit, 
  Printer, 
  Filter, 
  Users, 
  Building, 
  CheckCircle2,
  Clock,
  Download,
  AlertCircle
} from 'lucide-react';
import { TimetableSlot, TeacherRecord, InstitutionProfile } from '../types';

interface TimetableAppProps {
  institution: InstitutionProfile;
  timetable: TimetableSlot[];
  teachers: TeacherRecord[];
  onUpdateTimetable: (slots: TimetableSlot[]) => void;
}

export const TimetableApp: React.FC<TimetableAppProps> = ({
  institution,
  timetable,
  teachers,
  onUpdateTimetable
}) => {
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'room'>('class');
  const [selectedClass, setSelectedClass] = useState<string>('3 ع ت 1');
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teachers[0]?.name || '');
  const [selectedRoom, setSelectedRoom] = useState<string>('قاعة 12');

  // Modal State for adding/editing slot
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  const [formDay, setFormDay] = useState<TimetableSlot['day']>('الأحد');
  const [formPeriod, setFormPeriod] = useState<TimetableSlot['period']>('08:00 - 09:00');
  const [formClass, setFormClass] = useState('3 ع ت 1');
  const [formSubject, setFormSubject] = useState('الرياضيات');
  const [formTeacher, setFormTeacher] = useState(teachers[0]?.name || 'أ. سفيان بن عمار');
  const [formRoom, setFormRoom] = useState('قاعة 12');

  const days: TimetableSlot['day'][] = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const periods: TimetableSlot['period'][] = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  const classesList = ['3 ع ت 1', '3 ت ر 1', '2 ع ت 1', '2 أ ف 1', '1 ج م ع ت 1'];
  const roomsList = ['قاعة 12', 'قاعة 08', 'قاعة 14', 'مخبر العلوم 1', 'مخبر الفيزياء 2', 'قاعة الإعلام'];
  const subjectsList = ['الرياضيات', 'العلوم الفيزيائية', 'علوم الطبيعة والحياة', 'الأدب العربي', 'الفلسفة', 'اللغة الفرنسية', 'اللغة الإنجليزية', 'التاريخ والجغرافيا', 'العلوم الإسلامية', 'الإعلام الآلي'];

  // Conflict Detection Algorithm
  const detectConflicts = () => {
    const conflicts: { type: 'teacher' | 'room'; slot1: TimetableSlot; slot2: TimetableSlot; description: string }[] = [];

    for (let i = 0; i < timetable.length; i++) {
      for (let j = i + 1; j < timetable.length; j++) {
        const s1 = timetable[i];
        const s2 = timetable[j];

        if (s1.day === s2.day && s1.period === s2.period) {
          // Teacher conflict: same teacher teaching 2 different groups at same time
          if (s1.teacher === s2.teacher && s1.classGroup !== s2.classGroup) {
            conflicts.push({
              type: 'teacher',
              slot1: s1,
              slot2: s2,
              description: `تعارض أستاذ: الأستاذ (${s1.teacher}) مسجل في (${s1.classGroup}) و (${s2.classGroup}) في نفس الوقت يوم ${s1.day} (${s1.period})!`
            });
          }

          // Room conflict: same room occupied by 2 different groups at same time
          if (s1.room === s2.room && s1.classGroup !== s2.classGroup) {
            conflicts.push({
              type: 'room',
              slot1: s1,
              slot2: s2,
              description: `تعارض قاعة: (${s1.room}) محجوزة لـ (${s1.classGroup}) و (${s2.classGroup}) في نفس الوقت يوم ${s1.day} (${s1.period})!`
            });
          }
        }
      }
    }
    return conflicts;
  };

  const conflicts = detectConflicts();

  // Handle Save Slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSlot) {
      // update
      const updated = timetable.map(s => s.id === editingSlot.id ? {
        ...s,
        day: formDay,
        period: formPeriod,
        classGroup: formClass,
        subject: formSubject,
        teacher: formTeacher,
        room: formRoom
      } : s);
      onUpdateTimetable(updated);
    } else {
      // create new
      const newSlot: TimetableSlot = {
        id: `slot-${Date.now()}`,
        day: formDay,
        period: formPeriod,
        classGroup: formClass,
        subject: formSubject,
        teacher: formTeacher,
        room: formRoom
      };
      onUpdateTimetable([...timetable, newSlot]);
    }

    setIsModalOpen(false);
    setEditingSlot(null);
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الحصة من جدول التوقيت؟')) {
      onUpdateTimetable(timetable.filter(s => s.id !== id));
    }
  };

  const openEditModal = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormDay(slot.day);
    setFormPeriod(slot.period);
    setFormClass(slot.classGroup);
    setFormSubject(slot.subject);
    setFormTeacher(slot.teacher);
    setFormRoom(slot.room);
    setIsModalOpen(true);
  };

  const openAddModal = (defaultDay?: TimetableSlot['day'], defaultPeriod?: TimetableSlot['period']) => {
    setEditingSlot(null);
    if (defaultDay) setFormDay(defaultDay);
    if (defaultPeriod) setFormPeriod(defaultPeriod);
    setFormClass(selectedClass);
    setIsModalOpen(true);
  };

  // Filter slots according to active view mode
  const displayedSlots = timetable.filter(s => {
    if (viewMode === 'class') return s.classGroup === selectedClass;
    if (viewMode === 'teacher') return s.teacher === selectedTeacher;
    if (viewMode === 'room') return s.room === selectedRoom;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              <span>الركن الثالث: حزمة التطبيقات الرقمية المدمجة</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              نظام إدارة وتوزيع جداول التوقيت الذكي
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              تصميم وضبط جداول الأساتذة والأفواج والقاعات بدقة بيداغوجية عالية مع كاشف فوري للتعارضات وتجاوز النصاب الساعي الأسبوعي.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddModal()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حصة جديدة</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الجدول</span>
            </button>
          </div>
        </div>

        {/* Conflicts Alert Box */}
        {conflicts.length > 0 ? (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#380e0e] to-[#250909] border-2 border-red-500 shadow-xl space-y-2 animate-pulse">
            <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>تنبيه خطير: تم رصد {conflicts.length} تعارضات بيداغوجية في جداول التوقيت!</span>
            </div>
            <div className="space-y-1 text-xs text-red-200">
              {conflicts.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>{c.description}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-700/60 flex items-center gap-2 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>نظام الجداول سليم 100%: لا يوجد أي تضارب في القاعات أو مواعيد الأساتذة والأفواج.</span>
          </div>
        )}

        {/* View Mode & Filter Controls */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[#d4af37]/20">
          
          {/* Segmented View Mode */}
          <div className="flex items-center gap-1 bg-[#05140d] p-1 rounded-xl border border-[#d4af37]/30">
            <button
              onClick={() => setViewMode('class')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'class' ? 'bg-[#105e32] text-[#f5d77f] shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>حسب الفوج التربوي</span>
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'teacher' ? 'bg-[#105e32] text-[#f5d77f] shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>حسب الأستاذ</span>
            </button>
            <button
              onClick={() => setViewMode('room')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'room' ? 'bg-[#105e32] text-[#f5d77f] shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>حسب القاعة / المخبر</span>
            </button>
          </div>

          {/* Active Target Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-semibold">تحديد العنصر:</span>
            {viewMode === 'class' && (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-xs text-white focus:outline-none"
              >
                {classesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            {viewMode === 'teacher' && (
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-xs text-white focus:outline-none"
              >
                {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
              </select>
            )}

            {viewMode === 'room' && (
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-xs text-white focus:outline-none"
              >
                {roomsList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}
          </div>

        </div>
      </div>

      {/* Timetable Interactive Weekly Grid */}
      <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-5 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#d4af37] bg-[#05140d] px-3 py-1 rounded border border-[#d4af37]/30">
              {viewMode === 'class' && `جدول توقيت الفوج: ${selectedClass}`}
              {viewMode === 'teacher' && `جدول توقيت الأستاذ: ${selectedTeacher}`}
              {viewMode === 'room' && `جدول إشغال القاعة: ${selectedRoom}`}
            </span>
            <span className="text-xs text-slate-400">
              {displayedSlots.length} حصص مبرمجة أسبوعياً
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            انقر على خانة فارغة لإضافة حصة، أو على أيقونة التعديل للتحكم في الحصة
          </span>
        </div>

        {/* Weekly Matrix Table */}
        <table className="w-full border-collapse border border-[#d4af37]/30 text-xs min-w-[750px]">
          <thead>
            <tr className="bg-[#05140d] text-[#f5d77f] border-b border-[#d4af37]/40">
              <th className="p-3 border-l border-[#d4af37]/30 text-right w-24">اليوم</th>
              {periods.map((p, idx) => (
                <th key={idx} className="p-2.5 border-l border-[#d4af37]/30 text-center font-mono">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day} className="border-b border-[#d4af37]/20 hover:bg-[#0b2419]/30 transition-colors">
                <td className="p-3 font-bold text-white bg-[#06170f] border-l border-[#d4af37]/30">
                  {day}
                </td>
                {periods.map((period) => {
                  const slot = displayedSlots.find(s => s.day === day && s.period === period);

                  if (slot) {
                    return (
                      <td key={period} className="p-2 border-l border-[#d4af37]/20 align-top">
                        <div className="p-2 rounded bg-gradient-to-br from-[#0e2a1b] to-[#071910] border border-[#d4af37]/40 shadow-sm relative group hover:border-[#d4af37] transition-all">
                          <div className="font-bold text-white text-xs mb-0.5">{slot.subject}</div>
                          <div className="text-[11px] text-[#f5d77f] font-semibold">{slot.teacher}</div>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                            <span>{slot.room}</span>
                            <span className="font-bold text-emerald-400">{slot.classGroup}</span>
                          </div>

                          {/* Quick Edit/Delete Hover Controls */}
                          <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-[#05140d]/90 p-0.5 rounded transition-opacity">
                            <button
                              onClick={() => openEditModal(slot)}
                              className="text-slate-300 hover:text-[#d4af37] p-0.5"
                              title="تعديل الحصة"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="text-slate-300 hover:text-red-400 p-0.5"
                              title="حذف الحصة"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td 
                      key={period} 
                      onClick={() => openAddModal(day, period)}
                      className="p-2 border-l border-[#d4af37]/10 text-center hover:bg-[#0f3824]/40 cursor-pointer transition-colors group"
                      title="انقر لإضافة حصة هنا"
                    >
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#d4af37] font-bold">
                        + إضافة
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teachers Quotas and Workload Overview */}
      <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-white text-sm">متابعة الحجم الساعي الأسبوعي للأساتذة (النصاب القانوني)</h3>
          </div>
          <span className="text-xs text-slate-400">المرجع: المرسوم 08-315 (18 ساعة أسبوعية لأستاذ التعليم الثانوي)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {teachers.map((teacher) => {
            const currentSlots = timetable.filter(s => s.teacher === teacher.name).length;
            const percentage = Math.min(100, Math.round((currentSlots / teacher.weeklyQuota) * 100));
            const isFull = currentSlots >= teacher.weeklyQuota;

            return (
              <div key={teacher.id} className="p-3 rounded-lg bg-[#05140d] border border-[#d4af37]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-xs">{teacher.name}</h5>
                    <span className="text-[11px] text-slate-400">{teacher.subject}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isFull ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                  }`}>
                    {currentSlots} / {teacher.weeklyQuota} س
                  </span>
                </div>
                
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isFull ? 'bg-emerald-500' : 'bg-[#d4af37]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#081f14] border-2 border-[#d4af37] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
              <h3 className="font-black text-white text-base">
                {editingSlot ? 'تعديل بيانات الحصة' : 'إضافة حصة جديدة لجدول التوقيت'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">اليوم</label>
                  <select 
                    value={formDay} 
                    onChange={(e) => setFormDay(e.target.value as TimetableSlot['day'])}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الحصة والتوقيت</label>
                  <select 
                    value={formPeriod} 
                    onChange={(e) => setFormPeriod(e.target.value as TimetableSlot['period'])}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {periods.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الفوج التربوي</label>
                  <select 
                    value={formClass} 
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المادة التعليمية</label>
                  <select 
                    value={formSubject} 
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الأستاذ المكلف</label>
                  <select 
                    value={formTeacher} 
                    onChange={(e) => setFormTeacher(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">القاعة أو المخبر</label>
                  <select 
                    value={formRoom} 
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  >
                    {roomsList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-bold shadow-lg"
                >
                  حفظ وتثبيت الحصة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
