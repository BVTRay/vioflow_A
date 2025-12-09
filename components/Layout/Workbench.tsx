
import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, X, Share, PlaySquare, FileCheck, ShieldAlert, MonitorPlay, GripVertical } from 'lucide-react';
import { useStore } from '../../App';
import { Video } from '../../types';

interface WorkbenchProps {
  visible: boolean;
}

export const Workbench: React.FC<WorkbenchProps> = ({ visible }) => {
  const { state, dispatch } = useStore();
  const { activeModule, selectedProjectId, selectedVideoId, projects, deliveries, cart, videos } = state;
  const project = projects.find(p => p.id === selectedProjectId);
  const delivery = deliveries.find(d => d.projectId === selectedProjectId);
  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  const [uploadProgress, setUploadProgress] = useState(0);

  if (!visible) return null;

  // --- REVIEW MODULE LOGIC ---
  const handleUpload = () => {
    // 1. Simulate finding a file
    const droppedFilename = "Nike_AirMax.mp4";
    const existingVideo = videos.find(v => v.projectId === selectedProjectId && v.name.startsWith("Nike_AirMax"));
    
    let newVersion = 1;
    let newName = droppedFilename;
    let confirmMsg = `Detected file: ${droppedFilename}.\nNo match found. Create new Video ID?`;

    // 2. Versioning Logic
    if (existingVideo) {
       if (window.confirm(`Found existing video: ${existingVideo.name} (v${existingVideo.version}).\n\nClick OK to create NEW VERSION (v${existingVideo.version + 1}).\nClick Cancel to create DISTINCT VIDEO.`)) {
           newVersion = existingVideo.version + 1;
           newName = `Nike_AirMax_v0${newVersion}.mp4`;
       } else {
           newName = `Nike_AirMax_Alt_${Date.now().toString().slice(-4)}.mp4`;
       }
    } else {
        // Simple confirm for new video
        // alert(confirmMsg); // Skipped for smoother UX
    }

    // 3. Prompt for Change Log
    const changeLog = window.prompt("Enter Change Log / Notes for this upload:", "Initial upload") || "No notes";

    // 4. Simulate Upload
    setUploadProgress(10);
    setTimeout(() => setUploadProgress(60), 600);
    setTimeout(() => {
        setUploadProgress(100);
        dispatch({
            type: 'ADD_VIDEO',
            payload: {
                id: `v${Date.now()}`,
                projectId: selectedProjectId!,
                name: newName,
                type: 'video',
                url: '',
                version: newVersion,
                uploadTime: 'Just now',
                isCaseFile: false,
                size: '1.2 GB',
                status: 'initial',
                changeLog: changeLog
            }
        });
        setTimeout(() => setUploadProgress(0), 1000);
    }, 1200);
  };

  const renderReviewWorkbench = () => {
    if (selectedVideo) {
        return (
            <div className="flex flex-col h-full">
                <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900 flex justify-between items-start">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-100">Video Details</h2>
                        <p className="text-xs text-zinc-500 mt-1">{selectedVideo.name}</p>
                    </div>
                    <button onClick={() => dispatch({ type: 'SELECT_VIDEO', payload: null })}><X className="w-4 h-4 text-zinc-500" /></button>
                </div>
                <div className="p-5 flex-1 space-y-4">
                    <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-xs space-y-2">
                        <div className="flex justify-between"><span className="text-zinc-500">Version</span><span className="text-zinc-200">v{selectedVideo.version}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">Status</span><span className="text-indigo-400 capitalize">{selectedVideo.status}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">Size</span><span className="text-zinc-200">{selectedVideo.size}</span></div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Change Log</h3>
                        <p className="text-sm text-zinc-300 bg-zinc-800/50 p-3 rounded">{selectedVideo.changeLog || "No notes provided."}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!project) return <EmptyWorkbench message="Select a project to manage videos" />;

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
                    <UploadCloud className="w-8 h-8 text-zinc-500 mb-3 group-hover:text-indigo-400 transition-colors" />
                    <p className="text-sm text-zinc-300 font-medium">Drop video files here</p>
                    <p className="text-xs text-zinc-500 mt-1">Smart Versioning Active</p>
                </div>

                <div className="bg-zinc-800/30 border border-zinc-800 rounded p-3 text-xs text-zinc-400">
                    <div className="flex items-center gap-2 mb-2 text-zinc-300 font-medium">
                        <ShieldAlert className="w-4 h-4 text-orange-400" />
                        <span>Project Status: Active</span>
                    </div>
                    <p>Videos can be uploaded and annotated. Finalizing will lock this project.</p>
                </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                 <button 
                    onClick={() => {
                        if(window.confirm("Finalize project? This will lock the project and move it to Delivery.")) {
                            dispatch({ type: 'FINALIZE_PROJECT', payload: project.id });
                        }
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20"
                 >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finalize Project</span>
                 </button>
            </div>
        </>
    );
  };

  // --- DELIVERY MODULE LOGIC ---
  const renderDeliveryWorkbench = () => {
    if (!project || !delivery) return <EmptyWorkbench message="Select a pending delivery project" />;
    
    const projectVideos = videos.filter(v => v.projectId === project.id);
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
            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900">
                <h2 className="text-sm font-semibold text-zinc-100">Delivery Checklist</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{project.name}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
                {/* 1. File Uploads */}
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Required Files</h3>
                    <div className="space-y-2">
                        <CheckItem label="Clean Feed (ProRes 422)" field="hasCleanFeed" />
                        <CheckItem label="Music Rights / Cue Sheet" field="hasMusicAuth" />
                    </div>
                </div>

                {/* 2. Case File Selection */}
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Mark Case Video</h3>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                        {projectVideos.map(v => (
                            <div key={v.id} className="flex items-center justify-between p-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-900">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <PlaySquare className="w-4 h-4 text-zinc-500 shrink-0" />
                                    <span className="text-xs text-zinc-300 truncate">{v.name}</span>
                                </div>
                                <button 
                                    onClick={() => dispatch({ type: 'TOGGLE_CASE_FILE', payload: v.id })}
                                    className={`text-[10px] px-2 py-1 rounded border transition-colors ${v.isCaseFile ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
                                >
                                    {v.isCaseFile ? 'CASE FILE' : 'MARK'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Final Checks */}
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Validation</h3>
                    <CheckItem label="Metadata Verified" field="hasMetadata" />
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
                    <FileCheck className="w-4 h-4" />
                    <span>Complete Delivery</span>
                 </button>
            </div>
        </>
    );
  };

  // --- SHOWCASE MODULE LOGIC ---
  const renderShowcaseWorkbench = () => {
    const cartItems = videos.filter(v => cart.includes(v.id));

    return (
        <>
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
                <div>
                   <h2 className="text-sm font-semibold text-zinc-100">Package Cart</h2>
                   <p className="text-xs text-zinc-500 mt-0.5">{cart.length} items selected</p>
                </div>
                <button onClick={() => {}} className="text-xs text-indigo-400 hover:text-indigo-300">Clear</button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                        <MonitorPlay className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-xs">Select case videos to build a reel</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-zinc-900 border border-zinc-800 rounded group hover:border-zinc-700">
                                <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />
                                <div className="w-10 h-10 bg-zinc-800 rounded overflow-hidden shrink-0">
                                     <img src={`https://picsum.photos/seed/${item.id}/100/100`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-zinc-200 truncate">{item.name}</div>
                                    <div className="text-[10px] text-zinc-500">{item.duration} • {item.size}</div>
                                </div>
                                <button 
                                    onClick={() => dispatch({ type: 'TOGGLE_CART_ITEM', payload: item.id })}
                                    className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
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
                    onClick={() => alert("Simulating Package Generation: \n- Microsite Created \n- Download Links Generated")}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                 >
                    <Share className="w-4 h-4" />
                    <span>Generate Package</span>
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
        {activeModule === 'settings' && <EmptyWorkbench message="Settings" />}
    </aside>
  );
};

const EmptyWorkbench: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
        <MonitorPlay className="w-10 h-10 mb-3 opacity-20" />
        <p className="text-sm">{message}</p>
    </div>
);
