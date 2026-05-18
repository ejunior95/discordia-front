/**
 * Configuração central dos documentos legais (Termos, Privacidade, Cookies).
 *
 * Sempre que houver alteração relevante de conteúdo dos `.md` em `src/legal/`,
 * incremente `TERMS_VERSION` e atualize `LAST_UPDATED`. Isso fará o backend
 * exigir novo aceite (campo `terms_accepted_version` no usuário).
 */

export const LEGAL_CONFIG = {
  OWNER_NAME: 'Junior Eufrásio',
  CONTACT_EMAIL: 'contato@discordia.app',
  TERMS_VERSION: '1.0',
  LAST_UPDATED: '18 de maio de 2026',
  JURISDICTION: 'Brasil',
} as const;

export type LegalPlaceholder = keyof typeof LEGAL_CONFIG;

export function applyLegalPlaceholders(markdown: string): string {
  let out = markdown;
  for (const [key, value] of Object.entries(LEGAL_CONFIG)) {
    out = out.split(`{{${key}}}`).join(value);
  }
  return out;
}
