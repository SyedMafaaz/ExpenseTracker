import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { readFileSync } from 'fs';

async function createDocx() {
    try {
        // Read the text file
        const content = readFileSync('rephrased_report.txt', 'utf8');
        
        // Split content into lines
        const lines = content.split('\n');
        
        const children = [];
        
        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line) {
                // Empty line - add minimal spacing
                children.push(new Paragraph({
                    spacing: { after: 60 },
                    children: []
                }));
                continue;
            }
            
            // Chapter headings (CHAPTER 1, CHAPTER 2, etc.)
            if (line.match(/^CHAPTER\s+\d+$/)) {
                // Add page break before each chapter
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            bold: true,
                            size: 36, // 18pt
                            font: 'Times New Roman',
                            allCaps: true,
                            color: '000000'
                        })
                    ],
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 240, line: 480 },
                    pageBreakBefore: children.length > 0 // Page break before all chapters
                }));
                
                // Add subtitle spacing
                children.push(new Paragraph({
                    spacing: { after: 120 },
                    children: []
                }));
                continue;
            }
            
            // Section headings (like 2.1, 2.2, 3.1, etc.)
            if (line.match(/^\d+\.\d+\s+/)) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            bold: true,
                            size: 28, // 14pt
                            font: 'Times New Roman',
                            color: '000000'
                        })
                    ],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 360, after: 180, line: 480 },
                    keepNext: true
                }));
                continue;
            }
            
            // Sub-section headings (like 4.3.1, 4.6.2, etc.)
            if (line.match(/^\d+\.\d+\.\d+\s+/)) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            bold: true,
                            size: 26, // 13pt
                            font: 'Times New Roman',
                            color: '000000'
                        })
                    ],
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 300, after: 120, line: 480 },
                    keepNext: true
                }));
                continue;
            }
            
            // Bold headings (short titles, likely section titles)
            if (line.length < 100 && !line.endsWith('.') && !line.endsWith(',') && !line.endsWith(':') && 
                line[0] === line[0].toUpperCase() && 
                !line.startsWith('-') && !line.startsWith('*') && !line.match(/^\d+\.\s/)) {
                
                // Check if it's a bullet point with bold prefix like "**Feature:** description"
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0 && colonIndex < 50 && line.length > colonIndex + 2) {
                    // It's a bold label followed by description
                    const label = line.substring(0, colonIndex + 1);
                    const description = line.substring(colonIndex + 1).trim();
                    
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: label,
                                bold: true,
                                size: 24,
                                font: 'Times New Roman'
                            }),
                            new TextRun({
                                text: ' ' + description,
                                size: 24,
                                font: 'Times New Roman'
                            })
                        ],
                        spacing: { before: 120, after: 60, line: 360 },
                        indent: { left: 720 },
                        alignment: AlignmentType.JUSTIFIED
                    }));
                } else if ((line.length < 60 && !line.includes(' ')) || 
                          (line.length < 80 && (line.includes('Advantages') || line.includes('Limitations') || 
                           line.includes('Strengths') || line.includes('Areas for') || line.includes('Positive') ||
                           line.includes('Suggestions') || line.includes('Technical') || line.includes('Non-Technical')))) {
                    // Short standalone heading
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: line,
                                bold: true,
                                size: 24,
                                font: 'Times New Roman'
                            })
                        ],
                        spacing: { before: 240, after: 120, line: 360 },
                        alignment: AlignmentType.LEFT
                    }));
                } else {
                    // Regular paragraph that happens to be short
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: line,
                                size: 24,
                                font: 'Times New Roman',
                                spacing: { line: 360 }
                            })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 120, line: 360 },
                        indent: { firstLine: 720 }
                    }));
                }
                continue;
            }
            
            // List items starting with - or * or numbers
            if (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\.\s/)) {
                const bulletChar = line.startsWith('-') || line.startsWith('*') ? '•' : '';
                const textContent = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
                
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: bulletChar ? bulletChar + ' ' + textContent : textContent,
                            size: 24,
                            font: 'Times New Roman'
                        })
                    ],
                    indent: { 
                        left: line.match(/^\d+\.\s/) ? 720 : 900, 
                        hanging: line.match(/^\d+\.\s/) ? 360 : 180 
                    },
                    spacing: { after: 60, line: 360 },
                    alignment: AlignmentType.JUSTIFIED
                }));
                continue;
            }
            
            // Code blocks or file paths (indented or containing tree characters)
            if (line.startsWith('│') || line.startsWith('├') || line.startsWith('└') || line.startsWith('┌')) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            size: 20,
                            font: 'Courier New',
                            color: '333333'
                        })
                    ],
                    indent: { left: 720 },
                    spacing: { after: 20, line: 240 }
                }));
                continue;
            }
            
            // Regular paragraph text
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: line,
                        size: 24,
                        font: 'Times New Roman',
                        spacing: { line: 360 }
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 120, line: 360, before: 0 },
                indent: { firstLine: 720 }
            }));
        }
        
        // Create the document
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440, // 1 inch
                            right: 1440,
                            bottom: 1440,
                            left: 1440
                        }
                    }
                },
                children: children
            }],
            styles: {
                paragraphStyles: [
                    {
                        id: 'Normal',
                        name: 'Normal',
                        run: {
                            size: 24,
                            font: 'Times New Roman'
                        }
                    }
                ]
            }
        });
        
        // Generate and save the document
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync('Internship_Report.docx', buffer);
        
        console.log('✓ Document created successfully: Internship_Report.docx');
        console.log(`✓ Total paragraphs: ${children.length}`);
        console.log('✓ Formatting applied:');
        console.log('  - Font: Times New Roman');
        console.log('  - Size: 12pt (body), 14pt (sections), 16pt (chapters)');
        console.log('  - Line spacing: 1.5');
        console.log('  - Justified alignment');
        console.log('  - First line indent: 0.5 inch');
        console.log('  - Page margins: 1 inch');
        
    } catch (error) {
        console.error('Error creating document:', error);
    }
}

createDocx();
