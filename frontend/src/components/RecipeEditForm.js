import React, { useState } from 'react';

export default function RecipeExamplePage() {
  const initialRecipe = {
    name: 'Špageti z omako',
    difficulty: 'Lahka',
    prepTime: '30 min',
    ingredients: ['Špageti', 'Olje', 'Česen', 'Pelati', 'Začimbe', 'Parmezan'],
    instructions: `Skuhajte špagete v slani vodi do al dente.
    V ponvi segrejte olje in dodajte sesekljan česen.
    Dodajte pelate, začimbe in kuhajte 15 minut.
    Odcejene špagete zmešajte z omako.
    Postrezite s parmezanom na vrhu.`,
    };

  const [name, setName] = useState(initialRecipe.name);
  const [difficulty, setDifficulty] = useState(initialRecipe.difficulty);
  const [prepTime, setPrepTime] = useState(initialRecipe.prepTime);
  const [ingredients, setIngredients] = useState(initialRecipe.ingredients.join('\n'));
  const [instructions, setInstructions] = useState(initialRecipe.instructions);

  const instructionLines = instructions
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const ingredientLines = ingredients
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const handleSave = () => {
    alert('Recept je shranjen!');
  };

  const handleCancel = () => {
    setName(initialRecipe.name);
    setDifficulty(initialRecipe.difficulty);
    setPrepTime(initialRecipe.prepTime);
    setIngredients(initialRecipe.ingredients.join('\n'));
    setInstructions(initialRecipe.instructions);
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '30px auto',
        padding: 30,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
        backgroundColor: '#fff',
        borderRadius: 12,
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 25 }}>Uredi recept</h1>

      <label style={{ display: 'block', marginBottom: 20 }}>
        Ime:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ime recepta"
          style={{
            width: '100%',
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            border: '1.8px solid #a1c349',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 20 }}>
        Zahtevnost:
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          style={{
            width: '100%',
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            border: '1.8px solid #a1c349',
            fontSize: '1rem',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="Lahka">Lahka</option>
          <option value="Srednja">Srednja</option>
          <option value="Zahtevna">Zahtevna</option>
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: 20 }}>
        Čas priprave:
        <input
          type="text"
          value={prepTime}
          onChange={e => setPrepTime(e.target.value)}
          placeholder="Npr. 30 min"
          style={{
            width: '100%',
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            border: '1.8px solid #a1c349',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 20 }}>
        Sestavine (vsaka v novi vrstici):
        <textarea
          rows={6}
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          placeholder="Vnesi sestavine..."
          style={{
            width: '100%',
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            border: '1.8px solid #a1c349',
            fontSize: '1rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 25, fontWeight: '600' }}>
        Navodila (vsaka v novi vrstici):
        <textarea
          rows={10}
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="Vnesi navodila..."
          style={{
            width: '100%',
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            border: '1.8px solid #a1c349',
            fontSize: '1rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: 200,
          }}
        />
      </label>
      <hr style={{ margin: '40px 0' }} />

      <h2 style={{ textAlign: 'center', marginBottom: 25 }}>Prikaz recepta</h2>

      <h3>{name}</h3>
      <p><strong>Zahtevnost:</strong> {difficulty}</p>
      <p><strong>Čas priprave:</strong> {prepTime}</p>

      <h4>Sestavine:</h4>
      <ul>
        {ingredientLines.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h4>Navodila:</h4>
      <ol style={{ paddingLeft: 20 }}>
        {instructionLines.map((inst, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            {inst}
          </li>
        ))}
      </ol>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 30 }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '12px 28px',
            backgroundColor: '#e84138',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1.1rem',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c0322f')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e84138')}
        >
          Prekliči
        </button>

        <button
          onClick={handleSave}
          style={{
            padding: '12px 28px',
            backgroundColor: '#a1c349',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1.1rem',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8bac3a')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#a1c349')}
        >
          Shrani
        </button>
      </div>
    </div>
    
  );
}
