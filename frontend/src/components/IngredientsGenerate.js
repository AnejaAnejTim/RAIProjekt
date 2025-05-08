import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import nextPageIcon from '../assets/nextPage.svg';
import previousPageIcon from '../assets/previousPage.svg';

function IngredientsGenerate({ foodItems, selectedItems, handleItemSelection, searchTerm, setSearchTerm }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filteredItems = foodItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2rem', color: '#333' }}>
                Generiraj recept
                <div style={{ fontSize: '1.6rem' }}>
                    1. Izberite sestavine iz vašega hladilnika
                </div>
                <div style={{ marginTop: '10px' }}>
                    <input
                        type="text"
                        placeholder="Iščite sestavino..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '20px',
                            border: '1px solid #ccc',
                            width: '60%',
                            marginTop: '10px',
                            fontSize: '1rem'
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(3, 1fr)',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '25px',
                    padding: '5px',
                    justifyItems: 'center',
                    alignItems: 'center',
                }}
            >
                {currentItems.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            backgroundColor: selectedItems.includes(item.label) ? '#b0d16b' : 'rgba(255, 255, 255, 0.5)',
                            padding: '5px',
                            borderRadius: '5px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            width: '90%',
                            height: '100%',
                            marginBottom: '10px',
                            marginTop: '10px',
                        }}
                        onClick={() => handleItemSelection(item.label)}
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            style={{
                                fontSize: '50px',
                                marginBottom: '2px',
                            }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.label)}
                            readOnly
                            style={{
                                position: 'absolute',
                                opacity: 0,
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img src={previousPageIcon} alt="Previous" style={{ width: '40px', height: '40px' }} />
                    </button>
                    <span style={{ margin: '0 10px', fontSize: '1rem', verticalAlign: 'middle' }}>Stran {currentPage} od {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img src={nextPageIcon} alt="Next" style={{ width: '40px', height: '40px' }} />
                    </button>
                </div>
            )}
        </>
    );
}

export default IngredientsGenerate;
