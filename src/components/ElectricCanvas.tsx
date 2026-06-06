import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Connection {
  from: Node;
  to: Node;
}

interface Pulse {
  from: Node;
  to: Node;
  progress: number;
  speed: number;
}

export const ElectricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let nodes: Node[] = [];
    let connections: Connection[] = [];
    let pulses: Pulse[] = [];
    const maxNodes = 45;
    const maxDistance = 140;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      pulses = [];
      const width = canvas.width;
      const height = canvas.height;

      // Cria nós aleatórios
      for (let i = 0; i < maxNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
        });
      }

      findConnections();
    };

    const findConnections = () => {
      connections = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            connections.push({
              from: nodes[i],
              to: nodes[j],
            });
          }
        }
      }
    };

    const spawnPulse = () => {
      if (connections.length === 0) return;
      if (pulses.length > 15) return; // Limita quantidade de pulsos ativos

      // Escolhe uma conexão aleatória
      const conn = connections[Math.floor(Math.random() * connections.length)];
      
      // Impede pulso duplicado na mesma linha ao mesmo tempo
      const exists = pulses.some(p => p.from === conn.from && p.to === conn.to);
      if (exists) return;

      pulses.push({
        from: conn.from,
        to: conn.to,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Desenha conexões
      ctx.lineWidth = 0.6;
      for (let i = 0; i < connections.length; i++) {
        const { from, to } = connections[i];
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = (1 - dist / maxDistance) * 0.15;

        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }

      // Desenha nós
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Atualiza posição do nó
        node.x += node.vx;
        node.y += node.vy;

        // Limites da tela
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.fillStyle = 'rgba(0, 210, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Brilho nos nós
        if (Math.random() > 0.99) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00d2ff';
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // Recalcula conexões a cada frame por causa da movimentação dos nós
      findConnections();

      // Desenha pulsos elétricos (partículas energizadas viajando nas conexões)
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          // Remove pulso concluído
          pulses.splice(i, 1);
          continue;
        }

        // Interpolação linear da posição do pulso
        const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
        const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

        // Desenha a descarga elétrica
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00d2ff';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Spawn de pulsos elétricos ocasional
      if (Math.random() > 0.88) {
        spawnPulse();
      }

      animationId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="electric-canvas-backdrop" />;
};
