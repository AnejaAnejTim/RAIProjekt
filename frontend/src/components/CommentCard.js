import React from 'react';

function CommentCard({ comment }) {
    return (
        <div
            style={{
                background: '#ffffff',
                border: '1.5px solid #b7d97c',
                borderRadius: '12px',
                padding: '18px 22px',
                marginBottom: '18px',
                transition: 'box-shadow 0.2s',
                position: 'relative',
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
            }}>
                <div style={{
                    fontWeight: 700,
                    color: '#000000',
                    fontSize: '1.08rem',
                    marginRight: '10px',
                }}>
                    {comment.user?.username || 'Anonymous'}
                </div>
                <span style={{
                    fontSize: '0.85rem',
                    color: '#b0b0b0',
                    marginLeft: 'auto',
                }}>
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                </span>
            </div>
            <div style={{
                fontSize: '1.08rem',
                color: '#333',
                lineHeight: 1.6,
                wordBreak: 'break-word',
            }}>
                {comment.text}
            </div>
        </div>
    );
}

export default CommentCard;