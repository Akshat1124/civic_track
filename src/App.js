import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
Chart.register(...registerables);

// --- MOCK DATA ---

const mockComplaintData = { 'C-12345': { id: 'C-12345', submittedBy: 'Akshat Srivastava', category: 'Garbage & Sanitation', address: 'Near Sigra Police Station, Varanasi, Uttar Pradesh', description: 'Large pile of garbage has not been collected for over a week...', status: 'Resolved', history: [ { date: '2025-07-28', status: 'Complaint Submitted', details: 'Initial complaint filed by the citizen.' }, { date: '2025-07-29', status: 'Assigned to Department', details: 'Complaint assigned to the Sanitation Department.' }, { date: '2025-07-30', status: 'Work in Progress', details: 'Sanitation crew dispatched.' }, { date: '2025-07-30', status: 'Resolved', details: 'The garbage has been cleared.' }, ] } };
const mockWardData = { '10': { corporator: 'Smt. Anita Singh', mobile: '9876543210', recentWork: ['New streetlights installed on main road.', 'Repaired major water pipeline leakage.'] }, '22': { corporator: 'Shri. Ramesh Gupta', mobile: '9871234567', recentWork: ['Road resurfacing project completed.', 'Conducted sanitation drive.'] } };

// --- HELPER & UI COMPONENTS ---

const StepCard = ({ icon, title, description, iconColorClass }) => (
    <div className="step-card bg-gray-50 dark:bg-gray-800 p-8 rounded-xl text-center border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 transition-transform duration-300">
        <div className={`text-4xl mb-4 ${iconColorClass}`}>{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const StatCard = ({ title, value, valueColorClass, subtext, suffix, duration = 2, decimals = 0 }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    return (
        <div ref={ref} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{title}</h3>
            <p className={`text-5xl font-bold ${valueColorClass}`}>
                {inView ? <CountUp end={value} duration={duration} separator="," decimals={decimals} /> : '0'}
                {suffix}
                {subtext && <span className="text-3xl"> {subtext}</span>}
            </p>
        </div>
    );
};

const LanguageTranslator = () => {
    useEffect(() => {
        const initializeGoogleTranslate = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement({ pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE }, 'google_translate_element');
            }
        };
        if (!window.googleTranslateElementInit) {
            window.googleTranslateElementInit = initializeGoogleTranslate;
        }
        initializeGoogleTranslate();
    }, []);
    return <div id="google_translate_element" className="w-full"></div>;
};

const ThemeToggle = ({ theme, setTheme }) => {
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
    return (
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            {theme === 'dark' ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> )}
        </button>
    );
};

// --- AUTHENTICATION & ACCOUNT COMPONENTS ---

const AuthModal = ({ onClose, onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const modalRef = useRef(null);
    useEffect(() => { const handleEsc = (event) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);
    useEffect(() => { const handleClickOutside = (event) => { if (modalRef.current && !modalRef.current.contains(event.target)) onClose(); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, [onClose]);
    const handleLogin = (e) => { e.preventDefault(); onLoginSuccess({ name: 'Akshat Srivastava', email: e.target.email.value }); onClose(); };
    const handleRegister = (e) => { e.preventDefault(); onLoginSuccess({ name: e.target.name.value, email: e.target.email.value }); onClose(); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b dark:border-gray-700"><h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{isLoginView ? 'Login to Your Account' : 'Create a New Account'}</h2></div>
                <div className="p-6">
                    {isLoginView ? ( <form onSubmit={handleLogin} className="space-y-4"><div><label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label><input type="email" id="email" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required /></div><div><label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label><input type="password" id="password" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required /></div><button type="submit" className="w-full cta-button bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600 text-lg">Login</button></form> ) : ( <form onSubmit={handleRegister} className="space-y-4"><div><label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label><input type="text" id="name" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label><input type="email" id="email" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required /></div><div><label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label><input type="password" id="password" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required /></div><button type="submit" className="w-full cta-button bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600 text-lg">Register</button></form> )}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">{isLoginView ? "Don't have an account? " : "Already have an account? "}<button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-orange-600 hover:text-orange-500">{isLoginView ? 'Register' : 'Login'}</button></p>
                </div>
            </div>
        </div>
    );
};

const AccountDropdown = ({ isLoggedIn, user, onLoginClick, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const loggedOutItems = [ { label: 'Login / Register', action: onLoginClick } ];
    const loggedInItems = [ { href: '#', label: 'Profile Settings' }, { href: '#', label: 'My Complaints' }, { label: 'Sign Out', action: onLogout, isSignOut: true } ];
    const menuItems = isLoggedIn ? loggedInItems : loggedOutItems;
    useEffect(() => { const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);
    const getInitials = (name) => { if (!name) return 'U'; const names = name.split(' '); return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name[0]; };
    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-bold">
                 {isLoggedIn ? getInitials(user.name) : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                    {isLoggedIn && ( <div className="px-4 py-2 border-b dark:border-gray-700"><p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p><p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p></div> )}
                    {menuItems.map(item => ( <a key={item.label} href={item.href || '#'} onClick={(e) => { if (item.action) { e.preventDefault(); item.action(); setIsOpen(false); } else { setIsOpen(false); } }} className={`block px-4 py-2 text-sm ${item.isSignOut ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{item.label}</a> ))}
                </div>
            )}
        </div>
    );
};

// --- NAVIGATION COMPONENTS ---

const Sidebar = ({ isOpen, onClose, theme, setTheme, onLoginClick }) => {
    const sidebarNavSections = [ { title: 'Public Services', links: [ { href: '#file-complaint', label: 'File a Complaint', icon: '📝' }, { href: '#track-complaint', label: 'Track a Complaint', icon: '🔍' }, { href: '#', label: 'Pay Property Tax', icon: '🏠' } ] }, { title: 'Information', links: [ { href: '#', label: 'Public Notices', icon: '📢' }, { href: '#', label: 'Departments', icon: '🏢' } ] }, { title: 'Help & Support', links: [ { href: '#', label: 'FAQ', icon: '❓' }, { href: '#footer', label: 'Contact Us', icon: '📞' } ] } ];
    useEffect(() => { const handleEsc = (event) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);
    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><a href="#home" className="text-2xl font-bold text-gray-800 dark:text-gray-100" onClick={onClose}>CIVIC <span className="text-orange-500">TRACK</span></a><button onClick={onClose} className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
                <div className="p-4 border-b dark:border-gray-700"><a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); onClose(); }} className="flex items-center w-full text-left py-2 px-3 text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 rounded-md transition-colors"><span className="mr-3 text-lg">👤</span><span>Login / Register</span></a></div>
                <nav className="py-4 flex-grow overflow-y-auto">
                    {sidebarNavSections.map((section, index) => (
                        <div key={index} className="px-5 py-2">
                            <h3 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">{section.title}</h3>
                            <ul className="mt-2 space-y-1">{section.links.map(link => ( <li key={link.href}><a href={link.href} onClick={onClose} className="flex items-center py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 rounded-md transition-colors"><span className="mr-3 text-lg">{link.icon}</span><span>{link.label}</span></a></li> ))}</ul>
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <div><h3 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2">Settings</h3><div className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800"><span className="text-sm text-gray-700 dark:text-gray-300">Language</span><LanguageTranslator /></div></div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800"><span className="text-sm text-gray-700 dark:text-gray-300">Theme</span><ThemeToggle theme={theme} setTheme={setTheme} /></div>
                </div>
            </div>
        </>
    );
};

const Header = ({ theme, setTheme, isLoggedIn, user, onLoginClick, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const topNavLinks = [ { href: '#home', label: 'Home' }, { href: '#how-it-works', label: 'How It Works' }, { href: '#stats', label: 'Statistics' }, { href: '#file-complaint', label: 'File Complaint'} ];
    return (
        <>
            <header id="home" className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-30 shadow-sm dark:shadow-md dark:shadow-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700 dark:text-gray-200 focus:outline-none p-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 transform hover:scale-110 transition-all duration-200"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                            <a href="#home" className="text-2xl font-bold text-gray-800 dark:text-gray-100">CIVIC <span className="text-orange-500">TRACK</span></a>
                        </div>
                        <div className="flex items-center gap-4">
                            <nav className="hidden md:flex items-center space-x-8">
                                {topNavLinks.map(link => ( <a key={link.href} href={link.href} className="text-gray-600 dark:text-gray-300 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors">{link.label}</a> ))}
                            </nav>
                            <div className="hidden md:block"><AccountDropdown isLoggedIn={isLoggedIn} user={user} onLoginClick={onLoginClick} onLogout={onLogout} /></div>
                        </div>
                    </div>
                </div>
            </header>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} theme={theme} setTheme={setTheme} onLoginClick={onLoginClick} />
        </>
    );
};

// --- HOMEPAGE SECTION COMPONENTS ---

const HeroSection = () => ( <section id="home" className="pt-32 pb-20 bg-white dark:bg-gray-900"><div className="container mx-auto px-6 text-center"><h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 leading-tight mb-4">Your Voice for a Better City.</h1><p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">File and track public service complaints with the Nagar Nigam and see real-time progress. Making civic action simple and transparent.</p><div className="flex flex-col sm:flex-row justify-center items-center gap-4"><a href="#file-complaint" className="cta-button w-full sm:w-auto bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600">File a New Complaint</a><a href="#track-complaint" className="cta-button w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Track Your Complaint</a></div></div></section> );
const HowItWorks = () => { const steps = [ { icon: '📝', title: '1. Register Complaint', description: 'Submit your complaint through our simple online form with all the necessary details.', color: 'text-orange-500' }, { icon: '🎟️', title: '2. Receive Tracking ID', description: 'Get a unique ID instantly to track the progress of your complaint at any time.', color: 'text-orange-500' }, { icon: '⚙️', title: '3. Official Review', description: 'Your complaint is assigned to the relevant department for review and action.', color: 'text-orange-500' }, { icon: '✔️', title: '4. Get Resolution', description: 'Receive updates and a final resolution. Provide feedback on the service.', color: 'text-green-500' } ]; return ( <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900"><div className="container mx-auto px-6"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">How It Works</h2><p className="text-lg text-gray-600 dark:text-gray-300 mt-2">A simple and transparent process in four easy steps.</p></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{steps.map((step, index) => ( <StepCard key={index} icon={step.icon} title={step.title} description={step.description} iconColorClass={step.color} /> ))}</div></div></section> ); };
const Footer = () => ( <footer id="footer" className="bg-gray-800 dark:bg-black/50 text-white"><div className="container mx-auto px-6 py-12"><div className="grid grid-cols-1 md:grid-cols-4 gap-8"><div><h3 className="text-xl font-bold mb-4">CIVIC <span className="text-orange-400">TRACK</span></h3><p className="text-gray-400">Empowering citizens through technology for a more responsive and transparent governance.</p></div><div><h4 className="font-semibold text-lg mb-4">Quick Links</h4><ul className="space-y-2"><li><a href="#home" className="text-gray-400 hover:text-white">Home</a></li><li><a href="#file-complaint" className="text-gray-400 hover:text-white">File Complaint</a></li><li><a href="#track-complaint" className="text-gray-400 hover:text-white">Track Status</a></li><li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li></ul></div><div><h4 className="font-semibold text-lg mb-4">Legal</h4><ul className="space-y-2"><li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li><li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li></ul></div><div><h4 className="font-semibold text-lg mb-4">Contact Us</h4><address className="text-gray-400 not-italic">Nagar Nigam Varanasi Head Office<br />Sigra, Varanasi<br />Uttar Pradesh, 221010</address><a href="mailto:contact@civictrack.gov.in" className="text-gray-400 mt-2 hover:text-white inline-block">contact@civictrack.gov.in</a></div></div><div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500"><p>&copy; 2025 CIVIC TRACK. All Rights Reserved.</p></div></div></footer> );

// --- DYNAMIC SECTION COMPONENTS ---

const ComplaintStatusPage = ({ complaint, onBack }) => { const getStatusColor = (status) => { switch (status) { case 'Resolved': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'; case 'Work in Progress': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'; default: return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'; } }; return ( <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full"><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Complaint Status</h3><button onClick={onBack} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Search Again</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 border rounded-lg dark:border-gray-700"><div><p className="text-sm text-gray-500 dark:text-gray-400">Category</p><p className="font-semibold">{complaint.category}</p></div><div><p className="text-sm text-gray-500 dark:text-gray-400">Status</p><p className={`font-semibold px-2 py-1 text-xs inline-block rounded-full ${getStatusColor(complaint.status)}`}>{complaint.status}</p></div><div className="md:col-span-2"><p className="text-sm text-gray-500 dark:text-gray-400">Location</p><p className="font-semibold">{complaint.address}</p></div><div className="md:col-span-2"><p className="text-sm text-gray-500 dark:text-gray-400">Description</p><p>{complaint.description}</p></div></div><div><h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Complaint History</h4><ol className="relative border-l border-gray-200 dark:border-gray-700">{complaint.history.map((item, index) => ( <li key={index} className="mb-10 ml-6"><span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"><svg className="w-3 h-3 text-blue-800 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg></span><h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{item.status}</h3><time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{item.date}</time><p className="text-base font-normal text-gray-500 dark:text-gray-400">{item.details}</p></li> ))}</ol></div></div> ); };
const ComplaintTracker = () => { const [trackingId, setTrackingId] = useState(''); const [foundComplaint, setFoundComplaint] = useState(null); const [searchStatus, setSearchStatus] = useState(''); const [isLoading, setIsLoading] = useState(false); const handleSubmit = (e) => { e.preventDefault(); setIsLoading(true); setSearchStatus(''); setTimeout(() => { const complaint = mockComplaintData[trackingId.trim().toUpperCase()]; if (complaint) { setFoundComplaint(complaint); } else { setFoundComplaint(null); setSearchStatus('not_found'); } setIsLoading(false); }, 1500); }; const handleSearchAgain = () => { setFoundComplaint(null); setTrackingId(''); setSearchStatus(''); }; return ( <section id="track-complaint" className="py-16 bg-gray-50 dark:bg-gray-800/50"><div className="container mx-auto px-6"><div className="max-w-3xl mx-auto">{foundComplaint ? <ComplaintStatusPage complaint={foundComplaint} onBack={handleSearchAgain} /> : ( <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8"><h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Check Your Complaint Status</h3><p className="text-center text-gray-500 dark:text-gray-400 mb-6">Have a tracking ID? Enter it below to see the latest updates.</p><form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3"><input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="Enter tracking ID (e.g., C-12345)" className="w-full text-lg px-5 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" /><button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-gray-800 dark:bg-orange-600 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-gray-900 dark:hover:bg-orange-700 transition flex items-center justify-center disabled:opacity-50">{isLoading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Track'}</button></form>{searchStatus === 'not_found' && !isLoading && <div className="mt-4 text-center text-red-500">Complaint ID not found. Please check the ID and try again.</div>}</div> )}</div></div></section> ); };
const Statistics = ({ theme }) => { const chartRef = useRef(null); const chartInstance = useRef(null); const stats = [ { title: 'Total Complaints Resolved', value: 14289, color: 'text-green-600' }, { title: 'Average Resolution Time', value: 5.2, subtext: 'Days', color: 'text-orange-500', duration: 3, decimals: 1 }, { title: 'Citizen Satisfaction', value: 92, suffix: '%', color: 'text-yellow-500' } ]; useEffect(() => { if (chartRef.current) { if (chartInstance.current) { chartInstance.current.destroy(); } const ctx = chartRef.current.getContext('2d'); const legendColor = theme === 'dark' ? '#D1D5DB' : '#4B5563'; chartInstance.current = new Chart(ctx, { type: 'doughnut', data: { labels: ['Resolved', 'In Progress', 'New'], datasets: [{ data: [70, 20, 10], backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(234, 179, 8, 0.8)'], borderColor: theme === 'dark' ? '#111827' : '#FFFFFF', borderWidth: 4, }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { padding: 20, color: legendColor, font: { size: 14, family: 'Inter' } } }, tooltip: { enabled: true, backgroundColor: '#1F2937', titleFont: { size: 16, weight: 'bold', family: 'Inter' }, bodyFont: { size: 14, family: 'Inter' }, padding: 12, cornerRadius: 8, callbacks: { label: (context) => `${context.label || ''}: ${context.parsed || 0}%` } } } } }); } return () => { if (chartInstance.current) { chartInstance.current.destroy(); } }; }, [theme]); return ( <section id="stats" className="py-20 bg-gray-50 dark:bg-gray-800/50"><div className="container mx-auto px-6"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Live Statistics</h2><p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Transparency in action. See our performance in real-time.</p></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"><div className="space-y-8">{stats.map((stat, index) => ( <StatCard key={index} {...stat} /> ))}</div><div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg"><h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Complaint Status Overview</h3><div className="relative w-full max-w-xs mx-auto h-72"><canvas ref={chartRef}></canvas></div></div></div></div></section> ); };
const FileComplaintSection = () => { const [formData, setFormData] = useState({ fullName: '', mobile: '', address: '', category: '', description: '' }); const [selectedFile, setSelectedFile] = useState(null); const [formStatus, setFormStatus] = useState({ message: '', type: '' }); const [isFetchingLocation, setIsFetchingLocation] = useState(false); const complaintCategories = [ "Garbage & Sanitation", "Streetlight Not Working", "Water Leakage / No Water", "Road Potholes", "Stray Animals", "Illegal Construction", "Other" ]; const handleInputChange = (e) => { const { id, value } = e.target; setFormData(prev => ({ ...prev, [id]: value })); }; const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]); }; const handleFetchLocation = () => { if (!navigator.geolocation) { setFormStatus({ message: 'Geolocation is not supported by your browser.', type: 'error' }); return; } setIsFetchingLocation(true); setFormStatus({ message: '', type: '' }); navigator.geolocation.getCurrentPosition(async (position) => { const { latitude, longitude } = position.coords; try { const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`); const data = await response.json(); if (data && data.display_name) { setFormData(prev => ({ ...prev, address: data.display_name })); } else { setFormData(prev => ({ ...prev, address: `Lat: ${latitude}, Lon: ${longitude}` })); } } catch (error) { setFormStatus({ message: 'Could not fetch address. Please enter manually.', type: 'error' }); } finally { setIsFetchingLocation(false); } }, () => { setFormStatus({ message: 'Unable to retrieve your location. Please check browser permissions.', type: 'error' }); setIsFetchingLocation(false); }); }; const handleSubmit = (e) => { e.preventDefault(); if (!formData.fullName || !formData.mobile || !formData.category || !formData.description) { setFormStatus({ message: 'Please fill out all required fields.', type: 'error' }); return; } const randomTicketId = Math.floor(10000 + Math.random() * 90000); setFormStatus({ message: `Success! Your complaint has been filed. Your tracking ID is C-${randomTicketId}`, type: 'success' }); setFormData({ fullName: '', mobile: '', address: '', category: '', description: '' }); setSelectedFile(null); e.target.reset(); }; return ( <section id="file-complaint" className="py-20 bg-white dark:bg-gray-900"><div className="container mx-auto px-6"><div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg p-8 md:p-12 lg:p-16"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"><div><h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">File a New Complaint</h2><p className="text-lg text-gray-600 dark:text-gray-300 mt-4 mb-6">Please provide clear and concise information about the issue. The more details you provide, the faster we can help resolve it.</p><ul className="space-y-3 text-gray-700 dark:text-gray-300"><li className="flex items-start"><span className="text-green-500 mr-3 mt-1">✔</span><span>Select the correct complaint category.</span></li><li className="flex items-start"><span className="text-green-500 mr-3 mt-1">✔</span><span>Provide a specific location or landmark.</span></li><li className="flex items-start"><span className="text-green-500 mr-3 mt-1">✔</span><span>You can attach a photo (optional).</span></li></ul></div><div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"><form onSubmit={handleSubmit} noValidate><div className="space-y-6"><div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label><input type="text" id="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required /></div><div><label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number *</label><input type="tel" id="mobile" value={formData.mobile} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required /></div><div><label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Complaint Category *</label><select id="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required><option value="" disabled>-- Select a category --</option>{complaintCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div><div><label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location / Address</label><div className="mt-1 flex rounded-md shadow-sm"><input type="text" id="address" value={formData.address} onChange={handleInputChange} className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" /><button type="button" onClick={handleFetchLocation} disabled={isFetchingLocation} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50">{isFetchingLocation ? <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}</button></div></div><div><label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label><textarea id="description" rows="4" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required></textarea></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attach Photo (Optional)</label><div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"><div className="space-y-1 text-center"><svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="flex text-sm text-gray-600 dark:text-gray-400"><label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" /></label></div>{selectedFile ? <p className="text-xs text-green-600 dark:text-green-400">{selectedFile.name}</p> : <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG up to 10MB</p>}</div></div></div><div><button type="submit" className="w-full cta-button bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600 text-lg">Submit Complaint</button></div>{formStatus.message && <div className={`text-center p-3 rounded-md text-sm ${formStatus.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}>{formStatus.message}</div>}</div></form></div></div></div></div></section> ); };
const KnowYourWard = () => {
    const [selectedWard, setSelectedWard] = useState('');
    const wardData = selectedWard ? mockWardData[selectedWard] : null;
    return (
        <section id="know-your-ward" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Know Your Ward</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Select your ward to see local information and updates from your elected corporator.</p>
                        <div className="max-w-md mx-auto lg:mx-0 mt-8">
                            <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-lg p-3">
                                <option value="" disabled>-- Select a Ward --</option>
                                <option value="10">Ward 10: Sigra</option>
                                <option value="22">Ward 22: Mahmoorganj</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg min-h-[250px] flex items-center justify-center">
                        {wardData ? (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Corporator Details</h3>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Name:</span> {wardData.corporator}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Mobile:</span> {wardData.mobile}</p>
                                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-2">Recent Work</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                    {wardData.recentWork.map((work, i) => <li key={i}>{work}</li>)}
                                </ul>
                            </div>
                        ) : ( <p className="text-gray-500 dark:text-gray-400">Please select a ward to view information.</p> )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- MAIN PAGE CONTENT ---

const HomePageContent = ({ theme }) => (
    <>
        <HeroSection />
        <ComplaintTracker />
        <HowItWorks />
        <Statistics theme={theme} />
        <KnowYourWard />
        <FileComplaintSection />
    </>
);

// --- MAIN APP COMPONENT ---

function App() {
    const [theme, setTheme] = useState(() => {
        if (localStorage.getItem('theme') === 'dark') return 'dark';
        if (localStorage.getItem('theme') === 'light') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    useEffect(() => {
        if (isAuthModalOpen) { document.body.style.overflow = 'hidden'; } 
        else { document.body.style.overflow = 'auto'; }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isAuthModalOpen]);

    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => { document.documentElement.style.scrollBehavior = 'auto'; };
    }, []);

    const handleLoginSuccess = (user) => { setIsLoggedIn(true); setCurrentUser(user); };
    const handleLogout = () => { setIsLoggedIn(false); setCurrentUser(null); };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
            <Header 
                theme={theme} 
                setTheme={setTheme} 
                isLoggedIn={isLoggedIn} 
                user={currentUser} 
                onLoginClick={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
            />
            <main>
                <HomePageContent theme={theme} />
            </main>
            <Footer />
        </div>
    );
}

export default App;
