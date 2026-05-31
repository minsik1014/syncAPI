import React from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';
import { Field } from '../../store/useStore';

interface FieldTableProps {
  fields: Field[];
  category: 'request' | 'response';
  type: 'params' | 'headers' | 'body';
  onUpdateField: (category: 'request' | 'response', type: 'params' | 'headers' | 'body', id: string, updates: Partial<Field>) => void;
  onRemoveField: (category: 'request' | 'response', type: 'params' | 'headers' | 'body', id: string) => void;
  onAddField: (category: 'request' | 'response', type: 'params' | 'headers' | 'body') => void;
  onOpenImport: (category: 'request' | 'response', type: 'body' | 'headers') => void;
}

const fieldTypes = ['string', 'number', 'boolean', 'object', 'array'];

export default function FieldTable({
  fields,
  category,
  type,
  onUpdateField,
  onRemoveField,
  onAddField,
  onOpenImport,
}: FieldTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-50/50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">필드명</th>
            <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-32">타입</th>
            <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">설명</th>
            <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-16 text-center">필수</th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {fields.length > 0 ? (
            fields.map((field) => (
              <tr key={field.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => onUpdateField(category, type, field.id, { name: e.target.value })}
                    className="w-full bg-transparent border-0 focus:ring-0 text-sm font-medium text-gray-900 placeholder:text-gray-300"
                    placeholder="field_name"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={field.type}
                    onChange={(e) => onUpdateField(category, type, field.id, { type: e.target.value })}
                    className="w-full bg-transparent border-0 focus:ring-0 text-sm text-gray-600 appearance-none cursor-pointer"
                  >
                    {fieldTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={field.description}
                    onChange={(e) => onUpdateField(category, type, field.id, { description: e.target.value })}
                    className="w-full bg-transparent border-0 focus:ring-0 text-sm text-gray-500 placeholder:text-gray-300"
                    placeholder="설명을 입력하세요"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => onUpdateField(category, type, field.id, { required: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500/20"
                  />
                </td>
                <td className="px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onRemoveField(category, type, field.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-xs font-medium">
                등록된 필드가 없습니다. 필드를 직접 추가하거나 JSON을 가져와보세요.
              </td>
            </tr>
          )}
          <tr className="bg-gray-50/30">
            <td colSpan={5} className="p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => onAddField(category, type)}
                  className="flex-1 py-2 flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:bg-blue-100/50 rounded-lg transition-colors border border-dashed border-blue-200"
                >
                  <Plus size={14} />
                  필드 직접 추가
                </button>
                {(type === 'body' || type === 'headers') && (
                  <button
                    onClick={() => onOpenImport(category, type)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 text-xs font-bold text-purple-600 hover:bg-purple-100/50 rounded-lg transition-colors border border-dashed border-purple-200"
                  >
                    <Zap size={14} />
                    JSON으로 자동 생성
                  </button>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
