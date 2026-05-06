import React, { useState, useContext, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { ExpenseContext } from '../context/ExpenseContext';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Scanner = () => {
  const { addExpense } = useContext(ExpenseContext);
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [progress, setProgress] = useState(0);
  
  const [extractedData, setExtractedData] = useState({
    type: 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: 'Scanned Receipt',
    category: 'Shopping'
  });

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setScanResult('');
    }
  };

  const parseText = (text) => {
    // Basic regex to find amount (e.g., ₹12.34, 12.34, Total: 12.34)
    const amountRegex = /(?:total|amount|sum)[\s:₹-]*([\d,]+\.\d{2})/i;
    const matchAmount = text.match(amountRegex);
    
    // Fallback amount regex if total is not explicitly found
    const fallbackAmountRegex = /₹?\s*(\d{1,3}(?:,\d{3})*\.\d{2})/g;
    let fallbackMatch = text.match(fallbackAmountRegex);
    
    let finalAmount = '';
    if (matchAmount && matchAmount[1]) {
      finalAmount = matchAmount[1].replace(/,/g, '');
    } else if (fallbackMatch && fallbackMatch.length > 0) {
      // Get the largest number found as an assumption for total
      const amounts = fallbackMatch.map(m => parseFloat(m.replace(/[^\d.]/g, '')));
      finalAmount = Math.max(...amounts).toFixed(2);
    }

    setExtractedData(prev => ({
      ...prev,
      amount: finalAmount || ''
    }));
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    
    setIsScanning(true);
    setScanResult('');
    setProgress(0);

    try {
      const result = await Tesseract.recognize(
        selectedImage,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      const text = result.data.text;
      setScanResult(text);
      parseText(text);
      
    } catch (error) {
      console.error('Error scanning document:', error);
      alert('Failed to scan the document. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = () => {
    if (!extractedData.amount || isNaN(extractedData.amount)) {
      alert('Please confirm a valid amount before saving.');
      return;
    }
    
    addExpense(extractedData);
    alert('Expense saved successfully!');
    navigate('/expenses');
  };

  return (
    <div className="flex-col gap-6">
      <div className="card glass-panel flex-col items-center" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Smart Receipt Scanner</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px' }}>
          Upload a clear image of your receipt. Our system uses OCR to extract the total amount automatically.
        </p>

        <div 
          onClick={() => fileInputRef.current.click()}
          style={{ 
            border: '2px dashed var(--border-color)', 
            borderRadius: 'var(--radius-lg)',
            padding: '3rem',
            cursor: 'pointer',
            backgroundColor: 'var(--bg-tertiary)',
            transition: 'border-color var(--transition-fast)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            maxWidth: '600px'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
          ) : (
            <>
              <UploadCloud size={48} color="var(--text-muted)" />
              <div style={{ fontWeight: '500' }}>Click to upload or drag and drop</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>PNG, JPG or JPEG (MAX. 5MB)</div>
            </>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />

        {selectedImage && !scanResult && (
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '2rem' }}
            onClick={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Loader2 size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                Scanning... {progress}%
              </>
            ) : (
              'Scan Receipt'
            )}
          </button>
        )}
      </div>

      {scanResult && (
        <div className="card animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="flex-col gap-4">
            <h3 className="flex-row items-center gap-2">
              <CheckCircle2 color="var(--success)" size={24} />
              Scan Complete
            </h3>
            
            <div className="flex-col gap-4">
              <div className="flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Detected Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={extractedData.amount} 
                  onChange={(e) => setExtractedData({...extractedData, amount: e.target.value})} 
                />
              </div>

              <div className="flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Date</label>
                <input 
                  type="date" 
                  value={extractedData.date} 
                  onChange={(e) => setExtractedData({...extractedData, date: e.target.value})} 
                />
              </div>

              <div className="flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Description</label>
                <input 
                  type="text" 
                  value={extractedData.description} 
                  onChange={(e) => setExtractedData({...extractedData, description: e.target.value})} 
                />
              </div>

              <button className="btn btn-primary" onClick={handleSave}>
                Confirm & Save
              </button>
            </div>
          </div>

          <div className="flex-col gap-2">
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Raw Extracted Text</h3>
            <div style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {scanResult}
            </div>
          </div>

        </div>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
