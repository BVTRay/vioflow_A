
import React from 'react';
import { Play, MoreVertical, Plus, Check, Clock } from 'lucide-react';
import { useStore } from '../../App';
import { Video } from '../../types';

export const MainBrowser: React.FC = () => {
  const { state, dispatch } = useStore();
  const { activeModule, showWorkbench, projects, selectedProjectId, videos, cart, searchTerm } = state;
  const project = projects.find(p => p.id === selectedProjectId);
  
  // Content Logic
  let displayVideos: Video[] = [];
  
  if (activeModule === 'showcase') {
      // Showcase: Show all marked 'Case Files', filtered by search
      displayVideos = videos.filter(v => v.isCaseFile);
      if (searchTerm) {
          displayVideos = displayVideos.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
  } else if (selectedProjectId) {
      // Review/Delivery: Show videos for specific project
      displayVideos = videos.filter(v => v.projectId === selectedProjectId);
  }

  // Margin Calculation
  const marginClass = `ml-[384px] pt-14 pb-10 transition-all duration-300 ease-in-out ${showWorkbench ? 'mr-[390px]' : 'mr-4'}`;

  const renderHeader = () => {
    if (activeModule === 'showcase') {
        return (
            <div>
                <div className="text-xs text-zinc-500 mb-1">Showcase Library</div>
                <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Available Case Videos</h1>
            </div>
        );
    }
    if (!project) return <h1 className="text-xl font-semibold text-zinc-500">Select a project to view contents...</h1>;
    
    return (
        <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                <span>{project.client}</span>
                <span>/</span>
                <span className={`uppercase px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider 
                    ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                    ${project.status === 'finalized' ? 'bg-orange-500/10 text-orange-400' : ''}
                    ${project.status === 'delivered' ? 'bg-indigo-500/10 text-indigo-400' : ''}
                `}>
                    {project.status}
                </span>
            </div>
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">{project.name}</h1>
        </div>
    );
  };

  return (
    <main className={marginClass}>
      <div className="sticky top-14 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 mb-6 flex items-center justify-between">
        {renderHeader()}
        {project && activeModule === 'review' && (
            <div className="text-xs text-zinc-500">
                <span className="text-zinc-300">{displayVideos.length}</span> Videos
            </div>
        )}
      </div>

      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {displayVideos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            activeModule={activeModule}
            isInCart={cart.includes(video.id)}
            onThumbnailClick={() => dispatch({ type: 'TOGGLE_REVIEW_MODE', payload: true })}
            onBodyClick={() => dispatch({ type: 'SELECT_VIDEO', payload: video.id })}
            onToggleCart={() => dispatch({ type: 'TOGGLE_CART_ITEM', payload: video.id })}
          />
        ))}
      </div>
    </main>
  );
};

const VideoCard: React.FC<{ 
    video: Video; 
    activeModule: string;
    isInCart: boolean;
    onThumbnailClick: () => void;
    onBodyClick: () => void;
    onToggleCart: () => void;
}> = ({ video, activeModule, isInCart, onThumbnailClick, onBodyClick, onToggleCart }) => {
  return (
    <div 
      onClick={onBodyClick}
      className={`group relative bg-zinc-900 border rounded-lg overflow-hidden transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/50
        ${isInCart ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-zinc-800 hover:border-zinc-600'}
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-zinc-800 w-full overflow-hidden">
        <div onClick={(e) => { e.stopPropagation(); onThumbnailClick(); }} className="w-full h-full relative group/thumb">
             <img 
                src={`https://picsum.photos/seed/${video.id}/400/225`} 
                alt="Thumbnail" 
                className="w-full h-full object-cover opacity-80 group-hover/thumb:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 scale-75 group-hover/thumb:scale-100 transition-all duration-200 hover:bg-indigo-500 hover:text-white">
                    <Play className="w-4 h-4 fill-current pl-0.5" />
                </div>
            </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
            <span className="bg-black/70 backdrop-blur-md text-[10px] font-bold px-1.5 py-0.5 rounded text-zinc-200 border border-white/10">v{video.version}</span>
            {video.status === 'annotated' && <span className="bg-indigo-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-white">Annotated</span>}
            {video.status === 'approved' && <span className="bg-emerald-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-white">Approved</span>}
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-[10px] font-mono px-1.5 py-0.5 rounded text-zinc-200">
            {video.duration}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-medium text-zinc-200 truncate pr-2 group-hover:text-indigo-400 transition-colors" title={video.name}>{video.name}</h3>
            
            {activeModule === 'showcase' ? (
                <button 
                    onClick={(e) => { e.stopPropagation(); onToggleCart(); }}
                    className={`p-1 rounded transition-colors ${isInCart ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                    {isInCart ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
            ) : (
                <button className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                </button>
            )}
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {video.uploadTime}</span>
            <span>{video.size}</span>
        </div>
      </div>
    </div>
  );
}
