import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Scissors, Camera, Ruler, Layers, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const user = authService.getCurrentUser();

  const features = [
    {
      icon: <Camera size={24} />,
      title: 'AI Photo Estimator',
      description: 'Upload a front-facing full-body photo and get instant estimated chest, waist, and hip sizing parameters.'
    },
    {
      icon: <Ruler size={24} />,
      title: 'Manual Measurement Vault',
      description: 'Enter and record your custom body measurements: height, chest, waist, inseam, sleeves, and shoulder line.'
    },
    {
      icon: <Layers size={24} />,
      title: 'Fabric Suitability Engine',
      description: 'Find perfect material pairings depending on weather conditions (Summer, Winter), occasion, and target comfort levels.'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Printable Pattern Drafts',
      description: 'Instantly download custom tailoring pattern metrics structured in structured JSON representing fitment specs.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar toggleSidebar={() => {}} />

      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {/* Hero Section */}
        <section style={{
          padding: '5rem 0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
            padding: '0.5rem 1rem',
            borderRadius: '100px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#818cf8',
            marginBottom: '1rem',
            animation: 'pulse-glow 3s infinite'
          }}>
            <Scissors size={14} />
            <span>Introducing Smart Virtual Tailoring</span>
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            lineHeight: 1.1,
            fontWeight: 800,
            maxWidth: '800px',
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Perfect Fitting, <span className="text-gradient-primary">AI-Powered</span> Sizing & Recommendation
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '650px',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Generate clothing patterns, calculate yardage requirements, and discover optimal fabrics using custom measurement metrics or smart image sizing.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              Access Dashboard
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.25rem',
            marginBottom: '3rem',
            fontWeight: 700
          }}>
            Intelligent Tailoring <span className="text-gradient-cyan">Capabilities</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--primary-glow)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600 }}>{feature.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Project Section */}
        <section className="glass-panel" style={{
          padding: '3rem',
          margin: '3rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'var(--secondary)',
            filter: 'blur(75px)',
            opacity: 0.12,
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem', color: '#fff' }}>How it Works</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Our virtual tailoring pipeline automates traditional clothing fitment. First, user dimensions are recorded either through direct manual entries or using a mock computer-vision photo processing analyzer.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                These dimensions supply our sizing lookup tables and yardage calculations, generating custom blueprints and suggesting appropriate high-comfort fabrics instantly.
              </p>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--primary)' }}>
                <span>Create your profile</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🤖👗</span>
              <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI Measurement Estimator</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Upload a portrait image in a fitted outfit to trigger the size estimator algorithms.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
