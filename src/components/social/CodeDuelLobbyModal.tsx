import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { getGameById } from '../../data/gamesRegistry';
import { arcadeAudio } from '../../utils/audio';
import { Swords, Plus, Users, Trophy, Play, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';

interface CodeDuelLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDuelLesson?: (lessonId: string, gameId: string) => void;
}

interface CodeDuelDoc {
  id: string;
  creatorName: string;
  challengerName?: string;
  lessonId: string;
  gameId?: string;
  status: 'waiting' | 'active' | 'completed';
  winner?: string;
  createdAt: any;
}

export const CodeDuelLobbyModal: React.FC<CodeDuelLobbyModalProps> = ({
  isOpen,
  onClose,
  onSelectDuelLesson,
}) => {
  const [duels, setDuels] = useState<CodeDuelDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [playerHandle, setPlayerHandle] = useState(
    () => localStorage.getItem('polyglot_arcade_handle') || 'CodeNinja'
  );
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const activeGame = getGameById(activeGameId);
  const [selectedLessonId, setSelectedLessonId] = useState(() => activeGame.lessons[0].id);
  const [activeDuel, setActiveDuel] = useState<CodeDuelDoc | null>(null);

  useEffect(() => setSelectedLessonId(activeGame.lessons[0].id), [activeGameId]);

  useEffect(() => {
    localStorage.setItem('polyglot_arcade_handle', playerHandle);
  }, [playerHandle]);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const q = query(collection(db, 'code_duels'), orderBy('createdAt', 'desc'), limit(30));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: CodeDuelDoc[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            creatorName: data.creatorName || 'Anonymous',
            challengerName: data.challengerName,
            lessonId: data.lessonId || getGameById(data.gameId || activeGameId).lessons[0].id,
            gameId: data.gameId || activeGameId,
            status: data.status || 'waiting',
            winner: data.winner,
            createdAt: data.createdAt,
          });
        });
        setDuels(list);
        setLoading(false);
        setErrorMsg(null);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'code_duels');
        setErrorMsg('Failed to load code duels lobby. Please check Firestore security rules.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, activeGameId]);

  if (!isOpen) return null;

  const handleCreateDuel = async () => {
    if (!playerHandle.trim()) {
      alert('Please enter your coder handle first!');
      return;
    }
    arcadeAudio.playClick();

    try {
      const newDuelData = {
        creatorName: playerHandle.trim(),
        lessonId: selectedLessonId,
        gameId: activeGameId,
        status: 'waiting',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'code_duels'), newDuelData);
      arcadeAudio.playVictoryFanfare();
      setActiveDuel({
        id: docRef.id,
        ...newDuelData,
        createdAt: new Date(),
      } as CodeDuelDoc);
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.CREATE, 'code_duels');
      setErrorMsg('Failed to create code duel room.');
    }
  };

  const handleJoinDuel = async (duel: CodeDuelDoc) => {
    if (!playerHandle.trim()) {
      alert('Please enter your coder handle first!');
      return;
    }
    if (playerHandle.trim() === duel.creatorName) {
      alert("You cannot join your own duel room as challenger!");
      return;
    }
    arcadeAudio.playClick();

    try {
      const duelRef = doc(db, 'code_duels', duel.id);
      await updateDoc(duelRef, {
        challengerName: playerHandle.trim(),
        status: 'active',
      });
      arcadeAudio.playVictoryFanfare();
      setActiveDuel({
        ...duel,
        challengerName: playerHandle.trim(),
        status: 'active',
      });
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.UPDATE, `code_duels/${duel.id}`);
      setErrorMsg('Failed to join duel room.');
    }
  };

  const handleDeclareWinner = async (duel: CodeDuelDoc, winnerName: string) => {
    arcadeAudio.playVictoryFanfare();
    try {
      const duelRef = doc(db, 'code_duels', duel.id);
      await updateDoc(duelRef, {
        status: 'completed',
        winner: winnerName,
      });
      setActiveDuel(null);
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.UPDATE, `code_duels/${duel.id}`);
      setErrorMsg('Failed to declare winner.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>1v1 Code Duel Arena</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300">
                  Real-Time Firestore
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Challenge fellow coders head-to-head in real-time speed coding duels!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Coder Handle & Room Creator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Your Coder Handle
              </label>
              <input
                type="text"
                value={playerHandle}
                onChange={(e) => setPlayerHandle(e.target.value)}
                maxLength={30}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. NeoCoder"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Select Duel Problem
              </label>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {activeGame.lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    Step {lesson.stepNumber}: {lesson.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCreateDuel}
                className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold rounded-lg shadow-neon-cyan flex items-center justify-center gap-2 text-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Duel Room</span>
              </button>
            </div>
          </div>

          {/* Active / Current Duel Simulation Banner */}
          {activeDuel && (
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/60 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>DUEL ROOM ACTIVE: {activeDuel.creatorName} vs {activeDuel.challengerName || 'Waiting for challenger...'}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200">
                  Status: {activeDuel.status.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-between pt-2 border-t border-cyan-800/40 text-xs">
                <div className="text-slate-300">
                  Target Problem: <strong className="text-cyan-300">{activeDuel.lessonId}</strong>
                </div>
                <div className="flex gap-2">
                  {onSelectDuelLesson && (
                    <button
                      onClick={() => {
                        onSelectDuelLesson(activeDuel.lessonId, activeDuel.gameId || activeGameId);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                      Go to Coding Workspace
                    </button>
                  )}
                  <button
                    onClick={() => handleDeclareWinner(activeDuel, playerHandle)}
                    className="px-3 py-1.5 bg-emerald-600 text-slate-100 font-bold rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-1"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Claim Victory!</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Duels Lobby List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Live Duel Lobbies ({duels.length})</span>
            </h3>

            {loading ? (
              <div className="text-center py-12 text-slate-400 font-mono text-xs">
                Syncing live duels from Firestore...
              </div>
            ) : duels.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-400 text-xs font-mono">
                No active duel rooms right now. Create one above to challenge others!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {duels.map((duel) => {
                  const isCreator = duel.creatorName === playerHandle;
                  return (
                    <div
                      key={duel.id}
                      className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-sm font-bold text-slate-100">{duel.creatorName}</span>
                          <span className="text-xs text-slate-400">vs</span>
                          <span className="text-sm font-bold text-cyan-300">
                            {duel.challengerName || 'Waiting...'}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            duel.status === 'active'
                              ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                              : duel.status === 'completed'
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                              : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                          }`}
                        >
                          {duel.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Problem: {duel.lessonId}</span>
                        {duel.winner && (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            Winner: {duel.winner}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                        {duel.status === 'waiting' && !isCreator && (
                          <button
                            onClick={() => handleJoinDuel(duel)}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Swords className="w-3.5 h-3.5" />
                            <span>Accept Challenge</span>
                          </button>
                        )}
                        {duel.status === 'active' && (
                          <button
                            onClick={() => setActiveDuel(duel)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>View Arena</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>1v1 Code Duels sync instantly via Firestore Real-Time listeners</span>
          <button
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Arena
          </button>
        </div>
      </div>
    </div>
  );
};
