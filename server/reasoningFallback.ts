// Comprehensive NIELIT 'O' Level Standard Logical Reasoning Question Engine
// Procedural generator with parameterized questions & shuffle permutations for guaranteed variation

export interface FallbackQuestion {
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
  topic: string;
  difficulty: string;
}

// 25+ distinct logical reasoning archetypes with parameterized variations
interface QuestionTemplate {
  topic: string;
  generate: (seed: number) => FallbackQuestion;
}

const TEMPLATES: QuestionTemplate[] = [
  // 1. Categorical Syllogisms
  {
    topic: "Categorical Syllogisms",
    generate: (seed) => {
      const entitySets = [
        { a: "algorithms", b: "deterministic procedures", c: "finite-time processes", aHi: "एल्गोरिदम", bHi: "निश्चयात्मक प्रक्रियाएं", cHi: "परिमित-समय प्रक्रियाएं" },
        { a: "hash functions", b: "one-way transformations", c: "cryptographic primitives", aHi: "हैश फ़ंक्शन", bHi: "वन-वे रूपांतरण", cHi: "क्रिप्टोग्राफ़िक प्रिमिटिव्स" },
        { a: "recursive functions", b: "stack-allocating routines", c: "memory-bounded tasks", aHi: "पुनरावर्ती फलन (Recursive Functions)", bHi: "स्टैक-आवंटक रूटीन", cHi: "मेमोरी-बाउंड कार्य" },
        { a: "boolean circuits", b: "logic gate networks", c: "binary computational systems", aHi: "बूलियन सर्किट", bHi: "लॉजिक गेट नेटवर्क", cHi: "द्वि-आधारी संगणना प्रणालियाँ" }
      ];
      const item = entitySets[seed % entitySets.length];
      const formatIdx = seed % 3;

      if (formatIdx === 0) {
        return {
          questionEn: `Statements: All ${item.a} are ${item.b}. All ${item.b} are ${item.c}.\nConclusion I: All ${item.a} are ${item.c}.\nConclusion II: Some ${item.c} are ${item.a}.`,
          questionHi: `कथन: सभी ${item.aHi} ${item.bHi} हैं। सभी ${item.bHi} ${item.cHi} हैं।\nनिष्कर्ष I: सभी ${item.aHi} ${item.cHi} हैं।\nनिष्कर्ष II: कुछ ${item.cHi} ${item.aHi} हैं।`,
          optionsEn: ["Only Conclusion I follows", "Only Conclusion II follows", "Both Conclusion I and Conclusion II follow", "Neither Conclusion follows"],
          optionsHi: ["केवल निष्कर्ष I निकलता है", "केवल निष्कर्ष II निकलता है", "दोनों निष्कर्ष I और II निकलते हैं", "कोई निष्कर्ष नहीं निकलता"],
          correctIndex: 2,
          explanationEn: `By transitive universal affirmative syllogism (Barbara: All A are B, All B are C ⊢ All A are C), Conclusion I is valid. By subalternation of universal affirmative relations, Conclusion II is also strictly valid.`,
          explanationHi: `पारस्परिक युक्तिवाक्य के सार्वभौमिक सकारात्मक नियम के अनुसार यदि सभी A, B हैं और सभी B, C हैं तो सभी A, C होंगे। साथ ही 'सभी' से 'कुछ' का रूपांतरण सत्य है, अतः दोनों निष्कर्ष सत्य हैं।`,
          topic: "Categorical Syllogisms",
          difficulty: "O Level Difficulty"
        };
      } else if (formatIdx === 1) {
        return {
          questionEn: `Statements: No ${item.a} is an unverified routine. Some ${item.b} are ${item.a}.\nConclusion I: Some ${item.b} are not unverified routines.\nConclusion II: All ${item.b} are ${item.a}.`,
          questionHi: `कथन: कोई भी ${item.aHi} असत्यापित रूटीन नहीं है। कुछ ${item.bHi} ${item.aHi} हैं।\nनिष्कर्ष I: कुछ ${item.bHi} असत्यापित रूटीन नहीं हैं।\nनिष्कर्ष II: सभी ${item.bHi} ${item.aHi} हैं।`,
          optionsEn: ["Only Conclusion I follows", "Only Conclusion II follows", "Both follow", "Neither follows"],
          optionsHi: ["केवल निष्कर्ष I निकलता है", "केवल निष्कर्ष II निकलता है", "दोनों निकलते हैं", "कोई नहीं निकलता"],
          correctIndex: 0,
          explanationEn: `Since some B are A and no A is an unverified routine, those particular B that are A cannot be unverified routines (Festino syllogism). Conclusion II over-generalizes and is invalid.`,
          explanationHi: `चूंकि कुछ B, A हैं और कोई A असत्यापित नहीं है, अतः वे B जो A हैं, असत्यापित नहीं हो सकते। निष्कर्ष I पूर्णतः मान्य है।`,
          topic: "Categorical Syllogisms",
          difficulty: "O Level Difficulty"
        };
      } else {
        return {
          questionEn: `Statements: Some ${item.a} are ${item.b}. All ${item.b} are ${item.c}.\nConclusion I: Some ${item.a} are ${item.c}.\nConclusion II: No ${item.a} is ${item.c}.`,
          questionHi: `कथन: कुछ ${item.aHi} ${item.bHi} हैं। सभी ${item.bHi} ${item.cHi} हैं।\nनिष्कर्ष I: कुछ ${item.aHi} ${item.cHi} हैं।\nनिष्कर्ष II: कोई ${item.aHi} ${item.cHi} नहीं है।`,
          optionsEn: ["Only Conclusion I follows", "Only Conclusion II follows", "Either Conclusion I or II follows", "Neither follows"],
          optionsHi: ["केवल निष्कर्ष I निकलता है", "केवल निष्कर्ष II निकलता है", "या तो निष्कर्ष I या II निकलता है", "कोई नहीं निकलता"],
          correctIndex: 0,
          explanationEn: `The intersection of A and B is non-empty. Since all B are in C, that intersection is wholly contained in C, proving that 'Some A are C' must hold.`,
          explanationHi: `A और B का प्रतिच्छेदन रिक्त नहीं है। चूंकि सभी B, C के अंतर्गत हैं, अतः कुछ A अवश्य C होंगे। केवल निष्कर्ष I सत्य है।`,
          topic: "Categorical Syllogisms",
          difficulty: "O Level Difficulty"
        };
      }
    }
  },

  // 2. Boolean Algebra & De Morgan Laws
  {
    topic: "Boolean Algebra & Logic",
    generate: (seed) => {
      const vars = [
        { expr: "not (P and Q)", eq: "(not P) or (not Q)", wrong1: "(not P) and (not Q)", wrong2: "not (P or Q)", wrong3: "P and (not Q)", law: "De Morgan's First Law" },
        { expr: "not (P or Q)", eq: "(not P) and (not Q)", wrong1: "(not P) or (not Q)", wrong2: "P or (not Q)", wrong3: "not (P and Q)", law: "De Morgan's Second Law" },
        { expr: "P or (P and Q)", eq: "P", wrong1: "P and Q", wrong2: "Q", wrong3: "P or Q", law: "Absorption Law (अवशोषण नियम)" },
        { expr: "P and (P or Q)", eq: "P", wrong1: "P or Q", wrong2: "Q", wrong3: "not P", law: "Dual Absorption Law" },
        { expr: "P or (not P and Q)", eq: "P or Q", wrong1: "P and Q", wrong2: "not P and not Q", wrong3: "Q", law: "Redundancy Law in Boolean Simplification" }
      ];
      const chosen = vars[seed % vars.length];
      return {
        questionEn: `According to ${chosen.law}, what is the simplified logically equivalent expression for: \`${chosen.expr}\`?`,
        questionHi: `${chosen.law} के अनुसार, व्यंजक \`${chosen.expr}\` का सरलीकृत तार्किक समतुल्य रूप क्या है?`,
        optionsEn: [chosen.eq, chosen.wrong1, chosen.wrong2, chosen.wrong3],
        optionsHi: [chosen.eq, chosen.wrong1, chosen.wrong2, chosen.wrong3],
        correctIndex: 0,
        explanationEn: `Applying ${chosen.law} in formal Boolean algebra: ${chosen.expr} simplifies identically to ${chosen.eq}.`,
        explanationHi: `बूलियन बीजगणित में ${chosen.law} लागू करने पर, ${chosen.expr} सीधे ${chosen.eq} के समतुल्य प्राप्त होता है।`,
        topic: "Boolean Algebra & Logic",
        difficulty: "O Level Difficulty"
      };
    }
  },

  // 3. Coding-Decoding Letter Transformation
  {
    topic: "Coding-Decoding Logic",
    generate: (seed) => {
      const patterns = [
        { word: "LOGIC", code: "MQHJE", target: "PYTHON", targetCode: "QAVKQO", rule: "+1, +2 alternating shift" },
        { word: "BINARY", code: "CJPBSZ", target: "PYTHON", targetCode: "QAZIOP", rule: "+1 shift across all positions" },
        { word: "CIPHER", code: "FLSKHU", target: "MEMORY", targetCode: "PHPRUB", rule: "+3 Caesar shift" },
        { word: "SEARCH", code: "TFBSDI", target: "VECTOR", targetCode: "WFDUSP", rule: "+1 forward sequential transposition" },
        { word: "STACK", code: "RUZZJ", target: "QUEUE", targetCode: "PTTDD", rule: "-1 backward shift across characters" }
      ];
      const item = patterns[seed % patterns.length];
      const wrongs = [
        item.targetCode.split('').reverse().join(''),
        item.targetCode.slice(0, -1) + 'Z',
        item.targetCode.slice(1) + 'A'
      ];
      return {
        questionEn: `In a certain cipher encoding, '${item.word}' is written as '${item.code}'. Using the exact same transformation pattern, how will '${item.target}' be written?`,
        questionHi: `एक विशेष कूट भाषा में, '${item.word}' को '${item.code}' लिखा जाता है। उसी परिवर्तन नियम के आधार पर '${item.target}' को कैसे लिखा जाएगा?`,
        optionsEn: [item.targetCode, wrongs[0], wrongs[1], wrongs[2]],
        optionsHi: [item.targetCode, wrongs[0], wrongs[1], wrongs[2]],
        correctIndex: 0,
        explanationEn: `The character shift rule is '${item.rule}'. Applying this systematically to '${item.target}' yields '${item.targetCode}'.`,
        explanationHi: `वर्ण परिवर्तन नियम '${item.rule}' है। '${item.target}' के प्रत्येक अक्षर पर यह नियम लागू करने पर सही उत्तर '${item.targetCode}' प्राप्त होता है।`,
        topic: "Coding-Decoding Logic",
        difficulty: "O Level Difficulty"
      };
    }
  },

  // 4. Blood Relations Deductive Reasoning
  {
    topic: "Blood Relations Deduction",
    generate: (seed) => {
      const scenarios = [
        {
          expr: "P - R + Q",
          rule: "'A + B' means A is father of B; 'A - B' means A is sister of B; 'A * B' means A is brother of B.",
          target: "P is the paternal aunt (बुआ) of Q",
          correct: "P - R + Q",
          w1: "P + R - Q",
          w2: "P * R + Q",
          w3: "Q + R - P",
          exp: "In P - R + Q, P is sister of R, and R is father of Q. Hence, P is father's sister (paternal aunt) of Q."
        },
        {
          expr: "X * Y + Z",
          rule: "'A + B' means A is father of B; 'A - B' means A is mother of B; 'A * B' means A is brother of B.",
          target: "X is the paternal uncle (चाचा) of Z",
          correct: "X * Y + Z",
          w1: "X + Y * Z",
          w2: "Z * Y + X",
          w3: "X - Y + Z",
          exp: "In X * Y + Z, X is brother of Y, and Y is father of Z. Thus X is father's brother (paternal uncle) of Z."
        },
        {
          expr: "M - N * K",
          rule: "'A - B' means A is mother of B; 'A * B' means A is brother of B; 'A / B' means A is sister of B.",
          target: "M is the mother of K",
          correct: "M - N * K",
          w1: "K - N * M",
          w2: "M * N - K",
          w3: "N - M * K",
          exp: "In M - N * K, M is mother of N and N is brother of K. Therefore, M is also the mother of K."
        }
      ];
      const sc = scenarios[seed % scenarios.length];
      return {
        questionEn: `If ${sc.rule} Which coded expression definitively establishes that "${sc.target}"?`,
        questionHi: `यदि ${sc.rule} तो कौन सा कूट व्यंजक निश्चित रूप से सिद्ध करता है कि "${sc.target}"?`,
        optionsEn: [sc.correct, sc.w1, sc.w2, sc.w3],
        optionsHi: [sc.correct, sc.w1, sc.w2, sc.w3],
        correctIndex: 0,
        explanationEn: sc.exp,
        explanationHi: sc.exp,
        topic: "Blood Relations Deduction",
        difficulty: "O Level Difficulty"
      };
    }
  },

  // 5. Direction & Spatial Displacement Logic
  {
    topic: "Direction Sense & Geometry",
    generate: (seed) => {
      const distances = [
        { n: 12, e: 5, ans: "13 meters North-East", ansHi: "13 मीटर उत्तर-पूर्व", dist: "sqrt(12^2 + 5^2) = 13m", w1: "17 meters North", w2: "7 meters East", w3: "15 meters North-West" },
        { n: 8, e: 6, ans: "10 meters North-East", ansHi: "10 मीटर उत्तर-पूर्व", dist: "sqrt(8^2 + 6^2) = 10m", w1: "14 meters East", w2: "2 meters North", w3: "12 meters South-East" },
        { n: 15, e: 8, ans: "17 meters North-East", ansHi: "17 मीटर उत्तर-पूर्व", dist: "sqrt(15^2 + 8^2) = 17m", w1: "23 meters North", w2: "7 meters East", w3: "16 meters North-East" },
        { n: 24, e: 7, ans: "25 meters North-East", ansHi: "25 मीटर उत्तर-पूर्व", dist: "sqrt(24^2 + 7^2) = 25m", w1: "31 meters North", w2: "17 meters West", w3: "26 meters South-East" }
      ];
      const d = distances[seed % distances.length];
      return {
        questionEn: `A robotic rover starts at origin (0,0), travels ${d.n} meters North, turns 90 degrees right and travels ${d.e} meters East. What is the shortest displacement and direction of the rover from its starting point?`,
        questionHi: `एक रोबोटिक रोवर बिंदु (0,0) से प्रारंभ करके ${d.n} मीटर उत्तर की ओर जाता है, 90 अंश दायें मुड़कर ${d.e} मीटर पूर्व की ओर जाता है। प्रारंभिक बिंदु से रोवर का न्यूनतम विस्थापन (Shortest Displacement) और दिशा क्या है?`,
        optionsEn: [d.ans, d.w1, d.w2, d.w3],
        optionsHi: [d.ansHi, d.w1, d.w2, d.w3],
        correctIndex: 0,
        explanationEn: `Using Pythagoras theorem on the right-angled triangle: Displacement = √(${d.n}² + ${d.e}²) = ${d.dist}, directed towards the North-East quadrant.`,
        explanationHi: `पाइथागोरस प्रमेय (√(${d.n}² + ${d.e}²)) के अनुसार न्यूनतम दूरी = ${d.dist} उत्तर-पूर्व दिशा में है।`,
        topic: "Direction Sense & Geometry",
        difficulty: "O Level Difficulty"
      };
    }
  },

  // 6. Algorithmic Short-Circuit & Truth Evaluation
  {
    topic: "Algorithmic Short-Circuit Logic",
    generate: (seed) => {
      const questions = [
        {
          qEn: "Consider the conditional statement in Python: `val = False and (100 / 0 > 5)`. Why does this expression execute without raising a ZeroDivisionError?",
          qHi: "पायथन में सशर्त व्यंजक: `val = False and (100 / 0 > 5)` पर विचार करें। यह बिना ZeroDivisionError उत्पन्न किए क्यों निष्पादित हो जाता है?",
          ansEn: "Short-circuit evaluation: In an 'and' operation, when the first operand is False, the second operand is never evaluated.",
          ansHi: "शॉर्ट-सर्किट मूल्यांकन: 'and' ऑपरेटर में पहला ऑपरेंड False होने पर दूसरा ऑपरेंड कभी मूल्यांकित नहीं होता।",
          wEn: [
            "Python automatically sets 100/0 to Infinity in logical comparisons.",
            "Division by zero exceptions are ignored inside logical parenthesis.",
            "The comparison operator '>' has higher precedence than 'and'."
          ],
          wHi: [
            "पायथन तुलना में 100/0 को स्वचालित रूप से अनंत (Infinity) मान लेता है।",
            "तार्किक कोष्ठक के अंदर शून्य से विभाजन अपवाद स्वतः अनदेखा हो जाता है।",
            "तुलना ऑपरेटर '>' की प्राथमिकता 'and' से अधिक होती है।"
          ],
          expEn: "Under short-circuit logic, boolean conjunction `A and B` halts immediately upon finding `A` is false, completely bypassing the evaluation of the faulty divisor.",
          expHi: "शॉर्ट-सर्किट लॉजिक के अनुसार, `A and B` में यदि `A` असत्य है, तो दाहिना भाग कभी निष्पादित नहीं होता, जिससे रनटाइम एरर नहीं आता।"
        },
        {
          qEn: "Consider the expression: `val = True or (100 / 0 > 5)`. Why does this evaluate to True without crashing?",
          qHi: "व्यंजक `val = True or (100 / 0 > 5)` बिना क्रैश हुए True क्यों देता है?",
          ansEn: "Short-circuit disjunction: When the first operand of an 'or' is True, the overall expression is guaranteed True without evaluating the second operand.",
          ansHi: "शॉर्ट-सर्किट 'or': जब 'or' का पहला ऑपरेंड True होता है, तो दूसरा ऑपरेंड जांचे बिना परिणाम True निर्धारित हो जाता है।",
          wEn: [
            "Python evaluates expressions from right to left only.",
            "Division by zero returns 0 in boolean context.",
            "Logical 'or' suppresses all arithmetic exceptions in runtime."
          ],
          wHi: [
            "पायथन केवल दायें से बायें व्यंजक का मूल्यांकन करता है।",
            "बूलियन संदर्भ में शून्य से विभाजन 0 देता है।",
            "लॉजिकल 'or' रनटाइम में सभी अंकगणितीय अपवादों को दबा देता है।"
          ],
          expEn: "For boolean disjunction `A or B`, if `A` evaluates to True, the truth value is already determined as True, skipping the right operand.",
          expHi: "'or' ऑपरेटर में पहला पद सत्य होने पर संपूर्ण परिणाम सत्य तय हो जाता है और दायां पद निष्पादित नहीं होता।"
        }
      ];
      const q = questions[seed % questions.length];
      return {
        questionEn: q.qEn,
        questionHi: q.qHi,
        optionsEn: [q.ansEn, q.wEn[0], q.wEn[1], q.wEn[2]],
        optionsHi: [q.ansHi, q.wHi[0], q.wHi[1], q.wHi[2]],
        correctIndex: 0,
        explanationEn: q.expEn,
        explanationHi: q.expHi,
        topic: "Algorithmic Short-Circuit Logic",
        difficulty: "O Level Difficulty"
      };
    }
  },

  // 7. Sequential Process Scheduling Logic
  {
    topic: "Sequential Ordering Logic",
    generate: (seed) => {
      const orders = [
        { tasks: "P, Q, R, S, T", c1: "Q finishes before R but after P", c2: "S finishes before P", c3: "T finishes after R", first: "Process S", last: "Process T", order: "S -> P -> Q -> R -> T" },
        { tasks: "A, B, C, D, E", c1: "B executes before C but after A", c2: "D executes before A", c3: "E executes after C", first: "Process D", last: "Process E", order: "D -> A -> B -> C -> E" },
        { tasks: "V, W, X, Y, Z", c1: "W loads before X but after V", c2: "Y loads before V", c3: "Z loads after X", first: "Process Y", last: "Process Z", order: "Y -> V -> W -> X -> Z" }
      ];
      const o = orders[seed % orders.length];
      const askFirst = seed % 2 === 0;
      return {
        questionEn: `Five processes (${o.tasks}) are queued for execution: 1) ${o.c1}. 2) ${o.c2}. 3) ${o.c3}. Which process is executed ${askFirst ? "FIRST" : "LAST"}?`,
        questionHi: `पाँच प्रक्रियाएँ (${o.tasks}) कतार में हैं: 1) ${o.c1}। 2) ${o.c2}। 3) ${o.c3}। कौन सी प्रक्रिया ${askFirst ? "सबसे पहले (FIRST)" : "सबसे अंत में (LAST)"} निष्पादित होगी?`,
        optionsEn: [askFirst ? o.first : o.last, askFirst ? o.last : o.first, "Process P / Process A", "Process Q / Process B"],
        optionsHi: [askFirst ? o.first : o.last, askFirst ? o.last : o.first, "प्रक्रिया P", "प्रक्रिया Q"],
        correctIndex: 0,
        explanationEn: `Synthesizing the positional constraints establishes the unambiguous linear sequence: ${o.order}. Thus, ${askFirst ? o.first : o.last} is correct.`,
        explanationHi: `दिए गए क्रम प्रतिबंधों को संयोजित करने पर स्पष्ट रैखिक क्रम बनता है: ${o.order}। अतः ${askFirst ? o.first : o.last} सही उत्तर है।`,
        topic: "Sequential Ordering Logic",
        difficulty: "O Level Difficulty"
      };
    }
  },

  // 8. Number Series & Polynomial Patterns
  {
    topic: "Number Series & Pattern Deduction",
    generate: (seed) => {
      const seriesList = [
        { seq: "2, 6, 12, 20, 30, 42, ?", ans: "56", rule: "n*(n+1) pattern: 7*8 = 56 (or differences +4, +6, +8, +10, +12, +14)", w: ["54", "60", "64"] },
        { seq: "1, 8, 27, 64, 125, ?", ans: "216", rule: "Cubic progression n^3: 6^3 = 216", w: ["200", "225", "256"] },
        { seq: "3, 5, 9, 17, 33, ?", ans: "65", rule: "Doubling differences: +2, +4, +8, +16, +32 (33 + 32 = 65)", w: ["63", "67", "70"] },
        { seq: "2, 3, 5, 7, 11, 13, 17, ?", ans: "19", rule: "Consecutive prime numbers: next prime after 17 is 19", w: ["21", "23", "27"] },
        { seq: "0, 7, 26, 63, 124, ?", ans: "215", rule: "n^3 - 1 progression: 6^3 - 1 = 216 - 1 = 215", w: ["210", "216", "220"] }
      ];
      const s = seriesList[seed % seriesList.length];
      return {
        questionEn: `Identify the missing value in the algorithmic integer sequence: ${s.seq}`,
        questionHi: `तार्किक एल्गोरिदम पूर्णांक अनुक्रम में लुप्त मान ज्ञात कीजिए: ${s.seq}`,
        optionsEn: [s.ans, s.w[0], s.w[1], s.w[2]],
        optionsHi: [s.ans, s.w[0], s.w[1], s.w[2]],
        correctIndex: 0,
        explanationEn: `Mathematical pattern: ${s.rule}.`,
        explanationHi: `तार्किक गणितीय पैटर्न: ${s.rule}।`,
        topic: "Number Series & Pattern Deduction",
        difficulty: "O Level Difficulty"
      };
    }
  },

  // 9. Truth Table Implication & Conditional Propositions
  {
    topic: "Mathematical Logic & Implications",
    generate: (seed) => {
      const qList = [
        {
          qEn: "In formal propositional logic, for which truth values of antecedent P and consequent Q is the material implication `(P → Q)` evaluated as FALSE?",
          qHi: "प्रपोजीशनल लॉजिक में, पूर्वपद P और अनुवर्ती Q के किन सत्यता मानों के लिए सशर्त व्यंजक `(P → Q)` असत्य (False) होता है?",
          ansEn: "P is True and Q is False (T → F = F)",
          ansHi: "P सत्य (True) और Q असत्य (False) हो (T → F = F)",
          wEn: ["P is False and Q is True", "P is False and Q is False", "P is True and Q is True"],
          wHi: ["P असत्य और Q सत्य हो", "P और Q दोनों असत्य हों", "P और Q दोनों सत्य हों"],
          expEn: "A conditional assertion `P → Q` is violated if and only if the hypothesis P holds true but the outcome Q fails to materialize.",
          expHi: "औपचारिक तर्कशास्त्र में (P → Q) केवल तभी असत्य होता है जब परिकल्पना P सत्य हो परंतु परिणाम Q असत्य हो।"
        },
        {
          qEn: "What is the logical contrapositive (प्रतिपरिवर्तन) of the proposition: 'If a program is syntactically valid (P), then it compiles successfully (Q)'?",
          qHi: "कथन 'यदि कोई प्रोग्राम वाक्य-रचना की दृष्टि से मान्य है (P), तो वह सफलतापूर्वक संकलित होता है (Q)' का तार्किक प्रतिपरिवर्तन (Contrapositive) क्या है?",
          ansEn: "If a program does not compile successfully (¬Q), then it is not syntactically valid (¬P)",
          ansHi: "यदि कोई प्रोग्राम सफलतापूर्वक संकलित नहीं होता (¬Q), तो वह वाक्य-रचना की दृष्टि से मान्य नहीं है (¬P)",
          wEn: [
            "If a program compiles successfully, then it is syntactically valid",
            "If a program is not syntactically valid, then it does not compile",
            "A program compiles if and only if it is syntactically valid"
          ],
          wHi: [
            "यदि प्रोग्राम संकलित होता है, तो वह मान्य है",
            "यदि प्रोग्राम मान्य नहीं है, तो वह संकलित नहीं होता",
            "प्रोग्राम संकलित होता है यदि और केवल यदि वह मान्य हो"
          ],
          expEn: "The contrapositive of `P → Q` is `¬Q → ¬P`, which has identical truth value (logical equivalence) to the original conditional.",
          expHi: "`P → Q` का प्रतिपरिवर्तित रूप `¬Q → ¬P` होता है, जो मूल कथन के पूर्णतः तार्किक समतुल्य होता है।"
        }
      ];
      const item = qList[seed % qList.length];
      return {
        questionEn: item.qEn,
        questionHi: item.qHi,
        optionsEn: [item.ansEn, item.wEn[0], item.wEn[1], item.wEn[2]],
        optionsHi: [item.ansHi, item.wHi[0], item.wHi[1], item.wHi[2]],
        correctIndex: 0,
        explanationEn: item.expEn,
        explanationHi: item.expHi,
        topic: "Mathematical Logic & Implications",
        difficulty: "O Level Difficulty"
      };
    }
  },

  // 10. Time & Space Algorithmic Complexity Deductions
  {
    topic: "Algorithmic Complexity Deductions",
    generate: (seed) => {
      const compList = [
        { algo: "Binary Search on a sorted array of N elements", time: "O(log N)", space: "O(1) auxiliary", wrongT: "O(N)", wrongS: "O(N)" },
        { algo: "Merge Sort on an arbitrary array of N elements", time: "O(N log N)", space: "O(N) auxiliary", wrongT: "O(N²)", wrongS: "O(1)" },
        { algo: "Look-up in a balanced Hash Table (average case)", time: "O(1)", space: "O(N) total", wrongT: "O(log N)", wrongS: "O(N²)" },
        { algo: "Depth-First Search (DFS) on a graph with V vertices and E edges", time: "O(V + E)", space: "O(V) recursion stack", wrongT: "O(V * E)", wrongS: "O(1)" }
      ];
      const c = compList[seed % compList.length];
      return {
        questionEn: `What is the worst-case asymptotic time complexity and auxiliary space complexity of ${c.algo}?`,
        questionHi: `${c.algo} की सबसे खराब स्थिति (Worst-Case) में समय जटिलता और सहायक स्थान जटिलता क्या है?`,
        optionsEn: [
          `Time: ${c.time}, Auxiliary Space: ${c.space}`,
          `Time: ${c.wrongT}, Auxiliary Space: ${c.space}`,
          `Time: ${c.time}, Auxiliary Space: ${c.wrongS}`,
          `Time: ${c.wrongT}, Auxiliary Space: ${c.wrongS}`
        ],
        optionsHi: [
          `समय: ${c.time}, सहायक स्थान: ${c.space}`,
          `समय: ${c.wrongT}, सहायक स्थान: ${c.space}`,
          `समय: ${c.time}, सहायक स्थान: ${c.wrongS}`,
          `समय: ${c.wrongT}, सहायक स्थान: ${c.wrongS}`
        ],
        correctIndex: 0,
        explanationEn: `Standard algorithm analysis: ${c.algo} operates in ${c.time} asymptotic time with ${c.space} memory bounds.`,
        explanationHi: `मानक एल्गोरिदम विश्लेषण के अनुसार, ${c.algo} ${c.time} समय और ${c.space} मेमोरी में निष्पादित होता है।`,
        topic: "Algorithmic Complexity Deductions",
        difficulty: "O Level Difficulty"
      };
    }
  }
];

// Shuffle array with Fisher-Yates and random seed
function shuffleArray<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let currentSeed = seed;
  for (let i = result.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = Math.floor((currentSeed / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate variable questions with dynamic shuffling & varying correct answer keys
export function getResilientReasoningQuestions(count: number): FallbackQuestion[] {
  const total = Math.max(1, count);
  const result: FallbackQuestion[] = [];
  const baseRandomSeed = Math.floor(Math.random() * 1000000) + Date.now();

  // Create pool of varied questions
  for (let i = 0; i < total; i++) {
    const templateIndex = (i + Math.floor(Math.random() * TEMPLATES.length)) % TEMPLATES.length;
    const template = TEMPLATES[templateIndex];
    const itemSeed = baseRandomSeed + i * 37 + Math.floor(Math.random() * 999);
    
    const rawQ = template.generate(itemSeed);

    // Shuffle options so correct answer is randomly distributed among A, B, C, D (indices 0, 1, 2, 3)
    const optionsWithIndices = rawQ.optionsEn.map((optEn, idx) => ({
      optEn,
      optHi: rawQ.optionsHi[idx] || optEn,
      isCorrect: idx === rawQ.correctIndex
    }));

    const shuffled = shuffleArray(optionsWithIndices, itemSeed + 13);
    const newCorrectIndex = shuffled.findIndex(item => item.isCorrect);

    result.push({
      questionEn: rawQ.questionEn,
      questionHi: rawQ.questionHi,
      optionsEn: shuffled.map(s => s.optEn),
      optionsHi: shuffled.map(s => s.optHi),
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
      explanationEn: rawQ.explanationEn,
      explanationHi: rawQ.explanationHi,
      topic: rawQ.topic,
      difficulty: rawQ.difficulty
    });
  }

  return result;
}
