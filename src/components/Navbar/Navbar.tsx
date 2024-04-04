import './Navbar.scss';
import logo from '../../assets/favicon.png';
import { LiaPawSolid } from 'react-icons/lia';
import { useState, useEffect } from "react";
import { Link as ScrollLink, Events, scrollSpy } from 'react-scroll';
import { Link } from 'react-router-dom';
import { MdEmail, MdLocalPhone } from "react-icons/md";
import { IoLogInOutline, IoLogOutOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { auth, googleAuthProvider } from "../../firebase/firebase.ts";
import { signInWithPopup } from "firebase/auth";

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [activeItem, setActiveItem] = useState<string>('etusivu');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = ['Etusivu', 'Uutiset', 'Meistä', 'Koirat'];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updateActiveItem();
    };

    window.addEventListener('scroll', handleScroll);

    Events.scrollEvent.register('end', (to) => {
      setActiveItem(to);
      updateActiveItem();
    });

    scrollSpy.update();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  useEffect(() => {
    setShowDropdown(false);
  }, [onLogout]);

  const updateActiveItem = () => {
    const scrollSections = document.querySelectorAll('[data-scroll]');
    let currentActiveItem = '';
    scrollSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (
        rect.top <= 150 + 200 &&
        rect.bottom >= 150 + 200
      ) {
        currentActiveItem = section.getAttribute('data-scroll') || '';
      }
    });
    setActiveItem(currentActiveItem);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <header className={windowWidth < 1024 ? 'center-content' : ''}>
      <Link to="/">
        <div className={'header-left'}>
          <div className={'logo-container'}>
            <img src={user ? user.photoURL : logo} alt="Logo" className={user ? 'user' : ''} />
          </div>
          <div className={`header-text ${user ? 'admin' : ''}`}>
            {user ? `Hei ${user.displayName.split(' ')[0]}` : 'Hiljaisen Sillan Kennel'}
          </div>
        </div>
      </Link>
      {windowWidth > 1024 && (
        <div className={'header-middle'}>
          {navItems.map((item: string, index: number) => (
            <div
              key={index}
              className={`nav-item ${activeItem === item.toLowerCase() ? 'active' : ''}`}
              tabIndex={0}>
              {(activeItem === item.toLowerCase()) ? (
                <LiaPawSolid
                  className={'icon'}
                  style={{color: '#c0967d', transform: `rotate(30deg)`}}
                />
              ) : null}
              <ScrollLink
                to={item.toLowerCase()}
                smooth={false}
                duration={100}
                spy={true}
                activeClass="active"
                offset={-100}
              >
                {item}
              </ScrollLink>
            </div>
          ))}
        </div>
      )}
      <div className={'header-right'}>
        {windowWidth <= 1024 ? (
          <div className={'hamburger-menu'} onClick={toggleDropdown}>
            <GiHamburgerMenu />
          </div>
        ) : (
          <>
            <span>
              <a href={'mailto:hiljaisensillan@gmail.com'}><MdEmail
                className={'right-icon'}/> hiljaisensillan@gmail.com</a>
            </span>
            <span>
              <a href={'tel:+358505957437'}><MdLocalPhone className={'right-icon'}/> +358 505957437</a>
            </span>
            {user ? (
              <Link to="/" onClick={onLogout}>
                <IoLogOutOutline className={'right-icon'}/> Kirjaudu ulos
              </Link>
            ) : (
              <Link to="#" onClick={handleSignInWithGoogle}>
                <IoLogInOutline className={'right-icon'}/> Kirjaudu sisään
              </Link>
            )}
          </>
        )}
      </div>
      <div className={`burger-menu ${showDropdown ? '' : 'hidden'}`}>
        {navItems.map((item: string, index: number) => (
          <div className={'burger-item'} key={index}>
            <ScrollLink
              to={item.toLowerCase()}
              smooth={false}
              duration={100}
              spy={true}
              activeClass="active"
              offset={-100}
            >
              {item}
            </ScrollLink>
            {(activeItem === item.toLowerCase()) ? (
              <LiaPawSolid
                className={'icon'}
                style={{color: '#c0967d', transform: `rotate(30deg)`}}
              />
            ) : null}
          </div>
        ))}
        <div className={'burger-item login'}>
          {!user ? (
            <Link to="#" onClick={handleSignInWithGoogle}>
              <IoLogInOutline className={'right-icon'}/> Kirjaudu sisään
            </Link>
          ) : (
            <Link to="/" onClick={onLogout}>
              <IoLogOutOutline className={'right-icon'}/> Kirjaudu ulos
            </Link>
          ) }
        </div>
      </div>
    </header>
  );
}

export default Navbar;
