import React, { useState, useRef, useEffect } from 'react';
import { Calendar, TrendingUp, Edit2, Plus, Trash2, X, Download, FileText, Move, Star } from 'lucide-react';

export default function ArenaProjectDashboard() {
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newTask, setNewTask] = useState({ nome: '', posicaoInicio: 0, largura: 12.5 });
  const [draggingTask, setDraggingTask] = useState(null);
  const [resizingTask, setResizingTask] = useState(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartPos, setDragStartPos] = useState(0);
  const [editingPercentual, setEditingPercentual] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSalvar, setMensagemSalvar] = useState('');
  const containerRef = useRef(null);

  // Logo Arena BRB em Base64
  const logoBase64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iOTcuNzExIiBoZWlnaHQ9IjQzLjA1IiB2aWV3Qm94PSIwIDAgOTcuNzExIDQzLjA1Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iYSI+CiAgICAgIDxyZWN0IHdpZHRoPSI5Ny43MTEiIGhlaWdodD0iNDMuMDUiIGZpbGw9Im5vbmUiPjwvcmVjdD4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGNsaXAtcGF0aD0idXJsKCNhKSI+CiAgICA8cGF0aCBkPSJNMTMuNDY5LDU2LjUyNGwtLjQxNywyLjY2MmEyOS4zMTcsMjkuMzE3LDAsMCwxLDE1LjIzLDguMzYybDYuMDgxLTMuOTkzcy43LS40NzMsMS4wMjgtLjA3N2MwLDAsLjMxOS4zMDgtLjI5Mi45NjdsLTQuOTk0LDUuMTc5YTI5LjE5MSwyOS4xOTEsMCwwLDEsNi4zMTgsMTUuNzI0aDIuODQ2bDQuNTA5LTI4LjgyNloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05Ljc2OCAtNDIuMykiIGZpbGw9IiNmZmYiPjwvcGF0aD4KICAgIDxwYXRoIGQ9Ik0xNDkuMTA2LDY4LjMwOEgxNDUuNDhsMS4xODktNy40OTJoNC4xYzIuMzYyLDAsMi43Ny4yMTcsMy4xMzQuNzEyYTIuNjQzLDIuNjQzLDAsMCwxLC40NDUsMS42NjMsNC45LDQuOSwwLDAsMS01LjI0MSw1LjExN20yLjQ3MSwxMS44ODJjLTEuMDMuNzA4LTEuNzA3LjkxNC00LjIxNS45MTRoLTMuODhsMS4yOC04LjI4MWg0LjA5NWMzLjk1OSwwLDQuNDkzLDEuNzQ4LDQuNDkzLDMuNDU2YTQuNiw0LjYsMCwwLDEtMS43NzMsMy45MTFtMy4zODYtMTBhOC4yNzcsOC4yNzcsMCwwLDAsNC40ODItNy4zMzQsNi4xNzEsNi4xNzEsMCwwLDAtMS43LTQuNDgzYy0xLjI4Mi0xLjMyOC0yLjgzNy0xLjgyNS01LjczMS0xLjgyNWgtOS40ODdsLS4wOTIuNTg5LTMuNywyMy40NzZjLS4yNzIsMS43MTYtLjA0NSw0LjczNywzLjczLDQuNzUxdjBoNi41MTlhOSw5LDAsMCwwLDkuNDIzLTkuMzgxLDYuMTE2LDYuMTE2LDAsMCwwLTMuNDQxLTUuOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwMy43NjQgLTQyLjMyMSkiIGZpbGw9IiNmZmYiPjwvcGF0aD4KICAgIDxwYXRoIGQ9Ik0yMjguODY1LDY5LjM0OGwxLjM1Ni04LjUzMmgzLjg1YzMuNTUzLDAsNC4yLjk1NCw0LjIsMi44MzNhNS40MzYsNS40MzYsMCwwLDEtNS43ODMsNS43Wm02LjkzNywzLjYzNGE5LjQ1Miw5LjQ1MiwwLDAsMCw3LjMxOS05LjMzM2MwLTQuNTc3LTIuODU5LTcuMS04LjA1Mi03LjFoLTguOTkybC0uMDkyLjU5Mi0zLjgsMjQuMzg1Yy0uMTY5LDEuMjQ5LTEuMTEzLDMuODQzLDMuNDE5LDMuODQxbC40MzcsMGguMzE3bC4wOTQtLjU5MiwxLjczNi0xMS4xNjZoMi42MThsNS41NDIsMTEuMzY1LjE5Mi4zOTRoNS40NzZsLS41MDgtMS4wMTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY2LjEzMiAtNDIuMzIxKSIgZmlsbD0iI2ZmZiI+PC9wYXRoPgogICAgPHBhdGggZD0iTTMxNi4xODksNjguMzA4aC0zLjYyN2wxLjE5MS03LjQ5Mmg0LjFjMi4zNjMsMCwyLjc3LjIxNywzLjEzNC43MTJhMi42NDksMi42NDksMCwwLDEsLjQ0NiwxLjY2Myw0LjksNC45LDAsMCwxLTUuMjQyLDUuMTE3bTIuNDcsMTEuODgyYy0xLjAyOC43MDgtMS43MDYuOTE0LTQuMjE0LjkxNGgtMy44NzlsMS4yNzktOC4yODFoNC4wOTRjMy45NjEsMCw0LjQ5NSwxLjc0OCw0LjQ5NSwzLjQ1NmE0LjYsNC42LDAsMCwxLTEuNzc0LDMuOTExbTMuMzg2LTEwYTguMjc2LDguMjc2LDAsMCwwLDQuNDgxLTcuMzM0LDYuMTY3LDYuMTY3LDAsMCwwLTEuNy00LjQ4M2MtMS4yODItMS4zMjktMi44MzgtMS44MjUtNS43MzEtMS44MjVoLTkuNDg5bC0uMDkyLjU5LTMuNjkyLDIzLjQyNGMtLjI0NCwxLjctLjA4OCw0Ljc4NywzLjcyNSw0Ljh2MGg2LjUxNmE5LDksMCwwLDAsOS40MjUtOS4zODEsNi4xMTQsNi4xMTQsMCwwLDAtMy40NDQtNS43OTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjguODE2IC00Mi4zMjEpIiBmaWxsPSIjZmZmIj48L3BhdGg+CiAgICA8cGF0aCBkPSJNOS41MjQsOTQuNjE1bC0uMjc4LS4zMzYsNi41LTcuMzA2QTI2LjA0OSwyNi4wNDksMCwwLDAsMi43NzgsNzkuOTg1TC4xMjcsOTYuOTI4Yy0uNDYyLDMuMTc3LjExNSw1Ljk3OCw1LjQxMSw1Ljk3OEgyMy4zNjZhMjUuOTM5LDI1LjkzOSwwLDAsMC01LjMyNy0xMy4zNTlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC01OS44NTkpIiBmaWxsPSIjZmZmIj48L3BhdGg+CiAgICA8cGF0aCBkPSJNMTYyLjY2MS4wODcsMTU3LjU0LDkuMDY2YS43MjguNzI4LDAsMCwwLC42MzMsMS4wOWguMmwxLjM1Ni0yLjM5MWg0LjEwOWwuMzUsMi4zOTFoMS40MUwxNjQuMTIyLjA4N1ptLjQ3OSwyLjYwNy41NzksMy45MzloLTMuMzkzbDIuMjM2LTMuOTI3Yy4xODEtLjMwOS4zMy0uNi40NzctLjkwOS4wMjYuMy4wNi42LjEuOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNy44MjYgLTAuMDY1KSIgZmlsbD0iI2ZmZiI+PC9wYXRoPgogICAgPHBhdGggZD0iTTM1OS43NTgsOS45NTgsMzU4LjMzMi4yMzRhLjE3My4xNzMsMCwwLDAtLjE3LS4xNDdoLTEuMjEzYS4xNzMuMTczLDAsMCwwLS4xNDkuMDg3bC01LjAyMSw4LjhhLjc4OC43ODgsMCwwLDAsLjY4NCwxLjE3OC4xNzMuMTczLDAsMCwwLC4xNS0uMDg3bDEuMzA2LTIuM2g0LjEwOWwuMzI4LDIuMjQ0YS4xNzMuMTczLDAsMCwwLC4xNy4xNDdoMS4wNjJhLjE3Mi4xNzIsMCwwLDAsLjE3LS4ybS0yLjQzLTcuMjY0LjU3OSwzLjkzOWgtMy4zOTNsMi4yMzYtMy45MjdjLjE4MS0uMzA5LjMzLS42LjQ3Ny0uOTA5LjAyNi4zLjA2LjYuMS45IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjYzLjE4MyAtMC4wNjUpIiBmaWxsPSIjZmZmIj48L3BhdGg+CiAgICA8cGF0aCBkPSJNMjIwLjA3NSwyLjE4NWMwLS44MTYtLjQtMi4xODQtMy4wNzMtMi4xODQtLjk2NSwwLTEuODA5LjAxNS0yLjQ0LjA0NGwtLjA4NywwLTEuOTE2LDkuMDQzYS44NDUuODQ1LDAsMCwwLC44MjcsMS4wMjFoLjMxbC45NjItNC41MzVoLjE1MWwyLjc0MSw0LjUzNWgxLjYzOWwtMi4zNy0zLjc2MS0uMjMyLS4zNjljLS4xLS4xNjYtLjIxMS0uMzM3LS4zMTctLjUsMi4yNS0uMTM0LDMuOC0xLjQ3LDMuOC0zLjNtLTEuMzkzLjE0NmMwLDEuMy0xLjE1NiwyLjE3Ni0yLjg3NiwyLjE3Ni0uMzM3LDAtLjcxMy0uMDEtLjkyNi0uMDJsLjcxMy0zLjMzM2MuMjk0LS4wMjMuNzIxLS4wMzYsMS4yMTktLjAzNiwxLjI1OCwwLDEuODcuNCwxLjg3LDEuMjE0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU5LjA1OSAtMC4wMDEpIiBmaWxsPSIjZmZmIj48L3BhdGg+CiAgICA8cGF0aCBkPSJNMjYwLjQ4LDEuMjE3aDQuMTdsLjIzNy0xLjEzaC01LjUyNGwtMS45MDgsOS4wMDhhLjg3OC44NzgsMCwwLDAsLjg1OSwxLjA2aDQuNDQxTDI2Mi45OTEsOWgtNC4xNjhsLjc1My0zLjQ2M2gzLjk4MWwuMjM3LTEuMTNoLTMuOThaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTkyLjY1OCAtMC4wNjUpIiBmaWxsPSIjZmZmIj48L3BhdGg+CiAgICA8cGF0aCBkPSJNMzA3Ljc2Mi4wODdsLS41ODgsMi43ODdjLS4zNCwxLjYwNi0uNzYsMy44MTMtMS4wMTIsNS4xOTUtLjEyOS0uNTIxLS4yODYtMS4wNjctLjQ2MS0xLjZMMzAzLjc2OC4wODdoLTEuNTc2bC0xLjg4Niw4LjlhLjk2NS45NjUsMCwwLDAsLjk0NCwxLjE2NWguMWwuNjc2LTMuMTA5Yy4yOTUtMS40MzYuNzIyLTMuNjI4Ljk1OC00Ljk0Mi4xMjMuNDgxLjI0Ny45MS40MTIsMS40MzhsMS45NzgsNi42MTNoMS41NjFMMzA5LjA3My4wODdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI0LjcyNSAtMC4wNjUpIiBmaWxsPSIjZmZmIj48L3BhdGg+CiAgPC9nPgo8L3N2Zz4K";

  const meses = [
    { label: 'Set', ano: 2025 }, { label: 'Out', ano: 2025 },
    { label: 'Nov', ano: 2025 }, { label: 'Dez', ano: 2025 }, { label: 'Jan', ano: 2026 },
    { label: 'Fev', ano: 2026 }, { label: 'Mar', ano: 2026 }
  ];

  // Projetos em Execução - Ordenados por cor
  const [projetos, setProjetos] = useState([
    // WiFi - Verde Claro
    { id: 1, nome: "WiFi Staff", cor: "#D1FAE5", tarefas: [] },
    { id: 6, nome: "WiFi - Alta Densidade", cor: "#D1FAE5", tarefas: [] },
    { id: 11, nome: "WiFi - GNN", cor: "#D1FAE5", tarefas: [] },
    
    // CFTV - Verde Água
    { id: 4, nome: "CFTV GNN", cor: "#CCFBF1", tarefas: [] },
    { id: 5, nome: "CFTV - Precinto/Indigo", cor: "#CCFBF1", tarefas: [] },
    
    // Catracas - Azul Claro
    { id: 3, nome: "Catracas Facial/QRCode", cor: "#E0E7FF", tarefas: [] },
    { id: 10, nome: "Catracas - Facial Esfera", cor: "#E0E7FF", tarefas: [] },
    { id: 21, nome: "Catracas - GNN", cor: "#E0E7FF", tarefas: [] },
    
    // SDAI - Azul Médio
    { id: 7, nome: "SDAI Esfera 2.0", cor: "#BFDBFE", tarefas: [] },
    { id: 8, nome: "SDAI Esfera 3.0", cor: "#BFDBFE", tarefas: [] },
    
    // 5G - Laranja
    { id: 2, nome: "Claro 5G", cor: "#FED7AA", tarefas: [] },
    
    // POC - Vermelho Claro
    { id: 9, nome: "POC Xtreme", cor: "#FEE2E2", tarefas: [] },
    
    // Oracle - Rosa
    { id: 12, nome: "Oracle Módulo Projetos", cor: "#FBCFE8", tarefas: [] },
    
    // LINKs - Amarelo
    { id: 22, nome: "LINKs Upgrades", cor: "#FEF3C7", tarefas: [] }
  ]);

  // Pipeline - Ordenados por cor
  const [pipeline, setPipeline] = useState([
    // FIFA - Roxo
    { id: 13, nome: "FIFA - Adequação PTA2", cor: "#E9D5FF", tarefas: [] },
    { id: 14, nome: "FIFA - Rota Fibra PTA2", cor: "#E9D5FF", tarefas: [] },
    { id: 15, nome: "FIFA - Tribuna Imprensa", cor: "#E9D5FF", tarefas: [] },
    { id: 16, nome: "FIFA - TEAP", cor: "#E9D5FF", tarefas: [] },
    
    // 5G - Laranja
    { id: 17, nome: "5G Vivo", cor: "#FED7AA", tarefas: [] },
    
    // SDAI - Azul Médio
    { id: 18, nome: "Gap Análises Sistema Áudio", cor: "#BFDBFE", tarefas: [] },
    { id: 24, nome: "SDAI GNN", cor: "#BFDBFE", tarefas: [] },
    
    // Infraestrutura - Verde Água
    { id: 20, nome: "Cabeamento Estruturado", cor: "#CCFBF1", tarefas: [] },
    { id: 25, nome: "Switch's 2 PAV", cor: "#CCFBF1", tarefas: [] },
    { id: 26, nome: "2 switches core para apartar provedores", cor: "#CCFBF1", tarefas: [] },
    { id: 27, nome: "RACKs GNN transmissão", cor: "#CCFBF1", tarefas: [] },
    { id: 28, nome: "Fibra redundância GNN", cor: "#CCFBF1", tarefas: [] },
    { id: 29, nome: "Fibra Bilheteria GNN", cor: "#CCFBF1", tarefas: [] },
    
    // Outros - Amarelo
    { id: 19, nome: "LED Lightning Catracas", cor: "#FEF3C7", tarefas: [] }
  ]);

  // Carregar dados ao iniciar
  useEffect(() => {
    carregarRoadmap();
  }, []);

  const salvarRoadmap = () => {
    setSalvando(true);
    setMensagemSalvar('');
    
    try {
      const dados = { 
        projetos, 
        pipeline, 
        dataAtualizacao: new Date().toISOString() 
      };
      
      localStorage.setItem('roadmap-arena-brb', JSON.stringify(dados));
      
      if (window.storage && typeof window.storage.set === 'function') {
        window.storage.set('roadmap-arena-brb', JSON.stringify(dados))
          .catch(err => console.log('Erro storage API:', err));
      }
      
      setMensagemSalvar('✅ Salvo com sucesso!');
      setTimeout(() => setMensagemSalvar(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMensagemSalvar('❌ Erro ao salvar.');
    }
    
    setSalvando(false);
  };

  const carregarRoadmap = () => {
    try {
      const dadosLocal = localStorage.getItem('roadmap-arena-brb');
      if (dadosLocal) {
        const dados = JSON.parse(dadosLocal);
        if (dados.projetos) setProjetos(dados.projetos);
        if (dados.pipeline) setPipeline(dados.pipeline);
        return;
      }
      
      if (window.storage && typeof window.storage.get === 'function') {
        window.storage.get('roadmap-arena-brb')
          .then(resultado => {
            if (resultado && resultado.value) {
              const dados = JSON.parse(resultado.value);
              if (dados.projetos) setProjetos(dados.projetos);
              if (dados.pipeline) setPipeline(dados.pipeline);
            }
          })
          .catch(err => console.log('Erro ao carregar:', err));
      }
    } catch (error) {
      console.log('Nenhum dado salvo encontrado');
    }
  };

  const getCorPorPercentual = (percentual) => {
    if (percentual <= 50) {
      const ratio = percentual / 50;
      const g = Math.round(107 + (210 - 107) * ratio);
      const b = Math.round(53 + (63 - 53) * ratio);
      return `rgb(255, ${g}, ${b})`;
    } else {
      const ratio = (percentual - 50) / 50;
      const r = Math.round(255 - (255 - 16) * ratio);
      const g = Math.round(210 - (210 - 185) * ratio);
      const b = Math.round(63 + (129 - 63) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const exportarHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Roadmap Arena BRB - ${new Date().toLocaleDateString('pt-BR')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #EBF4FF 0%, #D6E8FF 100%); padding: 20px; }
    .container { max-width: 1800px; margin: 0 auto; }
    .header { background: white; border-radius: 10px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 20px; }
    .header img { height: 50px; }
    .header-text { flex: 1; }
    .header h1 { font-size: 36px; color: #1F2937; margin-bottom: 10px; }
    .header p { color: #6B7280; font-size: 16px; }
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .stat-value { font-size: 40px; font-weight: bold; color: #0E76E0; }
    .stat-label { color: #6B7280; font-size: 14px; margin-bottom: 10px; }
    .section { background: white; border-radius: 10px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .section-title { font-size: 24px; font-weight: bold; color: #1F2937; margin-bottom: 20px; }
    .roadmap-container { overflow-x: auto; }
    .roadmap { min-width: 1600px; }
    .roadmap-header { display: flex; border-bottom: 2px solid #D1D5DB; padding-bottom: 10px; margin-bottom: 20px; }
    .roadmap-header-label { width: 144px; font-weight: bold; font-size: 14px; color: #374151; }
    .roadmap-header-months { flex: 1; display: flex; }
    .roadmap-month { flex: 1; text-align: center; border-left: 1px solid #D1D5DB; padding: 0 10px; }
    .roadmap-month-name { font-size: 18px; font-weight: bold; color: #1F2937; }
    .roadmap-month-year { font-size: 14px; color: #6B7280; }
    .projeto-row { display: flex; margin-bottom: 15px; }
    .projeto-label { width: 144px; padding: 12px; border-radius: 6px; font-size: 12px; font-weight: bold; display: flex; align-items: center; margin-right: 8px; }
    .projeto-timeline { flex: 1; position: relative; border-left: 1px solid #D1D5DB; min-height: 65px; }
    .month-divider { position: absolute; top: 0; bottom: 0; border-right: 1px solid #E5E7EB; }
    .tarefa { position: absolute; height: 48px; border-radius: 6px; padding: 0 10px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: bold; color: #1F2937; border: 3px solid rgba(0,0,0,0.15); box-shadow: 0 2px 4px rgba(0,0,0,0.1); top: 8px; }
    .tarefa-nome { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tarefa-percent { font-weight: bold; margin-left: 8px; }
    .footer { background: white; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .total-card { background: linear-gradient(135deg, #5b00b8 0%, #0E76E0 100%); color: white; border-radius: 10px; padding: 40px; text-align: center; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .total-card-value { font-size: 60px; font-weight: bold; margin: 10px 0; }
    @media print {
      @page { size: landscape; margin: 1cm; }
      body { padding: 0; background: white; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoBase64}" alt="Arena BRB Logo">
      <div class="header-text">
        <h1>Roadmap Arena BRB</h1>
        <p>Set/2025 - Mar/2026 | Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Projetos em Execução</div>
        <div class="stat-value">${projetos.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pipeline de Projetos</div>
        <div class="stat-value">${pipeline.length}</div>
      </div>
    </div>

    <div class="total-card">
      <div style="font-size: 18px; opacity: 0.9;">Total Geral de Projetos</div>
      <div class="total-card-value">${projetos.length + pipeline.length}</div>
      <div style="font-size: 14px; opacity: 0.8;">${projetos.length} em execução + ${pipeline.length} em pipeline</div>
    </div>

    <div class="section">
      <div class="section-title">📊 Projetos em Execução</div>
      <div class="roadmap-container">
        <div class="roadmap">
          <div class="roadmap-header">
            <div class="roadmap-header-label">PROJETO</div>
            <div class="roadmap-header-months">
              ${meses.map(mes => `
                <div class="roadmap-month">
                  <div class="roadmap-month-name">${mes.label}</div>
                  <div class="roadmap-month-year">${mes.ano}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ${projetos.map(projeto => {
            const { tarefasComLinha } = getTarefasPorColuna(projeto);
            const numLinhas = Math.max(...tarefasComLinha.map(t => t.linha + 1), 1);
            const altura = numLinhas * 50 + 15;
            return `
              <div class="projeto-row">
                <div class="projeto-label" style="background-color: ${projeto.cor}; min-height: ${altura}px;">
                  ${projeto.nome}
                </div>
                <div class="projeto-timeline" style="min-height: ${altura}px;">
                  ${meses.map((_, idx) => `
                    <div class="month-divider" style="left: ${(idx / meses.length) * 100}%; width: ${100 / meses.length}%;"></div>
                  `).join('')}
                  ${tarefasComLinha.map(tarefa => `
                    <div class="tarefa" style="
                      background-color: ${getCorPorPercentual(tarefa.percentualEntrega)};
                      left: ${tarefa.posicaoInicio}%;
                      width: ${tarefa.largura}%;
                      top: ${tarefa.linha * 50 + 8}px;
                    ">
                      <span class="tarefa-nome">${tarefa.nome}</span>
                      <span class="tarefa-percent">${tarefa.percentualEntrega}%</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🚀 Pipeline</div>
      <div class="roadmap-container">
        <div class="roadmap">
          <div class="roadmap-header">
            <div class="roadmap-header-label">PROJETO</div>
            <div class="roadmap-header-months">
              ${meses.map(mes => `
                <div class="roadmap-month">
                  <div class="roadmap-month-name">${mes.label}</div>
                  <div class="roadmap-month-year">${mes.ano}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ${pipeline.map(projeto => {
            const { tarefasComLinha } = getTarefasPorColuna(projeto);
            const numLinhas = Math.max(...tarefasComLinha.map(t => t.linha + 1), 1);
            const altura = numLinhas * 50 + 15;
            return `
              <div class="projeto-row">
                <div class="projeto-label" style="background-color: ${projeto.cor}; min-height: ${altura}px;">
                  ${projeto.nome}
                </div>
                <div class="projeto-timeline" style="min-height: ${altura}px;">
                  ${meses.map((_, idx) => `
                    <div class="month-divider" style="left: ${(idx / meses.length) * 100}%; width: ${100 / meses.length}%;"></div>
                  `).join('')}
                  ${tarefasComLinha.map(tarefa => `
                    <div class="tarefa" style="
                      background-color: ${getCorPorPercentual(tarefa.percentualEntrega)};
                      left: ${tarefa.posicaoInicio}%;
                      width: ${tarefa.largura}%;
                      top: ${tarefa.linha * 50 + 8}px;
                    ">
                      <span class="tarefa-nome">${tarefa.nome}</span>
                      <span class="tarefa-percent">${tarefa.percentualEntrega}%</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>Arena BRB - Roadmap de Projetos</strong></p>
      <p style="margin-top: 10px; color: #6B7280; font-size: 14px;">
        Documento gerado automaticamente • Para imprimir: Ctrl+P ou ⌘+P e selecione formato Paisagem
      </p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roadmap-arena-brb-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setMensagemSalvar('✅ Arquivo HTML exportado! Abra-o e use Ctrl+P para gerar PDF');
    setTimeout(() => setMensagemSalvar(''), 5000);
  };

  const atualizarPercentual = (projetoId, tarefaId, novoPercentual, isProjetoList) => {
    const percentual = Math.max(0, Math.min(100, parseInt(novoPercentual) || 0));
    const updateData = (data, setData) => {
      setData(data.map(p => p.id === projetoId ? {
        ...p,
        tarefas: p.tarefas.map(t => t.id === tarefaId ? { ...t, percentualEntrega: percentual } : t)
      } : p));
    };
    isProjetoList ? updateData(projetos, setProjetos) : updateData(pipeline, setPipeline);
  };

  const getTarefasPorColuna = (projeto) => {
    const tarefasPorColuna = {};
    for (let i = 0; i < meses.length; i++) tarefasPorColuna[i] = [];
    const linhas = [];
    projeto.tarefas.forEach(tarefa => {
      let linhaEncontrada = false;
      for (let i = 0; i < linhas.length; i++) {
        let temSobreposicao = false;
        for (const tarefaExistente of linhas[i]) {
          const inicio1 = tarefa.posicaoInicio;
          const fim1 = tarefa.posicaoInicio + tarefa.largura;
          const inicio2 = tarefaExistente.posicaoInicio;
          const fim2 = tarefaExistente.posicaoInicio + tarefaExistente.largura;
          if (!(fim1 <= inicio2 + 1 || inicio1 >= fim2 - 1)) {
            temSobreposicao = true;
            break;
          }
        }
        if (!temSobreposicao) {
          linhas[i].push({ ...tarefa, linha: i });
          linhaEncontrada = true;
          break;
        }
      }
      if (!linhaEncontrada) {
        linhas.push([{ ...tarefa, linha: linhas.length }]);
      }
    });
    const tarefasComLinha = [];
    linhas.forEach((linha) => {
      linha.forEach(tarefa => {
        tarefasComLinha.push(tarefa);
      });
    });
    tarefasComLinha.forEach(tarefa => {
      const colunaInicio = Math.floor((tarefa.posicaoInicio / 100) * meses.length);
      const colunaFim = Math.ceil(((tarefa.posicaoInicio + tarefa.largura) / 100) * meses.length);
      for (let i = colunaInicio; i < colunaFim && i < meses.length; i++) {
        tarefasPorColuna[i].push(tarefa);
      }
    });
    return { tarefasPorColuna, tarefasComLinha };
  };

  const toggleConcluida = (e, projetoId, tarefaId, isProjetoList) => {
    e.preventDefault();
    e.stopPropagation();
    const updateData = (data, setData) => {
      setData(data.map(p => p.id === projetoId ? {
        ...p,
        tarefas: p.tarefas.map(t => t.id === tarefaId ? { ...t, percentualEntrega: t.percentualEntrega === 100 ? 0 : 100 } : t)
      } : p));
    };
    isProjetoList ? updateData(projetos, setProjetos) : updateData(pipeline, setPipeline);
  };

  const handleMouseDown = (e, tarefa, projetoId, isProjetoList, isResize = false) => {
    e.preventDefault();
    e.stopPropagation();
    if (isResize) {
      setResizingTask({ tarefa, projetoId, isProjetoList });
    } else {
      setDraggingTask({ tarefa, projetoId, isProjetoList });
    }
    setDragStartX(e.clientX);
    setDragStartPos(isResize ? tarefa.largura : tarefa.posicaoInicio);
  };

  const handleMouseMove = (e) => {
    if (draggingTask && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const deltaPercent = ((e.clientX - dragStartX) / rect.width) * 100;
      const novaPosicao = Math.max(0, Math.min(100 - draggingTask.tarefa.largura, dragStartPos + deltaPercent));
      const updateData = (data, setData) => {
        setData(data.map(p => p.id === draggingTask.projetoId ? {
          ...p,
          tarefas: p.tarefas.map(t => t.id === draggingTask.tarefa.id ? { ...t, posicaoInicio: novaPosicao } : t)
        } : p));
      };
      draggingTask.isProjetoList ? updateData(projetos, setProjetos) : updateData(pipeline, setPipeline);
    }
    if (resizingTask && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const deltaPercent = ((e.clientX - dragStartX) / rect.width) * 100;
      const novaLargura = Math.max(5, Math.min(100 - resizingTask.tarefa.posicaoInicio, dragStartPos + deltaPercent));
      const updateData = (data, setData) => {
        setData(data.map(p => p.id === resizingTask.projetoId ? {
          ...p,
          tarefas: p.tarefas.map(t => t.id === resizingTask.tarefa.id ? { ...t, largura: novaLargura } : t)
        } : p));
      };
      resizingTask.isProjetoList ? updateData(projetos, setProjetos) : updateData(pipeline, setPipeline);
    }
  };

  const adicionarTarefa = () => {
    if (!selectedProject || !newTask.nome) return;
    const novaTarefa = { id: Date.now(), nome: newTask.nome, posicaoInicio: newTask.posicaoInicio, largura: newTask.largura, percentualEntrega: 0 };
    const isProjeto = projetos.find(p => p.id === selectedProject.id);
    isProjeto ? setProjetos(projetos.map(p => p.id === selectedProject.id ? { ...p, tarefas: [...p.tarefas, novaTarefa] } : p)) : setPipeline(pipeline.map(p => p.id === selectedProject.id ? { ...p, tarefas: [...p.tarefas, novaTarefa] } : p));
    setNewTask({ nome: '', posicaoInicio: 0, largura: 12.5 });
    setShowTaskModal(false);
  };

  const RoadmapSection = ({ title, data, setData, buttonColor, icon, isProjetoList }) => (
    <div className="bg-white rounded-lg shadow-lg p-6" onMouseMove={handleMouseMove} onMouseUp={() => { setDraggingTask(null); setResizingTask(null); }} onMouseLeave={() => { setDraggingTask(null); setResizingTask(null); }}>
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold text-gray-800">{icon} {title}</h2>
        <button onClick={() => setData([...data, { id: Date.now(), nome: "Novo Projeto", cor: "#FEF3C7", tarefas: [] }])} className={`flex items-center gap-2 ${buttonColor} text-white px-4 py-2 rounded-lg hover:opacity-90`}>
          <Plus size={20} /> Novo
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[1600px]">
          <div className="flex mb-4 border-b-2 border-gray-300 pb-2">
            <div className="w-36 font-bold text-sm">PROJETO</div>
            <div className="flex-1 flex" ref={containerRef}>
              {meses.map((mes, idx) => (
                <div key={idx} className="flex-1 text-center font-semibold text-base border-l px-3">
                  <div className="text-lg">{mes.label}</div>
                  <div className="text-sm text-gray-500">{mes.ano}</div>
                </div>
              ))}
            </div>
          </div>
          {data.map(projeto => {
            const { tarefasPorColuna, tarefasComLinha } = getTarefasPorColuna(projeto);
            const numLinhas = Math.max(...tarefasComLinha.map(t => t.linha + 1), 1);
            const altura = numLinhas * 50 + 15;
            return (
              <div key={projeto.id} className="mb-3">
                <div className="flex items-stretch">
                  <div className="w-36 pr-2 flex items-center justify-between" style={{ backgroundColor: projeto.cor, padding: '12px', borderRadius: '6px', minHeight: `${altura}px` }}>
                    {editingProjectId === projeto.id ? (
                      <input type="text" value={projeto.nome} onChange={(e) => setData(data.map(p => p.id === projeto.id ? { ...p, nome: e.target.value } : p))} onBlur={() => setEditingProjectId(null)} autoFocus className="flex-1 text-xs font-bold bg-white rounded px-2 py-1 mr-1" />
                    ) : (
                      <span className="text-xs font-bold flex-1 leading-tight">{projeto.nome}</span>
                    )}
                    <div className="flex flex-col gap-1 no-print">
                      <button onClick={() => setEditingProjectId(projeto.id)} className="text-gray-600 hover:text-gray-800"><Edit2 size={12} /></button>
                      <button onClick={() => setData(data.filter(p => p.id !== projeto.id))} className="text-red-600 hover:text-red-800"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="flex-1 relative border-l" style={{ minHeight: `${altura}px` }}>
                    {meses.map((mes, idx) => (
                      <div key={idx} className="absolute h-full border-r border-gray-200" style={{ left: `${(idx / meses.length) * 100}%`, width: `${100 / meses.length}%` }} />
                    ))}
                    {tarefasComLinha.map((tarefa) => (
                      <div key={tarefa.id} className="absolute rounded flex items-center justify-between text-xs font-semibold shadow-lg group cursor-move px-2 overflow-hidden" style={{ backgroundColor: getCorPorPercentual(tarefa.percentualEntrega), border: '3px solid rgba(0,0,0,0.15)', left: `${tarefa.posicaoInicio}%`, width: `${tarefa.largura}%`, top: `${tarefa.linha * 50 + 8}px`, height: '48px', zIndex: 1 }} onMouseDown={(e) => handleMouseDown(e, tarefa, projeto.id, isProjetoList, false)}>
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <Move size={14} className="text-gray-600 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                          <span className="truncate flex-1">{tarefa.nome}</span>
                        </div>
                        {editingPercentual?.tarefaId === tarefa.id && editingPercentual?.projetoId === projeto.id ? (
                          <input type="number" min="0" max="100" value={tarefa.percentualEntrega} onChange={(e) => { e.stopPropagation(); atualizarPercentual(projeto.id, tarefa.id, e.target.value, isProjetoList); }} onBlur={() => setEditingPercentual(null)} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} autoFocus className="w-12 h-6 text-center border-2 border-gray-800 rounded text-xs font-bold bg-white z-50" />
                        ) : (
                          <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); setEditingPercentual({ projetoId: projeto.id, tarefaId: tarefa.id }); }} onMouseDown={(e) => e.stopPropagation()} className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-white hover:bg-opacity-50 flex-shrink-0">
                            <span className="font-bold">{tarefa.percentualEntrega}%</span>
                            {tarefa.percentualEntrega === 100 && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                          </div>
                        )}
                        <div className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize bg-gray-400 opacity-0 group-hover:opacity-70 no-print" onMouseDown={(e) => handleMouseDown(e, tarefa, projeto.id, isProjetoList, true)} />
                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 no-print">
                          <button onClick={(e) => toggleConcluida(e, projeto.id, tarefa.id, isProjetoList)} onMouseDown={(e) => e.stopPropagation()} className={`${tarefa.percentualEntrega === 100 ? 'bg-yellow-500' : 'bg-gray-500'} text-white rounded-full p-1 hover:scale-110`}><Star size={12} className={tarefa.percentualEntrega === 100 ? 'fill-white' : ''} /></button>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setData(data.map(p => p.id === projeto.id ? { ...p, tarefas: p.tarefas.filter(t => t.id !== tarefa.id) } : p)); }} onMouseDown={(e) => e.stopPropagation()} className="bg-red-500 text-white rounded-full p-1 hover:scale-110"><X size={12} /></button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => { setSelectedProject(projeto); setShowTaskModal(true); }} className={`absolute right-2 top-2 ${buttonColor} text-white rounded-full p-1 opacity-50 hover:opacity-100 no-print`}><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-6">
      <style>{`
        @media print { 
          .no-print { display: none !important; } 
          @page { size: landscape; margin: 0.5cm; } 
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
      <div className="max-w-[1800px] mx-auto">
        <header className="bg-white rounded-lg shadow-lg p-6 mb-6 no-print flex items-center gap-4">
          <img src={logoBase64} alt="Arena BRB Logo" className="h-12" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Roadmap Arena BRB</h1>
            <p className="text-gray-600">Set/2025 - Mar/2026</p>
          </div>
          {mensagemSalvar && (
            <div className={`p-3 rounded-lg text-center font-bold ${mensagemSalvar.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {mensagemSalvar}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 no-print">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Projetos em Execução</p>
                <p className="text-3xl font-bold" style={{ color: '#0E76E0' }}>{projetos.length}</p>
              </div>
              <TrendingUp size={40} style={{ color: '#0E76E0' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pipeline de Projetos</p>
                <p className="text-3xl font-bold" style={{ color: '#0E76E0' }}>{pipeline.length}</p>
              </div>
              <Calendar size={40} style={{ color: '#0E76E0' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 no-print">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><FileText size={20} style={{ color: '#0E76E0' }} />Projetos em Execução</h2>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {projetos.map((projeto, idx) => (
                  <div key={projeto.id} className="flex items-center gap-2 p-2 rounded text-sm" style={{ backgroundColor: projeto.cor }}>
                    <span className="font-bold text-gray-700">{idx + 1}.</span>
                    <span className="font-semibold text-gray-800 flex-1">{projeto.nome}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><FileText size={20} style={{ color: '#0E76E0' }} />Pipeline de Projetos</h2>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {pipeline.map((projeto, idx) => (
                  <div key={projeto.id} className="flex items-center gap-2 p-2 rounded text-sm" style={{ backgroundColor: projeto.cor }}>
                    <span className="font-bold text-gray-700">{idx + 1}.</span>
                    <span className="font-semibold text-gray-800 flex-1">{projeto.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow-xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, #5b00b8 0%, #0E76E0 100%)' }}>
          <div className="text-white text-center">
            <p className="text-lg font-semibold mb-2">Total Geral de Projetos</p>
            <p className="text-5xl font-bold">{projetos.length + pipeline.length}</p>
            <p className="text-sm mt-2 opacity-90">{projetos.length} em execução + {pipeline.length} em pipeline</p>
          </div>
        </div>

        <div className="space-y-6">
          <RoadmapSection title="Projetos em Execução" data={projetos} setData={setProjetos} buttonColor="bg-[#0E76E0]" icon="📊" isProjetoList={true} />
          <RoadmapSection title="Pipeline" data={pipeline} setData={setPipeline} buttonColor="bg-[#5b00b8]" icon="🚀" isProjetoList={false} />
        </div>

        <footer className="mt-8 text-center bg-white rounded-lg shadow-lg p-4 no-print">
          <p className="font-semibold mb-2">💡 Clique no % para editar progresso | Arraste para mover | Borda direita para redimensionar</p>
          <p className="text-sm text-gray-600 mb-3">✨ <strong>Tarefas lado a lado:</strong> Arraste as tarefas livremente - elas se organizam automaticamente em linhas paralelas!</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(to right, #FF6B35, #FFD23F, #10B981)' }}></div>
            <span className="text-xs font-semibold">0% (Laranja) → 50% (Amarelo) → 100% (Verde)</span>
          </div>
        </footer>

        {/* Botão Flutuante SALVAR */}
        <button 
          onClick={salvarRoadmap}
          disabled={salvando}
          className="fixed bottom-24 right-8 z-50 no-print flex items-center gap-3 text-white px-8 py-5 rounded-full hover:scale-110 transition-all shadow-2xl disabled:opacity-50 font-black text-2xl"
          style={{ backgroundColor: salvando ? '#9CA3AF' : '#10B981' }}>
          {salvando ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
              <span>Salvando...</span>
            </>
          ) : (
            <span>💾 SALVAR</span>
          )}
        </button>

        {/* Botão Exportar HTML */}
        <button 
          onClick={exportarHTML}
          className="fixed bottom-8 right-8 z-50 no-print flex items-center gap-3 text-white px-8 py-5 rounded-full hover:scale-110 transition-all shadow-2xl font-black text-2xl"
          style={{ background: 'linear-gradient(135deg, #5b00b8 0%, #0E76E0 100%)' }}>
          <Download size={32} />
          <span>📥 EXPORTAR</span>
        </button>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Nova Tarefa</h3>
            <input 
              type="text" 
              value={newTask.nome} 
              onChange={(e) => setNewTask({ ...newTask, nome: e.target.value })} 
              className="w-full border rounded px-3 py-2 mb-4" 
              placeholder="Nome da tarefa"
              onKeyPress={(e) => e.key === 'Enter' && adicionarTarefa()}
            />
            <div className="flex gap-3">
              <button onClick={adicionarTarefa} className="flex-1 text-white px-4 py-2 rounded-lg" style={{ backgroundColor: '#0E76E0' }}>Adicionar</button>
              <button onClick={() => setShowTaskModal(false)} className="flex-1 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
