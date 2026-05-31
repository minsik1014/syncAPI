import React from 'react';
import { Layers, Code, Activity, TrendingUp } from 'lucide-react';

interface StatsSummaryProps {
  projectsCount: number;
  totalApis: number;
  totalRequests: number;
}

export default function StatsSummary({
  projectsCount,
  totalApis,
  totalRequests,
}: StatsSummaryProps) {
  const stats = [
    { label: 'Total Projects', value: projectsCount, icon: Layers, color: 'blue' },
    { label: 'Total APIs', value: totalApis, icon: Code, color: 'purple' },
    { label: 'Today Requests', value: totalRequests.toLocaleString(), icon: Activity, color: 'green' },
    { label: 'Avg Latency', value: '34ms', icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className={`p-4 bg-gray-50 rounded-2xl text-gray-500 group-hover:scale-110 transition-transform`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
