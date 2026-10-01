'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ComparisonRow from './ComparisonRow.jsx';
import { comparisonData } from '@/constants/data.js';

function ComparisonTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border"
    >
      <div className="grid grid-cols-4 gap-4 p-6 bg-muted/50 border-b border-border">
        <div className="font-semibold text-lg">Feature</div>
        <div className="font-semibold text-lg text-center text-accent">KailVarn</div>
        <div className="font-semibold text-lg text-center">Designer Only</div>
        <div className="font-semibold text-lg text-center">Contractor Only</div>
      </div>
      <div className="p-6">
        {comparisonData.rows.map((row, index) => (
          <ComparisonRow
            key={index}
            feature={row.feature}
            kailvarn={row.kailvarn}
            designerOnly={row.designerOnly}
            contractorOnly={row.contractorOnly}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default ComparisonTable;