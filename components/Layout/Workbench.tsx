
import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ChevronRight, X, Film, Clock, User, ShieldCheck, Box, Share, GripVertical } from 'lucide-react';
import { useStore } from '../../App';

interface WorkbenchProps {
  visible: boolean;
  onClose?: () => void;
}

export const Workbench: React.FC<WorkbenchProps> = ({ visible, onClose }) => {
  const { state, dispatch } = useStore();
  const { activeModule, selectedProjectId, projects, deliveries, cart, assets } = state;
  const project = projects.find(p => p.id === selectedProjectId);
  const delivery = deliveries.find(d => d.projectId === selectedProjectId);

  const [uploadProgress, setUploadProgress] = useState(0);

  if (!visible) return null;

  // --- REVIEW MODULE LOGIC ---
  const handleUpload = () => {
    // Simulate Upload & Versioning Check
    const filename = "Nike_AirMax.mp4";
    const existing = assets.find(a => a.projectId === selectedProjectId && a.name.includes("Nike_AirMax"));
    
    let version = 1;
    let name = filename;

    if (existing) {
        const isNewVersion = window.confirm(`A file named "${existing.name}" already exists. \n\nCreate new version (v${existing.version + 1})?`);
        if (isNewVersion) {
            version = existing.version + 1;
            name = `Nike_AirMax_v0${version}.mp4`;
        } else {
            name = `Nike_AirMax_Copy.mp4`;
        }
    }

    setUploadProgress(10);
    setTimeout(() => setUploadProgress(50), 500);
    setTimeout(() => {
        setUploadProgress(100);
        dispatch({
            type: 'ADD_ASSET',
            payload: {
                id: `a${Date.now()}`,
                projectId: selectedProjectId!,
                name: name,
                type: 'video',
                url: '',
                version: version,
                uploadTime: 'Just now',
                isCaseFile: false,
                size: '1.2 GB'
            }
        });
        setTimeout(() => setUploadProgress(0), 1000);
    }, 1200);
  };

  const renderReviewWorkbench = () => {
    if (!project) return <EmptyWorkbench message="Select a project to manage assets" />;

    return (
        <>
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
                <div>
                   <h2 className="text-sm font-semibold text-zinc-100">Ingest & Review</h2>
                   <p className="text-xs text-zinc-500 mt-0.5">{project.name}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {/* Upload Zone */}
                <div onClick={handleUpload} className="border-2 border-dashed border-zinc-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group mb-6 relative overflow-hidden">
                    {uploadProgress > 0 && (
                        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center z-10">
                            <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-indigo-500 animate-spin"></div>
                        </div>
                    )}
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-sm text-zinc-300 font-medium">Click to upload assets</p>
                    <p className="text-xs text-zinc-500 mt-1">Smart Versioning Active</p>
                </div>

                <div className="space-y-4">
                     <div className="flex items-center gap-2 text-xs text-zinc-400">
                         <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                         <span>Project is unlocked for editing</span>
                     </div>
                </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                 <button 
                    onClick={() => {
                        if(window.confirm("Finalize project? This will lock the project and move it to delivery.")) {
                            dispatch({ type: 'FINALIZE_PROJECT', payload: project.id });
                        }
                    }}
                    className="w-full bg-orange-600/90 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                 >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Finalized</span>
                 </button>
                 <p className="text-[10px] text-zinc-500 text-center mt-2">Moves to Delivery Queue</p>
            </div>
        </>
    );
  };

  // --- DELIVERY MODULE LOGIC ---
  const renderDeliveryWorkbench = () => {
    if (!project || !delivery) return <EmptyWorkbench message="Select a pending delivery" />;

    const isReady = delivery.hasCleanFeed && delivery.hasMusicAuth && delivery.hasMetadata;

    const CheckItem = ({ label, field }: { label: string, field: keyof typeof delivery }) => (
        <div 
            onClick={() => dispatch({ 
                type: 'UPDATE_DELIVERY_CHECKLIST', 
                payload: { projectId: project.id, field, value: !delivery[field as keyof typeof delivery] } 
            })}
            className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors"
        >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${delivery[field as keyof typeof delivery] ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                {delivery[field as keyof typeof delivery] && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
            </div>
            <span className="text-sm text-zinc-300">{label}</span>
        </div>
    );

    return (
        <>
             <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
                <div>
                   <h2 className="text-sm font-semibold text-zinc-100">Delivery Checklist</h2>
                   <p className="text-xs text-zinc-500 mt-0.5">{project.name}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-200 mb-4">
                    Please ensure all legal documents are attached before generating the package.
                </div>

                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Requirements</h3>
                <div className="space-y-2">
                    <CheckItem label="Clean Feed Uploaded" field="hasCleanFeed" />
                    <CheckItem label="Music Rights / Cue Sheet" field="hasMusicAuth" />
                    <CheckItem label="Metadata Tags Verified" field="hasMetadata" />
                </div>
            </div>

             <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                 <button 
                    disabled={!isReady}
                    onClick={() => dispatch({ type: 'COMPLETE_DELIVERY', payload: project.id })}
                    className={`w-full font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all
                        ${isReady 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                 >
                    <Box className="w-4 h-4" />
                    <span>Complete Delivery</span>
                 </button>
            </div>
        </>
    );
  };

  // --- SHOWCASE MODULE LOGIC ---
  const renderShowcaseWorkbench = () => {
    const cartItems = assets.filter(a => cart.includes(a.id));

    return (
        <>
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
                <div>
                   <h2 className="text-sm font-semibold text-zinc-100">Curated Playlist</h2>
                   <p className="text-xs text-zinc-500 mt-0.5">{cart.length} items selected</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {cartItems.length === 0 ? (
                    <div className="text-center mt-10 text-zinc-500 px-4">
                        <p className="text-sm mb-2">Your cart is empty.</p>
                        <p className="text-xs">Add items from the browser to build a reel.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cartItems.map((item, i) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-zinc-900 border border-zinc-800 rounded group">
                                <div className="text-zinc-600 cursor-grab"><GripVertical className="w-4 h-4" /></div>
                                <div className="w-8 h-8 bg-zinc-800 rounded overflow-hidden shrink-0">
                                     <img src={`https://picsum.photos/seed/${item.id}/100/100`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-zinc-200 truncate">{item.name}</div>
                                    <div className="text-[10px] text-zinc-500">{item.duration}</div>
                                </div>
                                <button 
                                    onClick={() => dispatch({ type: 'TOGGLE_CART_ITEM', payload: item.id })}
                                    className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                 <button 
                    disabled={cart.length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                 >
                    <Share className="w-4 h-4" />
                    <span>Generate Link</span>
                 </button>
            </div>
        </>
    );
  };

  return (
    <aside className="fixed top-[70px] bottom-[15px] right-[15px] w-[360px] bg-zinc-900 rounded-xl border border-zinc-800 z-30 shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-500 ease-out">
        {activeModule === 'review' && renderReviewWorkbench()}
        {activeModule === 'delivery' && renderDeliveryWorkbench()}
        {activeModule === 'showcase' && renderShowcaseWorkbench()}
        {activeModule === 'settings' && <EmptyWorkbench message="Settings Panel" />}
        {activeModule === 'library' && <EmptyWorkbench message="Library Details" />}
    </aside>
  );
};

const EmptyWorkbench: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
        <Box className="w-10 h-10 mb-3 opacity-20" />
        <p className="text-sm">{message}</p>
    </div>
);
