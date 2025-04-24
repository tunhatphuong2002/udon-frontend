import React from 'react';
import { StatCard } from '@/app/(protected)/vault/components/stat-card';

export const VaultRisk: React.FC = () => {
  return (
    <div className="w-full mt-6 max-md:max-w-full">
      <div className="flex w-full items-center gap-[18px] flex-wrap max-md:max-w-full">
        <StatCard
          title="Risk Rating"
          value={
            <>
              <span className="text-[rgba(121,121,121,1)]">Not provided by</span> Curator
            </>
          }
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/2fb9c5547b41dc0a22179981179f3f42c9d6af8f?placeholderIfAbsent=true"
        />
        <StatCard
          title="Curator TVL"
          value="$244.45M"
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/2fb9c5547b41dc0a22179981179f3f42c9d6af8f?placeholderIfAbsent=true"
        />
        <StatCard
          title="Vault Deployment Date"
          value="24/07/2024"
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/2fb9c5547b41dc0a22179981179f3f42c9d6af8f?placeholderIfAbsent=true"
        />
      </div>
      <div className="flex w-full items-stretch gap-[18px] flex-wrap mt-[18px] max-md:max-w-full">
        <StatCard
          title="Owner"
          value="0xD4C8...2446"
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/6b3c33882a1e65584546fd11496c03693e6a4c12?placeholderIfAbsent=true"
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/36c25d606da687d2ec7ef1c9b60240857376b05f?placeholderIfAbsent=true"
        />
        <StatCard
          title="Curator Address"
          value="0xD4C8...2446"
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/6b3c33882a1e65584546fd11496c03693e6a4c12?placeholderIfAbsent=true"
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/a1d5f302ec415005aa4bd6d997e011960019c604?placeholderIfAbsent=true"
        />
        <StatCard
          title="Timelock / Guardian"
          value="0xD4C8...2446"
          background="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/6b3c33882a1e65584546fd11496c03693e6a4c12?placeholderIfAbsent=true"
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/c0a648fad8d46b2fb00fe2ecb3887bea32e9d9a6?placeholderIfAbsent=true"
        />
      </div>
    </div>
  );
};
