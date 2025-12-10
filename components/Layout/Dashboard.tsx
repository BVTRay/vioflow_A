
import React from 'react';
import { useStore } from '../../App';
import { Activity, Clock, FileVideo, CheckCircle2, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Project } from '../../types';

export const Dashboard: React.FC = () => {
  const { state, dispatch } = useStore();
  const { projects, videos, notifications } = state;

  const activeProjects = projects.filter(p => p.status === 'active');
  const finalizedProjects = projects.filter(p => p.status === 'finalized');
  const recentVideos = videos.slice(0, 4);

  // Stats Data
  const stats = [
    { label: '进行中项目', value: activeProjects.length, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: '待交付 / 定版', value: finalizedProjects.length, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: '本周上传视频', value: videos.length, icon: FileVideo, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: '已完成交付', value: projects.filter(p => p.status === 'delivered').length, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  const handleProjectClick = (projectId: string) => {
    dispatch({ type: 'SET_MODULE', payload: 'review' });
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
  };

  return (
    <main className="ml-[64px] pt-14 p-8 min-h-screen bg-zinc-950 text-zinc-200">
      
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">工作台概览</h1>
        <p className="text-zinc-500 mt-1">欢迎回来，今日有 {activeProjects.length} 个项目正在进行中。</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 hover:border-zinc-700 transition-colors">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
              <div className="text-xs text-zinc-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              最近活跃项目
            </h2>
            <button 
                onClick={() => dispatch({ type: 'SET_MODULE', payload: 'review' })}
                className="text-sm text-zinc-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
                查看全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.slice(0, 4).map(project => (
              <div 
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-zinc-900/80 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs border border-zinc-700 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-colors">
                    {project.client.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                    进行中
                  </span>
                </div>
                <h3 className="font-medium text-zinc-200 mb-1 truncate group-hover:text-indigo-300 transition-colors">{project.name}</h3>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {project.createdDate}</span>
                  <span>负责人: {project.lead}</span>
                </div>
              </div>
            ))}
            {activeProjects.length === 0 && (
                <div className="col-span-2 py-10 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-600">
                    暂无活跃项目
                </div>
            )}
          </div>

          {/* Recent Uploads Section */}
          <div className="pt-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileVideo className="w-5 h-5 text-indigo-500" />
                  最新上传资源
              </h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 text-xs font-medium text-zinc-500 border-b border-zinc-800 bg-zinc-950/50">
                      <div className="col-span-2">文件名</div>
                      <div>版本</div>
                      <div className="text-right">上传时间</div>
                  </div>
                  <div className="divide-y divide-zinc-800/50">
                      {recentVideos.map(video => (
                          <div key={video.id} className="grid grid-cols-4 gap-4 p-4 hover:bg-zinc-800/30 transition-colors">
                              <div className="col-span-2 flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                                      <FileVideo className="w-4 h-4 text-zinc-500" />
                                  </div>
                                  <span className="text-sm text-zinc-300 truncate">{video.name}</span>
                              </div>
                              <div className="flex items-center">
                                  <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-xs">v{video.version}</span>
                              </div>
                              <div className="flex items-center justify-end text-xs text-zinc-500">
                                  {video.uploadTime}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        </div>

        {/* Right Column: Notifications & Quick Actions */}
        <div className="space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-medium text-zinc-200 mb-4">快捷操作</h3>
              <div className="space-y-2">
                  <button 
                    onClick={() => dispatch({ type: 'SET_MODULE', payload: 'review' })}
                    className="w-full flex items-center justify-between p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition-colors"
                  >
                      <span>新建项目</span>
                      <span className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">+</span>
                  </button>
                  <button 
                    onClick={() => dispatch({ type: 'SET_MODULE', payload: 'delivery' })}
                    className="w-full flex items-center justify-between p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition-colors"
                  >
                      <span>前往交付中心</span>
                      <ArrowRight className="w-4 h-4 text-zinc-600" />
                  </button>
              </div>
           </div>

           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-auto">
               <h3 className="font-medium text-zinc-200 mb-4">最近消息</h3>
               <div className="space-y-4">
                   {notifications.length === 0 ? (
                       <div className="text-center text-xs text-zinc-600 py-4">暂无新消息</div>
                   ) : (
                       notifications.slice(0, 5).map(n => (
                           <div key={n.id} className="flex gap-3 items-start">
                               <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                               <div>
                                   <p className="text-sm text-zinc-300 leading-snug">{n.message}</p>
                                   <span className="text-[10px] text-zinc-500">{n.time}</span>
                               </div>
                           </div>
                       ))
                   )}
               </div>
           </div>
        </div>

      </div>
    </main>
  );
};
