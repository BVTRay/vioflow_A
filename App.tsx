
import React, { useReducer, createContext, useContext } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { RetrievalPanel } from './components/Layout/RetrievalPanel';
import { Workbench } from './components/Layout/Workbench';
import { MainBrowser } from './components/Layout/MainBrowser';
import { ReviewOverlay } from './components/Layout/ReviewOverlay';
import { Drawer } from './components/UI/Drawer';
import { AppState, Action, Project, Video, DeliveryData } from './types';
import { FileUp, CheckCircle, BellRing } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: '2412_Nike_AirMax_Holiday', client: 'Nike', lead: 'Sarah D.', postLead: 'Mike', group: 'Commercials', status: 'active', createdDate: '2024-12-01' },
  { id: 'p2', name: '2501_Spotify_Wrapped_Asia', client: 'Spotify', lead: 'Alex', postLead: 'Jen', group: 'Social', status: 'active', createdDate: '2025-01-10' },
  { id: 'p3', name: '2411_Netflix_Docu_S1', client: 'Netflix', lead: 'Jessica', postLead: 'Tom', group: 'Long Form', status: 'finalized', createdDate: '2024-11-05' },
  { id: 'p4', name: '2410_Porsche_911_Launch', client: 'Porsche', lead: 'Tom', postLead: 'Sarah', group: 'Commercials', status: 'delivered', createdDate: '2024-10-20' },
];

const INITIAL_VIDEOS: Video[] = [
  { id: 'v1', projectId: 'p1', name: 'Nike_AirMax_v04.mp4', type: 'video', url: '', version: 4, uploadTime: '2 hrs ago', isCaseFile: false, size: '2.4 GB', duration: '00:01:30', status: 'initial' },
  { id: 'v2', projectId: 'p1', name: 'Nike_AirMax_v03.mp4', type: 'video', url: '', version: 3, uploadTime: 'Yesterday', isCaseFile: false, size: '2.4 GB', duration: '00:01:30', status: 'annotated' },
  { id: 'v3', projectId: 'p4', name: 'Porsche_Launch_Master.mov', type: 'video', url: '', version: 12, uploadTime: '2 weeks ago', isCaseFile: true, size: '42 GB', duration: '00:00:60', status: 'approved' },
  { id: 'v4', projectId: 'p3', name: 'Netflix_Ep1_Lock.mp4', type: 'video', url: '', version: 8, uploadTime: '3 days ago', isCaseFile: false, size: '1.8 GB', duration: '00:45:00', status: 'initial' },
];

const INITIAL_DELIVERIES: DeliveryData[] = [
  { projectId: 'p3', hasCleanFeed: true, hasMusicAuth: false, hasMetadata: true }, // Pending
  { projectId: 'p4', hasCleanFeed: true, hasMusicAuth: true, hasMetadata: true, sentDate: '2024-10-25' }, // Delivered
];

const initialState: AppState = {
  activeModule: 'review',
  projects: INITIAL_PROJECTS,
  videos: INITIAL_VIDEOS,
  deliveries: INITIAL_DELIVERIES,
  cart: [],
  selectedProjectId: 'p1',
  selectedVideoId: null,
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
        selectedProjectId: null, 
        selectedVideoId: null,
        searchTerm: '',
        showWorkbench: true 
      };
    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload, selectedVideoId: null };
    case 'SELECT_VIDEO':
      return { ...state, selectedVideoId: action.payload, showWorkbench: true };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects], selectedProjectId: action.payload.id };
    case 'ADD_VIDEO':
      return { ...state, videos: [action.payload, ...state.videos] };
    case 'FINALIZE_PROJECT': {
      // Move to delivery: Status 'finalized', ensure delivery record exists
      const updatedProjects = state.projects.map(p => 
        p.id === action.payload ? { ...p, status: 'finalized' as const } : p
      );
      const deliveryExists = state.deliveries.find(d => d.projectId === action.payload);
      const newDeliveries = deliveryExists 
        ? state.deliveries 
        : [...state.deliveries, { projectId: action.payload, hasCleanFeed: false, hasMusicAuth: false, hasMetadata: false }];
      
      return { ...state, projects: updatedProjects, deliveries: newDeliveries, selectedProjectId: null };
    }
    case 'COMPLETE_DELIVERY': {
      const updatedProjects = state.projects.map(p => 
        p.id === action.payload ? { ...p, status: 'delivered' as const } : p
      );
      return { ...state, projects: updatedProjects, selectedProjectId: null };
    }
    case 'UPDATE_DELIVERY_CHECKLIST': {
      return {
        ...state,
        deliveries: state.deliveries.map(d => 
          d.projectId === action.payload.projectId ? { ...d, [action.payload.field]: action.payload.value } : d
        )
      };
    }
    case 'TOGGLE_CASE_FILE':
      return {
        ...state,
        videos: state.videos.map(v => v.id === action.payload ? { ...v, isCaseFile: !v.isCaseFile } : v)
      };
    case 'UPDATE_VIDEO_STATUS':
      return {
        ...state,
        videos: state.videos.map(v => v.id === action.payload.videoId ? { ...v, status: action.payload.status } : v)
      };
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

        <Drawer 
          isOpen={state.activeDrawer === 'transfer'} 
          onClose={() => dispatch({ type: 'TOGGLE_DRAWER', payload: 'none' })} 
          title="Transfer Status"
        >
            {renderTransferContent()}
        </Drawer>

        <Drawer 
          isOpen={state.activeDrawer === 'messages'} 
          onClose={() => dispatch({ type: 'TOGGLE_DRAWER', payload: 'none' })} 
          title="Notifications"
        >
            <div className="p-4 text-zinc-500 text-sm">No new notifications.</div>
        </Drawer>

      </div>
    </StoreContext.Provider>
  );
};

export default App;
