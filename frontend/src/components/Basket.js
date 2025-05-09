import basketIcon from '../assets/basket.png';
import removeIcon from '../assets/x.svg';
import { useState } from 'react';
function Basket({ selectedItems, handleItemRemove, showMenu, setShowMenu }) {
    const [removingItems, setRemovingItems] = useState([]);
    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
            }}
        >
            <div style={{ position: 'relative' }}>
                {showMenu && (
                    <div
                        className="shadow"
                        style={{
                            position: 'absolute',
                            bottom: '110px',
                            left: '0',
                            backgroundColor: '#fff',
                            borderRadius: '0.5rem',
                            padding: '10px',
                            minWidth: '200px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        }}
                    >
                        <div
                            className="fw-bold mb-2"
                            style={{
                                fontSize: '1rem',
                                borderBottom: '1px solid #ccc',
                                paddingBottom: '5px',
                            }}
                        >
                            Seznam sestavin
                        </div>
                        {selectedItems.length > 0 ? (
                            selectedItems.map((item, idx) => (
                                <div key={idx} className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                                    <div
                                        onClick={() => {
                                            if (!removingItems.includes(item)) {
                                                setRemovingItems((prev) => [...prev, item]);
                                                setTimeout(() => {
                                                    handleItemRemove(item);
                                                    setRemovingItems((prev) => prev.filter((i) => i !== item));
                                                }, 800);
                                            }
                                        }}
                                        style={{
                                            marginRight: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                        }}
                                    >
                                        <img
                                            src={removeIcon}
                                            alt="remove"
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                cursor: 'pointer',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '0.95rem',
                                            textDecoration: removingItems.includes(item) ? 'line-through' : 'none',
                                            opacity: removingItems.includes(item) ? 0 : 1,
                                            transition: 'opacity 0.8s ease, text-decoration 0.8s ease',
                                        }}
                                    >
                                        {item}
                                    </span>

                                </div>


                            ))
                        ) : (
                            <div className="mb-2">Ni izbranih sestavin.</div>
                        )}
                    </div>
                )}
                <img
                    src={basketIcon}
                    alt="Basket"
                    style={{
                        width: '100px',
                        height: '100px',
                        cursor: 'pointer',
                    }}
                    onClick={() => setShowMenu(!showMenu)}
                />
                {!showMenu && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '20px',
                            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        {selectedItems.length}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Basket;
