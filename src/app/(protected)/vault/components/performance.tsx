import React from 'react';
import { StatCard } from '@/app/(protected)/vault/components/stat-card';
import { StatCardGrid } from '@/app/(protected)/vault/components/stat-card-grid';

export const VaultPerformance: React.FC = () => {
  return (
    <div className="w-full mt-6 max-md:max-w-full">
      <StatCardGrid columns={3} gap="gap-[18px]" responsiveCols="max-md:grid-cols-1">
        <StatCard
          title="7D APY"
          value={
            <>
              6,88<span className="text-[rgba(101,101,101,1)]">%</span>
            </>
          }
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/2fb9c5547b41dc0a22179981179f3f42c9d6af8f?placeholderIfAbsent=true"
          className="h-full"
        />
        <StatCard
          title="30D APY"
          value={
            <>
              6,88<span className="text-[rgba(101,101,101,1)]">%</span>
            </>
          }
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/2fb9c5547b41dc0a22179981179f3f42c9d6af8f?placeholderIfAbsent=true"
          className="h-full"
        />
        <StatCard
          title="90D APY"
          value={
            <>
              6,88<span className="text-[rgba(101,101,101,1)]">%</span>
            </>
          }
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/2fb9c5547b41dc0a22179981179f3f42c9d6af8f?placeholderIfAbsent=true"
          className="h-full"
        />
      </StatCardGrid>
      <StatCardGrid
        columns={2}
        gap="gap-[18px]"
        className="mt-[18px]"
        responsiveCols="max-md:grid-cols-1"
      >
        <StatCard
          title="Performance Fee"
          value={
            <>
              10,00<span className="text-[rgba(101,101,101,1)]">%</span>
            </>
          }
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/2fb9c5547b41dc0a22179981179f3f42c9d6af8f?placeholderIfAbsent=true"
          className="h-full"
        />
        <StatCard
          title="30D APY"
          value={<>0xD4C8...2446</>}
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/2fb9c5547b41dc0a22179981179f3f42c9d6af8f?placeholderIfAbsent=true"
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/a1d5f302ec415005aa4bd6d997e011960019c604?placeholderIfAbsent=true"
          className="h-full"
        />
      </StatCardGrid>
    </div>
  );
};
