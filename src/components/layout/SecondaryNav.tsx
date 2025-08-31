import { useApp } from '../../app/store';

export function SecondaryNav() {
  const { tab, setTab } = useApp();
  const tabs: typeof tab[] = ['Interactive', 'Dependencies'];
  return (
    <div className="border-b px-4 py-2 flex gap-2">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-3 py-1 rounded ${tab===t?'bg-blue-600 text-white':'bg-gray-100'}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
} 