import { motion } from 'framer-motion';

export function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#0b0d0c]">
      <div className="text-center">
        <div className="flex justify-center items-center -space-x-3">
          <motion.span
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-emerald-400"
            animate={{ scale: [1, 1.3, 1], rotateY: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            E
          </motion.span>
          <motion.span
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-green-300"
            animate={{ scale: [1, 1.3, 1], rotateY: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            D
          </motion.span>
          <motion.span
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-emerald-500"
            animate={{ scale: [1, 1.3, 1], rotateY: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            M
          </motion.span>
        </div>
        <motion.p
          className="text-gray-500 dark:text-gray-400 text-sm mt-8 tracking-widest font-medium uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Cargando...
        </motion.p>
      </div>
    </div>
  );
}
