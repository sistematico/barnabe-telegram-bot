# 🤖 Barnabé Telegram Bot

<!--suppress HtmlDeprecatedAttribute -->
<div align="center">
  <img src="./assets/img/barnabe.jpg" alt="Barnabé" />
</div>

Um "bot" para baixar vídeos a partir de uma URL.

## 📦 Instalação, configuração e testes

- Converse com o [@BotFather](https://t.me/botfather) no Telegram, crie um “bot” e copie o Token
- Adicione seu token no arquivo `.env`

Setar o webhook:

```bash
https://api.telegram.org/bot{TOKEN}/setWebhook?url={URL}
```

Instalar dependências:

```bash
bun install
```

Executar o Bot em desenvolvimento:

```bash
bun dev

Executar o Bot em produção:

```bash
bun prod
```

### Instruções para usar o Telegram Bot API Server

Deslogue da API oficial:

```bash
curl -X POST https://api.telegram.org/bot<SEU_TOKEN>/logOut
```

### 🦾 Comandos

| Comando      | Parâmetros | Descrição | Exemplo | Contexto |
| :--- | :---: | :---: | :---: | ---: |
| `/add_banned_word` | `palavra ou frase` | Adiciona uma palavra ou frase as palavras banidas do grupo | `/add_banned_word api.whatsapp` | Grupo ou SuperGrupo
| `/report` | `Motivo` | Reporta um usuário respondendo a mensagem | `/report SPAM` (responda mensagem do usuário com o comando) | Grupo ou SuperGrupo

### 🏃‍♂️ CI/CD

[![CI](https://github.com/sistematico/barnabe-telegram-bot/actions/workflows/ci.yml/badge.svg)](https://github.com/sistematico/barnabe-telegram-bot/actions/workflows/ci.yml)
[![CD](https://github.com/sistematico/barnabe-telegram-bot/actions/workflows/cd.yml/badge.svg)](https://github.com/sistematico/barnabe-telegram-bot/actions/workflows/cd.yml)

### 👏 Créditos

- [Telegram](https://telegram.org)
- [Ansible](https://www.ansible.com)
- [Grammy](https://grammy.dev)
- [Bun](https://bun.sh)
- [Hono](https://hono.dev)
- [Arch Linux](https://archlinux.org)
- [Fé](https://pt.wikipedia.org/wiki/Fé)

Este projeto foi criado usando o `bun init` no bun v1.0.19.   
[Bun](https://bun.sh) um runtime tudo-em-um JavaScript ultra-rápido.

### 🛟 Ajude

Se o meu trabalho foi útil de qualquer maneira, considere doar qualquer valor através do das seguintes plataformas:

[![LiberaPay](https://img.shields.io/badge/LiberaPay-gray?logo=liberapay&logoColor=white&style=flat-square)](https://liberapay.com/sistematico/donate) [![PagSeguro](https://img.shields.io/badge/PagSeguro-gray?logo=pagseguro&logoColor=white&style=flat-square)](https://pag.ae/bfxkQW) [![ko-fi](https://img.shields.io/badge/ko--fi-gray?logo=ko-fi&logoColor=white&style=flat-square)](https://ko-fi.com/K3K32RES9) [![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-gray?logo=buy-me-a-coffee&logoColor=white&style=flat-square)](https://www.buymeacoffee.com/sistematico) [![Open Collective](https://img.shields.io/badge/Open_Collective-gray?logo=opencollective&logoColor=white&style=flat-square)](https://opencollective.com/sistematico) [![Patreon](https://img.shields.io/badge/Patreon-gray?logo=patreon&logoColor=white&style=flat-square)](https://patreon.com/sistematico)


[![GitHub Sponsors](https://img.shields.io/github/sponsors/sistematico?label=Github%20Sponsors)](https://github.com/sponsors/sistematico)

