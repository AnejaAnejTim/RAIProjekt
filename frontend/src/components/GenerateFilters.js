import { useState } from 'react';

function GenerateFilters() {
    const [selectedMealType, setSelectedMealType] = useState('');
    const [canUseOtherIngredients, setCanUseOtherIngredients] = useState(false);

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        setSelectedMealType(value);
    };

    const handleToggleChange = () => {
        setCanUseOtherIngredients((prevState) => !prevState);
    };

    return (
        <div style={{ textAlign: 'center', fontSize: '1.6rem', color: '#333' }}>
            <div style={{ marginBottom: '10px' }}>
                2. Izberite lastnosti vašega recepta
            </div>
            <div style={{ marginBottom: '20px' }}>
                <h5>Ali lahko naš kuhar uporabi sestavine, ki niso v vašem hladilniku?</h5>
                {/* Center toggle */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <div
                            onClick={handleToggleChange}
                            style={{
                                width: '50px',
                                height: '25px',
                                background: canUseOtherIngredients ? '#b0d16b' : '#ccc',
                                borderRadius: '25px',
                                position: 'relative',
                                transition: 'background-color 0.3s ease'
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
                                    left: canUseOtherIngredients ? 'calc(100% - 20px)' : '0',
                                    transform: 'translateY(-50%)',
                                    transition: 'left 0.3s ease'
                                }}
                            />
                        </div>
                        <span style={{ marginLeft: '10px', fontSize: '1rem' }}>
                            {canUseOtherIngredients ? 'Da' : 'Ne'}
                        </span>
                    </label>
                </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '1rem', color: '#333' }}>
                <h5>Izberi tip obroka</h5>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                    <label>
                        <input
                            type="radio"
                            name="mealType"
                            value="breakfast"
                            checked={selectedMealType === 'breakfast'}
                            onChange={handleCheckboxChange}
                        />
                        Zajtrk
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mealType"
                            value="lunch"
                            checked={selectedMealType === 'lunch'}
                            onChange={handleCheckboxChange}
                        />
                        Kosilo
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mealType"
                            value="dinner"
                            checked={selectedMealType === 'dinner'}
                            onChange={handleCheckboxChange}
                        />
                        Večerja
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mealType"
                            value="snack"
                            checked={selectedMealType === 'snack'}
                            onChange={handleCheckboxChange}
                        />
                        Prigrizek
                    </label>
                </div>
            </div>
        </div>
    );
}

export default GenerateFilters;
