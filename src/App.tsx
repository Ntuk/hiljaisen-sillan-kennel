import './App.scss';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, firebaseApp } from './firebase/firebase.ts';
import Hero from './components/Hero/Hero.tsx';
import About from './components/About/About.tsx';
import News from './components/News/News.tsx';
import Dogs, { DogsData } from './components/Dogs/Dogs.tsx';
import InMemoriam from './components/InMemoriam/InMemoriam.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState(null);
  const [dogsData, setDogsData] = useState<DogsData[]>([]);
  // const [activeDog, setActiveDog] = useState<DogsData | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    firebaseApp;
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log('user', user);
      setUser(user || false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(false);
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <Router>
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Sidebar className={windowWidth < 934 ? 'mobile-sidebar' : ''} />
        <Routes>
          <Route path="/" element={
            <>
              <Hero/>
              <News user={user} />
              <About user={user} />
              <Dogs user={user} setDogsData={setDogsData} />
              <InMemoriam dogsData={dogsData} />
            </>
          } />
        </Routes>
        <ToastContainer />
      </>
    </Router>
  );
}

export default App;
