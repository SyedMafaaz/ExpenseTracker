import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadsDir = path.join(process.env.USERPROFILE, 'Downloads');

async function run() {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'], defaultViewport: { width: 1280, height: 800 } });
    const page = await browser.newPage();

    console.log("Going to live app...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Screenshot 1: Main Dashboard
    await page.screenshot({ path: path.join(downloadsDir, 'Screenshot_1_Dashboard.png') });
    console.log("Saved Screenshot 1");

    // Screenshot 4: Pie & Bar charts close-up
    try {
        const chartElement = await page.$('canvas');
        if (chartElement) {
            await chartElement.screenshot({ path: path.join(downloadsDir, 'Screenshot_4_Charts.png') });
            console.log("Saved Screenshot 4");
        }
    } catch(e) {}

    // Screenshot 6: Dark Mode
    try {
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
        await new Promise(r => setTimeout(r, 500)); // let transition finish
        await page.screenshot({ path: path.join(downloadsDir, 'Screenshot_6_DarkMode.png') });
        console.log("Saved Screenshot 6");
        // revert
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    } catch(e) {}

    // Screenshot 3: Expenses Page
    try {
        const expensesLink = await page.$('a[href="/expenses"], a:contains("Expenses")');
        if (expensesLink) {
            await expensesLink.click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => new Promise(r => setTimeout(r, 1000)));
            await page.screenshot({ path: path.join(downloadsDir, 'Screenshot_3_Expenses.png') });
            console.log("Saved Screenshot 3");
        } else {
            // fallback URL
            await page.goto('http://localhost:5173/expenses', { waitUntil: 'networkidle0' });
            await page.screenshot({ path: path.join(downloadsDir, 'Screenshot_3_Expenses.png') });
            console.log("Saved Screenshot 3");
        }
    } catch(e) {}

    // Screenshot 5: Scanner Interface
    try {
        await page.goto('http://localhost:5173/scanner', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(downloadsDir, 'Screenshot_5_Scanner.png') });
        console.log("Saved Screenshot 5");
    } catch(e) {}

    await browser.close();
    console.log("All web screenshots saved successfully!");
}

run().catch(console.error);
