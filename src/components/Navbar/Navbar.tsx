import './Navbar.scss';
import logo from '../../assets/favicon.png';
import { LiaPawSolid } from 'react-icons/lia';
import { useState, useEffect } from "react";
import { Link as ScrollLink, Events, scrollSpy } from 'react-scroll';
import { MdEmail, MdLocalPhone } from "react-icons/md";

function Navbar() {
  const [activeItem, setActiveItem] = useState<string>('etusivu');

  const navItems = ['Etusivu', 'Uutiset', 'Meistä', 'Koirat', 'Galleria'];

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

  return (
    <header>
      <div className={'header-left'}>
        <div className={'logo-container'}>
          <img src={logo} alt="Logo"/>
        </div>
        <div className={'header-text'}>
          Hiljaisen sillan kennel
        </div>
      </div>
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
              smooth={true}
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
      <div className={'header-right'}>
        <span>
          <a href={'mailto:hiljaisensillan@gmail.com'}><MdEmail className={'right-icon'} /> hiljaisensillan@gmail.com</a>
        </span>
        <span>
          <a href={'tel:+358505957437'}><MdLocalPhone className={'right-icon'} /> +358 505957437</a>
        </span>
      </div>
    </header>
  );
}

export default Navbar;
