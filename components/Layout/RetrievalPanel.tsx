import React, { useState } from 'react';
import { Search, Plus, Filter, ChevronDown, Folder, Hash, MoreHorizontal, LayoutGrid, List } from 'lucide-react';
import { MOCK_TREE_DATA, MOCK_ARCHIVE_DATA, FileNode } from '../../types';

interface RetrievalPanelProps {
  activeModule: string;
}

export const RetrievalPanel: React.FC<RetrievalPanelProps> = ({ activeModule }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <aside className="fixed left-[64px] top-14 bottom-0 w-[320px] bg-zinc-950 border-r border-zinc-800 z-30 flex flex-col">
      
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0">
        <span className="text-sm font-semibold text-zinc-200">Quick Retrieval</span>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-300 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-300 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-zinc-800 shrink-0">
        <div className="relative group">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <input 
            type="text" 
            placeholder="Filter projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          <Tag label="Recent" active />
          <Tag label="Starred" />
          <Tag label="Shared" />
          <Tag label="Drafts" />
        </div>
      </div>

      {/* Tree Content - Split View Logic */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Top Section (Active) */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {MOCK_TREE_DATA.map((group) => (
            <TreeGroup key={group.id} node={group} />
          ))}
        </div>

        {/* Resizable Divider (Visual) */}
        <div className="h-1 bg-zinc-900 border-y border-zinc-800 cursor-row-resize hover:bg-indigo-500/10 flex justify-center items-center group">
             <div className="w-8 h-1 bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Bottom Section (Archive/Status) - Only if appropriate for module, forcing visibility for prototype */}
        <div className="h-1/3 min-h-[120px] bg-zinc-900/30 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <span>Archive</span>
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          {MOCK_ARCHIVE_DATA.map((group) => (
             <TreeGroup key={group.id} node={group} isArchive />
          ))}
        </div>

      </div>

      {/* Footer Status */}
      <div className="h-9 border-t border-zinc-800 flex items-center justify-between px-3 bg-zinc-950 shrink-0 text-[11px] text-zinc-500">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>System Operational</span>
         </div>
         <span>v2.4.0</span>
      </div>
    </aside>
  );
};

const Tag: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button className={`
    px-2.5 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors border
    ${active 
      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-400 hover:border-zinc-700'}
  `}>
    {label}
  </button>
);

const TreeGroup: React.FC<{ node: FileNode, isArchive?: boolean }> = ({ node, isArchive }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6 last:mb-0 animate-in fade-in slide-in-from-left-2 duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 w-full text-left mb-2 group"
      >
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${!isOpen && '-rotate-90'}`} />
        <span className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors tracking-wide">
          {node.name}
        </span>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-0.5 ml-1.5 pl-2 border-l border-zinc-800/50">
          {node.children?.map(child => (
            <TreeItem key={child.id} node={child} isArchive={isArchive} />
          ))}
        </div>
      )}
    </div>
  );
}

const TreeItem: React.FC<{ node: FileNode, isArchive?: boolean }> = ({ node, isArchive }) => {
  return (
    <div className={`
      group flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer transition-all
      ${node.id === 'p1' && !isArchive ? 'bg-indigo-500/10 text-indigo-100' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}
    `}>
      <div className="flex items-center gap-2.5 min-w-0">
        {isArchive ? <Hash className="w-3.5 h-3.5 opacity-50" /> : <Folder className={`w-3.5 h-3.5 ${node.id === 'p1' ? 'fill-indigo-500/20 text-indigo-400' : 'fill-zinc-800 text-zinc-500'}`} />}
        <span className="text-sm truncate font-medium">{node.name}</span>
      </div>
      
      {/* Hover Actions */}
      <div className="hidden group-hover:flex items-center">
        <button className="text-zinc-500 hover:text-zinc-200">
           <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}