import React from 'react';
import { Play, MoreVertical, Heart, Share2 } from 'lucide-react';

interface MainBrowserProps {
  showWorkbench: boolean;
  onOpenReview: () => void;
}

export const MainBrowser: React.FC<MainBrowserProps> = ({ showWorkbench, onOpenReview }) => {
  // Calculate dynamic margins based on panel visibility
  // ml-[384px] = 64px (Sidebar) + 320px (Retrieval)
  // mr-[390px] = 360px (Workbench) + 15px (Gap) + 15px (Right Edge) OR mr-4
  const marginClass = `ml-[384px] pt-14 pb-10 transition-all duration-300 ease-in-out ${showWorkbench ? 'mr-[390px]' : 'mr-4'}`;

  return (
    <main className={marginClass}>
      
      {/* Toolbar / Breadcrumbs */}
      <div className="sticky top-14 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 mb-6 flex items-center justify-between">
        <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                <span>Active Projects</span>
                <span>/</span>
                <span>Nike - Air Max Campaign</span>
            </div>
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Daily Dailies - Day 04</h1>
        </div>
        
        <div className="flex items-center gap-3">
             <span className="text-xs text-zinc-500">14 items • 2.4 GB</span>
             <div className="h-4 w-px bg-zinc-800"></div>
             <button className="text-xs font-medium bg-zinc-100 text-zinc-900 px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors">
                Select All
             </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <AssetCard key={i} index={i} onClick={onOpenReview} />
        ))}
      </div>
    </main>
  );
};

const AssetCard: React.FC<{ index: number, onClick: () => void }> = ({ index, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-600 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/50"
    >
      {/* Thumbnail Aspect Ratio 16:9 */}
      <div className="relative aspect-video bg-zinc-800 w-full overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${index + 42}/400/225`} 
          alt="Asset thumbnail" 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-indigo-500 hover:text-white">
                <Play className="w-5 h-5 fill-current pl-1" />
            </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-[10px] font-mono px-1.5 py-0.5 rounded text-zinc-200">
            00:02:14:05
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-medium text-zinc-200 truncate pr-2 group-hover:text-indigo-400 transition-colors">A00{index + 1}_C014_0823_TH.mov</h3>
            <button className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
            </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>RAW • 4K</span>
            <div className="flex gap-2">
                <Heart className="w-3.5 h-3.5 hover:text-pink-500 transition-colors" />
            </div>
        </div>
      </div>
    </div>
  );
}