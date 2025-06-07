import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUtensils, faEye } from '@fortawesome/free-solid-svg-icons';

function TrendingRecipesShow() {
    const [hoveredRecipe, setHoveredRecipe] = useState(null);
    const [trendingRecipes, setTrendingRecipes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/recipes/trending')
            .then(res => res.json())
            .then(data => setTrendingRecipes(Array.isArray(data) ? data : []))
            .catch(() => setTrendingRecipes([]));
    }, []);

    const placeholderImage =
        'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
    return (
        <div style={{ padding: '30px 10%', fontFamily: 'Segoe UI, sans-serif' }}>
            <div
                style={{
                    backgroundColor: '#84c318',
                    padding: '25px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    marginBottom: '40px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                }}
            >
                <h2 style={{ fontSize: '2rem', color: 'white', margin: 0 }}>
                    🔥 Trending ta teden
                </h2>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '30px',
                }}
            >
                {trendingRecipes.map((recipe) => {
                    const isHovered = hoveredRecipe === recipe._id;
                    const imageUrl = recipe.mainImage
                        ? `http://localhost:3001/recipes/images/${recipe.mainImage}`
                        : placeholderImage;

                    return (
                        <Link
                            key={recipe._id}
                            to={`/recipe/${recipe._id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onMouseEnter={() => setHoveredRecipe(recipe._id)}
                            onMouseLeave={() => setHoveredRecipe(null)}
                        >
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    boxShadow: isHovered
                                        ? '0 8px 24px rgba(0,0,0,0.15)'
                                        : '0 4px 12px rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                    cursor: 'pointer',
                                }}
                            >
                                <img
                                    src={imageUrl}
                                    alt={recipe.title}
                                    style={{
                                        width: '100%',
                                        height: '180px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        marginBottom: '15px',
                                    }}
                                />
                                <FontAwesomeIcon
                                    icon={faUtensils}
                                    style={{
                                        fontSize: '28px',
                                        marginBottom: '10px',
                                        color: '#84c318',
                                    }}
                                />
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{recipe.title}</h3>
                                <div style={{ fontSize: '1rem', color: '#f39c12' }}>
                                    <FontAwesomeIcon icon={faEye} />{' '}
                                    {recipe.views ?? 0}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default TrendingRecipesShow;