export type ModuleType = 'library' | 'review' | 'delivery' | 'settings';

export interface FileNode {
  id: string;
  name: string;
  type: 'group' | 'project' | 'file';
  meta?: string;
  children?: FileNode[];
  status?: 'active' | 'archived';
}

export interface AppState {
  activeModule: ModuleType;
  isReviewMode: boolean;
  showWorkbench: boolean;
  activeDrawer: 'none' | 'transfer' | 'messages';
}

export const MOCK_TREE_DATA: FileNode[] = [
  {
    id: 'g1',
    name: 'ACTIVE PROJECTS',
    type: 'group',
    children: [
      { id: 'p1', name: 'Nike - Air Max Campaign', type: 'project', meta: 'Updated 2m ago' },
      { id: 'p2', name: 'Netflix - Docu Series', type: 'project', meta: 'In Review' },
      { id: 'p3', name: 'Spotify - Wrapper 2024', type: 'project', meta: 'Draft' },
    ]
  },
  {
    id: 'g2',
    name: 'CLIENT DELIVERIES',
    type: 'group',
    children: [
      { id: 'p4', name: 'Porsche - 911 GT3', type: 'project', meta: 'Sent' },
      { id: 'p5', name: 'Red Bull - F1 Highlights', type: 'project', meta: 'Pending' },
    ]
  },
  {
    id: 'g3',
    name: 'ASSETS LIBRARY',
    type: 'group',
    children: [
      { id: 'p6', name: 'Stock Footage - Nature', type: 'project', meta: '45 items' },
      { id: 'p7', name: 'SFX Bundle 2024', type: 'project', meta: '120 items' },
    ]
  }
];

export const MOCK_ARCHIVE_DATA: FileNode[] = [
  {
    id: 'g_arch',
    name: 'ARCHIVED (2023)',
    type: 'group',
    children: [
      { id: 'a1', name: 'Q4 Marketing Assets', type: 'project', status: 'archived' },
      { id: 'a2', name: 'Legacy Brand Kit', type: 'project', status: 'archived' },
    ]
  }
];