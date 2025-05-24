import React, {useContext, useState} from 'react';
import DifficultyIcon from '../assets/weight.svg';
import TimeIcon from '../assets/time.svg';
import {UserContext} from '../userContext';
import RecipeEditForm from './RecipeEditForm';

function RecipeShow({recipe}) {
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
    authorId: "test-user-id"
  };

  const {user} = useContext(UserContext);
  const [currentRecipe, setCurrentRecipe] = useState(recipe || placeholderRecipe);
  const [isEditing, setIsEditing] = useState(false);
  const {name, difficulty, prepTime, ingredients, instructions, image, authorId} = currentRecipe;
  const isOwner = true;

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => setIsEditing(false);

  const saveRecipe = (updatedRecipe) => {
    setCurrentRecipe(updatedRecipe);
    setIsEditing(false);
  };

  // Funkcija za prikazovanje navodil - podpira tako array kot HTML string
  const renderInstructions = () => {
    if (Array.isArray(instructions)) {
      // Če so navodila array, jih prikažemo kot oštevilčen seznam
      return (
        <ol style={{paddingLeft: '20px', fontSize: '1.1rem', lineHeight: '1.6'}}>
          {instructions.map((instruction, idx) => (
            <li key={idx} style={{marginBottom: '10px'}}>
              {instruction}
            </li>
          ))}
        </ol>
      );
    } else if (typeof instructions === 'string') {
      // Če so navodila HTML string (iz ReactQuill), uporabimo dangerouslySetInnerHTML
      return (
        <div
          dangerouslySetInnerHTML={{__html: instructions}}
          style={{paddingLeft: '20px', fontSize: '1.1rem', lineHeight: '1.6'}}
        />
      );
    } else {
      return <p style={{paddingLeft: '20px', fontSize: '1.1rem', lineHeight: '1.6'}}>Navodila niso na voljo.</p>;
    }
  };

  if (isEditing) {
    return (
      <RecipeEditForm
        recipe={currentRecipe}
        onSave={saveRecipe}
        onCancel={cancelEditing}
      />
    );
  }

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
        <div style={{width: '100%', overflow: 'hidden'}}>
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

      <div style={{padding: '25px 30px'}}>
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
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <img src={DifficultyIcon} alt="difficulty icon" style={{width: '20px', height: '20px'}}/>
            <span>Zahtevnost: {difficulty}</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <img src={TimeIcon} alt="time icon" style={{width: '20px', height: '20px'}}/>
            <span>Čas priprave: {prepTime}</span>
          </div>
        </div>

        <section style={{marginBottom: '30px'}}>
          <h3>
            Sestavine
          </h3>
          <hr></hr>
          <ul style={{paddingLeft: '20px'}}>
            {ingredients.map((item, idx) => (
              <li key={idx} style={{fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.5'}}>{item}</li>
            ))}
          </ul>
        </section>
        <hr></hr>
        <section>
          <h3>Navodila</h3>
          {renderInstructions()}
        </section>

        {isOwner && (
          <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px'}}>
            <button
              onClick={startEditing}
              style={{
                padding: '10px 20px',
                backgroundColor: '#b0d16b',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Uredi
            </button>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#e84138',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Izbriši
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeShow;