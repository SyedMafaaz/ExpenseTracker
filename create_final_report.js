import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { readFileSync } from 'fs';

async function createFinalDocx() {
    try {
        const content = readFileSync('rephrased_5chapters.txt', 'utf8');
        const lines = content.split('\n');
        
        const children = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Empty line
            if (!line) {
                children.push(new Paragraph({
                    spacing: { after: 60 },
                    children: []
                }));
                continue;
            }
            
            // Screenshot placeholder
            if (line.startsWith('[INSERT SCREENSHOT')) {
                const match = line.match(/\[INSERT SCREENSHOT (\d+) HERE: (.+)\]/);
                if (match) {
                    const screenshotNum = match[1];
                    const description = match[2];
                    
                    // Create a bordered box placeholder
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: '\n',
                                size: 24,
                                font: 'Times New Roman'
                            })
                        ],
                        spacing: { before: 360, after: 120 },
                        border: {
                            top: { style: 'dashed', size: 6, color: 'FF6600' },
                            bottom: { style: 'dashed', size: 6, color: 'FF6600' },
                            left: { style: 'dashed', size: 6, color: 'FF6600' },
                            right: { style: 'dashed', size: 6, color: 'FF6600' }
                        }
                    }));
                    
                    // Placeholder text
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `📸 SCREENSHOT ${screenshotNum}`,
                                bold: true,
                                size: 28,
                                font: 'Times New Roman',
                                color: 'FF6600'
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 }
                    }));
                    
                    // Description
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: description,
                                bold: true,
                                italic: true,
                                size: 24,
                                font: 'Times New Roman',
                                color: '666666'
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 60 }
                    }));
                    
                    // Closing border
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: '\n',
                                size: 24,
                                font: 'Times New Roman'
                            })
                        ],
                        spacing: { after: 360 },
                        border: {
                            top: { style: 'dashed', size: 6, color: 'FF6600' },
                            bottom: { style: 'dashed', size: 6, color: 'FF6600' },
                            left: { style: 'dashed', size: 6, color: 'FF6600' },
                            right: { style: 'dashed', size: 6, color: 'FF6600' }
                        }
                    }));
                }
                continue;
            }
            
            // Chapter headings
            if (line.match(/^CHAPTER\s+\d+$/)) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            bold: true,
                            size: 36,
                            font: 'Times New Roman',
                            allCaps: true,
                            color: '000000'
                        })
                    ],
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 240, line: 480 },
                    pageBreakBefore: children.length > 0
                }));
                
                children.push(new Paragraph({
                    spacing: { after: 120 },
                    children: []
                }));
                continue;
            }
            
            // Section headings (2.1, 2.2, etc.)
            if (line.match(/^\d+\.\d+\s+/)) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            bold: true,
                            size: 28,
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
            
            // Sub-section headings (4.3.1, etc.)
            if (line.match(/^\d+\.\d+\.\d+\s+/)) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            bold: true,
                            size: 26,
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
            
            // Bold headings
            if (line.length < 100 && !line.endsWith('.') && !line.endsWith(',') && !line.endsWith(':') && 
                line[0] === line[0].toUpperCase() && 
                !line.startsWith('-') && !line.startsWith('*') && !line.match(/^\d+\.\s/)) {
                
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0 && colonIndex < 50 && line.length > colonIndex + 2) {
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
                           line.includes('Suggestions') || line.includes('Technical') || line.includes('Non-Technical') ||
                           line.includes('Functional') || line.includes('Non-Functional')))) {
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
            
            // List items
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
        
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440,
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
        
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync('Internship_Report.docx', buffer);
        
        console.log('✓ Document created: Internship_Report.docx');
        console.log(`✓ Total paragraphs: ${children.length}`);
        console.log('\n📸 SCREENSHOT PLACEMENT GUIDE:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('CHAPTER 1 - About the Organization:');
        console.log('  📸 Screenshot 1: After last paragraph');
        console.log('     → Company logo or training center photo');
        console.log('');
        console.log('CHAPTER 2 - Objective of Internship:');
        console.log('  📸 Screenshot 2: After section 2.1');
        console.log('     → VS Code with your project open');
        console.log('  📸 Screenshot 3: After section 2.3');
        console.log('     → Docker configuration or terminal');
        console.log('');
        console.log('CHAPTER 3 - System Analysis:');
        console.log('  📸 Screenshot 4: After section 3.3');
        console.log('     → Dashboard page with charts');
        console.log('  📸 Screenshot 5: After section 3.5');
        console.log('     → VS Code file explorer structure');
        console.log('');
        console.log('CHAPTER 4 - Implementation:');
        console.log('  📸 Screenshot 6: After section 4.1');
        console.log('     → Expenses page with transaction form');
        console.log('  📸 Screenshot 7: After Dashboard Component');
        console.log('     → Close-up of pie and bar charts');
        console.log('  📸 Screenshot 8: After Scanner Component');
        console.log('     → Receipt scanner interface');
        console.log('  📸 Screenshot 9: After Styling section');
        console.log('     → Dark mode theme view');
        console.log('  📸 Screenshot 10: After Nginx section');
        console.log('     → Docker build/running container');
        console.log('  📸 Screenshot 11: After AWS Deployment');
        console.log('     → AWS EC2 console dashboard');
        console.log('  📸 Screenshot 12: After Screenshot 11');
        console.log('     → Live app on AWS (browser URL visible)');
        console.log('');
        console.log('CHAPTER 5 - Testing & Conclusion:');
        console.log('  📸 Screenshot 13: After Performance Testing');
        console.log('     → Chrome Lighthouse report');
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💡 To insert screenshots:');
        console.log('   1. Open Internship_Report.docx in Word');
        console.log('   2. Find orange dashed boxes');
        console.log('   3. Click on box and insert your screenshot');
        console.log('   4. Delete placeholder text');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

createFinalDocx();
