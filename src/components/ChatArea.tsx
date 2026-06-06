import React, { useState, useRef, useEffect } from 'react';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isTyping,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll para a mensagem mais recente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    const textToSend = inputText.trim();
    if (!textToSend && !attachmentName) return;

    let finalMessage = textToSend;
    if (attachmentName) {
      finalMessage = `[Arquivo Anexado: ${attachmentName}] ${finalMessage}`.trim();
    }

    onSendMessage(finalMessage);
    setInputText('');
    setAttachmentName(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      // Simula feedback de leitura do arquivo
      alert(`Arquivo "${file.name}" anexado temporariamente para processamento de sinais/esquema.`);
    }
  };

  // Função simples e inteligente para renderizar código/blocos esquemáticos demarcados por ```
  const renderMessageContent = (text: string) => {
    const parts = text.split('```');
    return parts.map((part, index) => {
      // Índices ímpares são blocos de código
      if (index % 2 === 1) {
        // Separa a linguagem/título da primeira linha se houver
        const lines = part.split('\n');
        let title = 'CÓDIGO / DADOS TÉCNICOS';
        let code = part;
        
        if (lines[0].trim() && lines[0].length < 15) {
          title = lines[0].toUpperCase();
          code = lines.slice(1).join('\n');
        }

        return (
          <div key={index} className="electric-code-block font-tech">
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', borderBottom: '1px solid rgba(0, 210, 255, 0.15)', paddingBottom: '4px', marginBottom: '8px', letterSpacing: '1px' }}>
              // SISTEMA: {title}
            </div>
            <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{code.trim()}</pre>
          </div>
        );
      }
      
      // Quebras de linha normais
      return (
        <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
          {part}
        </span>
      );
    });
  };

  return (
    <div className="dashboard-main">
      {/* Visualização de Mensagens */}
      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            opacity: 0.8,
            textAlign: 'center',
            padding: '40px',
            maxWidth: '600px',
            margin: 'auto'
          }}>
            <svg viewBox="0 0 24 24" style={{ width: '64px', height: '64px', stroke: 'var(--accent-cyan)', strokeWidth: '1.5', fill: 'none', marginBottom: '16px', filter: 'drop-shadow(0 0 8px var(--accent-cyan-glow))' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <h3 className="font-tech text-cyan" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>HELIOS AI CONECTADO</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Olá! Sou o **HELIOS AI**, seu especialista em Engenharia Elétrica. 
              Estou pronto para ajudar com projetos elétricos, cálculos de subestações, 
              mitigação de harmônicas, dimensionamento de cabos e análise de sistemas de potência.
            </p>
            <div className="font-tech" style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '4px' }}>
              STATUS: NÚCLEO COGNITIVO PRONTO (100k kVA)
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
              <div className="message-bubble">
                <div className={`message-sender-tag ${msg.sender}`}>
                  {msg.sender === 'user' ? 'OPERADOR' : 'HELIOS AI ⚡'}
                </div>
                {renderMessageContent(msg.text)}
              </div>
            </div>
          ))
        )}

        {/* Indicador de Digitação */}
        {isTyping && (
          <div className="message-wrapper ai">
            <div className="message-bubble">
              <div className="message-sender-tag ai">HELIOS AI ⚡</div>
              <div className="typing-indicator-wrapper">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Caixa de Envio */}
      <div className="chat-input-container">
        <div className="input-box-wrapper">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <button 
            className={`input-action-btn ${attachmentName ? 'send-btn' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            title="Anexar arquivo de sinal, diagrama ou dados"
          >
            <svg viewBox="0 0 24 24">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>

          <textarea
            className="input-textarea"
            placeholder={
              attachmentName 
                ? `Anexo pronto: ${attachmentName}. Digite o comando...` 
                : "Digite o comando elétrico (Pressione Enter para enviar)..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <button className="input-action-btn send-btn" onClick={handleSend} title="Enviar comando">
            <svg viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        
        {attachmentName && (
          <div style={{
            maxWidth: '900px',
            margin: '8px auto 0',
            fontSize: '0.8rem',
            color: 'var(--accent-orange)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg viewBox="0 0 24 24" style={{ width: '12px', height: '12px', stroke: 'currentColor', fill: 'none', strokeWidth: '2.5' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <span>Operação com anexo de dados de engenharia.</span>
            <span 
              onClick={() => setAttachmentName(null)} 
              style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '6px', color: 'var(--text-secondary)' }}
            >
              Remover
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
