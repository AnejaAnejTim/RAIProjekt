import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';

function TrendingRecipesShow() {
  const [hoveredRecipe, setHoveredRecipe] = useState(null);

  const trendingRecipes = [
    {
      id: 1,
      name: 'AI Pad Thai z mangom',
      description: 'Slastna kombinacija riževih rezancev, veganske omake in svežega manga.',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1637806930600-37fa8892069d?q=80&w=3085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      name: 'Pikantna fižolova čili pita',
      description: 'Umetna inteligenca + začimbe = toplina v vsakem grižljaju.',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1591386767153-987783380885?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      name: 'Limonin tofu z baziliko',
      description: 'Svežina limone in kremasta tekstura tofuja ustvarita pravo harmonijo.',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1515754164677-ec9796621bcb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 4,
      name: 'Nočni ovseni cheesecake',
      description: 'Zdrav zajtrk ali sladica – odločite se sami!',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      name: 'Zeleni curry z gobami',
      description: 'Kremast, aromatičen in popolnoma rastlinski.',
      rating: 4.95,
      image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <div style={{ padding: '30px 10%', fontFamily: 'sans-serif' }}>
      <div
        style={{
          backgroundColor: '#b0d16b',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ fontSize: '1.8rem', color: 'white', margin: 0 }}>
          🔥 Trending ta teden
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '25px',
        }}
      >
        {trendingRecipes.map((recipe) => {
          const isHovered = hoveredRecipe === recipe.id;

          return (
            <div
              key={recipe.id}
              onMouseEnter={() => setHoveredRecipe(recipe.id)}
              onMouseLeave={() => setHoveredRecipe(null)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
              }}
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
              <FontAwesomeIcon icon={faUtensils} style={{ fontSize: '30px', marginBottom: '10px', color: '#84c318' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{recipe.name}</h3>
              <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '12px' }}>
                {recipe.description}
              </p>
              <div style={{ fontSize: '1rem', color: '#f39c12' }}>
                <FontAwesomeIcon icon={faStar} /> {recipe.rating.toFixed(2)} / 5
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrendingRecipesShow;
