import React, { useState } from 'react';
import { db, auth } from './firebaseConfig'; // Import from your firebaseConfig.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { formattedDate } from './utils.js'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up modes
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()


  // Handle form submission (either login or signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
        navigate('/')
      } else {
        // Handle sign up
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Signup successful!');
        //create a Firebase document for the user --- I don't think I need this anymore
        const userDocRef = doc(db, 'users', auth.currentUser.uid)
        await setDoc(userDocRef,{
            date: formattedDate(),
            count: 0
        })
      }
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Turn off the loading spinner
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

      {/* Show error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <button type="button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Don’t have an account? Sign up' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default Login;
