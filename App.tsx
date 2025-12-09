
import React, { useReducer, createContext, useContext, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { RetrievalPanel } from './components/Layout/RetrievalPanel';
import { Workbench } from './components/Layout/Workbench';
import { MainBrowser } from './components/Layout/MainBrowser';
import { ReviewOverlay } from './components/Layout/ReviewOverlay';
import { Drawer } from './components/UI/Drawer';
import { AppState, Action, Project, Asset, DeliveryData } from './types';
import { FileUp, CheckCircle } from 'lucide-react';

// --- MOCK DATA INITIALIZATION ---
const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: '2410_Nike_AirMax_Launch', client: 'Nike', lead: 'Sarah D.', group: 'Commercials', status: 'active', createdDate: '2024-10-01' },
  { id: 'p2', name: '2411_Spotify_Wrapped', client: 'Spotify', lead: 'Mike R.', group: 'Social', status: 'active', createdDate: '2024-11-15' },
  { id: 'p3', name: '2409_Netflix_Docu_S1', client: 'Netflix', lead: 'Jessica', group: 'Long Form', status: 'finalized', createdDate: '2024-09-10' },
  { id: 'p4', name: '2408_Porsche_911_TVC', client: 'Porsche', lead: 'Tom', group: 'Commercials', status: 'delivered', createdDate: '2024-08-20' },
];

const INITIAL_ASSETS: Asset[] = [
  { id: 'a1', projectId: 'p1', name: 'Nike_AirMax_v04.mp4', type: 'video', url: '', version: 4, uploadTime: '2 hrs ago', isCaseFile: false, size: '2.4 GB', duration: '00:01:30' },
  { id: 'a2', projectId: 'p1', name: 'Nike_AirMax_v03.mp4', type: 'video', url: '', version: 3, uploadTime: 'Yesterday', isCaseFile: false, size: '2.4 GB', duration: '00:01:30' },
  { id: 'a3', projectId: 'p4', name: 'Porsche_Final_Master.mov', type: 'video', url: '', version: 12, uploadTime: '2 weeks ago', isCaseFile: true, size: '42 GB', duration: '00:00:60' },
];

const INITIAL_DELIVERIES: DeliveryData[] = [
  { projectId: 'p3', hasCleanFeed: true, hasMusicAuth: false, hasMetadata: true }, // Pending Delivery
  { projectId: 'p4', hasCleanFeed: true, hasMusicAuth: true, hasMetadata: true, sentDate: '2024-08-25' }, // Delivered
];

const initialState: AppState = {
  activeModule: 'review', // Default to Review Module
  projects: INITIAL_PROJECTS,
  assets: INITIAL_ASSETS,
  deliveries: INITIAL_DELIVERIES,
  cart: [],
  selectedProjectId: 'p1',
  isReviewMode: false,
  showWorkbench: true,
  activeDrawer: 'none',
  searchTerm: '',
  activeTag: 'All',
};

// --- REDUCER ---
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODULE':
      return { 
        ...state, 
        activeModule: action.payload,
        selectedProjectId: null, // Reset selection on module change
        showWorkbench: true 
      };
    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects], selectedProjectId: action.payload.id };
    case 'ADD_ASSET':
      return { ...state, assets: [action.payload, ...state.assets] };
    case 'FINALIZE_PROJECT': {
      const updatedProjects = state.projects.map(p => 
        p.id === action.payload ? { ...p, status: 'finalized' as const } : p
      );
      // Auto-create delivery record
      const newDelivery: DeliveryData = { projectId: action.payload, hasCleanFeed: false, hasMusicAuth: false, hasMetadata: false };
      return { ...state, projects: updatedProjects, deliveries: [...state.deliveries, newDelivery], selectedProjectId: null };
    }
    case 'UPDATE_DELIVERY_CHECKLIST': {
      return {
        ...state,
        deliveries: state.deliveries.map(d => 
          d.projectId === action.payload.projectId ? { ...d, [action.payload.field]: action.payload.value } : d
        )
      };
    }
    case 'COMPLETE_DELIVERY': {
      const updatedProjects = state.projects.map(p => 
        p.id === action.payload ? { ...p, status: 'delivered' as const } : p
      );
      return { ...state, projects: updatedProjects, selectedProjectId: null };
    }
    case 'TOGGLE_CART_ITEM':
      const exists = state.cart.includes(action.payload);
      return {
        ...state,
        cart: exists ? state.cart.filter(id => id !== action.payload) : [...state.cart, action.payload]
      };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'SET_TAG':
      return { ...state, activeTag: action.payload };
    case 'TOGGLE_DRAWER':
      return { ...state, activeDrawer: action.payload };
    case 'TOGGLE_REVIEW_MODE':
      return { ...state, isReviewMode: action.payload };
    case 'TOGGLE_WORKBENCH':
      return { ...state, showWorkbench: action.payload };
    default:
      return state;
  }
}

// --- CONTEXT ---
export const StoreContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};

// --- APP COMPONENT ---
const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Drawer Content Logic
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
    <StoreContext.Provider value={{ state, dispatch }}>
      <div className="bg-zinc-950 min-h-screen text-zinc-200 font-sans selection:bg-indigo-500/30">
        
        <Header 
          onToggleDrawer={(d) => dispatch({ type: 'TOGGLE_DRAWER', payload: d })} 
          activeDrawer={state.activeDrawer} 
        />

        <Sidebar 
          activeModule={state.activeModule} 
          onChangeModule={(mod) => dispatch({ type: 'SET_MODULE', payload: mod })} 
        />

        <RetrievalPanel />

        <Workbench visible={state.showWorkbench} />

        <MainBrowser />

        <ReviewOverlay 
          isOpen={state.isReviewMode} 
          onClose={() => dispatch({ type: 'TOGGLE_REVIEW_MODE', payload: false })} 
        />

        {/* Drawers */}
        <Drawer 
          isOpen={state.activeDrawer === 'transfer'} 
          onClose={() => dispatch({ type: 'TOGGLE_DRAWER', payload: 'none' })} 
          title="File Transfer Center"
        >
            {renderTransferContent()}
        </Drawer>

        <Drawer 
          isOpen={state.activeDrawer === 'messages'} 
          onClose={() => dispatch({ type: 'TOGGLE_DRAWER', payload: 'none' })} 
          title="Notifications"
        >
            {renderMessagesContent()}
        </Drawer>

      </div>
    </StoreContext.Provider>
  );
};

export default App;
