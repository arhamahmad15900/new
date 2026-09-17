import { Question } from '../types';

export const QUESTIONS_M2: Question[] = [
  // ==========================================
  // CHAPTER 1: INTRODUCTION TO WEB DESIGN AND EDITORS
  // ==========================================
  {
    id: 'M2-C1-01',
    moduleId: 'M2',
    chapterNumber: 1,
    chapterName: 'Introduction to Web Design and Editors',
    questionEn: 'Which meta viewport tag configuration ensures responsive web design on mobile device screens?',
    questionHi: 'मोबाइल डिवाइस स्क्रीन पर रिस्पॉन्सिव वेब डिज़ाइन सुनिश्चित करने के लिए कौन सा मेटा व्यूपोर्ट टैग कॉन्फ़िगरेशन सही है?',
    optionsEn: [
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta name="viewport" content="width=1024, user-scalable=no">',
      '<meta name="screen" content="mobile-first">',
      '<meta name="display" content="responsive">'
    ],
    optionsHi: [
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta name="viewport" content="width=1024, user-scalable=no">',
      '<meta name="screen" content="mobile-first">',
      '<meta name="display" content="responsive">'
    ],
    correctIndex: 0,
    explanationEn: '`<meta name="viewport" content="width=device-width, initial-scale=1.0">` tells the browser to match screen width in device-independent pixels and sets initial zoom level to 1.',
    explanationHi: 'यह मेटा टैग मोबाइल ब्राउज़र को डिवाइस की चौड़ाई के अनुसार वेब पेज को स्केल करने का निर्देश देता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C1-02',
    moduleId: 'M2',
    chapterNumber: 1,
    chapterName: 'Introduction to Web Design and Editors',
    questionEn: 'Who founded the World Wide Web Consortium (W3C) in 1994 to develop open web standards?',
    questionHi: 'खुले वेब मानकों को विकसित करने के लिए 1994 में वर्ल्ड वाइड वेब कंसोर्टियम (W3C) की स्थापना किसने की थी?',
    optionsEn: ['Tim Berners-Lee', 'Brendan Eich', 'Bill Gates', 'Marc Andreessen'],
    optionsHi: ['टिम बर्नर्स-ली', 'ब्रेंडन आइच', 'बिल गेट्स', 'मार्क आंद्रेसेन'],
    correctIndex: 0,
    explanationEn: 'Sir Tim Berners-Lee invented the World Wide Web in 1989 and founded W3C in 1994 to ensure long-term growth of the web.',
    explanationHi: 'टिम बर्नर्स-ली ने WWW का आविष्कार किया और 1994 में W3C की स्थापना की।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Web Design Foundations',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C1-03',
    moduleId: 'M2',
    chapterNumber: 1,
    chapterName: 'Introduction to Web Design and Editors',
    questionEn: 'Which software tool is classified as a dedicated lightweight source code editor with syntax highlighting for web development?',
    questionHi: 'वेब विकास के लिए सिंटैक्स हाइलाइटिंग वाले हल्के स्रोत कोड संपादक के रूप में किसे वर्गीकृत किया गया है?',
    optionsEn: ['Notepad++', 'Microsoft Word', 'LibreOffice Writer', 'Paint'],
    optionsHi: ['Notepad++', 'Microsoft Word', 'LibreOffice Writer', 'Paint'],
    correctIndex: 0,
    explanationEn: 'Notepad++, Visual Studio Code, and Sublime Text are dedicated text/code editors supporting multi-language syntax highlighting.',
    explanationHi: 'Notepad++ और VS Code कोड एडिटिंग और सिंटैक्स हाइलाइटिंग के लिए समर्पित संपादक हैं।',
    source: 'nielit_model',
    sourceLabel: 'NIELIT Official Model Paper',
    year: '2024',
    difficulty: 'easy'
  },

  // ==========================================
  // CHAPTER 2: HTML BASICS AND ELEMENTS
  // ==========================================
  {
    id: 'M2-C2-01',
    moduleId: 'M2',
    chapterNumber: 2,
    chapterName: 'HTML Basics and Elements',
    questionEn: 'Which HTML5 semantic element is used to represent independent, self-contained content such as a blog post or news story?',
    questionHi: 'ब्लॉग पोस्ट या समाचार जैसी स्वतंत्र, आत्मनिर्भर सामग्री का प्रतिनिधित्व करने के लिए किस HTML5 सिमेंटिक तत्व का उपयोग किया जाता है?',
    optionsEn: ['<article>', '<section>', '<aside>', '<div>'],
    optionsHi: ['<article>', '<section>', '<aside>', '<div>'],
    correctIndex: 0,
    explanationEn: '`<article>` represents self-contained compositions in a document that can be independently distributed or reused (e.g. forum posts, newspaper articles).',
    explanationHi: '`<article>` टैग का उपयोग स्वतंत्र और पुन: प्रयोज्य सामग्री (जैसे लेख, ब्लॉग पोस्ट) के लिए किया जाता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C2-02',
    moduleId: 'M2',
    chapterNumber: 2,
    chapterName: 'HTML Basics and Elements',
    questionEn: 'Which attribute in an `<input>` tag specifies that an input field MUST be filled out before submitting the form?',
    questionHi: '`<input>` टैग में कौन सा विशेषता (Attribute) निर्दिष्ट करता है कि फ़ॉर्म सबमिट करने से पहले इनपुट फ़ील्ड को भरना अनिवार्य है?',
    optionsEn: ['required', 'validate', 'mandatory', 'important'],
    optionsHi: ['required', 'validate', 'mandatory', 'important'],
    correctIndex: 0,
    explanationEn: 'The boolean `required` attribute prevents form submission if the user leaves the input blank.',
    explanationHi: '`required` एट्रिब्यूट उपयोगकर्ता को फ़ील्ड खाली छोड़कर फॉर्म जमा करने से रोकता है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'easy'
  },
  {
    id: 'M2-C2-03',
    moduleId: 'M2',
    chapterNumber: 2,
    chapterName: 'HTML Basics and Elements',
    questionEn: 'Which HTML attribute allows a single table data cell to span across multiple vertical rows?',
    questionHi: 'कौन सी HTML विशेषता एक तालिका सेल को कई लंबवत पंक्तियों (Vertical Rows) में फैलाने की अनुमति देती है?',
    optionsEn: ['rowspan', 'colspan', 'rowmerge', 'span'],
    optionsHi: ['rowspan', 'colspan', 'rowmerge', 'span'],
    correctIndex: 0,
    explanationEn: '`rowspan="n"` merges `n` rows vertically in an HTML table, whereas `colspan="n"` merges columns horizontally.',
    explanationHi: '`rowspan` का उपयोग दो या दो से अधिक पंक्तियों (Rows) को एक साथ मिलाने के लिए किया जाता है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila HTML5 Master Practice',
    year: '2024',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 3: CASCADING STYLE SHEETS (CSS)
  // ==========================================
  {
    id: 'M2-C3-01',
    moduleId: 'M2',
    chapterNumber: 3,
    chapterName: 'Cascading Style Sheets (CSS)',
    questionEn: 'In CSS, what is the default value of the `position` property for all standard HTML elements?',
    questionHi: 'CSS में, सभी मानक HTML तत्वों के लिए `position` गुण (Property) का डिफ़ॉल्ट मान क्या होता है?',
    optionsEn: ['static', 'relative', 'absolute', 'fixed'],
    optionsHi: ['static', 'relative', 'absolute', 'fixed'],
    correctIndex: 0,
    explanationEn: 'HTML elements are positioned `static` by default, meaning they flow naturally according to standard document order.',
    explanationHi: 'CSS में सभी तत्वों की डिफ़ॉल्ट स्थिति `static` होती है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C3-02',
    moduleId: 'M2',
    chapterNumber: 3,
    chapterName: 'Cascading Style Sheets (CSS)',
    questionEn: 'Which CSS property sets the element box sizing calculation so that padding and border are included in the specified total width and height?',
    questionHi: 'कौन सी CSS प्रॉपर्टी बॉक्स साइजिंग की गणना इस प्रकार सेट करती है कि पैडिंग और बॉर्डर कुल निर्दिष्ट चौड़ाई और ऊंचाई में शामिल हों?',
    optionsEn: [
      'box-sizing: border-box;',
      'box-sizing: content-box;',
      'box-layout: inner;',
      'border-collapse: collapse;'
    ],
    optionsHi: [
      'box-sizing: border-box;',
      'box-sizing: content-box;',
      'box-layout: inner;',
      'border-collapse: collapse;'
    ],
    correctIndex: 0,
    explanationEn: '`box-sizing: border-box;` includes padding and border within the defined width/height, preventing layout overflow.',
    explanationHi: '`box-sizing: border-box` का उपयोग करने से पैडिंग और बॉर्डर कुल चौड़ाई के अंदर ही समाहित हो जाते हैं।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'medium'
  },
  {
    id: 'M2-C3-03',
    moduleId: 'M2',
    chapterNumber: 3,
    chapterName: 'Cascading Style Sheets (CSS)',
    questionEn: 'Which CSS selector selects all direct `<p>` child elements located immediately inside a `<div>`?',
    questionHi: 'कौन सा CSS चयनकर्ता (Selector) `<div>` के ठीक अंदर स्थित सभी प्रत्यक्ष (Direct Child) `<p>` तत्वों का चयन करता है?',
    optionsEn: ['div > p', 'div p', 'div + p', 'div ~ p'],
    optionsHi: ['div > p', 'div p', 'div + p', 'div ~ p'],
    correctIndex: 0,
    explanationEn: '`div > p` is the child combinator selecting only direct children. `div p` selects all descendants (children, grandchildren).',
    explanationHi: '`>` प्रतीक चाइल्ड कॉम्बिनेटर है जो केवल प्रत्यक्ष संतानों (Direct Children) का चयन करता है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila CSS3 Advanced Selectors',
    year: '2024',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 4: CSS FRAMEWORK (W3.CSS / BOOTSTRAP)
  // ==========================================
  {
    id: 'M2-C4-01',
    moduleId: 'M2',
    chapterNumber: 4,
    chapterName: 'CSS Framework (W3.CSS / Bootstrap)',
    questionEn: 'How many total column units are defined in the responsive grid system of W3.CSS and Bootstrap?',
    questionHi: 'W3.CSS और Bootstrap के रिस्पॉन्सिव ग्रिड सिस्टम में कुल कितने कॉलम यूनिट परिभाषित हैं?',
    optionsEn: ['12 columns', '16 columns', '8 columns', '24 columns'],
    optionsHi: ['12 कॉलम', '16 कॉलम', '8 कॉलम', '24 कॉलम'],
    correctIndex: 0,
    explanationEn: 'Both W3.CSS and Bootstrap utilize a standard 12-column responsive fluid grid system.',
    explanationHi: 'W3.CSS और बूटस्ट्रैप दोनों में 12-कॉलम का रिस्पॉन्सिव ग्रिड सिस्टम होता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C4-02',
    moduleId: 'M2',
    chapterNumber: 4,
    chapterName: 'CSS Framework (W3.CSS / Bootstrap)',
    questionEn: 'Which W3.CSS class adds a 4-pixel drop shadow to create an elevated paper card effect?',
    questionHi: 'कौन सा W3.CSS क्लास 4-पिक्सेल ड्रॉप शैडो जोड़कर उभरा हुआ कार्ड प्रभाव बनाता है?',
    optionsEn: ['w3-card-4', 'w3-shadow-4', 'w3-panel-elevated', 'w3-box-shadow'],
    optionsHi: ['w3-card-4', 'w3-shadow-4', 'w3-panel-elevated', 'w3-box-shadow'],
    correctIndex: 0,
    explanationEn: '`w3-card-4` displays an HTML container as a paper card with a prominent 4px box shadow.',
    explanationHi: '`w3-card-4` क्लास तत्व के चारों ओर 4px की छाया (Shadow) प्रदान करती है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C4-03',
    moduleId: 'M2',
    chapterNumber: 4,
    chapterName: 'CSS Framework (W3.CSS / Bootstrap)',
    questionEn: 'What is a primary architectural feature of W3.CSS compared to Bootstrap?',
    questionHi: 'Bootstrap की तुलना में W3.CSS की प्राथमिक वास्तुकला विशेषता क्या है?',
    optionsEn: [
      'It is pure CSS with no jQuery or JavaScript library dependencies',
      'It requires Python backend runtime',
      'It works only on Internet Explorer 6',
      'It requires npm compilation for every stylesheet'
    ],
    optionsHi: [
      'यह शुद्ध CSS है और इसमें jQuery या JavaScript लाइब्रेरी पर कोई निर्भरता नहीं है',
      'इसके लिए पायथन बैकएंड रनटाइम की आवश्यकता होती है',
      'यह केवल पुराने ब्राउज़रों पर काम करता है',
      'इसके लिए भारी संकलन की आवश्यकता होती है'
    ],
    correctIndex: 0,
    explanationEn: 'W3.CSS is an ultra-lightweight (approx 23KB) pure CSS framework requiring zero JavaScript or jQuery dependencies.',
    explanationHi: 'W3.CSS पूरी तरह से प्योर CSS है और इसे चलाने के लिए jQuery या जावास्क्रिप्ट की आवश्यकता नहीं होती।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila W3.CSS Framework Practice',
    year: '2024',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 5: JAVASCRIPT AND ANGULARJS
  // ==========================================
  {
    id: 'M2-C5-01',
    moduleId: 'M2',
    chapterNumber: 5,
    chapterName: 'JavaScript and AngularJS',
    questionEn: 'What will be the output of `typeof NaN` in JavaScript?',
    questionHi: 'जावास्क्रिप्ट में `typeof NaN` का आउटपुट क्या होगा?',
    optionsEn: ['"number"', '"NaN"', '"undefined"', '"object"'],
    optionsHi: ['"number"', '"NaN"', '"undefined"', '"object"'],
    correctIndex: 0,
    explanationEn: 'In JavaScript according to IEEE 754 floating-point specification, `NaN` (Not-a-Number) is a special numeric value whose type is `"number"`.',
    explanationHi: 'जावास्क्रिप्ट में `NaN` (Not a Number) का डेटा प्रकार तकनीकी रूप से `"number"` होता है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'medium'
  },
  {
    id: 'M2-C5-02',
    moduleId: 'M2',
    chapterNumber: 5,
    chapterName: 'JavaScript and AngularJS',
    questionEn: 'Which AngularJS directive binds the value of an HTML input control to application model data (two-way data binding)?',
    questionHi: 'कौन सा AngularJS निर्देश (Directive) HTML इनपुट नियंत्रण के मान को एप्लिकेशन डेटा मॉडल (Two-way data binding) से जोड़ता है?',
    optionsEn: ['ng-model', 'ng-bind', 'ng-app', 'ng-init'],
    optionsHi: ['ng-model', 'ng-bind', 'ng-app', 'ng-init'],
    correctIndex: 0,
    explanationEn: '`ng-model` provides two-way data binding between HTML input controls (`<input>`, `<select>`, `<textarea>`) and the AngularJS scope model.',
    explanationHi: '`ng-model` डायरेक्टिव टू-वे डेटा बाइंडिंग स्थापित करता है जिससे UI और डेटा हमेशा सिंक रहते हैं।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C5-03',
    moduleId: 'M2',
    chapterNumber: 5,
    chapterName: 'JavaScript and AngularJS',
    questionEn: 'What is the difference between `==` and `===` comparison operators in JavaScript?',
    questionHi: 'जावास्क्रिप्ट में `==` और `===` तुलना ऑपरेटरों के बीच क्या अंतर है?',
    optionsEn: [
      '`==` compares values with type coercion, whereas `===` strictly compares both value and data type',
      '`===` converts strings to numbers automatically while `==` does not',
      '`==` is assignment and `===` is comparison',
      'Both operators are 100% identical in all modern browsers'
    ],
    optionsHi: [
      '`==` प्रकार रूपांतरण (Type Coercion) के साथ तुलना करता है, जबकि `===` मान और डेटा प्रकार दोनों की सटीक तुलना करता है',
      '`===` स्ट्रिंग को नंबर में बदलता है',
      '`==` असाइनमेंट है और `===` तुलना है',
      'दोनों ऑपरेटर पूरी तरह समान हैं'
    ],
    correctIndex: 0,
    explanationEn: '`===` is the strict equality operator checking both value and operand data types without performing implicit type coercion.',
    explanationHi: '`===` (Strict Equality) ऑपरेटर मान के साथ-साथ डेटा टाइप की भी जांच करता है (जैसे `5 === "5"` असत्य/False देता है)।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila JS Engine Deep Dive',
    year: '2024',
    difficulty: 'easy'
  },

  // ==========================================
  // CHAPTER 6: PHOTO EDITOR (GIMP / PHOTOSHOP)
  // ==========================================
  {
    id: 'M2-C6-01',
    moduleId: 'M2',
    chapterNumber: 6,
    chapterName: 'Photo Editor (GIMP / Photoshop)',
    questionEn: 'What is the standard screen display resolution in pixels per inch (PPI) used for web images?',
    questionHi: 'वेब छवियों के लिए उपयोग किए जाने वाले पिक्सल प्रति इंच (PPI) में मानक स्क्रीन डिस्प्ले रिज़ॉल्यूशन क्या है?',
    optionsEn: ['72 PPI', '300 PPI', '600 PPI', '1200 PPI'],
    optionsHi: ['72 PPI', '300 PPI', '600 PPI', '1200 PPI'],
    correctIndex: 0,
    explanationEn: '72 to 96 PPI is the standard resolution for web images on computer monitors, while 300 DPI is required for high-resolution print.',
    explanationHi: 'वेबसाइट और स्क्रीन डिस्प्ले के लिए मानक रिज़ॉल्यूशन 72 PPI होता है, जबकि प्रिंटिंग के लिए 300 DPI उपयोग होता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C6-02',
    moduleId: 'M2',
    chapterNumber: 6,
    chapterName: 'Photo Editor (GIMP / Photoshop)',
    questionEn: 'Which tool in Photoshop/GIMP duplicates pixels from a sampled source area to retouch blemishes or repair images?',
    questionHi: 'फोटोशॉप/गिम्प में कौन सा टूल दाग-धब्बों को ठीक करने के लिए किसी चयनित क्षेत्र से पिक्सेल की नकल (Clone) करता है?',
    optionsEn: ['Clone Stamp Tool', 'Crop Tool', 'Magic Wand Tool', 'Gradient Tool'],
    optionsHi: ['क्लोन स्टैम्प टूल (Clone Stamp)', 'क्रॉप टूल', 'मैजिक वैंड टूल', 'ग्रेडिएंट टूल'],
    correctIndex: 0,
    explanationEn: 'The Clone Stamp tool samples pixels from one area (via Alt+Click) and paints them seamlessly over another area.',
    explanationHi: 'क्लोन स्टैम्प टूल किसी हिस्से से पिक्सल का नमूना लेकर दूसरे हिस्से पर उसकी सटीक नकल पेंट करता है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 7: WEB PUBLISHING AND BROWSING
  // ==========================================
  {
    id: 'M2-C7-01',
    moduleId: 'M2',
    chapterNumber: 7,
    chapterName: 'Web Publishing and Browsing',
    questionEn: 'Which standard application protocol is commonly used to upload website HTML and media files to a remote web hosting server?',
    questionHi: 'रिमोट वेब होस्टिंग सर्वर पर वेबसाइट HTML और मीडिया फ़ाइलें अपलोड करने के लिए आमतौर पर किस मानक प्रोटोकॉल का उपयोग किया जाता है?',
    optionsEn: ['FTP (File Transfer Protocol)', 'SNMP', 'DHCP', 'ICMP'],
    optionsHi: ['FTP (फ़ाइल ट्रांसफर प्रोटोकॉल)', 'SNMP', 'DHCP', 'ICMP'],
    correctIndex: 0,
    explanationEn: 'FTP (File Transfer Protocol, Port 21) or SFTP (Port 22) is used by webmasters to upload website files to web hosting servers.',
    explanationHi: 'FTP का उपयोग स्थानीय कंप्यूटर से वेब सर्वर पर वेबसाइट फ़ाइलों को अपलोड और प्रबंधित करने के लिए किया जाता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M2-C7-02',
    moduleId: 'M2',
    chapterNumber: 7,
    chapterName: 'Web Publishing and Browsing',
    questionEn: 'What is the top-level country code domain (ccTLD) assigned to India in the Domain Name System?',
    questionHi: 'डोमेन नाम प्रणाली (DNS) में भारत को सौंपा गया शीर्ष-स्तरीय देश कोड डोमेन (ccTLD) क्या है?',
    optionsEn: ['.in', '.ind', '.in.org', '.co'],
    optionsHi: ['.in', '.ind', '.in.org', '.co'],
    correctIndex: 0,
    explanationEn: '`.in` is the official Country Code Top-Level Domain (ccTLD) designated for entities located in India.',
    explanationHi: 'भारत का आधिकारिक कंट्री कोड टॉप-लेवल डोमेन `.in` है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Web Publishing & Domains',
    year: '2024',
    difficulty: 'easy'
  }
];
