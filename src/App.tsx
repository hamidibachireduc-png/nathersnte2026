/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  EducationStage,
  InstitutionInfo,
  SectionId,
  StudentRecord,
  SubjectConfig,
  AbsenceRecord,
  TeacherRecord,
  TimetableSlot,
  AgendaTask,
} from './types';
import {
  INITIAL_INSTITUTIONS_BY_STAGE,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_ABSENCES,
  INITIAL_TEACHERS,
  INITIAL_TIMETABLE,
  INITIAL_AGENDA,
  DEFAULT_EMBLEM_URL,
  STAGE_METADATA,
} from './data/initialData';
import { Header } from './components/Header';
import { InstitutionSettingsModal } from './components/InstitutionSettingsModal';
import { DashboardView } from './components/DashboardView';
import { AutomaticAveragesView } from './components/AutomaticAveragesView';
import { FlexibleAbsencesView } from './components/FlexibleAbsencesView';
import { PerformanceAnalyticsView } from './components/PerformanceAnalyticsView';
import { AgendaView } from './components/AgendaView';
import { LegislationView } from './components/LegislationView';
import { DocumentsView } from './components/DocumentsView';
import { TimetableView } from './components/TimetableView';
import {
  DigitalizationView,
  CommunityView,
  InstitutesView,
  CareerSimulatorView,
  CoordinationView,
} from './components/SecondarySectionsView';

// bumped version v2 for 3-stage schema
const STORAGE_KEYS = {
  ACTIVE_STAGE: 'snte_3stages_active_stage_2026_v2',
  INSTITUTIONS_BY_STAGE: 'snte_3stages_institutions_2026_v2',
  STUDENTS: 'snte_3stages_students_2026_v2',
  SUBJECTS: 'snte_3stages_subjects_2026_v2',
  ABSENCES: 'snte_3stages_absences_2026_v2',
  TEACHERS: 'snte_3stages_teachers_2026_v2',
  TIMETABLE: 'snte_3stages_timetable_2026_v2',
  AGENDA: 'snte_3stages_agenda_2026_v2',
};

export default function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('dashboard');

  const [activeStage, setActiveStage] = useState<EducationStage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_STAGE) as EducationStage | null;
      if (saved === 'primary' || saved === 'middle' || saved === 'secondary') {
        return saved;
      }
      return 'middle';
    } catch {
      return 'middle';
    }
  });

  const [institutionsByStage, setInstitutionsByStage] = useState<
    Record<EducationStage, InstitutionInfo>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS_BY_STAGE);
      return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS_BY_STAGE;
    } catch {
      return INITIAL_INSTITUTIONS_BY_STAGE;
    }
  });

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [subjects, setSubjects] = useState<SubjectConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [absences, setAbsences] = useState<AbsenceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ABSENCES);
      return saved ? JSON.parse(saved) : INITIAL_ABSENCES;
    } catch {
      return INITIAL_ABSENCES;
    }
  });

  const [teachers, setTeachers] = useState<TeacherRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
      return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
    } catch {
      return INITIAL_TIMETABLE;
    }
  });

  const [agendaItems, setAgendaItems] = useState<AgendaTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENDA);
      return saved ? JSON.parse(saved) : INITIAL_AGENDA;
    } catch {
      return INITIAL_AGENDA;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STAGE, activeStage);
  }, [activeStage]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.INSTITUTIONS_BY_STAGE,
      JSON.stringify(institutionsByStage)
    );
  }, [institutionsByStage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ABSENCES, JSON.stringify(absences));
  }, [absences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AGENDA, JSON.stringify(agendaItems));
  }, [agendaItems]);

  const currentInstitution = institutionsByStage[activeStage];
  const stageMeta = STAGE_METADATA[activeStage];

  const handleSaveInstitution = (updated: InstitutionInfo) => {
    setInstitutionsByStage((prev) => ({
      ...prev,
      [updated.stage]: updated,
    }));
    if (updated.stage !== activeStage) {
      setActiveStage(updated.stage);
    }
  };

  const handleSwitchStage = (newStage: EducationStage) => {
    setActiveStage(newStage);
  };

  const urgentAlertsCount = absences.filter(
    (a) =>
      a.stage === activeStage &&
      (a.status === 'unjustified' ||
        a.status === 'parent_summoned' ||
        a.status === 'warning_sent')
  ).length;

  const handleNavigate = (section: SectionId) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDocumentGenerator = (docId: string) => {
    setSelectedDocId(docId);
    setCurrentSection('documents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoSrc = currentInstitution.logoUrl || DEFAULT_EMBLEM_URL;

  return (
    <div className="min-h-screen bg-[#071710] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      <Header
        currentSection={currentSection}
        onSelectSection={handleNavigate}
        activeStage={activeStage}
        onSelectStage={handleSwitchStage}
        institution={currentInstitution}
        onUpdateInstitution={handleSaveInstitution}
        onOpenSettings={() => setIsSettingsOpen(true)}
        urgentAlertsCount={urgentAlertsCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentSection === 'dashboard' && (
          <DashboardView
            institution={currentInstitution}
            activeStage={activeStage}
            onSelectStage={handleSwitchStage}
            onNavigate={handleNavigate}
            absences={absences}
            timetable={timetable}
            students={students}
            subjects={subjects}
            teachers={teachers}
            agendaItems={agendaItems}
            onOpenDocumentGenerator={handleOpenDocumentGenerator}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentSection === 'averages' && (
          <AutomaticAveragesView
            institution={currentInstitution}
            activeStage={activeStage}
            onSelectStage={handleSwitchStage}
            students={students}
            onUpdateStudents={setStudents}
            subjects={subjects}
            onUpdateSubjects={setSubjects}
            absences={absences}
          />
        )}

        {currentSection === 'absences' && (
          <FlexibleAbsencesView
            institution={currentInstitution}
            activeStage={activeStage}
            onSelectStage={handleSwitchStage}
            absences={absences}
            onUpdateAbsences={setAbsences}
            students={students}
            onUpdateStudents={setStudents}
            subjects={subjects}
            teachers={teachers}
            onOpenDocumentGenerator={handleOpenDocumentGenerator}
          />
        )}

        {currentSection === 'analytics' && (
          <PerformanceAnalyticsView
            institution={currentInstitution}
            activeStage={activeStage}
            onSelectStage={handleSwitchStage}
            students={students}
            subjects={subjects}
            absences={absences}
          />
        )}

        {currentSection === 'agenda' && (
          <AgendaView
            institution={currentInstitution}
            agendaItems={agendaItems}
            onUpdateAgenda={setAgendaItems}
          />
        )}

        {currentSection === 'legislation' && (
          <LegislationView activeStage={activeStage} />
        )}

        {currentSection === 'digitalization' && (
          <DigitalizationView
            institution={currentInstitution}
            teachers={teachers}
            onUpdateTeachers={setTeachers}
            students={students}
            absences={absences}
          />
        )}

        {currentSection === 'documents' && (
          <DocumentsView
            institution={currentInstitution}
            initialSelectedDocId={selectedDocId}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentSection === 'timetable' && (
          <TimetableView
            institution={currentInstitution}
            timetable={timetable}
            teachers={teachers}
            onUpdateTimetable={setTimetable}
          />
        )}

        {currentSection === 'community' && (
          <CommunityView institution={currentInstitution} teachers={teachers} />
        )}

        {currentSection === 'institutes' && (
          <InstitutesView institution={currentInstitution} />
        )}

        {currentSection === 'career' && (
          <CareerSimulatorView institution={currentInstitution} />
        )}

        {currentSection === 'coordination' && (
          <CoordinationView institution={currentInstitution} />
        )}
      </main>

      <InstitutionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        institution={currentInstitution}
        onSave={handleSaveInstitution}
        onSwitchStage={handleSwitchStage}
      />

      <footer className="mt-auto bg-[#040e0a] border-t border-[#d4af37]/30 py-8 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#8f1414] via-[#d4af37] to-[#105e32] flex items-center justify-center bg-[#06150e]">
                <img
                  src={logoSrc}
                  alt="SNTE Logo"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  البوابة الرقمية لـ {stageMeta.natherTitle} · الأطوار الثلاثة (SNTE 2026)
                </div>
                <div className="text-[11px] text-[#d4af37] font-semibold">
                  الطور الحالي: {stageMeta.name} (سلم /{stageMeta.maxGradeScale}) · كرامة · ترقية · وحدة · عمل
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
              <button
                onClick={() => handleNavigate('dashboard')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                الداشبورد الشامل
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('averages')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer font-bold text-emerald-300"
              >
                الحساب التلقائي للمعدلات (/{stageMeta.maxGradeScale})
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('absences')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer font-bold text-[#f5d77f]"
              >
                متابعة غيابات التلاميذ بمرونة
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('agenda')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                مفكرة الناظر
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('legislation')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                الركن التشريعي
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('documents')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                حقيبة الوثائق
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('career')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                محاكي الدرجات
              </button>
            </div>

            <div className="text-center md:text-left text-[11px] text-slate-400">
              <div>المطابقة: المرسوم التنفيذي 25-54 والقراران 157 و171</div>
              <div className="text-[#d4af37]">
                النموذج القياسي الموحد للأطوار التعليمية الثلاثة (ابتدائي · متوسط · ثانوي)
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
