import { Hash, Settings, Users, LogOut, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';

const CHANNELS = [
  { id: 'general', name: 'general' },
  { id: 'react', name: 'react-dev' },
  { id: 'ui-design', name: 'ui-design' },
];

const USERS = [
  { id: '1', name: 'Alice', status: 'online', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Bob', status: 'offline', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Charlie', status: 'online', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export default function Sidebar({ username, currentRoom, onRoomChange, onLogout, theme, toggleTheme }) {
  return (
    <div className="flex h-full w-64 md:w-72 flex-col border-r border-border bg-background transition-colors duration-300">
      {/* Header Profile Section */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-sm">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
          </div>
          <div className="flex flex-col truncate">
            <span className="truncate font-semibold text-foreground">{username}</span>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="shrink-0 ml-2" />
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {/* Search */}
        <div className="px-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border border-border bg-muted/50 py-2 pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="mb-6 px-3">
          <div className="mb-2 flex items-center justify-between px-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Channels
            </h3>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Hash className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-0.5">
            {CHANNELS.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onRoomChange(channel.id)}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  currentRoom === channel.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Hash className={cn("h-4 w-4 shrink-0", currentRoom === channel.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div className="px-3">
          <div className="mb-2 flex items-center justify-between px-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Direct Messages
            </h3>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Users className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-0.5">
            {USERS.map((user) => (
              <button
                key={user.id}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted text-left"
              >
                <div className="relative shrink-0">
                  <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                      user.status === 'online' ? "bg-green-500" : "bg-gray-400"
                    )}
                  />
                </div>
                <span className="truncate text-sm font-medium text-muted-foreground group-hover:text-foreground">
                  {user.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
