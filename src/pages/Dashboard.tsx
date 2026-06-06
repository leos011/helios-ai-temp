import React, { useState } from 'react';
import { Sidebar, ChatHistoryItem } from '../components/Sidebar';
import { ChatArea, Message } from '../components/ChatArea';
import '../styles/dashboard.css';

interface DashboardProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

interface ChatState {
  [chatId: string]: Message[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  userName,
  userEmail,
  onLogout,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<string>('60Hz');
  const [voltage, setVoltage] = useState<string>('13.8 kV');

  // Configurações da API Llama do Usuário
  const [useCustomLlama, setUseCustomLlama] = useState<boolean>(false);
  const [llamaApiUrl, setLlamaApiUrl] = useState<string>('http://localhost:11434');
  const [llamaModel, setLlamaModel] = useState<string>('llama3');

  // Conversas Iniciais Simuladas
  const [history, setHistory] = useState<ChatHistoryItem[]>([
    { id: 'chat-1', title: 'Análise de Harmônicas' },
    { id: 'chat-2', title: 'Cálculo de Queda de Tensão' },
    { id: 'chat-3', title: 'Estudo de Proteção ANSI' },
  ]);

  const handleDeleteChat = (chatId: string) => {
    const newHistory = history.filter(item => item.id !== chatId);
    setHistory(newHistory);

    const newChats = { ...chats };
    delete newChats[chatId];
    setChats(newChats);

    if (activeChatId === chatId) {
      if (newHistory.length > 0) {
        setActiveChatId(newHistory[0].id);
      } else {
        const fallbackId = `chat-${Date.now()}`;
        setHistory([{ id: fallbackId, title: 'Nova Conversa' }]);
        setChats({ [fallbackId]: [] });
        setActiveChatId(fallbackId);
      }
    }
  };

  // Mensagens iniciais de cada chat
  const [chats, setChats] = useState<ChatState>({
    'chat-1': [
      { id: 'm1', sender: 'user', text: 'Como posso mitigar a presença de 5ª e 7ª harmônicas em barramentos industriais alimentados por VFDs?' },
      { id: 'm2', sender: 'ai', text: 'Para mitigar as 5ª (250 Hz em redes 50Hz / 300 Hz em redes 60Hz) e 7ª harmônicas (350 Hz / 420 Hz), a engenharia industrial utiliza as seguintes estratégias:\n\n1. **Filtros Passivos Sintonizados (Single-Tuned)**:\nInstalação de filtros sintonizados ligeiramente abaixo da frequência harmônica de interesse. Por exemplo, sintonizar um ramo LC em 285 Hz para a 5ª harmônica de 60 Hz.\n\n2. **Filtros Ativos de Potência (FAP)**:\nEquipamentos baseados em inversores de fonte de tensão (VSC) que medem as distorções em tempo real e injetam correntes harmônicas em oposição de fase, cancelando a distorção.\n\n3. **Inversores com Retificadores de 12 Pulsos**:\nUtiliza um transformador defasador ($Y-\\Delta$ e $Y-Y$) que induz uma diferença de fase de 30° entre os dois retificadores pontes de diodos, eliminando naturalmente as correntes harmônicas de ordem $5, 7, 17, 19$.' }
    ]
  });

  const [isTyping, setIsTyping] = useState<boolean>(false);

  // TODO: Integrar banco de dados
  // TODO: Salvar histórico
  // TODO: Carregar conversas

  const handleSendMessage = (text: string) => {
    const activeMessages = chats[activeChatId] || [];

    // Adiciona mensagem do usuário
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text
    };

    const updatedMessages = [...activeMessages, userMsg];

    setChats(prev => ({
      ...prev,
      [activeChatId]: updatedMessages
    }));

    setIsTyping(true);

    // Se o Llama customizado estiver ativo, faz chamada de rede real
    if (useCustomLlama) {
      (async () => {
        try {
          const response = await fetch(`${llamaApiUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: llamaModel,
              messages: [
                { role: 'system', content: 'Você é o HELIOS AI, um assistente de Inteligência Artificial especialista em Engenharia Elétrica. Responda tecnicamente no idioma solicitado.' },
                ...updatedMessages.map(m => ({
                  role: m.sender === 'user' ? 'user' : 'assistant',
                  content: m.text
                }))
              ],
              stream: false
            })
          });

          if (!response.ok) throw new Error(`Código HTTP: ${response.status}`);

          const data = await response.json();
          const replyText = data.message?.content || data.response || '';

          const aiMsg: Message = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: replyText
          };

          setChats(prev => ({
            ...prev,
            [activeChatId]: [...updatedMessages, aiMsg]
          }));
        } catch (error: any) {
          const errorMsg = `[ERRO DE CONEXÃO COM API LLAMA]\n\nFalha ao conectar no endpoint configurado: \`${llamaApiUrl}/api/chat\`\n\n**Detalhes técnicos:** ${error.message}\n\n**Como resolver no Ollama local:**\n1. Certifique-se de que o Llama/Ollama está rodando localmente no seu sistema.\n2. **Importante (CORS):** Para habilitar chamadas HTTP originadas do navegador local para o Ollama, você deve configurar a variável de ambiente \`OLLAMA_ORIGINS="*" \` ao rodar o serviço. No Windows, defina-a no PowerShell executando:\n   \`$env:OLLAMA_ORIGINS="*" ; ollama serve\`\n3. Verifique se o modelo \`${llamaModel}\` está instalado rodando \`ollama pull ${llamaModel}\`.\n\n*Para continuar sem a API própria, basta desativar o Llama Customizado no painel de Configurações.*`;

          const systemMsg: Message = {
            id: `ai-error-${Date.now()}`,
            sender: 'ai',
            text: errorMsg
          };

          setChats(prev => ({
            ...prev,
            [activeChatId]: [...updatedMessages, systemMsg]
          }));
        } finally {
          setIsTyping(false);
        }
      })();
      return;
    }

    // Simula resposta da IA HELIOS especialista em elétrica padrão
    setTimeout(() => {
      let aiText = '';
      const cleanText = text.toLowerCase();

      if (cleanText.includes('queda') || cleanText.includes('cabo') || cleanText.includes('dimensio')) {
        aiText = 'Analisando os dados do circuito elétrico trifásico. Para obter o dimensionamento preciso da seção transversal do condutor ($S$ em $mm^2$) por queda de tensão admissível (ex: 2% para circuitos de força, 4% para iluminação), utilize:\n\n```formula-secao\nS = (√3 * 100 * P * L) / (V_linha^2 * ΔV_admissivel% * σ)\n```\n\nOnde:\n* **P**: Potência ativa trifásica (W)\n* **L**: Comprimento (m)\n* **V_linha**: Tensão entre fases (V)\n* **σ**: Condutividade do metal (Cobre = ~56 m/Ω·mm², Alumínio = ~35 m/Ω·mm²)\n\nRecomenda-se também validar pelo critério de capacidade de condução de corrente (Tabela 36 a 39 da NBR 5410).';
      } else if (cleanText.includes('harmoni') || cleanText.includes('filtro') || cleanText.includes('thd')) {
        aiText = 'O cálculo da Distorção Harmônica Total de Corrente ($THD_i$) é dado pela integral discreta das correntes harmônicas em relação à fundamental ($I_1$):\n\n```thd-formula\nTHDi = √[ Σ (In)^2 ] / I1  (para n de 2 a ∞)\n```\n\nPara o acoplamento de Filtros Ativos, certifique-se de configurar o transformador de corrente (TC) de medição a montante das cargas distorcidas para garantir a estabilidade do algoritmo de compensação de potência reativa e harmônicas.';
      } else if (cleanText.includes('prote') || cleanText.includes('ansi') || cleanText.includes('rele') || cleanText.includes('relé')) {
        aiText = 'Em termos de proteção de subestações de média tensão, além do par 50/51, recomendo ativar as seguintes funções ANSI:\n\n* **ANSI 50N/51N**: Sobretensão/sobrecorrente residual para detecção de faltas à terra.\n* **ANSI 27**: Proteção de subtensão (muito útil para evitar religamento de motores sob carga).\n* **ANSI 59**: Proteção de sobretensão.\n* **ANSI 87**: Proteção diferencial (indispensável para transformadores acima de 2.5 MVA).\n\n```log-configuracao-rele\n// Log de ajustes recomendado para proteção de motor de indução de 75 kW:\nANSI 49 (Sobrecarga térmica): Ajustado em 1.05 * In\nANSI 50 (Instantâneo): Ajustado em 8 * In\nANSI 51G (Falta à terra): Ajustado em 0.1 * In com atraso de 200ms\n```';
      } else if (cleanText.includes('transformador') || cleanText.includes('trafo')) {
        aiText = 'Para transformadores de potência, a especificação das perdas no cobre ($P_{cu}$) e perdas no ferro ($P_{fe}$) determina a eficiência máxima do equipamento. A máxima eficiência ocorre quando as perdas no cobre (que variam com o quadrado da carga) são iguais às perdas no núcleo (ferro, que são fixas):\n\n```trafo-eficiencia\nCarga_Otima = √[ Pfe / Pcu_nominal ]\n```\n\nAlém disso, lembre-se de monitorar a temperatura do óleo e do enrolamento utilizando termômetros tipo imagem térmica (Função ANSI 49T) para proteger o trafo contra sobreaquecimento.';
      } else {
        aiText = `Entendido, Operador. Helios Core registrou seu comando técnico. \n\nPara apoiar sua atividade de engenharia, aqui está a configuração padrão de simulação correspondente:\n\n* **Tensão da Rede**: ${voltage} (Trifásico)\n* **Frequência Operacional**: ${frequency}\n* **Método de Resolução**: Fluxo de Carga Newton-Raphson de convergência rápida.\n\nPor favor, forneça mais dados sobre a potência instalada, reatância subtransitória de geradores ($X"_d$) ou parâmetros de carga para que eu realize o cálculo de curto-circuito de acordo com a norma IEC 60909.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText
      };

      setChats(prev => ({
        ...prev,
        [activeChatId]: [...updatedMessages, aiMsg]
      }));
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newTitle = `Conversa ${history.length + 1}`;

    setHistory(prev => [...prev, { id: newId, title: newTitle }]);
    setChats(prev => ({
      ...prev,
      [newId]: []
    }));
    setActiveChatId(newId);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar de Controle de Conexões */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        activeChatId={activeChatId}
        history={history}
        userName={userName}
        userEmail={userEmail}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setShowSettings(false); // Fecha settings se alternar chat
        }}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onLogout={onLogout}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {/* Área de Visualização Principal */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', position: 'relative' }}>
        {/* Header Superior */}
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="toggle-sidebar-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expandir painel' : 'Recolher painel'}
            >
              <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }}>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="system-status">
              <span className="status-indicator"></span>
              <span className="status-label text-cyan font-tech">LLM DE EGENHARIA ELÉTRICA</span>
            </div>
          </div>

          <div className="system-title font-tech">
            <span style={{ color: 'var(--text-secondary)' }}></span>
            <span className="text-cyan"></span>
          </div>
        </header>

        {/* Corpo: Exibe Chat ou Painel de Configurações */}
        {showSettings ? (
          <div style={{
            flexGrow: 1,
            padding: '40px 24px',
            overflowY: 'auto',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            <div className="glass-pane" style={{
              width: '100%',
              maxWidth: '600px',
              borderRadius: '12px',
              padding: '30px',
              position: 'relative'
            }}>
              {/* Cantoneiras */}
              <div className="bracket-corner corner-tl"></div>
              <div className="bracket-corner corner-tr"></div>
              <div className="bracket-corner corner-bl"></div>
              <div className="bracket-corner corner-br"></div>

              <h2 className="font-tech text-cyan" style={{ fontSize: '1.5rem', marginBottom: '8px', borderBottom: '1px solid rgba(0, 210, 255, 0.15)', paddingBottom: '10px' }}>
                PARÂMETROS DE INSTRUMENTAÇÃO
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Configure as grandezas elétricas padrão do ambiente de simulação e comportamento da IA.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="font-tech" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Frequência Operacional</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    style={{
                      background: 'rgba(8, 10, 15, 0.8)',
                      border: '1px solid var(--glass-border)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-tech)',
                      outline: 'none'
                    }}
                  >
                    <option value="60Hz">60 Hz (Rede Brasileira)</option>
                    <option value="50Hz">50 Hz (Rede Européia)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="font-tech" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Classe de Tensão Nominal</label>
                  <select
                    value={voltage}
                    onChange={(e) => setVoltage(e.target.value)}
                    style={{
                      background: 'rgba(8, 10, 15, 0.8)',
                      border: '1px solid var(--glass-border)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-tech)',
                      outline: 'none'
                    }}
                  >
                    <option value="13.8 kV">13.8 kV (Média Tensão - Distribuição)</option>
                    <option value="34.5 kV">34.5 kV (Subtransmissão)</option>
                    <option value="220 V">220 V (Baixa Tensão - Trifásico)</option>
                    <option value="380 V">380 V (Baixa Tensão - Industrial)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="font-tech" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Filtro Ativo Harmônico</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => alert('Filtro harmônico ativo ativado. Fator de potência corrigido para cos(φ) >= 0.95')}
                      className="btn-electric"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      ATIVAR
                    </button>
                  </div>
                </div>

                {/* Bloco de Configuração Llama API própria */}
                <div style={{ borderTop: '1px dashed rgba(0, 210, 255, 0.15)', paddingTop: '20px', marginTop: '10px' }}>
                  <h3 className="font-tech text-cyan" style={{ fontSize: '1rem', marginBottom: '14px' }}>CONEXÃO LOCAL DE API LLAMA</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="font-tech" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Ativar Llama Customizado</label>
                      <input
                        type="checkbox"
                        checked={useCustomLlama}
                        onChange={(e) => setUseCustomLlama(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>

                    {useCustomLlama && (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label className="font-tech" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>URL do Servidor API (Ollama / Llama.cpp)</label>
                          <input
                            type="text"
                            value={llamaApiUrl}
                            onChange={(e) => setLlamaApiUrl(e.target.value)}
                            placeholder="http://localhost:11434"
                            style={{
                              background: 'rgba(8, 10, 15, 0.8)',
                              border: '1px solid var(--glass-border)',
                              color: '#fff',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              outline: 'none',
                              fontSize: '0.95rem'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label className="font-tech" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nome do Modelo (Llama)</label>
                          <input
                            type="text"
                            value={llamaModel}
                            onChange={(e) => setLlamaModel(e.target.value)}
                            placeholder="llama3"
                            style={{
                              background: 'rgba(8, 10, 15, 0.8)',
                              border: '1px solid var(--glass-border)',
                              color: '#fff',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              outline: 'none',
                              fontSize: '0.95rem'
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed rgba(0, 210, 255, 0.2)', paddingTop: '20px', marginTop: '10px' }}>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="btn-electric"
                    style={{ width: '100%' }}
                  >
                    SALVAR E VOLTAR AO TERMINAL
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ChatArea
            messages={chats[activeChatId] || []}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};
