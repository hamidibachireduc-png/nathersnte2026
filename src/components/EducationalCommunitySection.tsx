import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Bell,
  Calendar,
  Printer,
  Plus,
  CheckCircle2,
  BookOpen,
  UserCheck,
  Award,
  Sparkles,
  FileCheck,
  Search,
  Clock,
  FlaskConical,
  Send,
  Phone,
  Mail,
  MapPin,
  Copy,
  Check,
  Contact,
  FileText
} from 'lucide-react';
import { InstitutionProfile, DirectoryContactItem } from '../types';

interface EducationalCommunitySectionProps {
  institution: InstitutionProfile;
}

interface CommunityNoticeItem {
  id: string;
  title: string;
  targetGroup: 'teachers' | 'parents' | 'students' | 'staff';
  priority: 'urgent' | 'important' | 'normal';
  date: string;
  author: string;
  status: 'published' | 'draft';
  acknowledgedCount: number;
  totalTargetCount: number;
  content: string;
}

interface PedagogicalTextbookAudit {
  id: string;
  classGroup: string;
  subject: string;
  teacherName: string;
  lastAuditDate: string;
  syllabusProgress: number;
  status: 'compliant' | 'delayed' | 'missing_entries';
  notes: string;
}

const INITIAL_ANNOUNCEMENTS: CommunityNoticeItem[] = [
  {
    id: 'ann-1',
    title: 'رزنامة مجالس الأقسام لنهاية الفصل الثاني 2025/2026 وضبط حجز النقاط',
    targetGroup: 'teachers',
    priority: 'urgent',
    date: '2026-03-18',
    author: 'الناظر (مدير الدراسات)',
    status: 'published',
    acknowledgedCount: 38,
    totalTargetCount: 42,
    content: 'يرجى من كافة السيدات والسادة الأساتذة إتمام عملية صب النقاط وحجز الملاحظات البيداغوجية عبر أرضية الرقمنة قبل تاريخ 22 مارس 2026 على الساعة 16:00 مساءً، مع إيداع أوراق الإجابات وأوراق التنقيط الرسمية بمكتب الناظر تحضيراً لانعقاد مجالس الأقسام.'
  },
  {
    id: 'ann-2',
    title: 'تنظيم الأبواب المفتوحة ويوم الاستقبال الفصلي لأولياء التلاميذ',
    targetGroup: 'parents',
    priority: 'important',
    date: '2026-03-16',
    author: 'الناظر بالتنسيق مع جمعية أولياء التلاميذ',
    status: 'published',
    acknowledgedCount: 410,
    totalTargetCount: 520,
    content: 'تُعلم إدارة الثانوية كافة أولياء التلاميذ أنه تقرر تنظيم لقاء تواصلي مباشر مع الأساتذة ومستشار التوجيه المدرسي يوم الخميس 26 مارس 2026 ابتداءً من الساعة 09:00 صباحاً لتسليم كشوف النقاط ومناقشة الحصيلة البيداغوجية ومشاريع التوجيه.'
  },
  {
    id: 'ann-3',
    title: 'اجتماع تنسيقي مع مندوبي الأقسام حول الانضباط والتحضير للامتحانات التجريبية',
    targetGroup: 'students',
    priority: 'normal',
    date: '2026-03-14',
    author: 'الناظر + مستشار التربية',
    status: 'published',
    acknowledgedCount: 24,
    totalTargetCount: 24,
    content: 'ندعو كافة مندوبي الأقسام (الأقسام النهائية وأقسام الجذوع المشتركة) لحضور الاجتماع الدوري بقاعة الاجتماعات يوم الثلاثاء على الساعة 13:30 لمناقشة مقترحات الأفواج التربوية بخصوص حصص المراجعة المسائية وتنظيم المكتبة.'
  },
  {
    id: 'ann-4',
    title: 'توحيد إجراءات الرقابة اليومية للغيابات ومتابعة التلاميذ المتأخرين صباحاً',
    targetGroup: 'staff',
    priority: 'urgent',
    date: '2026-03-12',
    author: 'الناظر (مدير الدراسات)',
    status: 'published',
    acknowledgedCount: 11,
    totalTargetCount: 11,
    content: 'تطبيقاً لأحكام القرار الوزاري 778 المحدث 2026، يُطلب من فريق الاستشارة التربوية والمشرفين التربويين ضبط القائمة الاسمية للتلاميذ المتكرر تأخرهم في الحصة الأولى (08:00) وإحالتها يومياً لمكتب الناظر قبل الساعة 09:30.'
  }
];

const INITIAL_DIRECTORY_CONTACTS: DirectoryContactItem[] = [
  {
    id: 'cnt-1',
    name: 'السيد كمال بن منصور',
    roleTitle: 'مدير الثانوية (رئيس المؤسسة)',
    category: 'admin_staff',
    departmentOrSubject: 'الإدارة العامة للمؤسسة',
    phone: '031-92-14-01 / 0661-20-35-10',
    email: 'direction.lycee@education.gov.dz',
    officeOrLocation: 'جناح الإدارة - مكتب المدير',
    availabilityHours: 'يومياً (08:00 - 16:30)',
    notes: 'التنسيق اليومي المباشر حول التنظيم التربوي، الجداول، ومجالس الأقسام.'
  },
  {
    id: 'cnt-2',
    name: 'السيد توفيق عيساوي',
    roleTitle: 'مستشار التربية (المسؤول عن النظام والمواظبة)',
    category: 'admin_staff',
    departmentOrSubject: 'الاستشارة التربوية والانضباط',
    phone: '0550-44-12-89',
    email: 'conseiller.ed@education.gov.dz',
    officeOrLocation: 'مكتب الاستشارة التربوية (الطابق الأرضي)',
    availabilityHours: 'الأحد إلى الخميس (07:45 - 16:30)',
    notes: 'ربط مباشر مع مكتب الناظر بخصوص غيابات التلاميذ والأساتذة وحركة الأفواج.'
  },
  {
    id: 'cnt-3',
    name: 'الأستاذة سهام بوعلام',
    roleTitle: 'مستشارة التوجيه والإرشاد المدرسي والمهني',
    category: 'admin_staff',
    departmentOrSubject: 'مكتب التوجيه والإرشاد المدرسي',
    phone: '0771-88-30-42',
    email: 'orientation.lycee@education.gov.dz',
    officeOrLocation: 'مكتب التوجيه المدرسي (الطابق الأول)',
    availabilityHours: 'الأحد، الإثنين، الأربعاء، الخميس (08:30 - 15:30)',
    notes: 'التنسيق في تحليل النتائج الفصلية، رغبات التوجيه، ومرافقة التلاميذ المتعثرين.'
  },
  {
    id: 'cnt-4',
    name: 'السيد رشيد قندوز',
    roleTitle: 'المقتصد / المسير المالي للمؤسسة',
    category: 'admin_staff',
    departmentOrSubject: 'المصالح الاقتصادية والمالية',
    phone: '031-92-14-05 / 0662-11-45-90',
    email: 'intendance.lycee@education.gov.dz',
    officeOrLocation: 'جناح المصالح الاقتصادية',
    availabilityHours: 'يومياً (08:00 - 16:00)',
    notes: 'التنسيق بخصوص الوسائل البيداغوجية، الطبع، تجهيز المخابر، والكتاب المدرسي.'
  },
  {
    id: 'cnt-5',
    name: 'الأستاذ عبد الحكيم مرابطي',
    roleTitle: 'أستاذ مكون - منسق مادة الرياضيات والأستاذ الرئيسي لـ 3 ع ت 1',
    category: 'coordinators',
    departmentOrSubject: 'مادة الرياضيات',
    phone: '0663-51-28-74',
    email: 'h.merabti.math@education.dz',
    officeOrLocation: 'قاعة الأساتذة / قاعة الاجتماعات البيداغوجية',
    availabilityHours: 'الأحد (10:00-12:00) · الثلاثاء (14:00-16:00)',
    notes: 'مسؤول التنسيق البيداغوجي لمواضيع البكالوريا التجريبية وأفواج الدعم.'
  },
  {
    id: 'cnt-6',
    name: 'الأستاذة نسرين شريفي',
    roleTitle: 'أستاذة رئيسية - منسقة مادة العلوم الفيزيائية والمخابر',
    category: 'coordinators',
    departmentOrSubject: 'العلوم الفيزيائية والتجارب المخبرية',
    phone: '0554-79-61-03',
    email: 'n.cherifi.phys@education.dz',
    officeOrLocation: 'مخبر الفيزياء رقم 01',
    availabilityHours: 'الإثنين (09:00-11:00) · الأربعاء (10:00-12:00)',
    notes: 'الإشراف على جدولة الأعمال المخبرية وجاهزية الوسائل العلمية.'
  },
  {
    id: 'cnt-7',
    name: 'السيد الحاج محمود زروقي',
    roleTitle: 'رئيس جمعية أولياء التلاميذ المعتمدة بالثانوية',
    category: 'parents_students',
    departmentOrSubject: 'تمثيل أولياء التلاميذ',
    phone: '0661-90-14-22',
    email: 'ape.lycee@gmail.com',
    officeOrLocation: 'قاعة الاستقبال الشرفية (كل خميس صباحاً)',
    availabilityHours: 'الخميس (09:00 - 12:00) وعند الاستدعاء',
    notes: 'شريك اجتماعي في مجالس الأقسام، الأبواب المفتوحة، ومرافقة الحالات الاجتماعية.'
  },
  {
    id: 'cnt-8',
    name: 'السيد مفتش التربية الوطنية لإدارة الثانويات',
    roleTitle: 'مفتش التربية الوطنية (تخصص إدارة وتسيير الثانويات)',
    category: 'external_authorities',
    departmentOrSubject: 'المفتشية العامة للتربية الوطنية - المقاطعة الإدارية',
    phone: '031-94-00-18',
    email: 'inspection.admin@education.gov.dz',
    officeOrLocation: 'مقر مفتشية التربية الوطنية / مديرية التربية',
    availabilityHours: 'أيام الاستقبال الرسمي والندوات التربوية',
    notes: 'المرجع التفتيشي المباشر لتأشير التنظيم التربوي، جداول التوقيت، وتقييم الناظر.'
  },
  {
    id: 'cnt-9',
    name: 'مصلحة التمدرس والامتحانات - مديرية التربية',
    roleTitle: 'رئيس مصلحة التمدرس والامتحانات المدرسية',
    category: 'external_authorities',
    departmentOrSubject: 'مديرية التربية للولاية',
    phone: '031-91-22-40',
    email: 'scolarite.de@education.gov.dz',
    officeOrLocation: 'مقر مديرية التربية - الطابق الثاني',
    availabilityHours: 'الأحد إلى الخميس (08:30 - 16:00)',
    notes: 'متابعة الخريطة التربوية، ملفات البكالوريا، والرقمنة المركزية.'
  },
  {
    id: 'cnt-10',
    name: 'وحدة الكشف والمتابعة الصحية (UDS)',
    roleTitle: 'الطبيب الرئيسي لوحدة الصحة المدرسية',
    category: 'external_authorities',
    departmentOrSubject: 'الصحة المدرسية والإعفاءات الطبية',
    phone: '031-95-11-70',
    email: 'uds.sante@education.dz',
    officeOrLocation: 'وحدة الكشف والمتابعة الملحقة بالمقاطعة',
    availabilityHours: 'الأحد إلى الخميس (08:30 - 15:00)',
    notes: 'المصادقة على ملفات الإعفاء من التربية البدنية والمتابعة الصحية للتلاميذ.'
  }
];

const INITIAL_RECEPTION_SCHEDULE = [
  { id: 'rec-1', day: 'الأحد', timeSlot: '09:00 - 11:00', entity: 'الناظر (مدير الدراسات)', subject: 'استقبال الأولياء بخصوص التمدرس، التوجيه، والنتائج الفصلية', room: 'مكتب الناظر' },
  { id: 'rec-2', day: 'الأحد', timeSlot: '10:00 - 12:00', entity: 'أساتذة الرياضيات والعلوم الفيزيائية', subject: 'استقبال أولياء تلاميذ الأقسام النهائية والجذوع المشتركة', room: 'قاعة الأساتذة / القاعة الشرفية' },
  { id: 'rec-3', day: 'الإثنين', timeSlot: '09:00 - 11:30', entity: 'مستشار التوجيه والإرشاد المدرسي', subject: 'مرافقة التلاميذ والأولياء في رغبات التوجيه والشعب', room: 'مكتب التوجيه' },
  { id: 'rec-4', day: 'الثلاثاء', timeSlot: '09:30 - 11:30', entity: 'أساتذة العلوم الطبيعية واللغات', subject: 'متابعة التحصيل الدراسي والمراقبة المستمرة', room: 'قاعة الأساتذة' },
  { id: 'rec-5', day: 'الأربعاء', timeSlot: '10:00 - 12:00', entity: 'مستشار التربية + مكتب الغيابات', subject: 'تسوية مبررات الغياب والانضباط والمواظبة', room: 'مكتب الاستشارة التربوية' },
  { id: 'rec-6', day: 'الخميس', timeSlot: '09:00 - 11:30', entity: 'الناظر + رئيس جمعية أولياء التلاميذ', subject: 'جلسة تنسيق أسبوعية مفتوحة لانشغالات الأولياء', room: 'قاعة الاجتماعات' },
];

const INITIAL_TEXTBOOK_AUDITS: PedagogicalTextbookAudit[] = [
  { id: 'tb-1', classGroup: '3 ع ت 1', subject: 'الرياضيات', teacherName: 'أ. بن عيسى كمال', lastAuditDate: '2026-03-15', syllabusProgress: 78, status: 'compliant', notes: 'تدوين دقيق للعناوين، التمارين، وفرض الفصل الثاني مرفق بالتصحيح النموذجي.' },
  { id: 'tb-2', classGroup: '3 ع ت 1', subject: 'العلوم الفيزيائية', teacherName: 'أ. مرابط سليم', lastAuditDate: '2026-03-15', syllabusProgress: 74, status: 'compliant', notes: 'الأعمال المخبرية مدونة بانتظام مع ترقيم البطاقات الفنية للتجارب.' },
  { id: 'tb-3', classGroup: '3 ع ت 2', subject: 'علوم الطبيعة والحياة', teacherName: 'أ. بوزيد سعاد', lastAuditDate: '2026-03-14', syllabusProgress: 76, status: 'compliant', notes: 'تطابق تام مع التدرج السنوي المفتشي 2025/2026.' },
  { id: 'tb-4', classGroup: '2 ت ر 1', subject: 'الهندسة الميكانيكية', teacherName: 'أ. قاسمي مراد', lastAuditDate: '2026-03-13', syllabusProgress: 65, status: 'delayed', notes: 'تأخر بحصتين بسبب عطلة مرضية مبررة؛ تم برمجة حصتي استدراك يوم الثلاثاء.' },
  { id: 'tb-5', classGroup: '1 ج م ع 2', subject: 'اللغة العربية', teacherName: 'أ. شريفي نادية', lastAuditDate: '2026-03-12', syllabusProgress: 81, status: 'compliant', notes: 'دفتر النصوص منظم ومؤشر بانتظام.' },
  { id: 'tb-6', classGroup: '3 آ ف 1', subject: 'الفلسفة', teacherName: 'أ. منصوري عبد الحق', lastAuditDate: '2026-03-10', syllabusProgress: 68, status: 'missing_entries', notes: 'يرجى استكمال تدوين موضوع الفرض المحروس الثاني وسلم التنقيط في الخانة المخصصة.' },
];

export const EducationalCommunitySection: React.FC<EducationalCommunitySectionProps> = ({ institution }) => {
  const [activeSubTab, setActiveSubTab] = useState<'announcements' | 'directory' | 'reception' | 'pedagogical_control'>('directory');
  const [announcements, setAnnouncements] = useState<CommunityNoticeItem[]>(INITIAL_ANNOUNCEMENTS);
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Contact Directory State
  const [contacts, setContacts] = useState<DirectoryContactItem[]>(INITIAL_DIRECTORY_CONTACTS);
  const [directoryCategory, setDirectoryCategory] = useState<string>('all');
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [activeConvocationContact, setActiveConvocationContact] = useState<DirectoryContactItem | null>(null);
  const [convocationSubject, setConvocationSubject] = useState('دعوة لحضور جلسة تنسيق بيداغوجي بمكتب الناظر');
  const [convocationBody, setConvocationBody] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Contact Form State
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactCategory, setNewContactCategory] = useState<DirectoryContactItem['category']>('coordinators');
  const [newContactDept, setNewContactDept] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactOffice, setNewContactOffice] = useState('');
  const [newContactHours, setNewContactHours] = useState('الأحد - الخميس (08:30 - 15:30)');

  // New announcement modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState<CommunityNoticeItem['targetGroup']>('teachers');
  const [newPriority, setNewPriority] = useState<CommunityNoticeItem['priority']>('important');
  const [newContent, setNewContent] = useState('');

  // Print preview announcement
  const [printableNotice, setPrintableNotice] = useState<CommunityNoticeItem | null>(null);

  // Textbook & Lab Audits
  const [audits, setAudits] = useState<PedagogicalTextbookAudit[]>(INITIAL_TEXTBOOK_AUDITS);
  const [newAuditClass, setNewAuditClass] = useState('3 ع ت 1');
  const [newAuditSubject, setNewAuditSubject] = useState('');
  const [newAuditTeacher, setNewAuditTeacher] = useState('');
  const [newAuditProgress, setNewAuditProgress] = useState(75);
  const [newAuditStatus, setNewAuditStatus] = useState<PedagogicalTextbookAudit['status']>('compliant');
  const [newAuditNotes, setNewAuditNotes] = useState('');

  const activeLogoUrl = institution.logoUrl || '/assets/aistudio/image_98bcc8c9.png';

  const filteredAnnouncements = announcements.filter(a => {
    const matchesTarget = selectedTarget === 'all' || a.targetGroup === selectedTarget;
    const matchesSearch = a.title.includes(searchQuery) || a.content.includes(searchQuery);
    return matchesTarget && matchesSearch;
  });

  const filteredContacts = contacts.filter(c => {
    const matchesCat = directoryCategory === 'all' || c.category === directoryCategory;
    const q = directorySearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.roleTitle.toLowerCase().includes(q) ||
      c.departmentOrSubject.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenConvocation = (contact: DirectoryContactItem) => {
    setActiveConvocationContact(contact);
    setConvocationSubject(`دعوة تنسيق ومرافقة بيداغوجية — ${contact.departmentOrSubject}`);
    setConvocationBody(
      `يشرفني نحن ناظر الدراسات بـ ${institution.schoolName} (${institution.wilaya})، دعوة ${contact.name} (${contact.roleTitle}) لحضور جلسة التنسيق والتشاور البيداغوجي المبرمجة بمكتب الناظر، وذلك لدراسة النقاط المرتبطة بـ (${contact.departmentOrSubject}) وضبط الترتيبات التنظيمية للفصل الدراسي ${institution.currentTerm}.\n\nنشكر لكم سلفاً تعاونكم الدائم خدمةً لمصلحة التلاميذ والجماعة التربوية.`
    );
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactRole.trim()) return;
    const created: DirectoryContactItem = {
      id: `cnt-${Date.now()}`,
      name: newContactName.trim(),
      roleTitle: newContactRole.trim(),
      category: newContactCategory,
      departmentOrSubject: newContactDept.trim() || 'التنسيق التربوي',
      phone: newContactPhone.trim() || 'غير مدرج',
      email: newContactEmail.trim() || 'contact@education.gov.dz',
      officeOrLocation: newContactOffice.trim() || 'مقر المؤسسة',
      availabilityHours: newContactHours.trim()
    };
    setContacts([created, ...contacts]);
    setNewContactName('');
    setNewContactRole('');
    setNewContactDept('');
    setNewContactPhone('');
    setNewContactEmail('');
    setShowAddContactModal(false);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const targetTotals: Record<CommunityNoticeItem['targetGroup'], number> = {
      teachers: 42,
      parents: 520,
      students: 24,
      staff: 11
    };

    const created: CommunityNoticeItem = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      targetGroup: newTarget,
      priority: newPriority,
      date: new Date().toISOString().split('T')[0],
      author: `الناظر (${institution.directorOfStudies})`,
      status: 'published',
      acknowledgedCount: 1,
      totalTargetCount: targetTotals[newTarget],
      content: newContent.trim()
    };

    setAnnouncements([created, ...announcements]);
    setNewTitle('');
    setNewContent('');
    setShowNewModal(false);
  };

  const handleAddAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditSubject.trim() || !newAuditTeacher.trim()) return;
    const created: PedagogicalTextbookAudit = {
      id: `tb-${Date.now()}`,
      classGroup: newAuditClass,
      subject: newAuditSubject.trim(),
      teacherName: newAuditTeacher.trim(),
      lastAuditDate: new Date().toISOString().split('T')[0],
      syllabusProgress: newAuditProgress,
      status: newAuditStatus,
      notes: newAuditNotes.trim() || 'تمت المراقبة والتأشير من طرف الناظر.'
    };
    setAudits([created, ...audits]);
    setNewAuditSubject('');
    setNewAuditTeacher('');
    setNewAuditNotes('');
  };

  const getTargetLabel = (t: CommunityNoticeItem['targetGroup']) => {
    switch (t) {
      case 'teachers': return 'هيئة التدريس والمنسقون';
      case 'parents': return 'أولياء التلاميذ وجمعية الأولياء';
      case 'students': return 'التلاميذ ومندوبو الأقسام';
      case 'staff': return 'الطاقم الإداري والتربوي';
    }
  };

  const getTargetBadgeStyle = (t: CommunityNoticeItem['targetGroup']) => {
    switch (t) {
      case 'teachers': return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'parents': return 'bg-amber-950 text-amber-300 border-amber-700';
      case 'students': return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'staff': return 'bg-rose-950 text-rose-300 border-rose-700';
    }
  };

  const getContactCategoryLabel = (cat: DirectoryContactItem['category']) => {
    switch (cat) {
      case 'admin_staff': return 'الطاقم الإداري والتربوي بالمؤسسة';
      case 'coordinators': return 'الأساتذة المنسقون والرئيسيون';
      case 'parents_students': return 'ممثلو الأولياء والتلاميذ';
      case 'external_authorities': return 'الهيئات التفتيشية والمصالح الوصية';
    }
  };

  const getContactCategoryBadge = (cat: DirectoryContactItem['category']) => {
    switch (cat) {
      case 'admin_staff': return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'coordinators': return 'bg-amber-950 text-amber-300 border-amber-700';
      case 'parents_students': return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'external_authorities': return 'bg-rose-950 text-rose-300 border-rose-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Royal Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-[#105e32]/40 border border-[#d4af37]/50 p-3.5 rounded-2xl">
              <Users className="w-8 h-8 text-[#f5d77f]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#d4af37] text-[#081a12] text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  القرار الوزاري 778 المحدث 2026
                </span>
                <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-700">
                  دليل الاتصال والتواصل التربوي الشامل
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                فضاء الجماعة التربوية، دليل الاتصال الخاص بالناظر والرقابة البيداغوجية
              </h2>
              <p className="text-slate-300 text-xs mt-1 max-w-3xl leading-relaxed">
                منظومة متكاملة تشمل دليل الاتصال والتواصل المهني الخاص بالناظر، المذكرات الداخلية، جدول الاستقبال الأسبوعي للأولياء، ومراقبة دفاتر النصوص.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddContactModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg font-bold text-xs bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] border border-[#d4af37]/40 transition-all shadow-md cursor-pointer"
            >
              <Contact className="w-4 h-4" />
              <span>إضافة جهة اتصال للدليل</span>
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-black text-xs bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إصدار إعلان للجماعة التربوية</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-[#d4af37]/20">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'directory'
                ? 'bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white border border-[#f5d77f]/50 shadow-md'
                : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
            }`}
          >
            <Contact className="w-4 h-4" />
            <span>دليل الاتصال والتواصل الخاص بالناظر ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('announcements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'announcements'
                ? 'bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white border border-[#f5d77f]/50 shadow-md'
                : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>المذكرات والإعلانات الموجهة للجماعة التربوية</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reception')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'reception'
                ? 'bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white border border-[#f5d77f]/50 shadow-md'
                : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>جدول الاستقبال الأسبوعي لأولياء التلاميذ</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pedagogical_control')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'pedagogical_control'
                ? 'bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white border border-[#f5d77f]/50 shadow-md'
                : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>مراقبة دفاتر النصوص وتقدم البرامج</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 0: DIRECTOR'S CONTACT & COMMUNICATION DIRECTORY (دليل الاتصال والتواصل الخاص بالناظر) */}
      {activeSubTab === 'directory' && (
        <div className="space-y-5">
          {/* Search & Category Filter */}
          <div className="bg-[#081a12] p-4 rounded-xl border border-[#d4af37]/30 flex flex-col lg:flex-row gap-3 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-[#d4af37] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder="ابحث بالاسم، الصفة، المادة، أو رقم الهاتف..."
                className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
              {[
                { id: 'all', label: `كل جهات الاتصال (${contacts.length})` },
                { id: 'admin_staff', label: 'الطاقم الإداري والتربوي' },
                { id: 'coordinators', label: 'الأساتذة المنسقون والرئيسيون' },
                { id: 'parents_students', label: 'جمعية الأولياء والمندوبون' },
                { id: 'external_authorities', label: 'المفتشية ومديرية التربية' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDirectoryCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    directoryCategory === tab.id
                      ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/50'
                      : 'bg-[#05140d] text-slate-300 hover:text-white border border-[#d4af37]/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 hover:border-[#d4af37] p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
                    <div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${getContactCategoryBadge(contact.category)}`}>
                        {getContactCategoryLabel(contact.category)}
                      </span>
                      <h3 className="text-base font-black text-white mt-1.5">{contact.name}</h3>
                      <p className="text-xs font-bold text-[#d4af37]">{contact.roleTitle}</p>
                    </div>
                    <span className="text-[11px] bg-[#05140d] text-emerald-300 px-2.5 py-1 rounded border border-emerald-800/60 font-semibold">
                      {contact.departmentOrSubject}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-mono text-white truncate" dir="ltr">{contact.phone}</span>
                      </div>
                      <button
                        onClick={() => handleCopyText(`${contact.id}-phone`, contact.phone)}
                        className="text-slate-400 hover:text-[#f5d77f] p-1 cursor-pointer"
                        title="نسخ رقم الهاتف"
                      >
                        {copiedId === `${contact.id}-phone` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Mail className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        <span className="font-mono text-slate-200 truncate text-[11px]">{contact.email}</span>
                      </div>
                      <button
                        onClick={() => handleCopyText(`${contact.id}-email`, contact.email)}
                        className="text-slate-400 hover:text-[#f5d77f] p-1 cursor-pointer"
                        title="نسخ البريد الإلكتروني"
                      >
                        {copiedId === `${contact.id}-email` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      {contact.officeOrLocation}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Clock className="w-3.5 h-3.5" />
                      {contact.availabilityHours}
                    </span>
                  </div>

                  {contact.notes && (
                    <p className="text-[11px] text-slate-400 bg-[#05140d]/60 p-2.5 rounded border border-slate-800">
                      ملاحظة التنسيق: {contact.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${contact.phone.split('/')[0].trim()}`}
                      className="px-2.5 py-1.5 rounded-lg bg-[#05140d] hover:bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>اتصال هاتفي</span>
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="px-2.5 py-1.5 rounded-lg bg-[#05140d] hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>مراسلة بريدية</span>
                    </a>
                  </div>

                  <button
                    onClick={() => handleOpenConvocation(contact)}
                    className="px-3 py-1.5 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-white border border-[#f5d77f]/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#f5d77f]" />
                    <span>استدعاء / مراسلة رسمية A4</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 1: Community Announcements */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-5">
          {/* Stats Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setSelectedTarget(selectedTarget === 'teachers' ? 'all' : 'teachers')}
              className={`bg-[#081a12] p-4 rounded-xl border transition-all cursor-pointer ${
                selectedTarget === 'teachers' ? 'border-emerald-400 bg-emerald-950/40' : 'border-[#d4af37]/30 hover:border-[#d4af37]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400">هيئة التدريس والمنسقون</span>
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-white">42 أستاذاً</div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">نسبة الاطلاع على المذكرات: 94%</p>
            </div>

            <div
              onClick={() => setSelectedTarget(selectedTarget === 'parents' ? 'all' : 'parents')}
              className={`bg-[#081a12] p-4 rounded-xl border transition-all cursor-pointer ${
                selectedTarget === 'parents' ? 'border-[#d4af37] bg-amber-950/30' : 'border-[#d4af37]/30 hover:border-[#d4af37]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400">أولياء التلاميذ والجمعية</span>
                <Users className="w-5 h-5 text-[#f5d77f]" />
              </div>
              <div className="text-xl font-black text-white">520 ولي أمر</div>
              <p className="text-[11px] text-[#f5d77f] font-semibold mt-1">مربوطون عبر فضاء أولياء التلاميذ</p>
            </div>

            <div
              onClick={() => setSelectedTarget(selectedTarget === 'students' ? 'all' : 'students')}
              className={`bg-[#081a12] p-4 rounded-xl border transition-all cursor-pointer ${
                selectedTarget === 'students' ? 'border-blue-400 bg-blue-950/30' : 'border-[#d4af37]/30 hover:border-[#d4af37]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400">مندوبو الأقسام التربوية</span>
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-xl font-black text-white">24 مندوب قسم</div>
              <p className="text-[11px] text-blue-400 font-semibold mt-1">ممثلون في مجالس الأقسام</p>
            </div>

            <div
              onClick={() => setSelectedTarget(selectedTarget === 'staff' ? 'all' : 'staff')}
              className={`bg-[#081a12] p-4 rounded-xl border transition-all cursor-pointer ${
                selectedTarget === 'staff' ? 'border-rose-400 bg-rose-950/30' : 'border-[#d4af37]/30 hover:border-[#d4af37]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400">الطاقم التربوي والتوجيه</span>
                <Sparkles className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-xl font-black text-white">11 مؤطراً</div>
              <p className="text-[11px] text-rose-400 font-semibold mt-1">الاستشارة، التوجيه، والمخابر</p>
            </div>
          </div>

          {/* Announcements List */}
          <div className="space-y-4">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="bg-[#081a12] rounded-xl border border-[#d4af37]/30 p-5 shadow-lg hover:border-[#d4af37] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${getTargetBadgeStyle(item.targetGroup)}`}>
                      {getTargetLabel(item.targetGroup)}
                    </span>
                    {item.priority === 'urgent' && (
                      <span className="bg-[#8f1414] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#f5d77f]/30">
                        <Bell className="w-3 h-3" />
                        مستعجل وأولوية قصوى
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      {item.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
                      اطلع عليها: {item.acknowledgedCount} / {item.totalTargetCount}
                    </span>
                    <button
                      onClick={() => setPrintableNotice(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d2818] hover:bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة المذكرة الرسمية (A4)</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-black text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#05140d] p-3.5 rounded-lg border border-[#d4af37]/20">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Weekly Parent Reception Schedule */}
      {activeSubTab === 'reception' && (
        <div className="bg-[#081a12] rounded-xl border border-[#d4af37]/30 shadow-xl overflow-hidden">
          <div className="p-5 bg-[#05140d] border-b border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-base text-[#f5d77f] flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>جدول الاستقبال الأسبوعي الرسمي لأولياء التلاميذ ({institution.schoolYear})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                منظم ومؤشر من طرف الناظر ومدير المؤسسة لضمان التواصل المنتظم بين الأسرة والمدرسة
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-black text-xs hover:scale-105 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة جدول الاستقبال للتعليق والرقمنة</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#030e08] text-[#f5d77f] border-b border-[#d4af37]/30 text-xs font-black">
                  <th className="py-3.5 px-4">اليوم</th>
                  <th className="py-3.5 px-4">الفترة الزمنية</th>
                  <th className="py-3.5 px-4">الهيئة المستقبلة</th>
                  <th className="py-3.5 px-4">موضوع الاستقبال والمرافقة</th>
                  <th className="py-3.5 px-4">المكتب / القاعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15 text-xs">
                {INITIAL_RECEPTION_SCHEDULE.map((row) => (
                  <tr key={row.id} className="hover:bg-[#0c2419]/40">
                    <td className="py-3.5 px-4 font-black text-white">{row.day}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#f5d77f]">{row.timeSlot}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-300">{row.entity}</td>
                    <td className="py-3.5 px-4 text-slate-300">{row.subject}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#05140d] text-slate-200 font-bold px-2.5 py-1 rounded border border-[#d4af37]/20">
                        {row.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Pedagogical Control of Textbooks & Syllabus Progress */}
      {activeSubTab === 'pedagogical_control' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Add new textbook audit */}
          <div className="bg-[#081a12] rounded-xl border border-[#d4af37]/30 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#d4af37]/20">
              <FileCheck className="w-5 h-5 text-[#f5d77f]" />
              <h3 className="font-black text-sm text-white">
                تأشير ومراقبة دفتر نصوص جديد
              </h3>
            </div>
            <form onSubmit={handleAddAudit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">القسم التربوي</label>
                <select
                  value={newAuditClass}
                  onChange={(e) => setNewAuditClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#d4af37]/40 bg-[#05140d] text-white font-bold"
                >
                  <option value="3 ع ت 1">3 علوم تجريبية 1</option>
                  <option value="3 ع ت 2">3 علوم تجريبية 2</option>
                  <option value="3 ت ر 1">3 تقني رياضي 1</option>
                  <option value="3 آ ف 1">3 آداب وفلسفة 1</option>
                  <option value="2 ع ت 1">2 علوم تجريبية 1</option>
                  <option value="1 ج م ع 1">1 جذع مشترك علوم 1</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">المادة التعليمية</label>
                <input
                  type="text"
                  value={newAuditSubject}
                  onChange={(e) => setNewAuditSubject(e.target.value)}
                  placeholder="مثال: العلوم الفيزيائية"
                  className="w-full px-3 py-2 rounded-lg border border-[#d4af37]/40 bg-[#05140d] text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">اسم الأستاذ(ة)</label>
                <input
                  type="text"
                  value={newAuditTeacher}
                  onChange={(e) => setNewAuditTeacher(e.target.value)}
                  placeholder="مثال: أ. بن يحيى كريم"
                  className="w-full px-3 py-2 rounded-lg border border-[#d4af37]/40 bg-[#05140d] text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  نسبة التقدم في التدرج السنوي: <span className="text-emerald-400 font-black">{newAuditProgress}%</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={newAuditProgress}
                  onChange={(e) => setNewAuditProgress(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">حالة المطابقة البيداغوجية</label>
                <select
                  value={newAuditStatus}
                  onChange={(e) => setNewAuditStatus(e.target.value as PedagogicalTextbookAudit['status'])}
                  className="w-full px-3 py-2 rounded-lg border border-[#d4af37]/40 bg-[#05140d] text-white font-bold"
                >
                  <option value="compliant">مطابق ومؤشر بانتظام</option>
                  <option value="delayed">تأخر في التدرج يستوجب استدراكاً</option>
                  <option value="missing_entries">نقص في تدوين البيانات / الفروض</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">ملاحظات وتوجيهات الناظر</label>
                <textarea
                  rows={2}
                  value={newAuditNotes}
                  onChange={(e) => setNewAuditNotes(e.target.value)}
                  placeholder="توصيات الناظر المدونة على دفتر النصوص..."
                  className="w-full px-3 py-2 rounded-lg border border-[#d4af37]/40 bg-[#05140d] text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] border border-[#d4af37]/40 font-black transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تسجيل التأشيرة البيداغوجية للناظر</span>
              </button>
            </form>
          </div>

          {/* Right column: Audits Table */}
          <div className="lg:col-span-2 bg-[#081a12] rounded-xl border border-[#d4af37]/30 shadow-xl overflow-hidden">
            <div className="p-4 bg-[#05140d] border-b border-[#d4af37]/30 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#f5d77f]" />
                <h3 className="font-black text-sm">
                  سجل الرقابة البيداغوجية لدفاتر النصوص وتنفيذ التدرجات السنوية (2026)
                </h3>
              </div>
              <span className="text-[11px] bg-[#105e32] text-[#f5d77f] px-2.5 py-1 rounded border border-[#d4af37]/30 font-bold">
                إشراف مباشر للناظر
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#030e08] border-b border-[#d4af37]/30 text-[11px] font-black text-[#f5d77f]">
                    <th className="py-3 px-3.5">القسم والمادة</th>
                    <th className="py-3 px-3.5">الأستاذ(ة)</th>
                    <th className="py-3 px-3.5">تقدم البرنامج</th>
                    <th className="py-3 px-3.5">الوضعية</th>
                    <th className="py-3 px-3.5">ملاحظات وتأشيرة الناظر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/15 text-xs">
                  {audits.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#0c2419]/40">
                      <td className="py-3 px-3.5">
                        <div className="font-black text-white">{rec.subject}</div>
                        <div className="text-[11px] text-emerald-400 font-bold">{rec.classGroup}</div>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-200">
                        <div>{rec.teacherName}</div>
                        <div className="text-[10px] text-slate-400">{rec.lastAuditDate}</div>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                rec.syllabusProgress >= 72
                                  ? 'bg-emerald-500'
                                  : rec.syllabusProgress >= 65
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${rec.syllabusProgress}%` }}
                            />
                          </div>
                          <span className="font-black text-white">{rec.syllabusProgress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        {rec.status === 'compliant' && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                            مطابق ومؤشر
                          </span>
                        )}
                        {rec.status === 'delayed' && (
                          <span className="bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                            تأخر مبرمج للاستدراك
                          </span>
                        )}
                        {rec.status === 'missing_entries' && (
                          <span className="bg-rose-950 text-rose-300 border border-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                            استكمال البيانات
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-slate-300 max-w-xs">
                        {rec.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Contact to Director's Directory */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#081a12] rounded-2xl max-w-lg w-full shadow-2xl border-2 border-[#d4af37] overflow-hidden">
            <div className="bg-[#05140d] border-b border-[#d4af37]/30 text-white p-4 flex items-center justify-between">
              <h3 className="font-black text-sm text-[#f5d77f] flex items-center gap-2">
                <Contact className="w-4 h-4" />
                <span>إضافة جهة اتصال جديدة لدليل الناظر</span>
              </h3>
              <button onClick={() => setShowAddContactModal(false)} className="text-slate-300 hover:text-white text-xs font-bold cursor-pointer">
                إغلاق
              </button>
            </div>
            <form onSubmit={handleAddContact} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الاسم واللقب / الهيئة</label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="مثال: الأستاذ كريم بن يحيى"
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الصفة أو الوظيفة</label>
                  <input
                    type="text"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    placeholder="مثال: منسق مادة العلوم الطبيعية"
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">المجموعة</label>
                  <select
                    value={newContactCategory}
                    onChange={(e) => setNewContactCategory(e.target.value as DirectoryContactItem['category'])}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                  >
                    <option value="admin_staff">الطاقم الإداري والتربوي</option>
                    <option value="coordinators">الأساتذة المنسقون والرئيسيون</option>
                    <option value="parents_students">ممثلو الأولياء والتلاميذ</option>
                    <option value="external_authorities">الهيئات التفتيشية والوصية</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">المصلحة / المادة</label>
                  <input
                    type="text"
                    value={newContactDept}
                    onChange={(e) => setNewContactDept(e.target.value)}
                    placeholder="مثال: مخبر العلوم الطبيعية"
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">رقم الهاتف المهني</label>
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="0661-00-00-00"
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="name@education.gov.dz"
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">المكتب أو المقر</label>
                  <input
                    type="text"
                    value={newContactOffice}
                    onChange={(e) => setNewContactOffice(e.target.value)}
                    placeholder="مثال: الطابق الأول - قاعة الأساتذة"
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">أوقات الاستقبال والتنسيق</label>
                  <input
                    type="text"
                    value={newContactHours}
                    onChange={(e) => setNewContactHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40 font-black cursor-pointer"
                >
                  إدراج في دليل الاتصال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Official Convocation / Letter Modal from Contact Directory */}
      {activeConvocationContact && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#081a12] rounded-2xl max-w-3xl w-full p-6 shadow-2xl border-2 border-[#d4af37] my-8 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#d4af37]/30 no-print">
              <div>
                <h4 className="font-black text-white text-sm">
                  تحرير استدعاء / مراسلة تنسيق رسمية إلى: {activeConvocationContact.name}
                </h4>
                <p className="text-xs text-[#d4af37]">{activeConvocationContact.roleTitle}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-[#8f1414] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة رسمية (A4)</span>
                </button>
                <button
                  onClick={() => setActiveConvocationContact(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="no-print space-y-2 text-xs">
              <label className="block text-slate-300 font-bold">مضمون الاستدعاء / المراسلة (قابل للتعديل الفوري):</label>
              <textarea
                rows={3}
                value={convocationBody}
                onChange={(e) => setConvocationBody(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
              />
            </div>

            <div className="printable-document bg-white border-2 border-slate-900 p-8 text-slate-900 rounded-xl space-y-6">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <p className="font-black text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                <p className="font-black text-sm">وزارة التربية الوطنية</p>
                <div className="flex items-center justify-between text-xs font-bold pt-3">
                  <div className="text-right">
                    <p>مديرية التربية لـ: {institution.wilaya}</p>
                    <p>{institution.schoolName}</p>
                    <p>مكتب الناظر (مدير الدراسات)</p>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img src={activeLogoUrl} alt="شعار المؤسسة" className="w-14 h-14 object-contain" />
                  </div>
                  <div className="text-left">
                    <p>السنة الدراسية: {institution.schoolYear}</p>
                    <p>التاريخ: {new Date().toLocaleDateString('ar-DZ')}</p>
                  </div>
                </div>
              </div>

              <div className="text-center py-2">
                <span className="inline-block border-2 border-slate-900 px-6 py-2 font-black text-base bg-slate-50">
                  استدعاء / مراسلة تنسيق بيداغوجي وإداري
                </span>
              </div>

              <div className="text-xs font-bold bg-slate-50 p-3 rounded border border-slate-300 space-y-1">
                <div>من ناظر الثانوية (مدير الدراسات): {institution.directorOfStudies}</div>
                <div>إلى السيد(ة): {activeConvocationContact.name} — {activeConvocationContact.roleTitle}</div>
              </div>

              <div>
                <h2 className="font-black text-sm underline mb-3">
                  الموضوع: {convocationSubject}
                </h2>
                <p className="text-sm leading-loose whitespace-pre-wrap text-justify">
                  {convocationBody}
                </p>
              </div>

              <div className="grid grid-cols-2 pt-10 text-xs font-black text-center">
                <div>
                  <p>إمضاء المعني(ة) بالاستلام</p>
                  <p className="mt-4 text-slate-500">............................</p>
                </div>
                <div>
                  <p>الناظر (مدير الدراسات)</p>
                  <p className="mt-1 text-slate-700">{institution.directorOfStudies}</p>
                  <p className="mt-3 text-[#8f1414]">[الختم والتوقيع الرسمي]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Community Announcement */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#081a12] rounded-2xl max-w-lg w-full shadow-2xl border-2 border-[#d4af37] overflow-hidden">
            <div className="bg-[#05140d] border-b border-[#d4af37]/30 text-white p-4 flex items-center justify-between">
              <h3 className="font-black text-sm text-[#f5d77f] flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>إصدار مذكرة أو إعلان جديد للجماعة التربوية</span>
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
            <form onSubmit={handleAddAnnouncement} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">عنوان المذكرة / الإعلان</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: مذكرة داخلية رقم 14 بخصوص ضبط قوائم الفروض المحروسة"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الفئة المستهدفة</label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value as CommunityNoticeItem['targetGroup'])}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                  >
                    <option value="teachers">هيئة التدريس والمنسقون</option>
                    <option value="parents">أولياء التلاميذ والجمعية</option>
                    <option value="students">التلاميذ ومندوبو الأقسام</option>
                    <option value="staff">الطاقم الإداري والتربوي</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">درجة الأهمية</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as CommunityNoticeItem['priority'])}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white font-bold"
                  >
                    <option value="urgent">مستعجل جداً</option>
                    <option value="important">هام</option>
                    <option value="normal">عادي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">نص المذكرة أو التعليمة البيداغوجية</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="اكتب مضمون المذكرة الموجهة للجماعة التربوية..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40 font-black hover:bg-[#157841] cursor-pointer"
                >
                  نشر وتعميم المذكرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Official Notice Modal */}
      {printableNotice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#081a12] rounded-2xl max-w-3xl w-full p-6 shadow-2xl border-2 border-[#d4af37] my-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#d4af37]/30 no-print">
              <h4 className="font-black text-white text-sm">معاينة الطباعة الرسمية (قالب وزارة التربية الوطنية)</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-[#8f1414] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة فورية (A4)</span>
                </button>
                <button
                  onClick={() => setPrintableNotice(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="printable-document bg-white border-2 border-slate-900 p-8 text-slate-900 rounded-xl space-y-6">
              <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
                <p className="font-black text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                <p className="font-black text-sm">وزارة التربية الوطنية</p>
                <div className="flex items-center justify-between text-xs font-bold pt-3">
                  <div className="text-right">
                    <p>مديرية التربية لـ: {institution.wilaya}</p>
                    <p>{institution.schoolName}</p>
                    <p>مكتب الناظر (مدير الدراسات)</p>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img src={activeLogoUrl} alt="شعار المؤسسة" className="w-14 h-14 object-contain" />
                  </div>
                  <div className="text-left">
                    <p>السنة الدراسية: {institution.schoolYear}</p>
                    <p>التاريخ: {printableNotice.date}</p>
                  </div>
                </div>
              </div>

              <div className="text-center py-2">
                <span className="inline-block border-2 border-slate-900 px-6 py-2 font-black text-base bg-slate-50">
                  مذكرة إعلامية وتنظيمية موجهة إلى: {getTargetLabel(printableNotice.targetGroup)}
                </span>
              </div>

              <div>
                <h2 className="font-black text-sm underline mb-3">
                  الموضوع: {printableNotice.title}
                </h2>
                <p className="text-sm leading-loose text-justify">
                  {printableNotice.content}
                </p>
              </div>

              <div className="grid grid-cols-2 pt-10 text-xs font-black text-center">
                <div>
                  <p>الناظر (مدير الدراسات)</p>
                  <p className="mt-1 text-slate-700">{institution.directorOfStudies}</p>
                </div>
                <div>
                  <p>ختم ومصادقة مدير الثانوية</p>
                  <p className="mt-4 text-[#8f1414]">[الختم والتوقيع الرسمي]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
