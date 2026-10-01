import { Suspense } from 'react';
import LoginForm from './LoginForm.jsx';

export default function AdminLoginPage() {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#070A25] px-4 py-12">
      {/* Architectural drawing lines: roof pitch from the logo + a dimension line */}
      <svg className="absolute inset-0 -z-10 h-full w-full" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1440 900">
        <g fill="none" stroke="#F2B21B" strokeWidth="1">
          <path d="M0 640 L720 180 L1440 640" strokeOpacity="0.12" />
          <path d="M120 640 L720 256 L1320 640" strokeOpacity="0.07" />
          <path d="M160 780 H1280" strokeOpacity="0.14" />
          <path d="M160 770 V790 M1280 770 V790" strokeOpacity="0.22" />
        </g>
        <g stroke="#ffffff" strokeOpacity="0.04">
          {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${120 * i} 0 V900`} />)}
        </g>
      </svg>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
