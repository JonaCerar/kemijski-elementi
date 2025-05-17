import { useState } from 'react'
import './App.css'

interface Element {
  symbol: string;
  name: string;
}

const elements: Element[] = [
  { symbol: 'H', name: 'Vodik' },
  { symbol: 'He', name: 'Helij' },
  { symbol: 'Li', name: 'Litij' },
  { symbol: 'Be', name: 'Berilij' },
  { symbol: 'B', name: 'Bor' },
  { symbol: 'C', name: 'Ogljik' },
  { symbol: 'N', name: 'Dušik' },
  { symbol: 'O', name: 'Kisik' },
  { symbol: 'F', name: 'Fluor' },
  { symbol: 'Ne', name: 'Neon' },
  { symbol: 'Na', name: 'Natrij' },
  { symbol: 'Mg', name: 'Magnezij' },
  { symbol: 'Al', name: 'Aluminij' },
  { symbol: 'Si', name: 'Silicij' },
  { symbol: 'P', name: 'Fosfor' },
  { symbol: 'S', name: 'Žveplo' },
  { symbol: 'Cl', name: 'Klor' },
  { symbol: 'Ar', name: 'Argon' },
  { symbol: 'K', name: 'Kalij' },
  { symbol: 'Ca', name: 'Kalcij' }
];

interface Question {
  element: Element;
  isSymbolQuestion: boolean;
}

interface GameState {
  currentQuestion: Question | null;
  answer: string;
  feedback: string;
  questions: Question[];
  currentQuestionIndex: number;
  startTime: number | null;
  endTime: number | null;
  correctAnswers: Question[];
  incorrectAnswers: Question[];
}

const initialGameState: GameState = {
  currentQuestion: null,
  answer: '',
  feedback: '',
  questions: [],
  currentQuestionIndex: 0,
  startTime: null,
  endTime: null,
  correctAnswers: [],
  incorrectAnswers: []
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const generateQuestions = () => {
    const shuffledElements = [...elements].sort(() => Math.random() - 0.5).slice(0, 16);
    const newQuestions = shuffledElements.map(element => ({
      element,
      isSymbolQuestion: Math.random() < 0.5
    }));
    return newQuestions;
  };

  const startNewGame = () => {
    const newQuestions = generateQuestions();
    setGameState({
      ...initialGameState,
      questions: newQuestions,
      currentQuestion: newQuestions[0],
      startTime: Date.now()
    });
  };

  const checkAnswer = () => {
    if (!gameState.currentQuestion) return;

    const isCorrect = gameState.currentQuestion.isSymbolQuestion
      ? gameState.answer.toLowerCase() === gameState.currentQuestion.element.name.toLowerCase()
      : gameState.answer === gameState.currentQuestion.element.symbol;

    const newState = {
      ...gameState,
      answer: '',
      feedback: isCorrect ? 'Pravilno!' : `Napačno! Pravilen odgovor je: ${gameState.currentQuestion.isSymbolQuestion ? gameState.currentQuestion.element.name : gameState.currentQuestion.element.symbol}`,
      correctAnswers: isCorrect ? [...gameState.correctAnswers, gameState.currentQuestion] : gameState.correctAnswers,
      incorrectAnswers: !isCorrect ? [...gameState.incorrectAnswers, gameState.currentQuestion] : gameState.incorrectAnswers
    };

    setGameState(newState);
    
    setTimeout(() => {
      if (gameState.currentQuestionIndex < 15) {
        setGameState({
          ...newState,
          currentQuestionIndex: gameState.currentQuestionIndex + 1,
          currentQuestion: gameState.questions[gameState.currentQuestionIndex + 1],
          feedback: ''
        });
      } else {
        setGameState({
          ...newState,
          endTime: Date.now()
        });
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const getTimeString = () => {
    if (!gameState.startTime || !gameState.endTime) return '';
    const seconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <h1>Kemijski Elementi</h1>
      
      {!gameState.currentQuestion && !gameState.endTime && (
        <div className="start-screen">
          <button onClick={startNewGame} className="start-button">Nova igra</button>
        </div>
      )}

      {gameState.currentQuestion && !gameState.endTime && (
        <div className="game-area">
          <div className="progress">
            Vprašanje {gameState.currentQuestionIndex + 1} od 16
          </div>
          <h2>
            {gameState.currentQuestion.isSymbolQuestion ? gameState.currentQuestion.element.symbol : gameState.currentQuestion.element.name}
          </h2>
          <input
            type="text"
            value={gameState.answer}
            onChange={(e) => setGameState({ ...gameState, answer: e.target.value })}
            onKeyPress={handleKeyPress}
            placeholder={gameState.answer === '' ? (gameState.currentQuestion.isSymbolQuestion ? 'Vnesite ime elementa' : 'Vnesite simbol elementa') : ''}
          />
          <button onClick={checkAnswer}>Preveri</button>
          {gameState.feedback && <p className="feedback">{gameState.feedback}</p>}
        </div>
      )}

      {gameState.endTime && (
        <div className="results">
          <h3>Rezultati</h3>
          <p>Čas: {getTimeString()}</p>
          <p>Pravilnih odgovorov: {gameState.correctAnswers.length}</p>
          <p>Napačnih odgovorov: {gameState.incorrectAnswers.length}</p>
          
          <div className="answers-container">
            {gameState.correctAnswers.length > 0 && (
              <div className="correct-answers">
                <h4>Pravilni odgovori:</h4>
                <ul>
                  {gameState.correctAnswers.map((question, index) => (
                    <li key={index}>
                      {question.isSymbolQuestion ? question.element.symbol : question.element.name} → 
                      {question.isSymbolQuestion ? question.element.name : question.element.symbol}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {gameState.incorrectAnswers.length > 0 && (
              <div className="incorrect-answers">
                <h4>Napačni odgovori:</h4>
                <ul>
                  {gameState.incorrectAnswers.map((question, index) => (
                    <li key={index}>
                      {question.isSymbolQuestion ? question.element.symbol : question.element.name} → 
                      {question.isSymbolQuestion ? question.element.name : question.element.symbol}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button onClick={startNewGame} className="start-button">Nova igra</button>
        </div>
      )}
    </div>
  );
}

export default App; 