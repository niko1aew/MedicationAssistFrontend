import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import styles from './Sidebar.module.css';

const navItems = [
  {
    path: '/',
    label: 'Главная',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    path: '/medications',
    label: 'Лекарства',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
        <path d="m8.5 8.5 7 7"/>
      </svg>
    ),
  },
  {
    path: '/intakes',
    label: 'История приемов',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Профиль',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export const Sidebar: React.FC = observer(() => {
  const { authStore, uiStore } = useStores();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
    uiStore.closeMobileMenu();
  };

  const handleNavClick = () => {
    uiStore.closeMobileMenu();
  };

  return (
    <>
      {/* Mobile overlay */}
      {uiStore.isMobileMenuOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => uiStore.closeMobileMenu()}
        />
      )}
      
      <aside className={`${styles.sidebar} ${uiStore.isMobileMenuOpen ? styles.open : ''}`}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={handleNavClick}
                  end={item.path === '/'}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={styles.footer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Выйти</span>
          </button>
        </div>
      </aside>
    </>
  );
});

