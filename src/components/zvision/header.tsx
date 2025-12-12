'use client';
import { BrainCircuit, Eye, LayoutGrid, PanelsLeftRight, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { useSidebar } from '../ui/sidebar';

type ViewMode = 'designer' | 'developer';

type AppHeaderProps = {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  isPreviewing: boolean;
  onToggleIsPreviewing: () => void;
};

export function AppHeader({ mode, onModeChange, isPreviewing, onToggleIsPreviewing }: AppHeaderProps) {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}><PanelsLeftRight/></Button>
        <BrainCircuit className="h-7 w-7 text-primary hidden sm:block" />
        <h1 className="text-xl font-semibold tracking-tight">ZVision Studio</h1>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <ToggleGroup type="single" value={mode} onValueChange={(value: ViewMode) => value && onModeChange(value)} className="h-10">
          <ToggleGroupItem value="designer" aria-label="Designer mode" className="px-4">
            <LayoutGrid className="h-5 w-5 mr-2" />
            Designer
          </ToggleGroupItem>
          <ToggleGroupItem value="developer" aria-label="Developer mode" className="px-4">
            <Workflow className="h-5 w-5 mr-2" />
            Developer
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-4">
        {mode === 'designer' &&
          <Button variant="outline" size="sm" onClick={onToggleIsPreviewing} className={cn('h-10 px-4', isPreviewing && 'bg-accent text-accent-foreground')}>
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewing ? 'Editing' : 'Preview'}
          </Button>
        }
        <Avatar className="h-9 w-9 hidden sm:flex">
          {userAvatar && <Image src={userAvatar.imageUrl} alt="User Avatar" width={40} height={40} data-ai-hint={userAvatar.imageHint}/>}
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}><PanelsLeftRight/></Button>
      </div>
    </header>
  );
}
