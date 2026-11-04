import React, { useState } from 'react';
import { 
  Landmark, 
  ExternalLink, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Search, 
  Printer, 
  CheckCircle2, 
  BookOpen, 
  Award,
  Building2,
  X
} from 'lucide-react';
import { InstitutionProfile, SupervisedInstitute } from '../types';

interface SupervisedInstitutesSectionProps {
  institution: InstitutionProfile;
}

const SUPERVISED_INSTITUTES_DATA: SupervisedInstitute[] = [
  {
    id: 'inst-onec',
    acronym: 'ONEC',
    name: 'الديوان الوطني للامتحانات والمسابقات',
    category: 'امتحانات ومسابقات',
    headquarters: 'القبة - الجزائر العاصمة (فروع جهوية عبر الوطن)',
    officialPortal: 'https://bac.onec.dz',
    description: 'الهيئة الوطنية المكلفة بتنظيم وإجراء الامتحانات المدرسية الرسمية (شهادة البكالوريا وشهادة التعليم المتوسط) والمسابقات المهنية لترقية موظفي قطاع التربية.',
    directorOfStudiesRole: [
      'مراقبة وتدقيق قوائم تلاميذ السنة الثالثة ثانوي المترشحين للبكالوريا ومطابقة هوياتهم وحالة الإعفاء البدني.',
      'الإشراف بصفته نائباً أول لرئيس مركز الإجراء على أمانة المركز، توزيع الحراس، وضبط محاضر القاعات.',
      'إعداد البطاقات التركيبية والتقويم المستمر للمترشحين وإرسالها عبر الأرضية المخصصة للديوان.'
    ],
    annualDeadlines: [
      { period: 'أكتوبر - نوفمبر', task: 'التسجيل الأولي وتدقيق الملفات الرقمية لمترشحي البكالوريا المتمدرسين.' },
      { period: 'فيفري - مارس', task: 'تأكيد المعلومات النهائية وإجراء اختبارات التربية البدنية للمتمدرسين.' },
      { period: 'ماي - جوان', task: 'تحضير مركز الإجراء، قاعات الامتحان، وأمانة مركز البكالوريا.' }
    ],
    officialDocuments: [
      'محضر مراقبة وتدقيق القائمة الاسمية النهائية لمترشحي البكالوريا',
      'جدول إحصاء الأساتذة المكلفين بالحراسة والتصحيح',
      'كشف المترشحين المعفيين من اختبار التربية البدنية والرياضية'
    ]
  },
  {
    id: 'inst-infp',
    acronym: 'INFP',
    name: 'المعهد الوطني لتكوين موظفي قطاع التربية الوطنية وتحسين مستواهم',
    category: 'بحث وتكوين بيداغوجي',
    headquarters: 'الحراش - الجزائر العاصمة (المعاهد الجهوية للتكوين)',
    officialPortal: 'https://www.infp.edu.dz',
    description: 'المؤسسة العمومية المكلفة بالتكوين المتخصص قبل الترقية والتكوين البيداغوجي التحضيري أثناء التربص لرتب التأطير البيداغوجي والإداري (مديرو الثانويات، النظار، المستشارون، والأساتذة).',
    directorOfStudiesRole: [
      'متابعة ومرافقة الأساتذة المتربصين الجدد داخل الثانوية وتنسيق تكوينهم التطبيقي قبل امتحان التثبيت.',
      'المشاركة في الدورات التكوينية التحضيرية للترقية لرتبة مدير ثانوية أو مفتش إدارة.',
      'تأطير الندوات التربوية الداخلية وأيام التكوين المستمر لفائدة أساتذة المؤسسة.'
    ],
    annualDeadlines: [
      { period: 'سبتمبر - أكتوبر', task: 'تنصيب الأساتذة المتربصين وتعيين الأساتذة المرافقين (المطبقين).' },
      { period: 'ديسمبر - أفريل', task: 'متابعة الحجم الساعي للتكوين البيداغوجي التحضيري وتقييم مذكرات التربص.' },
      { period: 'جويلية', task: 'دورات التكوين المغلقة للناجحين في مسابقات الترقية لرتبة مدير ثانوية.' }
    ],
    officialDocuments: [
      'بطاقة متابعة وتقييم أستاذ متربص خلال فترة التكوين التحضيري',
      'طلب ترخيص لحضور دورة تكوينية بالمعهد الوطني INFP',
      'تقرير بيداغوجي حول الندوات التكوينية الداخلية بالمؤسسة'
    ]
  },
  {
    id: 'inst-inre',
    acronym: 'INRE',
    name: 'المعهد الوطني للبحث في التربية',
    category: 'بحث وتكوين بيداغوجي',
    headquarters: 'العاشور - الجزائر العاصمة',
    officialPortal: 'https://www.inre.dz',
    description: 'هيئة علمية وبيداغوجية تحت وصاية وزارة التربية، تعنى بالبحث التربوي، تقييم البرامج والمناهج، وتحليل الظواهر التربوية كالتعثر المدرسي وجودة التقييم.',
    directorOfStudiesRole: [
      'تزويد فرق البحث البيداغوجي بالمعطيات الإحصائية الميدانية حول نسب النجاح ومؤشرات استيعاب المناهج.',
      'استثمار دلائل المعهد الوطني في معالجة صعوبات التعلم وبناء خطط الاستدراك الفصلي.',
      'المساهمة في الاستبيانات والدراسات الوطنية لتطوير التعليم الثانوي العام والتكنولوجي.'
    ],
    annualDeadlines: [
      { period: 'نهاية كل فصل دراسي', task: 'تحليل مؤشرات التحصيل الدراسي ومقارنتها بالمعايير البيداغوجية الوطنية.' },
      { period: 'ماي', task: 'رفع الملاحظات البيداغوجية للمجالس التعليمية حول كثافة وملاءمة البرامج.' }
    ],
    officialDocuments: [
      'استمارة حصر الملاحظات البيداغوجية لمجالس التعليم حول المناهج',
      'تقرير تشخيصي حول نتائج معالجة التعثر المدرسي بالثانوية'
    ]
  },
  {
    id: 'inst-onps',
    acronym: 'ONPS',
    name: 'الديوان الوطني للمطبوعات المدرسية',
    category: 'كتاب ومطبوعات',
    headquarters: 'العاشور - الجزائر العاصمة (المراكز الولائية للتوزيع)',
    officialPortal: 'https://www.onps.dz',
    description: 'المؤسسة الوطنية المكلفة بطبع ونشر وتوزيع الكتب المدرسية الرسمية، الأدلة البيداغوجية للأساتذة، والمصنفات المعتمدة من وزارة التربية الوطنية.',
    directorOfStudiesRole: [
      'إحصاء الحاجيات البيداغوجية من الكتب المدرسية والأدلة التربوية لكل مستوى وشعبة بالتنسيق مع المقتصد.',
      'ضمان تزويد المكتبة المدرسية والأساتذة الجدد بالمناهج الرسمية والوثائق المرافقة المطبوعة.',
      'الإشراف البيداغوجي على عملية تسليم الكتب المدرسية للتلاميذ مطلع الموسم الدراسي.'
    ],
    annualDeadlines: [
      { period: 'أفريل - ماي', task: 'تقدير الحاجيات التوقعية من الكتب المدرسية للموسم الدراسي المقبل حسب الخريطة التربوية.' },
      { period: 'سبتمبر', task: 'توزيع الكتب المدرسية والأدلة البيداغوجية وتزويد مكتبة الثانوية.' }
    ],
    officialDocuments: [
      'كشف الاحتياجات البيداغوجية من الكتب والأدلة المدرسية حسب الشعب',
      'محضر جرد الرصيد الوثائقي والبيداغوجي للمكتبة المدرسية'
    ]
  },
  {
    id: 'inst-cniipdtice',
    acronym: 'CNIIPDTICE',
    name: 'المركز الوطني لإدماج الابتكارات البيداغوجية وتنمية تكنولوجيات الإعلام والاتصال',
    category: 'رقمنة وتعليم عن بعد',
    headquarters: 'بوزريعة - الجزائر العاصمة',
    officialPortal: 'https://www.cniipdtice.dz',
    description: 'المركز المختص في تطوير الرقمنة البيداغوجية، إدماج التكنولوجيات الحديثة في التدريس، ومتابعة تجهيزات مخابر الإعلام الآلي والمخابر العلمية بالثانويات.',
    directorOfStudiesRole: [
      'متابعة استغلال قاعات الإعلام الآلي والسبورات التفاعلية والمخابر العلمية في الحصص التطبيقية.',
      'مرافقة الأساتذة في توظيف الموارد الرقمية والمحاكاة العلمية في مواد الفيزياء والعلوم والهندسة.',
      'السهر على صيانة وجاهزية العتاد البيداغوجي الرقمي بالثانوية.'
    ],
    annualDeadlines: [
      { period: 'سبتمبر', task: 'ضبط البطاقة التقنية لجاهزية مخابر الإعلام الآلي والمخابر العلمية.' },
      { period: 'طيلة السنة الدراسية', task: 'جدولة استغلال التجهيزات الرقمية بين الأفواج التربوية.' }
    ],
    officialDocuments: [
      'بطاقة تقنية حول وضعية مخابر الإعلام الآلي والوسائل الرقمية',
      'جدول التوزيع الأسبوعي لاستغلال القاعات المتخصصة والمخابر'
    ]
  },
  {
    id: 'inst-onefd',
    acronym: 'ONEFD',
    name: 'الديوان الوطني للتعليم والتكوين عن بعد',
    category: 'رقمنة وتعليم عن بعد',
    headquarters: 'الجزائر العاصمة (المراكز الولائية للتعليم عن بعد)',
    officialPortal: 'https://www.onefd.edu.dz',
    description: 'الهيئة الوصية المكلفة بالتعليم عن بعد، امتحانات إثبات المستوى، وتوفير الأرضيات التعليمية الرقمية الداعمة لتلاميذ التعليم الثانوي.',
    directorOfStudiesRole: [
      'التنسيق في حال تنظيم الثانوية كمركز إجراء لامتحانات إثبات المستوى السنوية في شهر ماي.',
      'دراسة ملفات معادلة المستوى والتوجيه للتلاميذ المعنيين بالتكوين عن بعد.',
      'توجيه التلاميذ للاستفادة من الدروس النموذجية الرقمية المتاحة عبر بوابة المعرفة.'
    ],
    annualDeadlines: [
      { period: 'أكتوبر - نوفمبر', task: 'توجيه التلاميذ المفصولين أو الراغبين في مواصلة الدراسة عن بعد.' },
      { period: 'ماي', task: 'تنظيم وإجراء امتحان إثبات المستوى السنوي بمراكز الإجراء.' }
    ],
    officialDocuments: [
      'محضر تسليم واستلام قاعات مركز امتحان إثبات المستوى ONEFD',
      'شهادة توجيه وإعلام بالتسجيل في الديوان الوطني للتعليم عن بعد'
    ]
  },
  {
    id: 'inst-cndp',
    acronym: 'CNDP',
    name: 'المركز الوطني للوثائق التربوية',
    category: 'كتاب ومطبوعات',
    headquarters: 'الجزائر العاصمة',
    officialPortal: 'https://www.education.gov.dz',
    description: 'الهيئة المكلفة بإصدار النشرات الرسمية لوزارة التربية الوطنية (المتضمنة كافة القرارات والمناشير)، وتوثيق الأرشيف التشريعي والبيداغوجي.',
    directorOfStudiesRole: [
      'اقتناء وحفظ مجموعات النشرات الرسمية للتربية الوطنية بمكتب الناظر والمكتبة للرجوع إليها كمرجع قانوني.',
      'تحيين الفهرس التشريعي للمؤسسة وإطلاع الأساتذة على المناشير البيداغوجية الصادرة في النشرة الرسمية.'
    ],
    annualDeadlines: [
      { period: 'شهرياً / فصلياً', task: 'استلام وفهرسة أعداد النشرة الرسمية للتربية الوطنية.' }
    ],
    officialDocuments: [
      'سجل فهرسة النشرات الرسمية والمناشير الوزارية بمكتب الناظر'
    ]
  }
];

export const SupervisedInstitutesSection: React.FC<SupervisedInstitutesSectionProps> = ({
  institution
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInstituteModal, setActiveInstituteModal] = useState<SupervisedInstitute | null>(null);
  const [selectedDocTitle, setSelectedDocTitle] = useState<string>('');
  const [customCorrespBody, setCustomCorrespBody] = useState<string>('');

  const categories = [
    { id: 'all', label: 'جميع المعاهد والهيئات الوصية (7)' },
    { id: 'امتحانات ومسابقات', label: 'امتحانات ومسابقات (ONEC)' },
    { id: 'بحث وتكوين بيداغوجي', label: 'تكوين وبحث بيداغوجي (INFP / INRE)' },
    { id: 'كتاب ومطبوعات', label: 'مطبوعات وتوثيق (ONPS / CNDP)' },
    { id: 'رقمنة وتعليم عن بعد', label: 'ابتكار ورقمنة (CNIIPDTICE / ONEFD)' },
  ];

  const filteredInstitutes = SUPERVISED_INSTITUTES_DATA.filter(inst => {
    const matchesCat = selectedCategory === 'all' || inst.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesCat;
    return matchesCat && (
      inst.name.toLowerCase().includes(q) ||
      inst.acronym.toLowerCase().includes(q) ||
      inst.description.toLowerCase().includes(q) ||
      inst.directorOfStudiesRole.some(r => r.toLowerCase().includes(q))
    );
  });

  const handleOpenCorrespModal = (inst: SupervisedInstitute, docTitle: string) => {
    setActiveInstituteModal(inst);
    setSelectedDocTitle(docTitle);
    setCustomCorrespBody(
      `يشرفني نحن ناظر الدراسات بـ ${institution.schoolName} (${institution.wilaya})، وفي إطار التنسيق البيداغوجي والإداري المستمر مع هيئتكم الموقرة (${inst.name} - ${inst.acronym}) برسم السنة الدراسية ${institution.schoolYear}، أن نرفع إليكم الوثيقة المتعلقة بـ: "${docTitle}"، مستوفاة لكافة الشروط والمعايير التنظيمية المعمول بها.\n\nوتفضلوا بقبول فائق عبارات التقدير والاحترام.`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>دليل التنسيق المؤسساتي · الهيئات والمعاهد الوطنية تحت وصاية وزارة التربية الوطنية</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              قسم المعاهد والمنشآت ذات الوصاية وعلاقتها بمهام الناظر
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              المرجع الموحد لكافة الدواوين والمعاهد والمراكز الوطنية التابعة لوزارة التربية الوطنية (ONEC, INFP, INRE, ONPS, ONEFD, CNIIPDTICE, CNDP)، مهام الناظر إزاء كل هيئة، الرزنامة السنوية، ونماذج المراسلات الرسمية الجاهزة.
            </p>
          </div>

          <div className="bg-[#05140d] px-4 py-3 rounded-xl border border-[#d4af37]/30 text-center min-w-[160px]">
            <div className="text-2xl font-black gold-gradient-text">{SUPERVISED_INSTITUTES_DATA.length}</div>
            <div className="text-xs text-slate-300">هيئات ومعاهد وطنية وصية</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-[#d4af37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن معهد أو ديوان (مثال: ONEC، البكالوريا، INFP، التكوين، الكتاب المدرسي)..."
              className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white border border-[#f5d77f]/50 shadow-md'
                  : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Institutes Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredInstitutes.map((inst) => (
          <div
            key={inst.id}
            className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 hover:border-[#d4af37] p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-3">
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3 border-b border-[#d4af37]/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#105e32] to-[#082c18] border border-[#d4af37]/50 flex items-center justify-center font-black text-[#f5d77f] text-xs shadow-md shrink-0">
                    {inst.acronym}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#d4af37] bg-[#05140d] px-2 py-0.5 rounded border border-[#d4af37]/20">
                      {inst.category}
                    </span>
                    <h3 className="text-base font-black text-white mt-1">{inst.name}</h3>
                    <p className="text-[11px] text-slate-400">{inst.headquarters}</p>
                  </div>
                </div>

                <a
                  href={inst.officialPortal}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-[#05140d] hover:bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/30 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>الموقع الرسمي</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {inst.description}
              </p>

              {/* Director of Studies Direct Responsibilities */}
              <div className="p-3.5 rounded-lg bg-[#05140d] border border-[#d4af37]/20 space-y-2">
                <h4 className="text-xs font-bold text-[#f5d77f] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>مهام ناظر الثانوية والتنسيق المباشر مع الهيئة:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {inst.directorOfStudiesRole.map((role, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-[#d4af37] font-bold">•</span>
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Annual Deadlines */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>المحطات والآجال السنوية المرتبطة بالهيئة:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inst.annualDeadlines.map((dl, dIdx) => (
                    <div key={dIdx} className="p-2 rounded bg-[#05140d]/60 border border-slate-800 text-[11px]">
                      <span className="font-bold text-[#d4af37] block">{dl.period}:</span>
                      <span className="text-slate-300">{dl.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Documents Quick Generator */}
            <div className="pt-3 border-t border-[#d4af37]/20 space-y-2">
              <div className="text-[11px] font-bold text-emerald-300">
                نماذج المراسلات والبطاقات الرسمية مع {inst.acronym} (قابلة للطباعة A4):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {inst.officialDocuments.map((doc, docIdx) => (
                  <button
                    key={docIdx}
                    onClick={() => handleOpenCorrespModal(inst, doc)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0d2818] hover:bg-[#8f1414] text-white text-[11px] font-semibold border border-[#d4af37]/30 flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3 h-3 text-[#f5d77f]" />
                    <span>{doc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Official Institute Correspondence Modal */}
      {activeInstituteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#081a12] border-2 border-[#d4af37] rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3 no-print">
              <div>
                <h3 className="font-black text-white text-base">
                  تحرير وطباعة وثيقة تنسيق رسمية مع ({activeInstituteModal.acronym})
                </h3>
                <p className="text-xs text-[#d4af37]">{activeInstituteModal.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-[#8f1414] hover:bg-[#a61b1b] text-white text-xs font-bold flex items-center gap-1.5 border border-[#f5d77f]/40"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة رسمية A4</span>
                </button>
                <button
                  onClick={() => setActiveInstituteModal(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="no-print space-y-2 text-xs">
              <label className="block text-slate-300 font-bold">نص المراسلة / التقرير البيداغوجي (قابل للتعديل):</label>
              <textarea
                rows={3}
                value={customCorrespBody}
                onChange={(e) => setCustomCorrespBody(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none"
              />
            </div>

            {/* A4 Printable Sheet */}
            <div className="printable-document bg-white text-slate-900 rounded-xl p-8 shadow-xl border border-slate-300 font-['Cairo',serif]">
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
                <h2 className="text-base font-black">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
                <h3 className="text-sm font-bold">وزارة التربية الوطنية</h3>
                <div className="flex items-center justify-between text-xs font-semibold mt-3">
                  <div className="text-right">
                    <div>مديرية التربية لـ: {institution.wilaya}</div>
                    <div>المؤسسة: {institution.schoolName}</div>
                  </div>
                  <div className="w-14 h-14 flex items-center justify-center">
                    <img
                      src={institution.logoUrl || '/assets/aistudio/image_98bcc8c9.png'}
                      alt="شعار المؤسسة"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div>السنة الدراسية: {institution.schoolYear}</div>
                    <div>إلى السيد مدير: {activeInstituteModal.name} ({activeInstituteModal.acronym})</div>
                  </div>
                </div>
              </div>

              <div className="text-center my-6">
                <div className="inline-block border-2 border-slate-900 px-6 py-2 rounded bg-slate-50 font-black text-base text-[#0f4d2a]">
                  الموضوع: {selectedDocTitle}
                </div>
              </div>

              <div className="my-6 text-sm leading-loose whitespace-pre-wrap text-slate-800">
                {customCorrespBody}
              </div>

              <div className="my-6 p-4 bg-slate-50 border border-slate-300 rounded text-xs space-y-1.5">
                <div className="font-bold text-slate-900">المرفقات والبيانات المرجعية المعتمدة:</div>
                <div>• المؤسسة المرسلة: {institution.schoolName} - {institution.wilaya}</div>
                <div>• الهيئة المرسل إليها: {activeInstituteModal.name} ({activeInstituteModal.acronym})</div>
                <div>• تاريخ الإرسال والتأشير: {new Date().toLocaleDateString('ar-DZ')}</div>
              </div>

              <div className="mt-10 pt-4 border-t border-slate-300 flex justify-between text-xs font-bold">
                <div>حرر بـ: {institution.wilaya} في: {new Date().toLocaleDateString('ar-DZ')}</div>
                <div className="text-center">
                  <div>ناظر الثانوية / مدير الدراسات</div>
                  <div className="mt-1 text-slate-700">{institution.directorOfStudies}</div>
                  <div className="mt-4 text-[#8f1414]">[الختم والتوقيع الرسمي]</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
