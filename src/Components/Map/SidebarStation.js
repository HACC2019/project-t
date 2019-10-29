import React from 'react'
import sidebarStyles from '../../styles/sidebar.css';

export default function SidebarStation({station}) {
  return (
    <div key={station.ID} className={sidebarStyles.item}>
      <div className={sidebarStyles.property}>{station.Property}</div>
      <div className={sidebarStyles.city}>{station.City}</div>
    </div>
  );
}
