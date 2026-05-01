import { Link } from 'react-router-dom';
import { HeartHandshake, UsersRound, Sparkles, ArrowRight, MapPin, Phone } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-viva-mist flex flex-col font-sans">
      {/* Navbar */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3">
              <img src="/images/logo.png" alt="VIVA Connect Logo" className="h-10 w-10 object-contain rounded-md shadow-sm" />
              <span className="font-semibold text-viva-ink tracking-tight text-lg">VIVA Connect</span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end">
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-viva-ink hover:text-viva-leaf transition-colors"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 isolate">
        <div className="relative pt-14 lg:pt-20 pb-16 sm:pb-24 lg:pb-32 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-viva-saffron to-viva-leaf opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 text-center lg:text-left pt-10 lg:pt-0">
                <h1 className="text-4xl font-bold tracking-tight text-viva-ink sm:text-6xl mb-6">
                  Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-viva-maroon to-viva-saffron">Compassion</span> Through Technology
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto lg:mx-0">
                  A serene, powerful space for the Ramakrishna Mission family to coordinate volunteers, plan seva activities, and measure real-world impact.
                </p>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                  <Link
                    to="/login"
                    className="rounded-md bg-viva-leaf px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-viva-ink transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-viva-leaf flex items-center gap-2"
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>
                  <a href="#features" className="text-sm font-semibold leading-6 text-viva-ink hover:text-viva-maroon transition-colors">
                    Learn more <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
              
              <div className="lg:col-span-6 mt-16 lg:mt-0">
                <div className="relative rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur-sm lg:rounded-3xl shadow-2xl">
                  <img
                    src="/images/hero.png"
                    alt="Volunteers engaged in Seva"
                    className="w-full rounded-xl lg:rounded-2xl shadow-soft object-cover aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto border border-slate-200/50"
                  />
                  {/* Decorative element */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 border border-slate-100 animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <HeartHandshake size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-viva-ink">Impact Tracked</p>
                      <p className="text-xs text-slate-500">Real-time metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-viva-leaf uppercase tracking-wide">Platform Capabilities</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-viva-ink sm:text-4xl">
                Everything you need to scale your seva.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col group">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-viva-ink">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-viva-mist group-hover:bg-viva-leaf transition-colors duration-300">
                      <UsersRound className="size-6 text-viva-leaf group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                    Volunteer Coordination
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Maintain detailed records of your volunteers, their skills, and availability. Effortlessly assign the right people to the right activities.</p>
                  </dd>
                </div>
                
                <div className="flex flex-col group">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-viva-ink">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-viva-mist group-hover:bg-viva-maroon transition-colors duration-300">
                      <HeartHandshake className="size-6 text-viva-maroon group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                    Impact Tracking
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Record seva hours and track the number of people served. Watch your community impact grow through dynamic, real-time dashboards.</p>
                  </dd>
                </div>

                <div className="flex flex-col group">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-viva-ink">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-viva-mist group-hover:bg-indigo-600 transition-colors duration-300">
                      <Sparkles className="size-6 text-indigo-600 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                    AI Insights Assistant
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Leverage intelligent AI to generate professional impact reports instantly and receive smart volunteer recommendations for upcoming events.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="py-24 sm:py-32 bg-viva-mist">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-viva-leaf uppercase tracking-wide">Impact in Action</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-viva-ink sm:text-4xl">
                Recent Activities
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                A glimpse into the real-world seva and community support driven by our dedicated volunteers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[250px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div 
                  key={num} 
                  className={`relative group overflow-hidden rounded-2xl shadow-soft bg-slate-200 ${
                    num === 1 || num === 5 || num === 8 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <img
                    src={`/images/slide${num}.jpeg`}
                    alt={`Recent activity slide ${num}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-viva-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 p-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-medium text-white/80">Activity Highlights</p>
                    <p className="text-lg font-semibold text-white">Community Seva #{num}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-viva-ink py-12 sm:py-16 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            
            {/* Branding Column */}
            <div className="flex flex-col items-start">
              <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <img src="/images/logo.png" alt="VIVA Connect Logo" className="h-12 w-12 object-contain rounded-md bg-white/5 p-1" />
                <span className="font-semibold text-white tracking-tight text-xl">VIVA Connect</span>
              </Link>
              <p className="mt-4 text-sm leading-6 text-slate-400 max-w-xs">
                A serene, powerful space for the Ramakrishna Mission family to coordinate volunteers, plan seva activities, and measure real-world impact.
              </p>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <Phone className="mt-0.5 shrink-0 text-viva-leaf" size={18} />
                  <div className="flex flex-col gap-1">
                    <a href="tel:+919313772190" className="hover:text-white transition-colors">+91 93137 72190</a>
                    <a href="tel:+918971892005" className="hover:text-white transition-colors">+91 89718 92005</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Location Column */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Location</h3>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="mt-0.5 shrink-0 text-viva-saffron" size={18} />
                <address className="not-italic leading-relaxed">
                  <strong className="text-slate-300 block mb-1">Ramakrishna Mission VIVA</strong>
                  Park Hospital Road, Opposite Sispal Vihar<br />
                  Off Sohna Road, Sector 47<br />
                  Gurugram, Haryana - 122018<br />
                  India
                </address>
              </div>
            </div>
            
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} Ramakrishna Mission VIVA Connect. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/login" className="text-xs text-slate-500 hover:text-white transition-colors">Admin Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
