import React, { useState, useEffect } from 'react';
import { 
    Cpu, Trash2, ShieldAlert, Zap, ArrowRight, Layers, 
    Menu, X, ChevronUp, Youtube, Linkedin, Twitter, Github, Instagram, ExternalLink, Mail, Terminal
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-slate-400 hover:text-green-400 transition-colors p-2 hover:bg-slate-800/50 rounded-full border border-transparent hover:border-green-500/30"
    >
        <Icon size={20} />
    </a>
  );

  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden bg-[#050a10]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {/* Moving Perspective Grid */}
         <div className="absolute inset-0 opacity-20" 
              style={{
                background: 'linear-gradient(transparent 0%, #22c55e 2%, transparent 3%), linear-gradient(90deg, transparent 0%, #22c55e 2%, transparent 3%)',
                backgroundSize: '100px 100px',
                transform: 'perspective(500px) rotateX(60deg) scale(2.5)',
                transformOrigin: 'top center',
                animation: 'gridMove 10s linear infinite'
              }}
         ></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#050a10] via-[#050a10]/80 to-transparent"></div>
         
         {/* Particles */}
         <div className="absolute top-0 left-1/4 w-1 h-20 bg-green-500/30 blur-sm animate-[glitch_3s_infinite_reverse]"></div>
         <div className="absolute top-1/3 right-1/4 w-1 h-32 bg-green-500/20 blur-sm animate-[glitch_5s_infinite]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
                <Cpu className="text-green-500 relative z-10" size={32} />
                <div className="absolute inset-0 bg-green-500/50 blur-md animate-pulse"></div>
            </div>
            <span className="text-xl font-bold font-display tracking-widest text-white group-hover:text-green-400 transition-colors">
                SYSTEM<span className="text-green-500">_OS</span>
            </span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 tracking-wide font-mono">
            <a href="#features" className="hover:text-white hover:text-shadow-green transition-all duration-300">[FEATURES]</a>
            <a href="#story" className="hover:text-white hover:text-shadow-green transition-all duration-300">[STORY]</a>
            <a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-shadow-green transition-all duration-300 flex items-center gap-2">
                [DEV_PORTFOLIO] <ExternalLink size={12} />
            </a>
             <button 
                onClick={onStart}
                className="ml-4 px-6 py-2 bg-green-600/10 border border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all clip-corner font-display uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]"
            >
                Start_Game
            </button>
        </div>

        {/* Mobile Hamburger */}
        <button 
            className="md:hidden text-slate-300 hover:text-green-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
        >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 md:hidden flex flex-col p-6 animate-fade-in font-mono">
            <div className="flex flex-col gap-6 text-lg font-bold text-slate-300">
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-green-400 transition-colors border-l-2 border-transparent hover:border-green-500 pl-4">:: FEATURES</a>
                <a href="#story" onClick={() => setIsMenuOpen(false)} className="hover:text-green-400 transition-colors border-l-2 border-transparent hover:border-green-500 pl-4">:: STORY</a>
                <a href="https://vickyiitp.tech" onClick={() => setIsMenuOpen(false)} className="hover:text-green-400 transition-colors border-l-2 border-transparent hover:border-green-500 pl-4">:: DEVELOPER</a>
                <button 
                    onClick={() => {
                        setIsMenuOpen(false);
                        onStart();
                    }}
                    className="w-full py-4 bg-green-600 text-black font-bold clip-corner hover:bg-green-500 transition-colors shadow-lg"
                >
                    INITIALIZE_PROTOCOL
                </button>
                
                <div className="mt-8 pt-8 border-t border-slate-800">
                     <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest">Connect_Via</p>
                     <div className="flex gap-4">
                        <SocialLink href="https://x.com/vickyiitp" icon={Twitter} />
                        <SocialLink href="https://linkedin.com/in/vickyiitp" icon={Linkedin} />
                        <SocialLink href="https://github.com/vickyiitp" icon={Github} />
                     </div>
                </div>
            </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 mt-8 md:mt-16 mb-24">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/50 border border-green-500/30 text-green-400 text-xs font-mono mb-8 backdrop-blur-sm shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            SYSTEM STATUS: CRITICAL_FAILURE
        </div>
        
        <h1 className="relative text-5xl sm:text-7xl md:text-9xl font-black text-white font-display leading-none tracking-tighter mb-6 max-w-6xl drop-shadow-2xl select-none group">
            <span className="absolute inset-0 text-red-500 opacity-0 group-hover:opacity-60 translate-x-[2px] animate-glitch" aria-hidden="true">GARBAGE<br/>COLLECTOR</span>
            <span className="absolute inset-0 text-blue-500 opacity-0 group-hover:opacity-60 translate-x-[-2px] animate-glitch" aria-hidden="true">GARBAGE<br/>COLLECTOR</span>
            <span className="relative">GARBAGE<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">COLLECTOR</span></span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-light px-4 border-l-2 border-green-500/50 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
            Memory leaks detected in Sector 7. The heap is overflowing. 
            <br className="hidden md:block" />
            Engage manual cleanup protocols before <span className="text-white font-bold bg-red-500/20 px-1">SEGFAULT</span> occurs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 items-center w-full sm:w-auto px-6">
            <button 
                onClick={onStart}
                className="w-full sm:w-auto group relative px-10 py-5 bg-green-600 hover:bg-green-500 text-black font-bold text-xl clip-corner shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all flex items-center justify-center gap-3 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                <span className="relative font-display tracking-wider">INIT_PROTOCOL</span>
                <ArrowRight className="relative group-hover:translate-x-2 transition-transform" />
            </button>
            
            <a href="#features" className="w-full sm:w-auto px-10 py-5 text-green-400 hover:text-green-300 font-mono font-bold flex items-center justify-center gap-2 transition-all border border-green-500/30 hover:border-green-500/80 bg-slate-900/50 hover:bg-slate-900 clip-corner backdrop-blur-sm">
                <Terminal size={18} />
                READ_DOCS_v1.0
            </a>
        </div>
      </main>

      {/* How It Works (Features) */}
      <section id="features" className="relative z-10 py-32 bg-slate-900/40 border-t border-slate-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold font-display mb-4 text-white tracking-tight">CORE_MECHANICS</h2>
                <div className="h-1 w-24 bg-green-500 mx-auto rounded-full shadow-[0_0_10px_green]"></div>
                <p className="text-slate-400 mt-4 font-mono text-sm">Manual Memory Management Protocol</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="group glass-panel p-8 rounded-none border border-slate-700 hover:border-green-500/50 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif')] opacity-0 group-hover:opacity-5 mix-blend-overlay transition-opacity duration-500 pointer-events-none"></div>
                    <div className="w-16 h-16 bg-blue-500/10 rounded flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20 group-hover:scale-110 duration-300">
                        <Layers className="text-blue-400" size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-display">01. ANALYZE</h3>
                    <p className="text-slate-400 leading-relaxed text-sm font-light">
                        Scan the heap structure. Identify <span className="text-green-400 font-bold">Active</span> nodes (green) vs <span className="text-slate-300 font-bold">Dead</span> garbage (grey). Do not disturb live data.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="group glass-panel p-8 rounded-none border border-slate-700 hover:border-green-500/50 transition-all duration-300 relative overflow-hidden mt-0 md:-mt-4 bg-slate-800/20">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/20 blur-3xl -mr-10 -mt-10 group-hover:bg-green-500/30 transition-colors"></div>
                    <div className="w-16 h-16 bg-green-500/10 rounded flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors border border-green-500/20 group-hover:scale-110 duration-300">
                        <Trash2 className="text-green-400" size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-display">02. PURGE</h3>
                    <p className="text-slate-400 leading-relaxed text-sm font-light">
                        Execute deletion commands on dead blocks to free 64KB chunks. Warning: Touching active memory triggers immediate <span className="text-red-400 font-bold">KERNEL PANIC</span>.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="group glass-panel p-8 rounded-none border border-slate-700 hover:border-green-500/50 transition-all duration-300 relative overflow-hidden">
                    <div className="w-16 h-16 bg-red-500/10 rounded flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors border border-red-500/20 group-hover:scale-110 duration-300">
                        <Zap className="text-red-400" size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-display">03. DEBUG</h3>
                    <p className="text-slate-400 leading-relaxed text-sm font-light">
                        Resolve circular references. Right-click to nullify pointers from dead objects that are keeping each other alive (Memory Leaks).
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="relative z-10 py-32 border-t border-slate-800 bg-black/60">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-mono mb-6 tracking-widest">
                    // LORE_ARCHIVE_2099
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-display mb-8 text-white leading-none">
                    THE INFINITE<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-white">LOOP CRISIS</span>
                </h2>
                <p className="text-slate-400 mb-6 leading-relaxed text-lg">
                    The Global Kernel is failing. Automatic Garbage Collectors have been corrupted by the sheer volume of neural data. 
                </p>
                <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                    You are a <span className="text-green-400">Subprocess 0x9</span>. Your directive: Manually traverse the heap, identify orphaned sectors, and reclaim memory before the Stack Overflow consumes the simulation.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-8 border-t border-slate-800 pt-8">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-4xl font-bold text-white font-display tracking-tight">99.9%</span>
                        <span className="text-xs text-green-500 font-mono uppercase mt-1">CPU Load</span>
                    </div>
                    <div className="w-px h-12 bg-slate-800 hidden sm:block"></div>
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-4xl font-bold text-white font-display tracking-tight">1.2TB</span>
                        <span className="text-xs text-green-500 font-mono uppercase mt-1">Leak Rate</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-sm group">
                {/* Decorative Visual */}
                <div className="relative z-10 bg-[#0a0f18] border border-slate-700 p-1 rounded shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out">
                    <div className="bg-black/80 rounded border border-slate-800 p-6 font-mono text-xs text-green-500 h-80 overflow-hidden relative">
                         {/* Scanline inside terminal */}
                         <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent h-4 animate-scan pointer-events-none"></div>
                         
                        <div className="mb-2 opacity-50">root@sys:~# ./garbage_collector --force</div>
                        <div className="mb-1 text-white">{'>'} Initializing Heap Scan...</div>
                        <div className="mb-1">{'>'} [OK] Sector 1</div>
                        <div className="mb-1">{'>'} [OK] Sector 2</div>
                        <div className="mb-1 text-red-500 animate-pulse">{'>'} [ERR] Sector 7: STACK OVERFLOW</div>
                        <div className="mb-1 opacity-70">{'>'} Allocating Object 0x3F...</div>
                        <div className="mb-1 opacity-70">{'>'} Allocating Object 0x4A...</div>
                        <div className="mb-1 text-yellow-500">{'>'} WARNING: Cyclic Dependency Detected</div>
                        <div className="mb-1">{'>'} waiting for manual override...</div>
                        <div className="mt-4 text-green-400 animate-pulse">_</div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-green-500/20 blur-[50px] -z-10 group-hover:bg-green-500/30 transition-colors duration-500"></div>
                {/* Decoration squares */}
                <div className="absolute -top-10 -right-10 w-20 h-20 border border-slate-700 rounded-full opacity-20 animate-spin-slow"></div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t border-slate-800 bg-[#020408] text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <ShieldAlert size={24} className="text-green-500"/>
                    <span className="font-display font-bold text-slate-200 text-xl tracking-widest">SYSTEM<span className="text-green-600">_OS</span></span>
                </div>
                <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
                    Advanced web simulations for the modern web. Built with React 19, TypeScript, and pure CSS algorithms.
                </p>
                <div className="flex gap-4">
                    <SocialLink href="https://youtube.com/@vickyiitp" icon={Youtube} />
                    <SocialLink href="https://linkedin.com/in/vickyiitp" icon={Linkedin} />
                    <SocialLink href="https://x.com/vickyiitp" icon={Twitter} />
                    <SocialLink href="https://github.com/vickyiitp" icon={Github} />
                    <SocialLink href="https://instagram.com/vickyiitp" icon={Instagram} />
                </div>
            </div>

            {/* Links */}
            <div>
                <h4 className="text-white font-bold mb-6 font-display tracking-wider">EXPLORE</h4>
                <ul className="space-y-4 font-mono text-xs">
                    <li><a href="https://vickyiitp.tech" className="hover:text-green-400 transition-colors flex items-center gap-2">_DEV_PORTFOLIO <ArrowRight size={10}/></a></li>
                    <li><a href="#features" className="hover:text-green-400 transition-colors flex items-center gap-2">_GAME_MECHANICS <ArrowRight size={10}/></a></li>
                    <li><a href="#story" className="hover:text-green-400 transition-colors flex items-center gap-2">_LORE_ARCHIVE <ArrowRight size={10}/></a></li>
                </ul>
            </div>

            {/* Contact */}
            <div>
                <h4 className="text-white font-bold mb-6 font-display tracking-wider">CONTACT</h4>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                        <Mail size={16} className="text-green-500" />
                        <a href="mailto:themvaplatform@gmail.com" className="hover:text-green-400 transition-colors">themvaplatform@gmail.com</a>
                    </li>
                    <li className="pt-4 text-xs opacity-50 font-mono">
                        &copy; 2025 Vickyiitp.<br/>All rights reserved.
                    </li>
                    <li className="text-xs opacity-50 flex gap-4 font-mono">
                         <a href="#" className="hover:text-white underline decoration-slate-700">Terms</a>
                         <a href="#" className="hover:text-white underline decoration-slate-700">Privacy</a>
                    </li>
                </ul>
            </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 bg-green-600/90 text-black backdrop-blur-md clip-corner shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-500 z-50 hover:bg-green-500 ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        aria-label="Back to top"
      >
        <ChevronUp size={24} />
      </button>

      <style>{`
        .clip-corner {
            clip-path: polygon(
                12px 0, 100% 0, 100% calc(100% - 12px), 
                calc(100% - 12px) 100%, 0 100%, 0 12px
            );
        }
        .text-shadow-green {
            text-shadow: 0 0 10px rgba(34,197,94,0.5);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;