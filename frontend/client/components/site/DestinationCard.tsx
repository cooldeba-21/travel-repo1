import React from "react";
import { motion } from "framer-motion";

interface DestinationCardProps {
  image: string;
  title: string;
  duration?: string;
  price?: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  title,
  duration,
  price,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      <img src={image} alt={title} className="h-64 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-lg font-semibold">{title}</h3>
        {duration && price && (
          <div className="mt-1 flex items-center justify-between text-sm font-medium bg-black/40 px-2 py-1 rounded-lg">
            <span>{duration}</span>
            <span>{price}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DestinationCard;
