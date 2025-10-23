import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import MaintenanceDashboard from './components/MaintenanceDashboard';
import OfficeDashboard from './components/OfficeDashboard';
import SafetyDashboard from './components/SafetyDashboard';

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user profile
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavbarClass = () => {
    switch (user?.role) {
      case 'maintenance':
        return 'navbar-maintenance';
      case 'office':
        return 'navbar-office';
      case 'safety':
        return 'navbar-safety';
      default:
        return 'navbar-maintenance';
    }
  };

  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      );
    }

    switch (user?.role) {
      case 'maintenance':
        return <MaintenanceDashboard />;
      case 'office':
        return <OfficeDashboard />;
      case 'safety':
        return <SafetyDashboard />;
      default:
        return <MaintenanceDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 ${getNavbarClass()} text-white shadow-md transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h2 className="text-xl font-semibold">
                Welcome, {getUserDisplayName()}
              </h2>
              <div className="text-sm font-light">
                {format(currentTime, 'PPpp')}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/20 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderDashboardContent()}
      </main>
    </div>
  );
};

export default DashboardPage;
