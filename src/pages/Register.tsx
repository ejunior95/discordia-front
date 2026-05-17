import { motion } from 'framer-motion';
import { RegisterForm } from "@/components/register-form";
import AuthLayout from '@/custom-components/AuthLayout';
import { pageMotion } from '@/utils/pageMotion';

export default function Register() {
    return(
        <AuthLayout>
            <motion.div {...pageMotion}>
                <RegisterForm />
            </motion.div>
        </AuthLayout>
    )
}