import { useState } from "react";
import { LayoutDashboard, Package, Calendar, ClipboardList, QrCode, Wrench, Users, FileText, LogOut, Plus, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation, type Language } from "@/lib/translations";
import NotificationBell from "./NotificationBell";

interface SidebarProps {
  userName: string;
  userRole: string;
  currentView: string;
  onNavigateToDashboard?: () => void;
  onNavigateToInventory?: () => void;
  onNavigateToReservations?: () => void;
  onNavigateToActivityLogs?: () => void;
  onNavigateToQRCodes?: () => void;
  onNavigateToMaintenance?: () => void;
  onNavigateToReports?: () => void;
  onNavigateToUsers?: () => void;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Sidebar({
  userName,
  userRole,
  currentView,
  onNavigateToDashboard,
  onNavigateToInventory,
  onNavigateToReservations,
  onNavigateToActivityLogs,
  onNavigateToQRCodes,
  onNavigateToMaintenance,
  onNavigateToReports,
  onNavigateToUsers,
  onLogout,
  language,
  onLanguageChange,
}: SidebarProps) {
  const t = useTranslation(language);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = userRole === 'admin' || userRole === 'developer';

  const menuItems = [
    ...(isAdmin
      ? [
          { icon: LayoutDashboard, label: 'dashboard', action: onNavigateToDashboard, view: 'dashboard' },
        ]
      : []),
    { icon: Package, label: 'inventory', action: onNavigateToInventory, view: 'inventory' },
    { icon: Calendar, label: 'reservations', action: onNavigateToReservations, view: 'reservations' },
    { icon: QrCode, label: 'qr_codes', action: onNavigateToQRCodes, view: 'qr-codes' },
    { icon: Wrench, label: 'maintenance', action: onNavigateToMaintenance, view: 'maintenance' },
    { icon: ClipboardList, label: 'activity_logs', action: onNavigateToActivityLogs, view: 'activity-logs' },
    { icon: FileText, label: 'reports', action: onNavigateToReports, view: 'reports' },
    ...(isAdmin
      ? [
          { icon: Users, label: 'user_management', action: onNavigateToUsers, view: 'users' },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#667eea] to-[#764ba2] text-white flex flex-col fixed h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white border-opacity-20">
          <h2 className="text-2xl font-bold">{t('inventory_manager')}</h2>
          <p className="text-sm opacity-90 mt-1">{userName}</p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white bg-opacity-25 font-semibold'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
                data-testid={`button-nav-${item.view}`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span>{t(item.label)}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white border-opacity-20 p-4 space-y-3">
          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
            data-testid="button-language-toggle"
          >
            <Globe className="w-5 h-5 flex-shrink-0" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Notifications */}
          <div className="px-4">
            <NotificationBell language={language} />
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-red-200"
            data-testid="button-logout-sidebar"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto" style={{ marginLeft: '16rem' }}>
        {/* Content will be rendered here */}
      </div>
    </div>
  );
}
