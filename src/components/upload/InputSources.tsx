import { useState } from 'react';
import { useApp } from '../../app/store';
import type { GraphDoc } from '../../lib/graphTypes';
import { sampleGraph } from '../../lib/sampleData.ts';

export function InputSources() {
  const { setGraph } = useApp();
  const [links, setLinks] = useState('');

  function onFolderChange(e: React.ChangeEvent<HTMLInputElement>) {
    // For now, just stub – later, walk FileSystemDirectoryHandle
    console.log(e.target.files);
    setGraph(sampleGraph as GraphDoc);
  }

  async function onLoadGitHub() {
    // Stub for now: parse each line as a URL and fetch raw files later
    console.log(links);
    setGraph(sampleGraph as GraphDoc);
  }

  return (
    <div className="p-3 border-b flex items-center gap-3">
      <label className="text-sm">
        Upload folders:
        <input type="file" // @ts-ignore
          webkitdirectory="true" directory="true" multiple onChange={onFolderChange} />
      </label>
      <div className="flex items-center gap-2">
        <input
          value={links}
          onChange={e => setLinks(e.target.value)}
          placeholder="One GitHub link per line"
          className="border px-2 py-1 w-96 text-sm"
        />
        <button onClick={onLoadGitHub} className="px-3 py-1 bg-gray-100 rounded text-sm">Load</button>
      </div>
    </div>
  );
} 