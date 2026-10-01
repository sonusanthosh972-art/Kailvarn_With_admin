import React from 'react';
import { Star } from 'lucide-react';

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-semibold text-lg">
          {testimonial.image}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.city}</p>
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-3 italic">
        {testimonial.projectType}
      </p>
      <p className="text-sm leading-relaxed flex-1">{testimonial.review}</p>
    </div>
  );
}

export default TestimonialCard;