import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const AGENT_NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/calculator/forward', label: 'Forward Calculator', icon: 'calculator' },
  { to: '/calculator/reverse', label: 'Reverse Planner', icon: 'trend' },
  { to: '/calculator/mdrt', label: 'MDRT Tracker', icon: 'target' },
  { to: '/calculator/activity', label: 'Activity Predictor', icon: 'activity' },
  { to: '/policies', label: 'My Policies', icon: 'document' },
  { to: '/customers', label: 'My Customers', icon: 'users' },
];

const ADMIN_NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/agents', label: 'Agent Performance', icon: 'briefcase' },
  { to: '/admin/registrations', label: 'Registrations', icon: 'clipboard' },
  { to: '/admin/users', label: 'User Management', icon: 'users' },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/config', label: 'Commission Config', icon: 'settings' },
  { to: '/admin/logs', label: 'Audit Logs', icon: 'document' },
];

function NavIcon({ name }: { name: string }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  } as const;

  switch (name) {
    case 'dashboard':
      return (
        <svg {...commonProps}>
          <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="4" width="7" height="5" rx="1.5" />
          <rect x="13.5" y="12" width="7" height="8" rx="1.5" />
          <rect x="3.5" y="14" width="7" height="6" rx="1.5" />
        </svg>
      );
    case 'calculator':
      return (
        <svg {...commonProps}>
          <rect x="5" y="3.5" width="14" height="17" rx="2" />
          <path d="M8 7.5h8" />
          <path d="M8 11.5h2" />
          <path d="M12 11.5h2" />
          <path d="M16 11.5h0" />
          <path d="M8 15.5h2" />
          <path d="M12 15.5h2" />
          <path d="M16 15.5h0" />
        </svg>
      );
    case 'trend':
      return (
        <svg {...commonProps}>
          <path d="M4 18h16" />
          <path d="M6 15.5 10 11l3 3 5-6" />
          <path d="M18 8h-3V5" />
        </svg>
      );
    case 'target':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 4v3" />
          <path d="M20 12h-3" />
        </svg>
      );
    case 'activity':
      return (
        <svg {...commonProps}>
          <path d="M5 18V9" />
          <path d="M12 18V5" />
          <path d="M19 18v-7" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...commonProps}>
          <path d="M8.5 6.5V5A1.5 1.5 0 0 1 10 3.5h4A1.5 1.5 0 0 1 15.5 5v1.5" />
          <rect x="4" y="6.5" width="16" height="11" rx="2" />
          <path d="M4 11.5h16" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...commonProps}>
          <rect x="6" y="4.5" width="12" height="16" rx="2" />
          <path d="M9 4.5h6v3H9z" />
          <path d="M9 11h6" />
          <path d="M9 15h4" />
        </svg>
      );
    case 'box':
      return (
        <svg {...commonProps}>
          <path d="m4.5 8 7.5-4 7.5 4-7.5 4-7.5-4Z" />
          <path d="M4.5 8v8l7.5 4 7.5-4V8" />
          <path d="M12 12v8" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.5v2" />
          <path d="M12 17.5v2" />
          <path d="M4.5 12h2" />
          <path d="M17.5 12h2" />
          <path d="m6.7 6.7 1.4 1.4" />
          <path d="m15.9 15.9 1.4 1.4" />
          <path d="m17.3 6.7-1.4 1.4" />
          <path d="m8.1 15.9-1.4 1.4" />
        </svg>
      );
    case 'document':
      return (
        <svg {...commonProps}>
          <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z" />
          <path d="M14 3.5V8h4" />
          <path d="M8.5 12h7" />
          <path d="M8.5 15.5h7" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M4 18v-7.5A2.5 2.5 0 0 1 6.5 8h11A2.5 2.5 0 0 1 20 10.5V18" />
          <circle cx="9" cy="6" r="2" />
          <circle cx="15" cy="6" r="2" />
        </svg>
      );
  }
}

export default function Sidebar() {
  const location = useLocation();
  const role = useAuthStore((s) => s.role);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const isAdmin = role === 'admin';
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : AGENT_NAV_ITEMS;

  useEffect(() => {
    if (!isAdmin) {
      setPendingCount(0);
      return;
    }

    api.get('/admin/registrations')
      .then((res) => {
        const registrations = Array.isArray(res.data.data) ? res.data.data : [];
        setPendingCount(registrations.filter((item: any) => item.status === 'pending').length);
      })
      .catch(() => setPendingCount(0));
  }, [isAdmin, location.pathname]);

  useEffect(() => {
    const activeTab = navRef.current?.querySelector('.management-tab-active');
    if (activeTab instanceof HTMLElement) {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }
  }, [location.pathname]);

  return (
    <nav className="management-tabs" aria-label={isAdmin ? 'Admin sections' : 'Agent sections'}>
      <div ref={navRef} className="management-tabs-scroll">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `management-tab ${isActive ? 'management-tab-active' : ''}`
            }
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
            {item.to === '/admin/registrations' && pendingCount > 0 && (
              <span className="inline-flex min-w-[1.5rem] justify-center rounded-full bg-[#1f2838] px-2 py-0.5 text-[11px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
