'use client';

import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/common/table';
import { SupplyModal } from './SupplyModal';

interface AssetTableShadcnProps {
  title: string;
  showCollateral?: boolean;
}

const demoRows = [
  { name: 'WBTC', balance: '0', apy: '<0.001%' },
  { name: 'ETH', balance: '0', apy: '<0.001%' },
  { name: 'USDC', balance: '0', apy: '<0.001%' },
  { name: 'DAI', balance: '0', apy: '<0.001%' },
  { name: 'LINK', balance: '0', apy: '<0.001%' },
  { name: 'ARB', balance: '0', apy: '<0.001%' },
];

export const AssetTableShadcn: React.FC<AssetTableShadcnProps> = ({
  title,
  showCollateral = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(undefined);

  const handleSupplyClick = (asset: string) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  return (
    <div className="flex-1 border bg-[#18181A] p-3 sm:p-5 rounded-[18px] border-solid border-[#49494C] min-w-[320px] max-w-full mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-[#D9D9D9]">{title}</h2>
      <div className="rounded bg-[rgba(138,169,246,0.23)] mt-2 sm:mt-2.5 p-2 sm:p-2.5 text-xs sm:text-sm text-[#D9D9D9]">
        Your Ethereum wallet is empty. Purchase or transfer assets.
      </div>
      <div className="mt-3 sm:mt-5 overflow-x-auto -mx-3 sm:-mx-0 px-3 sm:px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-[#D9D9D9] min-w-[90px] sm:min-w-[110px] text-xs sm:text-sm">
                Assets
              </TableHead>
              <TableHead className="text-center text-[#D9D9D9] text-xs sm:text-sm">
                Wallet balance
              </TableHead>
              <TableHead className="text-center text-[#D9D9D9] text-xs sm:text-sm">APY</TableHead>
              {showCollateral && (
                <TableHead className="text-center text-[#D9D9D9] text-xs sm:text-sm">
                  Collateral
                </TableHead>
              )}
              <TableHead className="text-center text-[#D9D9D9]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoRows.map((asset, i) => (
              <TableRow key={i}>
                {/* Asset Icon & Name */}
                <TableCell className="text-center p-2 sm:p-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<svg width="70" height="25" viewBox="0 0 80 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 70px; height: 25px"> <circle cx="12" cy="12.5" r="12" fill="#D9D9D9"></circle> <text fill="#D9D9D9" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="16"><tspan x="30" y="18.3182">${asset.name}</tspan></text> </svg>`,
                    }}
                    className="mx-auto"
                  />
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm p-2 sm:p-4">
                  {asset.balance}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm p-2 sm:p-4">
                  {asset.apy}
                </TableCell>
                {showCollateral && (
                  <TableCell className="text-center p-2 sm:p-4">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<svg width="70" height="19" viewBox="0 0 70 19" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 60px; height: 19px"> <circle cx="9" cy="9.5" r="9" fill="#1E1E1E"></circle> <circle cx="22" cy="9.5" r="9" fill="#414141"></circle> <circle cx="35" cy="9.5" r="9" fill="#535353"></circle> <circle cx="48" cy="9.5" r="9" fill="#797979"></circle> <circle cx="61" cy="9.5" r="9" fill="#949494"></circle> </svg>`,
                      }}
                      className="mx-auto"
                    />
                    <span className="text-xs sm:text-sm">+4</span>
                  </TableCell>
                )}
                <TableCell className="text-center p-2 sm:p-4">
                  <button
                    className="text-[#1E1E1E] shadow-[0px_2px_1px_0px_#FFF_inset] text-xs sm:text-sm font-medium bg-[#EDEDED] px-3 sm:px-5 py-2 sm:py-2.5 rounded-3xl hover:bg-[#DBDBDB] transition-colors"
                    onClick={() => handleSupplyClick(asset.name)}
                    aria-label={`Supply ${asset.name}`}
                  >
                    Supply
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Supply Modal */}
      <SupplyModal open={modalOpen} onOpenChange={setModalOpen} assetName={selectedAsset} />
    </div>
  );
};
