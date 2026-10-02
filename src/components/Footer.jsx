import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Linkedin, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Our Design', path: '/our-design' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Get Free Quote', path: '/get-free-quote' },
  { name: 'Book Consultation', path: '/book-consultation' }
];

const serviceLinks = [
  { name: 'Full Home Interior', hash: '#full-home' },
  { name: 'Kitchen Interior', hash: '#kitchen' },
  { name: 'Custom Furniture', hash: '#furniture' },
  { name: 'Painting & Wall Finishes', hash: '#painting' }
];

const socials = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
];

const headingClass = 'text-[11.5px] font-extrabold uppercase tracking-[0.3em] text-[#F2B21B] mb-6';
const linkClass = 'text-[14.5px] text-white/70 hover:text-[#F2B21B] transition-[color,padding] duration-300 hover:pl-1.5 w-fit';

function Footer() {
  return (
    // Extra bottom padding below 1400px keeps the floating chat + WhatsApp
    // buttons from covering the copyright / policy links.
    <footer className="relative bg-[#070A25] text-white/70 border-t border-[#F2B21B]/20 pt-20 lg:pt-24 pb-[150px] min-[1400px]:pb-0">
      <div className="kv-wrap">
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.25fr] gap-x-8 gap-y-12 lg:gap-14 pb-14 lg:pb-16">
          {/* BRAND */}
          <div className="col-span-2 lg:col-span-1 flex flex-col">
            <Link href="/" className="kv-logo-link flex items-center gap-3.5 w-fit mb-7" aria-label="KailVarn — Interior Design & Execution, home">
              <img src="/brand/kailvarn-mark-192.png" alt="" width={60} height={60} className="h-[60px] w-[60px]" loading="lazy" />
              <img src="/brand/kailvarn-wordmark.png" alt="KailVarn" width={182} height={28} className="h-7 w-auto" loading="lazy" />
            </Link>
            <p className="font-serif text-[21px] leading-snug text-white max-w-[300px] mb-4">
              Complete Interior Design & Execution — From Dream to Reality
            </p>
            <p className="text-[14px] leading-relaxed text-white/55 max-w-[300px] mb-7">
              Serving Silvassa, Vapi & nearby 50km with expert interior solutions.
            </p>
            <div className="flex gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/75 hover:border-[#F2B21B] hover:text-[#F2B21B] transition-colors duration-300"
                >
                  <social.icon className="w-4 h-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className={`font-sans ${headingClass}`}>Quick Links</h4>
            <nav className="flex flex-col gap-3" aria-label="Footer">
              {quickLinks.map((link) => (
                <Link key={link.path} href={link.path} className={linkClass}>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* OUR SERVICES */}
          <div>
            <h4 className={`font-sans ${headingClass}`}>Our Services</h4>
            <nav className="flex flex-col gap-3" aria-label="Services">
              {serviceLinks.map((service) => (
                <Link key={service.hash} href={`/services${service.hash}`} className={linkClass}>
                  {service.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className={`font-sans ${headingClass}`}>Contact Us</h4>
            <ul className="flex flex-col gap-4 text-[14.5px]">
              <li>
                <a href="tel:+918460150027" className="flex items-start gap-3 hover:text-[#F2B21B] transition-colors">
                  <Phone className="w-[17px] h-[17px] mt-1 shrink-0 text-[#F2B21B]" strokeWidth={1.75} />
                  <span className="font-bold text-white">8460150027</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/918460150027" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-[#F2B21B] transition-colors">
                  <MessageCircle className="w-[17px] h-[17px] mt-1 shrink-0 text-[#F2B21B]" strokeWidth={1.75} />
                  <span>WhatsApp 8460150027</span>
                </a>
              </li>
              <li>
                <a href="mailto:kailvarn0@gmail.com" className="flex items-start gap-3 hover:text-[#F2B21B] transition-colors break-all">
                  <Mail className="w-[17px] h-[17px] mt-1 shrink-0 text-[#F2B21B]" strokeWidth={1.75} />
                  <span>kailvarn0@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-[17px] h-[17px] mt-1 shrink-0 text-[#F2B21B]" strokeWidth={1.75} />
                <span>Silvassa, Vapi & nearby 50km</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-white/50">
          <p className="text-center md:text-left">© {new Date().getFullYear()} KailVarn. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
