# Política de Privacidade

**Versão {{TERMS_VERSION}} — atualizada em {{LAST_UPDATED}}**

Esta Política de Privacidade descreve como o **DiscordIA** ("Plataforma") coleta, usa, compartilha e protege dados pessoais, em conformidade com a **Lei Geral de Proteção de Dados Pessoais — LGPD (Lei nº 13.709/2018)**.

## 1. Controlador dos Dados

O tratamento dos dados pessoais é realizado por **{{OWNER_NAME}}** ("Controlador"), pessoa física, operando o DiscordIA como projeto individual no Brasil.

- **Canal de contato (também para fins de LGPD):** {{CONTACT_EMAIL}}
- Em razão do porte individual da operação, o próprio Controlador atua como ponto único de comunicação para titulares e autoridades.

## 2. Dados Pessoais Coletados

### 2.1 Dados de cadastro e perfil
- Nome
- E-mail
- Senha (armazenada exclusivamente em formato *hash* via bcrypt — nunca em texto claro)
- Avatar (opcional)
- Bio e redes sociais (Twitter, GitHub, LinkedIn) — opcionais

### 2.2 Conteúdo gerado pelo uso
- Mensagens trocadas com as IAs no chat e em jogos
- Histórico de partidas, votações e estatísticas
- Arquivos de áudio (TTS) e música gerados, vinculados ao seu identificador de usuário

### 2.3 Dados de pagamento
- Para usuários de planos pagos, processamos pagamentos via **Stripe**.
- **Não armazenamos número completo do cartão.** Mantemos apenas: bandeira, últimos 4 dígitos, nome do titular e validade — todos retornados pelo Stripe via tokenização.
- Identificadores de cliente e assinatura no Stripe (`customerId`, `subscriptionId`, etc.) ficam vinculados ao seu cadastro para fins de cobrança.

### 2.4 Dados técnicos e de uso
- Endereço IP, *user agent* e *timestamps* de acesso (logs operacionais)
- Eventos de uso da Plataforma (créditos consumidos, capacidades acessadas)
- Cookies e armazenamento local conforme **Política de Cookies**

## 3. Bases Legais para o Tratamento (LGPD, art. 7º)

| Finalidade | Base legal |
|------------|------------|
| Criação e gestão da conta, fornecimento do serviço | Execução de contrato |
| Cobrança e gestão de assinatura | Execução de contrato e obrigação legal/fiscal |
| Comunicação transacional (verificação de e-mail, recibos, alertas) | Execução de contrato |
| Prevenção a fraude, abuso e segurança | Legítimo interesse |
| Atendimento a obrigações fiscais e regulatórias | Cumprimento de obrigação legal |
| Cookies não essenciais (caso futuramente existam) | Consentimento |

## 4. Compartilhamento e Sub-Operadores

Para operar o Serviço, o DiscordIA compartilha dados pessoais estritamente necessários com sub-operadores e provedores especializados. **A maioria desses provedores está sediada fora do Brasil**, configurando **transferência internacional de dados** (LGPD, art. 33). Ao usar o Serviço, você reconhece e concorda com essas transferências.

| Sub-operador | Finalidade | Localização | Dados envolvidos |
|--------------|------------|-------------|------------------|
| **AWS S3** | Armazenamento de avatares, áudios e músicas | EUA | Arquivos enviados/gerados, identificador do usuário |
| **MongoDB Atlas** | Banco de dados principal | EUA | Todos os dados de cadastro, histórico e billing |
| **Stripe** | Processamento de pagamentos | EUA | Dados mínimos de pagamento, e-mail, identificador do usuário |
| **Resend** | Envio de e-mails transacionais | EUA | E-mail, nome, conteúdo da mensagem (verificação, boas-vindas) |
| **OpenAI (ChatGPT)** | Respostas da IA | EUA | Prompts do usuário |
| **Google (Gemini)** | Respostas da IA | EUA | Prompts do usuário |
| **DeepSeek** | Respostas da IA | China | Prompts do usuário |
| **xAI (Grok)** | Respostas da IA | EUA | Prompts do usuário |
| **ElevenLabs** | Síntese de voz (TTS) | EUA | Textos enviados para narração |
| **Suno** | Geração de música | EUA | Letras e parâmetros enviados para geração |

**Atenção:** prompts e textos enviados às IAs e ao TTS podem ser usados pelos respectivos provedores conforme **seus próprios termos de uso e privacidade**. **Não envie ao DiscordIA dados pessoais sensíveis** (saúde, biometria, orientação sexual, religião, dados de terceiros sem autorização etc.) que você não queira processar por esses terceiros.

O DiscordIA não vende dados pessoais. Compartilhamentos adicionais só ocorrerão mediante: (i) consentimento expresso, (ii) cumprimento de ordem judicial ou requisição de autoridade competente, ou (iii) sucessão patrimonial do projeto.

## 5. Direitos do Titular (LGPD, art. 18)

Você pode, a qualquer tempo, requisitar:

- **Confirmação** da existência de tratamento de seus dados
- **Acesso** aos dados que tratamos sobre você
- **Correção** de dados incompletos, inexatos ou desatualizados
- **Anonimização, bloqueio ou eliminação** de dados desnecessários ou tratados em desconformidade
- **Portabilidade** dos dados a outro fornecedor (quando aplicável)
- **Eliminação** dos dados tratados com base em consentimento
- **Informação** sobre com quais entidades públicas e privadas compartilhamos seus dados
- **Revogação do consentimento**, quando aplicável

Para exercer qualquer direito, envie e-mail para **{{CONTACT_EMAIL}}**. Buscamos responder em até 15 dias.

## 6. Retenção e Exclusão

- Enquanto sua conta estiver ativa, mantemos seus dados para fornecer o Serviço.
- Ao excluir a conta, aplicamos *soft delete* imediato: marcamos a conta como apagada (`deleted_at`) e cessamos seu uso operacional.
- **Dados relacionados a pagamentos e obrigações fiscais** podem ser retidos pelo prazo legal aplicável (em geral, até 5 anos, conforme a legislação tributária).
- Histórico de chat, áudios e músicas gerados são retidos enquanto a conta estiver ativa. A exclusão completa e definitiva desses artefatos a pedido do titular pode ser solicitada via **{{CONTACT_EMAIL}}**.

## 7. Segurança

Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados, incluindo:

- Senhas com *hash* bcrypt (irreversível)
- Autenticação via JWT em cookie **HTTP-only**, *secure* e *sameSite*
- Comunicação por HTTPS
- Princípio de mínimo privilégio no acesso aos dados
- Tokenização de dados sensíveis de pagamento via Stripe

Nenhum sistema é completamente imune a falhas. Em caso de incidente de segurança relevante, comunicaremos os titulares afetados e a ANPD conforme exigido pela LGPD.

## 8. Cookies

Detalhes sobre cookies e armazenamento local: veja a **Política de Cookies**.

## 9. Menores

O Serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se você é responsável e identificou cadastro indevido, entre em contato para remoção.

## 10. Alterações desta Política

Esta Política pode ser atualizada periodicamente. Mudanças relevantes serão comunicadas por banner na Plataforma e/ou e-mail.

## 11. Contato e Encarregado (DPO)

Em razão do porte da operação, o próprio Controlador atua como ponto de contato para fins de LGPD:

**{{OWNER_NAME}}** — {{CONTACT_EMAIL}}
