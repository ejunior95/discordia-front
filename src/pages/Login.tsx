import { motion } from 'framer-motion';
import { LoginForm } from "@/components/login-form";
import AuthLayout from '@/custom-components/AuthLayout';
import { pageMotion } from '@/utils/pageMotion';

export default function Login() {
    return(
        <AuthLayout>
            <motion.div {...pageMotion}>
                <LoginForm />
            </motion.div>
        </AuthLayout>
    )
}