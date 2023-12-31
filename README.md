# 🤖 Barnabé Telegram BOT

<!--suppress HtmlDeprecatedAttribute -->
<div align="center">
    <img src="./assets/macunaima2.jpg" alt="Macunaíma" />
</div>

Um "bot" para baixar vídeos de diversos sites usando o [Telegram](https://telegram.org).

## 🏃‍♂️ CI/CD

[![CI](https://github.com/sistematico/barnabe-telegram-bot/actions/workflows/ci.yml/badge.svg)](https://github.com/sistematico/barnabe-telegram-bot/actions/workflows/ci.yml)
[![CD](https://github.com/sistematico/barnabe-telegram-bot/actions/workflows/cd.yml/badge.svg)](https://github.com/sistematico/barnabe-telegram-bot/actions/workflows/cd.yml)

## 📦 Instalação, configuração e testes

*Este bot foi testado no [Arch Linux](https://archlinux.org)(em desenvolvimento) e [Rocky Linux](https://rockylinux.org)(em produção)*

### Para instalar as dependências:

```bash
bun install
```

### Rodar em modo desenvolvimento:

```bash
bun --watch run src/bot.ts
```
ou

```bash
bun dev
```

### Rodar em modo produção:

```bash
bun run src/bot.ts
```
ou

```bash
bun prod
```

### Unit Systemd do Bot

```
[Unit]
Description=Barnabé Telegram BOT
After=network.target

[Service]
User=rocky
WorkingDirectory=/home/rocky/barnabe
ExecStart=/home/rocky/.bun/bin/bun run prod
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target 
```

### Telegram Bot API

Este bot necessita de um uma API própria para o Telegram, pois os limites são mais altos.

- [Using a Local Bot API Server](https://core.telegram.org/bots/api#using-a-local-bot-api-server)
- [https://github.com/tdlib/telegram-bot-api](https://github.com/tdlib/telegram-bot-api)

#### Unit Systemd do Telegram Bot API

```
[Unit]
Description=Telegram Bot API Server
After=network.target

[Service]
Type=simple
# Visite: https://my.telegram.org para gerar api_id e api_hash
ExecStart=/usr/local/bin/telegram-bot-api --local --api-id="SEU_API_ID" --api-hash="SEU_API_HASH" 
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
```

### WebApp

Configuração do Nginx:

```
server {
    listen 80;
    listen [::]:80;
    server_name barna.paxa.dev;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate         /etc/letsencrypt/live/barna.paxa.dev/fullchain.pem;
    ssl_certificate_key     /etc/letsencrypt/live/barna.paxa.dev/privkey.pem;

    server_name barna.paxa.dev;
    root /home/rocky/barnabe/webapp;

    location /webapp {}

    location / { 
      proxy_pass http://127.0.0.1:3008;
      proxy_http_version 1.1;  
      proxy_set_header Upgrade $http_upgrade;  
      proxy_set_header Connection 'upgrade';  
      proxy_set_header Host $host;  
      proxy_cache_bypass $http_upgrade;  
    } 
}
```

> Saiba mais em: [Telegram Webapps](https://core.telegram.org/bots/webapps)

## 💡 Dicas

Antes de usar o Bot é necessário apagar o WebHook(Caso você tenha usado ele anteriormente), este bot usa exclusivamente o modo long-polling.

https://api.telegram.org/bot[SEU_TOKEN]/deleteWebhook

## 👏 Créditos

- [Grammy](https://grammy.dev)
- [Bun](https://bun.sh)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [yt-dlp-wrap](https://github.com/foxesdocode/yt-dlp-wrap)
- [Arch Linux](https://archlinux.org)
- [Fé](https://pt.wikipedia.org/wiki/Fé)

## 🛟 Ajude

Se o meu trabalho foi útil de qualquer maneira, considere doar qualquer valor através do das seguintes plataformas:

[![LiberaPay](https://img.shields.io/badge/LiberaPay-gray?logo=liberapay&logoColor=white&style=flat-square)](https://liberapay.com/sistematico/donate) [![PagSeguro](https://img.shields.io/badge/PagSeguro-gray?logo=pagseguro&logoColor=white&style=flat-square)](https://pag.ae/bfxkQW) [![ko-fi](https://img.shields.io/badge/ko--fi-gray?logo=ko-fi&logoColor=white&style=flat-square)](https://ko-fi.com/K3K32RES9) [![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-gray?logo=buy-me-a-coffee&logoColor=white&style=flat-square)](https://www.buymeacoffee.com/sistematico) [![Open Collective](https://img.shields.io/badge/Open_Collective-gray?logo=opencollective&logoColor=white&style=flat-square)](https://opencollective.com/sistematico) [![Patreon](https://img.shields.io/badge/Patreon-gray?logo=patreon&logoColor=white&style=flat-square)](https://patreon.com/sistematico)


[![GitHub Sponsors](https://img.shields.io/github/sponsors/sistematico?label=Github%20Sponsors)](https://github.com/sponsors/sistematico)

Este projeto foi criado usando o comando `bun init` no bun v1.0.20. [Bun](https://bun.sh) é um runtime JavaScript rápido e completo.
