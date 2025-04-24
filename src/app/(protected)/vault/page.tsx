'use client';

import React from 'react';
import { Typography } from '@/components/common/typography';
import {
  SidePanel,
  VaultAllocation,
  VaultHeader,
  VaultOverview,
  VaultPerformance,
  VaultRisk,
  VaultDisclosures,
  VaultDepositors,
} from './components';

export default function VaultPage() {
  return (
    <div className="fcol items-center py-12 px-4 md:px-10 lg:pt-[250px] lg:pb-[100px] lg:px-[40px]">
      <div className="w-full max-w-[1200px]">
        <div className="flex flex-col md:flex-row gap-5">
          <main className="w-full md:w-[70%]">
            <div className="grow">
              <VaultHeader />

              {/* Overview Section */}
              <section className="w-full mt-8 md:mt-10">
                <Typography variant="h4" color="primary" weight="medium" className="mb-4">
                  Overview
                </Typography>
                <VaultOverview />
              </section>

              {/* Performance Section */}
              <section className="w-full mt-8 md:mt-10">
                <Typography variant="h4" color="primary" weight="medium" className="mb-4">
                  Performance
                </Typography>
                <VaultPerformance />
              </section>

              {/* Risk Section */}
              <section className="w-full mt-8 md:mt-10">
                <Typography variant="h4" color="primary" weight="medium" className="mb-4">
                  Risk
                </Typography>
                <VaultRisk />
              </section>

              {/* Disclosures Section */}
              <section className="w-full mt-8 md:mt-10">
                <Typography variant="h4" color="primary" weight="medium" className="mb-4">
                  Disclosures
                </Typography>
                <VaultDisclosures />
              </section>

              {/* Allocation History Section */}
              <section className="w-full mt-8 md:mt-10">
                <Typography variant="h4" color="primary" weight="medium" className="mb-4">
                  Allocation History
                </Typography>
                <VaultAllocation />
              </section>

              {/* Depositors Section */}
              <section className="w-full mt-8 md:mt-10">
                <Typography variant="h4" color="primary" weight="medium" className="mb-4">
                  Depositors
                </Typography>
                <VaultDepositors />
              </section>
            </div>
          </main>

          <aside className="w-full md:w-[30%] mt-8 md:mt-0">
            <SidePanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
