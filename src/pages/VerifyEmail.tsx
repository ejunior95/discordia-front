import { motion } from 'framer-motion';
import AuthLayout from '@/custom-components/AuthLayout';
import { VerifyEmailForm } from '@/components/verify-email-form';
import { pageMotion } from '@/utils/pageMotion';

export default function VerifyEmail() {
  return (
    <AuthLayout>
      <motion.div {...pageMotion}>
        <VerifyEmailForm />
      </motion.div>
    </AuthLayout>
  );
}
