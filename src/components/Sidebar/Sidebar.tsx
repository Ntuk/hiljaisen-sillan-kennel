import React from 'react';
import './Sidebar.scss';
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { TbMapPin2 } from "react-icons/tb";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={`sidebar ${className}`}>
      <a target='_blank' href='https://www.facebook.com/hirvonen.minna'>
        <FaFacebookSquare className='sidebar-icon'/>
      </a>
      <a target='_blank' href='https://www.instagram.com/hiljaisensillankennel/'>
        <FaInstagram className='sidebar-icon'/>
      </a>
      <a target='_blank' href='https://www.google.com/maps/place/V%C3%A4rtsil%C3%A4nkatu+12a,+80200+Joensuu/@62.5940714,29.7882153,19.29z/data=!4m6!3m5!1s0x469b866df21bde75:0x90d68988804b3183!8m2!3d62.594038!4d29.788405!16s%2Fg%2F11ks3h8m89?entry=ttu'>
        <TbMapPin2 className='sidebar-icon'/>
      </a>
    </div>
  );
}

export default Sidebar;
