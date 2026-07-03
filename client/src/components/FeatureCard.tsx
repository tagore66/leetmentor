import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 backdrop-blur-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">
        {title}
      </h2>

      <p className="text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}