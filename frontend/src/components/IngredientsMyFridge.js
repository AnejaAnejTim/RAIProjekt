import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import nextPageIcon from '../assets/nextPage.svg';
import previousPageIcon from '../assets/previousPage.svg';
import removeIcon from '../assets/x.svg';
import trashIcon from '../assets/trash.svg';

function IngredientsMyFridge({ foodItems, selectedItems, handleItemSelection, searchTerm, setSearchTerm }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [canUseMultiSelect, setCanUseMultiSelect] = useState(false);
    const [confirmDeleteSelectedVisible, setConfirmDeleteSelectedVisible] = useState(false);

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
    
    const handleToggleChange = () => {
        const newValue = !canUseMultiSelect;
        setCanUseMultiSelect(newValue);
        if (!newValue) {
            selectedItems.forEach(item => handleItemSelection(item));
        }
    };

    return (
        <>
            <div style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '900px',
                marginInline: 'auto',
                marginBottom: '20px'
            }}>
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
                        fontSize: '1rem',
                    }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                        <span style={{ fontSize: '1rem' }}>Omogoči večkratni izbor</span>
                        <div
                            onClick={handleToggleChange}
                            style={{
                                width: '50px',
                                height: '25px',
                                background: canUseMultiSelect ? '#b0d16b' : '#ccc',
                                borderRadius: '25px',
                                position: 'relative',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: '#fff',
                                    position: 'absolute',
                                    top: '50%',
                                    left: canUseMultiSelect ? 'calc(100% - 20px)' : '0',
                                    transform: 'translateY(-50%)',
                                    transition: 'left 0.3s ease'
                                }}
                            />
                        </div>
                    </label>

                    {canUseMultiSelect && (
                        <img
                            src={trashIcon}
                            alt="Delete selected"
                            title="Izbriši izbrane"
                            onClick={() => {
                                if (selectedItems.length > 0) {
                                    setConfirmDeleteSelectedVisible(true);
                                }
                            }}
                            style={{
                                width: '25px',
                                height: '25px',
                                cursor: 'pointer',
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateRows: 'repeat(3, 1fr)',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '25px',
                padding: '5px',
                justifyItems: 'center',
                alignItems: 'center',
            }}>
                {currentItems.map((item, idx) => {
                    const isSelected = selectedItems.includes(item.label);
                    const isHovered = hoveredItem === item.label;

                    return (
                        <div
                            key={idx}
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => {
                                if (canUseMultiSelect) {
                                    handleItemSelection(item.label);
                                }
                            }}
                            style={{
                                position: 'relative',
                                backgroundColor: isSelected ? '#b0d16b' : 'rgba(255, 255, 255, 0.5)',
                                padding: '5px',
                                borderRadius: '5px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                width: '90%',
                                height: '100%',
                                marginBottom: '10px',
                                marginTop: '10px',
                                transition: 'filter 0.2s ease-in-out',
                                filter: isHovered ? 'brightness(90%)' : 'none',
                                cursor: canUseMultiSelect ? 'pointer' : 'default',
                            }}
                        >
                            {!canUseMultiSelect && isHovered && (
                                <img
                                    src={removeIcon}
                                    alt="remove"
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '25px',
                                        height: '25px',
                                        cursor: 'pointer',
                                        zIndex: 2,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setItemToRemove(item.label);
                                    }}
                                />
                            )}
                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: '50px', marginBottom: '2px', pointerEvents: 'none' }} />
                            <span style={{ fontSize: '0.9rem', pointerEvents: 'none' }}>{item.label}</span>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px'
                }}>
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
                    <span style={{ margin: '0 10px', fontSize: '1rem' }}>Stran {currentPage} od {totalPages}</span>
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
            {itemToRemove && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <p>Ali res želite odstraniti <strong>{itemToRemove}</strong> iz hladilnika?</p>
                        <div style={modalButtonGroupStyle}>
                            <button onClick={() => setItemToRemove(null)} style={cancelButtonStyle}>Prekliči</button>
                            <button onClick={() => {
                                handleItemSelection(itemToRemove);
                                setItemToRemove(null);
                            }} style={confirmButtonStyle}>Odstrani</button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDeleteSelectedVisible && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <p>Ali res želite izbrisati <strong>{selectedItems.length}</strong> izbranih sestavin?</p>
                        <div style={modalButtonGroupStyle}>
                            <button onClick={() => setConfirmDeleteSelectedVisible(false)} style={cancelButtonStyle}>Prekliči</button>
                            <button onClick={() => {
                                setConfirmDeleteSelectedVisible(false);
                            }} style={confirmButtonStyle}>Izbriši</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 999
};
const modalBoxStyle = {
    background: 'white', padding: '20px 30px', borderRadius: '12px',
    textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', maxWidth: '90%',
    fontSize: '1rem'
};
const modalButtonGroupStyle = { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' };
const cancelButtonStyle = {
    padding: '8px 20px', backgroundColor: '#f5f5f5', color: '#333', border: 'none',
    borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem'
};
const confirmButtonStyle = {
    padding: '8px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none',
    borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem'
};

export default IngredientsMyFridge;
