import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function NotFound() {
    const { user } = useAuth();

    return (
        <div className="flex h-[90dvh] lg:h-[80dvh] items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-md border p-8 rounded-2xl shadow-xl"
          >
            <motion.h1
              className="text-7xl font-extrabold text-red-600"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              404
            </motion.h1>
            <p className="mt-4 text-xl font-semibold">
              Página não encontrada
            </p>
            <p className="mt-2">
              Ops! A rota que você tentou acessar não existe ou foi movida.
            </p>

            <Link
              to={ user ? "/home" : "/" }
              className="flex w-full justify-center items-center gap-2 mt-6 px-5 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Voltar para o início
            </Link>
          </motion.div>
        </div>
    );
}
