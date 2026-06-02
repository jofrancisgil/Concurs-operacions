import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Check, X, RotateCcw, Play, Users, User, Trophy, Settings, Home, Sun, Moon } from 'lucide-react';
import { GameState, Operation, GameMode, Problem } from './types';
import { generateProblem, getDisplayOperator } from './math';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'setup',
    mode: '1P',
    operations: ['+'],
    maxDigits: 2,
    scores: [0, 0],
    round: 1,
    maxRounds: 10,
  });

  const [problem, setProblem] = useState<Problem | null>(null);
  const [currentOptionIndex, setCurrentOptionIndex] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [answeringPlayer, setAnsweringPlayer] = useState<number | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (gameState.screen === 'playing' && showFeedback === null && problem) {
      const timer = setInterval(() => {
        setCurrentOptionIndex(prev => (prev + 1) % problem.options.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [gameState.screen, showFeedback, problem]);

  const startGame = () => {
    if (gameState.operations.length === 0) return;
    setProblem(generateProblem(gameState.operations, gameState.maxDigits));
    setGameState(prev => ({
      ...prev,
      screen: 'playing',
      scores: [0, 0],
      round: 1,
    }));
    setCurrentOptionIndex(0);
    setShowFeedback(null);
    setAnsweringPlayer(null);
  };

  const handleBuzz = (playerIndex: number) => {
    if (showFeedback !== null || !problem) return;
    
    const currentOption = problem.options[currentOptionIndex];
    const correct = currentOption === problem.answer;
    
    setAnsweringPlayer(playerIndex);
    setShowFeedback(correct ? 'correct' : 'wrong');
    
    if (correct) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.8 },
        colors: ['#BAE6FD', '#FECDD3', '#FDE68A', '#99F6E4'] // Pastel colors
      });
      setGameState(prev => {
        const newScores = [...prev.scores];
        newScores[playerIndex] += 1;
        return { ...prev, scores: newScores };
      });
    }

    setTimeout(() => {
      nextTurn();
    }, 2500); 
  };

  const nextTurn = () => {
    setShowFeedback(null);
    setAnsweringPlayer(null);
    setCurrentOptionIndex(0);
    
    setGameState(prev => {
      const nextRound = prev.round + 1;
      
      if (nextRound > prev.maxRounds) {
        return { ...prev, screen: 'gameover', round: nextRound };
      }
      
      return { ...prev, round: nextRound };
    });
    
    setProblem(generateProblem(gameState.operations, gameState.maxDigits));
  };

  const brutalShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";
  const brutalShadowHover = "hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all";
  const brutalShadowActive = "active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
  const bBorder = "border-4 border-black dark:border-white";
  const bBorder2 = "border-2 border-black dark:border-white";
  const bBorder8 = "border-8 border-black dark:border-white";
  const bCard = "bg-white dark:bg-zinc-800";
  const bText = "text-black dark:text-white";
  const textDarkMuted = "text-black/70 dark:text-white/70";
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-zinc-900' : 'bg-[#F5F2EB]'} ${bText} font-sans flex flex-col items-center justify-center p-4 selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black relative overflow-hidden transition-colors duration-300`}>
      
      {/* Theme Toggle Button */}
      <button 
        onClick={() => setIsDark(!isDark)}
        className={`absolute top-4 right-4 z-50 p-2 md:p-3 ${bCard} ${bBorder} rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-transform`}
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <AnimatePresence mode="wait">
        
        {/* SETUP SCREEN */}
        {gameState.screen === 'setup' && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${bCard} ${bBorder} p-10 md:p-14 flex flex-col items-center relative z-10 ${brutalShadow}`}
          >
            <div className="mb-10 text-center uppercase flex flex-col items-center w-full">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase">
                Repte Matemàtic
              </h1>
              <p className="text-xl md:text-2xl font-bold bg-black dark:bg-white text-white dark:text-black inline-block px-4 py-2 uppercase mb-10">Configura la partida</p>
              
              <button
                onClick={startGame}
                className={`w-full md:w-auto bg-rose-400 dark:bg-rose-500 text-black dark:text-white text-3xl md:text-4xl font-black py-5 px-16 ${bBorder} flex items-center justify-center gap-4 uppercase tracking-wider ${brutalShadowHover} ${brutalShadowActive} shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]`}
              >
                <Play className="w-10 h-10 fill-current" /> Jugar Ara!
              </button>
            </div>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
              
              {/* Mode Selection */}
              <div className="space-y-6">
                <h2 className={`text-2xl font-black flex items-center gap-3 uppercase bg-amber-200 dark:bg-amber-500 dark:text-black inline-flex px-4 py-2 ${bBorder2} shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#FFF]`}>
                  <Settings className="w-6 h-6" /> Mode de Joc
                </h2>
                <div className="flex flex-col gap-6 ">
                  <button 
                    onClick={() => setGameState(prev => ({...prev, mode: '1P'}))}
                    className={`flex items-center gap-6 p-4 ${bBorder} transition-all ${
                      gameState.mode === '1P' 
                        ? `bg-sky-200 dark:bg-sky-600 dark:text-white ${brutalShadow}` 
                        : `${bCard} hover:bg-sky-100 dark:hover:bg-zinc-700 ${brutalShadowHover}`
                    }`}
                  >
                    <div className={`p-3 ${bCard} ${bBorder2} flex items-center justify-center`}>
                      <User className="w-8 h-8 font-black" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black uppercase">1 Jugador</div>
                      <div className={`font-bold ${textDarkMuted} uppercase`}>Juga tu sol</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setGameState(prev => ({...prev, mode: '2P'}))}
                    className={`flex items-center gap-6 p-4 ${bBorder} transition-all ${
                      gameState.mode === '2P' 
                        ? `bg-rose-200 dark:bg-rose-600 dark:text-white ${brutalShadow}` 
                        : `${bCard} hover:bg-rose-100 dark:hover:bg-zinc-700 ${brutalShadowHover}`
                    }`}
                  >
                    <div className={`p-3 ${bCard} ${bBorder2} flex items-center justify-center`}>
                      <Users className="w-8 h-8 font-black" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black uppercase">2 Jugadors</div>
                      <div className={`font-bold ${textDarkMuted} uppercase`}>El més ràpid!</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Operations Selection */}
              <div className="space-y-6">
                <h2 className={`text-2xl font-black flex items-center gap-3 uppercase bg-teal-200 dark:bg-teal-500 dark:text-black inline-flex px-4 py-2 ${bBorder2} shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#FFF]`}>
                  <Settings className="w-6 h-6" /> Operacions
                </h2>
                
                <div className="grid grid-cols-2 gap-6">
                  {(['+', '-', '*', '/'] as Operation[]).map(op => {
                    const isSelected = gameState.operations.includes(op);
                    const label = op === '+' ? 'Suma' : op === '-' ? 'Resta' : op === '*' ? 'Multiplicació' : 'Divisió';
                    const displayOp = getDisplayOperator(op);
                    
                    return (
                      <button
                        key={op}
                        onClick={() => {
                          setGameState(prev => {
                            let curr = [...prev.operations];
                            if (isSelected) {
                              if (curr.length > 1) curr = curr.filter(o => o !== op);
                            } else {
                              curr.push(op);
                            }
                            return { ...prev, operations: curr };
                          });
                        }}
                        className={`flex flex-col items-center justify-center p-4 ${bBorder} transition-all ${
                          isSelected 
                            ? `bg-amber-200 dark:bg-amber-600 dark:text-white ${brutalShadow}` 
                            : `${bCard} hover:bg-amber-100 dark:hover:bg-zinc-700 ${brutalShadowHover}`
                        }`}
                      >
                        <span className="text-5xl font-black mb-2">{displayOp}</span>
                        <span className="text-base lg:text-lg font-bold uppercase">{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Digits Selection */}
              <div className="space-y-6">
                <h2 className={`text-2xl font-black flex items-center gap-3 uppercase bg-purple-200 dark:bg-purple-500 dark:text-black inline-flex px-4 py-2 ${bBorder2} shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#FFF]`}>
                  <Settings className="w-6 h-6" /> Xifres Màximes
                </h2>
                
                <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
                  {[1, 2, 3].map(digits => (
                    <button
                      key={digits}
                      onClick={() => setGameState(prev => ({ ...prev, maxDigits: digits }))}
                      className={`flex flex-col items-center justify-center py-4 px-2 md:p-4 ${bBorder} transition-all ${
                        gameState.maxDigits === digits 
                          ? `bg-purple-300 dark:bg-purple-600 dark:text-white ${brutalShadow}` 
                          : `${bCard} hover:bg-purple-100 dark:hover:bg-zinc-700 ${brutalShadowHover}`
                      }`}
                    >
                      <span className="text-3xl lg:text-4xl font-black mb-2">{digits}</span>
                      <span className="text-xs md:text-sm lg:text-md font-bold uppercase">{digits === 1 ? 'Xifra' : 'Xifres'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rounds Selection */}
              <div className="space-y-6">
                <h2 className={`text-2xl font-black flex items-center gap-3 uppercase bg-lime-300 dark:bg-lime-500 dark:text-black inline-flex px-4 py-2 ${bBorder2} shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#FFF]`}>
                  <Trophy className="w-6 h-6" /> Rondes
                </h2>
                
                <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
                  {[5, 10, 20].map(rounds => (
                    <button
                      key={rounds}
                      onClick={() => setGameState(prev => ({ ...prev, maxRounds: rounds }))}
                      className={`flex flex-col items-center justify-center p-4 ${bBorder} transition-all ${
                        gameState.maxRounds === rounds 
                          ? `bg-lime-400 dark:bg-lime-600 dark:text-white ${brutalShadow}` 
                          : `${bCard} hover:bg-lime-100 dark:hover:bg-zinc-700 ${brutalShadowHover}`
                      }`}
                    >
                      <span className="text-3xl lg:text-4xl font-black mb-2">{rounds}</span>
                      <span className="text-xs md:text-sm lg:text-md font-bold uppercase">Rondes</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* PLAYING SCREEN */}
        {gameState.screen === 'playing' && problem && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full max-w-6xl p-6 md:p-10 h-[95vh] ${bBorder} ${bCard} flex flex-col justify-between relative z-10 ${brutalShadow}`}
          >
            {/* Header section */}
            <div className={`flex justify-between items-center w-full bg-black dark:bg-white text-white dark:text-black p-4 uppercase font-black ${bBorder} shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]`}>
              <button 
                onClick={() => setGameState(prev => ({...prev, screen: 'setup'}))}
                className={`flex items-center gap-2 ${bCard} ${bText} ${bBorder2} px-4 py-2 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors ${brutalShadowActive}`}
                title="Tornar al menú"
              >
                <Home className="w-5 h-5 md:w-6 md:h-6 stroke-[3]" />
                <span className="hidden md:inline">Tornar</span>
              </button>

              <div className={`text-xl md:text-2xl px-4 py-2 bg-amber-200 dark:bg-amber-500 dark:text-black ${bBorder2}`}>
                Ronda {gameState.round} / {gameState.maxRounds}
              </div>
              
              <div className="flex gap-4 items-center">
                {gameState.mode === '2P' ? (
                  <>
                    <div className={`px-4 py-2 text-xl font-black bg-sky-200 dark:bg-sky-500 dark:text-black ${bBorder2}`}>
                      J1: {gameState.scores[0]}
                    </div>
                    <div className={`px-4 py-2 text-xl font-black bg-rose-200 dark:bg-rose-500 dark:text-black ${bBorder2}`}>
                      J2: {gameState.scores[1]}
                    </div>
                  </>
                ) : (
                  <div className={`px-4 py-2 text-xl font-black bg-sky-200 dark:bg-sky-500 dark:text-black ${bBorder2}`}>
                    Punts: {gameState.scores[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Main Problem Area */}
            <div className="flex-1 flex flex-col items-center justify-center mt-4">
              <div className={`text-[4rem] sm:text-[5rem] md:text-[8rem] font-black tracking-tighter flex items-center gap-2 sm:gap-4 md:gap-8 ${bText} px-4 sm:px-8 py-4 ${bCard} ${bBorder8} shadow-[12px_12px_0_0_rgba(0,0,0,1)] dark:shadow-[12px_12px_0_0_rgba(255,255,255,1)]`}>
                <span className="tabular-nums">{problem.num1}</span>
                <span className="text-amber-400 dark:text-amber-500 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] dark:drop-shadow-[2px_2px_0_rgba(255,255,255,0.7)]">{getDisplayOperator(problem.op)}</span>
                <span className="tabular-nums">{problem.num2}</span>
                <span className="">=</span>
                <span className={`tabular-nums ${textDarkMuted}`}>?</span>
              </div>
              
              {/* Layout for Buzzers and Target Number */}
              <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-16 mt-12 md:mt-24 px-4 overflow-visible pb-8">
                
                {/* P1 Buzzer (Left) - Only in 2P */}
                {gameState.mode === '2P' && (
                   <button 
                       onClick={() => handleBuzz(0)}
                       className={`w-32 h-32 md:w-48 md:h-48 rounded-full bg-sky-200 dark:bg-sky-500 dark:text-black ${bBorder} text-black text-2xl md:text-3xl font-black uppercase flex flex-col items-center justify-center gap-2 md:gap-4 shrink-0 ${brutalShadowHover} ${brutalShadowActive} shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]`}
                   >
                       <span>JUG. 1</span>
                       <span className={`text-xs md:text-sm font-bold bg-white text-black px-2 py-1 ${bBorder2} shadow-[2px_2px_0_0_rgba(0,0,0,1)]`}>Polseu</span>
                   </button>
                )}

                {/* Target Number Circle */}
                <div className="relative flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentOptionIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className={`w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-full bg-amber-200 dark:bg-amber-500 dark:text-black ${bBorder} flex items-center justify-center text-[3rem] sm:text-[4rem] md:text-[7rem] font-black text-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] font-mono z-10 shrink-0`}
                    >
                        {problem.options[currentOptionIndex]}
                    </motion.div>
                  </AnimatePresence>
                  
                  {showFeedback === null && (
                    <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-4 ${bBorder2} ${bCard} overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] rounded-full`}>
                        <motion.div 
                            key={currentOptionIndex + "progress"}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 4, ease: 'linear' }}
                            className={`h-full bg-rose-300 dark:bg-rose-500 border-r-2 border-black dark:border-white`}
                        />
                    </div>
                  )}
                </div>

                {/* P2 Buzzer (Right) OR 1P Buzzer */}
                {gameState.mode === '2P' ? (
                   <button 
                       onClick={() => handleBuzz(1)}
                       className={`w-32 h-32 md:w-48 md:h-48 rounded-full bg-rose-200 dark:bg-rose-500 dark:text-black ${bBorder} text-black text-2xl md:text-3xl font-black uppercase flex flex-col items-center justify-center gap-2 md:gap-4 shrink-0 ${brutalShadowHover} ${brutalShadowActive} shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]`}
                   >
                       <span>JUG. 2</span>
                       <span className={`text-xs md:text-sm font-bold bg-white text-black px-2 py-1 ${bBorder2} shadow-[2px_2px_0_0_rgba(0,0,0,1)]`}>Polseu</span>
                   </button>
                ) : (
                   <button 
                       onClick={() => handleBuzz(0)}
                       className={`w-40 h-40 md:w-56 md:h-56 rounded-full bg-sky-200 dark:bg-sky-500 dark:text-black ${bBorder} text-black text-2xl md:text-4xl font-black uppercase flex flex-col items-center justify-center gap-2 md:gap-4 shrink-0 ${brutalShadowHover} ${brutalShadowActive} shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]`}
                   >
                       <span className="text-center px-4">ÉS AQUESTA!</span>
                   </button>
                )}
              </div>
            </div>

            {/* Feedback overlay */}
            <AnimatePresence>
              {showFeedback !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`absolute inset-x-4 top-[20%] md:inset-x-auto md:w-3/4 md:left-1/2 md:-translate-x-1/2 z-50 p-10 ${bBorder8} shadow-[16px_16px_0_0_rgba(0,0,0,1)] dark:shadow-[16px_16px_0_0_rgba(255,255,255,1)] flex flex-col items-center justify-center text-center ${
                    showFeedback === 'correct' ? 'bg-sky-200 dark:bg-sky-500 text-black' : 'bg-red-400 dark:bg-red-600 text-black dark:text-white'
                  }`}
                >
                  <div className={`bg-white text-black ${bBorder4 || 'border-4 border-black'} p-4 mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-full`}>
                      {showFeedback === 'correct' ? (
                         <Check className="w-20 h-20 md:w-24 md:h-24 stroke-[4]" />
                      ) : (
                         <X className="w-20 h-20 md:w-24 md:h-24 stroke-[4]" />
                      )}
                  </div>
                  {gameState.mode === '2P' && (
                      <div className={`text-2xl font-black mb-2 uppercase tracking-widest bg-white text-black px-4 ${bBorder2}`}>
                          Jugador {answeringPlayer === 0 ? '1' : '2'}
                      </div>
                  )}
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                    {showFeedback === 'correct' ? 'CORRECTE!' : 'INCORRECTE!'}
                  </h2>
                  {showFeedback === 'wrong' && (
                     <div className={`mt-6 text-2xl font-black font-mono bg-white text-black ${bBorder4 || 'border-4 border-black'} px-8 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-4`}>
                        ERA <span className={`bg-amber-200 px-4 ${bBorder2}`}>{problem.answer}</span>
                     </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        )}

        {/* GAME OVER SCREEN */}
        {gameState.screen === 'gameover' && (
           <motion.div 
             key="gameover"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`w-full max-w-4xl p-16 ${bCard} ${bBorder} flex flex-col items-center relative z-10 ${brutalShadow}`}
           >
             <div className={`bg-amber-200 dark:bg-amber-500 p-6 ${bBorder} rounded-none shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] mb-8`}>
                <Trophy className="w-20 h-20 text-black fill-current" />
             </div>
             <h1 className="text-6xl md:text-7xl font-black mb-4 text-center uppercase tracking-tighter">Partida Acabada!</h1>
             
             <div className="my-16 w-full">
               {gameState.mode === '1P' ? (
                 <div className="text-center">
                   <p className={`text-3xl font-bold bg-black dark:bg-white text-white dark:text-black inline-block px-4 py-2 ${bBorder} uppercase mb-8`}>Puntuació Final</p>
                   <p className="text-[10rem] font-black tracking-tighter leading-none drop-shadow-[4px_4px_0_#BAE6FD] dark:drop-shadow-[4px_4px_0_#0284C7]">
                     {gameState.scores[0]} <span className={`text-6xl ${textDarkMuted}`}>/ {gameState.maxRounds}</span>
                   </p>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-12 text-center w-full max-w-2xl mx-auto">
                   <div className={`p-8 ${bBorder} ${gameState.scores[0] > gameState.scores[1] ? 'bg-amber-200 dark:bg-amber-500 dark:text-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] scale-110' : 'bg-sky-100 dark:bg-sky-800 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]'}`}>
                      <h3 className={`text-2xl lg:text-3xl font-black mb-4 uppercase bg-white text-black ${bBorder2} inline-block px-4`}>Jugador 1</h3>
                      <p className="text-6xl md:text-8xl font-black">{gameState.scores[0]}</p>
                   </div>
                   <div className={`p-8 ${bBorder} ${gameState.scores[1] > gameState.scores[0] ? 'bg-amber-200 dark:bg-amber-500 dark:text-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] scale-110' : 'bg-rose-100 dark:bg-rose-800 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]'}`}>
                      <h3 className={`text-2xl lg:text-3xl font-black mb-4 uppercase bg-white text-black ${bBorder2} inline-block px-4`}>Jugador 2</h3>
                      <p className="text-6xl md:text-8xl font-black">{gameState.scores[1]}</p>
                   </div>
                 </div>
               )}
               
               {gameState.mode === '2P' && gameState.scores[0] === gameState.scores[1] && (
                 <p className={`text-4xl font-black text-center mt-16 bg-black dark:bg-white text-white dark:text-black inline-block px-8 py-4 uppercase ${bBorder} shadow-[6px_6px_0_0_#BAE6FD]`}>Hi ha un EMPAT!</p>
               )}
             </div>

             <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full justify-center items-center">
               <button
                 onClick={() => startGame()}
                 className={`w-full sm:flex-1 max-w-[300px] bg-teal-300 dark:bg-teal-500 text-black dark:text-white text-xl md:text-2xl font-black py-4 px-6 ${bBorder} uppercase flex items-center justify-center gap-4 ${brutalShadowHover} ${brutalShadowActive} shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]`}
               >
                 <RotateCcw className="w-8 h-8 stroke-[3]" /> Tornar a Jugar
               </button>
               <button
                 onClick={() => setGameState(prev => ({...prev, screen: 'setup'}))}
                 className={`w-full sm:flex-1 max-w-[300px] ${bCard} ${bText} text-xl md:text-2xl font-black py-4 px-6 ${bBorder} uppercase flex items-center justify-center gap-4 ${brutalShadowHover} ${brutalShadowActive} shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]`}
               >
                 <Settings className="w-8 h-8 stroke-[3]" /> Opcions
               </button>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className={`absolute -bottom-10 -left-10 w-80 h-80 bg-rose-200 dark:bg-rose-500 border-8 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'} opacity-50 pointer-events-none rounded-none rotate-12`}></div>
      <div className={`absolute top-10 -right-10 w-40 h-40 bg-amber-200 dark:bg-amber-500 border-8 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'} opacity-50 pointer-events-none -rotate-12`}></div>
      <div className={`absolute top-1/2 left-20 w-24 h-24 bg-sky-200 dark:bg-sky-500 border-4 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'} opacity-50 pointer-events-none rounded-full`}></div>
    </div>
  );
}
