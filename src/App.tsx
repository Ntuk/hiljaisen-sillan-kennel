import './App.scss'
import Hero from "./components/Hero/Hero.tsx";
import About from "./components/About/About.tsx";
import News from "./components/News/News.tsx";
import Dogs from "./components/Dogs/Dogs.tsx";
import Gallery from "./components/Gallery/Gallery.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

function App() {

  return (
    <>
      <Navbar />
      <Hero />
      <News />
      <About />
      <Dogs />
      <Gallery />
    </>
  )
}

export default App
