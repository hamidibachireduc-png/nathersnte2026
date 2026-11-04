import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { StudentScore } from '../types';
import { BarChart3, Award, Users, TrendingUp } from 'lucide-react';

interface GradeDistributionChartProps {
  students: StudentScore[];
  classGroup: string;
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({
  students,
  classGroup
}) => {
  const total = students.length;

  // Filter students into the 4 requested categories:
  // 1. ممتاز (16 - 20)
  // 2. جيد (14 - 15.99)
  // 3. متوسط (10 - 13.99)
  // 4. ضعيف (أقل من 10)
  const excellentCount = students.filter(s => s.average >= 16).length;
  const goodCount = students.filter(s => s.average >= 14 && s.average < 16).length;
  const averageCount = students.filter(s => s.average >= 10 && s.average < 14).length;
  const weakCount = students.filter(s => s.average < 10).length;

  const data = [
    {
      category: 'ممتاز',
      range: '16.00 - 20.00',
      count: excellentCount,
      percentage: total > 0 ? Number(((excellentCount / total) * 100).toFixed(1)) : 0,
      fill: '#d4af37', // Royal Gold
      description: 'تهنئة ولوحة شرف'
    },
    {
      category: 'جيد',
      range: '14.00 - 15.99',
      count: goodCount,
      percentage: total > 0 ? Number(((goodCount / total) * 100).toFixed(1)) : 0,
      fill: '#10b981', // Emerald Green
      description: 'لوحة شرف'
    },
    {
      category: 'متوسط',
      range: '10.00 - 13.99',
      count: averageCount,
      percentage: total > 0 ? Number(((averageCount / total) * 100).toFixed(1)) : 0,
      fill: '#38bdf8', // Sky Cyan
      description: 'تشجيع ومقبول'
    },
    {
      category: 'ضعيف',
      range: 'أقل من 10.00',
      count: weakCount,
      percentage: total > 0 ? Number(((weakCount / total) * 100).toFixed(1)) : 0,
      fill: '#ef4444', // Crimson Red
      description: 'تنبيه وإنذار بالتقصير'
    }
  ];

  // Custom Royal Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#05140d] border border-[#d4af37] p-3 rounded-xl shadow-2xl text-right font-['Cairo',sans-serif] min-w-[170px]">
          <div className="flex items-center justify-between gap-2 border-b border-[#d4af37]/30 pb-1.5 mb-1.5">
            <span className="font-black text-sm text-white">{item.category}</span>
            <span className="text-[10px] text-[#f5d77f] font-mono font-bold bg-[#082014] px-1.5 py-0.5 rounded border border-[#d4af37]/30">
              {item.range}
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>نسبة التلاميذ:</span>
              <span className="font-bold text-white font-mono">{item.percentage}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>عدد التلاميذ:</span>
              <span className="font-bold text-[#f5d77f] font-mono">{item.count} تلميذ</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              ملاحظة: {item.description}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-5 shadow-xl space-y-4">
      {/* Chart Title and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0d2818] border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              الرسم البياني لتوزيع معدلات التلاميذ (الفئات الأربع)
            </h3>
            <p className="text-xs text-slate-400">
              توضيح نسب وعدد التلاميذ حسب فئات الأداء (ممتاز، جيد، متوسط، ضعيف) لفوج {classGroup}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#d4af37] bg-[#05140d] px-2.5 py-1 rounded-lg border border-[#d4af37]/30 font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>إجمالي الفوج: {total} تلميذ</span>
          </span>
        </div>
      </div>

      {/* Main Recharts Bar Chart Area */}
      <div className="w-full h-72 sm:h-80 pt-2 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#123826" vertical={false} />
            <XAxis 
              dataKey="category" 
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 700, fontFamily: 'Cairo' }}
              tickLine={{ stroke: '#d4af37' }}
              axisLine={{ stroke: '#2a5739' }}
            />
            <YAxis 
              unit="%" 
              stroke="#94a3b8"
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Cairo' }}
              tickLine={{ stroke: '#2a5739' }}
              axisLine={{ stroke: '#2a5739' }}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212, 175, 55, 0.08)' }} />
            <Bar 
              dataKey="percentage" 
              name="نسبة التلاميذ"
              radius={[8, 8, 0, 0]}
              animationDuration={900}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  stroke={entry.fill}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Legend & Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {data.map((item, idx) => (
          <div 
            key={idx}
            className="p-3 rounded-lg bg-[#05140d] border transition-all hover:scale-[1.02] flex flex-col justify-between"
            style={{ borderColor: `${item.fill}55` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs" style={{ color: item.fill }}>
                {item.category}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {item.range}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-white font-mono">
                {item.percentage}%
              </span>
              <span className="text-xs text-slate-300 font-semibold font-mono">
                ({item.count} تلميذ)
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ width: `${item.percentage}%`, backgroundColor: item.fill }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
