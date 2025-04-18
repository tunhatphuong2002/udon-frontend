import React from 'react';

export const UpcomingFeatures: React.FC = () => {
  return (
    <section className="w-full overflow-hidden max-md:max-w-full">
      <div className="flex flex-col relative min-h-[900px] w-full items-stretch pt-[49px] pb-[150px] px-20 max-md:max-w-full max-md:pb-[100px] max-md:px-5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/94452dc84dfc6dd851a0a4108c7cdb0a5b8562ed?placeholderIfAbsent=true"
          className="absolute h-full w-full object-cover inset-0"
          alt="Background"
        />
        <div className="relative z-10 w-full max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-[77%] max-md:w-full max-md:ml-0">
              <h2 className="text-8xl font-semibold leading-[103px] text-center relative border-white border-solid border-2 max-md:max-w-full max-md:text-[40px] max-md:leading-[48px] max-md:mt-[17px]">
                Upcoming On Udon Finance
              </h2>
            </div>
          </div>
        </div>

        <div className="relative shadow-[0px_0px_40px_rgba(31,109,233,0.21)] self-center flex mb-[-30px] min-h-[434px] w-full max-w-[1169px] items-stretch gap-9 flex-wrap -mt-7 max-md:max-w-full max-md:mb-2.5">
          <div className="border flex min-w-60 flex-col overflow-hidden items-stretch text-center flex-1 shrink basis-[0%] pt-10 pb-[23px] px-[43px] rounded-3xl border-[rgba(31,109,233,0.18)] border-solid max-md:max-w-full max-md:px-5">
            <div className="bg-[rgba(255,255,255,0.5)] shadow-[0px_0px_18px_rgba(255,255,255,0.95)] border self-center flex w-[441px] max-w-full flex-col items-stretch text-8xl font-bold whitespace-nowrap justify-center px-[42px] py-[25px] rounded-3xl border-[rgba(255,255,255,0.99)] border-solid max-md:text-[40px] max-md:px-5">
              <div className="shadow-[0px_4px_13px_rgba(29,87,179,0.39)] border flex flex-col items-stretch justify-center px-8 py-[22px] rounded-3xl border-[rgba(255,255,255,0.52)] border-solid max-md:text-[40px] max-md:px-5">
                <div className="shadow-[0px_4px_13px_rgba(29,87,179,0.39)] flex w-full flex-col items-stretch justify-center px-[50px] py-[27px] rounded-[18px] max-md:text-[40px] max-md:px-5">
                  <div className="flex items-center gap-[18px] max-md:text-[40px]">
                    <div className="border self-stretch my-auto border-white border-solid max-md:text-[40px]">
                      3X
                    </div>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/dabe647a150f446af838634cd30718003ff3b9cd?placeholderIfAbsent=true"
                      className="aspect-[0.66] object-contain w-[45px] self-stretch shrink-0 my-auto"
                      alt="Multiplier icon"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="font-medium mt-4 max-md:max-w-full">
              <h3 className="text-[rgba(67,67,67,1)] text-xl max-md:max-w-full">
                Farming Strategy
              </h3>
              <p className="text-[rgba(107,107,107,1)] text-[15px] mt-3 max-md:max-w-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </p>
            </div>
          </div>

          <div className="border min-w-60 overflow-hidden font-medium w-[419px] rounded-3xl border-[rgba(31,109,233,0.18)] border-solid">
            <div className="flex flex-col shadow-[0px_0px_10px_rgba(255,255,255,0.46)] relative aspect-[0.965] w-full pl-[21px] pb-[23px] max-md:pl-5">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/41196846bd812865e1e09ceea3c979e5062f0a6b?placeholderIfAbsent=true"
                className="absolute h-full w-full object-cover inset-0"
                alt="Strategy background"
              />
              <div className="relative bg-[rgba(255,255,255,0.33)] shadow-[0px_4px_13px_rgba(29,87,179,0.39)] flex w-[336px] max-w-full flex-col text-[28px] whitespace-nowrap justify-center px-[67px] py-[35px] rounded-3xl max-md:px-5">
                <div className="shadow-[0px_0px_16px_rgba(255,255,255,1)] w-full">
                  <div className="self-stretch shadow-[0px_4px_11px_rgba(111,205,147,0.42)] w-full gap-2.5 text-[rgba(34,107,84,1)] px-3 py-[15px] rounded-xl">
                    Long
                  </div>
                  <div className="self-stretch shadow-[0px_4px_11px_rgba(205,111,111,0.42)] w-full gap-2.5 text-[rgba(107,34,34,1)] mt-[18px] px-3 py-[15px] rounded-xl">
                    Short
                  </div>
                  <div className="self-stretch shadow-[0px_4px_11px_rgba(111,152,205,0.42)] w-full gap-2.5 text-[rgba(34,57,107,1)] mt-[18px] px-3 py-[15px] rounded-xl">
                    Neutral
                  </div>
                </div>
              </div>
              <div className="relative w-[377px] max-w-full text-center mt-[21px]">
                <h3 className="text-[rgba(251,253,255,1)] text-xl">Farming Strategy</h3>
                <p className="text-[rgba(238,245,255,1)] text-[15px] mt-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
