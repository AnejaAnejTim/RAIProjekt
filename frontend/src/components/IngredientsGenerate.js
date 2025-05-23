import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import nextPageIcon from '../assets/nextPage.svg';
import previousPageIcon from '../assets/previousPage.svg';

function IngredientsGenerate({ foodItems, selectedItems, handleItemSelection, searchTerm, setSearchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredItem, setHoveredItem] = useState(null);
  const itemsPerPage = 12;

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            fontSize: '1rem',
            marginBottom: '20px'
          }}
        />
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
        {currentItems.map((item) => {
          const isSelected = selectedItems.includes(item._id);
          const isHovered = hoveredItem === item._id;

          return (
            <div
              key={item._id}
              onMouseEnter={() => setHoveredItem(item._id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemSelection(item._id)}
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
                transition: 'transform 0.2s ease, filter 0.2s ease-in-out',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                filter: isHovered ? 'brightness(90%)' : 'none',
              }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                style={{
                  fontSize: '50px',
                  marginBottom: '2px',
                }}
              />
              <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                style={{
                  position: 'absolute',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
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
          <span style={{ fontSize: '1rem' }}>Stran {currentPage} od {totalPages}</span>
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
