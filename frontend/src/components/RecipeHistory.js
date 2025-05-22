import React, { useState } from 'react';

function RecipeHistory() {
  const [userRecipes] = useState([
    { name: 'Špageti z bolonjsko omako' },
    { name: 'Rižota z gobami' },
    { name: 'Piščanec v curry omaki' },
    { name: 'Zelenjavna juha' },
    { name: 'Lazanja z bučkami' },
  ]);

  if (userRecipes.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>Zgodovina receptov</h3>
        <p style={styles.empty}>Ni shranjenih receptov.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Zgodovina receptov</h3>
      <ul style={styles.list}>
        {userRecipes.map((recipe, idx) => (
          <li key={idx} style={styles.item}>
            {recipe.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '720px',
    margin: '40px auto',
    padding: '20px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    color: '#333',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    borderBottom: '1px solid #333',
    paddingBottom: '10px',
  },
  list: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    fontSize: '1.1rem',
  },
  item: {
    marginBottom: '10px',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  },
  empty: {
    fontStyle: 'italic',
    color: '#777',
  },
};

export default RecipeHistory;
