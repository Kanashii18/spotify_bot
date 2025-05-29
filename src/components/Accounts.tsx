import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import '../styles/Accounts.css';

interface Account {
  email: string;
  password: string;
  timestamp: string;
}

export const Accounts: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [accounts] = useLocalStorage<Account[]>('premium-accounts', []);

  return (
    <div className="accounts-overlay">
      <div className="accounts-container">
        <div className="accounts-header">
          <h2>Premium Accounts ({accounts.length})</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="accounts-list">
          {accounts.length === 0 ? (
            <div className="no-accounts">No premium accounts found yet</div>
          ) : (
            accounts.map((account, index) => (
              <div key={index} className="account-item">
                <div className="account-details">
                  <span className="account-email">{account.email}</span>
                  <span className="account-password">{account.password}</span>
                </div>
                <span className="account-timestamp">{account.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};