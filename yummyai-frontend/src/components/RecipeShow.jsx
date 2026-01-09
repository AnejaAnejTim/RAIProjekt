import React, {useContext, useState, useEffect, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import TimeIcon from '../assets/time.svg';
import {UserContext} from '../userContext';
import RecipeEditForm from './RecipeEditForm';
import CommentCard from "./CommentCard";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faStar as faStarSolid,
    faStar as faStarRegular
} from '@fortawesome/free-solid-svg-icons';

function RecipeShow() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const commentInputRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    const [favLoading, setFavLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/recipes/${id}`, {
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Napaka pri nalaganju recepta');
                return res.json();
            })
            .then(data => {
                if (data.ingredients && !Array.isArray(data.ingredients)) {
                    if (typeof data.ingredients === 'string') {
                        data.ingredients = data.ingredients
                            .split(',')
                            .map(i => i.trim())
                            .filter(i => i.length > 0);
                    } else {
                        data.ingredients = [];
                    }
                }
                setCurrentRecipe(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        fetch('/api/users/favorites', {credentials: 'include'})
            .then(res => res.json())
            .then(data => {
                setFavorites(data.map(r => r._id));
                setFavLoading(false);
            })
            .catch(() => {
                setFavorites([]);
                setFavLoading(false);
            });
    }, []);

    const isFavorite = (recipeId) => favorites.includes(recipeId);

    const toggleFavorite = (recipeId) => {
        const method = isFavorite(recipeId) ? 'DELETE' : 'POST';
        fetch(`/api/users/favorites/${recipeId}`, {
            method,
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Napaka pri spreminjanju priljubljenih');
                return res.json();
            })
            .then(() => {
                setFavorites(prevFavs => {
                    if (method === 'POST') {
                        return [...prevFavs, recipeId];
                    } else {
                        return prevFavs.filter(id => id !== recipeId);
                    }
                });
            })
            .catch(err => {
                alert(err.message);
            });
    };

    const fetchComments = () => {
        fetch(`/recipes/${id}/comments`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setComments(data);
                } else {
                    setComments([]);
                }
            })
            .catch(() => setComments([]));
    };

    useEffect(() => {
        if (!id) return;
        fetchComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setCommentError('');
        if (!newComment.trim()) {
            setCommentError('Comment cannot be empty');
            return;
        }
        try {
            const res = await fetch(`/recipes/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text: newComment}),
                credentials: 'include',
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error adding comment');
            }
            setNewComment('');
            commentInputRef.current?.focus();
            fetchComments();
        } catch (err) {
            setCommentError(err.message);
        }
    };

    const startEditing = () => setIsEditing(true);
    const cancelEditing = () => setIsEditing(false);

    const saveRecipe = (updatedRecipe) => {
        fetch(`/recipes/${updatedRecipe._id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedRecipe),
        })
            .then(res => {
                if (!res.ok) throw new Error('Napaka pri shranjevanju recepta');
                return res.json();
            })
            .then(data => {
                setCurrentRecipe(data);
                setIsEditing(false);
            })
            .catch(err => {
                alert(err.message);
            });
    };

    const onDelete = () => {
        if (!window.confirm('Ste prepričani, da želite izbrisati ta recept?')) {
            return;
        }
        fetch(`/recipes/${id}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (!res.ok) throw new Error('Napaka pri brisanju recepta');
                return res.json().catch(() => null);
            })
            .then(() => {
                navigate('/recipes');
            })
            .catch(err => {
                alert(err.message);
            });
    };

    const renderInstructions = () => {
        if (!currentRecipe) return null;
        const instructionsText = currentRecipe.description || '';
        if (typeof instructionsText === 'string' && instructionsText.trim().length > 0) {
            const bulletPoints = instructionsText
                .split('.')
                .map(line => line.trim())
                .filter(line => line.length > 0);
            return (
                <ol style={{paddingLeft: '20px', fontSize: '1.1rem', lineHeight: '1.6'}}>
                    {bulletPoints.map((point, idx) => (
                        <li key={idx} style={{marginBottom: '28px'}}>
                            {point}.
                        </li>
                    ))}
                </ol>
            );
        } else {
            return <p style={{paddingLeft: '20px', fontSize: '1.1rem', lineHeight: '1.6'}}>Navodila niso na voljo.</p>;
        }
    };

    if (loading) {
        return <p style={{textAlign: 'center', marginTop: '50px'}}>Nalaganje recepta...</p>;
    }

    if (error) {
        return <p style={{color: 'red', textAlign: 'center', marginTop: '50px'}}>{error}</p>;
    }

    if (!currentRecipe) {
        return <p style={{textAlign: 'center', marginTop: '50px'}}>Recept ni bil najden.</p>;
    }

    const {
        title,
        prep_time,
        cook_time,
        ingredients = [],
        image,
        user: author,
    } = currentRecipe;

    const isOwner = user?._id === author?._id || user?.id === author;
    console.log(isOwner);

    return (
        <>
            <div
                style={{
                    maxWidth: '720px',
                    margin: '30px auto',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    color: '#333',
                }}
            >
                {image && (
                    <div style={{position: 'relative', width: '100%', overflow: 'hidden'}}>
                        <img
                            src={image}
                            alt={title}
                            style={{
                                width: '100%',
                                maxHeight: '300px',
                                objectFit: 'cover',
                                display: 'block',
                                transition: 'transform 0.3s ease',
                            }}
                            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <button
                            onClick={() => toggleFavorite(currentRecipe._id)}
                            aria-label={isFavorite(currentRecipe._id) ? 'Remove from favorites' : 'Add to favorites'}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                backgroundColor: 'rgba(255, 255, 255)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '28px',
                                color: isFavorite(currentRecipe._id) ? '#f5c518' : '#ccc',
                                transition: 'color 0.3s ease',
                                height: '50px',
                                padding: '0 15px 3px',
                                borderTopLeftRadius: '0px',
                                borderBottomLeftRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                userSelect: 'none',
                            }}
                        >
                            <FontAwesomeIcon
                                icon={isFavorite(currentRecipe._id) ? faStarSolid : faStarRegular}
                                style={{color: isFavorite(currentRecipe._id) ? '#f39c12' : '#bbb', fontSize: 36}}
                            />
                        </button>
                    </div>
                )}

                <div style={{padding: '25px 30px'}}>
                    <h2
                        style={{
                            textAlign: 'center',
                            marginBottom: '5px',
                            fontSize: '2.5rem',
                            color: '#333',
                            textShadow: '1px 1px 2px rgba(74, 124, 37, 0.4)',
                        }}
                    >
                        {title}
                    </h2>
                    {author?.username && (
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: '1.1rem',
                                fontWeight: '500',
                                color: '#666',
                                marginBottom: '20px',
                            }}
                        >
                            Avtor: {author.username}
                        </p>
                    )}

                    <div
                        style={{
                            maxWidth: '400px',
                            margin: '0 auto 30px',
                            display: 'flex',
                            justifyContent: 'space-around',
                            padding: '10px 20px',
                            border: '2px solid #a1c349',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            boxShadow: '0 2px 6px rgba(74, 124, 37, 0.15)',
                        }}
                    >
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <img src={TimeIcon} alt="time icon" style={{width: '20px', height: '20px'}}/>
                            <span>Prirava: {prep_time || 'N/A'}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <img src={TimeIcon} alt="cook time icon" style={{width: '20px', height: '20px'}}/>
                            <span>Kuhanje: {cook_time || 'N/A'}</span>
                        </div>
                    </div>

                    <section style={{marginBottom: '30px'}}>
                        <h3>Sestavine</h3>
                        <hr/>
                        <ul style={{paddingLeft: '20px'}}>
                            {Array.isArray(ingredients)
                                ? ingredients.map((item, idx) => (
                                    <li key={idx} style={{fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.5'}}>
                                        {item}
                                    </li>
                                ))
                                : (
                                    <li style={{fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.5'}}>
                                        {ingredients || 'Sestavine niso na voljo.'}
                                    </li>
                                )
                            }
                        </ul>
                    </section>

                    <hr/>

                    <section>
                        <h3>Navodila</h3>
                        {renderInstructions()}
                    </section>


                    {isEditing && (
                        <RecipeEditForm
                            recipe={currentRecipe}
                            onCancel={cancelEditing}
                            onSave={saveRecipe}
                        />
                    )}

                    {isOwner && !isEditing && (
                        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px'}}>
                            <button
                                onClick={startEditing}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#b0d16b',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                }}
                            >
                                Uredi
                            </button>
                            <button
                                onClick={onDelete}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#e84138',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                }}
                            >
                                Izbriši
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {!isEditing && (
                <div
                    style={{
                        maxWidth: '720px',
                        margin: '30px auto',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                        padding: '30px',
                        overflow: 'hidden',

                    }}
                >
                    <h3 style={{marginBottom: '18px', color: '#789c24'}}>Komentarji</h3>

                    <form onSubmit={handleCommentSubmit} style={{marginTop: '18px'}}>
                <textarea
                    ref={commentInputRef}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Dodaj komentar..."
                    style={{
                        width: '100%',
                        minHeight: '60px',
                        borderRadius: '8px',
                        border: '1px solid #a1c349',
                        padding: '10px',
                        marginBottom: '8px',
                        fontSize: '1rem',
                    }}
                />
                        {commentError && <div style={{color: 'red', marginBottom: '8px'}}>{commentError}</div>}
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '18px'}}>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#b0d16b',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 18px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                }}
                            >
                                Dodaj komentar
                            </button>
                        </div>
                    </form>
                    <ul style={{paddingLeft: 0, listStyle: 'none'}}>
                        {comments.length === 0 && <li>Brez komentarjev.</li>}
                        {comments.map((c, idx) => (
                            <li key={c._id || idx}>
                                <CommentCard comment={c}/>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>

    );
}

export default RecipeShow;