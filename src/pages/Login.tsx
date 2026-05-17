import { motion } from 'framer-motion';
import { LoginForm } from "@/components/login-form";
import { pageMotion } from '@/utils/pageMotion';

export default function Login() {
    return(
        <motion.div {...pageMotion} className='w-full h-dvh flex-col place-content-center justify-items-center'>
            <LoginForm />
        </motion.div>
    )
}