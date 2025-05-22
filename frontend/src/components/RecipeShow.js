import React, { useContext, createContext } from 'react';
import DifficultyIcon from '../assets/weight.svg';
import TimeIcon from '../assets/time.svg';

export const UserContext = createContext({
  user: {
    id: "test-user-id",
    username: "testuser",
    email: "test@example.com",
  },
});

function RecipeShow({ recipe }) {
  const placeholderRecipe = {
    name: "Špageti z omako",
    difficulty: "Srednja",
    prepTime: "30 min",
    ingredients: [
      "200g špagetov",
      "2 žlici olivnega olja",
      "1 strok česna",
      "400g pelatov (paradižnik v konzervi)",
      "Sol, poper, origano",
      "Nariban parmezan"
    ],
    instructions: [
      "Skuhajte špagete v slani vodi do al dente.",
      "V ponvi segrejte olje in dodajte sesekljan česen.",
      "Dodajte pelate, začimbe in kuhajte 15 minut.",
      "Odcejene špagete zmešajte z omako.",
      "Postrezite s parmezanom na vrhu."
    ],
    image: "https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg",
    authorId: "test-user-id" // ⬅️ pomembno
  };

  const currentRecipe = recipe || placeholderRecipe;
  const { name, difficulty, prepTime, ingredients, instructions, image, authorId } = currentRecipe;

  const { user } = useContext(UserContext);
  const isOwner = user && user.id === authorId;

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '30px auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        color: '#333',
      }}
    >
      {image && (
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <img
            src={image}
            alt={name}
            style={{
              width: '100%',
              maxHeight: '300px',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      )}

      <div style={{ padding: '25px 30px' }}>
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '2.5rem',
            color: '#333',
            textShadow: '1px 1px 2px rgba(74, 124, 37, 0.4)',
          }}
        >
          {name}
        </h2>

        <div
          style={{
            maxWidth: '350px',
            margin: '0 auto 30px',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '10px 20px',
            border: '2px solid #a1c349',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: '0 2px 6px rgba(74, 124, 37, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={DifficultyIcon} alt="difficulty icon" style={{ width: '20px', height: '20px' }} />
            <span>Zahtevnost: {difficulty}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={TimeIcon} alt="time icon" style={{ width: '20px', height: '20px' }} />
            <span>Čas priprave: {prepTime}</span>
          </div>
        </div>

        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px' }}>
            Sestavine
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {ingredients.map((item, idx) => (
              <li key={idx} style={{ fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.5' }}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 style={{ fontSize: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px' }}>
            Navodila
          </h3>
          <ol style={{ paddingLeft: '20px' }}>
            {instructions.map((step, idx) => (
              <li key={idx} style={{ fontSize: '1.1rem', marginBottom: '15px', lineHeight: '1.6' }}>{step}</li>
            ))}
          </ol>
        </section>

        {isOwner && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#b0d16b',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Uredi
            </button>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#e84138',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Izbriši
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeShowWithUser() {
  const testUser = {
    id: "test-user-id",
    username: "testuser",
    email: "test@example.com",
  };

  return (
    <UserContext.Provider value={{ user: testUser }}>
      <RecipeShow />
    </UserContext.Provider>
  );
}

export default RecipeShowWithUser;
