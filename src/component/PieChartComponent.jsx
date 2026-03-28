import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#22c55e', '#ef4444'];

export default function ReusablePieChart({
  present,
  absent,
  presentPercentage,
  absentPercentage,
  onClick
}) {

  const pieData = [
    { name: `Present (${presentPercentage}%)`, value: present },
    { name: `Absent (${absentPercentage}%)`, value: absent }
  ];

  const hasData = present > 0 || absent > 0;

  if (!hasData) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-500">No attendance records for this session</p>
      </div>
    );
  }

  return (
    <div
      className="w-full flex justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <PieChart width={300} height={300}>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx={150}
          cy={150}
          outerRadius={100}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd'
          }}
          formatter={(value, name) => [`${value} students`, name]}
        />

        <Legend wrapperStyle={{ color: '#333' }} />
      </PieChart>
    </div>
  );
}