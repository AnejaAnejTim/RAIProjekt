import {useState, useEffect} from 'react';

function RecipeFilters({filters, setFilters, searchTerm, setSearchTerm}) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 600);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: '#f8f8f8',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: isMobile ? '100%' : '320px',
                margin: isMobile ? '10px 0' : '0 auto 20px',
                boxSizing: 'border-box',
            }}
        >
            <div style={{marginBottom: '20px'}}>
                <input
                    type="text"
                    placeholder="Iščite recept..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: isMobile ? '12px 16px' : '8px 12px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                    }}
                />
            </div>

            <div style={{marginBottom: '15px'}}>
                <label>Priprava (max min):</label>
                <input
                    type="number"
                    name="prepTime"
                    value={filters.prepTime}
                    onChange={handleChange}
                    placeholder="npr. 30"
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        marginTop: '5px',
                        fontSize: isMobile ? '1rem' : 'inherit',
                    }}
                />
            </div>

            <div style={{marginBottom: '15px'}}>
                <label>Kuhanje (max min):</label>
                <input
                    type="number"
                    name="cookTime"
                    value={filters.cookTime}
                    onChange={handleChange}
                    placeholder="npr. 45"
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        marginTop: '5px',
                        fontSize: isMobile ? '1rem' : 'inherit',
                    }}
                />
            </div>

            <div style={{marginBottom: '15px'}}>
                <label style={{fontSize: isMobile ? '1rem' : 'inherit'}}>
                    <input
                        type="checkbox"
                        name="favoritesOnly"
                        checked={filters.favoritesOnly}
                        onChange={handleChange}
                        style={{marginRight: '8px'}}
                    />
                    Samo priljubljeni recepti
                </label>
            </div>
        </div>
    );
}

export default RecipeFilters;
