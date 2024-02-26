import './App.scss'
import { useEffect } from "react";
import { firebaseApp } from "./firebase/firebase.ts";
import Hero from "./components/Hero/Hero.tsx";
import About from "./components/About/About.tsx";
import News from "./components/News/News.tsx";
import Dogs from "./components/Dogs/Dogs.tsx";
import Gallery from "./components/Gallery/Gallery.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
// import Admin from "./components/Admin/Admin.tsx";

function App() {

  useEffect(() => {
    firebaseApp;
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar />
      <Hero />
      <News />
      {/*<Admin />*/}
      <About />
      <Dogs />
      <Gallery />
    </>
  )
}

export default App
