import React, { useState } from 'react';
import { Heart, Calendar, Plus, Edit2, Trash2, Check, Sparkles } from 'lucide-react';
import { LoveMilestone } from '../types.ts';
import { audioService } from '../utils/audio.ts';

interface MilestoneTimelineProps {
  milestones: LoveMilestone[];
  onAddMilestone: (newMilestone: LoveMilestone) => void;
  onUpdateMilestone: (updated: LoveMilestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    year: '2026',
    date: '25/09/2026',
    title: '',
    description: '',
    category: 'Kỷ niệm',
  });

  const handleStartAdd = () => {
    setFormData({
      year: new Date().getFullYear().toString(),
      date: '25/09/2026',
      title: '',
      description: '',
      category: 'Kỷ niệm',
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleSaveAdd = () => {
    if (!formData.title.trim()) return;
    const newM: LoveMilestone = {
      id: `m_${Date.now()}`,
      year: formData.year,
      date: formData.date,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      iconName: 'heart',
    };
    onAddMilestone(newM);
    setIsAdding(false);
    audioService.playChime();
  };

  const handleStartEdit = (m: LoveMilestone) => {
    setEditingId(m.id);
    setFormData({
      year: m.year,
      date: m.date,
      title: m.title,
      description: m.description,
      category: m.category,
    });
    setIsAdding(false);
  };

  const handleSaveEdit = (id: string) => {
    const existing = milestones.find((m) => m.id === id);
    if (!existing) return;
    onUpdateMilestone({
      ...existing,
      year: formData.year,
      date: formData.date,
      title: formData.title,
      description: formData.description,
      category: formData.category,
    });
    setEditingId(null);
    audioService.playChime();
  };

  return (
    <section id="milestones" className="py-16 md:py-24 border-b border-stone-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-sans tracking-wide mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hành Trình 7 Năm</span>
              <span aria-hidden="true">·</span>
              <span>2019 Đến 2026</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-100 font-bold tracking-tight">
              Từng Cột Mốc Tình Yêu Của Hai Đứa
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-xl font-sans">
              Từ cái gật đầu bẽn lẽn mùa thu 25/09/2019 cho tới hiện tại, mỗi bước chân cùng em đều là món quà quý giá nhất.
            </p>
          </div>

          <button
            onClick={handleStartAdd}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-rose-400" />
            <span>Thêm Kỷ Niệm Mới</span>
          </button>
        </div>

        {/* Add New Milestone Card (if active) */}
        {isAdding && (
          <div className="mb-8 p-6 bg-stone-900 border border-rose-500/30 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-rose-300">
              <span>Thêm Một Khoảnh Khắc Đáng Nhớ</span>
              <button
                onClick={() => setIsAdding(false)}
                className="text-stone-400 hover:text-stone-200 text-xs"
              >
                Hủy bỏ
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Năm (ví dụ: 2026)"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
              />
              <input
                type="text"
                placeholder="Ngày tháng (ví dụ: 25/09/2026)"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
              />
              <input
                type="text"
                placeholder="Chủ đề (ví dụ: Chuyến đi xa, Lời hứa)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
              />
            </div>
            <input
              type="text"
              placeholder="Tên kỷ niệm (ví dụ: Nụ hôn dưới mưa)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
            />
            <textarea
              rows={3}
              placeholder="Kể lại cảm xúc và câu chuyện hôm ấy..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveAdd}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Lưu Khoảnh Khắc</span>
              </button>
            </div>
          </div>
        )}

        {/* Timeline List */}
        <div className="relative border-l border-rose-500/20 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
          {milestones.map((m, index) => {
            const isEditing = editingId === m.id;
            const isSelected = selectedMilestone === m.id;

            return (
              <div key={m.id} className="relative group">
                {/* Timeline node heart dot */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    m.year === '2026' || m.year === '2019'
                      ? 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-900/40'
                      : 'bg-stone-900 border-stone-700 text-rose-400 group-hover:border-rose-400'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>

                {/* Milestone Content Card */}
                <div
                  onClick={() => setSelectedMilestone(isSelected ? null : m.id)}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900/90 border-rose-500/40 shadow-lg'
                      : 'bg-stone-900/50 hover:bg-stone-900/80 border-stone-800'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="px-2 py-1 bg-stone-950 border border-stone-700 rounded text-xs text-stone-200"
                        />
                        <input
                          type="text"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="px-2 py-1 bg-stone-950 border border-stone-700 rounded text-xs text-stone-200"
                        />
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="px-2 py-1 bg-stone-950 border border-stone-700 rounded text-xs text-stone-200"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-2 py-1 bg-stone-950 border border-stone-700 rounded text-xs text-stone-200 font-semibold"
                      />
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 bg-stone-950 border border-stone-700 rounded text-xs text-stone-200"
                      />
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-stone-800 text-stone-300 rounded text-xs"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleSaveEdit(m.id)}
                          className="px-3 py-1 bg-rose-600 text-white rounded text-xs flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Lưu</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Unboxed Metadata Header (No static pills) */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400 font-sans mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-rose-400 tabular-nums">
                            {m.year}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{m.date}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-300 font-medium">{m.category}</span>
                        </div>

                        {/* Action buttons (functional, allowed) */}
                        <div
                          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleStartEdit(m)}
                            className="p-1 text-stone-400 hover:text-stone-200 rounded"
                            title="Sửa mốc này"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {milestones.length > 3 && (
                            <button
                              onClick={() => onDeleteMilestone(m.id)}
                              className="p-1 text-stone-400 hover:text-rose-400 rounded"
                              title="Xóa mốc"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Milestone Title */}
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-100 mb-2">
                        {String(index + 1).padStart(2, '0')}. {m.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-stone-300 leading-relaxed font-sans">
                        {m.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
