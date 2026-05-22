# Política de Cookies

**Versão {{TERMS_VERSION}} — atualizada em {{LAST_UPDATED}}**

Esta Política explica como o **DiscordIA** utiliza *cookies* e armazenamento local no seu navegador. Faz parte da nossa **Política de Privacidade** e está em conformidade com a **LGPD** e as orientações da ANPD.

## 1. O que são cookies?

*Cookies* são pequenos arquivos gravados pelo navegador a pedido de um site, usados para reconhecer você entre páginas e sessões. O DiscordIA também utiliza **armazenamento local** (*sessionStorage*) — um mecanismo do navegador semelhante, porém sob controle direto da aplicação web.

## 2. Cookies utilizados pelo DiscordIA

Hoje utilizamos **apenas cookies estritamente necessários** ao funcionamento do Serviço.

| Nome | Tipo | Finalidade | Validade |
|------|------|------------|----------|
| `access_token` | Essencial (autenticação) | Mantém sua sessão autenticada na API (JWT em cookie *HTTP-only*, *Secure*, *SameSite=None*) | 7 dias |

**Não usamos cookies de marketing, analytics, *retargeting*, redes sociais ou rastreamento entre sites.**

## 3. Armazenamento local (*sessionStorage*)

Para preferências e estado de funcionamento, o DiscordIA grava algumas chaves no *sessionStorage* do seu navegador. Esses dados **ficam no seu dispositivo** e não são enviados a servidores externos:

| Chave | Finalidade |
|-------|------------|
| `discordia-theme-select` | Tema visual escolhido (claro/escuro/sistema) |
| `currentIA` | IA selecionada como ativa |
| `ROUNDS_STORAGE_KEY` | Histórico local de rodadas de chat |
| `HANGMAN_STORAGE_KEY` | Estado do jogo da forca |
| `PREFERENCES_STORAGE_KEY` | Preferências da conta |
| `cookieConsent` | Registro de que você visualizou o aviso de cookies |

## 4. Por que não há banner com opt-in granular?

Segundo a LGPD e o entendimento da ANPD, **cookies estritamente necessários** ao funcionamento do serviço **não dependem de consentimento prévio** do titular — bastando a informação clara sobre seu uso (princípio da transparência).

Como hoje o DiscordIA usa **somente cookies essenciais**, exibimos apenas um aviso informativo. Caso, no futuro, passemos a utilizar cookies de analytics ou marketing, o banner será atualizado para oferecer escolha granular antes do uso.

## 5. Como gerenciar e remover

Você pode, a qualquer momento:

- Limpar os cookies e o *sessionStorage* nas configurações do seu navegador;
- Acessar em modo privado/anônimo, que não persiste cookies entre sessões.

Atenção: a remoção do cookie `access_token` resulta em **logout automático**. A remoção do *sessionStorage* apaga preferências e estado local de jogos.

## 6. Contato

Dúvidas sobre esta Política de Cookies: **{{CONTACT_EMAIL}}**.
