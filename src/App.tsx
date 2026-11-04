import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LegislationSection } from './components/LegislationSection';
import { DocumentsSection } from './components/DocumentsSection';
import { TimetableApp } from './components/TimetableApp';
import { AbsenceRadarApp } from './components/AbsenceRadarApp';
import { ResultsAnalyzerApp } from './components/ResultsAnalyzerApp';
import { CoordinationForum } from './components/CoordinationForum';
import { DigitalizationSyncSection } from './components/DigitalizationSyncSection';
import { SupervisedInstitutesSection } from './components/SupervisedInstitutesSection';
import { EducationalCommunitySection } from './components/EducationalCommunitySection';
import { CareerPromotionSimulator } from './components/CareerPromotionSimulator';
import { DirectorAgendaSection, INITIAL_DIRECTOR_AGENDA } from './components/DirectorAgendaSection';
import { InstitutionSettingsModal } from './components/InstitutionSettingsModal';
import { 
  InstitutionProfile, 
  SectionType, 
  TimetableSlot, 
  AbsenceRecord, 
  TeacherRecord, 
  StudentScore,
  DirectorAgendaItem
} from './types';
import { 
  INITIAL_INSTITUTION, 
  INITIAL_TEACHERS, 
  INITIAL_TIMETABLE, 
  INITIAL_ABSENCES, 
  INITIAL_STUDENTS_SCORES 
} from './data/initialData';

export default function App() {
  // Navigation State
  const [currentSection, setCurrentSection] = useState<SectionType>('dashboard');

  // Persistence with localStorage
  const [institution, setInstitution] = useState<InstitutionProfile>(() => {
    const saved = localStorage.getItem('snte_institution');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTION;
  });

  const [teachers] = useState<TeacherRecord[]>(INITIAL_TEACHERS);

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('snte_timetable');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [absences, setAbsences] = useState<AbsenceRecord[]>(() => {
    const saved = localStorage.getItem('snte_absences');
    return saved ? JSON.parse(saved) : INITIAL_ABSENCES;
  });

  const [studentsScores, setStudentsScores] = useState<StudentScore[]>(() => {
    const saved = localStorage.getItem('snte_scores');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS_SCORES;
  });

  const [agendaItems, setAgendaItems] = useState<DirectorAgendaItem[]>(() => {
    const saved = localStorage.getItem('snte_director_agenda');
    return saved ? JSON.parse(saved) : INITIAL_DIRECTOR_AGENDA;
  });

  // Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [targetDocId, setTargetDocId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('snte_institution', JSON.stringify(institution));
  }, [institution]);

  useEffect(() => {
    localStorage.setItem('snte_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('snte_absences', JSON.stringify(absences));
  }, [absences]);

  useEffect(() => {
    localStorage.setItem('snte_scores', JSON.stringify(studentsScores));
  }, [studentsScores]);

  useEffect(() => {
    localStorage.setItem('snte_director_agenda', JSON.stringify(agendaItems));
  }, [agendaItems]);

  // Urgent alerts count (unjustified teacher absences requiring deduction notice)
  const urgentAlertsCount = absences.filter(a => a.type === 'teacher' && a.status === 'warning_sent').length;

  const handleOpenDocFromDashboard = (docId: string) => {
    setTargetDocId(docId);
    setCurrentSection('documents');
  };

  const activeLogoUrl = institution.logoUrl || '/assets/aistudio/image_98bcc8c9.png';

  return (
    <div className="min-h-screen bg-[#071710] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Royal Header with SNTE Emblem / Institution Logo and Algerian Colors */}
      <Header
        currentSection={currentSection}
        onSelectSection={(sec) => {
          setCurrentSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        institution={institution}
        onOpenSettings={() => setIsSettingsOpen(true)}
        urgentAlertsCount={urgentAlertsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentSection === 'dashboard' && (
          <Dashboard
            institution={institution}
            onNavigate={(sec) => {
              setCurrentSection(sec);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            absences={absences}
            timetable={timetable}
            studentsScores={studentsScores}
            teachers={teachers}
            agendaItems={agendaItems}
            onOpenDocumentGenerator={handleOpenDocFromDashboard}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentSection === 'agenda' && (
          <DirectorAgendaSection
            institution={institution}
            agendaItems={agendaItems}
            onUpdateAgenda={setAgendaItems}
          />
        )}

        {currentSection === 'legislation' && (
          <LegislationSection />
        )}

        {currentSection === 'digitalization' && (
          <DigitalizationSyncSection
            institution={institution}
            studentsScores={studentsScores}
            teachers={teachers}
            absences={absences}
            timetable={timetable}
          />
        )}

        {currentSection === 'documents' && (
          <DocumentsSection
            institution={institution}
            initialSelectedDocId={targetDocId}
            onUpdateInstitution={setInstitution}
          />
        )}

        {currentSection === 'timetable' && (
          <TimetableApp
            institution={institution}
            timetable={timetable}
            teachers={teachers}
            onUpdateTimetable={setTimetable}
          />
        )}

        {currentSection === 'absences' && (
          <AbsenceRadarApp
            institution={institution}
            absences={absences}
            teachers={teachers}
            onUpdateAbsences={setAbsences}
            onOpenDocumentGenerator={handleOpenDocFromDashboard}
          />
        )}

        {currentSection === 'results' && (
          <ResultsAnalyzerApp
            institution={institution}
            studentsScores={studentsScores}
            onUpdateStudentsScores={setStudentsScores}
            absences={absences}
          />
        )}

        {currentSection === 'institutes' && (
          <SupervisedInstitutesSection
            institution={institution}
          />
        )}

        {currentSection === 'community' && (
          <EducationalCommunitySection
            institution={institution}
          />
        )}

        {currentSection === 'career' && (
          <CareerPromotionSimulator
            institution={institution}
          />
        )}

        {currentSection === 'coordination' && (
          <CoordinationForum
            institution={institution}
          />
        )}
      </main>

      {/* Institution Customizer Modal */}
      <InstitutionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        institution={institution}
        onSave={setInstitution}
      />

      {/* Official Royal Algerian Educational Footer */}
      <footer className="mt-auto bg-[#040e0a] border-t border-[#d4af37]/30 py-8 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left/Right Logo & Identity */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#8f1414] via-[#d4af37] to-[#105e32] flex items-center justify-center bg-[#06150e]">
                <img 
                  src={activeLogoUrl} 
                  alt="SNTE Logo" 
                  className="w-10 h-10 object-contain rounded-full"
                />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  البوابة الرقمية · النقابة الوطنية لعمال التربية (SNTE 2026)
                </div>
                <div className="text-[11px] text-[#d4af37] font-semibold">
                  شعارنا الدائم: كرامة · ترقية · وحدة · عمل
                </div>
              </div>
            </div>

            {/* Quick Pillars Map */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
              <button onClick={() => setCurrentSection('dashboard')} className="hover:text-[#f5d77f] transition-colors cursor-pointer">
                الداشبورد الشامل
              </button>
              <span>·</span>
              <button onClick={() => setCurrentSection('agenda')} className="hover:text-[#f5d77f] transition-colors cursor-pointer">
                مفكرة الناظر
              </button>
              <span>·</span>
              <button onClick={() => setCurrentSection('legislation')} className="hover:text-[#f5d77f] transition-colors cursor-pointer">
                الركن التشريعي
              </button>
              <span>·</span>
              <button onClick={() => setCurrentSection('digitalization')} className="hover:text-[#f5d77f] transition-colors cursor-pointer">
                الربط مع الرقمنة
              </button>
              <span>·</span>
              <button onClick={() => setCurrentSection('documents')} className="hover:text-[#f5d77f] transition-colors cursor-pointer">
                حقيبة الوثائق
              </button>
              <span>·</span>
              <button onClick={() => setCurrentSection('community')} className="hover:text-[#f5d77f] transition-colors cursor-pointer">
                الجماعة التربوية ودليل الاتصال
              </button>
              <span>·</span>
              <button onClick={() => setCurrentSection('career')} className="hover:text-[#f5d77f] transition-colors cursor-pointer">
                محاكي الدرجات
              </button>
            </div>

            {/* Legal Reference & Status */}
            <div className="text-center md:text-left text-[11px] text-slate-400">
              <div>المطابقة: المرسوم التنفيذي 25-54 والقرار 834</div>
              <div className="text-[#d4af37]">النموذج القياسي المعتمد لمنصات مديري الدراسات 2026</div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
