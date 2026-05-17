import { motion } from 'framer-motion';
import { RegisterForm } from "@/components/register-form";
import { pageMotion } from '@/utils/pageMotion';

export default function Login() {
    return(
        <motion.div {...pageMotion} className='w-full h-dvh flex-col place-content-center justify-items-center'>
            <RegisterForm />
        </motion.div>
    )
}