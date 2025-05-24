import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import nextPageIcon from '../assets/nextPage.svg';
import previousPageIcon from '../assets/previousPage.svg';
import removeIcon from '../assets/x.svg';
import trashIcon from '../assets/trash.svg';
import { Link } from 'react-router-dom';
import plusGreenIcon from '../assets/plusGreen.svg';
import { useEffect } from 'react';

function IngredientsMyFridge({
  foodItems,
  selectedItems,
  handleItemSelection,
  searchTerm,
  setSearchTerm,
  onRemoveItem,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [canUseMultiSelect, setCanUseMultiSelect] = useState(false);
  const [confirmDeleteSelectedVisible, setConfirmDeleteSelectedVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // New loading state

  const canDeleteSelected = canUseMultiSelect && selectedItems.length > 0;
  const itemsPerPage = 12;

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  useEffect(() => {
    if (currentPage > totalPages) {
        setCurrentPage(totalPages || 1);
    }
    }, [totalPages, currentPage]);

  const handleToggleChange = () => {
    const newValue = !canUseMultiSelect;
    setCanUseMultiSelect(newValue);
    if (!newValue) {
      selectedItems.forEach(item => handleItemSelection(item));
    }
  };

  async function handleRemoveItem(itemId) {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3001/myfridge/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      setIsDeleting(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
      return false;
    }
  }

  async function handleRemoveItems(itemIds) {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3001/myfridge`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: itemIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete selected items');
      }
      setIsDeleting(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
      return false;
    }
  }

  return (
    <>
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '900px',
          marginInline: 'auto',
          marginBottom: '20px',
        }}
      >
        <Link to="/addarticles">
          <img
            src={plusGreenIcon}
            alt="Add"
            style={{ width: '25px', height: '25px', cursor: 'pointer', display: 'block' }}
          />
        </Link>

        <input
          type="text"
          placeholder="Iščite sestavino..."
          value={searchTerm}
          onChange={e => {
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
          <label
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}
          >
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
                  left: canUseMultiSelect ? 'calc(100% - 23px)' : '3px',
                  transform: 'translateY(-50%)',
                  transition: 'left 0.3s ease',
                }}
              />
            </div>
          </label>

          <img
            src={trashIcon}
            alt="Delete selected"
            title="Izbriši izbrane"
            onClick={() => {
              if (canDeleteSelected && !isDeleting) {
                setConfirmDeleteSelectedVisible(true);
              }
            }}
            style={{
              width: '25px',
              height: '25px',
              cursor: canDeleteSelected && !isDeleting ? 'pointer' : 'not-allowed',
              opacity: canDeleteSelected && !isDeleting ? 1 : 0.4,
            }}
          />
        </div>
      </div>

      {/* Grid displaying food items */}
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
        {currentItems.map((item, idx) => {
          const isSelected = selectedItems.includes(item._id);
          const isHovered = hoveredItem === item._id;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredItem(item._id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                if (canUseMultiSelect) {
                  handleItemSelection(item._id);
                }
              }}
              style={{
                position: 'relative',
                backgroundColor: isSelected
                  ? '#b0d16b'
                  : 'rgba(255, 255, 255, 0.5)',
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
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    zIndex: 2,
                    opacity: isDeleting ? 0.5 : 1,
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    if (!isDeleting) setItemToRemove(item);
                  }}
                />
              )}

              <FontAwesomeIcon
                icon={item.icon}
                style={{ fontSize: '50px', marginBottom: '2px', pointerEvents: 'none' }}
              />
              <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: '0.9rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>
                  {item.quantity} {item.unit}
                </div>
              </div>
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
            gap: '10px',
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

          <span style={{ margin: '0 10px', fontSize: '1rem' }}>
            Stran {currentPage} od {totalPages}
          </span>

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
            <p>
              Ali res želite odstraniti <strong>{itemToRemove.name}</strong> iz hladilnika?
            </p>
            <div style={modalButtonGroupStyle}>
              <button
                onClick={() => !isDeleting && setItemToRemove(null)}
                style={{ ...cancelButtonStyle, opacity: isDeleting ? 0.5 : 1 }}
                disabled={isDeleting}
              >
                Prekliči
              </button>
              <button
                onClick={async () => {
                  if (isDeleting) return;
                  const success = await handleRemoveItem(itemToRemove._id);
                  if (success) {
                    onRemoveItem(itemToRemove._id);
                  }
                  setItemToRemove(null);
                }}
                style={confirmButtonStyle}
                disabled={isDeleting}
              >
                {isDeleting ? <Spinner /> : 'Odstrani'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to confirm deleting selected items */}
      {confirmDeleteSelectedVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <p>
              Ali res želite izbrisati <strong>{selectedItems.length}</strong> izbranih sestavin?
            </p>
            <div style={modalButtonGroupStyle}>
              <button
                onClick={() => !isDeleting && setConfirmDeleteSelectedVisible(false)}
                style={{ ...cancelButtonStyle, opacity: isDeleting ? 0.5 : 1 }}
                disabled={isDeleting}
              >
                Prekliči
              </button>
              <button
                onClick={async () => {
                  if (isDeleting) return;
                  const success = await handleRemoveItems(selectedItems);
                  if (success) {
                    selectedItems.forEach(id => onRemoveItem(id));
                    setConfirmDeleteSelectedVisible(false);
                  } else {
                    setConfirmDeleteSelectedVisible(false);
                  }
                }}
                style={confirmButtonStyle}
                disabled={isDeleting}
              >
                {isDeleting ? <Spinner /> : 'Izbriši'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Spinner() {
  return (
    <div
      style={{
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #fff',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
      }}
    />
  );
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};
const modalBoxStyle = {
  background: 'white',
  padding: '20px 30px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  maxWidth: '90%',
  fontSize: '1rem',
};
const modalButtonGroupStyle = { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' };
const cancelButtonStyle = {
  padding: '8px 20px',
  backgroundColor: '#f5f5f5',
  color: '#333',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '0.9rem',
};
const confirmButtonStyle = {
  padding: '8px 20px',
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

export default IngredientsMyFridge;
