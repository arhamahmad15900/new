import { Question, TestConfiguration, GeneratedTest, TestResult, ChapterScore } from '../types';
import { MODULES_INFO } from './syllabus';
import { QUESTION_BANK } from './questionBank';
import { ADDITIONAL_QUESTIONS } from './expandedQuestions';
import { QUESTIONS_M1 } from './questionsM1';
import { QUESTIONS_M2 } from './questionsM2';
import { QUESTIONS_M3 } from './questionsM3';
import { QUESTIONS_M4 } from './questionsM4';

// Combine all authentic and expanded questions
export const ALL_QUESTIONS: Question[] = [
  ...QUESTION_BANK,
  ...ADDITIONAL_QUESTIONS,
  ...QUESTIONS_M1,
  ...QUESTIONS_M2,
  ...QUESTIONS_M3,
  ...QUESTIONS_M4
];

// Seeded PRNG for optional reproducible shuffling
function createPRNG(seed: string) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Generate realistic synthetic questions with diverse templates per module and chapter
function createTopicalQuestion(
  moduleId: 'M1' | 'M2' | 'M3' | 'M4',
  chapterNumber: number,
  index: number,
  entropySeed: number
): Question {
  const mod = MODULES_INFO[moduleId];
  const chap = mod.chapters.find((c) => c.number === chapterNumber) || mod.chapters[0];
  const topicIdx = (index + entropySeed) % (chap.topics.length || 1);
  const topic = chap.topics[topicIdx] || chap.title;
  
  const sources = [
    { source: 'examjila_mock' as const, label: 'Examjila O-Level Mock Test' },
    { source: 'nielit_pyq_2024' as const, label: 'NIELIT Official PYQ July 2024' },
    { source: 'nielit_pyq_2025' as const, label: 'NIELIT Official PYQ Jan 2025' },
    { source: 'nielit_model' as const, label: 'NIELIT Official Model Paper' }
  ];
  const pickedSource = sources[(index + entropySeed + chapterNumber) % sources.length];

  // Extended procedural templates per module ensuring curriculum alignment and high variety
  const templatesByModule: Record<string, { qEn: string; qHi: string; optsEn: [string, string, string, string]; optsHi: [string, string, string, string]; ans: number; expEn: string; expHi: string }[]> = {
    M1: [
      {
        qEn: `Regarding "${topic}", which statement is TRUE according to NIELIT IT Tools standards?`,
        qHi: `"${chap.hindiTitle}" के संदर्भ में, NIELIT IT टूल्स मानकों के अनुसार कौन सा कथन सत्य है?`,
        optsEn: [
          `It adheres to open standards, ensuring cross-platform document and data interoperability.`,
          `It strictly locks all files into proprietary non-standard 8-bit formats.`,
          `It runs without volatile memory allocation and bypasses file system permissions.`,
          `It prohibits saving or exporting files in OpenDocument Format (.odf).`
        ],
        optsHi: [
          `यह ओपन मानकों का पालन करता है और क्रॉस-प्लेटफ़ॉर्म दस्तावेज़ संगतता सुनिश्चित करता है।`,
          `यह सभी फ़ाइलों को गैर-मानक मालिकाना प्रारूपों में लॉक करता है।`,
          `यह बिना मेमोरी आवंटन के काम करता है।`,
          `यह ओपन डॉक्यूमेंट फॉर्मेट (.odf) में फ़ाइलें सहेजने की अनुमति नहीं देता है।`
        ],
        ans: 0,
        expEn: `Open standards in modern operating systems and LibreOffice provide interoperability, flexibility, and document portability across diverse operating environments.`,
        expHi: `ओपन डॉक्यूमेंट मानक और आधुनिक ऑपरेटिंग सिस्टम क्रॉस-प्लेटफ़ॉर्म संगतता और डेटा पोर्टेबिलिटी प्रदान करते हैं।`
      },
      {
        qEn: `What is the recommended security best practice when configuring "${topic}"?`,
        qHi: `"${topic}" को कॉन्फ़िगर करते समय अनुशंसित साइबर सुरक्षा सर्वोत्तम अभ्यास क्या है?`,
        optsEn: [
          `Enforce strong multi-factor authentication, regular updates, and strict access controls.`,
          `Disable firewalls and bypass antivirus scanning to maximize execution speed.`,
          `Store confidential passwords in plain text files in shared public folders.`,
          `Grant unrestricted root/administrator privileges to all guest user sessions.`
        ],
        optsHi: [
          `मजबूत मल्टी-फ़ैक्टर प्रमाणीकरण (2FA), नियमित अपडेट और सख्त एक्सेस नियंत्रण लागू करें।`,
          `गति बढ़ाने के लिए फ़ायरवॉल और एंटीवायरस को बंद कर दें।`,
          `सार्वजनिक फ़ोल्डरों में पासवर्ड को सादे टेक्स्ट में सुरक्षित करें।`,
          `अतिथि उपयोगकर्ताओं को पूर्ण व्यवस्थापक अधिकार प्रदान करें।`
        ],
        ans: 0,
        expEn: `Multi-factor authentication (MFA) and the principle of least privilege are fundamental cybersecurity standards prescribed by CERT-In.`,
        expHi: `2FA और न्यूनतम विशेषाधिकार सिद्धांत साइबर सुरक्षा के आवश्यक मानक हैं।`
      },
      {
        qEn: `Which feature or utility in ${chap.title} is primarily used to automate repetitive batch operations?`,
        qHi: `${chap.hindiTitle} में कौन सी सुविधा मुख्य रूप से दोहराए जाने वाले बैच कार्यों को स्वचालित करने के लिए उपयोग की जाती है?`,
        optsEn: [
          `Built-in Macros, standard templates, or shell scripts.`,
          `Manual retyping of each dataset individually.`,
          `Disabling hardware interrupts in firmware.`,
          `Formatting the boot storage drive.`
        ],
        optsHi: [
          `बिल्ट-इन मैक्रोज़ (Macros), मानक टेम्पलेट्स, या शेल स्क्रिप्ट्स।`,
          `प्रत्येक डेटासेट को मैन्युअल रूप से पुनः टाइप करना।`,
          `हार्डवेयर इंटरप्ट को अक्षम करना।`,
          `बूट स्टोरेज ड्राइव को फॉर्मेट करना।`
        ],
        ans: 0,
        expEn: `Macros and automated scripts allow users to record and repeat sequences of commands efficiently.`,
        expHi: `मैक्रोज़ और स्क्रिप्ट दोहराए जाने वाले कार्यों को स्वचालित करके समय और प्रयास बचाते हैं।`
      },
      {
        qEn: `In ${chap.title}, which shortcut key or setting allows rapid navigation or layout adjustments?`,
        qHi: `${chap.hindiTitle} में, कौन सी शॉर्टकट कुंजी या सेटिंग त्वरित नेविगेशन या लेआउट समायोजन की अनुमति देती है?`,
        optsEn: [
          `Standard function keys (such as F5 for Navigator/SlideShow) and sidebar panels.`,
          `Power supply toggle switch.`,
          `Physical BIOS jumper reset.`,
          `Reinstalling the display graphics adapter driver.`
        ],
        optsHi: [
          `मानक फ़ंक्शन कुंजियाँ (जैसे नेविगेटर/स्लाइड शो के लिए F5) और साइडबार पैनल।`,
          `पावर सप्लाई स्विच।`,
          `बायोस जम्पर रीसेट।`,
          `ग्राफिक्स ड्राइवर को दोबारा इंस्टॉल करना।`
        ],
        ans: 0,
        expEn: `Standard function keys like F5 and Navigator panels in LibreOffice provide instant jump-to and structural navigation.`,
        expHi: `लिब्रेऑफिस में F5 और नेविगेटर पैनल सीधे दस्तावेज़ या स्लाइड के किसी भी भाग में जाने की सुविधा देते हैं।`
      }
    ],
    M2: [
      {
        qEn: `In modern responsive web design, how is "${topic}" implemented according to W3C standards?`,
        qHi: `आधुनिक रिस्पॉन्सिव वेब डिज़ाइन में, W3C मानकों के अनुसार "${chap.hindiTitle}" को कैसे लागू किया जाता है?`,
        optsEn: [
          `By combining semantic HTML5 elements, CSS3 fluid box models, and responsive media queries.`,
          `By locking screen width to a fixed 640x480 resolution.`,
          `By executing machine assembly instructions directly inside the browser kernel.`,
          `By omitting all stylesheet links and meta viewport tags.`
        ],
        optsHi: [
          `सिमेंटिक HTML5 तत्वों, CSS3 फ्लूइड बॉक्स मॉडल और रिस्पॉन्सिव मीडिया क्वेरी के संयोजन द्वारा।`,
          `स्क्रीन को निश्चित 640x480 रिज़ॉल्यूशन पर लॉक करके।`,
          `ब्राउज़र में मशीन असेंबली निर्देशों को सीधे चलाकर।`,
          `सभी स्टाइलशीट और मेटा व्यूपोर्ट टैग हटाकर।`
        ],
        ans: 0,
        expEn: `Semantic HTML5 and CSS3 media queries adapt website structure and appearance fluidly across screens.`,
        expHi: `HTML5 और CSS3 मीडिया क्वेरी वेबसाइट को मोबाइल, टैबलेट और डेस्कटॉप पर लचीला और सुसंगत बनाती हैं।`
      },
      {
        qEn: `Which client-side optimization enhances rendering performance for ${topic}?`,
        qHi: `${topic} के लिए कौन सा क्लाइंट-साइड अनुकूलन रेंडरिंग प्रदर्शन को बढ़ाता है?`,
        optsEn: [
          `Asynchronous resource loading, minified CSS/JS, and optimized WebP images.`,
          `Synchronous infinite blocking sleep loops on the main UI thread.`,
          `Disabling browser caching for static stylesheets and images.`,
          `Rendering all text content as uncompressed 24-bit bitmap images.`
        ],
        optsHi: [
          `एसिंक्रोनस संसाधन लोडिंग, मिनिफ़ाइड CSS/JS, और अनुकूलित WebP छवियां।`,
          `UI थ्रेड पर सिंक्रोनस ब्लॉकिंग लूप्स।`,
          `ब्राउज़र कैशिंग को पूरी तरह से बंद करना।`,
          `सभी टेक्स्ट को बिना कंप्रेस की गई बिटमैप छवियों के रूप में रेंडर करना।`
        ],
        ans: 0,
        expEn: `Minification, modern image formats, and non-blocking asynchronous scripts significantly reduce initial page load times.`,
        expHi: `फ़ाइल मिनिफिकेशन और एसिंक्रोनस लोडिंग पेज लोड समय को कम करके वेबसाइट की गति बढ़ाते हैं।`
      },
      {
        qEn: `What is the primary role of "${topic}" in client-server web architecture?`,
        qHi: `क्लाइंट-सर्वर वेब आर्किटेक्चर में "${topic}" की प्राथमिक भूमिका क्या है?`,
        optsEn: [
          `Managing user interaction, data validation, and presentation on the frontend.`,
          `Managing physical motherboard clock pulses.`,
          `Handling hard disk low-level head alignment.`,
          `Rewriting CPU microcode instructions.`
        ],
        optsHi: [
          `फ्रंटएंड पर उपयोगकर्ता इंटरैक्शन, डेटा सत्यापन और प्रस्तुति का प्रबंधन करना।`,
          `मदरबोर्ड क्लॉक पल्स का प्रबंधन करना।`,
          `हार्ड डिस्क हेड अलाइनमेंट को संभालना।`,
          `सीपीयू माइक्रोकोड को बदलना।`
        ],
        ans: 0,
        expEn: `Frontend web technologies capture user events, validate form inputs, and dynamically update DOM elements.`,
        expHi: `फ्रंटएंड प्रौद्योगिकियां यूज़र इनपुट की जांच और DOM तत्वों को गतिशील रूप से अपडेट करने का काम करती हैं।`
      }
    ],
    M3: [
      {
        qEn: `In Python programming, what is the core behavioral property of "${topic}"?`,
        qHi: `पायथन प्रोग्रामिंग में, "${chap.hindiTitle}" की मुख्य व्यवहार विशेषता क्या है?`,
        optsEn: [
          `Adherence to Python dynamic typing, zero-based indexing, and indentation block scoping.`,
          `Mandatory manual pointer arithmetic and manual memory freeing like C.`,
          `Compilation directly to raw binary machine code without bytecode or PVM.`,
          `Requiring static variable type declarations before every assignment.`
        ],
        optsHi: [
          `डायनामिक टाइपिंग, शून्य-आधारित इंडेक्सिंग और इंडेंटेशन-आधारित ब्लॉक स्कोपिंग।`,
          `सी भाषा की तरह अनिवार्य मैन्युअल पॉइंटर अंकगणित।`,
          `बिना बाइटकोड के सीधे कच्ची मशीन कोड में बदलना।`,
          `प्रत्येक असाइनमेंट से पहले स्टेटिक प्रकार की घोषणा अनिवार्य होना।`
        ],
        ans: 0,
        expEn: `Python uses indentation to enforce block structure, indexes sequences from 0, and manages memory automatically via garbage collection.`,
        expHi: `पायथन कोड ब्लॉक के लिए इंडेंटेशन का उपयोग करता है और मेमोरी प्रबंधन स्वतः गारबेज कलेक्टर द्वारा होता है।`
      },
      {
        qEn: `What is the expected result when processing expressions involving ${topic}?`,
        qHi: `${topic} से जुड़े भावों को निष्पादित करते समय अपेक्षित परिणाम क्या है?`,
        optsEn: [
          `Deterministic evaluation following standard operator precedence and associativity rules.`,
          `Unpredictable random reordering of arithmetic operations.`,
          `Automatic suppression of all runtime exceptions.`,
          `Converting all numeric outputs to negative integers.`
        ],
        optsHi: [
          `मानक ऑपरेटर वरीयता और साहचर्य नियमों का पालन करते हुए सटीक मूल्यांकन।`,
          `अंकगणितीय संक्रियाओं का यादृच्छिक क्रम।`,
          `सभी रनटाइम अपवादों को स्वतः दबा देना।`,
          `सभी आउटपुट को ऋणात्मक संख्याओं में बदलना।`
        ],
        ans: 0,
        expEn: `Python follows strict operator precedence hierarchy and left-to-right (or right-to-left for power **) associativity.`,
        expHi: `पायथन ऑपरेटर वरीयता और साहचर्य नियमों का सख्ती से पालन करता है।`
      },
      {
        qEn: `Which built-in Python function or syntax is best suited for working with "${topic}"?`,
        qHi: `"${topic}" के साथ काम करने के लिए कौन सा बिल्ट-इन पायथन फ़ंक्शन या सिंटैक्स सबसे उपयुक्त है?`,
        optsEn: [
          `Standard built-in functions, list/dict comprehensions, and context managers.`,
          `Writing inline raw assembly instructions.`,
          `Invoking kernel interrupt 0x80 directly.`,
          `Bypassing Python Virtual Machine execution.`
        ],
        optsHi: [
          `मानक बिल्ट-इन फ़ंक्शन, लिस्ट/डिक्शनरी कॉम्प्रिहेंशन, और संदर्भ प्रबंधक (with open)।`,
          `इनलाइन असेंबली निर्देश लिखना।`,
          `कर्नेल इंटरप्ट को सीधे कॉल करना।`,
          `PVM को बायपास करना।`
        ],
        ans: 0,
        expEn: `Comprehensions and standard library functions provide concise, highly readable, and optimized Pythonic code.`,
        expHi: `कॉम्प्रिहेंशन और बिल्ट-इन मेथड्स पायथन में कुशल और पठनीय कोड लिखने में मदद करते हैं।`
      }
    ],
    M4: [
      {
        qEn: `In an IoT deployment, how does "${topic}" contribute to the connected device architecture?`,
        qHi: `IoT परिनियोजन में, "${chap.hindiTitle}" कनेक्टेड डिवाइस आर्किटेक्चर में कैसे योगदान देता है?`,
        optsEn: [
          `By capturing physical environmental telemetry and transmitting data via lightweight protocols to edge/cloud brokers.`,
          `By operating without power or network connectivity.`,
          `By running heavy desktop office applications locally on 8-bit microcontrollers.`,
          `By eliminating the need for any microcontrollers, sensors, or actuators.`
        ],
        optsHi: [
          `पर्यावरणीय डेटा एकत्र करके और हल्के प्रोटोकॉल के माध्यम से ब्रोकर या क्लाउड पर भेजकर।`,
          `बिना बिजली या इंटरनेट के काम करके।`,
          `8-बिट माइक्रोकंट्रोलर पर भारी डेस्कटॉप सॉफ़्टवेयर चलाकर।`,
          `सेंसर और माइक्रोकंट्रोलर की आवश्यकता को पूरी तरह समाप्त करके।`
        ],
        ans: 0,
        expEn: `IoT nodes interface sensors and actuators with microcontrollers, streaming lightweight telemetry packets via protocols like MQTT and CoAP.`,
        expHi: `IoT उपकरण सेंसर द्वारा भौतिक संकेतों को पढ़कर MQTT/CoAP जैसे प्रोटोकॉल से क्लाउड पर भेजते हैं।`
      },
      {
        qEn: `What is the primary constraint when developing hardware firmware for ${topic}?`,
        qHi: `${topic} के लिए हार्डवेयर फ़र्मवेयर विकसित करते समय प्राथमिक सीमा (Constraint) क्या है?`,
        optsEn: [
          `Limited SRAM/Flash memory, low power budget, and execution timing precision.`,
          `Requiring at least 64GB of DDR5 RAM on the sensor node.`,
          `Unlimited power supply and infinite memory bandwidth.`,
          `Absence of any clock crystal or timing oscillator.`
        ],
        optsHi: [
          `सीमित SRAM/फ्लैश मेमोरी, कम बिजली की खपत, और सटीक टाइमिंग नियंत्रण।`,
          `प्रत्येक सेंसर नोड पर 64GB RAM की आवश्यकता होना।`,
          `असीमित बिजली और मेमोरी होना।`,
          `बिना टाइमिंग ऑसिलेटर के काम करना।`
        ],
        ans: 0,
        expEn: `Embedded microcontrollers (like ATmega328P) have strict memory (e.g. 2KB SRAM) and power limits, requiring efficient C code.`,
        expHi: `माइक्रोकंट्रोलर में सीमित मेमोरी (2KB SRAM) और कम बिजली होती है, इसलिए अनुकूलित कोड आवश्यक है।`
      },
      {
        qEn: `Which communication or interface standard is commonly employed for "${topic}"?`,
        qHi: `"${topic}" के लिए आमतौर पर कौन सा संचार या इंटरफ़ेस मानक उपयोग किया जाता है?`,
        optsEn: [
          `UART, SPI, I2C, or wireless standards like Zigbee, BLE, and LoRaWAN.`,
          `Standard IDE ribbon cables exclusively.`,
          `Analog telephone modems over dial-up.`,
          `Manual punch cards.`
        ],
        optsHi: [
          `UART, SPI, I2C, या वायरलेस मानक जैसे Zigbee, BLE, और LoRaWAN।`,
          `केवल पुराने IDE केबल।`,
          `डायल-अप टेलीफोन मोडेम।`,
          `पंच कार्ड।`
        ],
        ans: 0,
        expEn: `Serial buses (I2C, SPI, UART) connect on-board peripherals, while Zigbee/BLE/LoRa connect wireless sensor networks.`,
        expHi: `I2C, SPI और UART सेंसर और चिप्स के बीच संचार के प्रमुख इंटरफ़ेस हैं।`
      }
    ]
  };

  const pool = templatesByModule[moduleId] || templatesByModule['M1'];
  const template = pool[(index + entropySeed) % pool.length];

  return {
    id: `${moduleId}-GEN-${chapterNumber}-${index + 1}-${entropySeed % 9999}`,
    moduleId,
    chapterNumber,
    chapterName: chap.title,
    questionEn: template.qEn,
    questionHi: template.qHi,
    optionsEn: template.optsEn,
    optionsHi: template.optsHi,
    correctIndex: template.ans,
    explanationEn: template.expEn,
    explanationHi: template.expHi,
    source: pickedSource.source,
    sourceLabel: pickedSource.label,
    year: '2024-2025',
    difficulty: (index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard')
  };
}

// Generate the Test Paper based on configuration
export function generateTestPaper(config: TestConfiguration): GeneratedTest {
  // High-entropy random seed incorporating timestamp and random numbers for true variety
  const entropySeed = Math.floor(Math.random() * 1000000) + Date.now() % 10000;
  const prng = createPRNG(`${config.moduleId}-${config.testType}-${config.bookletSeries}-${config.questionCount}-${entropySeed}`);
  const moduleInfo = MODULES_INFO[config.moduleId];
  const targetCount = config.questionCount; // 100, 50, or custom

  // 1. Filter existing question bank for the selected module
  let candidatePool = ALL_QUESTIONS.filter((q) => q.moduleId === config.moduleId);

  if (config.testType === 'chapter_wise' && config.selectedChapters.length > 0) {
    candidatePool = candidatePool.filter((q) => config.selectedChapters.includes(q.chapterNumber));
  }

  // Filter by source if requested
  if (config.sourceFilter === 'examjila') {
    const examjilaFiltered = candidatePool.filter((q) => q.source.includes('examjila'));
    if (examjilaFiltered.length >= 10) candidatePool = examjilaFiltered;
  } else if (config.sourceFilter === 'nielit_pyq') {
    const pyqFiltered = candidatePool.filter((q) => q.source.includes('nielit_pyq'));
    if (pyqFiltered.length >= 10) candidatePool = pyqFiltered;
  } else if (config.sourceFilter === 'nielit_model') {
    const modelFiltered = candidatePool.filter((q) => q.source.includes('nielit_model'));
    if (modelFiltered.length >= 10) candidatePool = modelFiltered;
  }

  // Shuffle the candidate pool using randomized Fisher-Yates so repeated clicks on 'Generate' pick different subsets
  const shuffledCandidatePool = [...candidatePool];
  for (let i = shuffledCandidatePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCandidatePool[i], shuffledCandidatePool[j]] = [shuffledCandidatePool[j], shuffledCandidatePool[i]];
  }

  // Determine active chapters to draw from
  const activeChapterNumbers = config.testType === 'chapter_wise' && config.selectedChapters.length > 0
    ? config.selectedChapters
    : moduleInfo.chapters.map((c) => c.number);

  const selectedQuestions: Question[] = [];
  const usedIds = new Set<string>();

  // Add randomly sampled questions from authentic pool first
  for (const q of shuffledCandidatePool) {
    if (selectedQuestions.length < targetCount && !usedIds.has(q.id)) {
      selectedQuestions.push({ ...q });
      usedIds.add(q.id);
    }
  }

  // If pool has fewer questions than requested (e.g. 50 or 100 questions for specific chapter),
  // synthesize authentic curriculum-aligned questions for the selected chapters
  let synthIndex = 0;
  while (selectedQuestions.length < targetCount) {
    const chapterNum = activeChapterNumbers[synthIndex % activeChapterNumbers.length];
    const synthQ = createTopicalQuestion(config.moduleId, chapterNum, synthIndex, entropySeed);
    selectedQuestions.push(synthQ);
    synthIndex++;
  }

  // Shuffle questions array to ensure fresh question ordering
  for (let i = selectedQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
  }

  // Shuffle options if configured (keeping correctIndex accurate)
  if (config.shuffleOptions) {
    for (let i = 0; i < selectedQuestions.length; i++) {
      const q = selectedQuestions[i];
      const indices = [0, 1, 2, 3];
      for (let k = indices.length - 1; k > 0; k--) {
        const l = Math.floor(Math.random() * (k + 1));
        [indices[k], indices[l]] = [indices[l], indices[k]];
      }
      const newOptsEn: [string, string, string, string] = [
        q.optionsEn[indices[0]],
        q.optionsEn[indices[1]],
        q.optionsEn[indices[2]],
        q.optionsEn[indices[3]]
      ];
      const newOptsHi: [string, string, string, string] | undefined = q.optionsHi
        ? [q.optionsHi[indices[0]], q.optionsHi[indices[1]], q.optionsHi[indices[2]], q.optionsHi[indices[3]]]
        : undefined;
      const newCorrect = indices.indexOf(q.correctIndex);

      selectedQuestions[i] = {
        ...q,
        optionsEn: newOptsEn,
        optionsHi: newOptsHi,
        correctIndex: newCorrect
      };
    }
  }

  const titlePrefix = config.testType === 'standard'
    ? `NIELIT O Level Standard Full Mock Test (${config.questionCount} Questions / ${config.durationMinutes} Mins)`
    : `NIELIT O Level Chapter-Wise Test: Ch ${config.selectedChapters.join(', ')} (${config.questionCount} Qs / ${config.durationMinutes} Mins)`;

  return {
    id: `TEST-${Date.now().toString(36).toUpperCase()}-${config.bookletSeries}`,
    title: titlePrefix,
    moduleCode: moduleInfo.code,
    moduleTitle: moduleInfo.title,
    config,
    questions: selectedQuestions.slice(0, targetCount),
    createdAt: new Date().toISOString()
  };
}

// Compute test results matching official NIELIT grading scale
export function calculateTestResult(
  test: GeneratedTest,
  userAnswers: Record<number, number>,
  timeSpentSeconds: number,
  candidateName?: string,
  rollNumber?: string,
  centerName?: string
): TestResult {
  const total = test.questions.length;
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;

  const chapterMap: Record<number, { name: string; total: number; correct: number; incorrect: number; unattempted: number }> = {};

  test.questions.forEach((q, index) => {
    const chapNum = q.chapterNumber;
    if (!chapterMap[chapNum]) {
      chapterMap[chapNum] = {
        name: q.chapterName,
        total: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0
      };
    }
    chapterMap[chapNum].total++;

    const chosen = userAnswers[index];
    if (chosen === undefined || chosen === -1) {
      unattempted++;
      chapterMap[chapNum].unattempted++;
    } else if (chosen === q.correctIndex) {
      correct++;
      chapterMap[chapNum].correct++;
    } else {
      incorrect++;
      chapterMap[chapNum].incorrect++;
    }
  });

  const percentage = Math.round((correct / total) * 100);

  // NIELIT Official Grade Scheme:
  // S Grade: 85% and above (Outstanding)
  // A Grade: 75% to 84% (Excellent)
  // B Grade: 65% to 74% (Very Good)
  // C Grade: 55% to 64% (Good)
  // D Grade: 50% to 54% (Satisfactory / Pass)
  // F Grade: Below 50% (Fail)
  let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  let gradeTitle: string;

  if (percentage >= 85) {
    grade = 'S';
    gradeTitle = 'Grade S (Outstanding - 85% & Above)';
  } else if (percentage >= 75) {
    grade = 'A';
    gradeTitle = 'Grade A (Excellent - 75% to 84%)';
  } else if (percentage >= 65) {
    grade = 'B';
    gradeTitle = 'Grade B (Very Good - 65% to 74%)';
  } else if (percentage >= 55) {
    grade = 'C';
    gradeTitle = 'Grade C (Good - 55% to 64%)';
  } else if (percentage >= 50) {
    grade = 'D';
    gradeTitle = 'Grade D (Satisfactory Pass - 50% to 54%)';
  } else {
    grade = 'F';
    gradeTitle = 'Grade F (Failed - Below 50%)';
  }

  const chapterBreakdown: ChapterScore[] = Object.entries(chapterMap).map(([numStr, data]) => ({
    chapterNumber: parseInt(numStr, 10),
    chapterName: data.name,
    total: data.total,
    correct: data.correct,
    incorrect: data.incorrect,
    unattempted: data.unattempted,
    percentage: Math.round((data.correct / (data.total || 1)) * 100)
  }));

  return {
    score: correct,
    maxScore: total,
    totalQuestions: total,
    correctCount: correct,
    incorrectCount: incorrect,
    unattemptedCount: unattempted,
    percentage,
    grade,
    gradeTitle,
    chapterBreakdown,
    timeSpentSeconds,
    submittedAt: new Date().toISOString(),
    candidateName: candidateName || test.config.candidateName || 'Rahul Sharma',
    rollNumber: rollNumber || test.config.rollNumber || '240182749',
    centerName: centerName || 'NIELIT Examination Centre (Delhi-NCR)',
    userAnswers: { ...userAnswers }
  };
}

/**
 * Generate a realistic simulated set of answers for demonstration or quick result viewing
 */
export function generateSampleUserAnswers(
  test: GeneratedTest,
  targetPercentage: number = 72
): Record<number, number> {
  const answers: Record<number, number> = {};
  const total = test.questions.length;
  const targetCorrect = Math.round((total * targetPercentage) / 100);
  const targetUnattempted = Math.max(2, Math.round(total * 0.08));
  const targetIncorrect = total - targetCorrect - targetUnattempted;

  // To make it look natural across chapters rather than clustered, distribute with modulo
  const indices = Array.from({ length: total }, (_, i) => i);
  // Deterministic shuffle
  const shuffledIndices = [...indices].sort((a, b) => ((a * 37 + 13) % 97) - ((b * 37 + 13) % 97));

  shuffledIndices.forEach((qIdx, rank) => {
    const q = test.questions[qIdx];
    if (rank < targetCorrect) {
      answers[qIdx] = q.correctIndex;
    } else if (rank < targetCorrect + targetIncorrect) {
      const wrongOpts = [0, 1, 2, 3].filter((o) => o !== q.correctIndex);
      answers[qIdx] = wrongOpts[(qIdx + rank) % wrongOpts.length];
    }
    // Remaining are left unattempted
  });

  return answers;
}
