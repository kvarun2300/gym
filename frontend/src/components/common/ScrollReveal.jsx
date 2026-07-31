import React from 'react';
import { motion } from 'framer-motion';

/**
 * Wraps children in a fade-up reveal that triggers once when scrolled into view.
 * delay: stagger offset in seconds
 */
const ScrollReveal = ({ children, delay = 0, className = '', y = 28 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
