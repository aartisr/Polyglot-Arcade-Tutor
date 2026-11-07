import React, { useEffect } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { RootRoute } from './__root';
import { useLesson } from '../../queries/useLessons';
import { Navbar } from '../../components/layout/Navbar';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { useWorkspaceStore, setCurrentStepId, updateCode, setIsRunning } from '../../store/workspaceStore';
import { LESSONS } from '../../data/lessonsData';
import { Loader2, AlertCircle } from 'lucide-react';

const TutorComponent: React.FC = () => {
  const routeParams = TutorRoute.useParams();
  const lessonId = routeParams.lessonId || 'step-1';
  const navigate = useNavigate();

  const { data: lesson, isLoading, isError } = useLesson(lessonId);

  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const codeMap = useWorkspaceStore((state) => state.codeMap);

  // Sync step ID and code boilerplate into store
  useEffect(() => {
    if (lesson) {
      setCurrentStepId(lesson.id);

      // Populate initial boilerplate if empty for active language
      (['javascript', 'python', 'java'] as const).forEach((lang) => {
        if (!codeMap[lang]) {
          updateCode(lang, lesson.codeBoilerplate[lang]);
        }
      });
    }
  }, [lesson, lessonId]);

  const handleSelectStep = (targetStepId: string) => {
    setIsRunning(false);
    navigate({ to: '/tutor/$lessonId', params: { lessonId: targetStepId } });
  };

  const handleNavigateNext = () => {
    setIsRunning(false);
    const currentIndex = LESSONS.findIndex((l) => l.id === lessonId);
    if (currentIndex >= 0 && currentIndex < LESSONS.length - 1) {
      const nextStep = LESSONS[currentIndex + 1];
      // Reset starter boilerplate for next step so user begins fresh
      (['javascript', 'python', 'java'] as const).forEach((lang) => {
        updateCode(lang, nextStep.codeBoilerplate[lang]);
      });
      navigate({ to: '/tutor/$lessonId', params: { lessonId: nextStep.id } });
    } else {
      // Completed all steps - loop to step-1
      navigate({ to: '/tutor/$lessonId', params: { lessonId: 'step-1' } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-mono text-xs">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mb-3" />
        <span>Loading PolyGlot Lesson Step...</span>
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
          onClick={() => handleSelectStep('step-1')}
          className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg"
        >
          Return to Step 1
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-950">
      <Navbar currentStepId={lesson.id} onSelectStep={handleSelectStep} />
      <WorkspaceLayout lesson={lesson} onNavigateNext={handleNavigateNext} />
    </div>
  );
};

export const TutorRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/tutor/$lessonId',
  component: TutorComponent,
});
