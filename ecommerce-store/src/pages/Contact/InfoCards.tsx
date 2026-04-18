import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ThemeMode } from '@/types/theme';

interface InfoCardsProps {
  t: ThemeMode;
}

const InfoCards: React.FC<InfoCardsProps> = ({ t }) => {
  const cards = [
    { icon: <Mail size={24} />, title: "Email Us", value: "hello@sydandco.com", color: t.primaryDark },
    { icon: <Phone size={24} />, title: "Call Us", value: "+1(262) 362-1810", color: "#9B30FF" },
    { icon: <MapPin size={24} />, title: "Visit Us", value: "123 Beauty Lane", color: "#00CFFF" },
    { icon: <Clock size={24} />, title: "Hours", value: "9am–6pm EST", color: "#FFB800" },
  ];

  return (
    <section style={{ padding: "60px 24px", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
      {cards.map((card) => (
        <div key={card.title} style={{ padding: "28px 24px", background: t.backgroundSecondary, borderRadius: "16px", border: `1px solid ${t.border}` }}>
          <div style={{ 
            width: "52px", height: "52px", borderRadius: "14px", 
            background: `${card.color}18`, display: "flex", 
            alignItems: "center", justifyContent: "center", color: card.color, marginBottom: "16px" 
          }}>
            {card.icon}
          </div>
          <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 600, marginBottom: "6px" }}>{card.title}</p>
          <p style={{ fontSize: "15px", fontWeight: 800, color: t.text }}>{card.value}</p>
        </div>
      ))}
    </section>
  );
};

export default InfoCards;
