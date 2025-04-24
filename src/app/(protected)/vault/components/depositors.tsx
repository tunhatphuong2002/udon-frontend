import React from 'react';

export const VaultDepositors: React.FC = () => {
  return (
    <div className="w-full mt-6 max-md:max-w-full">
      <div className="text-[rgba(121,121,121,1)] text-base font-medium leading-none max-md:max-w-full">
        Distribution
      </div>
      <div className="bg-[rgba(31,31,33,1)] border flex w-full flex-col items-stretch mt-[18px] p-[18px] rounded-[18px] border-[rgba(73,73,76,1)] border-solid max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <div className="bg-[rgba(15,15,16,1)] flex w-full text-sm text-[rgba(217,217,217,1)] font-normal flex-wrap px-3 py-1.5 rounded-xl max-md:max-w-full">
            <div className="min-w-60 gap-1 whitespace-nowrap flex-1 shrink basis-[0%]">User</div>
            <div className="min-w-60 gap-1 w-[383px]">Supply Amount</div>
            <div className="min-w-60 gap-1 flex-1 shrink basis-[0%]">% of Deposits</div>
          </div>
          {/* Depositor rows implementation */}
        </div>
      </div>
    </div>
  );
};
