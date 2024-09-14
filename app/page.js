'use client';
import { useState } from 'react';
import Link from 'next/link';

// Recursive component to render JSON data in a readable format with styled subheadings
const RenderJson = ({ data }) => {
  if (typeof data === 'string' || typeof data === 'number') {
    return <p>{data}</p>;
  }

  if (Array.isArray(data)) {
    return (
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <RenderJson data={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <div style={{ marginLeft: '20px' }}>
        {Object.entries(data).map(([key, value], index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong style={{
              background: 'linear-gradient(to right, #00c6ff, #0072ff)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: '18px'
            }}>{key}:</strong>
            <RenderJson data={value} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function Home() {
  const [jobTitle, setJobTitle] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jobtool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ content: jobTitle }]),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      let data = await response.text();
      console.log(data);

      if (typeof data === 'object') {
        throw new Error('Unexpected response format');
      }

      setSummary(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        display: 'flex', whiteSpace: 'pre-wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        background: 'linear-gradient(to right, rgba(20, 30, 48, 0.7), rgba(36, 59, 85, 0.9)), url(https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDZneW5la3Q4am9hcWMzb3RuM2c2bHgwaGxzaWI2c3p5ZmdtZGw2eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FlodpfQUBSp20/giphy.webp)',
        backgroundPosition: 'center',
        minHeight: '100vh',
        fontFamily: 'Poppins, sans-serif',
        position: 'relative'
      }}>

      <img
        src="/footerlogo.svg"  
        alt="Logo"
        style={{
          position: 'fixed',
          top: '5px',
          left: '20px',
          width: '220px',
          height: '150px',
          cursor: 'pointer',
        }}
      />

      <h1
        style={{
          fontSize: '52px',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #00c6ff, #0072ff)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textAlign: 'center',
        }}>
        Roadmap
      </h1>
      <h3
        style={{
          padding: '20px',
          fontSize: '15px',
          color: '#ffffff',
        }}>
        Enter your desired career to obtain a detailed roadmap to achieve it!
      </h3>

      <form onSubmit={handleSubmit}
        style={{
          marginBottom: '20px', display: 'flex',
          flexDirection: 'column', alignItems: 'center'
        }}>

        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Enter any career-related questions"
          style={{
            padding: '20px', width: '50rem', border: '2px solid', borderColor: 'wheat', borderRadius: '10px'
          }}
          required
        />
        <p style={{ padding: '10px' }}></p>
        <div className='a' style={{ alignItems: 'center', paddingLeft: '40%' }}>

          <button type="submit" style={{
            marginTop: '10px',
            backgroundColor: 'grey',
            padding: '10px 30px',
            borderRadius: '10px',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}>
            {loading ? 'Loading...' : 'Search'}
          </button>

        </div>

      </form>
      {error && <p style={{ color: 'red', fontFamily: 'Poppins, sans-serif' }}>Error: {error}</p>}

      {summary ? (
        <div
          style={{
            marginBottom: '20px',
            padding: '20px',
            border: '1px solid #0072ff',
            borderRadius: '10px',
            backgroundColor: '#1E2A38',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            color: '#ffffff',
            maxWidth: '80%',
            textAlign: 'left',
            fontSize: '18px',
            lineHeight: '1.6',
            fontFamily: 'Poppins, sans-serif',
          }}>
          <RenderJson data={summary.replaceAll('**', '')} />
        </div>
      ) : (
        !loading && <p></p>
      )}

      {/* Back to Home button */}
      <Link href="/" passHref>
        <button
          style={{
            marginTop: '30px',
            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
            color: '#fff',
            padding: '10px 30px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Back to Home
        </button>
      </Link>

    </main>
  );
}
