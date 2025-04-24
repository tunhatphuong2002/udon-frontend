import React from 'react';
import { StatCard } from '@/app/(protected)/vault/components/stat-card';

export const VaultAllocation: React.FC = () => {
  return (
    <div className="w-full mt-6 max-md:max-w-full">
      <div className="flex w-full items-stretch gap-[18px] flex-wrap max-md:max-w-full">
        <StatCard
          title="Allocator Address"
          value="0xD4C8...2446"
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/6b3c33882a1e65584546fd11496c03693e6a4c12?placeholderIfAbsent=true"
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/7aeb4411e30c0d3a5ccb2aaff74ece50576064f4?placeholderIfAbsent=true"
        />
        <StatCard
          title="Allocator Address"
          value="0xD4C8...2446"
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/6b3c33882a1e65584546fd11496c03693e6a4c12?placeholderIfAbsent=true"
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/a1d5f302ec415005aa4bd6d997e011960019c604?placeholderIfAbsent=true"
        />
        <StatCard
          title="Allocator Address"
          value={
            <>
              0xD4C8...2446
              <div className="bg-[rgba(68,68,71,1)] text-xs text-white px-2 py-0.5 rounded-xl mt-1">
                Public Allocator
              </div>
            </>
          }
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/6b3c33882a1e65584546fd11496c03693e6a4c12?placeholderIfAbsent=true"
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/c0a648fad8d46b2fb00fe2ecb3887bea32e9d9a6?placeholderIfAbsent=true"
        />
      </div>
      {/* Rest of allocation history implementation */}
    </div>
  );
};
