import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

const CATEGORIES = [
  { id: "strategy", name: "Стратегия", color: "#6366f1", icon: "Target" },
  { id: "leadership", name: "Лидерство", color: "#f59e0b", icon: "Crown" },
  { id: "processes", name: "Процессы", color: "#10b981", icon: "Settings" },
  { id: "finance", name: "Финансы", color: "#3b82f6", icon: "TrendingUp" },
  { id: "marketing", name: "Маркетинг", color: "#ec4899", icon: "Megaphone" },
  { id: "hr", name: "Персонал", color: "#f97316", icon: "Users" },
];

const QUESTIONS: Record<string, { question: string; options: string[]; answer: string }[]> = {
  strategy: [
    {
      question: "Какой инструмент стратегического анализа оценивает сильные и слабые стороны компании, а также возможности и угрозы?",
      options: ["а) PEST-анализ", "б) SWOT-анализ", "в) Porter's Five Forces", "г) BCG-матрица"],
      answer: "б) SWOT-анализ",
    },
    {
      question: "Как называется стратегия, при которой компания стремится занять позицию с наименьшими издержками в отрасли?",
      options: ["а) Дифференциация", "б) Фокусирование", "в) Лидерство по издержкам", "г) Диверсификация"],
      answer: "в) Лидерство по издержкам",
    },
    {
      question: "Что такое «голубой океан» в стратегии бизнеса?",
      options: ["а) Рынок с высокой конкуренцией", "б) Новое рыночное пространство без конкурентов", "в) Международный рынок", "г) Рынок предметов роскоши"],
      answer: "б) Новое рыночное пространство без конкурентов",
    },
    {
      question: "Что означает термин «вертикальная интеграция»?",
      options: ["а) Слияние конкурентов", "б) Выход на новые рынки", "в) Контроль над цепочкой поставок вверх или вниз", "г) Международное расширение"],
      answer: "в) Контроль над цепочкой поставок вверх или вниз",
    },
  ],
  leadership: [
    {
      question: "Какой стиль руководства предполагает полную передачу полномочий сотрудникам без вмешательства руководителя?",
      options: ["а) Авторитарный", "б) Демократический", "в) Транзакционный", "г) Попустительский (Laissez-faire)"],
      answer: "г) Попустительский (Laissez-faire)",
    },
    {
      question: "Как называется лидерство, основанное на вдохновении и трансформации ценностей команды?",
      options: ["а) Транзакционное", "б) Трансформационное", "в) Директивное", "г) Харизматическое"],
      answer: "б) Трансформационное",
    },
    {
      question: "Что такое эмоциональный интеллект (EQ) в контексте лидерства?",
      options: ["а) Уровень IQ руководителя", "б) Способность распознавать и управлять эмоциями", "в) Техническая компетентность", "г) Умение делегировать"],
      answer: "б) Способность распознавать и управлять эмоциями",
    },
    {
      question: "Что такое «ситуационное лидерство» по Херси и Бланшару?",
      options: ["а) Лидерство в кризисных ситуациях", "б) Адаптация стиля руководства под уровень зрелости сотрудника", "в) Управление в условиях неопределённости", "г) Руководство удалёнными командами"],
      answer: "б) Адаптация стиля руководства под уровень зрелости сотрудника",
    },
  ],
  processes: [
    {
      question: "Что обозначает методология Lean в управлении процессами?",
      options: ["а) Ускоренный рост", "б) Устранение потерь и повышение ценности для клиента", "в) Снижение численности персонала", "г) Автоматизация производства"],
      answer: "б) Устранение потерь и повышение ценности для клиента",
    },
    {
      question: "Что такое KPI?",
      options: ["а) Ключевые показатели эффективности", "б) Корпоративные принципы инвестирования", "в) Квалификационные показатели исполнения", "г) Критерии продуктивности интеграции"],
      answer: "а) Ключевые показатели эффективности",
    },
    {
      question: "Что означает цикл PDCA в управлении качеством?",
      options: ["а) Планирование, Действие, Контроль, Анализ", "б) Планируй, Делай, Проверяй, Действуй", "в) Подготовка, Данные, Коммуникация, Адаптация", "г) Процесс, Диагностика, Коррекция, Аудит"],
      answer: "б) Планируй, Делай, Проверяй, Действуй",
    },
    {
      question: "Что такое «узкое место» (bottleneck) в теории ограничений Голдратта?",
      options: ["а) Самый дорогой ресурс", "б) Ресурс, ограничивающий пропускную способность системы", "в) Неэффективный сотрудник", "г) Проблемный клиент"],
      answer: "б) Ресурс, ограничивающий пропускную способность системы",
    },
  ],
  finance: [
    {
      question: "Что такое EBITDA?",
      options: ["а) Чистая прибыль компании", "б) Прибыль до вычета процентов, налогов, амортизации", "в) Общая выручка компании", "г) Рентабельность капитала"],
      answer: "б) Прибыль до вычета процентов, налогов, амортизации",
    },
    {
      question: "Что показывает коэффициент текущей ликвидности?",
      options: ["а) Рентабельность продаж", "б) Способность компании покрыть краткосрочные обязательства оборотными активами", "в) Уровень долговой нагрузки", "г) Скорость оборота капитала"],
      answer: "б) Способность компании покрыть краткосрочные обязательства оборотными активами",
    },
    {
      question: "Что такое NPV (чистая приведённая стоимость)?",
      options: ["а) Сумма всех доходов проекта", "б) Разница между дисконтированными доходами и расходами проекта", "в) Норма прибыли на инвестиции", "г) Срок окупаемости проекта"],
      answer: "б) Разница между дисконтированными доходами и расходами проекта",
    },
    {
      question: "Что означает термин «точка безубыточности»?",
      options: ["а) Максимальная прибыль компании", "б) Объём продаж, при котором выручка покрывает все затраты", "в) Минимальный уровень рентабельности", "г) Момент возврата инвестиций"],
      answer: "б) Объём продаж, при котором выручка покрывает все затраты",
    },
  ],
  marketing: [
    {
      question: "Что такое «маркетинг-микс 4P»?",
      options: ["а) Продукт, Цена, Место, Продвижение", "б) Персонал, Процесс, Прибыль, Позиционирование", "в) Продажи, Партнёры, Площадки, Программы", "г) Производство, Поставки, Покупатели, Прибыль"],
      answer: "а) Продукт, Цена, Место, Продвижение",
    },
    {
      question: "Что такое NPS (Net Promoter Score)?",
      options: ["а) Показатель прибыльности клиента", "б) Индекс потребительской лояльности", "в) Стоимость привлечения клиента", "г) Охват рекламной кампании"],
      answer: "б) Индекс потребительской лояльности",
    },
    {
      question: "Что такое «воронка продаж»?",
      options: ["а) Схема логистики товара", "б) Модель пути клиента от знакомства до покупки", "в) Инструмент ценообразования", "г) Метод сегментации рынка"],
      answer: "б) Модель пути клиента от знакомства до покупки",
    },
    {
      question: "Что означает аббревиатура B2B?",
      options: ["а) Бизнес для банков", "б) Бизнес для бизнеса", "в) Бренд для покупателей", "г) Бюджет для брендинга"],
      answer: "б) Бизнес для бизнеса",
    },
  ],
  hr: [
    {
      question: "Что такое онбординг?",
      options: ["а) Увольнение сотрудников", "б) Процесс адаптации новых сотрудников в компании", "в) Оценка персонала", "г) Система мотивации"],
      answer: "б) Процесс адаптации новых сотрудников в компании",
    },
    {
      question: "Что такое «оценка 360 градусов»?",
      options: ["а) Аттестация только руководителем", "б) Комплексная оценка сотрудника от всех: коллег, подчинённых, руководителя, самооценка", "в) Ежеквартальный анализ KPI", "г) Внешний аудит персонала"],
      answer: "б) Комплексная оценка сотрудника от всех: коллег, подчинённых, руководителя, самооценка",
    },
    {
      question: "Что означает термин «текучесть кадров»?",
      options: ["а) Повышение производительности персонала", "б) Соотношение уволившихся сотрудников к среднесписочной численности", "в) Процент обученных сотрудников", "г) Скорость найма новых специалистов"],
      answer: "б) Соотношение уволившихся сотрудников к среднесписочной численности",
    },
    {
      question: "Что такое грейдирование должностей в HR?",
      options: ["а) Система аттестации руководителей", "б) Структурирование должностей по уровням с привязкой к оплате труда", "в) Программа обучения сотрудников", "г) Метод подбора персонала"],
      answer: "б) Структурирование должностей по уровням с привязкой к оплате труда",
    },
  ],
};

type GameState = "start" | "setup" | "board" | "question" | "result";

interface Team {
  name: string;
  score: number;
}

interface AnsweredQuestion {
  category: string;
  index: number;
}

export default function ManagementGame() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [setupOpen, setSetupOpen] = useState(false);
  const [teamNames, setTeamNames] = useState(["", "", "", ""]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<{ category: string; index: number } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [scoringTeam, setScoringTeam] = useState<number | null>(null);

  const handleStartClick = () => {
    setSetupOpen(true);
  };

  const handleSetupConfirm = () => {
    const filledTeams = teamNames
      .filter((n) => n.trim())
      .map((n) => ({ name: n.trim(), score: 0 }));
    if (filledTeams.length < 2) return;
    setTeams(filledTeams);
    setSetupOpen(false);
    setGameState("board");
  };

  const isAnswered = (category: string, index: number) =>
    answeredQuestions.some((q) => q.category === category && q.index === index);

  const handleQuestionClick = (category: string, index: number) => {
    if (isAnswered(category, index)) return;
    setActiveQuestion({ category, index });
    setSelectedAnswer(null);
    setShowCorrect(false);
    setScoringTeam(null);
    setGameState("question");
  };

  const handleAnswer = (option: string) => {
    if (showCorrect) return;
    setSelectedAnswer(option);
    setShowCorrect(true);
  };

  const handleScoreTeam = (teamIndex: number) => {
    if (!activeQuestion) return;
    const correct = QUESTIONS[activeQuestion.category][activeQuestion.index].answer;
    if (selectedAnswer === correct) {
      setTeams((prev) =>
        prev.map((t, i) => (i === teamIndex ? { ...t, score: t.score + 200 } : t))
      );
    }
    setScoringTeam(teamIndex);
  };

  const handleCloseQuestion = () => {
    if (activeQuestion) {
      setAnsweredQuestions((prev) => [...prev, activeQuestion]);
    }
    setActiveQuestion(null);
    setGameState("board");

    const totalQuestions = Object.values(QUESTIONS).reduce((sum, qs) => sum + qs.length, 0);
    const newAnswered = answeredQuestions.length + 1;
    if (newAnswered >= totalQuestions) {
      setTimeout(() => setGameState("result"), 300);
    }
  };

  const resetGame = () => {
    setGameState("start");
    setTeams([]);
    setTeamNames(["", "", "", ""]);
    setAnsweredQuestions([]);
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setShowCorrect(false);
    setScoringTeam(null);
  };

  const currentQuestion =
    activeQuestion ? QUESTIONS[activeQuestion.category][activeQuestion.index] : null;
  const correctAnswer = currentQuestion?.answer;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      }}
    >
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: CATEGORIES[i % CATEGORIES.length].color,
              filter: "blur(80px)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 6 + i * 0.5, repeat: Infinity }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* СТАРТОВЫЙ ЭКРАН */}
        {gameState === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center z-10 px-6"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🏆
            </motion.div>
            <h1
              className="text-6xl font-black mb-4 leading-tight"
              style={{
                background: "linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              МЕНЕДЖМЕНТ
            </h1>
            <p className="text-white/60 text-xl mb-2">Викторина для управленцев</p>
            <p className="text-white/40 text-sm mb-10">6 категорий · 20 вопросов · 200 баллов за вопрос</p>
            <Button
              onClick={handleStartClick}
              className="text-xl px-12 py-6 rounded-2xl font-bold shadow-2xl"
              style={{
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                color: "white",
                border: "none",
              }}
            >
              Начать игру
            </Button>
          </motion.div>
        )}

        {/* ИГРОВОЕ ПОЛЕ */}
        {gameState === "board" && (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 w-full max-w-6xl px-4 py-6"
          >
            {/* Табло команд */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {teams.map((team, i) => (
                <motion.div
                  key={i}
                  className="text-center px-6 py-3 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-white/60 text-xs font-medium mb-1">{team.name}</div>
                  <div className="text-white text-2xl font-black">{team.score}</div>
                </motion.div>
              ))}
            </div>

            {/* Категории и вопросы */}
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
              {CATEGORIES.map((cat) => {
                const questions = QUESTIONS[cat.id];
                return (
                  <div key={cat.id} className="flex flex-col gap-2">
                    <div
                      className="rounded-xl p-3 text-center font-bold text-sm text-white"
                      style={{ background: cat.color + "cc" }}
                    >
                      <Icon name={cat.icon} fallback="Target" size={18} className="mx-auto mb-1" />
                      {cat.name}
                    </div>
                    {questions.map((_, qIdx) => (
                      <motion.button
                        key={qIdx}
                        onClick={() => handleQuestionClick(cat.id, qIdx)}
                        disabled={isAnswered(cat.id, qIdx)}
                        whileHover={!isAnswered(cat.id, qIdx) ? { scale: 1.05 } : {}}
                        whileTap={!isAnswered(cat.id, qIdx) ? { scale: 0.95 } : {}}
                        className="rounded-xl py-4 text-lg font-black transition-all"
                        style={{
                          background: isAnswered(cat.id, qIdx)
                            ? "rgba(255,255,255,0.05)"
                            : cat.color,
                          color: isAnswered(cat.id, qIdx) ? "rgba(255,255,255,0.2)" : "white",
                          cursor: isAnswered(cat.id, qIdx) ? "not-allowed" : "pointer",
                          boxShadow: isAnswered(cat.id, qIdx) ? "none" : `0 4px 20px ${cat.color}66`,
                        }}
                      >
                        {isAnswered(cat.id, qIdx) ? "—" : "200"}
                      </motion.button>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-6">
              <button onClick={resetGame} className="text-white/30 text-sm hover:text-white/60 transition-colors">
                Начать заново
              </button>
            </div>
          </motion.div>
        )}

        {/* ЭКРАН ВОПРОСА */}
        {gameState === "question" && currentQuestion && activeQuestion && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="z-10 w-full max-w-3xl px-4 py-6"
          >
            {/* Категория */}
            <div className="text-center mb-6">
              {(() => {
                const cat = CATEGORIES.find((c) => c.id === activeQuestion.category)!;
                return (
                  <span
                    className="px-4 py-2 rounded-full text-white font-bold text-sm"
                    style={{ background: cat.color }}
                  >
                    {cat.name} · 200 баллов
                  </span>
                );
              })()}
            </div>

            {/* Вопрос */}
            <div
              className="rounded-3xl p-8 mb-6 text-center"
              style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
            >
              <p className="text-white text-xl font-semibold leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Варианты ответов */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {currentQuestion.options.map((opt) => {
                const isCorrect = opt === correctAnswer;
                const isSelected = opt === selectedAnswer;
                let bg = "rgba(255,255,255,0.07)";
                let border = "1px solid rgba(255,255,255,0.1)";
                if (showCorrect && isCorrect) {
                  bg = "rgba(16,185,129,0.3)";
                  border = "1px solid #10b981";
                } else if (showCorrect && isSelected && !isCorrect) {
                  bg = "rgba(239,68,68,0.3)";
                  border = "1px solid #ef4444";
                }
                return (
                  <motion.button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    whileHover={!showCorrect ? { scale: 1.02 } : {}}
                    whileTap={!showCorrect ? { scale: 0.98 } : {}}
                    className="w-full text-left rounded-2xl px-6 py-4 text-white font-medium transition-all"
                    style={{ background: bg, border }}
                  >
                    {opt}
                    {showCorrect && isCorrect && (
                      <span className="ml-2 text-green-400">✓</span>
                    )}
                    {showCorrect && isSelected && !isCorrect && (
                      <span className="ml-2 text-red-400">✗</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Начисление баллов */}
            {showCorrect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 mb-4"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <p className="text-white/70 text-sm text-center mb-3">
                  {selectedAnswer === correctAnswer
                    ? "Правильно! Кому начислить 200 баллов?"
                    : "Неверно. Засчитать баллы команде?"}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {teams.map((team, i) => (
                    <button
                      key={i}
                      onClick={() => handleScoreTeam(i)}
                      disabled={scoringTeam !== null}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                      style={{
                        background:
                          scoringTeam === i
                            ? "#10b981"
                            : scoringTeam !== null
                            ? "rgba(255,255,255,0.1)"
                            : "#6366f1",
                        cursor: scoringTeam !== null ? "not-allowed" : "pointer",
                      }}
                    >
                      {team.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setScoringTeam(-1)}
                    disabled={scoringTeam !== null}
                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: scoringTeam === -1 ? "#ef4444" : "rgba(255,255,255,0.1)",
                      color: "white",
                      cursor: scoringTeam !== null ? "not-allowed" : "pointer",
                    }}
                  >
                    Никому
                  </button>
                </div>
              </motion.div>
            )}

            {(scoringTeam !== null || showCorrect) && (
              <div className="text-center">
                <Button
                  onClick={handleCloseQuestion}
                  className="px-8 py-3 rounded-2xl font-bold text-white"
                  style={{ background: "#6366f1" }}
                >
                  Вернуться к доске
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* РЕЗУЛЬТАТЫ */}
        {gameState === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center px-6 max-w-lg w-full"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2
              className="text-4xl font-black mb-8"
              style={{
                background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Игра завершена!
            </h2>
            <div className="space-y-3 mb-8">
              {[...teams]
                .sort((a, b) => b.score - a.score)
                .map((team, i) => (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between rounded-2xl px-6 py-4"
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(90deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))"
                          : "rgba(255,255,255,0.07)",
                      border: i === 0 ? "1px solid rgba(251,191,36,0.4)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="text-white font-bold text-lg">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "4."} {team.name}
                    </span>
                    <span className="text-white font-black text-2xl">{team.score}</span>
                  </motion.div>
                ))}
            </div>
            <Button
              onClick={resetGame}
              className="px-10 py-4 rounded-2xl font-bold text-white text-lg"
              style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
            >
              Играть снова
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ДИАЛОГ — ВВОД КОМАНД */}
      <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
        <DialogContent
          className="rounded-3xl border-0 max-w-md"
          style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", color: "white" }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-black text-center mb-2">
              Назовите команды предпринимателей
            </DialogTitle>
            <p className="text-white/50 text-sm text-center">Введите названия (минимум 2)</p>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {teamNames.map((name, i) => (
              <Input
                key={i}
                placeholder={`Команда ${i + 1}`}
                value={name}
                onChange={(e) =>
                  setTeamNames((prev) => prev.map((n, idx) => (idx === i ? e.target.value : n)))
                }
                className="rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/30 focus:border-purple-400"
              />
            ))}
          </div>
          <Button
            onClick={handleSetupConfirm}
            disabled={teamNames.filter((n) => n.trim()).length < 2}
            className="w-full mt-4 py-4 rounded-2xl font-bold text-white text-lg"
            style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
          >
            Начать игру!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}