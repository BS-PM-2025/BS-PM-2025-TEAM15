import Sidebar from './sidebar';
import '../App.css'; 
import { Outlet } from 'react-router-dom';

function Layout  ()  {
    return (
    <div className="layout">
        <div className="app-wrapper">
          <div className="content-wrapper">
            <Sidebar className="sidebar" />
            <div className="main-content">
              <Outlet /> {/* This renders nested routes */}
            </div>
          </div>
        </div>
      </div>
    )
  
};

export default Layout;