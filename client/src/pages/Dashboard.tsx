import { useQuery } from "@tanstack/react-query";
import InventoryHeader from "@/components/InventoryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useTranslation, type Language } from "@/lib/translations";
import { Package, Clock, AlertCircle, CheckCircle2, TrendingUp, Activity, Zap, BarChart3 } from "lucide-react";

interface DashboardProps {
  userName: string;
  userRole: string;
  userId: string;
  onLogout: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToInventory?: () => void;
  onNavigateToReservations?: () => void;
  onNavigateToActivityLogs?: () => void;
  onNavigateToQRCodes?: () => void;
  onNavigateToMaintenance?: () => void;
  onNavigateToReports?: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Dashboard({
  userName,
  userRole,
  userId,
  onLogout,
  onNavigateToDashboard,
  onNavigateToInventory,
  onNavigateToReservations,
  onNavigateToActivityLogs,
  onNavigateToQRCodes,
  onNavigateToMaintenance,
  onNavigateToReports,
  currentLanguage,
  onLanguageChange
}: DashboardProps) {
  const t = useTranslation(currentLanguage);

  const { data: items = [] } = useQuery({
    queryKey: ['/api/items'],
    queryFn: () => api.items.getAll(),
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ['/api/reservations'],
    queryFn: () => api.reservations.getAll(),
  });

  // Calculate stats
  const totalItems = items.length;
  const availableItems = items.filter(item => item.status === 'Available').length;
  const inUseItems = items.filter(item => item.status === 'In Use').length;
  const reservedItems = items.filter(item => item.status === 'Reserved').length;
  const maintenanceItems = items.filter(item => item.status === 'Maintenance').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const approvedReservations = reservations.filter(r => r.status === 'approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <InventoryHeader
        userName={userName}
        userRole={userRole}
        currentView="categories"
        onViewChange={() => onNavigateToInventory?.()}
        onLogout={onLogout}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToReservations={onNavigateToReservations}
        onNavigateToActivityLogs={onNavigateToActivityLogs}
        onNavigateToQRCodes={onNavigateToQRCodes}
        onNavigateToMaintenance={onNavigateToMaintenance}
        onNavigateToReports={onNavigateToReports}
        hideViewToggle={true}
        language={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] rounded-3xl blur-2xl opacity-20 -z-10"></div>
          <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>
            <div className="relative px-8 md:px-12 py-12 md:py-16">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3" data-testid="text-dashboard-title">
                    {t('dashboard')}
                  </h1>
                  <p className="text-white text-opacity-90 text-lg max-w-2xl">
                    {t('overviewInventory')}
                  </p>
                </div>
                <div className="hidden lg:flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Items */}
          <Card className="hover-elevate shadow-lg border-0 bg-white dark:bg-slate-800" data-testid="card-total-items">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('totalItems')}</CardTitle>
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground" data-testid="text-total-items">{totalItems}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{currentLanguage === 'ar' ? 'إجمالي العناصر في النظام' : 'Total items in system'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Available */}
          <Card className="hover-elevate shadow-lg border-0 bg-white dark:bg-slate-800" data-testid="card-available">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('available')}</CardTitle>
                <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400" data-testid="text-available">{availableItems}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0}% {currentLanguage === 'ar' ? 'متاح' : 'available'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* In Use */}
          <Card className="hover-elevate shadow-lg border-0 bg-white dark:bg-slate-800" data-testid="card-in-use">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('inUse')}</CardTitle>
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400" data-testid="text-in-use">{inUseItems}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalItems > 0 ? Math.round((inUseItems / totalItems) * 100) : 0}% {currentLanguage === 'ar' ? 'قيد الاستخدام' : 'in use'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="hover-elevate shadow-lg border-0 bg-white dark:bg-slate-800" data-testid="card-pending-actions">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">{currentLanguage === 'ar' ? 'معلقة' : 'Pending'}</CardTitle>
                <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-400" data-testid="text-pending-actions">{pendingReservations}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{pendingReservations} {currentLanguage === 'ar' ? 'حجز معلق' : 'pending actions'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Maintenance Alert */}
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 hover-elevate" data-testid="card-maintenance-status">
            <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-base font-semibold">
                <AlertCircle className="w-5 h-5" />
                {t('maintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{currentLanguage === 'ar' ? 'تحت الصيانة' : 'Under Maintenance'}</span>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">{maintenanceItems}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${totalItems > 0 ? (maintenanceItems / totalItems) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations Status */}
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 hover-elevate" data-testid="card-reservations-status">
            <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-base font-semibold">
                <Clock className="w-5 h-5" />
                {t('reservations')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{currentLanguage === 'ar' ? 'معلق' : 'Pending'}</span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{pendingReservations}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{currentLanguage === 'ar' ? 'موافق عليه' : 'Approved'}</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">{approvedReservations}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 hover-elevate" data-testid="card-system-health">
            <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400 text-base font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                {currentLanguage === 'ar' ? 'صحة النظام' : 'System Health'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{currentLanguage === 'ar' ? 'نسبة التوفر' : 'Availability'}</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${totalItems > 0 ? (availableItems / totalItems) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Footer */}
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 mt-8 hover-elevate" data-testid="card-summary-footer">
          <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">{currentLanguage === 'ar' ? 'ملخص النظام' : 'System Summary'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800/30">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">{currentLanguage === 'ar' ? 'إجمالي' : 'Total'}</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalItems}</p>
              </div>
              <div className="space-y-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800/30">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">{currentLanguage === 'ar' ? 'استخدام' : 'Usage'}</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalItems > 0 ? Math.round((inUseItems / totalItems) * 100) : 0}%</p>
              </div>
              <div className="space-y-2 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl border border-green-200 dark:border-green-800/30">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">{currentLanguage === 'ar' ? 'نشطة' : 'Active'}</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{reservedItems + approvedReservations}</p>
              </div>
              <div className="space-y-2 p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">{currentLanguage === 'ar' ? 'تنبيهات' : 'Alerts'}</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{maintenanceItems + pendingReservations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
