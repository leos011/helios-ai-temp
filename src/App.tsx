import React, { useState } from 'react';
import { ElectricCanvas } from './components/ElectricCanvas';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

import './styles/index.css';
import './styles/components.css';

interface UserData {
  name: string;
  email: string;
}

export const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);

  const handleLoginSuccess = (name: string, email: string) => {
    setUser({ name, email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Fundo Energizado Elétrico Compartilhado */}
      <ElectricCanvas />

      {/* Roteamento Simples das Telas */}
      {user === null ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard
          userName={user.name}
          userEmail={user.email}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
