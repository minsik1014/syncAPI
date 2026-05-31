import React from 'react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  projectName: string;
  setProjectName: (name: string) => void;
  projectDescription: string;
  setProjectDescription: (desc: string) => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onCreate,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
}: CreateProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[3rem] max-w-lg w-full p-12 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16" />
        <h3 className="text-3xl font-black text-gray-900 mb-8 relative z-10">Create Project</h3>
        <div className="space-y-6 relative z-10">
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Shopping Mall API"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all font-medium"
              autoFocus
            />
          </div>
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all font-medium resize-none"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-10 relative z-10">
          <button onClick={onClose} className="flex-1 px-8 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Cancel</button>
          <button onClick={onCreate} className="flex-2 px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-black text-sm shadow-xl shadow-gray-200 active:scale-95">Create Now</button>
        </div>
      </div>
    </div>
  );
}
