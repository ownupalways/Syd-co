import React from 'react';
import { useTheme } from '@context/useTheme';
import { theme } from '@styles/theme';
import { Hero, InfoCards, ContactForm, FAQ } from '../Contact';

const ContactPage: React.FC = () => {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  return (
    <div style={{ background: t.background }}>
      <Hero t={t} isDark={isDark} />
      <InfoCards t={t} />
      <ContactForm t={t} />
      <FAQ t={t} />

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
