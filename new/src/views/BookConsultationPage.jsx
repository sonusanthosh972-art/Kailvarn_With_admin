'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CalendarDays, Lock, Loader2, MessageCircle } from 'lucide-react';
function BookConsultationPage() {
  const [submittedData, setSubmittedData] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isValid,
      isSubmitting
    }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      projectType: 'Residential',
      message: ''
    }
  });
  const messageValue = watch('message') || '';
  const onSubmit = async data => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const existingBookings = JSON.parse(localStorage.getItem('kailvarn_consultations') || '[]');
    localStorage.setItem('kailvarn_consultations', JSON.stringify([...existingBookings, {
      ...data,
      submittedAt: new Date().toISOString()
    }]));
    setSubmittedData(data);
  };
  const scrollVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  return <div className="bg-[#F8F5F0] min-h-screen text-[#1C1C1C]">

      {/* 1. HERO SECTION */}
      <section className="relative h-[220px] md:h-[300px] flex flex-col justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1461963188257-938f39e6f9c2")'
      }} />
        <div className="absolute inset-0 bg-[#0F0F1E]/[0.72]" />
        
        <motion.div initial="hidden" animate="visible" variants={scrollVariants} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center">
          <div className="inline-block bg-[#C9A84C] text-[#1A1A2E] font-nunito font-bold text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Meet Our Experts
          </div>
          
          <h1 className="font-playfair font-extrabold text-[32px] md:text-[52px] text-white leading-tight mb-3 text-shadow-sm">
            Book Your Free Consultation
          </h1>
          <p className="font-nunito text-[16px] md:text-[18px] text-white/85 max-w-2xl mx-auto mb-6">
            Schedule a personalized consultation with our design experts. No obligation, completely free.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {['Free Consultation', 'Expert Advice', 'No Pressure'].map((badge, i) => <div key={i} className="flex items-center gap-1.5 text-white/90 font-nunito text-[13px] md:text-[15px] font-medium">
                <CheckCircle className="w-4 h-4 text-[#C9A84C]" /> {badge}
              </div>)}
          </div>
        </motion.div>
      </section>

      {/* 2. FORM SECTION */}
      <section className="py-[80px] bg-[#F8F5F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={{
          hidden: {
            opacity: 0,
            y: 30
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6
            }
          }
        }}>
            <div className="bg-white rounded-[20px] p-6 md:p-[48px] shadow-card border-t-[4px] border-[#C9A84C]">
              <AnimatePresence mode="wait">
                {!submittedData ? <motion.div key="form" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} exit={{
                opacity: 0
              }}>
                    <div className="text-center mb-10 border-b border-[#E0D8CE]/60 pb-6">
                      <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="w-6 h-6 text-[#C9A84C]" />
                      </div>
                      <h2 className="font-playfair font-bold text-[28px] text-[#1A1A2E] mb-2">Schedule Your Free Consultation</h2>
                      <p className="font-nunito text-[15px] text-[#555]">
                        Select a time that works for you, and we'll confirm your appointment shortly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Full Name *</label>
                          <input type="text" placeholder="e.g. Rahul Patel" {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Min 2 characters"
                        }
                      })} className={`form-input-base ${errors.name ? 'form-input-error' : 'form-input-focus'}`} />
                          {errors.name && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.name.message}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Mobile Number *</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-nunito text-[15px] text-[#555]">
                              +91 |
                            </span>
                            <input type="tel" placeholder="8401226123" {...register("phone", {
                          required: "Phone is required",
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: "Valid 10-digit number required"
                          }
                        })} className={`form-input-base pl-[60px] ${errors.phone ? 'form-input-error' : 'form-input-focus'}`} />
                          </div>
                          {errors.phone && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Email Address</label>
                          <input type="email" placeholder="e.g. name@example.com" {...register("email", {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Valid email required"
                        }
                      })} className={`form-input-base ${errors.email ? 'form-input-error' : 'form-input-focus'}`} />
                          {errors.email && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.email.message}</p>}
                        </div>

                        {/* City */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">City / Locality *</label>
                          <input type="text" placeholder="e.g. Silvassa, Vapi..." {...register("city", {
                        required: "City is required"
                      })} className={`form-input-base ${errors.city ? 'form-input-error' : 'form-input-focus'}`} />
                          {errors.city && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.city.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Service Required */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Service Interested In *</label>
                          <select {...register("service", {
                        required: "Please select a service"
                      })} className={`form-input-base appearance-none ${errors.service ? 'form-input-error' : 'form-input-focus'}`} style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 16px center',
                        backgroundRepeat: 'no-repeat'
                      }}>
                            <option value="">Select a service...</option>
                            <option value="Full Home Interior">Full Home Interior</option>
                            <option value="Kitchen Interior">Kitchen Interior</option>
                            <option value="Custom Furniture">Custom Furniture</option>
                            <option value="Painting & Wall Finishes">Painting & Wall Finishes</option>
                            <option value="Not Sure">Not Sure</option>
                          </select>
                          {errors.service && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.service.message}</p>}
                        </div>

                        {/* Preferred Date/Time */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Preferred Date/Time *</label>
                          <input type="datetime-local" min={new Date().toISOString().slice(0, 16)} {...register("datetime", {
                        required: "Please select a date and time"
                      })} className={`form-input-base ${errors.datetime ? 'form-input-error' : 'form-input-focus'}`} />
                          {errors.datetime && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.datetime.message}</p>}
                        </div>
                      </div>

                      {/* Project Type */}
                      <div>
                        <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[8px]">Project Type *</label>
                        <div className="flex flex-wrap gap-6">
                          {['Residential', 'Commercial'].map(method => <label key={method} className="flex items-center gap-2 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input type="radio" value={method} {...register("projectType")} className="peer appearance-none w-[18px] h-[18px] border-[1.5px] border-[#C9A84C] rounded-full checked:bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/30 transition-all" />
                                <div className="absolute w-2.5 h-2.5 bg-[#C9A84C] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                              </div>
                              <span className="font-nunito text-[15px] text-[#555] group-hover:text-[#1C1C1C] transition-colors">{method}</span>
                            </label>)}
                        </div>
                      </div>

                      {/* Additional Requirements */}
                      <div>
                        <div className="flex justify-between items-end mb-[6px]">
                          <label className="block font-nunito font-semibold text-[13px] text-[#333]">Message or Requirement (Optional)</label>
                          <span className="font-nunito text-[11px] text-[#999]">{messageValue.length}/500</span>
                        </div>
                        <textarea rows={4} placeholder="Tell us about your space, preferred style, or specific questions..." {...register("message", {
                      maxLength: {
                        value: 500,
                        message: "Max 500 characters"
                      }
                    })} className={`form-input-base resize-y ${errors.message ? 'form-input-error' : 'form-input-focus'}`} />
                        {errors.message && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.message.message}</p>}
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button type="submit" disabled={!isValid || isSubmitting} className={`w-full bg-[#C9A84C] text-[#1A1A2E] font-nunito font-bold text-[17px] py-[18px] rounded-[32px] transition-all duration-300 flex items-center justify-center gap-2 ${!isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'btn-shimmer hover:brightness-105 active:scale-[0.98] shadow-md hover:shadow-lg'}`}>
                          {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Booking...</> : '📅 Book My Consultation'}
                        </button>
                        <p className="flex items-center justify-center gap-1.5 mt-4 font-nunito text-[12px] text-[#555]">
                          <Lock className="w-[12px] h-[12px]" /> Your details are safe and confidential.
                        </p>
                      </div>
                    </form>
                  </motion.div> : <motion.div key="success" initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} className="py-12 flex flex-col items-center text-center">
                    <div className="w-[80px] h-[80px] bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                      <CheckCircle className="w-[40px] h-[40px] text-[#25D366]" />
                    </div>
                    <h3 className="font-playfair font-bold text-[28px] text-[#1A1A2E] mb-4">Your Consultation is Booked! 🎉</h3>
                    <p className="font-nunito text-[16px] text-[#555] mb-8 max-w-[400px] leading-relaxed">
                      Thank you, <strong className="text-[#1C1C1C]">{submittedData.name.split(' ')[0]}</strong>. We have received your booking for a <strong className="text-[#1C1C1C]">{submittedData.projectType}</strong> consultation on <strong className="text-[#1C1C1C]">{new Date(submittedData.datetime).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}</strong>.
                    </p>
                    
                    <div className="bg-[#EFEBE4] rounded-xl p-6 w-full text-left mb-8 border border-[#E0D8CE]">
                      <h4 className="font-nunito font-bold text-[15px] text-[#1C1C1C] mb-4 uppercase tracking-wider">What happens next?</h4>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5">1</span> 
                          <span className="font-nunito text-[15px] text-[#555]">Our expert will review your requirement for <strong className="text-[#333]">{submittedData.service}</strong>.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5">2</span> 
                          <span className="font-nunito text-[15px] text-[#555]">We will call you on <strong className="text-[#333]">{submittedData.phone}</strong> to confirm the exact time and location.</span>
                        </li>
                      </ul>
                    </div>

                    <a href={`https://wa.me/918401226123?text=Hi, I just booked a consultation. My name is ${submittedData.name}.`} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-nunito font-bold text-[16px] px-8 py-[16px] rounded-[32px] transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" /> Say Hi on WhatsApp
                    </a>
                  </motion.div>}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>;
}
export default BookConsultationPage;