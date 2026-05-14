import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ThemeToggle({ theme, toggleTheme, className }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isDark ? "bg-primary" : "bg-muted-foreground/30",
        className
      )}
      aria-label="Toggle Dark Mode"
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center",
          isDark ? "translate-x-7" : "translate-x-1"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-yellow-500" />
        )}
      </span>
    </button>
  );
}
