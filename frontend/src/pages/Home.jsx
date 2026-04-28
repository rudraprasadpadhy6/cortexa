import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, FileText, CheckCircle, Zap } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    return (
        <div className="container animate-fade-in" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 80px)', 
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Shining Blobs */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '15%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
                borderRadius: '50%',
                zIndex: -1,
                animation: 'pulse 8s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                zIndex: -1,
                animation: 'pulse 12s ease-in-out infinite reverse'
            }}></div>

            <div style={{ maxWidth: '900px', textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <h1 className="page-title" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '3rem', letterSpacing: '-1px' }}>
                    Elevate Your Knowledge with
                </h1>

                <div className="animate-float" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    animation: 'float 6s ease-in-out infinite',
                    marginBottom: '5rem'
                }}>
                    <div style={{ width: '180px', height: '180px' }}>
                        <img
                            src="/logo.jpeg"
                            alt="Cortexa Logo"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                clipPath: 'circle(45%)',
                                transform: 'scale(1.1)',
                                mixBlendMode: theme === 'dark' ? 'screen' : 'plus-lighter',
                                filter: theme === 'dark' ? 'none' : 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{
                            fontSize: '7rem',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            letterSpacing: '-2px',
                            margin: 0,
                            lineHeight: 1,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            Corte<span className="shimmer-text" style={{
                                background: 'linear-gradient(135deg, var(--secondary), var(--primary), var(--secondary))',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginLeft: '2px',
                                animation: 'shimmer 3s linear infinite'
                            }}>x</span>a
                        </h2>
                        <div style={{ width: '100%', height: '4px', display: 'flex', gap: '8px', margin: '1rem 0' }}>
                            <div style={{ flex: 1, background: 'var(--secondary)', borderRadius: '2px' }}></div>
                            <div style={{ flex: 1, background: 'var(--primary)', borderRadius: '2px' }}></div>
                        </div>
                        <p style={{
                            fontSize: '1.5rem',
                            color: 'var(--text-secondary)',
                            fontWeight: '500',
                            letterSpacing: '1px',
                            margin: 0,
                            opacity: 0.9,
                            textAlign: 'center',
                            width: '100%'
                        }}>
                            Smart Notes. Smarter Learning.
                        </p>
                    </div>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Link
                        to={user ? "/dashboard" : "/register"}
                        className="btn btn-primary"
                        style={{
                            padding: '1.25rem 3.5rem',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {user ? "Go to Dashboard" : "Get Started"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
