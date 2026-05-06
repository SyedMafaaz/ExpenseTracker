# Screenshots Required for Internship Report

## 📸 Required Images (12 screenshots total)

Create this folder structure:
```
screenshots/
├── dashboard.png
├── expenses-page.png
├── project-structure.png
├── dashboard-charts.png
├── add-transaction.png
├── receipt-scanner.png
├── scanned-result.png
├── docker-setup.png
├── aws-deployment.png
├── live-application.png
├── dark-mode.png
└── lighthouse-score.png
```

---

## Detailed Screenshot Guide:

### 1. **dashboard.png** - Main Dashboard Overview
- **What to capture**: The entire dashboard page showing:
  - Total Income, Total Spent, Monthly Budget, Remaining Balance cards
  - Budget usage progress bar
  - Pie chart (Expenses by Category)
  - Bar chart (Daily Cashflow)
- **How to capture**: 
  1. Run `npm run dev`
  2. Navigate to `http://localhost:5173/`
  3. Add some sample transactions first
  4. Take full screenshot of the dashboard
- **Resolution**: 1920x1080 or higher

### 2. **expenses-page.png** - Transaction Management
- **What to capture**: The Expenses page showing:
  - Add New Transaction form (with expense/income toggle)
  - Recent Transactions table with sample data
  - CSV and PDF export buttons
- **How to capture**: Navigate to `/expenses` route
- **Resolution**: 1920x1080

### 3. **project-structure.png** - VS Code File Explorer
- **What to capture**: 
  - VS Code with file explorer open
  - Show the complete project structure (src, components, pages, context)
  - Include Dockerfile, nginx.conf, package.json visible
- **How to capture**: 
  1. Open project in VS Code
  2. Expand all folders in explorer
  3. Take screenshot
- **Resolution**: 1920x1080

### 4. **dashboard-charts.png** - Charts Close-up
- **What to capture**: 
  - Zoom in on the pie chart and bar chart
  - Show data clearly visible
  - Can be a cropped version of dashboard
- **How to capture**: Use browser zoom or crop from dashboard screenshot
- **Resolution**: Focus on chart area (at least 800x600)

### 5. **add-transaction.png** - Transaction Form
- **What to capture**:
  - Close-up of the "Add New Transaction" form
  - Show dropdown categories, amount field, date picker
  - Fill in sample data to make it look realistic
- **How to capture**: Navigate to `/expenses` and zoom on form
- **Resolution**: 1920x1080

### 6. **receipt-scanner.png** - OCR Scanner Interface
- **What to capture**:
  - The Scanner page with upload area
  - Show "Click to upload or drag and drop" area
  - Upload icon visible
- **How to capture**: Navigate to `/scanner` route
- **Resolution**: 1920x1080

### 7. **scanned-result.png** - Scan Results
- **What to capture**:
  - After scanning a receipt image
  - Show extracted amount, date, description fields
  - Show raw extracted text panel on the right
  - "Confirm & Save" button visible
- **How to capture**:
  1. Go to `/scanner`
  2. Upload a sample receipt image (search "sample receipt" online)
  3. Click "Scan Receipt"
  4. Wait for OCR to complete
  5. Take screenshot of results
- **Resolution**: 1920x1080

### 8. **docker-setup.png** - Docker Configuration
- **What to capture** (choose one):
  - Option A: VS Code showing Dockerfile and docker-compose.yml
  - Option B: Terminal showing `docker build` or `docker-compose up` command
  - Option C: Docker Desktop showing running containers
- **How to capture**: 
  1. Run `docker build -t expensetracker .`
  2. Or run `docker-compose up -d`
  3. Screenshot the terminal output
- **Resolution**: 1920x1080

### 9. **aws-deployment.png** - AWS EC2 Console
- **What to capture**:
  - AWS Management Console showing EC2 dashboard
  - Your running instance visible
  - Instance state: "Running"
  - Public IP or DNS visible
- **How to capture**:
  1. Login to AWS Console
  2. Navigate to EC2 service
  3. Take screenshot of your instance
- **Resolution**: 1920x1080

### 10. **live-application.png** - Production App
- **What to capture**:
  - Your ExpenseTracker running live on AWS EC2
  - Show the URL in browser address bar (e.g., http://your-ec2-ip)
  - Dashboard or any page visible
- **How to capture**:
  1. Access your deployed app via EC2 public IP
  2. Take full browser screenshot
- **Resolution**: 1920x1080

### 11. **dark-mode.png** - Dark Theme
- **What to capture**:
  - Dashboard or Expenses page in dark mode
  - Toggle the theme to dark
  - Show the contrast and UI adaptation
- **How to capture**:
  1. Run app locally or use deployed version
  2. Click theme toggle (if available) or set theme to dark in localStorage
  3. Take screenshot
- **Resolution**: 1920x1080

### 12. **lighthouse-score.png** - Performance Report
- **What to capture**:
  - Chrome DevTools Lighthouse tab
  - Run audit on your app
  - Show Performance, Accessibility, Best Practices, SEO scores
- **How to capture**:
  1. Open Chrome DevTools (F12)
  2. Go to Lighthouse tab
  3. Click "Analyze page load"
  4. Wait for report
  5. Screenshot the scores
- **Resolution**: Capture full report (may need to scroll)

---

## Tips for Better Screenshots:

1. **Use Sample Data**: Add 10-15 realistic transactions before capturing
2. **Clean Browser**: Close unnecessary tabs, use incognito mode
3. **Consistent Resolution**: All screenshots should be same width (1920px recommended)
4. **Professional Look**: 
   - Use light mode for most screenshots
   - Ensure good lighting and contrast
   - Remove personal/sensitive data
5. **File Format**: Save as PNG (not JPG) for better quality
6. **File Size**: Keep each image under 1MB if possible

---

## Quick Commands to Run App:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Docker build
docker build -t expensetracker .

# Docker run
docker run -p 80:80 expensetracker
```

---

## After Adding Screenshots:

Run the script to generate the Word document with images:

```bash
node create_word_with_images.js
```

This will create `Internship_Report.docx` with all images inserted at appropriate locations with captions.

---

## Missing Images?

If you can't capture certain images (like AWS deployment), the script will show red placeholders that you can:
1. Replace later with actual images in Word
2. Delete the placeholders
3. Or leave as-is to show planned features
