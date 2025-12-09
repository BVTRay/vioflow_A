
import React from 'react';
import { ArrowLeft, MessageSquare, Mic, SkipBack, Play, SkipForward, Settings2, Download, CheckCircle } from 'lucide-react';
import { useStore } from '../../App';

interface ReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewOverlay: React.FC<ReviewOverlayProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useStore();
  const { selectedVideoId, videos } = state;
  const video = videos.find(v => v.id === selectedVideoId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-14 z-50 bg-zinc-950 flex animate-in fade-in duration-200">
      
      {/* Left: Player Area */}
      <div className="flex-1 flex flex-col relative bg-black/50">
        
        {/* Header Toolbar */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between px-6">
            <button 
                onClick={onClose}
                className="flex items-center gap-2 text-zinc-300 hover:text-white bg-zinc-900/50 hover:bg-zinc-800/80 px-4 py-2 rounded-full backdrop-blur-md transition-all border border-white/5"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Exit Review</span>
            </button>
            <div className="text-sm font-mono text-zinc-400">{video?.name || 'No Video Selected'}</div>
        </div>

        {/* Video Placeholder */}
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="aspect-video w-full max-w-5xl bg-zinc-900 rounded-lg shadow-2xl relative overflow-hidden ring-1 ring-zinc-800">
                <img 
                    src={`https://picsum.photos/seed/${video?.id || '404'}/1920/1080`} 
                    className="w-full h-full object-cover opacity-60" 
                    alt="Review Content"
                />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-white/10 hover:bg-indigo-500/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all group">
                         <Play className="w-8 h-8 fill-white text-white pl-1 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>

        {/* Bottom Controls */}
        <div className="h-24 bg-zinc-950 border-t border-zinc-800 px-8 flex flex-col justify-center gap-4">
             <div className="w-full h-1.5 bg-zinc-800 rounded-full cursor-pointer group relative">
                 <div className="absolute top-0 left-0 h-full w-[35%] bg-indigo-500 rounded-full group-hover:bg-indigo-400"></div>
                 <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
             </div>
             
             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                     <div className="flex items-center gap-4 text-zinc-400">
                         <SkipBack className="w-5 h-5 hover:text-white cursor-pointer" />
                         <Play className="w-6 h-6 hover:text-white cursor-pointer fill-current" />
                         <SkipForward className="w-5 h-5 hover:text-white cursor-pointer" />
                     </div>
                     <span className="text-xs font-mono text-indigo-400">00:02:14:05 <span className="text-zinc-600">/ 00:05:00:00</span></span>
                 </div>
                 
                 <div className="flex items-center gap-4 text-zinc-400">
                     <Settings2 className="w-5 h-5 hover:text-white cursor-pointer" />
                     <Download className="w-5 h-5 hover:text-white cursor-pointer" />
                 </div>
             </div>
        </div>
      </div>

      {/* Right: Comments Sidebar */}
      <aside className="w-[360px] bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 relative z-20">
         <div className="h-14 border-b border-zinc-800 flex items-center px-4 justify-between bg-zinc-900">
             <span className="font-semibold text-sm text-zinc-200">Comments</span>
             {video?.status !== 'annotated' && (
                 <button 
                    onClick={() => {
                        if (video) dispatch({ type: 'UPDATE_VIDEO_STATUS', payload: { videoId: video.id, status: 'annotated' } });
                        onClose();
                    }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded transition-colors"
                 >
                     <CheckCircle className="w-3.5 h-3.5" />
                     Complete
                 </button>
             )}
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-6">
             <Comment user="Sarah D." time="10:23 AM" text="Can we pull back the saturation on the reds?" timestamp="00:02:14" active />
             <Comment user="Mike R." time="11:05 AM" text="Approved for lock." timestamp="00:04:00" />
         </div>

         <div className="p-4 border-t border-zinc-800 bg-zinc-900">
             <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Add a comment at 00:02:14..." 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-4 pr-10 py-3 text-sm text-zinc-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                 />
                 <button className="absolute right-2 top-2 p-1 text-zinc-500 hover:text-indigo-400">
                     <Mic className="w-4 h-4" />
                 </button>
             </div>
         </div>
      </aside>
    </div>
  );
};

const Comment: React.FC<{ user: string, time: string, text: string, timestamp: string, active?: boolean }> = ({ user, time, text, timestamp, active }) => (
    <div className={`flex gap-3 group ${active ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
        <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center shrink-0 text-xs font-bold text-indigo-300">
            {user.charAt(0)}
        </div>
        <div className="flex-1">
            <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-semibold text-zinc-200">{user}</span>
                <span className="text-[10px] text-zinc-500">{time}</span>
            </div>
            <div className={`p-3 rounded-lg border text-sm leading-relaxed ${active ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-100' : 'bg-zinc-800/50 border-zinc-800 text-zinc-400'}`}>
                {text}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded cursor-pointer hover:bg-indigo-500/20">{timestamp}</span>
                <button className="text-[10px] text-zinc-500 hover:text-zinc-300">Reply</button>
            </div>
        </div>
    </div>
)
