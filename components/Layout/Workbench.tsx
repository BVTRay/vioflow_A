
import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, X, Share, PlaySquare, FileCheck, ShieldAlert, MonitorPlay, GripVertical, FileVideo, AlertCircle, GitBranch, PlusSquare, History, ArrowRight, Tag, Upload, FileText, CheckSquare, Square, Copyright, BadgeCheck } from 'lucide-react';
import { useStore } from '../../App';
import { Video, DeliveryData } from '../../types';

interface WorkbenchProps {
  visible: boolean;
}

export const Workbench: React.FC<WorkbenchProps> = ({ visible }) => {
  const { state, dispatch } = useStore();
  const { activeModule, selectedProjectId, selectedVideoId, projects, deliveries, cart, videos } = state;
  const project = projects.find(p => p.id === selectedProjectId);
  const delivery = deliveries.find(d => d.projectId === selectedProjectId);
  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload Configuration Modal State
  const [uploadConfig, setUploadConfig] = useState<{
      isOpen: boolean;
      file: File | null;
      conflictMode: 'iterate' | 'new'; // Renamed to match logic
      existingVideo?: Video;
      nextVersion: number;
      changeLog: string;
  }>({
      isOpen: false,
      file: null,
      conflictMode: 'new',
      nextVersion: 1,
      changeLog: ''
  });

  // Local state for Tag Input in Delivery
  const [tagInput, setTagInput] = useState('');

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          processFileSelection(e.dataTransfer.files[0]);
      }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          processFileSelection(e.target.files[0]);
      }
  };

  const processFileSelection = (file: File) => {
      if (!project) return;

      // Logic: Strip version prefix "vXX_" to match base names
      const cleanName = file.name.replace(/^v\d+_/, '');
      
      // Find any video in this project that shares the same base name
      const matchedVideo = videos.find(v => 
          v.projectId === project.id && 
          v.name.replace(/^v\d+_/, '') === cleanName
      );

      let nextVer = 1;
      let conflictMode: 'iterate' | 'new' = 'new';

      if (matchedVideo) {
          conflictMode = 'iterate'; // Default to iterate if match found
          // Find max version of this "series"
          const seriesVersions = videos
              .filter(v => v.projectId === project.id && v.name.replace(/^v\d+_/, '') === cleanName)
              .map(v => v.version);
          const maxVer = Math.max(0, ...seriesVersions);
          nextVer = maxVer + 1;
      }

      setUploadConfig({
          isOpen: true,
          file: file,
          conflictMode: conflictMode,
          existingVideo: matchedVideo,
          nextVersion: nextVer,
          changeLog: ''
      });
  };

  const startUpload = () => {
      if (!uploadConfig.file || !project) return;

      setUploadConfig(prev => ({ ...prev, isOpen: false }));

      // Generate Final Filename
      const baseName = uploadConfig.file.name.replace(/^v\d+_/, '');
      
      const versionPrefix = uploadConfig.conflictMode === 'iterate' 
          ? `v${uploadConfig.nextVersion}_` 
          : `v1_`;
      
      const finalName = `${versionPrefix}${baseName}`;
      const finalVersion = uploadConfig.conflictMode === 'iterate' ? uploadConfig.nextVersion : 1;

      const uploadId = `u_${Date.now()}`;

      // 1. Add to Global Queue
      dispatch({
          type: 'ADD_UPLOAD',
          payload: {
              id: uploadId,
              filename: finalName,
              progress: 0,
              status: 'uploading',
              targetProjectName: project.name
          }
      });

      // 2. Open Transfer Drawer to show progress
      dispatch({ type: 'TOGGLE_DRAWER', payload: 'transfer' });

      // 3. Simulate Progress
      let progress = 0;
      const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress > 100) progress = 100;

          dispatch({
              type: 'UPDATE_UPLOAD_PROGRESS',
              payload: { id: uploadId, progress: Math.floor(progress) }
          });

          if (progress === 100) {
              clearInterval(interval);
              setTimeout(() => {
                  // Finish
                  dispatch({ type: 'COMPLETE_UPLOAD', payload: uploadId });
                  dispatch({
                      type: 'ADD_VIDEO',
                      payload: {
                          id: `v${Date.now()}`,
                          projectId: project.id,
                          name: finalName,
                          type: 'video',
                          url: '',
                          version: finalVersion,
                          uploadTime: '刚刚',
                          isCaseFile: false,
                          size: (uploadConfig.file!.size / (1024 * 1024)).toFixed(1) + ' MB',
                          duration: '00:00:00', // Mocked
                          resolution: '1920x1080', // Mocked
                          status: 'initial',
                          changeLog: uploadConfig.changeLog || '上传新文件'
                      }
                  });
              }, 800);
          }
      }, 300);
  };


  const handleClose = () => {
      dispatch({ type: 'TOGGLE_WORKBENCH', payload: false });
  };

  // --- REVIEW WORKBENCH ---
  const renderReviewWorkbench = () => {
    if (selectedVideo) {
        // Find historical versions of this video (same project, same base name)
        const baseName = selectedVideo.name.replace(/^v\d+_/, '');
        const historyVersions = videos.filter(v => 
            v.projectId === selectedVideo.projectId && 
            v.name.replace(/^v\d+_/, '') === baseName
        ).sort((a, b) => b.version - a.version); // Sort Descending (Newest first)

        return (
            <div className="flex flex-col h-full">
                <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900 flex justify-between items-start">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-100">视频详情</h2>
                        <p className="text-xs text-zinc-500 mt-1 truncate max-w-[200px]">{selectedVideo.name}</p>
                    </div>
                    <button onClick={() => dispatch({ type: 'SELECT_VIDEO', payload: null })}><X className="w-4 h-4 text-zinc-500 hover:text-zinc-200" /></button>
                </div>
                <div className="p-5 flex-1 space-y-5 overflow-y-auto custom-scrollbar">
                    {/* Preview */}
                    <div className="aspect-video bg-zinc-950 rounded border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
                         <img src={`https://picsum.photos/seed/${selectedVideo.id}/400/225`} className="w-full h-full object-cover opacity-60" />
                         <PlaySquare className="w-10 h-10 text-white opacity-80" />
                    </div>

                    {/* Metadata */}
                    <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-xs space-y-2">
                        <div className="flex justify-between"><span className="text-zinc-500">版本</span><span className="text-zinc-200 font-mono">v{selectedVideo.version}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">分辨率</span><span className="text-zinc-200">{selectedVideo.resolution || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">时长</span><span className="text-zinc-200">{selectedVideo.duration}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">状态</span><span className="text-indigo-400 capitalize">{selectedVideo.status === 'initial' ? '初次上传' : selectedVideo.status === 'annotated' ? '已批注' : '已定版'}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">大小</span><span className="text-zinc-200">{selectedVideo.size}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">上传时间</span><span className="text-zinc-200">{selectedVideo.uploadTime}</span></div>
                    </div>
                    
                    {/* Change Log */}
                    <div>
                        <h3