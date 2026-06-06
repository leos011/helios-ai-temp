import React from 'react';

export interface ChatHistoryItem {
  id: string;
  title: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  activeChatId: string;
  history: ChatHistoryItem[];
  userName: string;
  userEmail: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onLogout: () => void;
  onToggleSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  activeChatId,
  history,
  userName,
  userEmail,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLogout,
  onToggleSettings,
}) => {
  // TODO: Integrar banco de dados
  // TODO: Salvar histórico
  // TODO: Carregar conversas

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className={`sidebar-panel ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Header com Logo */}
      <div className="sidebar-header">
        <div className="logo-wrapper">
          <span className="logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </span>
          {!isCollapsed && (
            <>
              <span className="text-cyan" style={{ fontWeight: 700 }}>HELIOS</span>
              <span style={{ color: 'var(--text-main)', marginLeft: '4px', fontWeight: 600 }}>AI</span>
            </>
          )}
        </div>
      </div>

      {/* Navegação Secundária / Nova Conversa */}
      <div className="sidebar-nav">
        <button className="btn-new-chat" onClick={onNewChat} title="Nova conversa">
          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="btn-new-chat-text">Nova Conversa</span>
        </button>
      </div>

      {/* Histórico de Conversas */}
      <div className="history-section">
        {!isCollapsed && <h3 className="history-title">Painel de Histórico</h3>}
        {history.map((chat) => (
          <div
            key={chat.id}
            className={`history-item ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
            title={chat.title}
          >
            <div className="history-item-content">
              {/* Ícone de canal / esquemático */}
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="13" y2="17" />
              </svg>
              <span className="history-item-text">{chat.title}</span>
            </div>
            
            {!isCollapsed && (
              <button
                className="btn-delete-chat"
                title="Apagar conversa"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: '2.5' }}>
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer da Sidebar com Perfil, Configurações e Logout */}
      <div className="sidebar-footer">
        {/* Widget de Operador */}
        <div className="profile-widget" title={`${userName} (${userEmail})`}>
          <div className="profile-avatar">{getInitials(userName)}</div>
          <div className="profile-info">
            <span className="profile-name">{userName}</span>
            <span className="profile-role text-cyan font-tech">OPERADOR H1</span>
          </div>
        </div>

        {/* Configurações */}
        <div className="footer-item" onClick={onToggleSettings} title="Configurações">
          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="footer-item-text">Configurações</span>
        </div>

        {/* Desconexão */}
        <div className="footer-item logout-btn" onClick={onLogout} title="Desconectar do Helios">
          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="footer-item-text">Logout</span>
        </div>
      </div>
    </aside>
  );
};
