
import React, { useState, useRef } from 'react';
import { Search, Plus, Filter, Folder, MoreHorizontal, Check, PlayCircle, Archive } from 'lucide-react';
import { useStore } from '../../App';
import { Project } from '../../types';

export const RetrievalPanel: React.FC = () => {
  const { state, dispatch } = useStore();
  const { activeModule, projects, selectedProjectId, searchTerm, activeTag } = state;

  // Split View Resizing Logic
  const [splitRatio, setSplitRatio] = useState(66); // Percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  
  // New Project Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ name: '', client: '', group: 'Commercials' });

  // Resizing Handlers
  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'row-resize';
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - containerRect.top;
    const percentage = (relativeY / containerRect.height) * 100;
    setSplitRatio(Math.min(Math.max(percentage, 20), 80));
  };
  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default';
  };

  // Logic: Create New Project
  const handleStartCreate = () => {
    const date = new Date();
    const prefix = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}_`;
    setNewProjectData({ ...newProjectData, name: prefix });
    setIsCreating(true);
  };

  const handleConfirmCreate = () => {
    if (!newProjectData.name) return;
    dispatch({
        type: 'ADD_PROJECT',
        payload: {
            id: `p${Date.now()}`,
            name: newProjectData.name,
            client: newProjectData.client || 'Client',
            lead: 'Me',
            postLead: 'TBD',
            group: newProjectData.group,
            status: 'active',
            createdDate: new Date().toISOString()
        }
    });
    setIsCreating(false);
  };

  // Filtering
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Renderers
  const renderProjectItem = (project: Project, icon: React.ReactNode) => (
    <div 
        key={project.id}
        onClick={() => dispatch({ type: 'SELECT_PROJECT', payload: project.id })}
        className={`group flex items-center justify-between py-2 px-2.5 rounded-md cursor-pointer transition-all mb-0.5
        ${selectedProjectId === project.id 
            ? 'bg-indigo-500/10 text-indigo-100 border border-indigo-500/20' 
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
            className: `w-3.5 h-3.5 ${selectedProjectId === project.id ? 'text-indigo-400' : 'text-zinc-500'}` 
        }) : icon}
        <span className="text-sm truncate font-medium leading-none pb-0.5">
            {project.name}
        </span>
      </div>
      <div className="hidden group-hover:flex items-center opacity-60 hover:opacity-100">
         <MoreHorizontal className="w-3.5 h-3.5" />
      </div>
    </div>
  );

  // --- MODULE TREES ---

  const renderReviewTree = () => {
    const active = filteredProjects.filter(p => p.status === 'active');
    const finalized = filteredProjects.filter(p => p.status === 'finalized');

    return (
        <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
            {/* Top: Active Projects */}
            <div style={{ height: `${splitRatio}%` }} className="overflow-y-auto p-3 custom-scrollbar">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active Projects
                </div>
                
                {isCreating && (
                    <div className="mb-2 p-3 bg-zinc-900 border border-indigo-500/50 rounded-md space-y-2">
                        <input 
                            autoFocus
                            type="text" 
                            value={newProjectData.name}
                            onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})}
                            className="w-full bg-zinc-950 text-sm px-2 py-1.5 rounded border border-zinc-700 focus:outline-none focus:border-indigo-500"
                            placeholder="Project Name"
                        />
                        <input 
                            type="text" 
                            value={newProjectData.client}
                            onChange={(e) => setNewProjectData({...newProjectData, client: e.target.value})}
                            className="w-full bg-zinc-950 text-xs px-2 py-1.5 rounded border border-zinc-700 focus:outline-none focus:border-indigo-500"
                            placeholder="Client Name"
                        />
                         <select 
                            value={newProjectData.group}
                            onChange={(e) => setNewProjectData({...newProjectData, group: e.target.value})}
                            className="w-full bg-zinc-950 text-xs px-2 py-1.5 rounded border border-zinc-700 focus:outline-none"
                         >
                             <option>Commercials</option>
                             <option>Social</option>
                             <option>Long Form</option>
                         </select>
                        <div className="flex justify-end gap-2 pt-1">
                            <button onClick={() => setIsCreating(false)} className="text-[10px] px-2 py-1 hover:bg-zinc-800 rounded">Cancel</button>
                            <button onClick={handleConfirmCreate} className="text-[10px] px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500">Create</button>
                        </div>
                    </div>
                )}
                
                {active.map(p => renderProjectItem(p, <Folder className="fill-current" />))}
            </div>

            {/* Resizer */}
            <div 
                onMouseDown={handleMouseDown}
                className="h-1 bg-zinc-900 border-y border-zinc-800 cursor-row-resize hover:bg-indigo-500/20 flex justify-center items-center group shrink-0 z-10"
            >
                <div className="w-8 h-1 bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Bottom: Finalized Projects */}
            <div className="flex-1 overflow-y-auto p-3 bg-zinc-900/30 custom-scrollbar">
                 <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Finalized / Locked
                </div>
                {finalized.map(p => renderProjectItem(p, <Check className="text-orange-500" />))}
            </div>
        </div>
    );
  };

  const renderDeliveryTree = () => {
    const pending = filteredProjects.filter(p => p.status === 'finalized');
    const delivered = filteredProjects.filter(p => p.status === 'delivered');

    return (
        <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
             <div style={{ height: `${splitRatio}%` }} className="overflow-y-auto p-3 custom-scrollbar">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                    Pending Delivery
                </div>
                {pending.length === 0 && <div className="text-xs text-zinc-600 italic px-2">No pending items</div>}
                {pending.map(p => renderProjectItem(p, <Archive />))}
            </div>
            
            <div 
                onMouseDown={handleMouseDown}
                className="h-1 bg-zinc-900 border-y border-zinc-800 cursor-row-resize hover:bg-indigo-500/20 flex justify-center items-center group shrink-0 z-10"
            />

            <div className="flex-1 border-t border-zinc-800 bg-zinc-900/30 p-3 overflow-y-auto">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Delivered Archive
                </div>
                {delivered.map(p => renderProjectItem(p, <Check className="text-emerald-500" />))}
            </div>
        </div>
    );
  };

  const renderShowcaseTree = () => (
      <div className="flex-1 flex flex-col p-3">
          <div className="mb-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Tag Cloud</h3>
              <div className="flex flex-wrap gap-2 max-h-[128px] overflow-y-auto custom-scrollbar">
                  {['All', 'Commercials', 'Documentary', 'Social', '4K', 'Vertical', 'Drone'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => dispatch({ type: 'SET_TAG', payload: tag })}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${activeTag === tag ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                      >
                          {tag}
                      </button>
                  ))}
              </div>
          </div>
          <div className="flex-1 flex items-center justify-center border-t border-zinc-800">
               <div className="text-center text-zinc-600 text-xs">
                   <PlayCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                   Browsing {activeTag === 'All' ? 'Full Library' : activeTag}
               </div>
          </div>
      </div>
  );

  return (
    <aside className="fixed left-[64px] top-14 bottom-0 w-[320px] bg-zinc-950 border-r border-zinc-800 z-30 flex flex-col">
      
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0">
        <span className="text-sm font-semibold text-zinc-200">
            {activeModule === 'review' && 'Quick Retrieval'}
            {activeModule === 'delivery' && 'Delivery Hub'}
            {activeModule === 'showcase' && 'Case Selection'}
        </span>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-300 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          {activeModule === 'review' && (
             <button 
                onClick={handleStartCreate}
                className="p-1.5 hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-200 transition-colors"
             >
                <Plus className="w-4 h-4" />
             </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-zinc-800 shrink-0">
        <div className="relative group">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <input 
            type="text" 
            placeholder={activeModule === 'showcase' ? "Search case videos..." : "Filter projects..."}
            value={searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Content */}
      {activeModule === 'review' && renderReviewTree()}
      {activeModule === 'delivery' && renderDeliveryTree()}
      {activeModule === 'showcase' && renderShowcaseTree()}

    </aside>
  );
};
