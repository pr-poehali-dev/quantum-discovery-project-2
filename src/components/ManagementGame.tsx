import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, type Category, type Question } from "@/data/gameData";

type Team = {
  name: string;
  score: number;
};

type GameState = "start" | "setup" | "board" | "question" | "answer" | "results";

const TEAM_COLORS = [
  { bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-400" },
  { bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-700", border: "border-amber-400" },
  { bg: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-400" },
  { bg: "bg-rose-500", light: "bg-rose-100", text: "text-rose-700", border: "border-rose-400" },
];

export default function ManagementGame() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [teams, setTeams] = useState<Team[]>([
    { name: "", score: 0 },
    { name: "", score: 0 },
    { name: "", score: 0 },
    { name: "", score: 0 },
  ]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [activeQuestion, setActiveQuestion] = useState<{
    category: Category;
    question: Question;
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scoringTeam, setScoringTeam] = useState<number | null>(null);

  const allAnswered = answeredQuestions.size === categories.reduce((a, c) => a + c.questions.length, 0);

  const handleStartGame = () => {
    setGameState("setup");
  };

  const handleBeginGame = () => {
    const filled = teams.filter((t) => t.name.trim() !== "");
    if (filled.length < 2) return;
    setGameState("board");
  };

  const handleSelectQuestion = (category: Category, question: Question) => {
    if (answeredQuestions.has(question.id)) return;
    setActiveQuestion({ category, question });
    setSelectedAnswer(null);
    setShowResult(false);
    setScoringTeam(null);
    setGameState("question");
  };

  const handleSelectAnswer = (label: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(label);
    setShowResult(true);
  };

  const handleAwardPoints = (teamIndex: number) => {
    if (scoringTeam !== null || !activeQuestion) return;
    setScoringTeam(teamIndex);
    setTeams((prev) =>
      prev.map((t, i) =>
        i === teamIndex ? { ...t, score: t.score + activeQuestion.question.points } : t
      )
    );
  };

  const handleCloseQuestion = () => {
    if (activeQuestion) {
      setAnsweredQuestions((prev) => new Set([...prev, activeQuestion.question.id]));
    }
    setActiveQuestion(null);
    setGameState(allAnswered ? "results" : "board");
  };

  const handleRestart = () => {
    setGameState("start");
    setTeams([
      { name: "", score: 0 },
      { name: "", score: 0 },
      { name: "", score: 0 },
      { name: "", score: 0 },
    ]);
    setAnsweredQuestions(new Set());
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setScoringTeam(null);
  };

  const sortedTeams = [...teams]
    .map((t, i) => ({ ...t, originalIndex: i }))
    .filter((t) => t.name.trim() !== "")
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <AnimatePresence mode="wait">
        {gameState === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center px-4"
          >
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-black tracking-tight mb-4 text-center"
            >
              <span className="text-indigo-400">МЕН</span>
              <span className="text-white">ЕДЖМЕНТ</span>
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-xl mb-12 text-center"
            >
              Командная игра-викторина по управлению бизнесом
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 mb-12"
            >
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white text-center"
                  style={{ backgroundColor: cat.color + "33", border: `1px solid ${cat.color}55`, color: cat.color }}
                >
                  {cat.name}
                </div>
              ))}
            </motion.div>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartGame}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-2xl px-16 py-5 rounded-2xl shadow-lg shadow-indigo-900/50 transition-colors"
            >
              НАЧАТЬ ИГРУ
            </motion.button>
          </motion.div>
        )}

        {gameState === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex-1 flex flex-col items-center justify-center px-4 py-12"
          >
            <h2 className="text-4xl font-black mb-2 text-center">Назовите своих предпринимателей</h2>
            <p className="text-gray-400 mb-10 text-center">Введите названия команд (минимум 2)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mb-10">
              {teams.map((team, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 ${TEAM_COLORS[i].bg}`}>
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    placeholder={`Команда ${i + 1}`}
                    value={team.name}
                    onChange={(e) =>
                      setTeams((prev) =>
                        prev.map((t, idx) => (idx === i ? { ...t, name: e.target.value } : t))
                      )
                    }
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBeginGame}
              disabled={teams.filter((t) => t.name.trim() !== "").length < 2}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black text-xl px-14 py-4 rounded-2xl transition-colors shadow-lg shadow-indigo-900/40"
            >
              НАЧАТЬ →
            </motion.button>
          </motion.div>
        )}

        {gameState === "board" && (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 md:p-6"
          >
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {teams.filter((t) => t.name.trim() !== "").map((team, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${TEAM_COLORS[i].light} ${TEAM_COLORS[i].border} border`}
                >
                  <span className={`font-bold ${TEAM_COLORS[i].text}`}>{team.name}</span>
                  <span className={`font-black text-lg ${TEAM_COLORS[i].text}`}>{team.score}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-auto">
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex flex-col gap-2">
                    <div
                      className="text-center font-black text-sm py-3 px-2 rounded-xl"
                      style={{ backgroundColor: cat.color + "22", color: cat.color, border: `1px solid ${cat.color}44` }}
                    >
                      {cat.name}
                    </div>
                    {cat.questions.map((q) => {
                      const done = answeredQuestions.has(q.id);
                      return (
                        <motion.button
                          key={q.id}
                          whileHover={!done ? { scale: 1.04 } : {}}
                          whileTap={!done ? { scale: 0.96 } : {}}
                          onClick={() => handleSelectQuestion(cat, q)}
                          disabled={done}
                          className={`w-full py-4 rounded-xl font-black text-2xl transition-all ${
                            done
                              ? "bg-gray-800 text-gray-700 cursor-default"
                              : "bg-gray-800 hover:bg-gray-700 text-white shadow-md hover:shadow-lg"
                          }`}
                          style={
                            !done
                              ? { boxShadow: `0 4px 24px 0 ${cat.color}33` }
                              : {}
                          }
                        >
                          {done ? "—" : q.points}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {allAnswered && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setGameState("results")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl px-12 py-4 rounded-2xl"
                >
                  РЕЗУЛЬТАТЫ
                </button>
              </div>
            )}
          </motion.div>
        )}

        {gameState === "question" && activeQuestion && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-3xl mx-auto w-full"
          >
            <div
              className="text-sm font-black uppercase tracking-widest mb-4 px-4 py-1 rounded-full"
              style={{
                backgroundColor: activeQuestion.category.color + "22",
                color: activeQuestion.category.color,
              }}
            >
              {activeQuestion.category.name} · {activeQuestion.question.points} баллов
            </div>

            <h2 className="text-3xl font-black text-center mb-10 leading-snug">
              {activeQuestion.question.text}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              {activeQuestion.question.options.map((opt) => {
                const isCorrect = opt.label === activeQuestion.question.correctAnswer;
                const isSelected = opt.label === selectedAnswer;
                let btnClass = "bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white";
                if (showResult) {
                  if (isCorrect) btnClass = "bg-emerald-600 border border-emerald-500 text-white";
                  else if (isSelected && !isCorrect) btnClass = "bg-red-700 border border-red-600 text-white";
                  else btnClass = "bg-gray-800 border border-gray-700 text-gray-500";
                }
                return (
                  <motion.button
                    key={opt.label}
                    whileHover={!showResult ? { scale: 1.03 } : {}}
                    whileTap={!showResult ? { scale: 0.97 } : {}}
                    onClick={() => handleSelectAnswer(opt.label)}
                    disabled={showResult}
                    className={`flex items-start gap-3 text-left px-5 py-4 rounded-xl font-semibold transition-all ${btnClass}`}
                  >
                    <span className="font-black text-lg shrink-0">{opt.label})</span>
                    <span>{opt.text}</span>
                  </motion.button>
                );
              })}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="text-center mb-6">
                  {selectedAnswer === activeQuestion.question.correctAnswer ? (
                    <p className="text-emerald-400 font-black text-2xl">Правильно!</p>
                  ) : (
                    <p className="text-red-400 font-black text-2xl">Неверно!</p>
                  )}
                </div>

                <p className="text-center text-gray-400 font-semibold mb-4">Кому начислить {activeQuestion.question.points} баллов?</p>
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                  {teams.filter((t) => t.name.trim() !== "").map((team, i) => (
                    <motion.button
                      key={i}
                      whileHover={scoringTeam === null ? { scale: 1.05 } : {}}
                      whileTap={scoringTeam === null ? { scale: 0.95 } : {}}
                      onClick={() => handleAwardPoints(i)}
                      disabled={scoringTeam !== null}
                      className={`px-5 py-2 rounded-xl font-black transition-all ${
                        scoringTeam === i
                          ? `${TEAM_COLORS[i].bg} text-white ring-2 ring-white`
                          : scoringTeam !== null
                          ? "bg-gray-800 text-gray-500 cursor-default"
                          : `${TEAM_COLORS[i].bg} text-white`
                      }`}
                    >
                      {team.name}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={scoringTeam === null ? { scale: 1.05 } : {}}
                    whileTap={scoringTeam === null ? { scale: 0.95 } : {}}
                    onClick={() => setScoringTeam(-1)}
                    disabled={scoringTeam !== null}
                    className={`px-5 py-2 rounded-xl font-black transition-all ${
                      scoringTeam === -1
                        ? "bg-gray-600 text-white ring-2 ring-white"
                        : scoringTeam !== null
                        ? "bg-gray-800 text-gray-500 cursor-default"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    Никому
                  </motion.button>
                </div>

                {scoringTeam !== null && (
                  <div className="text-center">
                    <button
                      onClick={handleCloseQuestion}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg px-12 py-3 rounded-xl transition-colors"
                    >
                      К ДОСКЕ →
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {gameState === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-4 py-12"
          >
            <h2 className="text-5xl font-black mb-2 text-center">Итоги</h2>
            <p className="text-gray-400 mb-12 text-center">Финальная таблица результатов</p>

            <div className="w-full max-w-lg flex flex-col gap-4 mb-12">
              {sortedTeams.map((team, i) => (
                <motion.div
                  key={team.originalIndex}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl ${
                    i === 0 ? "bg-amber-900/40 border border-amber-500/40" : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  <span className={`text-3xl font-black w-8 text-center ${i === 0 ? "text-amber-400" : "text-gray-500"}`}>
                    {i + 1}
                  </span>
                  <div className={`w-3 h-10 rounded-full ${TEAM_COLORS[team.originalIndex].bg}`} />
                  <span className="font-black text-xl flex-1">{team.name}</span>
                  <span className={`font-black text-2xl ${i === 0 ? "text-amber-400" : "text-white"}`}>
                    {team.score}
                  </span>
                </motion.div>
              ))}
            </div>

            {sortedTeams.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-10"
              >
                <div className="text-6xl mb-2">🏆</div>
                <p className="text-2xl font-black text-amber-400">Победитель: {sortedTeams[0].name}!</p>
              </motion.div>
            )}

            <button
              onClick={handleRestart}
              className="bg-gray-800 hover:bg-gray-700 text-white font-black text-lg px-12 py-4 rounded-2xl border border-gray-600 transition-colors"
            >
              ИГРАТЬ СНОВА
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
