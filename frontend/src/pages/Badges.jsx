import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Award, Star, Zap, Shield, Trophy } from 'lucide-react';

const Badges = () => {
    const { user } = useContext(AuthContext);

    const badgeIcons = {
        'Fast Learner': <Zap size={40} color="#f59e0b" />,
        'Quiz Master': <Trophy size={40} color="#fbbf24" />,
        'Note Taker': <Star size={40} color="#3b82f6" />,
        'Consistent': <Shield size={40} color="#10b981" />,
        'default': <Award size={40} color="#fbbf24" />
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Award size={36} color="#fbbf24" /> Badges & Achievements
                </h1>
                <p className="page-subtitle">Your collection of earned milestones and honors.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {user.badges && user.badges.length > 0 ? user.badges.map((badge, idx) => (
                    <div key={idx} className="glass-panel badge-card-detailed" style={{
                        padding: '2.5rem 2rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'default'
                    }}>
                        <div style={{ 
                            width: '100px', 
                            height: '100px', 
                            background: 'rgba(251, 191, 36, 0.1)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: '2px solid rgba(251, 191, 36, 0.2)'
                        }}>
                            {badgeIcons[badge] || badgeIcons['default']}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{badge}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Achievement Unlocked</p>
                        </div>
                        <div style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: '700', 
                            background: 'rgba(16, 185, 129, 0.1)', 
                            color: '#10b981', 
                            padding: '0.4rem 1rem', 
                            borderRadius: '20px' 
                        }}>
                            MASTERED
                        </div>
                    </div>
                )) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)', border: '2px dashed var(--border)', borderRadius: '32px' }}>
                        <Award size={64} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>No badges yet!</h3>
                        <p style={{ marginTop: '0.5rem' }}>Start generating quizes and notes to unlock your first achievement.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Badges;
