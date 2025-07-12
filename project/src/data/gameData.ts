export interface CodeOption {
  label: string;
  isCorrect: boolean;
}

export interface GameLevel {
  question: string;
  options: CodeOption[];
}

export const gameLevels: GameLevel[] = [
  {
    question: "Start with a basic conditional statement:",
    options: [
      { label: "if x > 0:", isCorrect: true },
      { label: "while x > 0:", isCorrect: false },
      { label: "for x in range:", isCorrect: false }
    ]
  },
  {
    question: "Inside the if block, what comes next?",
    options: [
      { label: "else:", isCorrect: false },
      { label: "    print('positive')", isCorrect: true },
      { label: "elif x < 0:", isCorrect: false }
    ]
  },
  {
    question: "Add an alternative condition:",
    options: [
      { label: "elif x < 0:", isCorrect: true },
      { label: "if x < 0:", isCorrect: false },
      { label: "else x < 0:", isCorrect: false }
    ]
  },
  {
    question: "What should go in the elif block?",
    options: [
      { label: "    return False", isCorrect: false },
      { label: "    print('negative')", isCorrect: true },
      { label: "    break", isCorrect: false }
    ]
  },
  {
    question: "Complete the conditional with:",
    options: [
      { label: "finally:", isCorrect: false },
      { label: "else:", isCorrect: true },
      { label: "except:", isCorrect: false }
    ]
  },
  {
    question: "In the else block:",
    options: [
      { label: "    print('zero')", isCorrect: true },
      { label: "    pass", isCorrect: false },
      { label: "    continue", isCorrect: false }
    ]
  },
  {
    question: "Start a loop structure:",
    options: [
      { label: "for i in range(5):", isCorrect: true },
      { label: "foreach i in 5:", isCorrect: false },
      { label: "loop i = 0 to 5:", isCorrect: false }
    ]
  },
  {
    question: "Inside the loop:",
    options: [
      { label: "    i++", isCorrect: false },
      { label: "    print(i)", isCorrect: true },
      { label: "    return i", isCorrect: false }
    ]
  },
  {
    question: "Define a function:",
    options: [
      { label: "def calculate():", isCorrect: true },
      { label: "function calculate():", isCorrect: false },
      { label: "func calculate():", isCorrect: false }
    ]
  },
  {
    question: "Add a return statement:",
    options: [
      { label: "    yield result", isCorrect: false },
      { label: "    return result", isCorrect: true },
      { label: "    output result", isCorrect: false }
    ]
  }
];