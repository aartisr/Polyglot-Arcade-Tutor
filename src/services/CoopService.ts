import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Monaco } from '@monaco-editor/react';

export class CoopService {
  private sessionId: string | null = null;
  private unsubscribe: (() => void) | null = null;
  private editor: any = null;
  private monaco: Monaco | null = null;
  private decorations: string[] = [];

  constructor(sessionId: string, editor: any, monaco: Monaco) {
    this.sessionId = sessionId;
    this.editor = editor;
    this.monaco = monaco;
  }

  public start() {
    if (!this.sessionId) return;

    const docRef = doc(db, 'coop_sessions', this.sessionId);
    
    this.unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Sync code if it differs (basic reconciliation)
        const currentCode = this.editor.getValue();
        if (data.code !== currentCode) {
          const position = this.editor.getPosition();
          this.editor.setValue(data.code);
          this.editor.setPosition(position);
        }

        // Sync cursors
        this.updateRemoteCursors(data.cursors || {});
      }
    });
  }

  public updateCode(code: string) {
    if (!this.sessionId) return;
    const docRef = doc(db, 'coop_sessions', this.sessionId);
    updateDoc(docRef, { code, updatedAt: serverTimestamp() });
  }

  public updateCursor(cursor: { lineNumber: number; column: number }, userId: string) {
    if (!this.sessionId) return;
    const docRef = doc(db, 'coop_sessions', this.sessionId);
    // Simple cursor sync
    updateDoc(docRef, { [`cursors.${userId}`]: cursor, updatedAt: serverTimestamp() });
  }

  private updateRemoteCursors(cursors: Record<string, any>) {
    if (!this.monaco || !this.editor) return;

    const decorations: any[] = [];
    Object.entries(cursors).forEach(([userId, pos]) => {
      decorations.push({
        range: new this.monaco!.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column + 1),
        options: {
          className: 'remote-cursor',
          hoverMessage: { value: `User: ${userId}` },
        },
      });
    });

    this.decorations = this.editor.deltaDecorations(this.decorations, decorations);
  }

  public stop() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
