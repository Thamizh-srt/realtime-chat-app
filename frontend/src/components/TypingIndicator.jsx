export default function TypingIndicator() {
  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out mb-4">
      <div className="flex max-w-[75%] md:max-w-[65%] gap-3">
        {/* Avatar Placeholder */}
        <div className="shrink-0 flex flex-col justify-end">
          <div className="h-8 w-8 overflow-hidden rounded-full border border-border bg-muted shadow-sm flex items-center justify-center">
            <span className="text-xs text-muted-foreground">?</span>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="mb-1 text-xs font-medium text-muted-foreground px-1">
            Someone is typing
          </span>
          <div className="relative rounded-2xl rounded-bl-sm border border-border bg-white dark:bg-muted px-4 py-3 shadow-sm flex items-center gap-1.5 h-11">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
