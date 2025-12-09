
import React from 'react';
import { Play, MoreVertical, Heart, Plus, Check } from 'lucide-react';
import { useStore } from '../../App';
import { Asset } from '../../types';

export const MainBrowser: React.FC = () => {
  const { state, dispatch } = useStore();
  const { activeModule, showWorkbench, projects, selectedProjectId, assets, cart } = state;

  const project = projects.find(p => p.id === selectedProjectId);
  
  // Filter Assets based on context
  let displayAssets: Asset[] = [];
  if (activeModule === 'showcase') {
      // In showcase, show all "Case Files"
      displayAssets = assets.filter(a => a.isCaseFile);
  } else if (selectedProjectId) {
      displayAssets = assets.filter(a => a.projectId === selectedProjectId);
  }

  // Dynamic Margins
  const marginClass = `ml-[384px] pt-14 pb-10 transition-all duration-300 ease-in-out ${showWorkbench ? 'mr-[390px]' : 'mr-4'}`;

  // Header Content Logic
  const renderHeader = () => {
    if (activeModule === 'showcase') {
        return (
            <div className="flex flex-col">
                <div className="text-xs text-zinc-500 mb-1">Showcase / Asset Pool</div>
                <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Available Case Files</h1>
            </div>
        );
    }
    if (!project) return <h1 className="text-xl font-semibold text-zinc-500">Select a project...</h1>;
    
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                <span>{project.group}</span>
                <span>/</span>
                <span className={`uppercase px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider 
                    ${project.status === 'active' ? 'bg-indigo-500/10 text-indigo-400' : ''}
                    ${project.status === 'finalized' ? 'bg-orange-500/10 text-orange-400' : ''}
                    ${project.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' : ''}
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
      
      {/* Toolbar / Breadcrumbs */}
      <div className="sticky top-14 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 mb-6 flex items-center justify-between">
        {renderHeader()}
        
        {project && (
            <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">{displayAssets.length} items • {displayAssets.reduce((acc, curr) => acc + parseFloat(curr.size), 0).toFixed(1)} GB</span>
                <div className="h-4 w-px bg-zinc-800"></div>
                <button className="text-xs font-medium bg-zinc-100 text-zinc-900 px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors">
                    Select All
                </button>
            </div>
        )}
      </div>

      {/* Grid Content */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {displayAssets.map((asset) => (
          <AssetCard 
            key={asset.id} 
            asset={asset} 
            activeModule={activeModule}
            isInCart={cart.includes(asset.id)}
            onOpenReview={() => dispatch({ type: 'TOGGLE_REVIEW_MODE', payload: true })} 
            onToggleCart={() => dispatch({ type: 'TOGGLE_CART_ITEM', payload: asset.id })}
          />
        ))}
      </div>
      
      {displayAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-zinc-600">
              <div className="w-16 h-16 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 opacity-20" />
              </div>
              <p>No assets found in this view.</p>
          </div>
      )}
    </main>
  );
};

const AssetCard: React.FC<{ 
    asset: Asset; 
    activeModule: string;
    isInCart: boolean;
    onOpenReview: () => void;
    onToggleCart: () => void;
}> = ({ asset, activeModule, isInCart, onOpenReview, onToggleCart }) => {
  return (
    <div 
      className={`group relative bg-zinc-900 border rounded-lg overflow-hidden transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/50
        ${isInCart ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-zinc-800 hover:border-zinc-600'}
      `}
    >
      {/* Thumbnail Aspect Ratio 16:9 */}
      <div className="relative aspect-video bg-zinc-800 w-full overflow-hidden" onClick={onOpenReview}>
        <img 
          src={`https://picsum.photos/seed/${asset.id}/400/225`} 
          alt="Asset thumbnail" 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-indigo-500 hover:text-white">
                <Play className="w-5 h-5 fill-current pl-1" />
            </div>
        </div>

        {/* Version Badge */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-[10px] font-bold px-1.5 py-0.5 rounded text-zinc-200 border border-white/10">
            v{asset.version}
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-[10px] font-mono px-1.5 py-0.5 rounded text-zinc-200">
            {asset.duration}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-medium text-zinc-200 truncate pr-2 group-hover:text-indigo-400 transition-colors" title={asset.name}>{asset.name}</h3>
            
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
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>{asset.uploadTime} • {asset.size}</span>
            <div className="flex gap-2">
                <Heart className="w-3.5 h-3.5 hover:text-pink-500 transition-colors" />
            </div>
        </div>
      </div>
    </div>
  );
}
