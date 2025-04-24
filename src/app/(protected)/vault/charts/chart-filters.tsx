import React from 'react';
import { cn } from '@/types/utils/tailwind';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';

interface FilterPillProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const FilterPill: React.FC<FilterPillProps> = ({ active, children, onClick }) => (
  <div
    className={cn(
      'px-4 py-1 rounded-3xl text-sm font-medium select-none transition cursor-pointer',
      active
        ? 'bg-[rgba(74,74,80,1)] text-white'
        : 'text-[rgba(121,121,121,1)] hover:bg-[rgba(51,51,54,1)]'
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

interface ChartFiltersProps {
  chartType: 'deposit' | 'liquidity';
  setChartType: (type: 'deposit' | 'liquidity') => void;
  currency: 'usdc' | 'usdt';
  setCurrency: (currency: 'usdc' | 'usdt') => void;
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  timeOptions?: string[];
}

export const ChartFilters: React.FC<ChartFiltersProps> = ({
  chartType,
  setChartType,
  currency,
  setCurrency,
  timePeriod,
  setTimePeriod,
  timeOptions = ['1 week', '1 month', '3 months', '6 months', '1 year', 'All time'],
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="bg-[rgba(51,51,54,1)] flex rounded-3xl p-1">
        <div
          className={cn(
            'px-3 py-1 rounded-3xl cursor-pointer transition',
            chartType === 'deposit'
              ? 'bg-[rgba(74,74,80,1)] text-white'
              : 'text-[rgba(121,121,121,1)]'
          )}
          onClick={() => setChartType('deposit')}
        >
          Deposit
        </div>
        <div
          className={cn(
            'px-3 py-1 rounded-3xl cursor-pointer transition',
            chartType === 'liquidity'
              ? 'bg-[rgba(74,74,80,1)] text-white'
              : 'text-[rgba(121,121,121,1)]'
          )}
          onClick={() => setChartType('liquidity')}
        >
          Liquidity
        </div>
      </div>

      <div className="bg-[rgba(51,51,54,1)] flex rounded-3xl p-1">
        <div
          className={cn(
            'px-3 py-1 rounded-3xl cursor-pointer transition',
            currency === 'usdc' ? 'bg-[rgba(74,74,80,1)] text-white' : 'text-[rgba(121,121,121,1)]'
          )}
          onClick={() => setCurrency('usdc')}
        >
          USDC
        </div>
        <div
          className={cn(
            'px-3 py-1 rounded-3xl cursor-pointer transition',
            currency === 'usdt' ? 'bg-[rgba(74,74,80,1)] text-white' : 'text-[rgba(121,121,121,1)]'
          )}
          onClick={() => setCurrency('usdt')}
        >
          USDT
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div className="bg-[rgba(51,51,54,1)] flex items-center gap-1 text-[rgba(206,206,206,1)] px-3 py-1 rounded-3xl cursor-pointer">
            {timePeriod}
            <ChevronDown className="h-4 w-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-[rgba(40,40,44,1)] border-[rgba(73,73,76,1)]">
          <div className="flex flex-col space-y-1">
            {timeOptions.map(option => (
              <div
                key={option}
                className={cn(
                  'px-3 py-1.5 rounded text-sm cursor-pointer hover:bg-[rgba(51,51,54,1)]',
                  timePeriod === option ? 'text-primary' : 'text-[rgba(206,206,206,1)]'
                )}
                onClick={() => setTimePeriod(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
