import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { RetrievalPanel } from './components/Layout/RetrievalPanel';
import { Workbench } from './components/Layout/Workbench';
import { MainBrowser } from './components/Layout/MainBrowser';
import { ReviewOverlay } from './components/Layout/ReviewOverlay';
import { Drawer } from './components/UI/Drawer';
import { AppState, ModuleType } from './types';
import { FileUp, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  // Global App State
  const [activeModule, setActiveModule] = useState<ModuleType>('library');
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showWorkbench, setShowWorkbench] = useState(true);
  const [activeDrawer, setActiveDrawer] = useState<AppState['activeDrawer']>('none');

  // Drawer Content Generators
  const renderTransferContent = () => (
    <div className="space-y-6">
        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <FileUp className="w-5 h-5 text-indigo-400 animate-bounce" />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-zinc-200">Uploading 42 files</h4>
                    <p className="text-xs text-zinc-500 mt-1">Target: /Projects/Nike/Raw</p>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[65%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                        <span>1.2 GB / 4.5 GB</span>
                        <span>2m 30s remaining</span>
                    </div>
                </div>
            </div>
        </div>
        
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Completed Today</h3>
        {[1, 2, 3].map(i => (
             <div key={i} className="flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-zinc-800">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 truncate">render_v0{i}_final.mp4</p>
                    <p className="text-xs text-zinc-500">To: External Drive A</p>
                </div>
             </div>
        ))}
    </div>
  );

  const renderMessagesContent = () => (
      <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-4 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors border-b border-zinc-800/50 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span className="font-semibold text-sm text-zinc-200">System Notification</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">2m ago</span>
                  </div>
                  <p className="text-sm text-zinc-400 pl-4">Render job #4492 completed successfully. Click to review output.</p>
              </div>
          ))}
      </div>
  );

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-200 font-sans selection:bg-indigo-500/30">
      
      {/* 1. Top Banner */}
      <Header 
        onToggleDrawer={setActiveDrawer} 
        activeDrawer={activeDrawer} 
      />

      {/* 2. Sidebar */}
      <Sidebar 
        activeModule={activeModule} 
        onChangeModule={(mod) => {
            setActiveModule(mod);
            if (mod === 'review') setShowWorkbench(false);
            else setShowWorkbench(true);
        }} 
      />

      {/* 3. Retrieval Panel (Search Tree) */}
      <RetrievalPanel activeModule={activeModule} />

      {/* 4. Workbench (Floating Right Panel) */}
      <Workbench 
        visible={showWorkbench} 
        onClose={() => setShowWorkbench(false)} 
      />

      {/* 5. Main Browser (Center Content) */}
      <MainBrowser 
        showWorkbench={showWorkbench} 
        onOpenReview={() => setIsReviewMode(true)} 
      />

      {/* 6. Review Mode Overlay */}
      <ReviewOverlay 
        isOpen={isReviewMode} 
        onClose={() => setIsReviewMode(false)} 
      />

      {/* 7. Drawers */}
      <Drawer 
        isOpen={activeDrawer === 'transfer'} 
        onClose={() => setActiveDrawer('none')} 
        title="File Transfer Center"
      >
          {renderTransferContent()}
      </Drawer>

      <Drawer 
        isOpen={activeDrawer === 'messages'} 
        onClose={() => setActiveDrawer('none')} 
        title="Notifications"
      >
          {renderMessagesContent()}
      </Drawer>

    </div>
  );
};

export default App;