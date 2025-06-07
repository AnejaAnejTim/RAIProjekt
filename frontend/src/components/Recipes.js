import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faStar as faStarSolid,
    faStar as faStarRegular,
    faEye
} from '@fortawesome/free-solid-svg-icons';
import RecipeFilters from './RecipeFilters';

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [hoveredRecipe, setHoveredRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [filters, setFilters] = useState({
        prepTime: '',
        cookTime: '',
        favoritesOnly: false,
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 700);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetch('http://localhost:3001/api/users/favorites', {credentials: 'include'})
            .then(res => res.json())
            .then(data => setFavorites(data.map(r => r._id)))
            .catch(() => setFavorites([]));
    }, []);

    const isFavorite = (id) => favorites.includes(id);

    const toggleFavorite = (id) => {
        const method = isFavorite(id) ? 'DELETE' : 'POST';
        fetch(`http://localhost:3001/api/users/favorites/${id}`, {
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
        fetch('http://localhost:3001/recipes')
            .then((res) => {
                if (!res.ok) throw new Error('Napaka pri nalaganju receptov');
                return res.json();
            })
            .then((data) => {
                setRecipes(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const placeholderImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

    const filteredRecipes = recipes.filter((recipe) => {
        const query = searchTerm.toLowerCase();

        const matchesSearch =
            recipe.title.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query);

        const matchesTime = filters.time
            ? parseInt(recipe.time) <= parseInt(filters.time)
            : true;

        const matchesPrepTime = filters.prepTime
            ? parseInt(recipe.prep_time) <= parseInt(filters.prepTime)
            : true;

        const matchesCookTime = filters.cookTime
            ? parseInt(recipe.cook_time) <= parseInt(filters.cookTime)
            : true;

        const matchesFavoritesOnly = filters.favoritesOnly
            ? favorites.includes(recipe._id)
            : true;

        return (
            matchesSearch &&
            matchesPrepTime &&
            matchesCookTime &&
            matchesFavoritesOnly
        );
    });

    if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Nalaganje receptov...</p>;
    if (error) return <p style={{color: 'red', textAlign: 'center', marginTop: '50px'}}>{error}</p>;
    if (recipes.length === 0) return <p style={{textAlign: 'center', marginTop: '50px'}}>Ni receptov za prikaz.</p>;

    return (
        <div style={{padding: isMobile ? '20px 5%' : '30px 10%', fontFamily: 'sans-serif'}}>
            <div
                style={{
                    backgroundColor: '#b0d16b',
                    padding: isMobile ? '15px' : '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '30px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <h2 style={{fontSize: isMobile ? '1.5rem' : '1.8rem', color: 'white', margin: 0}}>Vsi recepti</h2>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'stretch' : 'flex-start',
                    gap: isMobile ? '20px' : '40px',
                }}
            >
                {/* Leva stran: filtri */}
                <div
                    style={{
                        flex: isMobile ? 'none' : '0 0 250px',
                        width: isMobile ? '100%' : '250px',
                        maxWidth: '100%',
                    }}
                >
                    <RecipeFilters
                        filters={filters}
                        setFilters={setFilters}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </div>

                <div style={{flex: 1}}>
                    {filteredRecipes.length === 0 ? (
                        <p style={{textAlign: 'center', marginTop: '20px'}}>
                            Ni zadetkov za: "{searchTerm}"
                        </p>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile
                                    ? '1fr'
                                    : 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: '25px',
                            }}
                        >
                            {filteredRecipes.map((recipe) => {
                                const isHovered = hoveredRecipe === recipe._id;
                                const shortDesc =
                                    recipe.description.length > 80
                                        ? recipe.description.slice(0, 77) + '...'
                                        : recipe.description;

                                return (
                                    <Link
                                        key={recipe._id}
                                        to={`/recipe/${recipe._id}`}
                                        onMouseEnter={() => setHoveredRecipe(recipe._id)}
                                        onMouseLeave={() => setHoveredRecipe(null)}
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
                                                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                                transition: 'transform 0.2s ease',
                                                cursor: 'pointer',
                                                minHeight: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
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
                                                    top: 10,
                                                    right: 10,
                                                    cursor: 'pointer',
                                                    zIndex: 2,
                                                }}
                                                aria-label={isFavorite(recipe._id) ? 'Unfavorite' : 'Favorite'}
                                            >
                                                <FontAwesomeIcon
                                                    icon={isFavorite(recipe._id) ? faStarSolid : faStarRegular}
                                                    style={{
                                                        color: isFavorite(recipe._id) ? '#f39c12' : '#bbb',
                                                        fontSize: 24,
                                                    }}
                                                />
                                            </button>
                                            <img
                                                src={
                                                    recipe.mainImage
                                                        ? `http://localhost:3001/recipes/images/${recipe.mainImage}`
                                                        : placeholderImage
                                                }
                                                alt={recipe.title}
                                                style={{
                                                    width: '100%',
                                                    height: isMobile ? '200px' : '160px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginBottom: '15px',
                                                }}
                                            />
                                            <h3 style={{fontSize: '1.2rem', marginBottom: '8px'}}>{recipe.title}</h3>
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default Recipes;
