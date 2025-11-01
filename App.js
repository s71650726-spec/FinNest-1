import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ThemeProvider } from './contexts/ThemeContext.js';
import { LanguageProvider } from './contexts/LanguageContext.js';
import LoginForm from './components/Auth/LoginForm.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import TransactionList from './components/BankSync/TransactionList.js';
import PaymentForm from './components/UPI/PaymentForm.js';
import FinancialInsights from './components/AI/FinancialInsights.js';
import GoalCards from './components/Investments/GoalCards.js';
import StatusPanel from './components/Gamification/StatusPanel.js';
import ManualEntryForm from './components/ExpenseEntry/ManualEntryForm.js';
import SharedBills from './components/Family/SharedBills.js';
import ThemeToggle from './components/UI/ThemeToggle.js';
import LanguageSelector from './components/UI/LanguageSelector.js';
import useAuth from './hooks/useAuth.js';
import useWebSocket from './hooks/useWebSocket.js';

function App() {
  const { isAuthenticated, token, onLoginSuccess } = useAuth();

  const socket = useWebSocket(token);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        // eslint-disable-next-line no-console
        console.log('WebSocket connected');
      });
      socket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log('WebSocket disconnected');
      });
    }
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.close();
      }
    };
  }, [socket]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-b from-primary to-secondary text-white">
            <header className="p-4 flex justify-between items-center">
              <h1 className="text-3xl font-semibold">FinNest</h1>
              <div className="flex space-x-4">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </header>
            <main className="p-4">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route
                    path="/login"
                    element={
                      isAuthenticated ? (
                        <Navigate to="/" replace />
                      ) : (
                        <LoginForm onLoginSuccess={onLoginSuccess} />
                      )
                    }
                  />
                  <Route
                    path="/"
                    element={isAuthenticated ? <Dashboard socket={socket} /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/transactions"
                    element={isAuthenticated ? <TransactionList /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/payments"
                    element={isAuthenticated ? <PaymentForm socket={socket} /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/insights"
                    element={isAuthenticated ? <FinancialInsights /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/investments"
                    element={isAuthenticated ? <GoalCards socket={socket} /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/gamification"
                    element={isAuthenticated ? <StatusPanel socket={socket} /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/expense-entry"
                    element={isAuthenticated ? <ManualEntryForm /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/family"
                    element={isAuthenticated ? <SharedBills socket={socket} /> : <Navigate to="/login" replace />}
                  />
                  <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
