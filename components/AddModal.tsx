import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  title: string;
  type: 'topic' | 'subTopic' | 'question';
}

export const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onConfirm, title, type }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState(''); // URL for question
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'question') {
      onConfirm({ title: input1, url: input2, difficulty, status: 'Todo', description });
    } else {
      onConfirm({ title: input1 });
    }
    setInput1('');
    setInput2('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              {type === 'question' ? 'Problem Title' : 'Title'}
            </label>
            <input
              autoFocus
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter title..."
              required
            />
          </div>

          {type === 'question' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Problem URL</label>
                <input
                  type="url"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://leetcode.com/..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y custom-scrollbar"
                  placeholder="Paste problem description here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Difficulty</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        difficulty === d 
                        ? d === 'Easy' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-easy/20 dark:text-easy dark:border-easy' 
                          : d === 'Medium' ? 'bg-amber-100 text-amber-600 border border-amber-200 dark:bg-medium/20 dark:text-medium dark:border-medium'
                          : 'bg-rose-100 text-rose-600 border border-rose-200 dark:bg-hard/20 dark:text-hard dark:border-hard'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};