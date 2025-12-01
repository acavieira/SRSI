import Layout from "./Layout.jsx";

import AddToday from "./AddToday";

import Calendar from "./Calendar";

import Insights from "./Insights";

import Goals from "./Goals";

import Profile from "./Profile";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    AddToday: AddToday,
    
    Calendar: Calendar,
    
    Insights: Insights,
    
    Goals: Goals,
    
    Profile: Profile,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AddToday />} />
                
                
                <Route path="/AddToday" element={<AddToday />} />
                
                <Route path="/Calendar" element={<Calendar />} />
                
                <Route path="/Insights" element={<Insights />} />
                
                <Route path="/Goals" element={<Goals />} />
                
                <Route path="/Profile" element={<Profile />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}