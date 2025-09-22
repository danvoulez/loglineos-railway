# LogLineOS Railway Deployment
FROM ubuntu:22.04

# Evitar prompts interativos durante instalação
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Atualizar sistema e instalar dependências
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    sqlite3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
WORKDIR /app

# Copiar binário LogLine (vamos baixar uma versão compatível ou compilar)
# Por enquanto, vamos usar um placeholder para o binário
RUN mkdir -p /usr/local/bin

# Copiar arquivos de configuração e scripts
COPY package.json package-lock.json* ./
COPY requirements.txt* ./

# Instalar dependências Python se existirem
RUN if [ -f requirements.txt ]; then pip3 install --no-cache-dir -r requirements.txt; fi

# Instalar dependências Node.js se existirem
RUN if [ -f package.json ]; then npm install; fi

# Copiar código da aplicação
COPY . .

# Criar diretório para dados do LogLineOS
RUN mkdir -p /app/data /app/contracts /app/logs

# Expor porta principal (Railway usa PORT)
EXPOSE 3000

# Tornar scripts executáveis
RUN chmod +x /app/start.sh /app/scripts/*.sh

# Comando padrão
CMD ["/app/start.sh"]