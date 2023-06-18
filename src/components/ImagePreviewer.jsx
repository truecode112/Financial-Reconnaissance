import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function ImagePreviewer({ imageSrc, close }) {

    return (
        <div className="absolute top-0 left-0 bg-gray-500 bg-opacity-50 h-screen w-screen grid place-items-center" style={{ zIndex: 222, margin: 0 }}>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`bg-white w-full max-w-xl overflow-hidden border-gray-200 rounded-lg shadow-2xl py-4 px-5 space-y-4`}
            >
                <div className="flex justify-end">
                    <span className="border border-gray-400 w-8 h-8 grid place-items-center rounded-full cursor-pointer" onClick={close}>
                        <FiX className="text-gray-600 w-5 h-5" />
                    </span>
                </div>
                <div className="rounded-md overflow-hidden" style={{ maxHeight: 500 }}>
                    <img src={imageSrc} alt="ATM footage capture" className="object-cover w-full" />
                </div>
            </motion.div>
        </div>
    );
}