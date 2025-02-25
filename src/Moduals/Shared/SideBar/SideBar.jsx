import React, { useEffect, useState ,useContext} from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/sideBarLogo.png';
import styles from './SideBar.module.css';
import { AuthContext } from '../../../context/AuthContext/AuthContext';

export default function SideBar( ) {
  
     const {  loginData} = useContext(AuthContext)
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 900);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`${styles.sidebarWrapper} ${isCollapsed ? styles.collapsed : ''}`}>
      <Sidebar collapsed={isCollapsed} className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <button className={styles.logoButton} onClick={toggleCollapse}>
            <Link to="/dashboard">
              <img src={logo} alt="logo" className={styles.logo} />
            </Link>
          </button>
        </div>

        <Menu className={styles.menu}>
          <MenuItem
            icon={<i className="fa-solid fa-house" />}
            component={<Link to="/dashboard" />}
            className={location.pathname === "/dashboard" ? styles.activeMenuItem : styles.menuItem}
          >
            Home
          </MenuItem>

          {loginData?.userGroup === "SuperAdmin" && (
            <MenuItem
              icon={<i className="fa-solid fa-user-group" />}
              component={<Link to="/dashboard/users" />}
              className={location.pathname === "/dashboard/users" ? styles.activeMenuItem : styles.menuItem}
            >
              Users
            </MenuItem>
          )}

          <MenuItem
            icon={<i className="fa fa-columns" />}
            component={<Link to="/dashboard/recipes" />}
            className={location.pathname === "/dashboard/recipes" ? styles.activeMenuItem : styles.menuItem}
          >
            Recipes
          </MenuItem>

          {loginData?.userGroup === "SuperAdmin" && (
            <MenuItem
              icon={<i className="fa-solid fa-calendar-days" />}
              component={<Link to="/dashboard/categories" />}
              className={location.pathname === "/dashboard/categories" ? styles.activeMenuItem : styles.menuItem}
            >
              Categories
            </MenuItem>
          )}

          {loginData?.userGroup !== "SuperAdmin" && (
            <MenuItem
              icon={<i className="fa-regular fa-heart" />}
              component={<Link to="/dashboard/favorites" />}
              className={location.pathname === "/dashboard/favorites" ? styles.activeMenuItem : styles.menuItem}
            >
              Favorites
            </MenuItem>
          )}

          <MenuItem
            icon={<i className="fa-solid fa-unlock-keyhole" />}
            onClick={() => console.log("Change Password")}
            className={styles.menuItem}
          >
            Change Password
          </MenuItem>

          <MenuItem
            icon={<i className="fa-solid fa-right-from-bracket" />}
            onClick={logOut}
            className={styles.menuItem}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}
