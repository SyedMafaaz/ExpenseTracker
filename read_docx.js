import fs from 'fs';
try {
    const content = fs.readFileSync('C:/Users/mafaa/Downloads/temp_docx/word/document.xml', 'utf-8');
    const text = content.replace(/<[^>]+>/g, ' ');
    console.log(text.replace(/\s+/g, ' ').trim().substring(0, 2000));
} catch (e) {
    console.error(e);
}
