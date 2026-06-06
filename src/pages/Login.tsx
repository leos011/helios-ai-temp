import React, { useState } from 'react';
import '../styles/login.css';

interface LoginProps {
  onLoginSuccess: (userName: string, userEmail: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (isRegistering) {
      if (!name) {
        setErrorMsg('Por favor, informe seu nome para o cadastro.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('As senhas digitadas não coincidem.');
        return;
      }
      // Simula cadastro bem-sucedido e efetua login
      onLoginSuccess(name, email);
    } else {
      // Simula login bem-sucedido extraindo nome do email
      const generatedName = email.split('@')[0];
      const capitalizedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
      onLoginSuccess(capitalizedName, email);
    }
  };

  return (
    <div className="login-container">
      {/* Grid de Fundo com Linha de Scanner de Voltagem */}
      <div className="circuit-grid"></div>
      <div className="voltage-line"></div>

      <div className="auth-panel glass-pane">
        {/* Cantoneiras Estilo Esquemático */}
        <div className="bracket-corner corner-tl"></div>
        <div className="bracket-corner corner-tr"></div>
        <div className="bracket-corner corner-bl"></div>
        <div className="bracket-corner corner-br"></div>

        <div className="auth-header">
          <div className="logo-wrapper">
            <span className="logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            <span className="text-cyan">HELIOS</span>
            <span style={{ color: 'var(--text-main)', marginLeft: '4px' }}>AI</span>
          </div>
          <p className="font-tech text-cyan" style={{ fontSize: '0.75rem', letterSpacing: '2px', marginTop: '-4px' }}>
            ENGINEERING COGNITIVE CORE
          </p>
          <h2 style={{ marginTop: '12px' }}>
            {isRegistering ? 'REGISTRAR OPERADOR' : 'AUTENTICAÇÃO DE SISTEMA'}
          </h2>
          <p>
            {isRegistering 
              ? 'Cadastre suas credenciais para acesso à Helios Core' 
              : 'Insira suas credenciais de engenheiro eletricista'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-body">
          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255, 76, 76, 0.15)',
              border: '1px solid #ff4c4c',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#ff8a8a',
              marginBottom: '18px',
              textAlign: 'center'
            }}>
              {errorMsg}
            </div>
          )}

          {isRegistering && (
            <div className="form-group animate-slide">
              <label htmlFor="auth-name">Nome Completo</label>
              <div className="input-wrapper">
                <input
                  id="auth-name"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Engenheiro Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Endereço de E-mail</label>
            <div className="input-wrapper">
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="operador@helios.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="input-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Senha de Segurança</label>
            <div className="input-wrapper">
              <input
                id="auth-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="input-icon">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            </div>
          </div>

          {isRegistering && (
            <div className="form-group animate-slide">
              <label htmlFor="auth-confirm">Confirmar Senha</label>
              <div className="input-wrapper">
                <input
                  id="auth-confirm"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
              </div>
            </div>
          )}

          <button type="submit" className="btn-electric">
            <span>{isRegistering ? 'CADASTRAR E ENTRAR' : 'CONECTAR AO HELIOS CORE'}</span>
            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </button>

          <div className="auth-toggle">
            {isRegistering ? 'Já possui uma conta ativa?' : 'Novo operador na rede?'}
            <span
              className="auth-toggle-link"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg('');
              }}
            >
              {isRegistering ? 'Acessar Terminal' : 'Registrar Acesso'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
