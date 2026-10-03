// The Contact page FAQs, published to search engines as FAQ structured data
// (app/(site)/contact/page.jsx). Keep in sync with the list in
// src/views/ContactUsPage.jsx -- Google expects both to match.
export const FAQS = [{
  q: "What is the difference between KailVarn and a normal interior designer?",
  a: "A normal interior designer only gives you design, 3D renders, and drawings — you then have to find and manage your own contractors for execution. KailVarn provides FREE design + full execution under one expert team. You don't need to deal with contractors at all. Design, carpentry, civil, painting, electrical — everything is done by us."
}, {
  q: "Is the interior designer really free? What's the catch?",
  a: "Yes, completely free. Our interior designer is a full-time member of our team — their cost is included in the project cost. There is no separate 'designer fee.' We believe design is a service we provide, not a separate business. You benefit from professional design without paying anything extra."
}, {
  q: "How do you ensure the final result looks like the design?",
  a: "We use modern tools, trained craftsmen, and a dedicated project manager who checks every stage against the design. Before starting, we get your approval on the 3D design, materials, and finishes. During execution, the same team that designed oversees the work — which is why there's no mismatch."
}, {
  q: "What areas do you serve?",
  a: "We currently serve Silvassa, Vapi, and surrounding areas within approximately 50km — including Daman, Bhilad, Kachigam, Surangi, Dunetha, Nani Daman and nearby locations. If you're unsure whether we cover your area, please call or WhatsApp us — we'll confirm immediately."
}, {
  q: "How does the 'no hidden cost' agreement work?",
  a: "Before any work begins, we prepare a detailed written agreement listing every item — materials, labor, finishes, timelines, and costs. Once you sign, the total cost doesn't change unless YOU request additional work. No mid-project surprise bills, no extra charges for 'unforeseen issues.' What is written is what you pay."
}, {
  q: "How long does a typical project take?",
  a: "Timeline depends on project scope. A kitchen interior typically takes 3–5 weeks. Furniture-only work takes 2–4 weeks. Full home interior ranges from 6 weeks to 3–4 months depending on size and scope. During design stage, we give you a clear timeline and stick to it."
}, {
  q: "What kind of warranty do you provide?",
  a: "We provide warranty on carpentry work (wardrobe mechanisms, furniture joints, finishes), painting work (peeling, cracking within warranty period), and other specific work items — all mentioned in the agreement. The exact warranty period is discussed and documented for each category. If any issue arises in the warranty period, we fix it free of charge."
}, {
  q: "Can I get only one service — like just painting or just furniture?",
  a: "Absolutely! You don't have to take all services. If you only need painting, or only want a modular kitchen, or only need custom furniture — KailVarn handles single-service projects too. Each service is available independently."
}, {
  q: "What is the process to get started?",
  a: "(1) Call or fill the form to book a free consultation. (2) We do a site visit and understand your requirements. (3) We create a 3D design at zero cost. (4) We share a detailed cost estimate. (5) You approve design and cost, we sign an agreement. (6) Work begins. You can start the process in 5 minutes by calling 8460150027 or clicking 'Get Free Quote.'"
}, {
  q: "Do you work on commercial spaces like offices, cafés, and shops?",
  a: "Yes! KailVarn designs and executes commercial interiors for offices, cafés, restaurants, retail shops, showrooms, clinics, and other commercial spaces. Our team understandsboth residential and commercial requirements. Check our design portfolio for commercial interior examples."
  }];

export const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});
