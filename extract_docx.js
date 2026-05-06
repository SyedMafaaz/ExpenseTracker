import fs from 'fs';
import { createRequire } from 'module';

// Simple docx extractor using unzipper
async function extractDocx() {
    try {
        const docxPath = 'page 5 chapter 1.docx';
        
        // Check if file exists
        if (!fs.existsSync(docxPath)) {
            console.error('File not found:', docxPath);
            return;
        }

        // Use adm-zip to extract
        const AdmZip = await import('adm-zip');
        const zip = new AdmZip.default(docxPath);
        const xmlContent = zip.getEntry('word/document.xml').getData().toString('utf8');
        
        // Remove XML tags and clean up
        const text = xmlContent
            .replace(/<[^>]+>/g, '\n')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Save to text file
        fs.writeFileSync('extracted_content.txt', text, 'utf8');
        console.log('Content extracted successfully!');
        console.log('Total length:', text.length, 'characters');
        console.log('\nFirst 3000 characters:\n');
        console.log(text.substring(0, 3000));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

extractDocx();
