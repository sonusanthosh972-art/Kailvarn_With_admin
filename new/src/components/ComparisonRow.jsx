import React from 'react';
import { Check, X } from 'lucide-react';

function ComparisonRow({ feature, kailvarn, designerOnly, contractorOnly }) {
  return (
    <div className="grid grid-cols-4 gap-4 py-4 border-b border-border last:border-b-0">
      <div className="font-medium">{feature}</div>
      <div className="flex justify-center">
        {kailvarn ? (
          <Check className="w-5 h-5 text-accent" />
        ) : (
          <X className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex justify-center">
        {designerOnly ? (
          <Check className="w-5 h-5 text-accent" />
        ) : (
          <X className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex justify-center">
        {contractorOnly ? (
          <Check className="w-5 h-5 text-accent" />
        ) : (
          <X className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

export default ComparisonRow;