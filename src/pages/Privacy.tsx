import privacyContent from '@/legal/privacy.md?raw';
import LegalPage from './LegalPage';

export default function Privacy() {
  return <LegalPage title="Política de Privacidade" rawContent={privacyContent} />;
}
