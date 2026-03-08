import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import {
  MAIN_TILES, TILE_CATEGORIES, getTilesByCategory,
  EXAMPLE_HANDS, TILE_BY_ID
} from './tileData';

// ─── Tile Card Component ────────────────────────────────────────────────────
function TileCard({ tile, onClick, size = 'md', selected = false }) {
  return (
    <div
      className={`tile-card${size === 'lg' ? ' tile-card-lg' : ''}${selected ? ' selected' : ''}`}
      onClick={() => onClick && onClick(tile)}
      title={tile.name}
      style={{ borderTopColor: tile.color, borderTopWidth: 3 }}
    >
      <span className="tile-symbol" role="img" aria-label={tile.name}>
        {tile.symbol}
      </span>
      <span className="tile-name" style={{ color: tile.color }}>
        {tile.shortName}
      </span>
    </div>
  );
}

// Category badge colors
const CATEGORY_STYLES = {
  [TILE_CATEGORIES.CHARACTERS]: { bg: '#FDECEA', color: '#8B1A1A', border: '#F1948A' },
  [TILE_CATEGORIES.DOTS]:       { bg: '#EAF2FB', color: '#1A5276', border: '#85C1E9' },
  [TILE_CATEGORIES.BAMBOO]:     { bg: '#EAFAF1', color: '#1E8449', border: '#82E0AA' },
  [TILE_CATEGORIES.WINDS]:      { bg: '#FEF9E7', color: '#784212', border: '#F9CA24' },
  [TILE_CATEGORIES.DRAGONS]:    { bg: '#F4ECF7', color: '#6C3483', border: '#C39BD3' },
  [TILE_CATEGORIES.FLOWERS]:    { bg: '#FDF2F8', color: '#8E44AD', border: '#F1A8D1' },
  [TILE_CATEGORIES.SEASONS]:    { bg: '#E8F8F5', color: '#117A65', border: '#76D7C4' },
};

function CategoryBadge({ category }) {
  const s = CATEGORY_STYLES[category] || {};
  return (
    <span
      className="category-badge"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {category}
    </span>
  );
}

// ─── MODULE: Tile Gallery ───────────────────────────────────────────────────
function TileGallery({ onComplete }) {
  const [selectedTile, setSelectedTile] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = [
    'All',
    TILE_CATEGORIES.CHARACTERS,
    TILE_CATEGORIES.DOTS,
    TILE_CATEGORIES.BAMBOO,
    TILE_CATEGORIES.WINDS,
    TILE_CATEGORIES.DRAGONS,
    TILE_CATEGORIES.FLOWERS,
    TILE_CATEGORIES.SEASONS,
  ];

  const categoryDescriptions = {
    [TILE_CATEGORIES.CHARACTERS]: { icon: '🈷️', desc: 'Numbered 1–9, each with 4 copies. 36 tiles total.', count: '36' },
    [TILE_CATEGORIES.DOTS]:       { icon: '⭕', desc: 'Numbered 1–9, each with 4 copies. 36 tiles total.', count: '36' },
    [TILE_CATEGORIES.BAMBOO]:     { icon: '🎋', desc: 'Numbered 1–9, each with 4 copies. 36 tiles total.', count: '36' },
    [TILE_CATEGORIES.WINDS]:      { icon: '🌬️', desc: 'East, South, West, North — 4 copies each. 16 tiles total.', count: '16' },
    [TILE_CATEGORIES.DRAGONS]:    { icon: '🐉', desc: 'Red, Green, White — 4 copies each. 12 tiles total.', count: '12' },
    [TILE_CATEGORIES.FLOWERS]:    { icon: '🌸', desc: 'Bonus tiles — 1 copy each. Not used in Riichi.', count: '4' },
    [TILE_CATEGORIES.SEASONS]:    { icon: '🍂', desc: 'Bonus tiles — 1 copy each. Not used in Riichi.', count: '4' },
  };

  const displayCategories =
    filter === 'All'
      ? Object.values(TILE_CATEGORIES)
      : [filter];

  useEffect(() => {
    onComplete && onComplete('gallery');
  }, [onComplete]);

  return (
    <div className="gallery-container fade-in">
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn${filter === cat ? ' active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ background: '#E8F5F0', borderRadius: 10, padding: '14px 18px', fontSize: '0.85rem', color: '#1E8449', border: '1px solid #A9DFBF', marginBottom: 8 }}>
        <strong>Study Mode:</strong> Click any tile to see detailed information about it.
      </div>

      {displayCategories.map(category => {
        const tiles = getTilesByCategory(category);
        const meta = categoryDescriptions[category] || {};
        return (
          <div key={category} className="category-section">
            <div className="category-header">
              <span style={{ fontSize: '1.4rem' }}>{meta.icon}</span>
              <h3>{category}</h3>
              <CategoryBadge category={category} />
              {meta.count && (
                <span className="category-desc">{meta.count} tiles &nbsp;·&nbsp; {meta.desc}</span>
              )}
            </div>
            <div className="tiles-grid">
              {tiles.map(tile => (
                <TileCard
                  key={tile.id}
                  tile={tile}
                  onClick={setSelectedTile}
                  selected={selectedTile?.id === tile.id}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Study modal */}
      {selectedTile && (
        <div className="modal-overlay" onClick={() => setSelectedTile(null)}>
          <div className="modal-content scale-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTile(null)}>✕</button>
            <div className="modal-tile-display">
              <span className="modal-tile-symbol" role="img" aria-label={selectedTile.name}>
                {selectedTile.symbol}
              </span>
              <div className="modal-tile-name">{selectedTile.name}</div>
              <CategoryBadge category={selectedTile.category} />
            </div>
            <div className="modal-meta">
              <div className="modal-meta-item">
                <span className="label">Copies</span>
                <span className="value">{selectedTile.count}</span>
              </div>
              <div className="modal-meta-item">
                <span className="label">Category</span>
                <span className="value" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {selectedTile.category}
                </span>
              </div>
              {selectedTile.number && (
                <div className="modal-meta-item">
                  <span className="label">Number</span>
                  <span className="value">{selectedTile.number}</span>
                </div>
              )}
            </div>
            <p className="modal-description">{selectedTile.description}</p>
            {selectedTile.significance && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: '#FEF9E7', borderRadius: 8, fontSize: '0.84rem', color: '#784212', borderLeft: '3px solid #D4AC0D' }}>
                <strong>Special Significance:</strong> {selectedTile.significance}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MODULE: Quiz ──────────────────────────────────────────────────────────
const QUIZ_CONFIGS = {
  Easy:   { label: 'Easy',   desc: 'Identify the suit',         timerEnabled: false, exactMatch: false },
  Medium: { label: 'Medium', desc: 'Identify the exact tile',   timerEnabled: false, exactMatch: true  },
  Hard:   { label: 'Hard',   desc: 'Timed identification (10s)', timerEnabled: true,  exactMatch: true  },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWrongOptions(correctTile, difficulty) {
  const pool = MAIN_TILES.filter(t => {
    if (difficulty.exactMatch) return t.id !== correctTile.id;
    return t.category !== correctTile.category;
  });
  return shuffle(pool).slice(0, 3);
}

function TileQuiz({ onComplete }) {
  const [difficulty, setDifficulty] = useState('Easy');
  const [quizTile, setQuizTile] = useState(null);
  const [options, setOptions] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(10);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const timerRef = useRef(null);
  const TOTAL_QUESTIONS = 10;
  const config = QUIZ_CONFIGS[difficulty];

  const nextQuestion = useCallback(() => {
    const tile = MAIN_TILES[Math.floor(Math.random() * MAIN_TILES.length)];
    const wrongs = getWrongOptions(tile, QUIZ_CONFIGS[difficulty]);
    const allOpts = shuffle([tile, ...wrongs]);
    setQuizTile(tile);
    setOptions(allOpts);
    setChosen(null);
    setFeedback(null);
    setTimer(10);
  }, [difficulty]);

  useEffect(() => {
    nextQuestion();
  }, [difficulty, nextQuestion]);

  // Timer logic
  useEffect(() => {
    if (!config.timerEnabled || chosen !== null) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [quizTile, chosen, config.timerEnabled]);

  function handleTimeout() {
    setChosen('timeout');
    const newTotal = questionsAnswered + 1;
    setScore(s => ({ ...s, incorrect: s.incorrect + 1, total: s.total + 1 }));
    setFeedback({ type: 'incorrect', message: `⏰ Time's up! That was ${quizTile.name} — a ${quizTile.category} tile.` });
    setQuestionsAnswered(newTotal);
    if (newTotal >= TOTAL_QUESTIONS) setTimeout(() => setQuizComplete(true), 2000);
  }

  function handleAnswer(option) {
    if (chosen !== null) return;
    clearInterval(timerRef.current);
    setChosen(option.id);

    const isCorrect = config.exactMatch
      ? option.id === quizTile.id
      : option.category === quizTile.category;

    const newTotal = questionsAnswered + 1;
    setQuestionsAnswered(newTotal);

    if (isCorrect) {
      setScore(s => ({ correct: s.correct + 1, incorrect: s.incorrect, total: s.total + 1 }));
      const encouragements = ['Excellent!', 'Perfect!', 'You got it!', 'Well done!', 'Spot on!'];
      setFeedback({
        type: 'correct',
        message: `${encouragements[Math.floor(Math.random() * encouragements.length)]} That's the ${quizTile.name} — a ${quizTile.category} tile.`
      });
    } else {
      setScore(s => ({ correct: s.correct, incorrect: s.incorrect + 1, total: s.total + 1 }));
      setFeedback({
        type: 'incorrect',
        message: `Not quite! The correct answer was "${quizTile.name}" (${quizTile.category}). The tile you chose was "${option.name}".`
      });
    }

    if (newTotal >= TOTAL_QUESTIONS) {
      setTimeout(() => {
        setQuizComplete(true);
        onComplete && onComplete('quiz', score.correct + (isCorrect ? 1 : 0));
      }, 1800);
    }
  }

  function restartQuiz() {
    setScore({ correct: 0, incorrect: 0, total: 0 });
    setQuestionsAnswered(0);
    setQuizComplete(false);
    setChosen(null);
    setFeedback(null);
    nextQuestion();
  }

  function getOptionClass(option) {
    if (chosen === null) return '';
    const isCorrect = config.exactMatch
      ? option.id === quizTile.id
      : option.category === quizTile.category;
    if (isCorrect) return 'correct';
    if (option.id === chosen || (chosen === 'timeout' && false)) return 'incorrect';
    return '';
  }

  const progressPct = (questionsAnswered / TOTAL_QUESTIONS) * 100;
  const finalPct = Math.round((score.correct / TOTAL_QUESTIONS) * 100);

  if (quizComplete) {
    const medal = finalPct >= 90 ? '🥇' : finalPct >= 70 ? '🥈' : finalPct >= 50 ? '🥉' : '📚';
    const message = finalPct >= 90 ? "Outstanding! You're a tile master!" :
                    finalPct >= 70 ? "Great job! You know your tiles well." :
                    finalPct >= 50 ? "Good effort! Keep practicing." :
                    "Keep studying! Practice makes perfect.";
    return (
      <div className="quiz-container fade-in">
        <div className="quiz-complete">
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>{medal}</div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Quiz Complete!</h3>
          <span className="big-score">{finalPct}%</span>
          <p className="score-message">{message}</p>
          <p style={{ marginBottom: 24, color: 'var(--text-light)', fontSize: '0.88rem' }}>
            {score.correct} correct out of {TOTAL_QUESTIONS} questions · {difficulty} difficulty
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={restartQuiz}>Try Again</button>
            {difficulty !== 'Hard' && (
              <button className="btn btn-secondary" onClick={() => {
                const levels = ['Easy', 'Medium', 'Hard'];
                const next = levels[levels.indexOf(difficulty) + 1];
                if (next) { setDifficulty(next); restartQuiz(); }
              }}>
                Try {difficulty === 'Easy' ? 'Medium' : 'Hard'} →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container fade-in">
      {/* Header bar */}
      <div className="quiz-header-bar">
        <div className="quiz-score">
          <div className="score-item correct">
            <span className="score-val">{score.correct}</span>
            <span className="score-label">Correct</span>
          </div>
          <div className="score-item incorrect">
            <span className="score-val">{score.incorrect}</span>
            <span className="score-label">Wrong</span>
          </div>
          <div className="score-item total">
            <span className="score-val">{questionsAnswered}/{TOTAL_QUESTIONS}</span>
            <span className="score-label">Progress</span>
          </div>
        </div>
        <div className="difficulty-selector">
          {Object.keys(QUIZ_CONFIGS).map(d => (
            <button
              key={d}
              className={`diff-btn${difficulty === d ? ' active' : ''}`}
              onClick={() => { setDifficulty(d); restartQuiz(); }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Quiz card */}
      {quizTile && (
        <div className="quiz-card">
          <p className="quiz-question-label">
            {config.exactMatch ? 'What tile is this?' : 'What suit does this tile belong to?'}
          </p>

          {config.timerEnabled && (
            <div className={`timer-display${timer <= 3 ? ' urgent' : ''}`}>
              {timer}s
            </div>
          )}

          <span className="quiz-tile-display" role="img" aria-label="Quiz tile">
            {quizTile.symbol}
          </span>

          <div className="options-grid">
            {options.map(option => (
              <button
                key={option.id}
                className={`option-btn ${getOptionClass(option)}`}
                onClick={() => handleAnswer(option)}
                disabled={chosen !== null}
              >
                <span className="option-symbol">{option.symbol}</span>
                <span>{config.exactMatch ? option.name : option.category}</span>
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`feedback-box ${feedback.type}`}>
              <div className="feedback-title">
                {feedback.type === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
              </div>
              <p className="feedback-text">{feedback.message}</p>
            </div>
          )}

          {chosen !== null && questionsAnswered < TOTAL_QUESTIONS && (
            <button className="next-btn" onClick={nextQuestion}>
              Next Question →
            </button>
          )}
        </div>
      )}

      {/* Difficulty hint */}
      <div style={{ background: 'white', borderRadius: 10, padding: '12px 18px', boxShadow: '0 1px 6px var(--shadow)', fontSize: '0.8rem', color: 'var(--text-light)' }}>
        <strong style={{ color: 'var(--text-medium)' }}>{difficulty} mode:</strong> {config.desc}
      </div>
    </div>
  );
}

// ─── MODULE: Rules ─────────────────────────────────────────────────────────
const RULES_SECTIONS = [
  {
    id: 'setup',
    label: 'Game Setup',
    icon: '🏗️',
    content: () => (
      <>
        <div className="rule-section">
          <h4>Players & Equipment</h4>
          <p>Riichi Mahjong is played by <strong>4 players</strong> using a set of <strong>136 tiles</strong> (34 types × 4 copies, without flower/season tiles). You'll also need:</p>
          <ul>
            <li>4 racks to hold tiles</li>
            <li>Dice (typically 2 or 3)</li>
            <li>Point sticks or chips for scoring</li>
            <li>Wind markers (East, South, West, North)</li>
          </ul>
        </div>
        <div className="rule-section">
          <h4>Seating & Wind Assignment</h4>
          <ol className="rule-steps">
            <li>Decide the initial dealer randomly (e.g., roll dice or draw tiles).</li>
            <li>The dealer is <strong>East</strong>. Going clockwise: South, West, North.</li>
            <li>Seat winds rotate each round when dealership passes.</li>
            <li>A full game is typically 2 rounds (East Round + South Round = 8 hands minimum).</li>
          </ol>
        </div>
        <div className="rule-section">
          <h4>Building the Wall</h4>
          <ol className="rule-steps">
            <li>Shuffle all 136 tiles face-down.</li>
            <li>Each player stacks tiles in a row of <strong>34 tiles (2 layers high = 17 stacks)</strong>.</li>
            <li>Push the four rows together to form a square "wall."</li>
            <li>East rolls dice to determine where to break the wall and begin dealing.</li>
          </ol>
        </div>
        <div className="rule-section">
          <h4>Dealing</h4>
          <p>Starting from the break point, deal tiles in groups of 4, going clockwise, for 3 rounds (so each player has 12 tiles). Then deal 1 more tile to each player. East takes an extra tile for a total of <strong>14 tiles</strong>; others start with <strong>13 tiles</strong>.</p>
        </div>
      </>
    )
  },
  {
    id: 'turns',
    label: 'Turn Structure',
    icon: '🔄',
    content: () => (
      <>
        <div className="rule-section">
          <h4>On Your Turn</h4>
          <ol className="rule-steps">
            <li><strong>Draw</strong> a tile from the wall (unless you claimed a discard).</li>
            <li><strong>Evaluate</strong> your hand — can you win (Tsumo), declare Riichi, or use this tile?</li>
            <li><strong>Discard</strong> one tile from your hand, placing it face-up in front of you.</li>
          </ol>
          <div className="rule-highlight">
            East player goes first since they already have 14 tiles — they skip the draw and just discard.
          </div>
        </div>
        <div className="rule-section">
          <h4>Tsumo (Self-Draw Win)</h4>
          <p>If the tile you draw completes your winning hand, you call <strong>"Tsumo!"</strong> and reveal your hand. All three other players pay you points.</p>
        </div>
        <div className="rule-section">
          <h4>Riichi Declaration</h4>
          <p>When you have exactly one tile away from winning (tenpai) with a <strong>closed hand</strong> (no open melds), you may declare <strong>Riichi</strong>:</p>
          <ul>
            <li>Place a 1,000-point stick in the center of the table.</li>
            <li>Discard your chosen tile sideways.</li>
            <li>You cannot change your hand after declaring Riichi (just draw and discard).</li>
            <li>Riichi itself scores 1 han (point multiplier).</li>
          </ul>
        </div>
        <div className="rule-section">
          <h4>Ron (Winning on a Discard)</h4>
          <p>If another player discards the tile you need to complete your hand, call <strong>"Ron!"</strong> — the discarder pays you the full point value.</p>
        </div>
      </>
    )
  },
  {
    id: 'melds',
    label: 'Melds',
    icon: '🀄',
    content: () => (
      <>
        <div className="rule-section">
          <h4>Chow (Chi / Shuntsu) — Sequence of 3</h4>
          <p>Three consecutive numbered tiles <strong>of the same suit</strong>. Can only be claimed from the <strong>player to your left's</strong> discard.</p>
          <div className="meld-example">
            <span className="meld-label">Example</span>
            <span className="meld-tile">🀇</span>
            <span className="meld-tile">🀈</span>
            <span className="meld-tile">🀉</span>
            <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-light)' }}>1–2–3 Man</span>
          </div>
          <div className="meld-example">
            <span className="meld-label">Example</span>
            <span className="meld-tile">🀝</span>
            <span className="meld-tile">🀞</span>
            <span className="meld-tile">🀟</span>
            <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-light)' }}>5–6–7 Pin</span>
          </div>
          <p style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--text-light)' }}>Note: Winds and Dragons cannot form Chows — only numbered suits (Man, Pin, Sou).</p>
        </div>
        <div className="rule-section">
          <h4>Pung (Pon / Kōtsu) — Three of a Kind</h4>
          <p>Three <strong>identical</strong> tiles. Can be claimed from <strong>any player's</strong> discard (taking priority over Chow). Honor tiles (Winds, Dragons) can only form Pungs, never Chows.</p>
          <div className="meld-example">
            <span className="meld-label">Example</span>
            <span className="meld-tile">🀅</span>
            <span className="meld-tile">🀅</span>
            <span className="meld-tile">🀅</span>
            <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-light)' }}>3× Green Dragon</span>
          </div>
          <div className="meld-example">
            <span className="meld-label">Example</span>
            <span className="meld-tile">🀔</span>
            <span className="meld-tile">🀔</span>
            <span className="meld-tile">🀔</span>
            <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-light)' }}>3× 5 Sou</span>
          </div>
        </div>
        <div className="rule-section">
          <h4>Kong (Kan / Kantsu) — Four of a Kind</h4>
          <p>All <strong>four copies</strong> of the same tile. When you form a Kong, you draw an extra tile from the back of the wall (called the "dead wall") because your hand now has 14 tiles but only 3 melds.</p>
          <div className="meld-example">
            <span className="meld-label">Example</span>
            <span className="meld-tile">🀀</span>
            <span className="meld-tile">🀀</span>
            <span className="meld-tile">🀀</span>
            <span className="meld-tile">🀀</span>
            <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-light)' }}>4× East Wind</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: 10 }}>Kongs can be declared from a discard (open Kong), from your own drawn tiles (closed/concealed Kong), or by adding a 4th tile to an existing Pung (shouminkan).</p>
        </div>
      </>
    )
  },
  {
    id: 'winning',
    label: 'Winning Hand',
    icon: '🏆',
    content: () => (
      <>
        <div className="rule-section">
          <h4>Standard Winning Hand Structure</h4>
          <div className="rule-highlight" style={{ fontSize: '1rem', textAlign: 'center' }}>
            4 Melds (Chow/Pung/Kong) + 1 Pair = Mahjong! 🎉
          </div>
          <p style={{ marginTop: 12 }}>A winning hand consists of <strong>14 tiles</strong> arranged into exactly:</p>
          <ul>
            <li><strong>4 sets</strong> (any combination of Chows, Pungs, or Kongs)</li>
            <li><strong>1 pair</strong> (called the "eye" — two identical tiles)</li>
          </ul>
        </div>
        <div className="rule-section">
          <h4>Example Winning Hand</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="meld-example">
              <span className="meld-label">Chow</span>
              <span className="meld-tile">🀇</span><span className="meld-tile">🀈</span><span className="meld-tile">🀉</span>
            </div>
            <div className="meld-example">
              <span className="meld-label">Pung</span>
              <span className="meld-tile">🀄</span><span className="meld-tile">🀄</span><span className="meld-tile">🀄</span>
            </div>
            <div className="meld-example">
              <span className="meld-label">Chow</span>
              <span className="meld-tile">🀙</span><span className="meld-tile">🀚</span><span className="meld-tile">🀛</span>
            </div>
            <div className="meld-example">
              <span className="meld-label">Pung</span>
              <span className="meld-tile">🀅</span><span className="meld-tile">🀅</span><span className="meld-tile">🀅</span>
            </div>
            <div className="meld-example">
              <span className="meld-label">Pair</span>
              <span className="meld-tile">🀓</span><span className="meld-tile">🀓</span>
            </div>
          </div>
        </div>
        <div className="rule-section">
          <h4>Special Hands</h4>
          <ul>
            <li><strong>Seven Pairs (Chiitoitsu):</strong> 7 different pairs — no melds required.</li>
            <li><strong>Thirteen Orphans (Kokushi):</strong> One of each terminal and honor tile, plus a duplicate of any one. Very rare!</li>
            <li><strong>All Pungs (Toitoi):</strong> Four Pungs and a pair — no Chows.</li>
          </ul>
        </div>
        <div className="rule-section">
          <h4>Yaku (Scoring Conditions)</h4>
          <p>In Riichi Mahjong, your winning hand must have at least <strong>one Yaku</strong> (scoring element) to be valid. Common Yaku include:</p>
          <ul>
            <li><strong>Riichi:</strong> Declared tenpai with a closed hand (1 han)</li>
            <li><strong>Tanyao:</strong> All tiles numbered 2–8, no terminals/honors (1 han)</li>
            <li><strong>Yakuhai:</strong> Pung of value tiles (dragons, seat wind, round wind) (1 han each)</li>
            <li><strong>Pinfu:</strong> All Chows, pair of non-value tiles, two-sided wait (1 han)</li>
            <li><strong>Menzen Tsumo:</strong> Self-drawn win with a closed hand (1 han)</li>
          </ul>
        </div>
      </>
    )
  },
  {
    id: 'claiming',
    label: 'Claiming Tiles',
    icon: '📢',
    content: () => (
      <>
        <div className="rule-section">
          <h4>Priority Order for Claiming Discards</h4>
          <p>When a tile is discarded, multiple players may want it. The priority order is:</p>
          <table className="priority-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Call</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="priority-number priority-1">1</span></td>
                <td><strong>Ron (Mahjong!)</strong></td>
                <td>The tile completes your winning hand</td>
              </tr>
              <tr>
                <td><span className="priority-number priority-2">2</span></td>
                <td><strong>Kong (Kan)</strong></td>
                <td>The tile gives you four of a kind (from any player)</td>
              </tr>
              <tr>
                <td><span className="priority-number priority-2">2</span></td>
                <td><strong>Pung (Pon)</strong></td>
                <td>The tile gives you three of a kind (from any player)</td>
              </tr>
              <tr>
                <td><span className="priority-number priority-3">3</span></td>
                <td><strong>Chow (Chi)</strong></td>
                <td>The tile completes a sequence (only from left player)</td>
              </tr>
              <tr>
                <td><span className="priority-number priority-3" style={{ background: 'var(--text-light)' }}>—</span></td>
                <td>Pass</td>
                <td>No valid claim; play continues clockwise</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rule-section">
          <h4>Important Rules for Claiming</h4>
          <ul>
            <li>You must declare your intention <strong>before</strong> the next player draws.</li>
            <li>After claiming a tile for a Pung or Chow, you must <strong>reveal that meld</strong> face-up (it becomes an "open" meld).</li>
            <li>Open melds <strong>restrict your Yaku</strong> options — some Yaku require a closed hand (e.g., Riichi, Pinfu).</li>
            <li>You cannot claim a tile that was discarded in the same turn it was drawn (pon/chi after a draw is not allowed for that same discard).</li>
          </ul>
        </div>
        <div className="rule-section">
          <h4>After Claiming</h4>
          <p>After you claim a tile and reveal a meld:</p>
          <ol className="rule-steps">
            <li>Place the meld face-up to the right of your rack.</li>
            <li>Discard one tile from your remaining hand.</li>
            <li>Play continues clockwise from you (the player to your left goes next).</li>
          </ol>
        </div>
      </>
    )
  },
  {
    id: 'scoring',
    label: 'Scoring',
    icon: '💯',
    content: () => (
      <>
        <div className="rule-section">
          <h4>Basic Scoring Concepts</h4>
          <p>Riichi Mahjong uses a system of <strong>Han (飜)</strong> and <strong>Fu (符)</strong>:</p>
          <ul>
            <li><strong>Han:</strong> Multipliers earned by Yaku (scoring conditions). More Han = more points.</li>
            <li><strong>Fu:</strong> Base points calculated from your hand's composition (meld types, pair type, wait pattern).</li>
          </ul>
          <div className="rule-highlight">
            Points = (Fu × 2^(Han+2)) × payment multipliers — but most players use a reference table!
          </div>
        </div>
        <div className="rule-section">
          <h4>Payment Structure</h4>
          <ul>
            <li><strong>Ron (discard win):</strong> The discarder pays you the <em>full point value</em>.</li>
            <li><strong>Tsumo (self-draw win):</strong> All three players pay, but East pays double (non-dealer rounds) or everyone pays double (East round).</li>
            <li><strong>Dealer penalty:</strong> The dealer (East) always pays more and receives more.</li>
          </ul>
        </div>
        <div className="rule-section">
          <h4>Common Point Thresholds (Mangan+)</h4>
          <ul>
            <li><strong>Mangan (満貫):</strong> 5 han or 4 han with 30+ fu — 8,000 pts (dealer: 12,000)</li>
            <li><strong>Haneman (跳満):</strong> 6–7 han — 12,000 pts (dealer: 18,000)</li>
            <li><strong>Baiman (倍満):</strong> 8–10 han — 16,000 pts (dealer: 24,000)</li>
            <li><strong>Yakuman (役満):</strong> Special hands (13 Orphans, Four Concealed Pungs, etc.) — 32,000 pts!</li>
          </ul>
        </div>
        <div className="rule-section">
          <h4>Starting Points</h4>
          <p>Each player begins with <strong>25,000 points</strong> (some rules use 30,000). The game ends when a player reaches 30,000+ points after a round, or when a player goes bankrupt. The player with the most points wins!</p>
        </div>
      </>
    )
  },
];

function RulesExplained({ onComplete }) {
  const [activeSection, setActiveSection] = useState(RULES_SECTIONS[0].id);

  useEffect(() => {
    onComplete && onComplete('rules');
  }, [onComplete]);

  const section = RULES_SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="rules-container fade-in">
      <div className="rules-nav">
        {RULES_SECTIONS.map(s => (
          <button
            key={s.id}
            className={`rule-nav-btn${activeSection === s.id ? ' active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {section && (
        <div className="rule-card fade-in" key={section.id}>
          <h3>
            <span className="rule-icon">{section.icon}</span>
            {section.label}
          </h3>
          {section.content()}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 12 }}>
          {RULES_SECTIONS.findIndex(s => s.id === activeSection) + 1} of {RULES_SECTIONS.length} sections
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {RULES_SECTIONS.findIndex(s => s.id === activeSection) > 0 && (
            <button className="btn btn-secondary" onClick={() => {
              const idx = RULES_SECTIONS.findIndex(s => s.id === activeSection);
              setActiveSection(RULES_SECTIONS[idx - 1].id);
            }}>← Previous</button>
          )}
          {RULES_SECTIONS.findIndex(s => s.id === activeSection) < RULES_SECTIONS.length - 1 && (
            <button className="btn btn-primary" onClick={() => {
              const idx = RULES_SECTIONS.findIndex(s => s.id === activeSection);
              setActiveSection(RULES_SECTIONS[idx + 1].id);
            }}>Next Section →</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MODULE: Hand Builder ──────────────────────────────────────────────────
function analyzeHand(tileIds) {
  if (tileIds.length !== 14) {
    return { valid: false, reason: `Hand has ${tileIds.length} tiles — needs exactly 14.`, melds: [] };
  }

  // Check for 7 pairs
  const counts = {};
  tileIds.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  const pairs = Object.entries(counts).filter(([, c]) => c >= 2);
  const exactPairs = Object.entries(counts).filter(([, c]) => c === 2);

  if (exactPairs.length === 7 && Object.keys(counts).length === 7) {
    return {
      valid: true,
      reason: 'Seven Pairs (Chiitoitsu) — a special winning hand with 7 different pairs!',
      melds: exactPairs.map(([id]) => ({
        type: 'Pair', tiles: [id, id],
        label: `Pair: ${TILE_BY_ID[id]?.name}`
      })),
    };
  }

  // Try to find 4 melds + 1 pair
  const result = tryFindMelds([...tileIds].sort());
  if (result) {
    return { valid: true, reason: 'Valid winning hand! 4 melds + 1 pair = Mahjong! 🎉', melds: result };
  }

  // Partial analysis
  const pungCount = Object.values(counts).filter(c => c >= 3).length;
  const pairCount = pairs.length;
  if (tileIds.length < 14) {
    return { valid: false, reason: `Add ${14 - tileIds.length} more tile${14 - tileIds.length !== 1 ? 's' : ''} to complete the hand.`, melds: [] };
  }
  return {
    valid: false,
    reason: `Not a valid winning hand. You have ${pungCount} three-of-a-kind group(s) and ${pairCount} pair(s), but the tiles don't form 4 complete melds + 1 pair.`,
    melds: []
  };
}

function tryFindMelds(sortedIds) {
  function canFormSequence(id) {
    const t = TILE_BY_ID[id];
    if (!t || !t.number) return false;
    const suits = [TILE_CATEGORIES.CHARACTERS, TILE_CATEGORIES.DOTS, TILE_CATEGORIES.BAMBOO];
    return suits.includes(t.category);
  }

  function getNextId(id, step) {
    const t = TILE_BY_ID[id];
    if (!t || !t.number) return null;
    const n = t.number + step;
    if (n < 1 || n > 9) return null;
    const prefix = id.replace(/-\d+$/, '');
    return `${prefix}-${n}`;
  }

  function solve(remaining, melds) {
    if (remaining.length === 0) return melds;
    if (remaining.length === 2) {
      if (remaining[0] === remaining[1]) {
        return [...melds, { type: 'Pair', tiles: remaining, label: `Pair: ${TILE_BY_ID[remaining[0]]?.name}` }];
      }
      return null;
    }
    if (remaining.length % 3 !== 2) return null;

    const first = remaining[0];

    // Try Pung
    if (remaining.filter(id => id === first).length >= 3) {
      const rest = [...remaining];
      let removed = 0;
      const newRest = rest.filter(id => {
        if (id === first && removed < 3) { removed++; return false; }
        return true;
      });
      const result = solve(newRest, [...melds, {
        type: 'Pung', tiles: [first, first, first],
        label: `Pung: ${TILE_BY_ID[first]?.name}`
      }]);
      if (result) return result;
    }

    // Try Chow
    if (canFormSequence(first)) {
      const s2 = getNextId(first, 1);
      const s3 = getNextId(first, 2);
      if (s2 && s3 && remaining.includes(s2) && remaining.includes(s3)) {
        const rest = [...remaining];
        [first, s2, s3].forEach(id => {
          const idx = rest.indexOf(id);
          if (idx !== -1) rest.splice(idx, 1);
        });
        const result = solve(rest, [...melds, {
          type: 'Chow', tiles: [first, s2, s3],
          label: `Chow: ${TILE_BY_ID[first]?.name}→${TILE_BY_ID[s3]?.name}`
        }]);
        if (result) return result;
      }
    }

    return null;
  }

  // Try each possible pair first
  const counts = {};
  sortedIds.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  const possiblePairs = Object.keys(counts).filter(id => counts[id] >= 2);

  for (const pairId of possiblePairs) {
    const withoutPair = [...sortedIds];
    let removed = 0;
    const remaining = withoutPair.filter(id => {
      if (id === pairId && removed < 2) { removed++; return false; }
      return true;
    });
    const result = solve(remaining, []);
    if (result) {
      return [...result, { type: 'Pair', tiles: [pairId, pairId], label: `Pair: ${TILE_BY_ID[pairId]?.name}` }];
    }
  }
  return null;
}

function HandBuilder({ onComplete }) {
  const [hand, setHand] = useState([]);
  const [filter, setFilter] = useState('All');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    onComplete && onComplete('handbuilder');
  }, [onComplete]);

  const analysis = analyzeHand(hand);

  const filterOptions = ['All', ...Object.values(TILE_CATEGORIES).filter(c =>
    c !== TILE_CATEGORIES.FLOWERS && c !== TILE_CATEGORIES.SEASONS
  )];

  const displayTiles = filter === 'All' ? MAIN_TILES : MAIN_TILES.filter(t => t.category === filter);

  function addTile(tile) {
    if (hand.length >= 14) return;
    const copies = hand.filter(id => id === tile.id).length;
    if (copies >= tile.count) return;
    setHand(prev => [...prev, tile.id]);
    setShowExample(false);
  }

  function removeTile(index) {
    setHand(prev => prev.filter((_, i) => i !== index));
    setShowExample(false);
  }

  function clearHand() {
    setHand([]);
    setShowExample(false);
  }

  function loadExample() {
    const example = EXAMPLE_HANDS[exampleIdx % EXAMPLE_HANDS.length];
    setHand(example.tiles);
    setExampleIdx(i => i + 1);
    setShowExample(true);
  }

  const currentExample = EXAMPLE_HANDS[(exampleIdx - 1 + EXAMPLE_HANDS.length) % EXAMPLE_HANDS.length];

  return (
    <div className="hand-builder fade-in">
      {/* Hand display */}
      <div>
        <div className="hand-display-area">
          <div className="hand-display-label">
            <span>Your Hand ({hand.length}/14 tiles)</span>
            <span style={{ color: hand.length === 14 ? '#52B788' : 'rgba(255,255,255,0.3)' }}>
              {hand.length === 14 ? '✓ Full hand' : `${14 - hand.length} more needed`}
            </span>
          </div>
          <div className="hand-tiles-row">
            {hand.length === 0 && (
              <span className="hand-placeholder">Click tiles below to add them to your hand…</span>
            )}
            {hand.map((tileId, idx) => {
              const tile = TILE_BY_ID[tileId];
              if (!tile) return null;
              return (
                <div key={`${tileId}-${idx}`} className="hand-tile" onClick={() => removeTile(idx)}>
                  <span className="ht-symbol" role="img" aria-label={tile.name}>{tile.symbol}</span>
                  <span className="ht-name">{tile.shortName}</span>
                  <span className="remove-tile">✕</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hand status */}
      <div className={`hand-status-bar${analysis.valid ? ' winning' : ' invalid'}`}>
        <span className="hand-status-icon">
          {hand.length < 14 ? '🃏' : analysis.valid ? '🎉' : '❌'}
        </span>
        <div className="hand-status-text">
          <h4>{hand.length < 14 ? 'Building hand…' : analysis.valid ? 'Winning Hand!' : 'Not a winning hand'}</h4>
          <p>{analysis.reason}</p>
        </div>
      </div>

      {/* Meld breakdown when valid */}
      {analysis.valid && analysis.melds.length > 0 && (
        <div className="meld-breakdown fade-in">
          <h4>Hand Analysis</h4>
          {analysis.melds.map((meld, i) => (
            <div key={i} className="meld-group">
              <span className={`meld-type-badge meld-type-${meld.type.toLowerCase()}`}>
                {meld.type}
              </span>
              {meld.tiles.map((tid, j) => {
                const t = TILE_BY_ID[tid];
                return t ? (
                  <span key={j} className="meld-tile" style={{ fontSize: '1.5rem', padding: '2px 5px' }}>
                    {t.symbol}
                  </span>
                ) : null;
              })}
              <span style={{ marginLeft: 4, fontSize: '0.8rem', color: 'var(--text-light)' }}>
                {meld.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Example hand info */}
      {showExample && (
        <div className="meld-breakdown fade-in" style={{ borderLeft: '4px solid var(--gold)', background: '#FEF9E7' }}>
          <h4 style={{ color: 'var(--wood)' }}>📖 Example: {currentExample.name}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: 12 }}>
            {currentExample.description}
          </p>
          {currentExample.melds.map((meld, i) => (
            <div key={i} className="meld-group">
              <span className={`meld-type-badge meld-type-${meld.type.toLowerCase()}`}>{meld.type}</span>
              {meld.tiles.map((tid, j) => {
                const t = TILE_BY_ID[tid];
                return t ? <span key={j} className="meld-tile" style={{ fontSize: '1.5rem', padding: '2px 5px' }}>{t.symbol}</span> : null;
              })}
              <span style={{ marginLeft: 4, fontSize: '0.8rem', color: 'var(--text-light)' }}>{meld.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="hand-builder-actions">
        <button className="action-btn primary" onClick={loadExample}>
          🎯 Show Example Hand
        </button>
        <button className="action-btn secondary" onClick={clearHand} disabled={hand.length === 0}>
          🗑️ Clear Hand
        </button>
      </div>

      {/* Tile picker */}
      <div className="tile-picker">
        <div className="tile-picker-header">
          <h3>Add Tiles to Hand</h3>
          <div className="tile-picker-filters">
            {filterOptions.map(f => (
              <button
                key={f}
                className={`filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="tiles-grid">
          {displayTiles.map(tile => {
            const inHand = hand.filter(id => id === tile.id).length;
            const maxed = inHand >= tile.count;
            return (
              <div
                key={tile.id}
                className="tile-card"
                onClick={() => !maxed && addTile(tile)}
                style={{
                  opacity: maxed || hand.length >= 14 ? 0.4 : 1,
                  cursor: maxed || hand.length >= 14 ? 'not-allowed' : 'pointer',
                  borderTopColor: tile.color, borderTopWidth: 3,
                  position: 'relative',
                }}
                title={maxed ? `Already have max ${tile.count} copies` : `Add ${tile.name}`}
              >
                <span className="tile-symbol">{tile.symbol}</span>
                <span className="tile-name" style={{ color: tile.color }}>{tile.shortName}</span>
                {inHand > 0 && (
                  <span style={{
                    position: 'absolute', top: 3, right: 4,
                    background: 'var(--jade)', color: 'white',
                    borderRadius: '50%', width: 16, height: 16,
                    fontSize: '0.6rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{inHand}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 10, padding: '14px 18px', boxShadow: '0 1px 6px var(--shadow)', fontSize: '0.82rem', color: 'var(--text-light)' }}>
        <strong style={{ color: 'var(--text-medium)' }}>💡 Tip:</strong> Click a tile in your hand to remove it. Click tiles below to add them. A valid hand needs 4 melds (Chow/Pung/Kong) + 1 pair, or 7 pairs.
      </div>
    </div>
  );
}

// ─── MODULE: Cheat Sheet ───────────────────────────────────────────────────
function CheatSheet({ onComplete }) {
  useEffect(() => {
    onComplete && onComplete('cheatsheet');
  }, [onComplete]);

  return (
    <div className="cheat-sheet fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Print / Save
        </button>
      </div>

      {/* Tile Types */}
      <div className="cheat-section">
        <h3>🀄 Tile Types (136 total)</h3>
        <div className="cheat-grid">
          <div className="cheat-item">
            <span className="cheat-symbol">🀇–🀏</span>
            <div className="cheat-name">Characters (Man)</div>
            <div className="cheat-desc">1–9 × 4 = 36 tiles</div>
          </div>
          <div className="cheat-item">
            <span className="cheat-symbol">🀙–🀡</span>
            <div className="cheat-name">Dots (Pin)</div>
            <div className="cheat-desc">1–9 × 4 = 36 tiles</div>
          </div>
          <div className="cheat-item">
            <span className="cheat-symbol">🀐–🀘</span>
            <div className="cheat-name">Bamboo (Sou)</div>
            <div className="cheat-desc">1–9 × 4 = 36 tiles</div>
          </div>
          <div className="cheat-item">
            <span className="cheat-symbol">🀀🀁🀂🀃</span>
            <div className="cheat-name">Winds</div>
            <div className="cheat-desc">E/S/W/N × 4 = 16 tiles</div>
          </div>
          <div className="cheat-item">
            <span className="cheat-symbol">🀄🀅🀆</span>
            <div className="cheat-name">Dragons</div>
            <div className="cheat-desc">R/G/W × 4 = 12 tiles</div>
          </div>
          <div className="cheat-item">
            <span className="cheat-symbol">🌸🌺🌼🎋</span>
            <div className="cheat-name">Flowers (bonus)</div>
            <div className="cheat-desc">4 tiles — set aside in Riichi</div>
          </div>
          <div className="cheat-item">
            <span className="cheat-symbol">🌱☀️🍂❄️</span>
            <div className="cheat-name">Seasons (bonus)</div>
            <div className="cheat-desc">4 tiles — set aside in Riichi</div>
          </div>
        </div>
      </div>

      {/* Valid Melds */}
      <div className="cheat-section">
        <h3>🏗️ Valid Melds</h3>
        <div className="cheat-meld-row">
          <span className="cheat-meld-name">Chow (Chi)</span>
          <div className="cheat-tiles">
            <span className="cheat-tile">🀇</span>
            <span className="cheat-tile">🀈</span>
            <span className="cheat-tile">🀉</span>
          </div>
          <span className="cheat-meld-desc">Sequence of 3 same suit · From left player only</span>
        </div>
        <div className="cheat-meld-row">
          <span className="cheat-meld-name">Pung (Pon)</span>
          <div className="cheat-tiles">
            <span className="cheat-tile">🀄</span>
            <span className="cheat-tile">🀄</span>
            <span className="cheat-tile">🀄</span>
          </div>
          <span className="cheat-meld-desc">3 identical tiles · From any player</span>
        </div>
        <div className="cheat-meld-row">
          <span className="cheat-meld-name">Kong (Kan)</span>
          <div className="cheat-tiles">
            <span className="cheat-tile">🀀</span>
            <span className="cheat-tile">🀀</span>
            <span className="cheat-tile">🀀</span>
            <span className="cheat-tile">🀀</span>
          </div>
          <span className="cheat-meld-desc">All 4 identical tiles · Draw extra tile</span>
        </div>
        <div className="cheat-meld-row">
          <span className="cheat-meld-name">Pair (Eye)</span>
          <div className="cheat-tiles">
            <span className="cheat-tile">🀅</span>
            <span className="cheat-tile">🀅</span>
          </div>
          <span className="cheat-meld-desc">2 identical tiles · Required in every winning hand</span>
        </div>
      </div>

      {/* Winning Hand */}
      <div className="cheat-section">
        <h3>🏆 Winning Hand</h3>
        <div style={{ background: 'var(--jade-pale)', border: '2px solid var(--jade-light)', borderRadius: 10, padding: '16px 20px', marginBottom: 16, textAlign: 'center' }}>
          <strong style={{ fontSize: '1.05rem', color: 'var(--jade)' }}>
            4 Melds (Chow/Pung/Kong) + 1 Pair = Mahjong!
          </strong>
        </div>
        <div className="cheat-grid">
          <div className="cheat-item">
            <span className="cheat-symbol">🃏</span>
            <div className="cheat-name">Standard</div>
            <div className="cheat-desc">4 melds + 1 pair</div>
          </div>
          <div className="cheat-item">
            <span className="cheat-symbol">👥</span>
            <div className="cheat-name">7 Pairs</div>
            <div className="cheat-desc">Seven different pairs</div>
          </div>
          <div className="cheat-item">
            <span className="cheat-symbol">🌟</span>
            <div className="cheat-name">13 Orphans</div>
            <div className="cheat-desc">All terminals + honors + 1 duplicate</div>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: '12px 16px', background: '#FEF9E7', borderRadius: 8, fontSize: '0.84rem', color: '#784212', borderLeft: '3px solid var(--gold)' }}>
          <strong>⚠️ Yaku Requirement:</strong> Your winning hand must have at least one Yaku (scoring condition) to be valid. Common Yaku: Riichi, Tanyao (all 2–8s), Yakuhai (value tile Pung), Pinfu (all Chows).
        </div>
      </div>

      {/* Turn Order */}
      <div className="cheat-section">
        <h3>🔄 Turn Order</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {['🀀 East (Dealer)', '🀁 South', '🀂 West', '🀃 North'].map((w, i) => (
            <div key={i} style={{
              background: i === 0 ? 'var(--jade)' : 'var(--cream)',
              color: i === 0 ? 'white' : 'var(--text-medium)',
              border: `2px solid ${i === 0 ? 'var(--jade)' : 'var(--cream-dark)'}`,
              borderRadius: 20, padding: '6px 16px', fontSize: '0.85rem', fontWeight: 600,
            }}>
              {w}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-light)' }}>
            → clockwise →</div>
        </div>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-medium)', paddingLeft: 20, lineHeight: 1.8 }}>
          <li>East (dealer) starts with 14 tiles; others start with 13.</li>
          <li>East discards first, then South draws and discards, etc.</li>
          <li>Dealership passes after East's hand ends without a win (or East wins).</li>
          <li>A full game = East Round + South Round = at least 8 hands.</li>
        </ul>
      </div>

      {/* Claiming Priority */}
      <div className="cheat-section">
        <h3>📢 Claiming Priority (highest → lowest)</h3>
        <ol className="priority-list">
          <li><strong>Ron (Mahjong!)</strong> — tile completes winning hand</li>
          <li><strong>Kong / Pung</strong> — four/three of a kind from any player</li>
          <li><strong>Chow (Chi)</strong> — sequence from left player only</li>
          <li>Pass — play continues clockwise</li>
        </ol>
      </div>

      {/* Common Yaku */}
      <div className="cheat-section">
        <h3>⭐ Common Yaku (Scoring Conditions)</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            ['Riichi', '1 han', 'Declare tenpai with a closed hand (1,000 pt stick)'],
            ['Tanyao', '1 han', 'All tiles numbered 2–8, no terminals or honor tiles'],
            ['Yakuhai', '1 han each', 'Pung of dragons, seat wind, or round wind'],
            ['Pinfu', '1 han', 'All Chows, non-value pair, two-sided wait (closed only)'],
            ['Tsumo', '1 han', 'Self-draw win with a closed hand'],
            ['Iipeiko', '1 han', 'Two identical Chows (closed hand only)'],
            ['Honitsu', '3/2 han', 'One suit + honor tiles only (3 closed, 2 open)'],
            ['Chinitsu', '6/5 han', 'One suit only — all numbered tiles (6 closed, 5 open)'],
          ].map(([name, han, desc], i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '9px 14px', background: 'var(--cream)', borderRadius: 8,
            }}>
              <div style={{ minWidth: 90, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dark)' }}>{name}</div>
              <div style={{ minWidth: 60, fontWeight: 600, fontSize: '0.8rem', color: 'var(--jade)', background: 'var(--jade-pale)', padding: '1px 8px', borderRadius: 10, whiteSpace: 'nowrap', alignSelf: 'flex-start', marginTop: 1 }}>{han}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MODULE: Dashboard/Progress ───────────────────────────────────────────
function Dashboard({ progress, quizBestScore, onNavigate }) {
  const modules = [
    { id: 'gallery',     icon: '🀄', label: 'Tile Gallery',    desc: 'Learn all 144 tiles' },
    { id: 'quiz',        icon: '🧠', label: 'Tile Quiz',       desc: 'Test your knowledge' },
    { id: 'rules',       icon: '📖', label: 'Core Rules',      desc: 'Learn how to play' },
    { id: 'handbuilder', icon: '✋', label: 'Hand Builder',    desc: 'Practice winning hands' },
    { id: 'cheatsheet',  icon: '📋', label: 'Cheat Sheet',     desc: 'Quick reference card' },
  ];

  const completed = modules.filter(m => progress[m.id]).length;
  const pct = Math.round((completed / modules.length) * 100);

  return (
    <div className="dashboard fade-in">
      <div className="welcome-banner">
        <h2>Welcome to Mahjong Academy</h2>
        <p>
          Learn Riichi (Japanese) Mahjong from scratch — tile recognition, game rules, hand building, and more.
          Complete all five modules to become ready for your first real game!
        </p>
        <div className="variant-note">
          <strong>📌 Note on Regional Variants:</strong> This app focuses on <strong>Riichi (Japanese) Mahjong</strong>.
          Other popular styles include Chinese Classical, Hong Kong (Cantonese), and American Mahjong —
          but the core tile recognition and meld concepts transfer across all variants!
        </div>
      </div>

      <div className="progress-section">
        <h3>Your Learning Progress</h3>
        <div className="progress-overall">
          <div className="progress-pct">{pct}%</div>
          <div className="progress-bar-lg">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-bar-sublabel">
              {completed} of {modules.length} modules visited
            </div>
          </div>
        </div>

        <div className="module-list">
          {modules.map(m => (
            <div
              key={m.id}
              className={`module-card${progress[m.id] ? ' completed' : ''}`}
              onClick={() => onNavigate(m.id)}
            >
              {progress[m.id] && (
                <span className="completed-badge">✓</span>
              )}
              <span className="module-icon">{m.icon}</span>
              <h4>{m.label}</h4>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-number">{completed}</span>
            <span className="stat-label">Modules Done</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">144</span>
            <span className="stat-label">Tiles Covered</span>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: quizBestScore > 0 ? 'var(--jade)' : 'var(--text-light)' }}>
              {quizBestScore > 0 ? `${quizBestScore}/10` : '—'}
            </span>
            <span className="stat-label">Best Quiz Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">6</span>
            <span className="stat-label">Rule Sections</span>
          </div>
        </div>
      </div>

      {pct === 100 && (
        <div style={{
          background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
          color: 'white', borderRadius: 12, padding: '24px 28px',
          textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎊</div>
          <h3 style={{ color: '#D4AC0D', marginBottom: 8 }}>Congratulations! You're Ready to Play!</h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
            You've completed all learning modules. Grab 3 friends, set up those tiles, and enjoy your first game of Riichi Mahjong!
          </p>
        </div>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',   icon: '🏠', label: 'Dashboard' },
  { id: 'gallery',     icon: '🀄', label: 'Tile Gallery' },
  { id: 'quiz',        icon: '🧠', label: 'Tile Quiz' },
  { id: 'rules',       icon: '📖', label: 'Core Rules' },
  { id: 'handbuilder', icon: '✋', label: 'Hand Builder' },
  { id: 'cheatsheet',  icon: '📋', label: 'Cheat Sheet' },
];

const PAGE_HEADERS = {
  dashboard:   { title: 'Mahjong Academy',     desc: 'Your complete guide to learning Riichi Mahjong' },
  gallery:     { title: '🀄 Tile Gallery',      desc: 'All 144 tiles organized by category — click any tile to study it' },
  quiz:        { title: '🧠 Tile Recognition Quiz', desc: 'Test your ability to identify tiles with flashcard quizzes' },
  rules:       { title: '📖 Core Rules',        desc: 'Learn the fundamental rules of Riichi Mahjong step by step' },
  handbuilder: { title: '✋ Hand Builder',      desc: 'Practice assembling and validating winning Mahjong hands' },
  cheatsheet:  { title: '📋 Quick Reference',   desc: 'A handy summary to keep nearby during your first games' },
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState({});
  const [quizBestScore, setQuizBestScore] = useState(0);

  function handleComplete(moduleId, score) {
    setProgress(prev => ({ ...prev, [moduleId]: true }));
    if (moduleId === 'quiz' && score !== undefined) {
      setQuizBestScore(prev => Math.max(prev, score));
    }
  }

  function navigate(pageId) {
    setActivePage(pageId);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }

  const header = PAGE_HEADERS[activePage] || PAGE_HEADERS.dashboard;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalModules = NAV_ITEMS.length - 1; // exclude dashboard

  return (
    <div className="app-container">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile toggle */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setSidebarOpen(s => !s)}
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <nav className={`sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-logo">
          <span className="logo-tiles" role="img" aria-label="Mahjong tiles">🀄🀅🀆</span>
          <h1>Mahjong Academy</h1>
          <p className="subtitle">Learn · Practice · Play</p>
        </div>

        <div className="nav-section">
          <div className="nav-section-label">Navigation</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`nav-item${activePage === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id !== 'dashboard' && progress[item.id] && (
                <span className="nav-check">✓</span>
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-progress">
          <div className="prog-label">Overall Progress</div>
          <div className="progress-bar-mini">
            <div
              className="progress-bar-mini-fill"
              style={{ width: `${(completedCount / totalModules) * 100}%` }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: '0.72rem', color: '#95D5B2' }}>
            {completedCount} / {totalModules} modules completed
          </div>
        </div>

        <div className="sidebar-footer">
          <div>Riichi Mahjong · 136 Tiles</div>
          <div style={{ marginTop: 4 }}>East → South → West → North</div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <div className="page-header">
          <h2>{header.title}</h2>
          <p>{header.desc}</p>
        </div>

        <div className="page-content">
          {activePage === 'dashboard' && (
            <Dashboard
              progress={progress}
              quizBestScore={quizBestScore}
              onNavigate={navigate}
            />
          )}
          {activePage === 'gallery' && (
            <TileGallery onComplete={handleComplete} />
          )}
          {activePage === 'quiz' && (
            <TileQuiz onComplete={handleComplete} />
          )}
          {activePage === 'rules' && (
            <RulesExplained onComplete={handleComplete} />
          )}
          {activePage === 'handbuilder' && (
            <HandBuilder onComplete={handleComplete} />
          )}
          {activePage === 'cheatsheet' && (
            <CheatSheet onComplete={handleComplete} />
          )}
        </div>
      </main>
    </div>
  );
}
