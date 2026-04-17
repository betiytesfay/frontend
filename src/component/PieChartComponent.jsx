import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = [
  '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f97316', '#06b6d4', '#a3e635',
  '#e11d48', '#7c3aed', '#0891b2', '#65a30d'
];

export default function ReusablePieChart({ present, absent, presentPercentage, absentPercentage, slices, onClick }) {
  // If slices provided (department mode), use them; otherwise build from present/absent
  const data = slices || [
    { name: `Present (${presentPercentage}%)`, value: present },
    { name: `Absent (${absentPercentage}%)`, value: absent }
  ];

  const colors = slices ? COLORS : ['#22c55e', '#ef4444'];
  const hasData = data.some(d => d.value > 0);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (!hasData) {
    return (
      <div className="w-full h-[160px] flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-500 text-sm">No attendance records for this class</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer mb-4 sm:flex-row sm:items-center sm:gap-4" onClick={onClick}>
      <div className="flex-shrink-0">
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx={90}
            cy={90}
            outerRadius={75}
            label={({ percent }) => percent > 0.04 ? `${(percent * 100).toFixed(0)}%` : ''}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ddd', fontSize: 12 }}
            formatter={(value, name) => [`${value} students`, name]}
          />
        </PieChart>
      </div>

      {/* Color legend */}
      <div className="flex flex-col gap-1.5 w-full sm:flex-1">
        {data.map((slice, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-gray-700 flex-1 truncate">{slice.name}</span>
            <span className="font-semibold text-gray-800 text-xs whitespace-nowrap">
              {slice.value}
              <span className="text-gray-400 font-normal ml-1">
                ({total > 0 ? ((slice.value / total) * 100).toFixed(1) : 0}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
