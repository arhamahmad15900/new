import { Question } from '../types';

export const QUESTIONS_M3: Question[] = [
  // ==========================================
  // CHAPTER 1: INTRODUCTION TO PROGRAMMING
  // ==========================================
  {
    id: 'M3-C1-01',
    moduleId: 'M3',
    chapterNumber: 1,
    chapterName: 'Introduction to Programming',
    questionEn: 'Which software translates high-level Python source code into platform-independent intermediate Bytecode (`.pyc`)?',
    questionHi: 'कौन सा सॉफ्टवेयर उच्च-स्तरीय पायथन स्रोत कोड को प्लेटफ़ॉर्म-स्वतंत्र मध्यवर्ती बाइटकोड (`.pyc`) में अनुवादित करता है?',
    optionsEn: ['CPython Compiler', 'PVM (Python Virtual Machine)', 'Assembler', 'Linker'],
    optionsHi: ['सीपीयू/पायथन कंपाइलर (CPython Compiler)', 'PVM (पायथन वर्चुअल मशीन)', 'असेम्बलर', 'लिंकर'],
    correctIndex: 0,
    explanationEn: 'The CPython interpreter first compiles `.py` source code into intermediate bytecode (`.pyc`), which is then executed by the Python Virtual Machine (PVM).',
    explanationHi: 'पायथन कंपाइलर स्रोत कोड को बाइटकोड में बदलता है, जिसे बाद में PVM द्वारा निष्पादित किया जाता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'medium'
  },
  {
    id: 'M3-C1-02',
    moduleId: 'M3',
    chapterNumber: 1,
    chapterName: 'Introduction to Programming',
    questionEn: 'What type of programming error causes a running program to terminate abruptly (e.g. `ZeroDivisionError`)?',
    questionHi: 'किस प्रकार की त्रुटि के कारण चल रहा प्रोग्राम अचानक क्रैश या समाप्त हो जाता है (जैसे `ZeroDivisionError`)?',
    optionsEn: ['Runtime Error (Exception)', 'Syntax Error', 'Compile Error', 'Semantic Warning'],
    optionsHi: ['रनटाइम त्रुटि (Runtime Error / Exception)', 'सिंटैक्स त्रुटि', 'कंपाइल त्रुटि', 'सिमेंटिक चेतावनी'],
    correctIndex: 0,
    explanationEn: 'Runtime errors (exceptions) occur while the program is actively executing, such as dividing by zero or accessing invalid array indices.',
    explanationHi: 'रनटाइम एरर (जैसे शून्य से भाग देना) प्रोग्राम निष्पादित होते समय उत्पन्न होती है और निष्पादन रोक देती है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Python Fundamentals',
    year: '2024',
    difficulty: 'easy'
  },

  // ==========================================
  // CHAPTER 2: ALGORITHMS AND FLOWCHARTS
  // ==========================================
  {
    id: 'M3-C2-01',
    moduleId: 'M3',
    chapterNumber: 2,
    chapterName: 'Algorithms and Flowcharts to Solve Problems',
    questionEn: 'Which standard geometric shape is used in flowcharts to represent a Decision or Conditional test (e.g. `Is X > 0?`)?',
    questionHi: 'फ्लोचार्ट में निर्णय (Decision) या सशर्त परीक्षण (जैसे `क्या X > 0 है?`) का प्रतिनिधित्व करने के लिए किस मानक ज्यामितीय आकृति का उपयोग किया जाता है?',
    optionsEn: ['Rhombus (Diamond)', 'Rectangle', 'Parallelogram', 'Oval'],
    optionsHi: ['रोम्बस / डायमंड (Diamond)', 'आयत (Rectangle)', 'समानांतर चतुर्भुज (Parallelogram)', 'अंडाकार (Oval)'],
    correctIndex: 0,
    explanationEn: 'A Diamond/Rhombus symbol represents a branching decision or condition with multiple outgoing paths (Yes/No or True/False).',
    explanationHi: 'फ्लोचार्ट में डायमंड प्रतीक का उपयोग निर्णय लेने या स्थिति की जांच (If-Else) करने के लिए किया जाता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M3-C2-02',
    moduleId: 'M3',
    chapterNumber: 2,
    chapterName: 'Algorithms and Flowcharts to Solve Problems',
    questionEn: 'Which flowchart symbol represents Input or Output operations (e.g. `Read A`, `Print Sum`)?',
    questionHi: 'कौन सा फ्लोचार्ट प्रतीक इनपुट या आउटपुट संचालन (जैसे `Read A`, `Print Sum`) का प्रतिनिधित्व करता है?',
    optionsEn: ['Parallelogram', 'Rectangle', 'Circle', 'Diamond'],
    optionsHi: ['समानांतर चतुर्भुज (Parallelogram)', 'आयत (Rectangle)', 'वृत्त (Circle)', 'डायमंड (Diamond)'],
    correctIndex: 0,
    explanationEn: 'A Parallelogram is the standard ISO flowchart symbol for Input/Output operations.',
    explanationHi: 'समानांतर चतुर्भुज (Parallelogram) का उपयोग डेटा इनपुट लेने और आउटपुट प्रदर्शित करने के लिए किया जाता है।',
    source: 'nielit_model',
    sourceLabel: 'NIELIT Official Model Paper',
    year: '2024',
    difficulty: 'easy'
  },

  // ==========================================
  // CHAPTER 3: INTRODUCTION TO PYTHON
  // ==========================================
  {
    id: 'M3-C3-01',
    moduleId: 'M3',
    chapterNumber: 3,
    chapterName: 'Introduction to Python',
    questionEn: 'Which of the following is an INVALID identifier name in Python?',
    questionHi: 'पायथन में निम्नलिखित में से कौन सा एक अमान्य (Invalid) पहचानकर्ता (Identifier) नाम है?',
    optionsEn: ['2nd_score', '_totalSum', 'student_name', 'Value_2'],
    optionsHi: ['2nd_score', '_totalSum', 'student_name', 'Value_2'],
    correctIndex: 0,
    explanationEn: 'Python identifiers CANNOT begin with a digit (0-9). `2nd_score` starts with `2`, making it a syntax error.',
    explanationHi: 'पायथन में वेरिएबल या आइडेंटिफ़ायर का नाम किसी अंक (0-9) से शुरू नहीं हो सकता।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M3-C3-02',
    moduleId: 'M3',
    chapterNumber: 3,
    chapterName: 'Introduction to Python',
    questionEn: 'What does the built-in `input()` function always return in Python 3?',
    questionHi: 'पायथन 3 में बिल्ट-इन `input()` फ़ंक्शन हमेशा किस प्रकार का मान लौटाता है?',
    optionsEn: ['str (String)', 'int (Integer)', 'float (Float)', 'list (List)'],
    optionsHi: ['str (स्ट्रिंग)', 'int (पूर्णांक)', 'float (फ़्लोट)', 'list (लिस्ट)'],
    correctIndex: 0,
    explanationEn: 'In Python 3, `input()` always reads user input from standard input as a string (`str`). Explicit casting like `int(input())` is needed for numbers.',
    explanationHi: '`input()` फ़ंक्शन उपयोगकर्ता द्वारा दर्ज किए गए किसी भी इनपुट को हमेशा स्ट्रिंग (`str`) के रूप में प्राप्त करता है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'easy'
  },
  {
    id: 'M3-C3-03',
    moduleId: 'M3',
    chapterNumber: 3,
    chapterName: 'Introduction to Python',
    questionEn: 'Which of the following Python keywords begins with a Capital letter?',
    questionHi: 'निम्नलिखित में से कौन सा पायथन कीवर्ड कैपिटल लेटर (बड़े अक्षर) से शुरू होता है?',
    optionsEn: ['True', 'false', 'none', 'def'],
    optionsHi: ['True', 'false', 'none', 'def'],
    correctIndex: 0,
    explanationEn: 'In Python, exactly three built-in keywords are capitalized: `True`, `False`, and `None`.',
    explanationHi: 'पायथन में केवल तीन कीवर्ड कैपिटल लेटर से शुरू होते हैं: `True`, `False`, और `None`।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Python Syntax Series',
    year: '2024',
    difficulty: 'easy'
  },

  // ==========================================
  // CHAPTER 4: OPERATORS, EXPRESSIONS & STATEMENTS
  // ==========================================
  {
    id: 'M3-C4-01',
    moduleId: 'M3',
    chapterNumber: 4,
    chapterName: 'Operators, Expressions & Python Statements',
    questionEn: 'What is the output of the Python expression `2 ** 3 ** 2`?',
    questionHi: 'पायथन एक्सप्रेशन `2 ** 3 ** 2` का आउटपुट क्या होगा?',
    optionsEn: ['512', '64', '36', '12'],
    optionsHi: ['512', '64', '36', '12'],
    correctIndex: 0,
    explanationEn: 'The exponentiation operator `**` has right-to-left associativity: `3 ** 2 = 9`, and then `2 ** 9 = 512`.',
    explanationHi: 'एक्सपोनेंट ऑपरेटर `**` दाएं से बाएं हल होता है: पहले `3**2 = 9` होगा, फिर `2**9 = 512` आएगा।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'medium'
  },
  {
    id: 'M3-C4-02',
    moduleId: 'M3',
    chapterNumber: 4,
    chapterName: 'Operators, Expressions & Python Statements',
    questionEn: 'What is the value of the bitwise NOT operation `~5` in Python?',
    questionHi: 'पायथन में बिटवाइज़ नॉट (Bitwise NOT) ऑपरेशन `~5` का मान क्या होगा?',
    optionsEn: ['-6', '-5', '5', '6'],
    optionsHi: ['-6', '-5', '5', '6'],
    correctIndex: 0,
    explanationEn: 'Bitwise NOT inverts bits using 2\'s complement arithmetic: `~x = -(x + 1)`. Therefore, `~5 = -(5 + 1) = -6`.',
    explanationHi: 'बिटवाइज़ NOT का सूत्र `~x = -(x + 1)` होता है। इसलिए `~5 = -(5 + 1) = -6` प्राप्त होता है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'medium'
  },
  {
    id: 'M3-C4-03',
    moduleId: 'M3',
    chapterNumber: 4,
    chapterName: 'Operators, Expressions & Python Statements',
    questionEn: 'What is the output of `print(5 // 2, 5 / 2)` in Python 3?',
    questionHi: 'पायथन 3 में `print(5 // 2, 5 / 2)` का आउटपुट क्या होगा?',
    optionsEn: ['2 2.5', '2.5 2.5', '2 2', '2.5 2'],
    optionsHi: ['2 2.5', '2.5 2.5', '2 2', '2.5 2'],
    correctIndex: 0,
    explanationEn: '`//` is floor division returning the largest integer <= quotient (`5 // 2 = 2`). `/` is true float division (`5 / 2 = 2.5`).',
    explanationHi: '`//` फ्लोर डिवीजन है जो पूर्णांक (2) देता है, जबकि `/` फ्लोटिंग-पॉइंट डिवीजन है जो 2.5 देता है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Operators Mastery',
    year: '2024',
    difficulty: 'easy'
  },

  // ==========================================
  // CHAPTER 5: SEQUENCE DATA TYPES
  // ==========================================
  {
    id: 'M3-C5-01',
    moduleId: 'M3',
    chapterNumber: 5,
    chapterName: 'Sequence Data Types',
    questionEn: 'Which of the following data types in Python is IMMUTABLE (cannot be modified in-place)?',
    questionHi: 'पायथन में निम्नलिखित में से कौन सा डेटा प्रकार अपरिवर्तनीय (Immutable) है?',
    optionsEn: ['Tuple', 'List', 'Dictionary', 'Set'],
    optionsHi: ['टुपल (Tuple)', 'लिस्ट (List)', 'डिक्शनरी (Dictionary)', 'सेट (Set)'],
    correctIndex: 0,
    explanationEn: 'Tuples, strings, and integers are immutable in Python; their elements or characters cannot be assigned or changed in-place after creation.',
    explanationHi: 'टुपल (Tuple) और स्ट्रिंग (String) अपरिवर्तनीय (Immutable) होते हैं, इन्हें बनने के बाद बदला नहीं जा सकता।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M3-C5-02',
    moduleId: 'M3',
    chapterNumber: 5,
    chapterName: 'Sequence Data Types',
    questionEn: 'What will be the output of "Hello World"[::-1] in Python?',
    questionHi: 'पायथन में "Hello World"[::-1] का आउटपुट क्या होगा?',
    optionsEn: ['dlroW olleH', 'Hello World', 'H', 'World'],
    optionsHi: ['dlroW olleH', 'Hello World', 'H', 'World'],
    correctIndex: 0,
    explanationEn: 'Extended slicing with step `-1` reverses the string completely.',
    explanationHi: 'स्लाइसिंग में `step = -1` देने पर पूरी स्ट्रिंग उल्टी (Reverse) हो जाती है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'easy'
  },
  {
    id: 'M3-C5-03',
    moduleId: 'M3',
    chapterNumber: 5,
    chapterName: 'Sequence Data Types',
    questionEn: 'How do you create an empty Set in Python?',
    questionHi: 'पायथन में एक खाली सेट (Empty Set) कैसे बनाया जाता है?',
    optionsEn: ['set()', '{}', '[]', '()'],
    optionsHi: ['set()', '{}', '[]', '()'],
    correctIndex: 0,
    explanationEn: '`set()` creates an empty set. `{}` creates an empty dictionary (`dict`), not a set.',
    explanationHi: 'खाली सेट बनाने के लिए `set()` का उपयोग किया जाता है। `{}` खाली डिक्शनरी बनाता है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Python Collections Practice',
    year: '2024',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 6: FUNCTIONS AND RECURSION
  // ==========================================
  {
    id: 'M3-C6-01',
    moduleId: 'M3',
    chapterNumber: 6,
    chapterName: 'Functions and Recursion',
    questionEn: 'Which keyword is used to define an anonymous, single-line inline function in Python?',
    questionHi: 'पायथन में एक अनाम (Anonymous), एकल-पंक्ति इनलाइन फ़ंक्शन को परिभाषित करने के लिए किस कीवर्ड का उपयोग किया जाता है?',
    optionsEn: ['lambda', 'def', 'anon', 'inline'],
    optionsHi: ['lambda', 'def', 'anon', 'inline'],
    correctIndex: 0,
    explanationEn: 'The `lambda` keyword defines anonymous, small, single-expression functions (e.g. `lambda x, y: x + y`).',
    explanationHi: '`lambda` कीवर्ड का उपयोग एक पंक्ति के अनाम फ़ंक्शन (Anonymous Function) बनाने के लिए किया जाता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M3-C6-02',
    moduleId: 'M3',
    chapterNumber: 6,
    chapterName: 'Functions and Recursion',
    questionEn: 'In Python, what is the default return value of a function that does not contain an explicit `return` statement?',
    questionHi: 'पायथन में, ऐसे फ़ंक्शन का डिफ़ॉल्ट रिटर्न मान क्या होता है जिसमें कोई स्पष्ट `return` स्टेटमेंट नहीं होता?',
    optionsEn: ['None', '0', 'False', 'undefined'],
    optionsHi: ['None', '0', 'False', 'undefined'],
    correctIndex: 0,
    explanationEn: 'If a Python function terminates without executing a `return` statement, it automatically returns `None`.',
    explanationHi: 'यदि फ़ंक्शन में कोई रिटर्न स्टेटमेंट नहीं है, तो वह डिफ़ॉल्ट रूप से `None` लौटाता है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Functions & Scope Series',
    year: '2024',
    difficulty: 'easy'
  },

  // ==========================================
  // CHAPTER 7: FILE PROCESSING
  // ==========================================
  {
    id: 'M3-C7-01',
    moduleId: 'M3',
    chapterNumber: 7,
    chapterName: 'File Processing',
    questionEn: 'Which file opening mode opens a file for writing and appends new content to the end without deleting existing data?',
    questionHi: 'कौन सा फ़ाइल ओपनिंग मोड लिखने के लिए फ़ाइल खोलता है और मौजूदा डेटा को हटाए बिना अंत में नई सामग्री जोड़ता है?',
    optionsEn: ["'a'", "'w'", "'r+'", "'w+'"],
    optionsHi: ["'a'", "'w'", "'r+'", "'w+'"],
    correctIndex: 0,
    explanationEn: "`'a'` (append mode) positions the file pointer at the end of the file, preserving existing content.",
    explanationHi: "`'a'` (Append Mode) फ़ाइल के अंत में डेटा जोड़ने के लिए उपयोग किया जाता है और पुराना डेटा सुरक्षित रहता है।",
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M3-C7-02',
    moduleId: 'M3',
    chapterNumber: 7,
    chapterName: 'File Processing',
    questionEn: 'Which file object method returns the current byte position of the file pointer in Python?',
    questionHi: 'पायथन में कौन सा फ़ाइल ऑब्जेक्ट मेथड फ़ाइल पॉइंटर की वर्तमान बाइट स्थिति (Position) लौटाता है?',
    optionsEn: ['tell()', 'seek()', 'position()', 'getloc()'],
    optionsHi: ['tell()', 'seek()', 'position()', 'getloc()'],
    correctIndex: 0,
    explanationEn: '`file.tell()` returns an integer representing the current position of the file read/write pointer in bytes from the start.',
    explanationHi: '`tell()` मेथड बताता है कि फ़ाइल में पॉइंटर इस समय किस बाइट पोजीशन पर मौजूद है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 8: SCOPE AND MODULES
  // ==========================================
  {
    id: 'M3-C8-01',
    moduleId: 'M3',
    chapterNumber: 8,
    chapterName: 'Scope and Modules',
    questionEn: 'What is the order of variable scope resolution defined by the LEGB rule in Python?',
    questionHi: 'पायथन में LEGB नियम द्वारा परिभाषित वेरिएबल स्कोप रिज़ॉल्यूशन का सही क्रम क्या है?',
    optionsEn: [
      'Local -> Enclosing -> Global -> Built-in',
      'Local -> Global -> Enclosing -> Built-in',
      'Global -> Local -> Enclosing -> Built-in',
      'Built-in -> Global -> Enclosing -> Local'
    ],
    optionsHi: [
      'Local -> Enclosing -> Global -> Built-in (LEGB)',
      'Local -> Global -> Enclosing -> Built-in',
      'Global -> Local -> Enclosing -> Built-in',
      'Built-in -> Global -> Enclosing -> Local'
    ],
    correctIndex: 0,
    explanationEn: 'Python resolves variable names in this priority order: Local (L), Enclosing functions (E), Global module scope (G), and Built-in namespace (B).',
    explanationHi: 'पायथन स्कोप का क्रम LEGB होता है: Local -> Enclosing -> Global -> Built-in।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'medium'
  },
  {
    id: 'M3-C8-02',
    moduleId: 'M3',
    chapterNumber: 8,
    chapterName: 'Scope and Modules',
    questionEn: 'What value does the special built-in variable `__name__` hold when a Python script is executed directly?',
    questionHi: 'जब किसी पायथन स्क्रिप्ट को सीधे मुख्य प्रोग्राम के रूप में चलाया जाता है, तो विशेष वेरिएबल `__name__` का मान क्या होता है?',
    optionsEn: ["'__main__'", "'main'", "'__module__'", "'root'"],
    optionsHi: ["'__main__'", "'main'", "'__module__'", "'root'"],
    correctIndex: 0,
    explanationEn: 'When a `.py` file is executed directly as the top-level script, Python assigns the string `"__main__"` to `__name__`.',
    explanationHi: 'सीधे निष्पादित होने पर पायथन `__name__` वेरिएबल में `"__main__"` मान सेट करता है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Python Modules Mastery',
    year: '2024',
    difficulty: 'easy'
  },

  // ==========================================
  // CHAPTER 9: NUMPY BASICS
  // ==========================================
  {
    id: 'M3-C9-01',
    moduleId: 'M3',
    chapterNumber: 9,
    chapterName: 'NumPy Basics',
    questionEn: 'Which NumPy function generates an array of 5 evenly spaced float numbers between 0 and 1 inclusive?',
    questionHi: 'कौन सा NumPy फ़ंक्शन 0 और 1 के बीच समान रूप से दूरी वाले 5 संख्याओं की एक एरे बनाता है?',
    optionsEn: ['np.linspace(0, 1, 5)', 'np.arange(0, 1, 5)', 'np.range(0, 1, 5)', 'np.zeros(5)'],
    optionsHi: ['np.linspace(0, 1, 5)', 'np.arange(0, 1, 5)', 'np.range(0, 1, 5)', 'np.zeros(5)'],
    correctIndex: 0,
    explanationEn: '`np.linspace(start, stop, num)` generates `num` evenly spaced floating-point samples over the interval `[start, stop]`.',
    explanationHi: '`np.linspace(0, 1, 5)` दी गई रेंज में समान अंतराल पर 5 मान (0.0, 0.25, 0.5, 0.75, 1.0) उत्पन्न करता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'medium'
  },
  {
    id: 'M3-C9-02',
    moduleId: 'M3',
    chapterNumber: 9,
    chapterName: 'NumPy Basics',
    questionEn: 'Which attribute of a NumPy ndarray returns the total number of elements in the array?',
    questionHi: 'NumPy ndarray का कौन सा विशेषता (Attribute) एरे में तत्वों की कुल संख्या लौटाता है?',
    optionsEn: ['arr.size', 'arr.shape', 'arr.ndim', 'arr.length'],
    optionsHi: ['arr.size', 'arr.shape', 'arr.ndim', 'arr.length'],
    correctIndex: 0,
    explanationEn: '`arr.size` returns the total count of elements, whereas `arr.shape` returns a tuple of dimensions (rows, cols).',
    explanationHi: '`arr.size` एरे में कुल तत्वों की संख्या देता है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'easy'
  }
];
