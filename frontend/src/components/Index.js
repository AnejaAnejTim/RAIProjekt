import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faRobot, faUtensils } from '@fortawesome/free-solid-svg-icons'; // faUtensils za "Vsi recepti"
import TrendingRecipesShow from './TrendingRecipesShow';

function Index() {
  const [hoveredSection, setHoveredSection] = useState(null);
  const trendingRef = useRef(null);
  const navigate = useNavigate();

  const sections = [
    {
      icon: faFire,
      title: 'Trending Recepti',
      description: 'Odkrij najbolj priljubljene AI-generirane recepte ta teden!',
      onClick: () => {
        if (trendingRef.current) {
          trendingRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: faRobot,
      title: 'Ustvari svoj recept',
      description: 'Povejte nam, kaj imate doma – umetna inteligenca ustvari jed!',
      onClick: () => {
        navigate('/generate');
      }
    },
    {
      icon: faUtensils,
      title: 'Vsi recepti',
      description: 'Razišči vse recepte, ki so jih generirali in objavili naši uporabniki!',
      onClick: () => {
        navigate('/allrecipes');
      }
    },
  ];

  return (
    <div style={{ padding: '30px 10%', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>
        Dobrodošli na <span style={{ color: '#b0d16b' }}>YummyAI</span>
      </h1>
      <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '40px' }}>
        Ustvarjaj in deli AI-generirane recepte s skupnostjo.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '25px',
        }}
      >
        {sections.map((section, index) => {
          const isHovered = hoveredSection === index;
          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={section.onClick}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                cursor: 'pointer',
                transform: isHovered ? 'translateY(-5px)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              <FontAwesomeIcon icon={section.icon} style={{ fontSize: '40px', marginBottom: '15px', color: '#b0d16b' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{section.title}</h2>
              <p style={{ fontSize: '1rem', color: '#555' }}>{section.description}</p>
            </div>
          );
        })}
      </div>

      <hr style={{ margin: '60px 0' }} />

      <div ref={trendingRef}>
        <TrendingRecipesShow />
      </div>
    </div>
  );
}

export default Index;
