import {
    BarChart3,
    UserPlus,
    Users,
    Settings,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { type Dispatch, type SetStateAction } from 'react';

type Page = 'analytics' | 'registration' | 'records' | 'view-records';
type UserRole = 'administrator' | 'worker';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
    activePage: Page;
    setActivePage: Dispatch<SetStateAction<Page>>;
    userName: string;
    userRole: UserRole;
    onLogout: () => void;
}

export function Sidebar({
    collapsed,
    setCollapsed,
    activePage,
    setActivePage,
    userName,
    userRole,
    onLogout
}: SidebarProps) {
    // Different nav items based on user role
    const adminNavItems = [
        { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
        { id: 'registration', label: 'New Registration', icon: UserPlus },
        { id: 'records', label: 'Manage Records', icon: Users },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const workerNavItems = [
        { id: 'registration', label: 'New Registration', icon: UserPlus },
        { id: 'view-records', label: 'View Records', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const navItems = userRole === 'administrator' ? adminNavItems : workerNavItems;
    const roleLabel = userRole === 'administrator' ? 'Administrator' : 'Social Welfare Worker';

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#283593] border-r border-[#3949ab] transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Profile Section */}
            <div className={`${collapsed ? 'p-3' : 'p-6'} border-b border-[#3949ab]`}>
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-12 h-12 rounded-full bg-[#1976D2] flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white text-lg font-bold">JD</span>
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <h3 className="text-white font-semibold truncate">{userName}</h3>
                            <p className="text-blue-200 text-sm truncate">{roleLabel}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isNavigable = true;
                        const isActive = activePage === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => isNavigable && setActivePage(item.id as Page)}
                                    disabled={!isNavigable}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-medium ${isActive
                                        ? 'bg-[#1976D2] text-white shadow-lg'
                                        : isNavigable
                                            ? 'text-white hover:bg-[#3949ab]'
                                            : 'text-indigo-300 cursor-not-allowed opacity-50'
                                        }`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Toggle Button */}
            <div className="p-4 border-t border-[#3949ab]">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#3949ab] transition-colors font-medium"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5 flex-shrink-0 mx-auto" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                            <span className="truncate">Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-[#3949ab]">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-700 transition-colors font-medium"
                    title={collapsed ? 'Logout' : undefined}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="truncate">Logout</span>}
                </button>
            </div>
        </aside>
    )
}
