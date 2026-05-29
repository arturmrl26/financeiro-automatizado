# 💰 Financeiro Automatizado

Automação de controle financeiro pessoal via WhatsApp + Google Sheets + n8n + Evolution API, rodando 100% em infraestrutura gratuita.

## 📱 Como funciona

```
WhatsApp (grupo familiar)
        ↓
Evolution API (captura mensagens)
        ↓
n8n (interpreta e processa)
        ↓
Google Sheets (armazena os dados)
        ↓
Resposta automática de confirmação no WhatsApp
```

Basta enviar uma mensagem no formato padrão no grupo do WhatsApp e os dados sobem automaticamente para a planilha.

---

## 📋 Formatos de mensagem

```
# Registrar gasto
GASTO | DD/MM/AAAA | Categoria | Previsto | Real | Responsável

# Registrar receita
RECEITA | DD/MM/AAAA | Categoria | Previsto | Real | Responsável

# Atualizar valor real de um lançamento existente
REAL | DD/MM/AAAA | Categoria | Valor | Responsável

# Despesa fixa ou parcelada (ex: 6 parcelas de jun a nov)
GASTO | DD/MM/AAAA | Categoria | Previsto | Real | Responsável | Obs | S | 6 | 11
```

**Exemplos reais:**
```
GASTO | 01/06/2026 | Uber/99 | 30 | 27.50 | Artur
RECEITA | 05/06/2026 | Salário Kamilla | 3000 | 3000 | Kamilla
REAL | 15/06/2026 | Conta de luz | 197 | Ambos
GASTO | 01/06/2026 | Especialização Kamilla | 845 | 845 | Kamilla | | S | 6 | 11
```

---

## 🏗️ Stack

| Componente | Tecnologia | Custo |
|---|---|---|
| Servidor | Oracle Cloud Free Tier (VM.Standard.E2.1.Micro) | Gratuito |
| WhatsApp API | Evolution API v1.7.4 | Gratuito |
| Automação | n8n (self-hosted) | Gratuito |
| Planilha | Google Sheets + Apps Script | Gratuito |
| Containerização | Docker + Docker Compose | Gratuito |

**Custo total: R$ 0,00/mês**

---

## 📊 Planilha

A planilha `Controle_Financeiro_v6.xlsx` (disponível no Google Sheets) contém 4 abas:

- **📂 Categorias** — listas editáveis de entradas, saídas e responsáveis
- **📥 Lançamentos** — fonte única de dados, alimentada automaticamente pelo WhatsApp
- **📊 Resumo Anual** — previsto vs real por mês + projeção de fixas/parcelados
- **📈 Dashboard** — Top 10 gastos, KPIs e detalhamento por categoria

---

## 🚀 Como replicar

### Pré-requisitos
- Conta na [Oracle Cloud](https://cloud.oracle.com) (gratuita)
- Conta Google (para Google Sheets + Apps Script)
- WhatsApp Business ou pessoal

### 1. Servidor Oracle

Crie uma instância VM.Standard.E2.1.Micro com Ubuntu 22.04 (Always Free).

### 2. Instalar Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
newgrp docker
```

### 3. Criar swap (necessário com 1GB RAM)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 4. Subir os serviços

```bash
mkdir ~/financeiro && cd ~/financeiro
# Copie o docker-compose.yml deste repositório
docker compose up -d
```

### 5. Liberar portas (Oracle Security List)

Adicione regras de Ingress para TCP nas portas **8080** e **5678**.

```bash
sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 5678 -j ACCEPT
sudo netfilter-persistent save
```

### 6. Conectar WhatsApp

Acesse `http://SEU_IP:8080/manager`, insira a API key e escaneie o QR Code.

### 7. Google Sheets + Apps Script

1. Importe a planilha para o Google Sheets
2. Vá em **Extensões → Apps Script**
3. Cole o código de `apps-script/codigo.gs`
4. Implante como **App da Web** (acesso: Qualquer pessoa)
5. Copie a URL gerada

### 8. n8n

1. Acesse `http://SEU_IP:5678`
2. Importe o workflow de `n8n/workflow.json`
3. Atualize a URL do Apps Script no nó **HTTP Request**
4. Publique o workflow

---

## 📁 Estrutura do repositório

```
financeiro-automatizado/
├── README.md
├── .gitignore
├── apps-script/
│   └── codigo.gs          # Código do Google Apps Script
├── n8n/
│   └── workflow.json      # Workflow exportado do n8n
└── servidor/
    └── docker-compose.yml # Configuração dos containers
```

---

## 🗺️ Roadmap

- [x] Servidor configurado (Oracle Cloud)
- [x] Evolution API + WhatsApp conectado
- [x] n8n rodando
- [x] Fluxo de mensagens funcionando
- [x] Integração com Google Sheets
- [ ] Correção do loop de mensagens
- [ ] Confirmação de resposta no WhatsApp
- [ ] Dashboard no Looker Studio
- [ ] Chatbot guiado por perguntas

---

## 👤 Autor

**Artur Araujo** — [@arturmrl26](https://github.com/arturmrl26)

Projeto desenvolvido como prática de CS — automação pessoal com infraestrutura cloud, APIs e integração de sistemas.
