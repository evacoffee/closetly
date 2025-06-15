import * as React from 'react';

declare module '@/components/ui/dialog' {
  export const Dialog: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const DialogTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
  export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
  export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
  export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
}

declare module '@/components/ui/tabs' {
  export const Tabs: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const TabsTrigger: React.FC<{
    value: string;
    className?: string;
    children: React.ReactNode;
  }>;
  export const TabsContent: React.FC<{
    value: string;
    className?: string;
    children: React.ReactNode;
  }>;
}

declare module '@/components/ui/badge' {
  export const Badge: React.FC<{
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
    children: React.ReactNode;
  }>;
  
  export const badgeVariants: (props: any) => string;
}

declare module 'class-variance-authority' {
  export function cva<T extends (...args: any) => any>(...args: any): T;
  export type VariantProps<T> = any;
}

declare module 'clsx' {
  export type ClassValue = string | number | boolean | undefined | null | ClassDictionary | ClassArray;
  interface ClassDictionary {
    [id: string]: boolean | undefined | null;
  }
  interface ClassArray extends Array<ClassValue> {}
  
  function clsx(...inputs: ClassValue[]): string;
  export = clsx;
  export default clsx;
}

declare module 'tailwind-merge' {
  type ClassNameValue = string | number | boolean | undefined | null;
  type ClassNameArray = ClassNameValue[];
  type ClassNameDictionary = { [key: string]: boolean | undefined | null };
  type ClassName = ClassNameValue | ClassNameArray | ClassNameDictionary;
  
  function twMerge(...classLists: ClassName[]): string;
  export = twMerge;
  export default twMerge;
}
