import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingDown, Package, Wrench, Clock, Users, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const damageData = [
  { name: 'สีน้ำ', budget: 1.81, damage: 1.13, percent: -62.24, category: 'critical' },
  { name: 'ปูนกาว', budget: 1.38, damage: 0.57, percent: -41.07, category: 'critical' },
  { name: 'กระจกเงา', budget: 1.37, damage: 0.38, percent: -28.03, category: 'critical' },
  { name: 'Digital Lock', budget: 1.68, damage: 0.22, percent: -12.88, category: 'warning' },
  { name: 'ประตูไม้', budget: 12.27, damage: 1.24, percent: -10.08, category: 'warning' },
  { name: 'สุขภัณฑ์', budget: 7.05, damage: 0.57, percent: -8.02, category: 'warning' },
  { name: 'ตู้ใต้อ่าง', budget: 2.61, damage: 0.16, percent: -6.04, category: 'moderate' },
  { name: 'อุปกรณ์ประตู', budget: 2.04, damage: 0.06, percent: -2.99, category: 'moderate' },
  { name: 'พื้น SPC', budget: 7.12, damage: 0.21, percent: -2.93, category: 'moderate' },
  { name: 'ฉากกั้นอาบน้ำ', budget: 2.97, damage: 0.09, percent: -2.92, category: 'moderate' },
];

const additionalCosts = [
  { name: 'ค่าบริหารงาน (ล่าช้า 5 เดือน)', amount: 1.95, type: 'management' },
  { name: 'งานลิฟต์ (น้ำท่วม/เร่งรัด)', amount: 1.29, type: 'damage' },
  { name: 'เครมสินค้าสูญหาย', amount: 1.27, type: 'loss' },
  { name: 'ซ่อมแซมโครงสร้าง', amount: 0.35, type: 'rework' },
  { name: 'เช่าลิฟต์เกินงบ', amount: 0.35, type: 'management' },
];

const rootCauses = [
  {
    title: 'Sequence งานผิด',
    icon: Clock,
    color: 'text-red-400',
    bgColor: 'bg-red-950',
    borderColor: 'border-red-800',
    details: [
      'ปูพื้น SPC ก่อนส่ง อ.5 แต่ยังมีงานอื่นเข้าไปทำ',
      'ติดตั้งสุขภัณฑ์/กระจก → แก้กระเบื้อง → เศษกระเด็นโดน',
      'ทาสีก่อนงานอื่นเสร็จ → ต้องซ่อมซ้ำหลายรอบ'
    ]
  },
  {
    title: 'Shop Drawing ไม่ถูกตรวจสอบ',
    icon: AlertTriangle,
    color: 'text-orange-400',
    bgColor: 'bg-orange-950',
    borderColor: 'border-orange-800',
    details: [
      'Floor to Floor ผิดระดับ',
      'ต้องตัดคาน + ใช้ปูนกาวเทปรับ',
      'ค่าใช้จ่าย 567,420 บาท ที่ไม่ควรเกิด'
    ]
  },
  {
    title: 'ระบบ Protection ล้มเหลว',
    icon: Package,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-950',
    borderColor: 'border-yellow-800',
    details: [
      'หนูกัดตีนบานประตู 30 บาน',
      'บานประตูสูญหาย 7 บาน / ตาแมวหาย 60 อัน',
      'ลมตีประตู ลิ้นกุญแจแตก 49 ห้อง'
    ]
  },
  {
    title: 'ระบบติดตามวัสดุไม่มี',
    icon: TrendingDown,
    color: 'text-purple-400',
    bgColor: 'bg-purple-950',
    borderColor: 'border-purple-800',
    details: [
      'ไม่มีข้อมูลส่งสินค้ากลับ DSC',
      'สินค้าถูกทิ้งไปกับขยะ',
      'เครมสินค้าสูญหาย 1.27 ล้านบาท'
    ]
  },
  {
    title: 'ประสานงานล้มเหลว',
    icon: Users,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950',
    borderColor: 'border-cyan-800',
    details: [
      'ช่างไฟย้ายตู้ไฟ ไม่ต่อไฟปั๊มน้ำ → น้ำล้นเข้าบ่อลิฟต์',
      'DEFECT 5 ครั้งในงานประตู (ซ้ำแล้วซ้ำเล่า)',
      'โครงการล่าช้า 5 เดือน'
    ]
  }
];

const recommendations = {
  urgent: [
    { action: 'ประชุม DSC ภายใน 3 วัน', target: 'ให้ได้ข้อมูลส่งคืนครบก่อนปิดโครงการ' },
    { action: 'ทำ Inventory Checklist ทุกห้อง', target: 'ก่อนส่งมอบลูกค้า' },
    { action: 'หยุดรับงานใหม่', target: 'จนกว่าจะ Clear DEFECT เดิมครบ' }
  ],
  shortTerm: [
    { action: 'แก้ Sequence งาน', target: 'กระเบื้อง → สี → พื้น → สุขภัณฑ์/กระจก → ประตู' },
    { action: 'ระบบ Protection Zone', target: 'ฟิล์มกันกระแทก + กับดักหนู' },
    { action: 'Shop Drawing ผ่าน QA/QC', target: 'ก่อนเริ่มงานทุกครั้ง' }
  ],
  midTerm: [
    { action: 'ระบบ Barcode/QR Code', target: 'ติดตามวัสดุตั้งแต่รับ-ติดตั้ง-คืน' },
    { action: 'จำกัด DEFECT ≤ 2 รอบ', target: 'รอบที่ 3 หักค่าจ้างผู้รับเหมา' },
    { action: 'ระบบประเมินผู้รับเหมา', target: 'ใช้เป็นเกณฑ์คัดเลือกโครงการถัดไป' }
  ]
};

const defectRounds = [
  { round: 'ครั้งที่ 1', amount: 779406 + 60261 + 163160 + 115481 + 132300 + 48877 },
  { round: 'ครั้งที่ 2', amount: 64800 + 600 + 7200 + 449859 + 32600 + 8450 },
  { round: 'ครั้งที่ 3', amount: 43000 + 13700 + 137080 + 25000 },
  { round: 'ครั้งที่ 4', amount: 169725 + 31750 + 82360 + 4345 },
  { round: 'ครั้งที่ 5', amount: 179550 },
];

function App() {
  const [expandedCause, setExpandedCause] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const totalBudget = 40.6;
  const totalDamage = 9.83;
  const damagePercent = 24.2;

  const getBarColor = (category) => {
    switch (category) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f97316';
      case 'moderate': return '#eab308';
      default: return '#6b7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{label}</p>
          <p className="text-slate-300 text-sm">งบประมาณ: {payload[0]?.payload?.budget?.toFixed(2)} ล้าน</p>
          <p className="text-red-400 text-sm">ความเสียหาย: {payload[0]?.value?.toFixed(2)} ล้าน</p>
          <p className="text-orange-400 text-sm font-bold">{payload[0]?.payload?.percent?.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-8">
      {/* Header */}
      <header className="relative mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-12 bg-gradient-to-b from-red-500 to-orange-600 rounded-full"></div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
                    NUE EVO ARI
                  </span>
                </h1>
                <p className="text-slate-400 text-sm tracking-widest uppercase">รายงานสรุปความเสียหาย ข้อบกพร่อง และค่าใช้จ่ายที่บานปลาย (Loss, Damage, Defect & Rework)</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-sm">วันที่รายงาน</p>
            <p className="text-slate-300 font-mono">24/02/2569</p>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="mb-8 bg-gradient-to-r from-red-950 to-red-900 border border-red-800 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <p className="text-red-300 font-semibold">ความเสียหายเกินมาตรฐาน</p>
          <p className="text-red-200 text-opacity-70 text-sm">Loss/Damage 24.2% — ปกติไม่ควรเกิน 3-5% ต้องมีการ Post-mortem อย่างจริงจัง</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 bg-opacity-10 rounded-full blur-3xl"></div>
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">งบประมาณรวม</p>
          <p className="text-4xl font-black text-white">{totalBudget}</p>
          <p className="text-slate-500 text-sm">ล้านบาท</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-950 to-slate-800 border border-red-800 border-opacity-30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 bg-opacity-20 rounded-full blur-3xl"></div>
          <p className="text-red-300 text-opacity-70 text-sm uppercase tracking-wider mb-1">ความเสียหายรวม</p>
          <p className="text-4xl font-black text-red-400">{totalDamage}</p>
          <p className="text-red-300 text-opacity-50 text-sm">ล้านบาท</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-950 to-slate-800 border border-orange-800 border-opacity-30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 bg-opacity-20 rounded-full blur-3xl"></div>
          <p className="text-orange-300 text-opacity-70 text-sm uppercase tracking-wider mb-1">% ความเสียหาย</p>
          <p className="text-4xl font-black text-orange-400">{damagePercent}%</p>
          <p className="text-orange-300 text-opacity-50 text-sm">เกินมาตรฐาน 5.7 เท่า</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'ภาพรวม' },
          { id: 'causes', label: 'สาเหตุ' },
          { id: 'solutions', label: 'แนวทางแก้ไข' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                : 'bg-slate-800 bg-opacity-50 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Chart */}
          <div className="bg-slate-800 bg-opacity-30 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              ความเสียหายแยกตามหมวด (ล้านบาท)
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={damageData} layout="vertical" margin={{ left: 80, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v}M`} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={75} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="damage" radius={[0, 4, 4, 0]}>
                    {damageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.category)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-sm text-slate-400">วิกฤต (&gt;25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span className="text-sm text-slate-400">เตือน (8-25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-sm text-slate-400">ปานกลาง (&lt;8%)</span>
              </div>
            </div>
          </div>

          {/* Critical Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {damageData.filter(d => d.category === 'critical').map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-red-950 to-slate-800 border border-red-900 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-red-300">{item.name}</h3>
                  <span className="text-2xl font-black text-red-400">{item.percent}%</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">งบประมาณ</span>
                    <span className="text-slate-300">{item.budget.toFixed(2)} ล้าน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ความเสียหาย</span>
                    <span className="text-red-400 font-semibold">{item.damage.toFixed(2)} ล้าน</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Costs */}
          <div className="bg-slate-800 bg-opacity-30 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-400" />
              ค่าใช้จ่ายเพิ่มเติม (ไม่รวมในหมวดหลัก)
            </h2>
            <div className="space-y-3">
              {additionalCosts.map((cost, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900 bg-opacity-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${
                      cost.type === 'management' ? 'bg-purple-500' :
                      cost.type === 'damage' ? 'bg-red-500' :
                      cost.type === 'loss' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-slate-300">{cost.name}</span>
                  </div>
                  <span className="text-lg font-bold text-white">{cost.amount.toFixed(2)} <span className="text-sm text-slate-500">ล้าน</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* DEFECT Rounds */}
          <div className="bg-slate-800 bg-opacity-30 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-yellow-400" />
              รอบการแก้ DEFECT (ซ้ำซ้อน)
            </h2>
            <div className="flex flex-wrap gap-3">
              {defectRounds.map((round, idx) => (
                <div key={idx} className="bg-slate-900 bg-opacity-70 rounded-lg p-4 flex-1 min-w-[150px] text-center border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">{round.round}</p>
                  <p className="text-xl font-bold text-yellow-400">{(round.amount / 1000000).toFixed(2)}</p>
                  <p className="text-slate-500 text-xs">ล้านบาท</p>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm mt-4 text-center">
              งานประตูเก็บ DEFECT 5 ครั้ง — แสดงถึงปัญหาเชิงระบบ ไม่ใช่อุบัติเหตุ
            </p>
          </div>
        </div>
      )}

      {/* Causes Tab */}
      {activeTab === 'causes' && (
        <div className="space-y-4">
          <div className="bg-slate-800 bg-opacity-30 border border-slate-700 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">Root Cause Analysis</h2>
            <p className="text-slate-400">
              โครงการนี้มีปัญหาเชิงระบบหลายจุดที่ซ้อนทับกัน ไม่ใช่แค่ "โชคร้าย" หรือ "แผ่นดินไหว"
            </p>
          </div>

          {rootCauses.map((cause, idx) => {
            const Icon = cause.icon;
            const isExpanded = expandedCause === idx;
            return (
              <div
                key={idx}
                className={`${cause.bgColor} border ${cause.borderColor} rounded-xl overflow-hidden transition-all duration-300`}
              >
                <button
                  onClick={() => setExpandedCause(isExpanded ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-900 bg-opacity-50 flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${cause.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{cause.title}</h3>
                      <p className="text-slate-400 text-sm">{cause.details.length} รายการ</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5">
                    <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4 space-y-3">
                      {cause.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${cause.color.replace('text-', 'bg-')} mt-2`}></div>
                          <span className="text-slate-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Solutions Tab */}
      {activeTab === 'solutions' && (
        <div className="space-y-6">
          {/* Urgent */}
          <div className="bg-gradient-to-r from-red-950 to-slate-800 border border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-red-300">ระยะเร่งด่วน (ทำทันที)</h2>
            </div>
            <div className="space-y-3">
              {recommendations.urgent.map((rec, idx) => (
                <div key={idx} className="bg-slate-900 bg-opacity-50 rounded-lg p-4 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{rec.action}</p>
                    <p className="text-slate-400 text-sm">{rec.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Short Term */}
          <div className="bg-gradient-to-r from-orange-950 to-slate-800 border border-orange-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-bold text-orange-300">ระยะสั้น (โครงการถัดไป)</h2>
            </div>
            <div className="space-y-3">
              {recommendations.shortTerm.map((rec, idx) => (
                <div key={idx} className="bg-slate-900 bg-opacity-50 rounded-lg p-4 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{rec.action}</p>
                    <p className="text-slate-400 text-sm">{rec.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mid Term */}
          <div className="bg-gradient-to-r from-green-950 to-slate-800 border border-green-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-green-300">ระยะกลาง (ปรับระบบบริหาร)</h2>
            </div>
            <div className="space-y-3">
              {recommendations.midTerm.map((rec, idx) => (
                <div key={idx} className="bg-slate-900 bg-opacity-50 rounded-lg p-4 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{rec.action}</p>
                    <p className="text-slate-400 text-sm">{rec.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Questions */}
          <div className="bg-slate-800 bg-opacity-30 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">❓ คำถามที่ต้องตอบก่อนปิดโครงการ</h2>
            <div className="space-y-4">
              {[
                'ค่าบริหารงาน 1.95 ล้าน (5 เดือนเพิ่ม) — ใครรับผิดชอบ? โครงการล่าช้าเพราะอะไร?',
                '27ENG เคลียร์ Shop Drawing ระดับผิด — มีการ Claim กลับหรือไม่?',
                'สินค้าสูญหาย 1.27 ล้าน — หักจากค่าจ้างผู้รับเหมาแล้วหรือยัง?',
                'DEFECT 5 รอบในงานประตู — ผู้รับเหมารายเดิมทั้งหมด? ทำไมไม่เปลี่ยน?'
              ].map((q, idx) => (
                <div key={idx} className="bg-slate-900 bg-opacity-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <span className="text-slate-300">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-600 text-sm border-t border-slate-800 pt-6">
        <p>รายงานวิเคราะห์ความเสียหาย | โครงการ NUE EVO ARI | สร้างโดย Claude AI</p>
      </footer>
    </div>
  );
}

export default App;
