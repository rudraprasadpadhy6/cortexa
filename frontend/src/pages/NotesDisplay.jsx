import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, PlusCircle, Bookmark } from 'lucide-react';

const NotesDisplay = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/notes/${id}`);
                setNote(res.data);
                setIsBookmarked(res.data.isBookmarked);
            } catch (err) {
                console.error("Error fetching note:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    const handleBookmark = async () => {
        try {
            const res = await api.patch(`/notes/${id}/bookmark`);
            setIsBookmarked(res.data.isBookmarked);
        } catch (err) {
            console.error("Error toggling bookmark:", err);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center' }}>Loading Notes...</div>;
    if (!note) return <div className="container" style={{ textAlign: 'center' }}>Note not found.</div>;

    // Simple markdown to html for display purposes
    const createMarkup = (text) => {
        let html = text.replace(/^### (.*$)/gim, '<h3>$1</h3>')
                       .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                       .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                       .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
                       .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
                       .replace(/\*(.*)\*/gim, '<i>$1</i>')
                       .replace(/\n\n/gim, '<br/><br/>')
                       .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>') // VERY basic list handling
                       .replace(/<\/ul>\n<ul>/gim, '');
        return { __html: html };
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <Link to="/upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <PlusCircle size={16} /> Create Content
                    </Link>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={handleBookmark} 
                        className="btn btn-outline" 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)',
                            borderColor: isBookmarked ? 'var(--primary)' : 'var(--glass-border)'
                        }}
                    >
                        <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} /> 
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                    <button onClick={() => window.print()} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        Export as PDF
                    </button>
                </div>
            </div>
            <div className="glass-panel text-left">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{note.title}</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    Generated on {new Date(note.createdAt).toLocaleDateString()}
                </p>
                <div className="notes-content" dangerouslySetInnerHTML={createMarkup(note.content)}></div>
            </div>
        </div>
    );
};

export default NotesDisplay;
