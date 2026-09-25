import React, { useState } from 'react';
import { X, Heart, Check, RotateCcw } from 'lucide-react';
import { CoupleSettings } from '../types.ts';
import { defaultSettings } from '../data/anniversaryData.ts';
import { audioService } from '../utils/audio.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CoupleSettings;
  onSaveSettings: (settings: CoupleSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<CoupleSettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(formData);
    audioService.playChime();
    onClose();
  };

  const handleReset = () => {
    setFormData(defaultSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Tùy Chỉnh Kỷ Niệm Của Hai Bạn
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 font-sans text-xs">
          <div>
            <label className="block text-stone-300 font-medium mb-1">
              Ngày bắt đầu yêu nhau:
            </label>
            <input
              type="text"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-200"
              placeholder="2019-09-25T00:00:00"
            />
            <span className="text-[11px] text-stone-500 mt-1 block">
              Mặc định: 25/09/2019 (Định dạng YYYY-MM-DDTHH:mm:ss)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Tên bạn trai:</label>
              <input
                type="text"
                value={formData.hisName}
                onChange={(e) => setFormData({ ...formData, hisName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-200"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-medium mb-1">Biệt danh của anh:</label>
              <input
                type="text"
                value={formData.hisNickname}
                onChange={(e) => setFormData({ ...formData, hisNickname: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Tên bạn gái:</label>
              <input
                type="text"
                value={formData.herName}
                onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-200"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-medium mb-1">Biệt danh của em:</label>
              <input
                type="text"
                value={formData.herNickname}
                onChange={(e) => setFormData({ ...formData, herNickname: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-medium mb-1">
              Thông điệp kỷ niệm chính:
            </label>
            <textarea
              rows={3}
              value={formData.anniversaryMessage}
              onChange={(e) => setFormData({ ...formData, anniversaryMessage: e.target.value })}
              className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định ban đầu</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg text-xs flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lưu Cài Đặt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
