import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQProps {
  t: any;
}

const FAQ: React.FC<FAQProps> = ({ t }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: 'How long does shipping take?', a: 'Standard shipping takes 3–7 business days.' },
    { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy.' },
  ];

  return (
    <section style={{ padding: "80px 24px", background: t.backgroundSecondary }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ textAlign: 'center', color: t.text, marginBottom: '40px', fontWeight: 900 }}>FAQ</h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: '12px', background: t.background, border: `1px solid ${openFaq === i ? t.primaryDark : t.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontWeight: 700, color: openFaq === i ? t.primaryDark : t.text }}>{faq.q}</span>
              <span style={{ color: t.primaryDark }}>{openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} /> }</span>
            </button>
            {openFaq === i && <p style={{ padding: '0 20px 18px', color: t.textSecondary, fontSize: '14px', lineHeight: 1.6 }}>{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
