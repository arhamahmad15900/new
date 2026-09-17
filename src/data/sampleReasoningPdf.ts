// Built-in Sample NIELIT O-Level Logical Reasoning PDF Notes for Instant Testing
export const SAMPLE_REASONING_PDF_NAME = 'NIELIT_O_Level_Logical_Reasoning_Notes.pdf';

// Valid PDF base64 containing NIELIT O-Level Logical Reasoning & Algorithm Notes
const rawPdf = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj
4 0 obj <</Length 650>> stream
BT
/F1 16 Tf
50 720 Td
(NIELIT O-Level Module M3-R5: Logical Reasoning & Python Notes) Tj
/F1 11 Tf
0 -30 Td
(1. Boolean Logic & Truth Tables:) Tj
0 -18 Td
(   - Conjunction (AND): True ONLY when all operands evaluate to True.) Tj
0 -16 Td
(   - Disjunction (OR): True if at least one operand evaluates to True.) Tj
0 -16 Td
(   - Negation (NOT): Unary operator reversing boolean truth value.) Tj
0 -24 Td
(2. De Morgan Laws in Boolean & Algorithmic Conditionals:) Tj
0 -18 Td
(   - not (A and B) == (not A) or (not B)) Tj
0 -16 Td
(   - not (A or B) == (not A) and (not B)) Tj
0 -24 Td
(3. Categorical Syllogisms & Deductive Inferences:) Tj
0 -18 Td
(   - Major Premise: All algorithms with O(1) space are in-place.) Tj
0 -16 Td
(   - Minor Premise: Binary search has O(1) auxiliary space.) Tj
0 -16 Td
(   - Conclusive Deduction: Binary search is an in-place algorithm.) Tj
0 -24 Td
(4. Number Series & Coding-Decoding Patterns:) Tj
0 -18 Td
(   - Pattern: Prime number differences, Fibonacci sequences, modulo 26 shifts.) Tj
0 -24 Td
(5. Conditional Branching & Loop Logic:) Tj
0 -18 Td
(   - Short-circuit evaluation: In 'A and B', if A is False, B is never evaluated.) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000927 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
1004
%%EOF`;

export const SAMPLE_REASONING_PDF_BASE64 = `data:application/pdf;base64,${btoa(rawPdf)}`;
