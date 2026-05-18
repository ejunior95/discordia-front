import termsContent from '@/legal/terms.md?raw';
import LegalPage from './LegalPage';

export default function Terms() {
  return <LegalPage title="Termos de Uso" rawContent={termsContent} />;
}
