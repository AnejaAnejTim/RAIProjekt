import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';

const UNSPLASH_ACCESS_KEY = 'Yz9N6nF5SL_W1HwfHQzO3bPlEFa_SK2lanub5OND5i4';

async function translateToEnglish(text) {
    try {
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: 'en',
                format: 'text'
            }),
        });
        const data = await response.json();
        return data.translatedText || text;
    } catch (err) {
        console.error('Translation error:', err);
        return text;
    }
}

function TrendingRecipesShow() {
    const [hoveredRecipe, setHoveredRecipe] = useState(null);
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [images, setImages] = useState({});

    useEffect(() => {
        fetch('http://localhost:3001/recipes/trending')
            .then(res => res.json())
            .then(async (data) => {
                if (!Array.isArray(data)) {
                    console.error('Trending recipes response is not an array:', data);
                    setTrendingRecipes([]);
                    return;
                }

                const translatedRecipes = await Promise.all(
                    data.map(async (recipe) => {
                        const translatedTitle = await translateToEnglish(recipe.title);
                        return { ...recipe, translatedTitle };
                    })
                );

                setTrendingRecipes(translatedRecipes);

                const imageFetches = await Promise.all(
                    translatedRecipes.map(async (recipe) => {
                        try {
                            const res = await fetch(
                                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(recipe.translatedTitle + ' food')}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=squarish&per_page=1`
                            );
                            const json = await res.json();
                            return {
                                id: recipe._id,
                                url: json.results[0]?.urls?.regular || null,
                            };
                        } catch (error) {
                            console.error('Error fetching Unsplash image for', recipe.translatedTitle, error);
                            return { id: recipe._id, url: null };
                        }
                    })
                );

                const imageMap = {};
                imageFetches.forEach(img => {
                    imageMap[img.id] = img.url;
                });
                setImages(imageMap);
            })
            .catch(err => {
                setTrendingRecipes([]);
                console.error('Failed to fetch trending recipes:', err);
            });
    }, []);

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
                    const imageUrl = images[recipe._id] || 'https://via.placeholder.com/400x300?text=No+Image';

                    return (
                        <div
                            key={recipe._id}
                            onMouseEnter={() => setHoveredRecipe(recipe._id)}
                            onMouseLeave={() => setHoveredRecipe(null)}
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
                                alt={recipe.translatedTitle}
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
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{recipe.translatedTitle}</h3>
                            <div style={{ fontSize: '1rem', color: '#f39c12' }}>
                                <FontAwesomeIcon icon={faStar} />{' '}
                                {recipe.rating?.toFixed(2) ?? 'N/A'} / 5
                            </div>
                            <div style={{ fontSize: '0.95rem', color: '#2d7a0b', marginTop: '10px' }}>
                                Dnevni unikatni ogledi: {recipe.dailyUniqueViews ?? 0}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: '#2d7a0b' }}>
                                Skupni unikatni ogledi: {recipe.allTimeUniqueViews ?? 0}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TrendingRecipesShow;
