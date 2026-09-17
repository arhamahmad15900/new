import { ModuleInfo } from '../types';

export const MODULES_INFO: Record<string, ModuleInfo> = {
  M1: {
    id: 'M1',
    code: 'M1-R5.1',
    title: 'Information Technology Tools and Network Basics',
    hindiTitle: 'सूचना प्रौद्योगिकी उपकरण एवं नेटवर्क के मूल तत्व',
    revision: 'Revision 5.1',
    totalChapters: 9,
    description: 'Fundamentals of computer hardware & software, LibreOffice Writer, Calc, Impress, Internet, Digital Finance, and Cyber Security.',
    color: 'emerald',
    chapters: [
      {
        number: 1,
        title: 'Introduction to Computer',
        hindiTitle: 'कंप्यूटर का परिचय',
        description: 'Hardware, Software, CPU, I/O devices, Memory types, Open Source vs Proprietary.',
        topics: ['Evolution of Computers', 'IT Gadgets', 'Hardware vs Software', 'CPU and Memory', 'Input/Output Devices', 'System vs Application Software']
      },
      {
        number: 2,
        title: 'Introduction to Operating System',
        hindiTitle: 'ऑपरेटिंग सिस्टम का परिचय',
        description: 'OS concepts, Windows, Linux, GUI vs CLI, File and folder management, System settings.',
        topics: ['Basics of OS', 'Desktop & Mobile OS', 'User Interface', 'Taskbar & Shortcuts', 'File & Directory Management', 'System Utilities']
      },
      {
        number: 3,
        title: 'Word Processing (LibreOffice Writer)',
        hindiTitle: 'वर्ड प्रोसेसिंग (लिब्रेऑफिस राइटर)',
        description: 'Document creation, formatting, tables, mail merge, macros, styles, and page layouts in Writer.',
        topics: ['Writer Interface', 'Text Formatting', 'Table Operations', 'Mail Merge', 'Header & Footer', 'Styles & Templates', 'Printing & Export']
      },
      {
        number: 4,
        title: 'Spreadsheet (LibreOffice Calc)',
        hindiTitle: 'स्प्रेडशीट (लिब्रेऑफिस कैल्क)',
        description: 'Cells, rows, columns, formulas, mathematical and logical functions, sorting, filtering, and charts in Calc.',
        topics: ['Calc Basics', 'Formulas & Functions', 'Cell Referencing', 'SUM, AVERAGE, IF, COUNT', 'Data Sorting & Filtering', 'Charts & Graphs']
      },
      {
        number: 5,
        title: 'Presentation (LibreOffice Impress)',
        hindiTitle: 'प्रेजेंटेशन (लिब्रेऑफिस इम्प्रेस)',
        description: 'Slide creation, layouts, transitions, animations, slide master, and multimedia presentations in Impress.',
        topics: ['Slide Creation & Layouts', 'Slide Master', 'Transitions & Animations', 'Inserting Multimedia', 'Slide Show Setup', 'Printing Handouts']
      },
      {
        number: 6,
        title: 'Introduction to Internet and WWW',
        hindiTitle: 'इंटरनेट और WWW का परिचय',
        description: 'LAN, WAN, MAN, network topologies, IP addressing, DNS, protocols (HTTP, FTP, TCP/IP), web browsers, and search engines.',
        topics: ['Network Types & Topologies', 'IP Address & DNS', 'Internet Protocols (TCP/IP, HTTP)', 'Web Browsers & Search Engines', 'Connecting to Internet (WiFi, Hotspot)']
      },
      {
        number: 7,
        title: 'E-mail, Social Networking & e-Governance Services',
        hindiTitle: 'ई-मेल, सोशल नेटवर्किंग और ई-गवर्नेंस सेवाएं',
        description: 'Electronic mail, protocols (SMTP, POP3, IMAP), social media platforms, UMANG, DigiLocker, and online citizen services.',
        topics: ['Email Structure & Etiquette', 'Email Protocols', 'Social Networking Platforms', 'DigiLocker & UMANG', 'e-Governance Portals', 'National Services']
      },
      {
        number: 8,
        title: 'Digital Financial Tools and Applications',
        hindiTitle: 'डिजिटल वित्तीय उपकरण और अनुप्रयोग',
        description: 'UPI, AEPS, USSD (*99#), Net Banking, Credit/Debit cards, e-Wallets, QR code, and PoS terminals.',
        topics: ['OTP & QR Code Basics', 'UPI (Unified Payments Interface)', 'AEPS & USSD Banking', 'Debit/Credit Cards & e-Wallets', 'PoS & Digital Banking Security']
      },
      {
        number: 9,
        title: 'Overview of Future Skills & Cyber Security',
        hindiTitle: 'भविष्य के कौशल और साइबर सुरक्षा का अवलोकन',
        description: 'Emerging tech (AI, IoT, Cloud, Big Data, Blockchain, 3D Printing) and cyber safety (Malware, Phishing, Passwords, Firewalls).',
        topics: ['Emerging Technologies (AI, Cloud, IoT)', 'Cyber Threats & Malware', 'Phishing & Social Engineering', 'Password Best Practices', 'Firewall & Antivirus', 'IT Act Basics']
      }
    ]
  },
  M2: {
    id: 'M2',
    code: 'M2-R5.1',
    title: 'Web Designing & Publishing',
    hindiTitle: 'वेब डिजाइनिंग और पब्लिशिंग',
    revision: 'Revision 5.1',
    totalChapters: 7,
    description: 'Frontend web design, HTML5 semantic structure, CSS3 styling, W3.CSS/Bootstrap responsive frameworks, JavaScript, AngularJS, Photo editing, and Web hosting.',
    color: 'blue',
    chapters: [
      {
        number: 1,
        title: 'Introduction to Web Design and Editors',
        hindiTitle: 'वेब डिजाइन और संपादकों का परिचय',
        description: 'Web architecture, client-side vs server-side, responsive design principles, code editors (Sublime Text, Notepad++, VS Code).',
        topics: ['Client vs Server Architecture', 'Static vs Dynamic Websites', 'Responsive Web Design', 'HTML Editors', 'Browser Rendering Engine']
      },
      {
        number: 2,
        title: 'HTML Basics and Elements',
        hindiTitle: 'एचटीएमएल मूल बातें और तत्व',
        description: 'HTML5 document structure, headings, paragraphs, lists, tables, forms, inputs, semantic tags, and multimedia elements.',
        topics: ['HTML5 Document Tree', 'Text Formatting & Links', 'Tables & Lists', 'Forms & Form Controls', 'Semantic Tags (header, nav, article)', 'Audio & Video Elements']
      },
      {
        number: 3,
        title: 'Cascading Style Sheets (CSS)',
        hindiTitle: 'कैस्केडिंग स्टाइल शीट्स (सीएसएस)',
        description: 'CSS syntax, selectors, specificity, colors, typography, CSS box model (margin, border, padding), positioning, and Flexbox.',
        topics: ['CSS Syntax & Inclusion (Inline, Internal, External)', 'CSS Selectors & Specificity', 'Box Model Architecture', 'Color & Typography', 'Flexbox Layout Basics', 'CSS Transitions']
      },
      {
        number: 4,
        title: 'CSS Framework (W3.CSS / Bootstrap)',
        hindiTitle: 'सीएसएस फ्रेमवर्क (W3.CSS / बूटस्ट्रैप)',
        description: 'Using lightweight responsive frameworks, W3.CSS grid classes, containers, cards, tables, buttons, navigation bars, and responsive utilities.',
        topics: ['Framework Benefits', 'Grid System (12 Column)', 'Containers & Panels', 'Responsive Navigation Bars', 'Cards & Modals', 'Responsive Display Utilities']
      },
      {
        number: 5,
        title: 'JavaScript and AngularJS',
        hindiTitle: 'जावास्क्रिप्ट और एंगुलर जेएस',
        description: 'Client-side programming, variables, data types, operators, conditional statements, loops, functions, DOM manipulation, and basic AngularJS directives.',
        topics: ['JavaScript Syntax & Data Types', 'Operators & Conditionals', 'Functions & Event Handling', 'DOM Manipulation & Alerts', 'Form Validation', 'AngularJS Directives (ng-app, ng-model, ng-bind)']
      },
      {
        number: 6,
        title: 'Photo Editor (GIMP / Photoshop)',
        hindiTitle: 'फोटो संपादक (गिम्प / फोटोशॉप)',
        description: 'Digital image fundamentals, raster vs vector, color modes (RGB, CMYK), layer management, crop, selection tools, and image compression for web.',
        topics: ['Image Formats (JPEG, PNG, GIF, WebP)', 'Resolution & DPI', 'Layers & Masks', 'Selection & Crop Tools', 'Retouching & Color Adjustments', 'Web Export Optimization']
      },
      {
        number: 7,
        title: 'Web Publishing and Browsing',
        hindiTitle: 'वेब पब्लिशिंग और ब्राउज़िंग',
        description: 'Domain registration, DNS records, web hosting types, FTP file transfer, search engine indexing, and website maintenance.',
        topics: ['Domain Name Registration & DNS', 'Web Hosting Platforms', 'FTP Clients (FileZilla)', 'SEO (Search Engine Optimization)', 'Website Maintenance & Security', 'W3C Standards']
      }
    ]
  },
  M3: {
    id: 'M3',
    code: 'M3-R5.1',
    title: 'Programming and Problem Solving through Python',
    hindiTitle: 'पायथन के माध्यम से प्रोग्रामिंग और समस्या समाधान',
    revision: 'Revision 5.1',
    totalChapters: 9,
    description: 'Computational thinking, algorithms, flowcharts, Python syntax, control flow, sequence data types, functions, file handling, modules, and NumPy.',
    color: 'amber',
    chapters: [
      {
        number: 1,
        title: 'Introduction to Programming',
        hindiTitle: 'प्रोग्रामिंग का परिचय',
        description: 'Model of computation, programming paradigms, machine vs assembly vs high-level languages, compiler vs interpreter, software development lifecycle.',
        topics: ['Computation Model', 'Compilers vs Interpreters', 'Source Code & Bytecode', 'Algorithm Characteristics', 'Debugging & Testing']
      },
      {
        number: 2,
        title: 'Algorithms and Flowcharts to Solve Problems',
        hindiTitle: 'समस्या समाधान के लिए एल्गोरिदम और फ्लोचार्ट',
        description: 'Step-by-step logic design, pseudocode, standard flowchart symbols (terminal, input/output, process, decision, connector).',
        topics: ['Flowchart Symbols & Standards', 'Pseudocode Writing', 'Decision Trees', 'Looping Constructs in Flowcharts', 'Trace Tables']
      },
      {
        number: 3,
        title: 'Introduction to Python',
        hindiTitle: 'पायथन का परिचय',
        description: 'Python history, interactive shell vs script mode, keywords, identifiers, variables, standard data types (int, float, bool, str), input() and print().',
        topics: ['Python Features & Zen of Python', 'Identifiers & Keywords', 'Data Types & Type Conversion', 'input() & print() Formatting', 'Comments & Indentation']
      },
      {
        number: 4,
        title: 'Operators, Expressions & Python Statements',
        hindiTitle: 'ऑपरेटर्स, एक्सप्रेशन और पायथन स्टेटमेंट्स',
        description: 'Arithmetic, relational, logical, assignment, bitwise, membership (in, not in), identity (is, is not) operators, operator precedence, if-elif-else, while, for loops.',
        topics: ['Arithmetic & Relational Operators', 'Membership & Identity Operators', 'Operator Precedence', 'if-elif-else Branches', 'while & for Loops', 'break, continue, pass']
      },
      {
        number: 5,
        title: 'Sequence Data Types',
        hindiTitle: 'सीक्वेंस डेटा प्रकार (स्ट्रिंग, लिस्ट, टुपल, डिक्शनरी, सेट)',
        description: 'Strings, Lists, Tuples, Dictionaries, Sets, indexing, slicing, mutability vs immutability, comprehensions, and built-in sequence methods.',
        topics: ['String Slicing & Methods', 'List Operations & Methods', 'Tuples & Immutability', 'Dictionaries (Key-Value Pairs)', 'Set Operations & Uniqueness']
      },
      {
        number: 6,
        title: 'Functions and Recursion',
        hindiTitle: 'फ़ंक्शन और रिकर्शन',
        description: 'Defining functions (def), formal vs actual parameters, default arguments, return statements, lambda functions, and recursive function execution.',
        topics: ['def Statement & Return Value', 'Positional vs Keyword Arguments', 'Default Parameters (*args, **kwargs)', 'Lambda Functions', 'Recursive Functions & Base Cases']
      },
      {
        number: 7,
        title: 'File Processing',
        hindiTitle: 'फ़ाइल प्रोसेसिंग',
        description: 'File opening modes (r, w, a, r+, b), reading methods (read, readline, readlines), writing (write, writelines), seek() and tell(), and os module operations.',
        topics: ['File Modes (Text & Binary)', 'open() & close() / with open()', 'read(), readline(), readlines()', 'write() & writelines()', 'seek() & tell() Pointers', 'os Module Functions']
      },
      {
        number: 8,
        title: 'Scope and Modules',
        hindiTitle: 'स्कोप और मॉड्यूल',
        description: 'LEGB rule (Local, Enclosing, Global, Built-in), global keyword, importing standard modules (math, random, sys, datetime), creating user-defined modules.',
        topics: ['LEGB Variable Scope', 'global & nonlocal Keywords', 'import Statement & Aliases', 'math & random Modules', 'Creating Custom Modules', '__name__ == "__main__"']
      },
      {
        number: 9,
        title: 'NumPy Basics',
        hindiTitle: 'नमपाई की मूल बातें',
        description: 'NumPy arrays (ndarray), creation functions (array, zeros, ones, arange, linspace), array shape, slicing, broadcasting, and mathematical operations.',
        topics: ['NumPy vs Python Lists', 'Creating ndarrays (zeros, ones, arange)', 'Array Shape & Reshape', 'Array Indexing & Slicing', 'Vectorized Operations', 'Mathematical Functions']
      }
    ]
  },
  M4: {
    id: 'M4',
    code: 'M4-R5.1',
    title: 'Internet of Things (IoT) and its Applications',
    hindiTitle: 'इंटरनेट ऑफ थिंग्स (IoT) और इसके अनुप्रयोग',
    revision: 'Revision 5.1',
    totalChapters: 6,
    description: 'IoT architecture, embedded devices, communication protocols (MQTT, CoAP, HTTP), sensors, actuators, Arduino programming in Embedded C, cybersecurity, and soft skills.',
    color: 'purple',
    chapters: [
      {
        number: 1,
        title: 'Introduction to IoT Applications & Protocols',
        hindiTitle: 'IoT अनुप्रयोगों, प्रोटोकॉल और संचार मॉडल का परिचय',
        description: 'Characteristics of IoT, IoT architecture layers, functional blocks, communication models (Request-Response, Publish-Subscribe, Push-Pull), protocols (MQTT, CoAP).',
        topics: ['IoT Definition & Characteristics', 'Physical & Logical Design of IoT', 'IoT Communication Models', 'MQTT vs CoAP Protocols', 'Smart Home, Smart Agriculture & Healthcare']
      },
      {
        number: 2,
        title: 'Things and Connections',
        hindiTitle: 'थिंग्स और कनेक्शन',
        description: 'Controlled systems, open vs closed-loop feedback systems, wireless connectivity (WiFi, Bluetooth, Zigbee, LoRaWAN, NFC), and IoT gateways.',
        topics: ['Open-loop vs Closed-loop Systems', 'Feedback Controllers', 'Wireless Standards (Zigbee, BLE, LoRaWAN)', 'IoT Gateway Architecture', 'Edge Computing Basics']
      },
      {
        number: 3,
        title: 'Sensors, Actuators & Microcontrollers',
        hindiTitle: 'सेंसर, एक्चुएटर और माइक्रोकंट्रोलर',
        description: 'Sensor types (Temperature, Humidity, Ultrasonic, PIR, LDR, Gas), Actuators (Relays, DC Motors, Servos, Solenoids), Microcontroller architecture vs Microprocessor.',
        topics: ['Analog vs Digital Sensors', 'PIR, DHT11, Ultrasonic HC-SR04, LDR', 'Actuators (Relay, Servo Motor)', 'Microprocessor vs Microcontroller', 'ADC (Analog to Digital Conversion)']
      },
      {
        number: 4,
        title: 'Building IoT Applications (Arduino)',
        hindiTitle: 'IoT अनुप्रयोग बनाना (Arduino)',
        description: 'Arduino UNO board specifications (ATmega328P), Arduino IDE setup, Embedded C syntax, pinMode(), digitalWrite(), digitalRead(), analogRead(), serial communication.',
        topics: ['Arduino UNO Hardware Specifications', 'setup() and loop() Structure', 'Digital I/O Functions (pinMode, digitalWrite)', 'Analog I/O (analogRead, PWM analogWrite)', 'Serial Communication (Serial.begin, Serial.print)', 'Interfacing Sensors with Arduino']
      },
      {
        number: 5,
        title: 'Security and Future of IoT Ecosystem',
        hindiTitle: 'IoT पारिस्थितिकी तंत्र की सुरक्षा और भविष्य',
        description: 'IoT vulnerabilities, hardware attacks, network security, end-to-end encryption, botnets (Mirai), privacy regulations, and future industrial IoT (IIoT).',
        topics: ['IoT Security Vulnerabilities', 'Common Attacks (DDoS, MITM, Mirai Botnet)', 'Data Encryption in IoT', 'Privacy Concerns & Regulations', 'Industrial IoT (IIoT) & Smart Cities']
      },
      {
        number: 6,
        title: 'Soft Skills - Personality Development',
        hindiTitle: 'सॉफ्ट स्किल्स - व्यक्तित्व विकास',
        description: 'Interpersonal communication, verbal & non-verbal communication, email etiquette, resume building, presentation skills, and interview facing techniques.',
        topics: ['Verbal & Non-Verbal Communication', 'Effective Listening Skills', 'Professional Email Writing', 'Resume Preparation', 'Time Management & Teamwork', 'Interview Preparation']
      }
    ]
  }
};
