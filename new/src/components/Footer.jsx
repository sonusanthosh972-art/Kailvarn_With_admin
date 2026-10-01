import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Linkedin, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#1A1A2E] pt-[64px] pb-[32px]">
      <div className="container-custom">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-12">
          
          {/* COLUMN 1 - BRAND */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center w-fit">
              <img 
                src="https://horizons-cdn.hostinger.com/3b485576-58ad-41b1-b91b-090dfa21215d/27ee2cb2a06dc392bb7be7e76a869f81.png" 
                alt="KailVarn - Interior Design & Execution"
                className="h-12 lg:h-14 w-auto object-contain"
                loading="lazy"
              />
            </Link>
            <p className="font-nunito font-normal text-[14px] text-white/60 leading-snug">
              Complete Interior Design & Execution — From Dream to Reality
            </p>
            <p className="font-nunito font-normal text-[13px] text-white/50 leading-relaxed mb-2">
              Serving Silvassa, Vapi & nearby 50km with expert interior solutions.
            </p>
            <div className="flex gap-3 mt-1">
              {[
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Facebook, href: "https://facebook.com" },
                { icon: Linkedin, href: "https://linkedin.com" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[36px] h-[36px] bg-white/10 rounded-md flex items-center justify-center text-white hover:bg-[#C9A84C] hover:text-[#1A1A2E] transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2 - QUICK LINKS */}
          <div className="flex flex-col gap-4">
            <h4 className="font-nunito font-semibold text-[13px] text-[#C9A84C] tracking-[1.5px] uppercase">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-[10px]">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Our Design', path: '/our-design' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Get Free Quote', path: '/get-free-quote' },
                { name: 'Book Consultation', path: '/book-consultation' }
              ].map((link, i) => (
                <Link 
                  key={i} 
                  href={link.path}
                  className="font-nunito text-[13.5px] text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* COLUMN 3 - OUR SERVICES */}
          <div className="flex flex-col gap-4">
            <h4 className="font-nunito font-semibold text-[13px] text-[#C9A84C] tracking-[1.5px] uppercase">
              Our Services
            </h4>
            <nav className="flex flex-col gap-[10px]">
              {[
                { name: 'Full Home Interior', hash: '#full-home' },
                { name: 'Kitchen Interior', hash: '#kitchen' },
                { name: 'Custom Furniture', hash: '#furniture' },
                { name: 'Painting & Wall Finishes', hash: '#painting' }
              ].map((service, i) => (
                <Link 
                  key={i} 
                  href={`/services${service.hash}`}
                  className="font-nunito text-[13.5px] text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block w-fit"
                >
                  {service.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* COLUMN 4 - CONTACT & INFO */}
          <div className="flex flex-col gap-4">
            <h4 className="font-nunito font-semibold text-[13px] text-[#C9A84C] tracking-[1.5px] uppercase">
              Contact Us
            </h4>
            <div className="flex flex-col gap-[12px]">
              <a href="tel:+918401226123" className="flex items-center gap-2 font-nunito text-[13.5px] text-white/75 hover:text-white transition-colors group">
                <Phone className="w-4 h-4 text-[#C9A84C] group-hover:scale-110 transition-transform" />
                8401226123
              </a>
              <a href="https://wa.me/918401226123" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-nunito text-[13.5px] text-white/75 hover:text-white transition-colors group">
                <MessageCircle className="w-4 h-4 text-[#C9A84C] group-hover:scale-110 transition-transform" />
                WhatsApp 8401226123
              </a>
              <a href="mailto:kailvarn0@gmail.com" className="flex items-center gap-2 font-nunito text-[13.5px] text-white/75 hover:text-white transition-colors group">
                <Mail className="w-4 h-4 text-[#C9A84C] group-hover:scale-110 transition-transform" />
                kailvarn0@gmail.com
              </a>
              <p className="flex items-start gap-2 font-nunito text-[13.5px] text-white/75 mt-1">
                <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                Silvassa, Vapi & nearby 50km
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 pt-[20px] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-nunito text-[12px] text-white/45 text-center md:text-left">
            © {new Date().getFullYear()} KailVarn. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="font-nunito text-[12px] text-white/45 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="font-nunito text-[12px] text-white/45 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;