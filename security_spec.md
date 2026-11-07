# Security Specification: Global Arcade High Scores

## 1. Data Invariants
- High score records must belong to a valid collection `/high_scores/{scoreId}`.
- `playerName` must be a sanitized string between 1 and 30 characters.
- `score` must be a non-negative number.
- `language` must be one of `['javascript', 'python', 'java']`.
- `difficulty` must be an integer between 1 and 5.
- `createdAt` must be locked to server time `request.time`.

## 2. Dirty Dozen Threat Payloads
1. Unauthenticated client creating score with malicious HTML injection in `playerName`.
2. Negative score submission (`score: -500`).
3. Out-of-bounds difficulty level (`difficulty: 99`).
4. Invalid programming language enum (`language: 'cobol'`).
5. Client-forged timestamp (`createdAt: '2099-01-01'`).
6. Shadow fields added to score payload (`isAdmin: true`).
7. Massive 1MB string injected into `playerName`.
8. Overwriting existing high score records (`update` operation).
9. Unauthorized deletion of opponent high scores (`delete` operation).
10. Unbounded list query scraping without limits.
11. Path variable poisoning with illegal characters.
12. Attempting to hijack score identity.
