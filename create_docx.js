import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    text: "CHAPTER 2",
                    heading: HeadingLevel.HEADING_1,
                    alignment: "center",
                }),
                new Paragraph({
                    text: "About the Project",
                    heading: HeadingLevel.HEADING_2,
                    alignment: "center",
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "The Smart Expense Tracker project was developed to provide users with a modern, dynamic, and responsive interface for tracking their daily financial activities. It was built using a robust full-stack architecture featuring React and Vite, ensuring high performance and a rich user experience.",
                            size: 24, // 12pt
                        }),
                    ],
                    spacing: { after: 200, before: 400 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "A key feature of the application is its interactive data visualization, powered by Chart.js, which allows users to see their spending trends at a glance. Additionally, the project incorporates advanced OCR receipt scanning using Tesseract.js, enabling users to automatically extract expense details from physical receipts without manual entry.",
                            size: 24,
                        }),
                    ],
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "To ensure reliability and scalability, the application is fully containerized using Docker and Docker Compose. A lightweight Nginx web server handles the routing for the Single Page Application (SPA). The entire infrastructure is deployed to a live AWS EC2 cloud environment, managed seamlessly by a continuous integration and continuous deployment (CI/CD) pipeline built with GitHub Actions.",
                            size: 24,
                        }),
                    ],
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "This hands-on development process not only focused on delivering a functional Minimum Viable Product (MVP) but also heavily emphasized premium design aesthetics, utilizing vanilla CSS to create a visually stunning and highly engaging interface.",
                            size: 24,
                        }),
                    ],
                }),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("C:/Users/mafaa/Downloads/ExpenseTracker_Chapter_2.docx", buffer);
    console.log("Document created successfully at C:/Users/mafaa/Downloads/ExpenseTracker_Chapter_2.docx");
});
