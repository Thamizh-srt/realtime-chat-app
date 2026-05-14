import { cn } from '../lib/utils';

export default function MessageBubble({ message, isOwnMessage, showAvatar = true }) {
  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out mb-4",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[75%] md:max-w-[65%] gap-3",
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div className="shrink-0 flex flex-col justify-end">
          {showAvatar ? (
            <div className="h-8 w-8 overflow-hidden rounded-full border border-border bg-muted shadow-sm">
              <img
                src={message.avatar || `https://i.pravatar.cc/150?u=${message.sender}`}
                alt={message.sender}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8" /> /* Placeholder to keep alignment */
          )}
        </div>

        {/* Message Content */}
        <div
          className={cn(
            "flex flex-col group",
            isOwnMessage ? "items-end" : "items-start"
          )}
        >
          {showAvatar && (
            <span className="mb-1 text-xs font-medium text-muted-foreground px-1">
              {message.sender}
            </span>
          )}
          
          <div
            className={cn(
              "relative rounded-2xl px-4 py-2.5 shadow-sm text-[15px] leading-relaxed",
              isOwnMessage
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-white dark:bg-muted text-foreground border border-border rounded-bl-sm"
            )}
          >
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          </div>
          
          {/* Timestamp - shown on hover or permanently below */}
          <span
            className={cn(
              "mt-1 text-[10px] text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 px-1",
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
