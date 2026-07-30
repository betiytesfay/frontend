import { GraduationCap, BookOpen, Layers, ShieldCheck, LayoutDashboard } from 'lucide-react';

const manage = [
  { key: 'students', label: 'Students', icon: GraduationCap },
  { key: 'courses', label: 'Courses', icon: BookOpen },
  { key: 'batches', label: 'Batches', icon: Layers },
  { key: 'admins', label: 'Session admins', icon: ShieldCheck },
];

export default function AdminSidebar({ selectedCategory, setSelectedCategory }) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 lg:border-r lg:border-black/[0.06] lg:bg-white lg:min-h-screen lg:px-4 lg:py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-[#D7B450] text-[#2A2620] flex items-center justify-center font-bold text-xs shrink-0">
          GA
        </div>
        <p className="text-sm font-semibold text-[#1F3A5F]">Gibi Admin</p>
      </div>

      <button
        onClick={() => setSelectedCategory('')}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition mb-1
          ${!selectedCategory ? 'bg-[#D7B450]/25 text-[#1F3A5F]' : 'text-[#2A2620] hover:bg-black/[0.03]'}`}
      >
        <LayoutDashboard size={17} className={!selectedCategory ? 'text-[#1F3A5F]' : 'text-[#8A8374]'} />
        Dashboard
      </button>

      <p className="text-xs font-semibold text-[#8A8374] uppercase tracking-wide px-3 mt-5 mb-2">Manage</p>
      {manage.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setSelectedCategory(key)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition mb-1
            ${selectedCategory === key ? 'bg-[#D7B450]/25 text-[#1F3A5F]' : 'text-[#2A2620] hover:bg-black/[0.03]'}`}
        >
          <Icon size={17} className={selectedCategory === key ? 'text-[#1F3A5F]' : 'text-[#8A8374]'} />
          {label}
        </button>
      ))}
    </aside>
  );
}