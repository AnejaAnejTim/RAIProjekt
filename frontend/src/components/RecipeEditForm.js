import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function RecipeEditForm({recipe, onSave, onCancel}) {
    const [name, setName] = useState(recipe.name);
    const [difficulty, setDifficulty] = useState(recipe.difficulty);
    const [prepTime, setPrepTime] = useState(recipe.prepTime);
    const [ingredients, setIngredients] = useState(recipe.ingredients.join('\n'));
    const [instructions, setInstructions] = useState(() => {
        if (typeof recipe.instructions === 'string') {
            return recipe.instructions;
        }
        if (Array.isArray(recipe.instructions)) {
            return recipe.instructions
                .filter(Boolean)
                .map((line) => `<p>${line}</p>`)
                .join('');
        }
        return '';
    });

    const handleSave = () => {
        const updatedRecipe = {
            ...recipe,
            name,
            difficulty,
            prepTime,
            ingredients: ingredients.split('\n').map(line => line.trim()).filter(Boolean),
            instructions, // shranjuj HTML
        };
        onSave(updatedRecipe);
    };

    return (
        <div
            style={{
                maxWidth: '720px',
                margin: '30px auto',
                padding: '30px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: '#333',
            }}
        >
            <h2 style={{textAlign: 'center', marginBottom: '25px', color: '#333'}}>
                Uredi recept
            </h2>

            <label style={{display: 'block', marginBottom: '20px'}}>
                Ime:
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1.8px solid #a1c349',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                    }}
                    placeholder="Ime recepta"
                />
            </label>

            <label style={{display: 'block', marginBottom: '20px'}}>
                Zahtevnost:
                <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1.8px solid #a1c349',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    <option value="Lahka">Lahka</option>
                    <option value="Srednja">Srednja</option>
                    <option value="Zahtevna">Zahtevna</option>
                </select>
            </label>

            <label style={{display: 'block', marginBottom: '20px'}}>
                Čas priprave:
                <input
                    value={prepTime}
                    onChange={e => setPrepTime(e.target.value)}
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1.8px solid #a1c349',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                    }}
                    placeholder="Npr. 30 min"
                />
            </label>

            <label style={{display: 'block', marginBottom: '20px'}}>
                Sestavine (vsaka v novi vrstici):
                <textarea
                    rows={6}
                    value={ingredients}
                    onChange={e => setIngredients(e.target.value)}
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1.8px solid #a1c349',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        resize: 'vertical',
                    }}
                    placeholder="Vnesi sestavine..."
                />
            </label>

            <label style={{display: 'block', marginBottom: '25px', fontWeight: '600'}}>
                Navodila:
                <ReactQuill
                    theme="snow"
                    value={instructions}
                    onChange={setInstructions}
                    style={{marginTop: '8px', height: '200px', marginBottom: '20px'}}
                />
            </label>

            <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '12px 28px',
                        backgroundColor: '#a1c349',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '1.1rem',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8bac3a')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#a1c349')}
                >
                    Shrani
                </button>
                <button
                    onClick={onCancel}
                    style={{
                        padding: '12px 28px',
                        backgroundColor: '#e84138',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '1.1rem',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c0322f')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e84138')}
                >
                    Prekliči
                </button>
            </div>
        </div>
    );
}

export default RecipeEditForm;
