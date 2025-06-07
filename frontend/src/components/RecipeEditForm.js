import React, {useState} from 'react';

export default function RecipeEditForm({recipe, onCancel, onSave}) {
    const [name, setName] = useState(recipe.title || '');
    const [prepTime, setPrepTime] = useState(recipe.prep_time || '');
    const [cookTime, setCookTime] = useState(recipe.cook_time || '');
    const [ingredients, setIngredients] = useState(
        Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : ''
    );
    const [instructions, setInstructions] = useState(recipe.description || '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        recipe.mainImage ? `http://localhost:3001/recipes/images/${recipe.mainImage}` : null
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSave = () => {
        const parsedIngredients = ingredients
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        const parsedInstructions = instructions.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g) || [];

        if (!name.trim() || !prepTime || !cookTime || !parsedIngredients.length || !parsedInstructions.length) {
            alert("Prosimo, izpolnite vsa obvezna polja.");
            return;
        }

        const formData = new FormData();
        formData.append('title', name);
        formData.append('prep_time', prepTime);
        formData.append('cook_time', cookTime);
        formData.append('description', instructions);
        parsedIngredients.forEach(ing => formData.append('ingredients', ing));
        if (image) {
            formData.append('images', image);
        }

        const isEdit = !!recipe._id;
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit
            ? `http://localhost:3001/api/recipes/${recipe._id}`
            : 'http://localhost:3001/api/recipes';

        setIsSaving(true);
        fetch(url, {
            method,
            body: formData,
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setIsSaving(false);
                onSave(data);
            })
            .catch(err => {
                setIsSaving(false);
                console.error('Napaka pri shranjevanju recepta:', err);
                alert("Napaka pri shranjevanju recepta.");
            });
    };

    const previewIngredients = ingredients
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

    const previewInstructions = instructions.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g) || [];

    return (
        <div>
            <div style={{marginBottom: 40}}>
                <label style={{display: 'block', marginBottom: 20}}>
                    Ime:
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ime recepta"
                        style={inputStyle}
                    />
                </label>

                <label style={{display: 'block', marginBottom: 20}}>
                    Čas priprave:
                    <input
                        type="text"
                        value={prepTime}
                        onChange={e => setPrepTime(e.target.value)}
                        placeholder="Npr. 30 min"
                        style={inputStyle}
                    />
                </label>

                <label style={{display: 'block', marginBottom: 20}}>
                    Čas kuhanja:
                    <input
                        type="text"
                        value={cookTime}
                        onChange={e => setCookTime(e.target.value)}
                        placeholder="Npr. 15 min"
                        style={inputStyle}
                    />
                </label>

                <label style={{display: 'block', marginBottom: 20}}>
                    Sestavine (vsaka v novi vrstici):
                    <textarea
                        rows={6}
                        value={ingredients}
                        onChange={e => setIngredients(e.target.value)}
                        placeholder="Vnesi sestavine..."
                        style={textareaStyle}
                    />
                </label>

                <label style={{display: 'block', marginBottom: 25, fontWeight: '600'}}>
                    Navodila (ločene s piko ali novo vrstico):
                    <textarea
                        rows={10}
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                        placeholder="Vnesi navodila..."
                        style={{...textareaStyle, minHeight: 200}}
                    />
                </label>

                <label style={{display: 'block', marginBottom: 20}}>
                    Glavna slika:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{display: 'block', marginTop: 8}}
                    />
                </label>

                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{width: 200, borderRadius: 8, marginBottom: 20}}
                    />
                )}
            </div>

            <hr style={{margin: '40px 0'}}/>
            <h2 style={{textAlign: 'center', marginBottom: 25}}>Prikaz recepta</h2>

            <h3>{name}</h3>
            <p><strong>Čas priprave:</strong> {prepTime}</p>
            <p><strong>Čas kuhanja:</strong> {cookTime}</p>

            <h4>Sestavine:</h4>
            <ul>
                {previewIngredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                ))}
            </ul>

            <h4>Navodila:</h4>
            <ol style={{paddingLeft: 20}}>
                {previewInstructions.map((inst, i) => (
                    <li key={i} style={{marginBottom: 10}}>
                        {inst.trim()}
                    </li>
                ))}
            </ol>

            <div style={{display: 'flex', justifyContent: 'center', gap: 20, marginTop: 30}}>
                <button
                    onClick={onCancel}
                    style={cancelButtonStyle}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c0322f')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e84138')}
                >
                    Prekliči
                </button>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={saveButtonStyle}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8bac3a')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#a1c349')}
                >
                    {isSaving ? "Shranjujem..." : "Shrani"}
                </button>
            </div>
        </div>
    );
}

// Styles
const inputStyle = {
    width: '100%',
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    border: '1.8px solid #a1c349',
    fontSize: '1rem',
    boxSizing: 'border-box',
};

const textareaStyle = {
    ...inputStyle,
    fontFamily: 'inherit',
    resize: 'vertical',
};

const cancelButtonStyle = {
    padding: '12px 28px',
    backgroundColor: '#e84138',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    color: '#fff',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
};

const saveButtonStyle = {
    padding: '12px 28px',
    backgroundColor: '#a1c349',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    color: '#fff',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
};
