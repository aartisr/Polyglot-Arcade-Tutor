import { Monaco } from '@monaco-editor/react';

export const SYNTHWAVE_NEON_THEME_ID = 'synthwave-neon-cyber';
export const MATRIX_GREEN_THEME_ID = 'matrix-synth-green';

export function registerMonacoSynthwaveThemes(monaco: Monaco) {
  // Theme 1: Synthwave Cyberpunk Neon (Pink/Cyan/Yellow/Purple)
  monaco.editor.defineTheme(SYNTHWAVE_NEON_THEME_ID, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // Language Keywords (JS, Python, Java)
      { token: 'keyword', foreground: 'ff007f', fontStyle: 'bold' },
      { token: 'keyword.js', foreground: 'ff007f', fontStyle: 'bold' },
      { token: 'keyword.python', foreground: 'ff007f', fontStyle: 'bold' },
      { token: 'keyword.java', foreground: 'ff007f', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'ff007f', fontStyle: 'bold' },
      { token: 'keyword.operator', foreground: 'ff007f' },

      // Types, Classes & Interfaces
      { token: 'type', foreground: '00f3ff', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: '00f3ff', fontStyle: 'bold' },
      { token: 'entity.name.type', foreground: '00f3ff', fontStyle: 'bold' },
      { token: 'entity.name.class', foreground: '00f3ff', fontStyle: 'bold' },
      { token: 'type.keyword', foreground: '00f3ff' },

      // Strings
      { token: 'string', foreground: 'eab308' },
      { token: 'string.quote', foreground: 'f59e0b' },

      // Numbers & Constants
      { token: 'number', foreground: 'a855f7', fontStyle: 'bold' },
      { token: 'constant', foreground: 'a855f7' },
      { token: 'constant.language', foreground: 'ff007f', fontStyle: 'bold' },

      // Functions & Methods
      { token: 'function', foreground: '34d399', fontStyle: 'bold' },
      { token: 'entity.name.function', foreground: '34d399', fontStyle: 'bold' },

      // Identifiers & Variables
      { token: 'identifier', foreground: '38bdf8' },
      { token: 'variable', foreground: 'e2e8f0' },
      { token: 'variable.parameter', foreground: 'f472b6' },

      // Comments
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },

      // Operators & Delimiters
      { token: 'delimiter', foreground: '94a3b8' },
      { token: 'delimiter.bracket', foreground: '00f3ff' },
    ],
    colors: {
      'editor.background': '#020617',
      'editor.foreground': '#e2e8f0',
      'editorCursor.foreground': '#00f3ff',
      'editor.lineHighlightBackground': '#0f172a80',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#00f3ff',
      'editorSelection.background': '#00f3ff25',
      'editor.inactiveSelectionBackground': '#00f3ff10',
      'editorSuggestWidget.background': '#090d16',
      'editorSuggestWidget.border': '#00f3ff40',
      'editorSuggestWidget.foreground': '#e2e8f0',
      'editorSuggestWidget.selectedBackground': '#1e293b',
      'editorWidget.background': '#090d16',
      'editorWidget.border': '#00f3ff40',
    },
  });

  // Theme 2: Matrix Cyber Terminal Green
  monaco.editor.defineTheme(MATRIX_GREEN_THEME_ID, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '10b981', fontStyle: 'bold' },
      { token: 'type', foreground: '34d399', fontStyle: 'bold' },
      { token: 'string', foreground: 'a7f3d0' },
      { token: 'number', foreground: '6ee7b7' },
      { token: 'function', foreground: '059669', fontStyle: 'bold' },
      { token: 'comment', foreground: '064e3b', fontStyle: 'italic' },
      { token: 'identifier', foreground: '6ee7b7' },
    ],
    colors: {
      'editor.background': '#02120b',
      'editor.foreground': '#a7f3d0',
      'editorCursor.foreground': '#10b981',
      'editor.lineHighlightBackground': '#064e3b40',
      'editorLineNumber.foreground': '#065f46',
      'editorLineNumber.activeForeground': '#10b981',
      'editorSelection.background': '#10b98130',
    },
  });
}
