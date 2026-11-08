import { useState, useEffect, useCallback } from 'react';
import { gameRegistry, IGameRegistry } from './GameRegistry';
import { GameDefinition } from '../types/game';
import { useWorkspaceStore, setActiveGame } from '../store/workspaceStore';

export interface UseGameRegistryReturn {
  games: GameDefinition[];
  activeGame: GameDefinition;
  activeGameId: string;
  defaultGameId: string;
  registerGame: (game: GameDefinition, options?: { override?: boolean }) => void;
  unregisterGame: (gameId: string) => boolean;
  switchGame: (gameId: string) => void;
  getGame: (gameId: string) => GameDefinition | undefined;
  registry: IGameRegistry;
}

/**
 * Custom React hook for dynamic interactions with the GameRegistry service.
 * Automatically synchronizes with registry lifecycle events (add, remove, update)
 * and workspace store state.
 */
export function useGameRegistry(): UseGameRegistryReturn {
  const [games, setGames] = useState<GameDefinition[]>(() => gameRegistry.getAll());
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);

  useEffect(() => {
    if (!gameRegistry.has(activeGameId)) setActiveGame(gameRegistry.getDefaultGameId());
  }, [activeGameId, games]);

  useEffect(() => {
    // Subscribe to runtime registry modifications
    const unsubscribe = gameRegistry.subscribe((updatedGames) => {
      setGames(updatedGames);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const activeGame = gameRegistry.getOrFallback(activeGameId);

  const registerGame = useCallback((game: GameDefinition, options?: { override?: boolean }) => {
    gameRegistry.register(game, options);
  }, []);

  const unregisterGame = useCallback((gameId: string) => {
    return gameRegistry.unregister(gameId);
  }, []);

  const switchGame = useCallback((gameId: string) => {
    setActiveGame(gameId);
  }, []);

  const getGame = useCallback((gameId: string) => {
    return gameRegistry.get(gameId);
  }, []);

  return {
    games,
    activeGame,
    activeGameId,
    defaultGameId: gameRegistry.getDefaultGameId(),
    registerGame,
    unregisterGame,
    switchGame,
    getGame,
    registry: gameRegistry,
  };
}
