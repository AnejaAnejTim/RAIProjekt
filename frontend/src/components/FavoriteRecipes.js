import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar as faStarSolid, faEye} from '@fortawesome/free-solid-svg-icons';

function FavoriteRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/users/favorites', {credentials: 'include'})
            .then(res => res.json())
            .then(data => {
                setRecipes(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load favorite recipes.');
                setLoading(false);
            });
    }, []);

    const placeholderImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

    if (loading)
        return <p style={{textAlign: 'center', marginTop: '50px'}}>Loading favorite recipes...</p>;

    if (error)
        return <p style={{color: 'red', textAlign: 'center', marginTop: '50px'}}>{error}</p>;

    if (recipes.length === 0)
        return <p style={{textAlign: 'center', marginTop: '50px'}}>You have no favorite recipes.</p>;

    return (
        <div style={{padding: '30px 10%', fontFamily: 'sans-serif'}}>
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
                <h2 style={{fontSize: '1.8rem', color: 'white', margin: 0}}>
                    Priljubljeni recepti
                </h2>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '25px',
                }}
            >
                {recipes.map((recipe) => {
                    const shortDesc =
                        recipe.description && recipe.description.length > 80
                            ? recipe.description.slice(0, 77) + '...'
                            : recipe.description;
                    return (
                        <Link
                            key={recipe._id}
                            to={`/recipe/${recipe._id}`}
                            style={{textDecoration: 'none', color: 'inherit'}}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    minHeight: '360px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faStarSolid}
                                    style={{
                                        color: '#f39c12',
                                        fontSize: 24,
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                    }}
                                />
                                <img
                                    src={
                                        recipe.mainImage
                                            ? `http://localhost:3001/recipes/images/${recipe.mainImage}`
                                            : placeholderImage
                                    }
                                    alt={recipe.title}
                                    style={{
                                        width: '100%',
                                        height: '160px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        marginBottom: '15px',
                                    }}
                                />
                                <h3 style={{fontSize: '1.2rem', marginBottom: '8px'}}>
                                    {recipe.title}
                                </h3>
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
                                <div style={{fontSize: '1.3rem', color: '#888'}}>
                                    <FontAwesomeIcon icon={faEye}/> {recipe.views ?? 0}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default FavoriteRecipes;