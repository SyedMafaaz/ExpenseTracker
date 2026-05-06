import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? JSON.parse(saved) : 2000; // Default budget
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const addExpense = (expense) => {
    setExpenses([{ ...expense, id: uuidv4() }, ...expenses]);
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map((exp) => (exp.id === id ? { ...updatedExpense, id } : exp)));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budget,
        setBudget,
        addExpense,
        updateExpense,
        deleteExpense,
        theme,
        toggleTheme
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
