'use client';
import { BrainCircuit, Eye, PanelBottom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

type AppHeaderProps = {
  onTogglePreview: () => void;
};

export function AppHeader({ onTogglePreview }: AppHeaderProps) {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <BrainCircuit className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">ZVision Studio</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onTogglePreview} aria-label="Toggle Preview Panel">
          <PanelBottom className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Avatar className="h-9 w-9">
          {userAvatar && <Image src={userAvatar.imageUrl} alt="User Avatar" width={40} height={40} data-ai-hint={userAvatar.imageHint}/>}
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
