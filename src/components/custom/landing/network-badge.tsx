import { ShineBorder } from '@/components/common/shine-border';
import { Typography } from '@/components/common/typography';
import { capitalizeFirstLetter } from '@/utils/string';
import { cn } from '@/utils/tailwind';
import { SparklesIcon } from 'lucide-react';

// badge component
export const NetworkBadge = ({ network }: { network: 'testnet' | 'mainnet' }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium',
        'absolute right-[-54px] top-[-15px]',
        'bg-black/5'
      )}
    >
      <ShineBorder shineColor={['#36B1FF', '#E4F5FF']} duration={10} />
      <SparklesIcon className="w-3 h-3" />
      <Typography weight="medium" className="text-[8px] uppercase text-bold">
        {capitalizeFirstLetter(network)}
      </Typography>
    </div>
  );
};
