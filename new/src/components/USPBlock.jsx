'use client';

import React from 'react';
import {
  Users,
  CheckCircle2, 
  DollarSign, 
  Sparkles, 
  UserX, 
  Shield,
  Award,
  Eye,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Users,
  CheckCircle2,
  DollarSign,
  Sparkles,
  UserX,
  Shield,
  Award,
  Eye,
  Tag
};

function USPBlock({ icon, title, description, index = 0 }) {
  const IconComponent = iconMap[icon] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-accent" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default USPBlock;