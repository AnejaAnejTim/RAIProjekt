import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // <-- import useNavigate
import TimeIcon from '../assets/time.svg';
import { UserContext } from '../userContext';
import RecipeEditForm from './RecipeEditForm';

function RecipeShow() {
  const { id } = useParams();
  const navigate = useNavigate();  // <-- initialize navigate
  const { user } = useContext(UserContext);

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:3001/recipes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Napaka pri nalaganju recepta');
        return res.json();
      })
      .then(data => {
        if (data.ingredients && !Array.isArray(data.ingredients)) {
          if (typeof data.ingredients === 'string') {
            data.ingredients = data.ingredients
              .split(',')
              .map(i => i.trim())
              .filter(i => i.length > 0);
          } else {
            data.ingredients = [];
          }
        }

        setCurrentRecipe(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => setIsEditing(false);

  const saveRecipe = (updatedRecipe) => {
    fetch(`http://localhost:3001/recipes/${updatedRecipe._id}`, {
      method: 'PUT',  // or PATCH depending on your API
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRecipe),
    })
      .then(res => {
        if (!res.ok) throw new Error('Napaka pri shranjevanju recepta');
        return res.json();
      })
      .then(data => {
        setCurrentRecipe(data);
        setIsEditing(false);
      })
      .catch(err => {
        alert(err.message);
      });
  };

  // New delete handler:
  const onDelete = () => {
    if (!window.confirm('Ste prepričani, da želite izbrisati ta recept?')) {
      return;
    }

    fetch(`http://localhost:3001/recipes/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Napaka pri brisanju recepta');
        return res.json().catch(() => null);
      })
      .then(() => {
        navigate('/recipes');
      })
      .catch(err => {
        alert(err.message);
      });
  };


  const renderInstructions = () => {
    if (!currentRecipe) return null;

    const instructionsText = currentRecipe.description || '';

    if (typeof instructionsText === 'string' && instructionsText.trim().length > 0) {
      const bulletPoints = instructionsText
        .split('.')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      return (
        <ol style={{ paddingLeft: '20px', fontSize: '1.1rem', lineHeight: '1.6' }}>
          {bulletPoints.map((point, idx) => (
            <li key={idx} style={{ marginBottom: '28px' }}>
              {point}.
            </li>
          ))}
        </ol>
      );
    } else {
      return <p style={{ paddingLeft: '20px', fontSize: '1.1rem', lineHeight: '1.6' }}>Navodila niso na voljo.</p>;
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Nalaganje recepta...</p>;
  }

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>;
  }

  if (!currentRecipe) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Recept ni bil najden.</p>;
  }

  const {
    title,
    prep_time,
    cook_time,
    ingredients = [],
    image,
    user: author,
  } = currentRecipe;

  const isOwner = user?._id === author?._id || user?.id === author;

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
            alt={title}
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
            marginBottom: '5px',
            fontSize: '2.5rem',
            color: '#333',
            textShadow: '1px 1px 2px rgba(74, 124, 37, 0.4)',
          }}
        >
          {title}
        </h2>
        {author?.username && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '1.1rem',
              fontWeight: '500',
              color: '#666',
              marginBottom: '20px',
            }}
          >
            Avtor: {author.username}
          </p>
        )}

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
            <img src={TimeIcon} alt="time icon" style={{ width: '20px', height: '20px' }} />
            <span>Čas priprave: {prep_time || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={TimeIcon} alt="cook time icon" style={{ width: '20px', height: '20px' }} />
            <span>Čas kuhanja: {cook_time || 'N/A'}</span>
          </div>
        </div>

        <section style={{ marginBottom: '30px' }}>
          <h3>Sestavine</h3>
          <hr />
          <ul style={{ paddingLeft: '20px' }}>
            {Array.isArray(ingredients)
              ? ingredients.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.5' }}>
                    {item}
                  </li>
                ))
              : (
                <li style={{ fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.5' }}>
                  {ingredients || 'Sestavine niso na voljo.'}
                </li>
              )
            }
          </ul>
        </section>

        <hr />

        <section>
          <h3>Navodila</h3>
          {renderInstructions()}
        </section>

        {isEditing && (
          <RecipeEditForm
            recipe={currentRecipe}
            onCancel={cancelEditing}
            onSave={saveRecipe}
          />
        )}

        {isOwner && !isEditing && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <button
              onClick={startEditing}
              style={{
                padding: '10px 20px',
                backgroundColor: '#b0d16b',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Uredi
            </button>
            <button
              onClick={onDelete}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e84138',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
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
