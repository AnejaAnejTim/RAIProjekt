import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faStar as faStarSolid,
    faStar as faStarRegular,
    faUtensils,
    faEye
} from '@fortawesome/free-solid-svg-icons';

function TrendingRecipesShow() {
    const [hoveredRecipe, setHoveredRecipe] = useState(null);
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetch('/api/users/favorites', {credentials: 'include'})
            .then(res => res.json())
            .then(data => setFavorites(data.map(r => r._id)))
            .catch(() => setFavorites([]));
    }, []);

    const isFavorite = (id) => favorites.includes(id);

    const toggleFavorite = (id) => {
        const method = isFavorite(id) ? 'DELETE' : 'POST';
        fetch(`/api/users/favorites/${id}`, {
            method,
            credentials: 'include'
        })
            .then(res => res.json())
            .then(() => {
                setFavorites(favs =>
                    isFavorite(id) ? favs.filter(favId => favId !== id) : [...favs, id]
                );
            });
    };

    useEffect(() => {
        fetch('/recipes/trending')
            .then(res => res.json())
            .then(data => setTrendingRecipes(Array.isArray(data) ? data : []))
            .catch(() => setTrendingRecipes([]));
    }, []);

    const placeholderImage =
        'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

    return (
        <div style={{padding: '30px 10%', fontFamily: 'Segoe UI, sans-serif'}}>
            <div
                style={{
                    backgroundColor: '#b0d16b',
                    padding: '25px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    marginBottom: '40px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                }}
            >
                <h2 style={{fontSize: '2rem', color: 'white', margin: 0}}>
                    Trending ta teden
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
                    const shortDesc =
                        recipe.description.length > 80
                            ? recipe.description.slice(0, 77) + '...'
                            : recipe.description;
                    const imageUrl = recipe.mainImage
                        ? `/recipes/images/${recipe.mainImage}`
                        : placeholderImage;

                    return (
                        <Link
                            key={recipe._id}
                            to={`/recipe/${recipe._id}`}
                            style={{textDecoration: 'none', color: 'inherit'}}
                            onMouseEnter={() => setHoveredRecipe(recipe._id)}
                            onMouseLeave={() => setHoveredRecipe(null)}
                        >
                            <div
                                style={{
                                    position: 'relative',
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
                                <button
                                    onClick={e => {
                                        e.preventDefault();
                                        toggleFavorite(recipe._id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        cursor: 'pointer',
                                        zIndex: 10,
                                    }}
                                    aria-label={isFavorite(recipe._id) ? 'Unfavorite' : 'Favorite'}
                                >
                                    <FontAwesomeIcon
                                        icon={isFavorite(recipe._id) ? faStarSolid : faStarRegular}
                                        style={{
                                            color: isFavorite(recipe._id) ? '#f39c12' : '#bbb',
                                            fontSize: 26,
                                        }}
                                    />
                                </button>

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
                                <h3 style={{fontSize: '1.3rem', marginBottom: '10px'}}>{recipe.title}</h3>
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
                                <div style={{
                                    fontSize: '1.3rem',
                                    color: '#888',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}>
                                    <FontAwesomeIcon icon={faEye} style={{fontSize: '1.3rem'}}/>
                                    <span>{recipe.views ?? 0}</span>
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
