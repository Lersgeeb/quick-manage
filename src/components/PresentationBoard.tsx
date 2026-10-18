import React, { useEffect, useMemo, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useLanguage } from '../contexts/LanguageContext';
import { Comment, Column, Task, TaskTextDisplayMode, getTaskPriorityOption } from '../types';
import { TagBadge } from './TagBadge';

interface PresentationBoardProps {
  columns: Column[];
  darkMode: boolean;
  textDisplayMode: TaskTextDisplayMode;
  smallText?: boolean;
  onViewDetails: (taskId: string) => void;
  onManageNextStep: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
}

interface PresentationTaskCardProps {
  task: Task;
  darkMode: boolean;
  textDisplayMode: TaskTextDisplayMode;
  smallText: boolean;
  onViewDetails: (taskId: string) => void;
  onManageNextStep: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const getLatestComment = (comments: Comment[] = []) => {
  return comments
    .slice()
    .sort((firstComment, secondComment) => (
      new Date(secondComment.createdAt).getTime() - new Date(firstComment.createdAt).getTime()
    ))[0]?.text || '';
};

const getPriorityWeight = (task: Task) => {
  switch (task.priority) {
    case 'critical':
      return 4;
    case 'high':
      return 3;
    case 'medium':
      return 2;
    default:
      return 1;
  }
};

const isCompletedColumn = (title: string) => {
  return /complet|done|hecho|cerrad/i.test(title);
};

const isInProgressColumn = (title: string) => {
  return /progreso|curso|doing|active|wip/i.test(title);
};

const getDisplayText = (task: Task, textDisplayMode: TaskTextDisplayMode) => {
  if (textDisplayMode === 'nextStep') {
    return task.nextStep || '';
  }

  if (textDisplayMode === 'lastComment') {
    return getLatestComment(task.comments || []);
  }

  return task.description || '';
};

const PresentationTaskCard: React.FC<PresentationTaskCardProps> = ({
  task,
  darkMode,
  textDisplayMode,
  smallText,
  onViewDetails,
  onManageNextStep,
  onEditTask,
  t
}) => {
  const priority = getTaskPriorityOption(task.priority);
  const latestComment = getLatestComment(task.comments || []);
  const displayText = getDisplayText(task, textDisplayMode);

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm transition ${darkMode ? 'border-slate-700 bg-slate-900/60 hover:border-slate-500' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className={`font-semibold ${smallText ? 'text-sm' : 'text-base'}`}>{task.title}</h4>
            <span className="rounded-full px-2 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${priority.color}20`, color: priority.color }}>
              {t(priority.label)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {task.tag && <TagBadge tag={task.tag} color={task.tagColor} />}
            {task.reference && (
              <span className={`rounded-full px-2 py-1 text-[11px] font-mono ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'}`}>
                {task.reference}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip title={t('presentation.details')}>
            <IconButton size="small" onClick={() => onViewDetails(task.id)} sx={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
              <RemoveRedEyeOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('presentation.manageNextStep')}>
            <IconButton size="small" onClick={() => onManageNextStep(task.id)} sx={{ color: darkMode ? '#86efac' : '#059669' }}>
              <PlaylistAddCheckCircleOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('task.edit')}>
            <IconButton size="small" onClick={() => onEditTask(task.id)} sx={{ color: darkMode ? '#93c5fd' : '#2563eb' }}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {displayText && (
        <div className={`mt-4 rounded-2xl px-3 py-2 ${darkMode ? 'bg-slate-800/80 text-slate-200' : 'bg-white text-slate-700'}`}>
          <div className={`mb-1 text-[11px] uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {textDisplayMode === 'description' ? t('presentation.displayDescription') : textDisplayMode === 'nextStep' ? t('presentation.displayNextStep') : t('presentation.displayLastComment')}
          </div>
          <p className={`line-clamp-3 whitespace-pre-wrap ${smallText ? 'text-xs' : 'text-sm'}`}>
            {displayText}
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <div className={`rounded-2xl px-3 py-2 ${darkMode ? 'bg-slate-800/60' : 'bg-white'}`}>
          <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('presentation.displayNextStep')}</div>
          <p className={`mt-1 line-clamp-2 whitespace-pre-wrap ${smallText ? 'text-xs' : 'text-sm'} ${task.nextStep?.trim() ? (darkMode ? 'text-slate-200' : 'text-slate-700') : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>
            {task.nextStep?.trim() || t('presentation.notDefined')}
          </p>
        </div>
        <div className={`rounded-2xl px-3 py-2 ${darkMode ? 'bg-slate-800/60' : 'bg-white'}`}>
          <div className={`text-[11px] uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('presentation.displayLastComment')}</div>
          <p className={`mt-1 line-clamp-2 whitespace-pre-wrap ${smallText ? 'text-xs' : 'text-sm'} ${latestComment ? (darkMode ? 'text-slate-200' : 'text-slate-700') : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>
            {latestComment || t('presentation.noCommentsShort')}
          </p>
        </div>
      </div>
    </div>
  );
};

export const PresentationBoard: React.FC<PresentationBoardProps> = ({
  columns,
  darkMode,
  textDisplayMode,
  smallText = false,
  onViewDetails,
  onManageNextStep,
  onEditTask,
  onAddTask
}) => {
  const { t } = useLanguage();
  const [selectedColumnId, setSelectedColumnId] = useState<'all' | string>('all');
  const taskEntries = useMemo(
    () => columns.flatMap(column => column.tasks.map(task => ({ column, task }))),
    [columns]
  );

  useEffect(() => {
    if (selectedColumnId === 'all') {
      return;
    }

    if (!columns.some((column) => column.id === selectedColumnId)) {
      setSelectedColumnId('all');
    }
  }, [columns, selectedColumnId]);

  const totalTasks = taskEntries.length;
  const completedTasks = taskEntries.filter(({ column }) => isCompletedColumn(column.title)).length;
  const inProgressTasks = taskEntries.filter(({ column }) => isInProgressColumn(column.title)).length;
  const pendingNextSteps = taskEntries.filter(({ task }) => task.nextStep?.trim()).length;
  const riskTasks = taskEntries.filter(({ task, column }) => !isCompletedColumn(column.title) && getPriorityWeight(task) >= 3).length;

  const focusTasks = taskEntries
    .filter(({ column }) => !isCompletedColumn(column.title))
    .slice()
    .sort((firstEntry, secondEntry) => {
      const priorityDiff = getPriorityWeight(secondEntry.task) - getPriorityWeight(firstEntry.task);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return new Date(secondEntry.task.updatedAt).getTime() - new Date(firstEntry.task.updatedAt).getTime();
    })
    .slice(0, 4);

  const nextStepTasks = taskEntries
    .filter(({ task }) => task.nextStep?.trim())
    .slice()
    .sort((firstEntry, secondEntry) => {
      const priorityDiff = getPriorityWeight(secondEntry.task) - getPriorityWeight(firstEntry.task);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return new Date(secondEntry.task.updatedAt).getTime() - new Date(firstEntry.task.updatedAt).getTime();
    })
    .slice(0, 4);

  const summaryCards = [
    {
      label: 'Visibles',
      labelKey: 'presentation.visible',
      value: totalTasks,
      icon: <InsightsOutlinedIcon fontSize="small" />,
      accent: darkMode ? 'from-sky-500/25 to-cyan-400/10' : 'from-sky-100 to-cyan-50'
    },
    {
      label: 'En progreso',
      labelKey: 'presentation.inProgress',
      value: inProgressTasks,
      icon: <TrendingUpOutlinedIcon fontSize="small" />,
      accent: darkMode ? 'from-indigo-500/25 to-blue-400/10' : 'from-indigo-100 to-blue-50'
    },
    {
      label: 'Con siguiente paso',
      labelKey: 'presentation.withNextStep',
      value: pendingNextSteps,
      icon: <PlaylistAddCheckCircleOutlinedIcon fontSize="small" />,
      accent: darkMode ? 'from-emerald-500/25 to-green-400/10' : 'from-emerald-100 to-green-50'
    },
    {
      label: 'Alta prioridad',
      labelKey: 'presentation.highPriority',
      value: riskTasks,
      icon: <WarningAmberRoundedIcon fontSize="small" />,
      accent: darkMode ? 'from-amber-500/25 to-orange-400/10' : 'from-amber-100 to-orange-50'
    }
  ];

  const visibleColumns = useMemo(() => {
    if (selectedColumnId === 'all') {
      return columns;
    }

    return columns.filter((column) => column.id === selectedColumnId);
  }, [columns, selectedColumnId]);
  const isSingleColumnFocus = selectedColumnId !== 'all' && visibleColumns.length === 1;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pb-2 pr-1 custom-scrollbar">
      <section className={`rounded-3xl border p-5 ${darkMode ? 'border-slate-700 bg-slate-800/70 text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-sky-500/15 text-sky-200' : 'bg-sky-100 text-sky-700'}`}>
              <TaskAltOutlinedIcon sx={{ fontSize: 16 }} />
              {t('presentation.badge')}
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">{t('presentation.title')}</h2>
            <p className={`mt-2 max-w-3xl text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('presentation.description')}
            </p>
          </div>

          <div className={`rounded-2xl border px-4 py-3 text-sm ${darkMode ? 'border-slate-700 bg-slate-900/60 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
            <div className="font-semibold">{t('presentation.progress')}</div>
            <div className="mt-1 text-2xl font-bold">{completedTasks} / {totalTasks}</div>
            <div className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('presentation.progressCaption')}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-900/55' : 'border-slate-200 bg-slate-50'} bg-gradient-to-br ${card.accent}`}
            >
              <div className={`mb-3 inline-flex rounded-xl p-2 ${darkMode ? 'bg-slate-950/30 text-slate-100' : 'bg-white/80 text-slate-700'}`}>
                {card.icon}
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t(card.labelKey)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className={`rounded-3xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-800/60' : 'border-slate-200 bg-white'}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{t('presentation.immediateFocus')}</h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('presentation.immediateFocusCaption')}</p>
            </div>
            <WarningAmberRoundedIcon className={darkMode ? 'text-amber-300' : 'text-amber-500'} />
          </div>

          <div className="space-y-3">
            {focusTasks.length > 0 ? focusTasks.map(({ column, task }) => {
              const priority = getTaskPriorityOption(task.priority);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onViewDetails(task.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${darkMode ? 'border-slate-700 bg-slate-900/60 hover:border-slate-500' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{task.title}</div>
                      <div className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{column.title}</div>
                    </div>
                    <div className="rounded-full px-2 py-1 text-xs font-semibold" style={{ backgroundColor: `${priority.color}20`, color: priority.color }}>
                      {t(priority.label)}
                    </div>
                  </div>
                  {task.nextStep?.trim() && (
                    <p className={`mt-3 line-clamp-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {task.nextStep}
                    </p>
                  )}
                </button>
              );
            }) : (
              <div className={`rounded-2xl border border-dashed p-4 text-sm ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                {t('presentation.noPriorityTasks')}
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-3xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-800/60' : 'border-slate-200 bg-white'}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{t('presentation.activeNextSteps')}</h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('presentation.activeNextStepsCaption')}</p>
            </div>
            <PlaylistAddCheckCircleOutlinedIcon className={darkMode ? 'text-emerald-300' : 'text-emerald-500'} />
          </div>

          <div className="space-y-3">
            {nextStepTasks.length > 0 ? nextStepTasks.map(({ task, column }) => (
              <div
                key={task.id}
                className={`rounded-2xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{task.title}</div>
                    <div className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{column.title}</div>
                  </div>
                  <Tooltip title={t('presentation.manageNextStep')}>
                    <IconButton size="small" onClick={() => onManageNextStep(task.id)} sx={{ color: darkMode ? '#86efac' : '#059669' }}>
                      <PlaylistAddCheckCircleOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
                <p className={`mt-3 line-clamp-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {task.nextStep}
                </p>
              </div>
            )) : (
              <div className={`rounded-2xl border border-dashed p-4 text-sm ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                {t('presentation.noNextSteps')}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={`rounded-3xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-800/60' : 'border-slate-200 bg-white'}`}>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t('presentation.columnsTitle')}</h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('presentation.columnsCaption')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedColumnId('all')}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                selectedColumnId === 'all'
                  ? darkMode
                    ? 'border-sky-400 bg-sky-500/20 text-sky-100'
                    : 'border-sky-500 bg-sky-50 text-sky-700'
                  : darkMode
                    ? 'border-slate-600 bg-slate-900/60 text-slate-300 hover:border-slate-500'
                    : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400'
              }`}
            >
              {t('presentation.allColumns')}
            </button>
            {columns.map((column) => (
              <button
                key={column.id}
                type="button"
                onClick={() => setSelectedColumnId(column.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  selectedColumnId === column.id
                    ? darkMode
                      ? 'border-sky-400 bg-sky-500/20 text-sky-100'
                      : 'border-sky-500 bg-sky-50 text-sky-700'
                    : darkMode
                      ? 'border-slate-600 bg-slate-900/60 text-slate-300 hover:border-slate-500'
                      : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400'
                }`}
              >
                {column.title}
              </button>
            ))}
          </div>
        </div>

        <div className={isSingleColumnFocus ? '' : 'grid gap-4 xl:grid-cols-3'}>
          {visibleColumns.map((column) => {
            const columnTaskCount = column.tasks.length;
            return (
              <div
                key={column.id}
                className={`flex min-h-[260px] flex-col rounded-3xl border ${darkMode ? 'border-slate-700 bg-slate-900/45' : 'border-slate-200 bg-slate-50/80'}`}
              >
                <div className={`flex items-center justify-between gap-3 border-b px-4 py-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div>
                    <div className="text-lg font-semibold">{column.title}</div>
                    <div className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t('presentation.activityCount', { count: columnTaskCount })}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddTask(column.id)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition ${darkMode ? 'bg-slate-900/70 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {t('presentation.addTask')}
                  </button>
                </div>

                <div className={`flex-1 p-4 ${isSingleColumnFocus ? '' : 'overflow-y-auto custom-scrollbar'}`}>
                  {column.tasks.length > 0 ? (
                    <div className={isSingleColumnFocus ? 'grid gap-4 md:grid-cols-2 2xl:grid-cols-3' : 'space-y-3'}>
                      {column.tasks.map((task) => (
                        <PresentationTaskCard
                          key={task.id}
                          task={task}
                          darkMode={darkMode}
                          textDisplayMode={textDisplayMode}
                          smallText={smallText}
                          onViewDetails={onViewDetails}
                          onManageNextStep={onManageNextStep}
                          onEditTask={onEditTask}
                          t={t}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={`rounded-2xl border border-dashed p-4 text-sm ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                      {t('presentation.noActivities')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
