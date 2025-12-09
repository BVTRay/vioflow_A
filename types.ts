
export type ModuleType = 'library' | 'review' | 'delivery' | 'showcase' | 'settings';
export type ProjectStatus = 'active' | 'finalized' | 'delivered' | 'archived';

export interface Asset {
  id: string;
  projectId: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string; // Mock URL or placeholder
  version: number;
  uploadTime: string;
  isCaseFile: boolean; // For Showcase module
  size: string;
  duration?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  lead: string;
  group: string; // e.g., "Active Projects", "Nike"
  status: ProjectStatus;
  createdDate: string;
  thumbnail?: string;
}

export interface DeliveryData {
  projectId: string;
  hasCleanFeed: boolean;
  hasMusicAuth: boolean;
  hasMetadata: boolean;
  packageLink?: string;
  sentDate?: string;
}

export interface AppState {
  activeModule: ModuleType;
  projects: Project[];
  assets: Asset[];
  deliveries: DeliveryData[]; // Track delivery status/checklists
  cart: string[]; // List of Asset IDs for Showcase
  
  // UI State
  selectedProjectId: string | null;
  isReviewMode: boolean;
  showWorkbench: boolean;
  activeDrawer: 'none' | 'transfer' | 'messages';
  
  // Retrieval Panel State
  searchTerm: string;
  activeTag: string;
}

export type Action =
  | { type: 'SET_MODULE'; payload: ModuleType }
  | { type: 'SELECT_PROJECT'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'FINALIZE_PROJECT'; payload: string } // Moves to Delivery
  | { type: 'UPDATE_DELIVERY_CHECKLIST'; payload: { projectId: string; field: keyof DeliveryData; value: boolean } }
  | { type: 'COMPLETE_DELIVERY'; payload: string } // Moves to Delivered
  | { type: 'TOGGLE_CART_ITEM'; payload: string } // For Showcase
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_TAG'; payload: string }
  | { type: 'TOGGLE_DRAWER'; payload: 'none' | 'transfer' | 'messages' }
  | { type: 'TOGGLE_REVIEW_MODE'; payload: boolean }
  | { type: 'TOGGLE_WORKBENCH'; payload: boolean };
