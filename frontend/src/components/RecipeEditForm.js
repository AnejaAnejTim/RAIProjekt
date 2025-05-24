import React, { useState } from 'react';

export default function RecipeEditForm({ recipe, onCancel, onSave }) {
  const [name, setName] = useState(recipe.title || '');
  const [prepTime, setPrepTime] = useState(recipe.prep_time || '');
  const [cookTime, setCookTime] = useState(recipe.cook_time || '');
  const [ingredients, setIngredients] = useState(
    Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : ''
  );
  const [instructions, setInstructions] = useState(recipe.description || '');

  const ingredientLines = ingredients
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  // Split instructions into sentences including the punctuation marks
  const instructionLines = instructions.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g) || [];

  const handleSave = () => {
    const updatedRecipe = {
      ...recipe,
      title: name,
      prep_time: prepTime,
      cook_time: cookTime,
      ingredients: ingredientLines,
      description: instructions,
    };
    onSave(updatedRecipe);
  };

  return (
    <div>
      {/* Form */}
      <div style={{ marginBottom: 40 }}>
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

        {/* Čas kuhanja */}
        <label style={{ display: 'block', marginBottom: 20 }}>
          Čas kuhanja:
          <input
            type="text"
            value={cookTime}
            onChange={e => setCookTime(e.target.value)}
            placeholder="Npr. 15 min"
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
          Navodila (ločene s piko ali novo vrstico):
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
      </div>

      <hr style={{ margin: '40px 0' }} />
      <h2 style={{ textAlign: 'center', marginBottom: 25 }}>Prikaz recepta</h2>

      <h3>{name}</h3>
      <p><strong>Čas priprave:</strong> {prepTime}</p>
      <p><strong>Čas kuhanja:</strong> {cookTime}</p>

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
            {inst.trim()}
          </li>
        ))}
      </ol>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 30 }}>
        <button
          onClick={onCancel}
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
