import React from 'react';

export const VaultDisclosures: React.FC = () => {
  return (
    <div className="w-full mt-6 max-md:max-w-full">
      <div className="flex w-full gap-[40px_100px] text-[rgba(206,206,206,1)] font-medium leading-none justify-between flex-wrap max-md:max-w-full">
        <div className="text-xl">Disclosures</div>
        <div className="flex items-center gap-[7px] text-[13px]">
          <div className="self-stretch my-auto">Learn more</div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/82cf0dd631bfc31bdac778840bc0f0a1f11ad3b8?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-3.5 self-stretch shrink-0 my-auto"
          />
        </div>
      </div>
      <div className="flex flex-col relative min-h-[55px] w-full text-base text-[rgba(190,190,190,1)] font-normal mt-6 p-[18px] rounded-[18px] max-md:max-w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/f79b8d13f181fa71eaad672cb54de4d12477c123?placeholderIfAbsent=true"
          className="absolute h-full w-full object-cover inset-0"
        />
        Curator has not submitted a Disclosure.
      </div>
    </div>
  );
};
