import './Adminbar.scss';
import { LiaPawSolid } from 'react-icons/lia';
import { useState, useEffect } from "react";
import { Link as ScrollLink, Events, scrollSpy } from 'react-scroll';
import { auth } from '../../firebase/firebase.ts'; // Import the Firebase auth module

function Adminbar() {
  const [activeItem, setActiveItem] = useState<string>('etusivu');

  const navItems = ['Uutiset', 'Meistä', 'Koirat', 'Kirjaudu ulos'];

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

  const handleSignOut = () => {
    console.log('yee?')
    auth.signOut().then(() => {
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <header>
      <div className={'header-middle'}>
        {navItems.map((item: string, index: number) => (
          <div
            key={index}
            className={`nav-item ${activeItem === item.toLowerCase() ? 'active' : ''}`}
            tabIndex={0}
            onClick={(e) => {
              console.log('Sign out clicked', e);
              handleSignOut();
            }}
            role="button"
          >
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
              offset={-200}
            >
              {item}
            </ScrollLink>
          </div>
        ))}
      </div>
    </header>
  );
}

export default Adminbar;
