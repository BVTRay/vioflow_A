import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ChevronRight, X, Film, Clock, User } from 'lucide-react';

interface WorkbenchProps {
  visible: boolean;
  onClose?: () => void;
}

export const Workbench: React.FC<WorkbenchProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <aside className="fixed top-[70px] bottom-[15px] right-[15px] w-[360px] bg-zinc-900 rounded-xl border border-zinc-800 z-30 shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-500 ease-out">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
        <div>
           <h2 className="text-sm font-semibold text-zinc-100">Batch Processing</h2>
           <p className="text-xs text-zinc-500 mt-0.5">Prepare assets for ingest</p>
        </div>
        {onClose && (
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
            </button>
        )}
      </div>

      {/* Content - Form & Upload */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        
        {/* Drop Zone */}
        <div className="border-2 border-dashed border-zinc-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group mb-6">
           <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
           </div>
           <p className="text-sm text-zinc-300 font-medium">Click or drag to upload</p>
           <p className="text-xs text-zinc-500 mt-1">Supports MOV, MP4, MXF (Max 50GB)</p>
        </div>

        {/* Metadata Form Mock */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Metadata Preset</h3>
            
            <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 ml-1">Project Code</label>
                <input type="text" value="PRJ-2024-X88" readOnly className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300 focus:outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 ml-1">Framerate</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300">
                        <Film className="w-3.5 h-3.5 text-zinc-500" />
                        23.976
                    </div>
                </div>
                 <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 ml-1">Assignee</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        Editor
                    </div>
                </div>
            </div>

             <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 ml-1">Notes</label>
                <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300 h-20 resize-none focus:border-zinc-700 focus:outline-none" placeholder="Add ingest notes..."></textarea>
            </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
         <div className="flex items-center justify-between text-xs text-zinc-500 mb-3 px-1">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Est. Time: 4m 20s</span>
            <span>2 Files Selected</span>
         </div>
         <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20 active:scale-95">
            <span>Start Processing</span>
            <ChevronRight className="w-4 h-4" />
         </button>
      </div>
    </aside>
  );
};