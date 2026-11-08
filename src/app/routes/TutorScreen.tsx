import React, { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useLesson } from '../../queries/useLessons';
import { Navbar } from '../../components/layout/Navbar';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import {
  useWorkspaceStore,
  setCurrentStepId,
  updateCode,
  setIsRunning,
  setActiveGame,
  workspaceStore,
} from '../../store/workspaceStore';
import { gameRegistry, getGameById } from '../../data/gamesRegistry';
import { Loader2, AlertCircle } from 'lucide-react';

export const TutorComponent: React.FC = () => {
  const routeParams = useParams({ from: '/tutor/$lessonId' });
  const { game: gameFromUrl } = useSearch({ from: '/tutor/$lessonId' });
  const lessonId = routeParams.lessonId;
  const navigate = useNavigate();

  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const gameId = gameFromUrl && gameRegistry.has(gameFromUrl)
    ? gameFromUrl
    : gameRegistry.has(activeGameId) ? activeGameId : gameRegistry.getDefaultGameId();

  // Lesson IDs repeat between games, so the explicit URL game is authoritative.
  useEffect(() => {
    if (gameId !== activeGameId) setActiveGame(gameId);
  }, [gameId, activeGameId]);

  const { data: lesson, isLoading, isError } = useLesson(lessonId, gameId);

  // Sync step ID and code boilerplate into store
  useEffect(() => {
    if (lesson && activeGameId === gameId) {
      setCurrentStepId(lesson.id);

      // Populate initial boilerplate if empty for active language
      (['javascript', 'python', 'java'] as const).forEach((lang) => {
        if (!workspaceStore.state.codeMap[lang]) {
          updateCode(lang, lesson.codeBoilerplate[lang]);
        }
      });
    }
  }, [lesson, lessonId, activeGameId, gameId]);

  const handleSelectStep = (targetStepId: string) => {
    setIsRunning(false);
    navigate({ to: '/tutor/$lessonId', params: { lessonId: targetStepId }, search: { game: gameId } });
  };

  const handleSelectGame = (targetGameId: string, targetStepId?: string) => {
    const game = gameRegistry.get(targetGameId);
    if (!game) return;
    setIsRunning(false);
    const lessonId = game.lessons.some((step) => step.id === targetStepId) ? targetStepId! : game.lessons[0].id;
    navigate({ to: '/tutor/$lessonId', params: { lessonId }, search: { game: targetGameId } });
  };

  const handleNavigateNext = () => {
    setIsRunning(false);
    const currentGame = getGameById(gameId);
    const currentIndex = currentGame.lessons.findIndex((l) => l.id === lessonId);
    if (currentIndex >= 0 && currentIndex < currentGame.lessons.length - 1) {
      const nextStep = currentGame.lessons[currentIndex + 1];
      // Reset starter boilerplate for next step so user begins fresh
      (['javascript', 'python', 'java'] as const).forEach((lang) => {
        updateCode(lang, nextStep.codeBoilerplate[lang]);
      });
      navigate({ to: '/tutor/$lessonId', params: { lessonId: nextStep.id }, search: { game: gameId } });
    } else {
      // Completed all steps in this game - loop to first step
      navigate({ to: '/tutor/$lessonId', params: { lessonId: currentGame.lessons[0].id }, search: { game: gameId } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-mono text-xs">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mb-3" />
        <span>Loading PolyGlot Lesson Step...</span>
        <Link to="/" className="mt-4 text-cyan-300 underline underline-offset-4">Home</Link>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
        <h2 className="text-sm font-bold">Lesson Not Found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">Invalid step parameter: {lessonId}</p>
        <button
          onClick={() => handleSelectStep(getGameById(gameId).lessons[0].id)}
          className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg"
        >
          Return to Step 1
        </button>
        <Link to="/" className="text-xs text-cyan-300 underline underline-offset-4">Home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0 min-w-0 overflow-hidden bg-slate-950">
      <Navbar currentStepId={lesson.id} onSelectStep={handleSelectStep} onSelectGame={handleSelectGame} />
      <WorkspaceLayout lesson={lesson} onNavigateNext={handleNavigateNext} />
    </div>
  );
};
