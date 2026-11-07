import { useQuery } from '@tanstack/react-query';
import { LESSONS } from '../data/lessonsData';
import { LessonStep } from '../types/lesson';

// Asynchronous simulation to emulate API fetching with TanStack Query
async function fetchLessons(): Promise<LessonStep[]> {
  // Brief latency simulation for crisp UI query states
  await new Promise((resolve) => setTimeout(resolve, 80));
  return LESSONS;
}

async function fetchLessonById(id: string): Promise<LessonStep | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return LESSONS.find((lesson) => lesson.id === id);
}

export function useLessons() {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: fetchLessons,
    staleTime: Infinity,
  });
}

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => fetchLessonById(lessonId),
    staleTime: Infinity,
    enabled: Boolean(lessonId),
  });
}
