import React from 'react';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-md:max-w-full h-[400px]">
      <div className="flex flex-col relative w-full pt-[35px] px-14 max-md:max-w-full max-md:px-5 h-full">
        {/* background */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-row z-0">
          <div className="bg-black h-full flex-1 rounded-tr-[40px] border-white border-2"></div>
          <div className="bg-black h-full w-[20vw] rounded-tl-[40px] border-white border-2"></div>
        </div>

        <div className="relative w-[50vw] max-w-full z-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-[33%] max-md:w-full max-md:ml-0">
              <div className="relative text-[15px] text-[rgba(206,206,206,1)] font-medium max-md:mt-10">
                <div className="bg-[rgba(168,212,246,1)] flex min-h-8 w-[156px] max-w-full" />
                <div className="mt-[9px]">Deposit and start earning</div>
              </div>
            </div>
            <nav className="w-[67%] ml-5 max-md:w-full max-md:ml-0">
              <div className="relative flex grow gap-6 text-base whitespace-nowrap mt-3 max-md:mt-10">
                <div className="flex-1 shrink basis-[0%] rounded-xl">
                  <h4 className="text-[rgba(251,253,255,1)] font-semibold">Resources</h4>
                  <div className="w-full text-[rgba(206,206,206,1)] font-normal mt-6">
                    <a href="#" className="block">
                      Documentation
                    </a>
                    <a href="#" className="block mt-3">
                      Github
                    </a>
                  </div>
                </div>
                <div className="flex-1 shrink basis-[0%] rounded-xl">
                  <h4 className="text-[rgba(251,253,255,1)] font-semibold">Community</h4>
                  <div className="w-full text-[rgba(206,206,206,1)] font-normal mt-6">
                    <a href="#" className="block">
                      Twitter
                    </a>
                    <a href="#" className="block mt-3">
                      Telegram
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="relative text-[rgba(206,206,206,1)] text-[13px] font-medium mt-4 max-md:mt-10">
            Deposit and start earning
          </div>
        </div>

        <div className="absolute bottom-[-150px] left-0 w-full h-[320px]">
          <Image
            src="/images/landing/footer/udon-text.png"
            className="object-contain"
            alt="Footer decoration"
            fill
          />
        </div>
      </div>
    </footer>
  );
};
