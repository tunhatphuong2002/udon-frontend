'use client';

import React from 'react';

interface AssetRowProps {
  name: string;
  balance: string;
  apy: string;
  showCollateral?: boolean;
}

export const AssetRow: React.FC<AssetRowProps> = ({
  name,
  balance,
  apy,
  showCollateral = false,
}) => {
  return (
    <div className="flex items-center px-0 py-2.5">
      <div className="flex-1 text-center text-[#D9D9D9]">
        <div
          dangerouslySetInnerHTML={{
            __html: `<svg id="384:1325" width="80" height="25" viewBox="0 0 80 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="asset-icon" style="width: 80px; height: 25px"> <circle cx="12" cy="12.5" r="12" fill="#D9D9D9"></circle> <text fill="#D9D9D9" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="16" letter-spacing="0em"><tspan x="30" y="18.3182">${name}</tspan></text> </svg>`,
          }}
        />
      </div>
      <div className="flex-1 text-center text-[#D9D9D9]">{balance}</div>
      <div className="flex-1 text-center text-[#D9D9D9]">{apy}</div>
      {showCollateral && (
        <div className="flex-1 text-center text-[#D9D9D9]">
          <div
            dangerouslySetInnerHTML={{
              __html: `<svg id="384:1331" width="70" height="19" viewBox="0 0 70 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="collateral-icon" style="width: 70px; height: 19px"> <circle cx="9" cy="9.5" r="9" fill="#1E1E1E"></circle> <circle cx="22" cy="9.5" r="9" fill="#414141"></circle> <circle cx="35" cy="9.5" r="9" fill="#535353"></circle> <circle cx="48" cy="9.5" r="9" fill="#797979"></circle> <circle cx="61" cy="9.5" r="9" fill="#949494"></circle> </svg>`,
            }}
          />
          <span>+4</span>
        </div>
      )}
      <div className="flex-1 text-center text-[#D9D9D9]">
        <button className="text-[#1E1E1E] shadow-[0px_2px_1px_0px_#FFF_inset] text-[15px] font-medium bg-[#EDEDED] px-5 py-2.5 rounded-3xl">
          Supply
        </button>
      </div>
    </div>
  );
};
