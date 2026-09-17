import { Question } from '../types';

export const QUESTIONS_M4: Question[] = [
  // ==========================================
  // CHAPTER 1: INTRODUCTION TO IOT APPLICATIONS & PROTOCOLS
  // ==========================================
  {
    id: 'M4-C1-01',
    moduleId: 'M4',
    chapterNumber: 1,
    chapterName: 'Introduction to IoT Applications & Protocols',
    questionEn: 'Which transport layer protocol and default port does MQTT (Message Queuing Telemetry Transport) standardly operate over?',
    questionHi: 'MQTT (मैसेज क्यूइंग टेलीमेट्री ट्रांसपोर्ट) मानक रूप से किस ट्रांसपोर्ट लेयर प्रोटोकॉल और डिफ़ॉल्ट पोर्ट पर काम करता है?',
    optionsEn: ['TCP on Port 1883', 'UDP on Port 5683', 'HTTP on Port 80', 'IP on Port 21'],
    optionsHi: ['TCP पोर्ट 1883 पर', 'UDP पोर्ट 5683 पर', 'HTTP पोर्ट 80 पर', 'IP पोर्ट 21 पर'],
    correctIndex: 0,
    explanationEn: 'MQTT uses a TCP/IP connection on Port 1883 (unencrypted) or Port 8883 (TLS/SSL encrypted), operating on a Publish/Subscribe messaging model.',
    explanationHi: 'MQTT प्रोटोकॉल TCP पर पोर्ट 1883 (बिना एन्क्रिप्शन) या 8883 (SSL/TLS के साथ) पर काम करता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M4-C1-02',
    moduleId: 'M4',
    chapterNumber: 1,
    chapterName: 'Introduction to IoT Applications & Protocols',
    questionEn: 'Which Quality of Service (QoS) level in MQTT guarantees that a message is delivered "Exactly Once"?',
    questionHi: 'MQTT में कौन सा क्वालिटी ऑफ सर्विस (QoS) स्तर यह गारंटी देता है कि संदेश "सटीक रूप से केवल एक बार" (Exactly Once) डिलीवर किया गया है?',
    optionsEn: ['QoS 2', 'QoS 1', 'QoS 0', 'QoS 3'],
    optionsHi: ['QoS 2 (Exactly Once)', 'QoS 1 (At least once)', 'QoS 0 (At most once)', 'QoS 3'],
    correctIndex: 0,
    explanationEn: 'MQTT defines three QoS levels: QoS 0 (At most once / best effort), QoS 1 (At least once), and QoS 2 (Exactly once with four-step handshake).',
    explanationHi: 'MQTT QoS 2 स्तर 4-चरणीय हैंडशेक का उपयोग करके यह सुनिश्चित करता है कि संदेश केवल एक ही बार प्राप्त हो।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'medium'
  },
  {
    id: 'M4-C1-03',
    moduleId: 'M4',
    chapterNumber: 1,
    chapterName: 'Introduction to IoT Applications & Protocols',
    questionEn: 'Which lightweight protocol is designed specifically for constrained IoT nodes using RESTful methods over UDP on Port 5683?',
    questionHi: 'पोर्ट 5683 पर UDP के माध्यम से RESTful विधियों का उपयोग करके सीमित IoT नोड्स के लिए विशेष रूप से कौन सा प्रोटोकॉल डिज़ाइन किया गया है?',
    optionsEn: ['CoAP (Constrained Application Protocol)', 'MQTT', 'XMPP', 'AMQP'],
    optionsHi: ['CoAP (कंस्ट्रेंड एप्लीकेशन प्रोटोकॉल)', 'MQTT', 'XMPP', 'AMQP'],
    correctIndex: 0,
    explanationEn: 'CoAP (Constrained Application Protocol) is a lightweight binary RESTful protocol running over UDP (Port 5683), ideal for resource-constrained 8-bit microcontrollers.',
    explanationHi: 'CoAP प्रोटोकॉल UDP पर आधारित एक हल्का RESTful प्रोटोकॉल है जो कम मेमोरी वाले IoT उपकरणों के लिए अनुकूलित है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila IoT Protocols Series',
    year: '2024',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 2: THINGS AND CONNECTIONS
  // ==========================================
  {
    id: 'M4-C2-01',
    moduleId: 'M4',
    chapterNumber: 2,
    chapterName: 'Things and Connections',
    questionEn: 'Which of the following is a classic example of a "Closed-Loop" control feedback system?',
    questionHi: 'निम्नलिखित में से कौन सा एक "क्लोज्ड-लूप" (Closed-Loop) नियंत्रण प्रणाली का उत्कृष्ट उदाहरण है?',
    optionsEn: [
      'Air conditioner regulated by a thermostat temperature sensor',
      'Electric bread toaster with a preset timer',
      'Standard clothes iron without thermostat',
      'Simple electric hair dryer'
    ],
    optionsHi: [
      'थर्मोस्टेट तापमान सेंसर द्वारा नियंत्रित एयर कंडीशनर',
      'टाइमर वाला साधारण ब्रेड टोस्टर',
      'बिना थर्मोस्टेट की साधारण प्रेस',
      'साधारण हेयर ड्रायर'
    ],
    correctIndex: 0,
    explanationEn: 'A closed-loop system continuously measures output (current room temperature) via sensors and feeds back an error signal to adjust cooling power.',
    explanationHi: 'क्लोज्ड-लूप सिस्टम में सेंसर से फीडबैक मिलता रहता है (जैसे AC का थर्मोस्टेट कमरे का तापमान देखकर कंप्रेसर नियंत्रित करता है)।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M4-C2-02',
    moduleId: 'M4',
    chapterNumber: 2,
    chapterName: 'Things and Connections',
    questionEn: 'Which wireless standard operates under IEEE 802.15.4 specification, providing low-power mesh networking for smart home sensors?',
    questionHi: 'कौन सा वायरलेस मानक IEEE 802.15.4 विनिर्देश के तहत काम करता है और स्मार्ट होम सेंसर के लिए कम बिजली वाला मेश नेटवर्क प्रदान करता है?',
    optionsEn: ['Zigbee', 'Wi-Fi (802.11)', 'NFC', 'Satellite GPS'],
    optionsHi: ['जिगबी (Zigbee)', 'वाई-फ़ाई (802.11)', 'एनएफसी (NFC)', 'सैटेलाइट जीपीएस'],
    correctIndex: 0,
    explanationEn: 'Zigbee is based on IEEE 802.15.4 standard, offering low power consumption, 250 kbps data rate, and robust mesh topology.',
    explanationHi: 'जिगबी (Zigbee) IEEE 802.15.4 पर आधारित है और कम बिजली में होम ऑटोमेशन मेश नेटवर्क बनाता है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 3: SENSORS, ACTUATORS & MICROCONTROLLERS
  // ==========================================
  {
    id: 'M4-C3-01',
    moduleId: 'M4',
    chapterNumber: 3,
    chapterName: 'Sensors, Actuators & Microcontrollers',
    questionEn: 'Which sensor uses ultrasonic sound waves (approx. 40 kHz) to accurately measure distance to an object?',
    questionHi: 'कौन सा सेंसर किसी वस्तु की दूरी को सटीक रूप से मापने के लिए अल्ट्रासोनिक ध्वनि तरंगों (लगभग 40 kHz) का उपयोग करता है?',
    optionsEn: ['HC-SR04 Ultrasonic Sensor', 'PIR Motion Sensor', 'LDR Sensor', 'LM35 Temperature Sensor'],
    optionsHi: ['HC-SR04 अल्ट्रासोनिक सेंसर', 'PIR मोशन सेंसर', 'LDR सेंसर', 'LM35 तापमान सेंसर'],
    correctIndex: 0,
    explanationEn: 'The HC-SR04 ultrasonic sensor transmits sound bursts from a Trigger pin and measures time elapsed until the Echo pin receives the reflected wave.',
    explanationHi: 'HC-SR04 अल्ट्रासोनिक सेंसर ध्वनि तरंगें भेजकर और उनके परावर्तित होकर लौटने के समय की गणना करके दूरी मापता है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M4-C3-02',
    moduleId: 'M4',
    chapterNumber: 3,
    chapterName: 'Sensors, Actuators & Microcontrollers',
    questionEn: 'What is the key structural difference between a Microcontroller and a Microprocessor?',
    questionHi: 'माइक्रोकंट्रोलर और माइक्रोप्रोसेसर के बीच मुख्य संरचनात्मक अंतर क्या है?',
    optionsEn: [
      'A Microcontroller integrates CPU, RAM, ROM, and I/O timers on a single chip, whereas a Microprocessor requires external RAM/ROM',
      'Microprocessors are slower than microcontrollers',
      'Microcontrollers cannot execute program loops',
      'Microprocessors contain on-chip sensors'
    ],
    optionsHi: [
      'माइक्रोकंट्रोलर में एक ही चिप पर CPU, RAM, ROM और I/O पोर्ट होते हैं, जबकि माइक्रोप्रोसेसर में बाहरी मेमोरी लगानी पड़ती है',
      'माइक्रोप्रोसेसर माइक्रोकंट्रोलर से धीमे होते हैं',
      'माइक्रोकंट्रोलर में लूप नहीं चल सकते',
      'माइक्रोप्रोसेसर में ऑन-चिप सेंसर होते हैं'
    ],
    correctIndex: 0,
    explanationEn: 'A Microcontroller is a self-contained System-on-Chip (SoC) with CPU, RAM, Flash memory, and I/O peripherals, making it ideal for dedicated embedded control.',
    explanationHi: 'माइक्रोकंट्रोलर एक संपूर्ण ऑन-चिप सिस्टम है जिसमें मेमोरी और इनपुट/आउटपुट सब एक साथ एकीकृत होते हैं।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Embedded Systems Master',
    year: '2024',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 4: BUILDING IOT APPLICATIONS (ARDUINO)
  // ==========================================
  {
    id: 'M4-C4-01',
    moduleId: 'M4',
    chapterNumber: 4,
    chapterName: 'Building IoT Applications (Arduino)',
    questionEn: 'What is the core microcontroller chip mounted on the standard Arduino UNO (Rev 3) board?',
    questionHi: 'मानक Arduino UNO (Rev 3) बोर्ड पर कौन सी मुख्य माइक्रोकंट्रोलर चिप लगी होती है?',
    optionsEn: ['ATmega328P', 'ARM Cortex-M4', 'Intel 8051', 'PIC16F877A'],
    optionsHi: ['ATmega328P', 'ARM Cortex-M4', 'Intel 8051', 'PIC16F877A'],
    correctIndex: 0,
    explanationEn: 'Arduino UNO uses the Microchip ATmega328P 8-bit AVR RISC microcontroller operating at 16 MHz clock speed with 32 KB flash memory.',
    explanationHi: 'Arduino UNO बोर्ड पर 8-बिट ATmega328P माइक्रोकंट्रोलर चिप होती है जो 16 MHz पर काम करती है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M4-C4-02',
    moduleId: 'M4',
    chapterNumber: 4,
    chapterName: 'Building IoT Applications (Arduino)',
    questionEn: 'What range of integer values does the Arduino function `analogRead(A0)` return when reading an analog voltage (0V to 5V)?',
    questionHi: 'जब एनालॉग वोल्टेज (0V से 5V) पढ़ा जाता है, तो Arduino फ़ंक्शन `analogRead(A0)` किस पूर्णांक मान की सीमा लौटाता है?',
    optionsEn: ['0 to 1023 (10-bit ADC resolution)', '0 to 255 (8-bit resolution)', '0 to 4095 (12-bit resolution)', '0 to 100'],
    optionsHi: ['0 से 1023 (10-बिट ADC रिज़ॉल्यूशन)', '0 से 255', '0 से 4095', '0 से 100'],
    correctIndex: 0,
    explanationEn: 'Arduino UNO features a 10-bit Analog-to-Digital Converter (ADC) mapping 0V-5V to 2¹⁰ = 1024 discrete steps (0 to 1023).',
    explanationHi: 'Arduino UNO का 10-बिट ADC एनालॉग सिग्नल (0-5V) को 0 से 1023 तक के डिजिटल मान में परिवर्तित करता है।',
    source: 'nielit_pyq_2025',
    sourceLabel: 'NIELIT Official PYQ Jan 2025',
    year: '2025',
    difficulty: 'easy'
  },
  {
    id: 'M4-C4-03',
    moduleId: 'M4',
    chapterNumber: 4,
    chapterName: 'Building IoT Applications (Arduino)',
    questionEn: 'Which Arduino C function is used to output a Pulse Width Modulation (PWM) analog-like signal on PWM-enabled pins?',
    questionHi: 'PWM-सक्षम पिनों पर पल्स विड्थ मॉड्यूलेशन (PWM) सिग्नल आउटपुट करने के लिए किस Arduino C फ़ंक्शन का उपयोग किया जाता है?',
    optionsEn: ['analogWrite(pin, value)', 'analogRead(pin)', 'digitalWrite(pin, value)', 'pwmOutput(pin, duty)'],
    optionsHi: ['analogWrite(pin, value)', 'analogRead(pin)', 'digitalWrite(pin, value)', 'pwmOutput(pin, duty)'],
    correctIndex: 0,
    explanationEn: '`analogWrite(pin, value)` outputs a PWM square wave with a duty cycle value ranging from 0 (always off) to 255 (always on).',
    explanationHi: '`analogWrite(pin, value)` फ़ंक्शन 0 से 255 तक की वैल्यू के साथ PWM सिग्नल जनरेट करता है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila Arduino Programming Guide',
    year: '2024',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 5: SECURITY AND FUTURE OF IOT ECOSYSTEM
  // ==========================================
  {
    id: 'M4-C5-01',
    moduleId: 'M4',
    chapterNumber: 5,
    chapterName: 'Security and Future of IoT Ecosystem',
    questionEn: 'Which notorious IoT malware infected hundreds of thousands of smart cameras and home routers using default factory passwords to launch record-breaking DDoS attacks?',
    questionHi: 'किस कुख्यात IoT मैलवेयर ने रिकॉर्ड तोड़ DDoS हमलों को अंजाम देने के लिए डिफ़ॉल्ट फ़ैक्टरी पासवर्ड का उपयोग करके लाखों स्मार्ट कैमरों और राउटरों को संक्रमित किया था?',
    optionsEn: ['Mirai Botnet', 'WannaCry', 'Stuxnet', 'ILOVEYOU'],
    optionsHi: ['मिराई बॉटनेट (Mirai Botnet)', 'वानाक्राई (WannaCry)', 'स्टक्सनेट (Stuxnet)', 'आई लव यू'],
    correctIndex: 0,
    explanationEn: 'The Mirai botnet scanned the Internet for insecure IoT devices using factory-default Telnet credentials and enslaved them to execute massive Distributed Denial of Service (DDoS) attacks.',
    explanationHi: 'मिराई (Mirai) बॉटनेट ने डिफ़ॉल्ट पासवर्ड वाले IoT कैमरों को हैक करके दुनिया का सबसे बड़ा DDoS हमला किया था।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ July 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M4-C5-02',
    moduleId: 'M4',
    chapterNumber: 5,
    chapterName: 'Security and Future of IoT Ecosystem',
    questionEn: 'What does the term "Edge Computing" mean in the context of IoT architecture?',
    questionHi: 'IoT वास्तुकला के संदर्भ में "एज कंप्यूटिंग" (Edge Computing) का क्या अर्थ है?',
    optionsEn: [
      'Processing and analyzing data locally near the sensor source rather than transmitting all raw data to a centralized remote cloud',
      'Deleting old sensor data automatically',
      'Placing microcontrollers on the edge of the circuit board',
      'Running IoT devices without internet access permanently'
    ],
    optionsHi: [
      'क्लाउड पर सारा कच्चा डेटा भेजने के बजाय सेंसर के पास स्थानीय स्तर पर डेटा का प्रसंस्करण और विश्लेषण करना',
      'सेंसर डेटा को स्वतः मिटाना',
      'बोर्ड के कोने पर चिप लगाना',
      'बिना इंटरनेट के काम करना'
    ],
    correctIndex: 0,
    explanationEn: 'Edge computing performs real-time analytics and decision-making locally near the IoT devices, reducing latency and saving bandwidth.',
    explanationHi: 'एज कंप्यूटिंग डेटा को रिमोट क्लाउड पर भेजने के बजाय स्थानीय स्तर पर प्रोसेस करती है, जिससे लेटेंसी बहुत कम हो जाती है।',
    source: 'examjila_mock',
    sourceLabel: 'Examjila IoT Security and Trends',
    year: '2024',
    difficulty: 'medium'
  },

  // ==========================================
  // CHAPTER 6: SOFT SKILLS AND PERSONALITY DEVELOPMENT
  // ==========================================
  {
    id: 'M4-C6-01',
    moduleId: 'M4',
    chapterNumber: 6,
    chapterName: 'Soft Skills and Personality Development',
    questionEn: 'In job interviews, what does the acronym "STAR" method stand for when answering behavioral questions?',
    questionHi: 'नौकरी के साक्षात्कारों में व्यवहार संबंधी प्रश्नों का उत्तर देते समय "STAR" तकनीक का क्या अर्थ है?',
    optionsEn: [
      'Situation, Task, Action, Result',
      'Skills, Training, Ability, Readiness',
      'Strategy, Timing, Attitude, Response',
      'Summary, Topic, Assessment, Review'
    ],
    optionsHi: [
      'स्थिति (Situation), कार्य (Task), कार्रवाई (Action), परिणाम (Result)',
      'कौशल, प्रशिक्षण, योग्यता, तत्परता',
      'रणनीति, समय, रवैया, प्रतिक्रिया',
      'सारांश, विषय, मूल्यांकन, समीक्षा'
    ],
    correctIndex: 0,
    explanationEn: 'The STAR method is a structured technique used to answer behavioral interview questions by describing a specific Situation, Task, Action taken, and measurable Result achieved.',
    explanationHi: 'STAR इंटरव्यू तकनीक का पूर्ण रूप Situation (स्थिति), Task (कार्य), Action (कार्रवाई) और Result (परिणाम) है।',
    source: 'nielit_pyq_2024',
    sourceLabel: 'NIELIT Official PYQ Jan 2024',
    year: '2024',
    difficulty: 'easy'
  },
  {
    id: 'M4-C6-02',
    moduleId: 'M4',
    chapterNumber: 6,
    chapterName: 'Soft Skills and Personality Development',
    questionEn: 'Which non-verbal communication factor plays a critical role in establishing trust, confidence, and engagement during interpersonal communication?',
    questionHi: 'पारस्परिक संचार के दौरान विश्वास और आत्मविश्वास स्थापित करने में कौन सा गैर-मौखिक संचार (Non-verbal) कारक महत्वपूर्ण भूमिका निभाता है?',
    optionsEn: ['Appropriate Eye Contact', 'Speaking in high volume', 'Avoiding smiling', 'Looking at the floor'],
    optionsHi: ['उचित आई कॉन्टैक्ट (Eye Contact)', 'बहुत तेज़ आवाज़ में बोलना', 'मुस्कुराने से बचना', 'फ़र्श की ओर देखना'],
    correctIndex: 0,
    explanationEn: 'Direct, polite eye contact conveys honesty, attentiveness, and confidence in professional communication.',
    explanationHi: 'उचित आई कॉन्टैक्ट (आंखों से संपर्क) आत्मविश्वास और ईमानदारी का प्रतीक माना जाता है।',
    source: 'nielit_model',
    sourceLabel: 'NIELIT Official Model Paper',
    year: '2024',
    difficulty: 'easy'
  }
];
