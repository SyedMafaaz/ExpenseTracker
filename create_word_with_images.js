import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from 'docx';
import { readFileSync } from 'fs';

async function createDocxWithImages() {
    try {
        // Read the text file
        const content = readFileSync('rephrased_report.txt', 'utf8');
        const lines = content.split('\n');
        
        const children = [];
        
        // Image configuration - Add your screenshots here
        const imageMap = {
            'CHAPTER 3': {
                after: '3.5 System Architecture',
                images: [
                    {
                        path: 'screenshots/dashboard.png',
                        caption: 'Figure 3.1: Dashboard with Financial Overview and Charts',
                        width: 550,
                        height: 350
                    }
                ]
            },
            '3.6 System Requirements': {
                after: 'Functional Requirements:',
                images: [
                    {
                        path: 'screenshots/expenses-page.png',
                        caption: 'Figure 3.2: Transaction Management Interface',
                        width: 550,
                        height: 350
                    }
                ]
            },
            'CHAPTER 4': {
                after: '4.3 Component Implementation',
                images: [
                    {
                        path: 'screenshots/project-structure.png',
                        caption: 'Figure 4.1: Project Directory Structure',
                        width: 500,
                        height: 400
                    }
                ]
            },
            '4.3.2 Dashboard Component': {
                after: null, // Insert right after heading
                images: [
                    {
                        path: 'screenshots/dashboard-charts.png',
                        caption: 'Figure 4.2: Interactive Pie and Bar Charts',
                        width: 550,
                        height: 350
                    }
                ]
            },
            '4.3.3 Expenses Component': {
                after: null,
                images: [
                    {
                        path: 'screenshots/add-transaction.png',
                        caption: 'Figure 4.3: Adding New Transaction Form',
                        width: 550,
                        height: 350
                    }
                ]
            },
            '4.3.4 Scanner Component': {
                after: null,
                images: [
                    {
                        path: 'screenshots/receipt-scanner.png',
                        caption: 'Figure 4.4: OCR Receipt Scanner Interface',
                        width: 550,
                        height: 350
                    },
                    {
                        path: 'screenshots/scanned-result.png',
                        caption: 'Figure 4.5: Extracted Data from Receipt Scan',
                        width: 550,
                        height: 350
                    }
                ]
            },
            '4.6.1 Docker Containerization': {
                after: null,
                images: [
                    {
                        path: 'screenshots/docker-setup.png',
                        caption: 'Figure 4.6: Docker Configuration Files',
                        width: 500,
                        height: 300
                    }
                ]
            },
            '4.6.3 AWS EC2 Deployment': {
                after: null,
                images: [
                    {
                        path: 'screenshots/aws-deployment.png',
                        caption: 'Figure 4.7: AWS EC2 Deployment Dashboard',
                        width: 550,
                        height: 350
                    },
                    {
                        path: 'screenshots/live-application.png',
                        caption: 'Figure 4.8: Live Application on AWS EC2',
                        width: 550,
                        height: 350
                    }
                ]
            },
            'CHAPTER 5': {
                after: '5.2 Functional Testing Results',
                images: [
                    {
                        path: 'screenshots/dark-mode.png',
                        caption: 'Figure 5.1: Dark Mode Theme Implementation',
                        width: 550,
                        height: 350
                    }
                ]
            },
            '6.2 Performance Metrics': {
                after: null,
                images: [
                    {
                        path: 'screenshots/lighthouse-score.png',
                        caption: 'Figure 6.1: Lighthouse Performance Report',
                        width: 550,
                        height: 400
                    }
                ]
            }
        };
        
        // Helper function to add image with caption
        function addImageWithCaption(imageConfig) {
            const imageChildren = [];
            
            try {
                if (fs.existsSync(imageConfig.path)) {
                    const imageBuffer = fs.readFileSync(imageConfig.path);
                    
                    // Add image
                    imageChildren.push(new Paragraph({
                        children: [
                            new ImageRun({
                                data: imageBuffer,
                                transformation: {
                                    width: imageConfig.width,
                                    height: imageConfig.height
                                },
                                type: 'png'
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 240, after: 120 }
                    }));
                    
                    // Add caption
                    imageChildren.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: imageConfig.caption,
                                italic: true,
                                size: 22, // 11pt
                                font: 'Times New Roman',
                                color: '333333'
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 240 }
                    }));
                    
                    console.log(`✓ Added: ${imageConfig.caption}`);
                } else {
                    // Image not found - add placeholder
                    imageChildren.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `[${imageConfig.caption}]`,
                                bold: true,
                                size: 22,
                                font: 'Times New Roman',
                                color: 'FF0000'
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 240, after: 120 }
                    }));
                    
                    imageChildren.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `⚠ Image not found: ${imageConfig.path}`,
                                size: 20,
                                font: 'Times New Roman',
                                color: 'FF6600'
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 240 }
                    }));
                    
                    console.log(`⚠ Missing: ${imageConfig.path}`);
                }
            } catch (error) {
                console.error(`Error adding image ${imageConfig.path}:`, error.message);
            }
            
            return imageChildren;
        }
        
        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line) {
                children.push(new Paragraph({
                    spacing: { after: 60 },
                    children: []
                }));
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
                
                // Add images after chapter heading if configured
                const chapterKey = line;
                if (imageMap[chapterKey]) {
                    const imgChildren = addImageWithCaption(imageMap[chapterKey].images[0]);
                    children.push(...imgChildren);
                }
                continue;
            }
            
            // Section headings
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
                
                // Add images after this heading if configured
                if (imageMap[line]) {
                    imageMap[line].images.forEach(img => {
                        const imgChildren = addImageWithCaption(img);
                        children.push(...imgChildren);
                    });
                }
                continue;
            }
            
            // Sub-section headings
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
                
                // Add images after this heading if configured
                if (imageMap[line]) {
                    imageMap[line].images.forEach(img => {
                        const imgChildren = addImageWithCaption(img);
                        children.push(...imgChildren);
                    });
                }
                continue;
            }
            
            // Check if we need to insert images after specific text
            for (const [, config] of Object.entries(imageMap)) {
                if (config.after && line.includes(config.after)) {
                    // Skip the first image if it was already added at chapter level
                    const imagesToAdd = config.after === null ? config.images.slice(1) : config.images;
                    imagesToAdd.forEach(img => {
                        const imgChildren = addImageWithCaption(img);
                        children.push(...imgChildren);
                    });
                }
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
                           line.includes('Suggestions') || line.includes('Technical') || line.includes('Non-Technical')))) {
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
            
            // Code blocks
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
        
        // Generate and save the document
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync('Internship_Report.docx', buffer);
        
        console.log('\n✓ Document created successfully: Internship_Report.docx');
        console.log(`✓ Total paragraphs: ${children.length}`);
        console.log('\n📸 IMAGE SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Required Screenshots:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        const requiredImages = [
            'screenshots/dashboard.png - Main dashboard with financial metrics and charts',
            'screenshots/expenses-page.png - Transaction management page with table',
            'screenshots/project-structure.png - File explorer showing project structure',
            'screenshots/dashboard-charts.png - Close-up of pie and bar charts',
            'screenshots/add-transaction.png - Form for adding new transaction',
            'screenshots/receipt-scanner.png - OCR scanner upload interface',
            'screenshots/scanned-result.png - Extracted data after scanning receipt',
            'screenshots/docker-setup.png - Docker configuration or container status',
            'screenshots/aws-deployment.png - AWS EC2 dashboard/console',
            'screenshots/live-application.png - Live app running in browser',
            'screenshots/dark-mode.png - Application in dark mode',
            'screenshots/lighthouse-score.png - Chrome Lighthouse performance report'
        ];
        
        requiredImages.forEach((img) => {
            const exists = fs.existsSync(img.split(' - ')[0]);
            const status = exists ? '✓' : '✗';
            console.log(`${status} ${img}`);
        });
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💡 TIP: Create screenshots/ folder and add images');
        console.log('   Missing images will show placeholders in red');
        
    } catch (error) {
        console.error('Error creating document:', error);
    }
}

createDocxWithImages();
