import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet"
import { Construction } from "lucide-react"

export default function PageCreating() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <Helmet>
        <title>Site em Construção</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="max-w-md w-full rounded-2xl shadow-xl bg-gray-950 border-gray-800">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ rotate: -15 }}
              animate={{ rotate: [ -15, 15, -15 ] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-4 w-30 h-30 text-yellow-400"
            >
              <Construction className="w-full h-full" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Estamos trabalhando!</h1>
            <p className="text-gray-400 mb-6">
              Nosso site está em construção. <br/> Em breve estaremos prontos para te surpreender.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
