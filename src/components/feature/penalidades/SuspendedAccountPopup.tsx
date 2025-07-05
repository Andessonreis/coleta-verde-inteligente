import { motion } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';

interface SuspendedAccountPopupProps {
  unlockDate: Date;
  onClose: () => void;
}

export function SuspendedAccountPopup({ unlockDate, onClose }: SuspendedAccountPopupProps) {
  const formattedDate = unlockDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Formata a hora (hh:mm)
  const formattedTime = unlockDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={24} />
        </button>

        <div className="mx-auto bg-red-100 rounded-full h-20 w-20 flex items-center justify-center border-4 border-red-200">
          <ShieldAlert className="text-red-600" size={48} />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-3">
          Conta Suspensa
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed">
          Seu acesso foi temporariamente bloqueado devido a uma penalidade.
        </p>

        <div className="mt-8 bg-gray-50 rounded-xl p-6 border">
          <p className="text-gray-500 font-medium">Acesso liberado a partir de:</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {formattedDate} às {formattedTime}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
        >
          Entendi
        </button>
      </motion.div>
    </div>
  );
}