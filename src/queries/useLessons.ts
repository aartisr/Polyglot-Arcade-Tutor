import { useQuery } from '@tanstack/react-query';
import { getGameById, getLessonByGameAndId, DEFAULT_GAME_ID } from '../data/gamesRegistry';
import { LessonStep } from '../types/lesson';

async function fetchLessons(gameId: string = DEFAULT_GAME_ID): Promise<LessonStep[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const game = getGameById(gameId);
  return game.lessons;
}

async function fetchLessonById(lessonId: string, gameId: string = DEFAULT_GAME_ID): Promise<LessonStep | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 40));
  return getLessonByGameAndId(gameId, lessonId);
}

export function useLessons(gameId: string = DEFAULT_GAME_ID) {
  return useQuery({
    queryKey: ['lessons', gameId],
    queryFn: () => fetchLessons(gameId),
    staleTime: Infinity,
  });
}

export function useLesson(lessonId: string, gameId: string = DEFAULT_GAME_ID) {
  return useQuery({
    queryKey: ['lesson', gameId, lessonId],
    queryFn: () => fetchLessonById(lessonId, gameId),
    staleTime: Infinity,
    enabled: Boolean(lessonId),
  });
}
