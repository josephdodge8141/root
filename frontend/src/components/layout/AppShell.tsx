import { useApp } from '../../app/store';
import { SecondaryNav } from './SecondaryNav';
import { Sidebar } from './Sidebar';
import { ReactNode } from 'react';
import { InputSources } from '../upload/InputSources';

export function AppShell({ children }: { children: ReactNode }) {
  const { persona, setPersona } = useApp();
  const personas: Array<typeof persona> = ['Code','Infrastructure','Cloud','Product'];

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-4 py-2 flex items-center gap-4">
        <div className="text-lg font-semibold">Interactive Docs</div>
        <nav className="ml-6 flex gap-2">
          {personas.map(p => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={`px-3 py-1 rounded ${persona===p?'bg-black text-white':'bg-gray-100'}`}
            >
              {p}
            </button>
          ))}
        </nav>
      </header>
      <InputSources />
      <SecondaryNav />
      <main className="flex flex-1">
        <div className="w-2/3 border-r">{children}</div>
        <Sidebar />
      </main>
    </div>
  );
} 