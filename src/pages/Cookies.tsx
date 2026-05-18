import cookiesContent from '@/legal/cookies.md?raw';
import LegalPage from './LegalPage';

export default function Cookies() {
  return <LegalPage title="Política de Cookies" rawContent={cookiesContent} />;
}
