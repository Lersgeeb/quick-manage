import React, { useState } from 'react';
import { DEFAULT_TASK_PRIORITY, TASK_PRIORITY_OPTIONS, Task } from '../types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Omit<Task, 'id' | 'columnId' | 'order' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const DEFAULT_COLORS = [
  '#f87171', // red
  '#fb923c', // orange
  '#fbbf24', // amber
  '#a3e635', // lime
  '#34d399', // emerald
  '#22d3ee', // cyan
  '#60a5fa', // blue
  '#818cf8', // indigo
  '#a78bfa', // violet
  '#e879f9', // fuchsia
];

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [tag, setTag] = useState(task?.tag || '');
  const [tagColor, setTagColor] = useState(task?.tagColor || DEFAULT_COLORS[0]);
  const [priority, setPriority] = useState(task?.priority || DEFAULT_TASK_PRIORITY);
  const [reference, setReference] = useState(task?.reference || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      tag,
      tagColor,
      priority,
      reference
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200/80 bg-slate-50/80 p-1 dark:border-slate-700/70 dark:bg-slate-900/30 p-6">
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-1" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          type="text"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-1" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-1" htmlFor="tag">
          Etiqueta
        </label>
        <input
          id="tag"
          type="text"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-1" htmlFor="reference">
          Referencia
        </label>
        <input
          id="reference"
          type="text"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Ej. TASK-123"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
          Prioridad
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TASK_PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                priority === option.value
                  ? 'border-slate-900 text-slate-900 ring-2 ring-offset-2 dark:border-white dark:text-white dark:ring-offset-slate-900'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500'
              }`}
              style={{
                backgroundColor: `${option.color}22`,
                boxShadow: priority === option.value ? `inset 0 0 0 1px ${option.color}` : undefined
              }}
              onClick={() => setPriority(option.value)}
            >
              <span
                className="mb-1 block h-2 w-full rounded-full"
                style={{ backgroundColor: option.color }}
              />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-1">
          Color de etiqueta
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Seleccionar color ${color}`}
              className={`h-7 w-7 rounded-full border border-white/70 shadow-sm transition ${
                tagColor === color ? 'scale-110 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setTagColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          {task ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};
