import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { format, parseISO, isSameMonth } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { expenses, budget } = useContext(ExpenseContext);
  const currentMonth = new Date();

  // Filter for current month
  const currentMonthTransactions = expenses.filter(exp => 
    isSameMonth(parseISO(exp.date), currentMonth)
  );

  const monthlyExpenses = currentMonthTransactions.filter(exp => exp.type !== 'income');
  const monthlyIncomes = currentMonthTransactions.filter(exp => exp.type === 'income');

  const totalSpent = monthlyExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalIncome = monthlyIncomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  
  const remainingBudget = (budget + totalIncome) - totalSpent;
  const progress = Math.min((totalSpent / (budget + totalIncome || 1)) * 100, 100);

  // Prepare Pie Chart Data (Expenses by Category)
  const categories = {};
  monthlyExpenses.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + parseFloat(exp.amount);
  });

  const pieData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare Bar Chart Data (Daily Income/Expense)
  const dailyData = {};
  currentMonthTransactions.forEach(t => {
    const day = format(parseISO(t.date), 'dd MMM');
    if (!dailyData[day]) {
      dailyData[day] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      dailyData[day].income += parseFloat(t.amount);
    } else {
      dailyData[day].expense += parseFloat(t.amount);
    }
  });

  // Sort days
  const sortedDays = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));

  const barData = {
    labels: sortedDays,
    datasets: [
      {
        label: 'Income',
        data: sortedDays.map(day => dailyData[day].income),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: sortedDays.map(day => dailyData[day].expense),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'var(--text-primary)' }
      }
    },
    scales: {
      x: { ticks: { color: 'var(--text-secondary)' }, grid: { display: false } },
      y: { ticks: { color: 'var(--text-secondary)' }, border: { dash: [4, 4] } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: 'var(--text-primary)' } }
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="card glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '2rem' }}>
        <div className="flex-col gap-2">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Total Income</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
            +₹{totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="flex-col gap-2">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Total Spent</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--danger)' }}>
            -₹{totalSpent.toFixed(2)}
          </p>
        </div>
        
        <div className="flex-col gap-2">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Monthly Budget Target</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            ₹{budget.toFixed(2)}
          </p>
        </div>

        <div className="flex-col gap-2">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Remaining Balance</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: remainingBudget >= 0 ? 'var(--accent-primary)' : 'var(--danger)' }}>
            ₹{remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card flex-col gap-4">
         <h3 style={{ fontSize: '1.25rem' }}>Budget Usage (including income)</h3>
         <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: progress > 90 ? 'var(--danger)' : progress > 75 ? 'var(--warning)' : 'var(--success)',
              transition: 'width 1s ease-in-out'
            }}></div>
         </div>
         <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
           {progress.toFixed(1)}% used of (₹{(budget + totalIncome).toFixed(2)})
         </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card flex-col gap-4">
          <h3 style={{ fontSize: '1.25rem' }}>Expenses by Category</h3>
          <div className="chart-container">
            {monthlyExpenses.length > 0 ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <div className="flex-row justify-center items-center" style={{ height: '100%', color: 'var(--text-muted)' }}>
                No expenses this month
              </div>
            )}
          </div>
        </div>

        <div className="card flex-col gap-4">
          <h3 style={{ fontSize: '1.25rem' }}>Daily Cashflow</h3>
          <div className="chart-container">
            {currentMonthTransactions.length > 0 ? (
              <Bar data={barData} options={chartOptions} />
            ) : (
              <div className="flex-row justify-center items-center" style={{ height: '100%', color: 'var(--text-muted)' }}>
                No transactions this month
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
