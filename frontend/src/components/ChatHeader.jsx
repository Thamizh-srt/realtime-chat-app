import { Hash, Phone, Video, Info, Search, MoreVertical } from 'lucide-react';
import {useRooms} from '../hooks/useRooms';

export default function ChatHeader() {
    const { activeRoom } = useRooms();

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Hash className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-foreground capitalize">
            {activeRoom && activeRoom.name}
          </h2>
          <span className="text-xs text-muted-foreground">
            {activeRoom && activeRoom._count?.members} members · 2 online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          <Phone className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary hidden sm:block">
          <Video className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-border mx-1"></div>
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          <Search className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary hidden sm:block">
          <Info className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:hidden">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
