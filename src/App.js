import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Helper component for individual step cards in the "How It Works" section
const StepCard = ({ icon, title, description, iconColorClass }) => (
    <div className="step-card bg-gray-50 dark:bg-gray-800 p-8 rounded-xl text-center border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 transition-transform duration-300">
        <div className={`text-4xl mb-4 ${iconColorClass}`}>{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

// Helper component for individual statistic cards
const StatCard = ({ title, value, valueColorClass, subtext }) => (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{title}</h3>
        <p className={`text-5xl font-bold ${valueColorClass}`}>
            {value} {subtext && <span className="text-3xl">{subtext}</span>}
        </p>
    </div>
);

// Google Translate Element Component
const LanguageTranslator = () => {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({ pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE }, 'google_translate_element');
        };
    }, []);

    return <div id="google_translate_element"></div>;
};

// Dark Mode Toggle Component
const ThemeToggle = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            {theme === 'dark' ? (
                // Moon Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
                // Sun Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
        </button>
    );
};

// Sidebar Component for Mobile and Desktop Navigation
const Sidebar = ({ isOpen, onClose, onMouseEnter, onMouseLeave, theme, setTheme }) => {
    const sidebarNavSections = [
        { title: 'My Account', links: [ { href: '/login', label: 'Login / Register', icon: '👤' }, { href: '/profile', label: 'My Profile', icon: '📄' }, { href: '/my-complaints', label: 'My Complaints', icon: '📂' } ] },
        { title: 'Public Services', links: [ { href: '#file-complaint', label: 'File a Complaint', icon: '📝' }, { href: '#track-complaint', label: 'Track a Complaint', icon: '🔍' }, { href: '/pay-tax', label: 'Pay Property Tax', icon: '🏠' }, { href: '/pay-water-bill', label: 'Pay Water Bill', icon: '💧' } ] },
        { title: 'Information', links: [ { href: '/notices', label: 'Public Notices', icon: '📢' }, { href: '/tenders', label: 'Tenders', icon: '💼' }, { href: '/departments', label: 'Departments', icon: '🏢' }, { href: '/reports', label: 'Budgets & Reports', icon: '📊' } ] },
        { title: 'Help & Support', links: [ { href: '/faq', label: 'FAQ', icon: '❓' }, { href: '#footer', label: 'Contact Us', icon: '📞' } ] }
    ];

    useEffect(() => {
        const handleEsc = (event) => { if (event.key === 'Escape') { onClose(); } };
        window.addEventListener('keydown', handleEsc);
        return () => { window.removeEventListener('keydown', handleEsc); };
    }, [onClose]);

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                     <a href="#home" className="text-2xl font-bold text-gray-800 dark:text-gray-100" onClick={onClose}>CIVIC <span className="text-orange-500">TRACK</span></a>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
                <nav className="py-4 flex-grow overflow-y-auto">
                    {sidebarNavSections.map((section, index) => (
                        <div key={index} className="px-5 py-2">
                            <h3 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">{section.title}</h3>
                            <ul className="mt-2 space-y-1">
                                {section.links.map(link => (
                                    <li key={link.href}>
                                        <a href={link.href} onClick={onClose} className="flex items-center py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 rounded-md transition-colors">
                                            <span className="mr-3 text-lg">{link.icon}</span><span>{link.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                </div>
            </div>
        </>
    );
};

// Header Component
const Header = ({ theme, setTheme }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const closeTimer = useRef(null);
    const handleMouseEnter = () => { clearTimeout(closeTimer.current); setIsSidebarOpen(true); };
    const handleMouseLeave = () => { closeTimer.current = setTimeout(() => { setIsSidebarOpen(false); }, 300); };
    const topNavLinks = [ { href: '#home', label: 'Home' }, { href: '#how-it-works', label: 'How It Works' }, { href: '#stats', label: 'Statistics' }, { href: '#file-complaint', label: 'File Complaint'} ];

    return (
        <>
            <header id="home" className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-30 shadow-sm dark:shadow-md dark:shadow-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="text-gray-700 dark:text-gray-200 focus:outline-none p-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 transform hover:scale-110 transition-all duration-200"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                            <a href="#home" className="text-2xl font-bold text-gray-800 dark:text-gray-100">CIVIC <span className="text-orange-500">TRACK</span></a>
                        </div>
                        <div className="flex items-center gap-4">
                            <nav className="hidden md:flex items-center space-x-8">
                                {topNavLinks.map(link => ( <a key={link.href} href={link.href} className="text-gray-600 dark:text-gray-300 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors">{link.label}</a> ))}
                            </nav>
                             <div className="hidden md:block">
                                <LanguageTranslator />
                            </div>
                            <div className="hidden md:block">
                                <ThemeToggle theme={theme} setTheme={setTheme} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} theme={theme} setTheme={setTheme} />
        </>
    );
};

// Hero Section Component
const HeroSection = () => (
    <section className="pt-32 pb-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 leading-tight mb-4">Your Voice for a Better City.</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">File and track public service complaints with the Nagar Nigam and see real-time progress. Making civic action simple and transparent.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href="#file-complaint" className="cta-button w-full sm:w-auto bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600">File a New Complaint</a>
                <a href="#track-complaint" className="cta-button w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Track Your Complaint</a>
            </div>
        </div>
    </section>
);

// Complaint Tracker Component
const ComplaintTracker = () => {
    const [trackingId, setTrackingId] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trackingId.trim() === '') { setMessage('Please enter a valid tracking ID.'); setMessageColor('text-red-500'); } 
        else { setMessage(`Searching for complaint ID: ${trackingId}... (This is a demo, no real data is fetched).`); setMessageColor('text-orange-500'); }
    };

    return (
        <section id="track-complaint" className="py-16 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Check Your Complaint Status</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Have a tracking ID? Enter it below to see the latest updates.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="Enter your complaint ID (e.g., C-12345)" className="w-full text-lg px-5 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                        <button type="submit" className="w-full sm:w-auto bg-gray-800 dark:bg-orange-600 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-gray-900 dark:hover:bg-orange-700 transition">Track</button>
                    </form>
                    {message && <div className={`mt-4 text-center ${messageColor}`}>{message}</div>}
                </div>
            </div>
        </section>
    );
};

// How It Works Section Component
const HowItWorks = () => {
    const steps = [ { icon: '📝', title: '1. Register Complaint', description: 'Submit your complaint through our simple online form with all the necessary details.', color: 'text-orange-500' }, { icon: '🎟️', title: '2. Receive Tracking ID', description: 'Get a unique ID instantly to track the progress of your complaint at any time.', color: 'text-orange-500' }, { icon: '⚙️', title: '3. Official Review', description: 'Your complaint is assigned to the relevant department for review and action.', color: 'text-orange-500' }, { icon: '✔️', title: '4. Get Resolution', description: 'Receive updates and a final resolution. Provide feedback on the service.', color: 'text-green-500' } ];
    return (
        <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">How It Works</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">A simple and transparent process in four easy steps.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => ( <StepCard key={index} icon={step.icon} title={step.title} description={step.description} iconColorClass={step.color} /> ))}
                </div>
            </div>
        </section>
    );
};

// Statistics Section Component
const Statistics = ({ theme }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) { chartInstance.current.destroy(); }
            const ctx = chartRef.current.getContext('2d');

            const legendColor = theme === 'dark' ? '#D1D5DB' : '#4B5563';

            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: { labels: ['Resolved', 'In Progress', 'New'], datasets: [{ data: [70, 20, 10], backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(234, 179, 8, 0.8)'], borderColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', borderWidth: 4, }] },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 20, color: legendColor, font: { size: 14, family: 'Inter' } } },
                        tooltip: { enabled: true, backgroundColor: '#1F2937', titleFont: { size: 16, weight: 'bold', family: 'Inter' }, bodyFont: { size: 14, family: 'Inter' }, padding: 12, cornerRadius: 8, callbacks: { label: (context) => `${context.label || ''}: ${context.parsed || 0}%` } }
                    }
                }
            });
        }
        return () => { if (chartInstance.current) { chartInstance.current.destroy(); } };
    }, [theme]);

    const stats = [ { title: 'Total Complaints Resolved', value: '14,289', color: 'text-green-600' }, { title: 'Average Resolution Time', value: '5.2', subtext: 'Days', color: 'text-orange-500' }, { title: 'Citizen Satisfaction', value: '92%', color: 'text-yellow-500' } ];
    return (
        <section id="stats" className="py-20 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Live Statistics</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Transparency in action. See our performance in real-time.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => ( <StatCard key={index} title={stat.title} value={stat.value} subtext={stat.subtext} valueColorClass={stat.color} /> ))}
                </div>
                <div className="mt-12 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Complaint Status Overview</h3>
                    <div className="relative w-full max-w-xs mx-auto h-72"><canvas ref={chartRef}></canvas></div>
                </div>
            </div>
        </section>
    );
};

// New File Complaint Section
const FileComplaintSection = () => (
    <section id="file-complaint" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg p-8 md:p-12 lg:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                        <form>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                    <input type="text" id="fullName" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" placeholder="Enter your full name" />
                                </div>
                                <div>
                                    <label htmlFor="complaintDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Complaint Details</label>
                                    <textarea id="complaintDetails" rows="4" className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3" placeholder="Describe the issue in detail..."></textarea>
                                </div>
                                <div><button type="submit" className="w-full cta-button bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600 text-lg">Submit Complaint</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Footer Component
const Footer = () => (
    <footer id="footer" className="bg-gray-800 dark:bg-black/50 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div><h3 className="text-xl font-bold mb-4">CIVIC <span className="text-orange-400">TRACK</span></h3><p className="text-gray-400">Empowering citizens through technology for a more responsive and transparent governance.</p></div>
                <div><h4 className="font-semibold text-lg mb-4">Quick Links</h4><ul className="space-y-2"><li><a href="#home" className="text-gray-400 hover:text-white">Home</a></li><li><a href="#file-complaint" className="text-gray-400 hover:text-white">File Complaint</a></li><li><a href="#track-complaint" className="text-gray-400 hover:text-white">Track Status</a></li><li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li></ul></div>
                <div><h4 className="font-semibold text-lg mb-4">Legal</h4><ul className="space-y-2"><li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li><li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li></ul></div>
                <div><h4 className="font-semibold text-lg mb-4">Contact Us</h4><address className="text-gray-400 not-italic">Nagar Nigam Varanasi Head Office<br />Sigra, Varanasi<br />Uttar Pradesh, 221010</address><a href="mailto:contact@civictrack.gov.in" className="text-gray-400 mt-2 hover:text-white inline-block">contact@civictrack.gov.in</a></div>
            </div>
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500"><p>&copy; 2025 CIVIC TRACK. All Rights Reserved.</p></div>
        </div>
    </footer>
);

// Main App Component
function App() {
    const [theme, setTheme] = useState(() => {
        if (localStorage.getItem('theme') === 'dark') return 'dark';
        if (localStorage.getItem('theme') === 'light') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

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
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => { document.documentElement.style.scrollBehavior = 'auto'; };
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900">
            <Header theme={theme} setTheme={setTheme} />
            <main>
                <HeroSection />
                <ComplaintTracker />
                <HowItWorks />
                <Statistics theme={theme} />
                <FileComplaintSection />
            </main>
            <Footer />
        </div>
    );
}

export default App;
