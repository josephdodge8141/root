import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Bell, Search } from 'lucide-react';
import { cn } from '../ui/utils';

export function TopNavbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Project 'microservices-arch' updated",
      timestamp: "2 hours ago",
      unread: true,
      icon: "📊"
    },
    {
      id: 2,
      title: "New team member added to Infrastructure",
      timestamp: "4 hours ago", 
      unread: true,
      icon: "👥"
    },
    {
      id: 3,
      title: "AWS source analysis completed",
      timestamp: "1 day ago",
      unread: false,
      icon: "☁️"
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="flex items-center justify-between h-14 px-6">
        {/* Left spacer */}
        <div className="flex-1" />

        {/* Center search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, nodes, teams…"
              className="pl-10 bg-input-background border-border"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-destructive text-destructive-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Notifications</h4>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all read
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer",
                        notification.unread && "bg-accent/10"
                      )}
                    >
                      <span className="text-lg">{notification.icon}</span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      )}
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  View all
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile */}
          <Popover open={profileOpen} onOpenChange={setProfileOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-8 px-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-sm">Jane Doe</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Jane Doe</p>
                    <p className="text-sm text-muted-foreground">jane@company.com</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Logout
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}