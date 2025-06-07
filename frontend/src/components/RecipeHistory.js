import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUtensils } from '@fortawesome/free-solid-svg-icons';

function RecipeHistory() {
    const [recipes, setRecipes] = useState([]);
    const [hoveredRecipe, setHoveredRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/recipes/myRecipes', {
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Napaka pri nalaganju receptov');
                return res.json();
            })
            .then(data => {
                setRecipes(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Nalaganje receptov...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>;

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const placeholderImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

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
                <h2 style={{ fontSize: '1.8rem', color: 'white', margin: 0 }}>🍽️ Moji recepti</h2>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <input
                    type="text"
                    placeholder="Iščite recept..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        width: '60%',
                        fontSize: '1rem',
                    }}
                />
            </div>

            {filteredRecipes.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '30px' }}>Ni receptov za prikaz.</p>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '25px',
                    }}
                >
                    {filteredRecipes.map((recipe) => {
                        const isHovered = hoveredRecipe === recipe._id;

                        const shortDesc = recipe.description.length > 80
                            ? recipe.description.slice(0, 77) + '...'
                            : recipe.description;

                        const fakeRating = 4.5 + (recipe.title.length % 5) * 0.1;

                        const imageUrl = recipe.mainImage && recipe.mainImage.trim() !== ''
                            ? `http://localhost:3001/recipes/images/${recipe.mainImage}`
                            : placeholderImage


                        return (
                            <Link
                                key={recipe._id}
                                to={`/recipe/${recipe._id}`}
                                onMouseEnter={() => setHoveredRecipe(recipe._id)}
                                onMouseLeave={() => setHoveredRecipe(null)}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                        padding: '15px',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        textAlign: 'center',
                                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                        transition: 'transform 0.2s ease',
                                        cursor: 'pointer',
                                        minHeight: '360px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={recipe.title}
                                        style={{
                                            width: '100%',
                                            height: '160px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            marginBottom: '15px',
                                        }}
                                    />
                                    <FontAwesomeIcon
                                        icon={faUtensils}
                                        style={{ fontSize: '30px', marginBottom: '10px', color: '#84c318' }}
                                    />
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{recipe.title}</h3>
                                    <p
                                        style={{
                                            fontSize: '0.95rem',
                                            color: '#555',
                                            marginBottom: '12px',
                                            flexGrow: 1,
                                        }}
                                    >
                                        {shortDesc}
                                    </p>
                                    <div style={{ fontSize: '1rem', color: '#888' }}>
                                        <FontAwesomeIcon icon={faEye} /> {recipe.views ?? 0}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default RecipeHistory;
