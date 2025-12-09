import { useState, useEffect } from 'react';

const EthDatePicker = ({ value, onChange, minYear = 2010, maxYear = 2030 }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  // Fill days dynamically based on month
  const daysInMonth = month && year ? (month <= 12 ? 30 : 5) : 30; // Approximation: Ethiopian calendar has 30 days/month, 13th month has 5/6 days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const months = Array.from({ length: 13 }, (_, i) => i + 1); // 1 to 13

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  useEffect(() => {
    if (year && month && day) {
      onChange(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
  }, [year, month, day]);

  return (
    <div className="flex gap-2">
      <select
        value={year}
        onChange={e => setYear(e.target.value)}
        className="border p-2 rounded w-1/3"
      >
        <option value="">Year</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <select
        value={month}
        onChange={e => setMonth(e.target.value)}
        className="border p-2 rounded w-1/3"
      >
        <option value="">Month</option>
        {months.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select
        value={day}
        onChange={e => setDay(e.target.value)}
        className="border p-2 rounded w-1/3"
      >
        <option value="">Day</option>
        {days.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
};

export default EthDatePicker;
