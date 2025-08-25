import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { fileComplaint, trackComplaint, loginUser, registerUser } from './api';
Chart.register(...registerables);

// --- MOCK DATA ---
const mockWardData = { '10': { corporator: 'Smt. Anita Singh', mobile: '9876543210', recentWork: ['New streetlights installed on main road.', 'Repaired major water pipeline leakage.'] }, '22': { corporator: 'Shri. Ramesh Gupta', mobile: '9871234567', recentWork: ['Road resurfacing project completed.', 'Conducted sanitation drive.'] } };
const mockFaqData = [ { q: 'How do I file a complaint?', a: 'You can file a complaint by filling out the form on our homepage. Please provide as much detail as possible, including the exact location and a photo if possible.' }, { q: 'How long does it take to resolve a complaint?', a: 'The resolution time varies depending on the complexity of the issue and the department involved. The average time is 5-7 working days. You will receive notifications on status changes.' }, { q: 'Can I track my complaint?', a: 'Yes, after submitting a complaint, you will receive a unique Tracking ID. You can use this ID in the "Track Your Complaint" section to see the latest updates and the complete history of actions taken.' }, { q: 'Is my personal information safe?', a: 'Absolutely. We adhere to strict data privacy policies. Your personal information is only used for communication regarding your complaint and is not shared with third parties.' } ];
const mockUserComplaints = [ { id: 'C-54321', category: 'Streetlight Not Working', date: '2025-07-25', status: 'In Progress' }, { id: 'C-48129', category: 'Road Potholes', date: '2025-06-12', status: 'Resolved' } ];
const mockNotices = [ { id: 1, title: 'Notice regarding property tax deadline extension', date: '2025-07-20', file: '/downloads/notice1.pdf' }, { id: 2, title: 'Tender invitation for sanitation equipment supply', date: '2025-07-18', file: '/downloads/tender1.pdf' }, { id: 3, title: 'Public announcement on monsoon preparedness drive', date: '2025-07-15', file: '/downloads/announcement1.pdf' } ];
const mockDepartments = [ { name: 'Sanitation Department', description: 'Responsible for city cleanliness, garbage collection, and waste management.', head: 'Dr. Rajesh Kumar', contact: '0542-2501234', email: 'sanitation@varanasi.gov.in', address: 'Sanitation Office, Sigra, Varanasi' }, { name: 'Water Works Department', description: 'Manages water supply, pipeline maintenance, and water bill collections.', head: 'Eng. Priya Sharma', contact: '0542-2501456', email: 'waterworks@varanasi.gov.in', address: 'Water Works Office, Cantonment, Varanasi' }, { name: 'Public Works Department (PWD)', description: 'Handles the construction and maintenance of roads, bridges, and public buildings.', head: 'Eng. Suresh Gupta', contact: '0542-2501789', email: 'pwd@varanasi.gov.in', address: 'PWD Office, Civil Lines, Varanasi' }, { name: 'Health Department', description: 'Oversees public health initiatives, disease control, and food safety regulations.', head: 'Dr. Meera Singh', contact: '0542-2501012', email: 'health@varanasi.gov.in', address: 'Health Office, Mahmoorganj, Varanasi' } ];

const mockTaxData = [
    {
        id: 'property-tax',
        title: 'Property Tax',
        description: 'Annual tax on residential and commercial properties',
        baseRate: '₹12 per sq ft',
        dueDate: 'March 31st',
        icon: '🏠',
        features: ['Online payment available', 'Quarterly installments', 'Property assessment', 'Tax certificate download']
    },
    {
        id: 'water-tax',
        title: 'Water Tax',
        description: 'Monthly charges for water supply and sewerage',
        baseRate: '₹150 per month',
        dueDate: '10th of every month',
        icon: '💧',
        features: ['Monthly billing', 'Meter reading', 'Online payment', 'Usage tracking']
    },
    {
        id: 'trade-license',
        title: 'Trade License Fee',
        description: 'Annual license fee for commercial establishments',
        baseRate: '₹500 - ₹5000',
        dueDate: 'April 30th',
        icon: '🏪',
        features: ['Business registration', 'Annual renewal', 'Digital certificate', 'Compliance tracking']
    },
    {
        id: 'building-permit',
        title: 'Building Permit Fee',
        description: 'One-time fee for construction permits',
        baseRate: '₹50 per sq ft',
        dueDate: 'Before construction',
        icon: '🏗️',
        features: ['Plan approval', 'Construction permit', 'Inspection services', 'Completion certificate']
    },
    {
        id: 'garbage-tax',
        title: 'Garbage Collection Tax',
        description: 'Monthly fee for waste collection and disposal',
        baseRate: '₹100 per month',
        dueDate: '5th of every month',
        icon: '🗑️',
        features: ['Daily collection', 'Segregation support', 'Special waste pickup', 'Eco-friendly disposal']
    },
    {
        id: 'parking-fee',
        title: 'Parking Fee',
        description: 'Monthly fee for designated parking spaces',
        baseRate: '₹300 per month',
        dueDate: '1st of every month',
        icon: '🅿️',
        features: ['Reserved parking', 'Security surveillance', 'Digital payment', 'Monthly passes']
    }
];


// --- HELPER & UI COMPONENTS ---

const StepCard = ({ icon, title, description, iconColorClass }) => ( <div className="step-card bg-gray-50 dark:bg-gray-800 p-8 rounded-xl text-center border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 transition-transform duration-300"><div className={`text-4xl mb-4 ${iconColorClass}`}>{icon}</div><h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{title}</h3><p className="text-gray-600 dark:text-gray-400">{description}</p></div> );
const StatCard = ({ title, value, valueColorClass, subtext, suffix, duration = 2, decimals = 0 }) => { const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 }); return ( <div ref={ref} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center"><h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{title}</h3><p className={`text-5xl font-bold ${valueColorClass}`}>{inView ? <CountUp end={value} duration={duration} separator="," decimals={decimals} /> : '0'}{suffix}{subtext && <span className="text-3xl"> {subtext}</span>}</p></div> ); };
const LanguageTranslator = () => {
  useEffect(() => {
    const initializeGoogleTranslate = () => {
      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement &&
        window.google.translate.TranslateElement.InlineLayout
      ) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      }
    };
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = initializeGoogleTranslate;
    }
    initializeGoogleTranslate();
  }, []);
  return <div id="google_translate_element" className="w-full"></div>;
};
const ThemeToggle = ({ theme, setTheme }) => { const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark'); return ( <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">{theme === 'dark' ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> )} </button> ); };

// --- AUTHENTICATION & ACCOUNT COMPONENTS ---

const AuthModal = ({ onClose, onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEsc = (event) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        const handleClickOutside = (event) => { if (modalRef.current && !modalRef.current.contains(event.target)) onClose(); };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSuccess(false);
        const credentials = {
            email: e.target.email.value,
            password: e.target.password.value,
        };
        try {
            const response = await loginUser(credentials); // API call
            onLoginSuccess(response.data.user);
            onClose();
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed.");
            setIsSuccess(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSuccess(false);
        const userData = {
            username: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };
        try {
            await registerUser(userData); // API call
            setMessage("Registration successful! Please login.");
            setIsSuccess(true);
            setIsLoginView(true);
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{isLoginView ? 'Login to Your Account' : 'Create a New Account'}</h2>
                </div>
                <div className="p-6">
                    {isLoginView ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input type="email" id="email" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required />
                            </div>
                            <div>
                                <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <input type="password" id="password" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required />
                            </div>
                            <button type="submit" className="w-full cta-button bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600 text-lg">Login</button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input type="text" id="name" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input type="email" id="email" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required />
                            </div>
                            <div>
                                <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <input type="password" id="password" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required />
                            </div>
                            <button type="submit" className="w-full cta-button bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600 text-lg">Register</button>
                        </form>
                    )}
                    {message && (
                        <div className={`text-center mt-4 p-3 rounded-md text-sm ${isSuccess ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}>
                            {message}
                        </div>
                    )}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                        {isLoginView ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => { setIsLoginView(!isLoginView); setMessage(""); }} className="font-medium text-orange-600 hover:text-orange-500">
                            {isLoginView ? 'Register' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
const AccountDropdown = ({ isLoggedIn, user, onLoginClick, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const loggedOutItems = [
        { label: 'Login / Register', action: onLoginClick }
    ];
    const loggedInItems = [
        { href: '#/profile-settings', label: 'Profile Settings' },
        { href: '#/my-complaints', label: 'My Complaints' },
        { label: 'Sign Out', action: onLogout, isSignOut: true }
    ];

    const menuItems = isLoggedIn ? loggedInItems : loggedOutItems;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.split(' ');
        return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name[0];
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-bold"
            >
                {isLoggedIn ? getInitials(user.name) : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                    {isLoggedIn && (
                        <div className="px-4 py-2 border-b dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                    )}
                    {menuItems.map(item => (
                        <a
                            key={item.label}
                            href={item.href || '#'}
                            onClick={(e) => {
                                if (item.action) {
                                    e.preventDefault();
                                    item.action();
                                }
                                setIsOpen(false);
                            }}
                            className={`block px-4 py-2 text-sm ${item.isSignOut ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- NAVIGATION COMPONENTS ---

const Sidebar = ({ isOpen, onClose, theme, setTheme, onLoginClick }) => {
    const sidebarNavSections = [ { title: 'Public Services', links: [ { href: '#file-complaint', label: 'File a Complaint', icon: '📝' }, { href: '#track-complaint', label: 'Track a Complaint', icon: '🔍' }, { href: '#/pay-tax', label: 'Pay Tax', icon: '💰' } ] }, { title: 'Information', links: [ { href: '#/notices', label: 'Public Notices', icon: '📢' }, { href: '#/departments', label: 'Departments', icon: '🏢' } ] }, { title: 'Help & Support', links: [ { href: '#/faq', label: 'FAQ', icon: '❓' }, { href: '#footer', label: 'Contact Us', icon: '📞' } ] } ];
    useEffect(() => { const handleEsc = (event) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);
    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><a href="#/" className="text-2xl font-bold text-gray-800 dark:text-gray-100" onClick={onClose}>CIVIC <span className="text-orange-500">TRACK</span></a><button onClick={onClose} className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
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
    const topNavLinks = [ { href: '#/', label: 'Home' }, { href: '#how-it-works', label: 'Statistics' }, { href: '#file-complaint', label: 'File Complaint'} ];
    return (
        <>
            <header id="home" className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-30 shadow-sm dark:shadow-md dark:shadow-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700 dark:text-gray-200 focus:outline-none p-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 transform hover:scale-110 transition-all duration-200"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                            <a href="#/" className="text-2xl font-bold text-gray-800 dark:text-gray-100">CIVIC <span className="text-orange-500">TRACK</span></a>
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
const Footer = () => ( <footer id="footer" className="bg-gray-800 dark:bg-black/50 text-white"><div className="container mx-auto px-6 py-12"><div className="grid grid-cols-1 md:grid-cols-4 gap-8"><div><h3 className="text-xl font-bold mb-4">CIVIC <span className="text-orange-400">TRACK</span></h3><p className="text-gray-400">Empowering citizens through technology for a more responsive and transparent governance.</p></div><div><h4 className="font-semibold text-lg mb-4">Quick Links</h4><ul className="space-y-2"><li><a href="#/" className="text-gray-400 hover:text-white">Home</a></li><li><a href="#file-complaint" className="text-gray-400 hover:text-white">File Complaint</a></li><li><a href="#track-complaint" className="text-gray-400 hover:text-white">Track Status</a></li><li><a href="#/faq" className="text-gray-400 hover:text-white">FAQ</a></li></ul></div><div><h4 className="font-semibold text-lg mb-4">Legal</h4><ul className="space-y-2"><li><a href="#/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li><li><a href="#/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li></ul></div><div><h4 className="font-semibold text-lg mb-4">Contact Us</h4><address className="text-gray-400 not-italic">Nagar Nigam Varanasi Head Office<br />Sigra, Varanasi<br />Uttar Pradesh, 221010</address><a href="mailto:contact@civictrack.gov.in" className="text-gray-400 mt-2 hover:text-white inline-block">contact@civictrack.gov.in</a></div></div><div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500"><p>&copy; 2025 CIVIC TRACK. All Rights Reserved.</p></div></div></footer> );

// --- DYNAMIC SECTION COMPONENTS ---

const ComplaintStatusPage = ({ complaint, onBack }) => { const getStatusColor = (status) => { switch (status) { case 'Resolved': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'; case 'Work in Progress': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'; default: return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'; } }; return ( <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full"><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Complaint Status</h3><button onClick={onBack} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Search Again</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 border rounded-lg dark:border-gray-700"><div><p className="text-sm text-gray-500 dark:text-gray-400">Category</p><p className="font-semibold">{complaint.category}</p></div><div><p className="text-sm text-gray-500 dark:text-gray-400">Status</p><p className={`font-semibold px-2 py-1 text-xs inline-block rounded-full ${getStatusColor(complaint.status)}`}>{complaint.status}</p></div><div className="md:col-span-2"><p className="text-sm text-gray-500 dark:text-gray-400">Location</p><p className="font-semibold">{complaint.address}</p></div><div className="md:col-span-2"><p className="text-sm text-gray-500 dark:text-gray-400">Description</p><p>{complaint.description}</p></div></div><div><h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Complaint History</h4><ol className="relative border-l border-gray-200 dark:border-gray-700">{complaint.history.map((item, index) => ( <li key={index} className="mb-10 ml-6"><span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"><svg className="w-3 h-3 text-blue-800 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg></span><h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{item.status}</h3><time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{item.date}</time><p className="text-base font-normal text-gray-500 dark:text-gray-400">{item.details}</p></li> ))}</ol></div></div> ); };
const ComplaintTracker = () => {
    const [trackingId, setTrackingId] = useState('');
    const [foundComplaint, setFoundComplaint] = useState(null);
    const [searchStatus, setSearchStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSearchStatus('');
        setFoundComplaint(null);
        try {
            const response = await trackComplaint(trackingId.trim().toUpperCase());
            if (response.data && response.data.complaintId) {
                setFoundComplaint(response.data);
            } else {
                setSearchStatus('not_found');
            }
        } catch (error) {
            setSearchStatus('not_found');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchAgain = () => {
        setFoundComplaint(null);
        setTrackingId('');
        setSearchStatus('');
    };

    return (
        <section id="track-complaint" className="py-16 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                    {foundComplaint ? (
                        <ComplaintStatusPage complaint={foundComplaint} onBack={handleSearchAgain} />
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Check Your Complaint Status</h3>
                            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Have a tracking ID? Enter it below to see the latest updates.</p>
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="Enter tracking ID (e.g., C-12345)"
                                    className="w-full text-lg px-5 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                />
                                <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-gray-800 dark:bg-orange-600 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-gray-900 dark:hover:bg-orange-700 transition flex items-center justify-center disabled:opacity-50">
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Track'
                                    )}
                                </button>
                            </form>
                            {searchStatus === 'not_found' && !isLoading && (
                                <div className="mt-4 text-center text-red-500">
                                    Complaint ID not found. Please check the ID and try again.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
const Statistics = ({ theme }) => { const chartRef = useRef(null); const chartInstance = useRef(null); const stats = [ { title: 'Total Complaints Resolved', value: 14289, color: 'text-green-600' }, { title: 'Average Resolution Time', value: 5.2, subtext: 'Days', color: 'text-orange-500', duration: 3, decimals: 1 }, { title: 'Citizen Satisfaction', value: 92, suffix: '%', color: 'text-yellow-500' } ]; useEffect(() => { if (chartRef.current) { if (chartInstance.current) { chartInstance.current.destroy(); } const ctx = chartRef.current.getContext('2d'); const legendColor = theme === 'dark' ? '#D1D5DB' : '#4B5563'; chartInstance.current = new Chart(ctx, { type: 'doughnut', data: { labels: ['Resolved', 'In Progress', 'New'], datasets: [{ data: [70, 20, 10], backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(234, 179, 8, 0.8)'], borderColor: theme === 'dark' ? '#111827' : '#FFFFFF', borderWidth: 4, }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { padding: 20, color: legendColor, font: { size: 14, family: 'Inter' } } }, tooltip: { enabled: true, backgroundColor: '#1F2937', titleFont: { size: 16, weight: 'bold', family: 'Inter' }, bodyFont: { size: 14, family: 'Inter' }, padding: 12, cornerRadius: 8, callbacks: { label: (context) => `${context.label || ''}: ${context.parsed || 0}%` } } } } }); } return () => { if (chartInstance.current) { chartInstance.current.destroy(); } }; }, [theme]); return ( <section id="stats" className="py-20 bg-gray-50 dark:bg-gray-800/50"><div className="container mx-auto px-6"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Live Statistics</h2><p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Transparency in action. See our performance in real-time.</p></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"><div className="space-y-8">{stats.map((stat, index) => ( <StatCard key={index} {...stat} /> ))}</div><div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg"><h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Complaint Status Overview</h3><div className="relative w-full max-w-xs mx-auto h-72"><canvas ref={chartRef}></canvas></div></div></div></div></section> ); };
const FileComplaintSection = ({ isLoggedIn, onRequireLogin }) => {
    const [formData, setFormData] = useState({ fullName: '', mobile: '', address: '', category: '', description: '' });
    const [formStatus, setFormStatus] = useState({ message: '', type: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [trackingId, setTrackingId] = useState('');
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const complaintCategories = [
        "Garbage & Sanitation",
        "Streetlight Not Working",
        "Water Leakage / No Water",
        "Road Potholes",
        "Stray Animals",
        "Illegal Construction",
        "Other"
    ];

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            setFormStatus({ message: 'Geolocation is not supported by your browser.', type: 'error' });
            return;
        }
        setIsFetchingLocation(true);
        setFormStatus({ message: '', type: '' });
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        setFormData((prev) => ({ ...prev, address: data.display_name }));
                    } else {
                        setFormData((prev) => ({ ...prev, address: `Lat: ${latitude}, Lon: ${longitude}` }));
                    }
                } catch (error) {
                    setFormStatus({ message: 'Could not fetch address. Please enter manually.', type: 'error' });
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            () => {
                setFormStatus({ message: 'Unable to retrieve your location. Please check browser permissions.', type: 'error' });
                setIsFetchingLocation(false);
            }
        );
    };

    // Generates a unique complaint ID using timestamp and random digits
    const generateComplaintId = () => {
        const now = new Date();
        const y = now.getFullYear().toString().slice(-2);
        const m = (now.getMonth() + 1).toString().padStart(2, '0');
        const d = now.getDate().toString().padStart(2, '0');
        const h = now.getHours().toString().padStart(2, '0');
        const min = now.getMinutes().toString().padStart(2, '0');
        const s = now.getSeconds().toString().padStart(2, '0');
        const rand = Math.floor(100 + Math.random() * 900); // 3 random digits
        return `C-${y}${m}${d}${h}${min}${s}${rand}`;
    };

    // frontend/src/App.js ke andar FileComplaintSection component
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Pehle check karein ki user logged in hai ya nahi
        if (!isLoggedIn) {
            setFormStatus({ message: 'You must be logged in to submit a complaint.', type: 'error' });
            onRequireLogin(); // Login modal open karega
            return;
        }

        // Form ke zaroori fields check karein
        if (!formData.fullName || !formData.mobile || !formData.category || !formData.description) {
            setFormStatus({ message: 'Please fill out all required fields.', type: 'error' });
            return;
        }

        try {
            // Sirf backend ko data bhejein. Frontend mein koi ID na banayein.
            const response = await fileComplaint(formData);

            // Backend se mila hua success message (jisme sahi ID hai) display karein
            setFormStatus({ message: response.data.message, type: 'success' });

            // Form ko reset karein
            setFormData({ fullName: '', mobile: '', address: '', category: '', description: '' });
            setSelectedFile(null);
            e.target.reset();

        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : 'Server error. Please try again later.';
            setFormStatus({ message: errorMessage, type: 'error' });
        }
    };
    return (
        <section id="file-complaint" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg p-8 md:p-12 lg:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">File a New Complaint</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 mb-6">Please provide clear and concise information about the issue. The more details you provide, the faster we can help resolve it.</p>
                            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start"><span className="text-green-500 mr-3 mt-1">✔</span><span>Select the correct complaint category.</span></li>
                                <li className="flex items-start"><span className="text-green-500 mr-3 mt-1">✔</span><span>Provide a specific location or landmark.</span></li>
                                <li className="flex items-start"><span className="text-green-500 mr-3 mt-1">✔</span><span>You can attach a photo (optional).</span></li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                                        <input type="text" id="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required />
                                    </div>
                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number *</label>
                                        <input type="tel" id="mobile" value={formData.mobile} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Complaint Category *</label>
                                        <select id="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required>
                                            <option value="" disabled>-- Select a category --</option>
                                            {complaintCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location / Address</label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input type="text" id="address" value={formData.address} onChange={handleInputChange} className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" />
                                            <button type="button" onClick={handleFetchLocation} disabled={isFetchingLocation} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50">
                                                {isFetchingLocation ? <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
                                        <textarea id="description" rows="4" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" required></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attach Photo (Optional)</label>
                                        <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                                                        <span>Upload a file</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                    </label>
                                                </div>
                                                {selectedFile ? <p className="text-xs text-green-600 dark:text-green-400">{selectedFile.name}</p> : <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG up to 10MB</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full cta-button bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600 text-lg">Submit Complaint</button>
                                    </div>
                                    {formStatus.message && (
                                      <div className={`text-center p-3 rounded-md text-sm ${formStatus.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}>
                                        {formStatus.message}
                                        {trackingId && formStatus.type === 'success' && (
                                          <div className="mt-2 text-blue-700 dark:text-blue-300 font-bold">
                                            Your Tracking ID: {trackingId}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
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

// --- NEW PAGE COMPONENTS ---

const TaxPaymentPage = () => {
    const [selectedTax, setSelectedTax] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        fullName: '',
        mobile: '',
        address: '',
        amount: '',
        paymentMethod: 'online'
    });
    const [paymentStatus, setPaymentStatus] = useState('');

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setPaymentStatus('processing');
        
        setTimeout(() => {
            setPaymentStatus('success');
            setPaymentForm({
                fullName: '',
                mobile: '',
                address: '',
                amount: '',
                paymentMethod: 'online'
            });
            setSelectedTax(null);
        }, 2000);
    };

    const TaxCard = ({ tax }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{tax.icon}</div>
                <span className="text-sm bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full">
                    {tax.baseRate}
                </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{tax.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{tax.description}</p>
            <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Due Date: <span className="font-semibold">{tax.dueDate}</span></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {tax.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={() => setSelectedTax(tax)}
                className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
                Pay Now
            </button>
        </div>
    );

    const PaymentModal = ({ tax, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pay {tax.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    {paymentStatus === 'success' ? (
                        <div className="text-center">
                            <div className="text-green-500 text-6xl mb-4">✓</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Payment Successful!</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Your {tax.title.toLowerCase()} has been paid successfully.</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID: TXN{Math.floor(100000 + Math.random() * 900000)}</p>
                        </div>
                    ) : (
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    value={paymentForm.fullName}
                                    onChange={(e) => setPaymentForm({...paymentForm, fullName: e.target.value})}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                                <input
                                    type="tel"
                                    value={paymentForm.mobile}
                                    onChange={(e) => setPaymentForm({...paymentForm, mobile: e.target.value})}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property/Business Address</label>
                                <textarea
                                    value={paymentForm.address}
                                    onChange={(e) => setPaymentForm({...paymentForm, address: e.target.value})}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3"
                                    rows="2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                                <select
                                    value={paymentForm.paymentMethod}
                                    onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3"
                                >
                                    <option value="online">Online Banking</option>
                                    <option value="upi">UPI</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="wallet">Digital Wallet</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={paymentStatus === 'processing'}
                                className="w-full bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600 text-lg disabled:opacity-50"
                            >
                                {paymentStatus === 'processing' ? 'Processing...' : `Pay ₹${paymentForm.amount || '0'}`}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="pt-24 pb-20 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">Tax Payment Portal</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Pay your municipal taxes online quickly and securely. Choose from various payment options and get instant receipts.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockTaxData.map((tax) => (
                        <TaxCard key={tax.id} tax={tax} />
                    ))}
                </div>

                <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Payment Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Accepted Payment Methods</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Internet Banking</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>UPI (PhonePe, Google Pay, Paytm)</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Credit/Debit Cards</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Digital Wallets</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Important Notes</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li>• Payment receipts are available for download immediately</li>
                                <li>• Late payment charges apply after due dates</li>
                                <li>• For assistance, call: 0542-2501100</li>
                                <li>• Keep transaction ID for future reference</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {selectedTax && (
                <PaymentModal
                    tax={selectedTax}
                    onClose={() => {
                        setSelectedTax(null);
                        setPaymentStatus('');
                        setPaymentForm({
                            fullName: '',
                            mobile: '',
                            address: '',
                            amount: '',
                            paymentMethod: 'online'
                        });
                    }}
                />
            )}
        </div>
    );
};

const PublicNoticesPage = () => {
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');

    const categories = ['all', 'tender', 'announcement', 'policy', 'event'];

    const allNotices = [
        ...mockNotices,
        { id: 4, title: 'New waste management policy implementation', date: '2025-07-22', file: '/downloads/policy1.pdf', category: 'policy' },
        { id: 5, title: 'Road closure notice for festival celebrations', date: '2025-07-21', file: '/downloads/roadclosure1.pdf', category: 'announcement' },
        { id: 6, title: 'Public hearing for development projects', date: '2025-07-19', file: '/downloads/hearing1.pdf', category: 'event' },
        { id: 7, title: 'Tender for street lighting renovation', date: '2025-07-17', file: '/downloads/tender2.pdf', category: 'tender' },
        { id: 8, title: 'Water supply maintenance schedule', date: '2025-07-16', file: '/downloads/maintenance1.pdf', category: 'announcement' }
    ];

    const filteredNotices = filterCategory === 'all' 
        ? allNotices 
        : allNotices.filter(notice => notice.category === filterCategory);

    const getCategoryColor = (category) => {
        switch(category) {
            case 'tender': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
            case 'announcement': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
            case 'policy': return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300';
            case 'event': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
            default: return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="pt-24 pb-20 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">Public Notices</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mxauto mb-8">
                        Stay updated with official announcements, tenders, policies, and public events from Nagar Nigam Varanasi.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setFilterCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                    filterCategory === category
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotices.map(notice => (
                        <div key={notice.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(notice.category || 'announcement')}`}>
                                    {(notice.category || 'announcement').charAt(0).toUpperCase() + (notice.category || 'announcement').slice(1)}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{notice.date}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">{notice.title}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedNotice(notice)}
                                    className="flex-1 bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    View Details
                                </button>
                                <a
                                    href={notice.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    📄 PDF
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedNotice && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-y-auto">
                            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Notice Details</h2>
                                <button onClick={() => setSelectedNotice(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(selectedNotice.category || 'announcement')}`}>
                                        {(selectedNotice.category || 'announcement').charAt(0).toUpperCase() + (selectedNotice.category || 'announcement').slice(1)}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{selectedNotice.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Published on: {selectedNotice.date}</p>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p>This is the detailed content of the notice. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                                <div className="mt-6 flex gap-4">
                                    <a
                                        href={selectedNotice.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Download PDF
                                    </a>
                                    <button
                                        onClick={() => navigator.share && navigator.share({title: selectedNotice.title, url: window.location.href})}
                                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DepartmentsPage = () => {
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    return (
        <div className="pt-24 pb-20 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">Municipal Departments</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Get to know the various departments of Nagar Nigam Varanasi and their services. Find contact information and department heads.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mockDepartments.map((dept, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between mb-6">
                                <div className="text-4xl">
                                    {index === 0 ? '🧹' : index === 1 ? '💧' : index === 2 ? '🏗️' : '🏥'}
                                </div>
                                <button
                                    onClick={() => setSelectedDepartment(dept)}
                                    className="text-orange-500 hover:text-orange-600 font-medium"
                                >
                                    View Details →
                                </button>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{dept.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{dept.description}</p>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Head:</span> {dept.head}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Contact:</span> {dept.contact}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedDepartment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedDepartment.name}</h2>
                                <button onClick={() => setSelectedDepartment(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedDepartment.description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Contact Information</h4>
                                        <div className="space-y-2">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">Department Head:</span> {selectedDepartment.head}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">Phone:</span> {selectedDepartment.contact}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">Email:</span> {selectedDepartment.email}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">Address:</span> {selectedDepartment.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Office Hours</h4>
                                        <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                            <p><span className="font-semibold">Monday - Friday:</span> 10:00 AM - 6:00 PM</p>
                                            <p><span className="font-semibold">Saturday:</span> 10:00 AM - 2:00 PM</p>
                                            <p><span className="font-semibold">Sunday:</span> Closed</p>
                                            <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                                                *Emergency services available 24/7
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-4">
                                    <a
                                        href={`tel:${selectedDepartment.contact}`}
                                        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Call Department
                                    </a>
                                    <a
                                        href={`mailto:${selectedDepartment.email}`}
                                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Send Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FAQPage = () => {
    const [openFAQ, setOpenFAQ] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const extendedFAQs = [
        ...mockFaqData,
        {
            q: 'How do I pay my property tax online?',
            a: 'You can pay property tax through our Tax Payment Portal. Navigate to the tax section, select Property Tax, fill in your details, and proceed with secure online payment.'
        },
        {
            q: 'What documents are required for a trade license?',
            a: 'You need: Business registration certificate, property ownership/lease agreement, ID proof, address proof, and passport size photographs. Additional documents may be required based on business type.'
        },
        {
            q: 'How do I apply for a building permit?',
            a: 'Submit your building plans to the PWD department along with the application form, property documents, and applicable fees. Our technical team will review and approve within 15-30 working days.'
        },
        {
            q: 'What should I do in case of water supply issues?',
            a: 'Report water supply issues through our complaint portal or directly contact the Water Works Department at 0542-2501456. Emergency repairs are prioritized and addressed within 24 hours.'
        },
        {
            q: 'How can I get my garbage collection schedule?',
            a: 'Contact the Sanitation Department or check your ward information. Most areas have daily collection, but schedules may vary. You can also request special pickup for bulk waste.'
        },
        {
            q: 'What are the penalties for late tax payments?',
            a: 'Late payment charges vary by tax type: Property tax - 1.5% per month, Water tax - ₹50 per month delay, Trade license - 10% of annual fee. Pay early to avoid penalties.'
        }
    ];

    const filteredFAQs = extendedFAQs.filter(faq => 
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-24 pb-20 bg-gray-50 dark:bg-gray-800/50 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Find answers to common questions about municipal services, tax payments, and civic procedures.
                    </p>
                    
                    <div className="max-w-md mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                        {filteredFAQs.map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-xl"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 pr-8">{faq.q}</h3>
                                    <svg
                                        className={`w-6 h-6 text-gray-500 transform transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openFAQ === index && (
                                    <div className="px-6 pb-6">
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredFAQs.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No results found</h3>
                            <p className="text-gray-500 dark:text-gray-500">Try searching with different keywords</p>
                        </div>
                    )}

                    <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Still have questions?</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Can't find what you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:0542-2501100"
                                className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Call Support: 0542-2501100
                            </a>
                            <a
                                href="mailto:support@varanasi.gov.in"
                                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Email Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE CONTENT ---

const HomePageContent = ({ theme, isLoggedIn, currentUser, onRequireLogin }) => (
    <>
        <HeroSection />
        <ComplaintTracker />
        <HowItWorks />
        <Statistics theme={theme} />
        <KnowYourWard />
        <FileComplaintSection isLoggedIn={isLoggedIn} currentUser={currentUser} onRequireLogin={onRequireLogin} />
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
    const [currentPage, setCurrentPage] = useState('home');

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

    // Simple hash-based routing
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash.startsWith('/')) {
                const page = hash.slice(1);
                setCurrentPage(page || 'home');
            } else {
                setCurrentPage('home');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Handle initial load

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleLoginSuccess = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);   // user should include userId
        setIsAuthModalOpen(false); // ✅ Close modal after login
    };
    const handleLogout = () => { setIsLoggedIn(false); setCurrentUser(null); };

    const renderCurrentPage = () => {
        switch(currentPage) {
            case 'pay-tax':
                return <TaxPaymentPage />;
            case 'notices':
                return <PublicNoticesPage />;
            case 'departments':
                return <DepartmentsPage />;
            case 'faq':
                return <FAQPage />;
            case 'home':
            default:
                return <HomePageContent theme={theme} isLoggedIn={isLoggedIn} currentUser={currentUser} onRequireLogin={() => setIsAuthModalOpen(true)} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {isAuthModalOpen && (
                <AuthModal
                    onClose={() => setIsAuthModalOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
            <Header 
                theme={theme} 
                setTheme={setTheme} 
                isLoggedIn={isLoggedIn} 
                user={currentUser} 
                onLoginClick={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
            />
            <main>
                {renderCurrentPage()}
            </main>
            <Footer />
        </div>
    );
}

export default App;