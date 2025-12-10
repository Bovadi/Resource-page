import React, { useState, useEffect } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { LabelService, ContentLabel } from '../services/labelService';

interface LabelSelectorProps {
  selectedLabels: ContentLabel[];
  onLabelsChange: (labels: ContentLabel[]) => void;
  onError: (error: string) => void;
}

export const LabelSelector: React.FC<LabelSelectorProps> = ({
  selectedLabels,
  onLabelsChange,
  onError
}) => {
  const [availableLabels, setAvailableLabels] = useState<ContentLabel[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    loadAvailableLabels();
  }, []);

  const loadAvailableLabels = async () => {
    try {
      setLoading(true);
      const labels = await LabelService.getAllLabels();
      setAvailableLabels(labels);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load labels');
    } finally {
      setLoading(false);
    }
  };

  const addLabel = (label: ContentLabel) => {
    if (!selectedLabels.find(selected => selected.id === label.id)) {
      onLabelsChange([...selectedLabels, label]);
    }
  };

  const removeLabel = (labelId: string) => {
    onLabelsChange(selectedLabels.filter(label => label.id !== labelId));
  };

  const availableForSelection = availableLabels.filter(label =>
    !selectedLabels.some(selected => selected.id === label.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Content Labels ({selectedLabels.length})
        </label>
        <button
          type="button"
          onClick={() => setShowSelector(!showSelector)}
          className="flex items-center px-3 py-1 text-sm bg-[#108C89] text-white rounded hover:bg-[#0e7a77] transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Labels
        </button>
      </div>

      {/* Selected Labels */}
      {selectedLabels.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Labels:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedLabels.map((label) => (
              <div
                key={label.id}
                className="flex items-center space-x-2 px-3 py-1 bg-[#f0fffe] text-[#0e7a77] rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                <span>{label.name}</span>
                <button
                  type="button"
                  onClick={() => removeLabel(label.id)}
                  className="p-0.5 hover:bg-[#d1f5f4] rounded-full transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Label Selector */}
      {showSelector && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">Available Labels</h4>
            <button
              type="button"
              onClick={() => setShowSelector(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-custom-teal"></div>
            </div>
          ) : availableForSelection.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              All available labels have been selected
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableForSelection.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => addLabel(label)}
                >
                  <div className="flex items-center space-x-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {label.name}
                      </p>
                      {label.description && (
                        <p className="text-xs text-gray-500">
                          {label.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-custom-teal" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};