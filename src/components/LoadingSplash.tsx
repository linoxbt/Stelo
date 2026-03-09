import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

export function LoadingSplash() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <motion.img
        src={logo}
        alt="ArcLend"
        className="h-16 w-16 mb-6"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: [0.7, 1.1, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.h1
        className="text-2xl font-bold text-foreground mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        ArcLend
      </motion.h1>
      <motion.div
        className="flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
