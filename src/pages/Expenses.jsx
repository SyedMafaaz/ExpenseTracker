import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { format, parseISO } from 'date-fns';
import { Trash2, Download } from 'lucide-react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Health & Fitness',
  'Shopping',
  'Housing',
  'Others'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Gift',
  'Investment',
  'Refund',
  'Others'
];

const Expenses = () => {
  const { expenses, addExpense, deleteExpense } = useContext(ExpenseContext);
  
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (type) => {
    setFormData({ 
      ...formData, 
      type, 
      category: type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0] 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!formData.date) {
      alert('Please select a date');
      return;
    }
    
    // Default legacy transactions might not have a type, so new ones get the explicit type
    addExpense({
      ...formData,
      type: formData.type
    });
    
    // Reset form except date and type
    setFormData({
      ...formData,
      amount: '',
      description: ''
    });
  };

  const exportCSV = () => {
    const csv = Papa.unparse(expenses.map(e => ({
      Date: format(parseISO(e.date), 'yyyy-MM-dd'),
      Type: e.type === 'income' ? 'Income' : 'Expense',
      Category: e.category,
      Description: e.description,
      Amount: e.type === 'income' ? e.amount : `-${e.amount}`
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 15);
    
    const tableData = expenses.map(e => [
      format(parseISO(e.date), 'yyyy-MM-dd'),
      e.type === 'income' ? 'Income' : 'Expense',
      e.category,
      e.description,
      e.type === 'income' ? `+₹${parseFloat(e.amount).toFixed(2)}` : `-₹${parseFloat(e.amount).toFixed(2)}`
    ]);

    doc.autoTable({
      head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
      body: tableData,
      startY: 20,
    });

    doc.save('transactions.pdf');
  };

  const currentCategories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="flex-col gap-6">
      <div className="card glass-panel">
        <h2 style={{ marginBottom: '1.5rem' }}>Add New Transaction</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            className={`btn ${formData.type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTypeChange('expense')}
            style={{ flex: 1, backgroundColor: formData.type === 'expense' ? 'var(--danger)' : '' }}
          >
            Expense
          </button>
          <button 
            type="button" 
            className={`btn ${formData.type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTypeChange('income')}
            style={{ flex: 1, backgroundColor: formData.type === 'income' ? 'var(--success)' : '' }}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Amount (₹)</label>
            <input 
              type="number" 
              name="amount" 
              step="0.01" 
              value={formData.amount} 
              onChange={handleChange} 
              placeholder="0.00" 
              required 
            />
          </div>

          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {currentCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="flex-col gap-2">
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Description</label>
            <input 
              type="text" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="What was this for?" 
            />
          </div>

          <div className="flex-col justify-end">
            <button type="submit" className="btn btn-primary" style={{ height: '48px', backgroundColor: formData.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
              Add {formData.type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>

      <div className="card flex-col gap-4">
        <div className="flex-row justify-between items-center" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>Recent Transactions</h2>
          <div className="flex-row gap-2">
            <button onClick={exportCSV} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <Download size={16} /> CSV
            </button>
            <button onClick={exportPDF} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <Download size={16} /> PDF
            </button>
          </div>
        </div>
        
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No transactions recorded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Description</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color var(--transition-fast)' }} className="hover-bg-tertiary">
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {format(parseISO(exp.date), 'MMM dd, yyyy')}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                      {exp.description || '-'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.875rem', 
                        backgroundColor: exp.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)', 
                        color: exp.type === 'income' ? 'var(--success)' : 'var(--text-secondary)' 
                      }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: exp.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                      {exp.type === 'income' ? '+' : '-'}₹{parseFloat(exp.amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => deleteExpense(exp.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
