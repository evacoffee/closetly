import * as React from "react"
import * as ListboxPrimitive from "@radix-ui/react-listbox"

import { cn } from "@/lib/utils"

const Listbox = React.forwardRef<
  React.ElementRef<typeof ListboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ListboxPrimitive.Root
    ref={ref}
    className={cn("relative z-50", className)}
    {...props}
  />
))
Listbox.displayName = ListboxPrimitive.Root.displayName

const ListboxTrigger = React.forwardRef<
  React.ElementRef<typeof ListboxPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <ListboxPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <span className="ml-2 size-4 shrink-0 opacity-50">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 8 4 4 4-4" />
      </svg>
    </span>
  </ListboxPrimitive.Trigger>
))
ListboxTrigger.displayName = ListboxPrimitive.Trigger.displayName

const ListboxViewport = React.forwardRef<
  React.ElementRef<typeof ListboxPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Viewport>
>(({ className, children, ...props }, ref) => (
  <ListboxPrimitive.Viewport
    ref={ref}
    className={cn(
      "absolute top-full z-50 mt-1 max-h-96 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md [&[data-state=empty]]:animate-enter [&[data-state=empty]]:animate-exit",
      className
    )}
    {...props}
  >
    {children}
  </ListboxPrimitive.Viewport>
))
ListboxViewport.displayName = ListboxPrimitive.Viewport.displayName

const ListboxItem = React.forwardRef<
  React.ElementRef<typeof ListboxPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ListboxPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </ListboxPrimitive.Item>
))
ListboxItem.displayName = ListboxPrimitive.Item.displayName

const ListboxItemText = React.forwardRef<
  React.ElementRef<typeof ListboxPrimitive.ItemText>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.ItemText>
>(({ className, ...props }, ref) => (
  <ListboxPrimitive.ItemText
    ref={ref}
    className={cn("size-[17px] font-medium leading-none", className)}
    {...props}
  />
))
ListboxItemText.displayName = ListboxPrimitive.ItemText.displayName

const ListboxSeparator = React.forwardRef<
  React.ElementRef<typeof ListboxPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ListboxPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ListboxSeparator.displayName = ListboxPrimitive.Separator.displayName

export {
  Listbox,
  ListboxTrigger,
  ListboxViewport,
  ListboxItem,
  ListboxItemText,
  ListboxSeparator,
}
