'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormValidation } from '@/hooks/useFormValidation.js';
import { useWhatsAppLink } from '@/hooks/useWhatsAppLink.js';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { openWhatsApp } = useWhatsAppLink();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  } = useFormValidation({
    name: '',
    phone: '',
    email: '',
    city: '',
    service: '',
    message: ''
  });

  const handleServiceChange = (value) => {
    setValues(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem('kailvarn_contact_form', JSON.stringify({
        ...values,
        timestamp: new Date().toISOString()
      }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      toast.success('Message sent successfully');
      resetForm();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">Thank You!</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          We have received your message and will get back to you shortly.
        </p>
        <Button
          onClick={() => openWhatsApp()}
          className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat on WhatsApp
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsSubmitted(false)}
          className="ml-3"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-lg border border-border space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your full name"
          className="text-foreground"
        />
        {touched.name && errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="10-digit mobile number"
          className="text-foreground"
        />
        {touched.phone && errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="your.email@example.com"
          className="text-foreground"
        />
        {touched.email && errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City *</Label>
        <Input
          id="city"
          name="city"
          value={values.city}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your city"
          className="text-foreground"
        />
        {touched.city && errors.city && (
          <p className="text-sm text-destructive">{errors.city}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service Interested In *</Label>
        <Select value={values.service} onValueChange={handleServiceChange}>
          <SelectTrigger id="service" className="text-foreground">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-home">Full Home Interior</SelectItem>
            <SelectItem value="kitchen">Modular Kitchen</SelectItem>
            <SelectItem value="furniture">Custom Furniture</SelectItem>
            <SelectItem value="painting">Professional Painting</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {touched.service && errors.service && (
          <p className="text-sm text-destructive">{errors.service}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tell us about your requirements..."
          rows={5}
          className="text-foreground resize-none"
        />
        {touched.message && errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}

export default ContactForm;