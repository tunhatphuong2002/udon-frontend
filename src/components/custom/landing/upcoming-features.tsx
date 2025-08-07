import React from 'react';
import { Card, CardContent } from '@/components/common/card';
// import { Ellipsis } from 'lucide-react';
import { Typography } from '@/components/common/typography';
import Image from 'next/image';

export const UpcomingFeatures: React.FC = () => {
  // Data for notification cards
  // const notificationCards = [
  //   {
  //     position: { top: '-80px', left: '-40px' },
  //     handle: '@ssssssssss',
  //   },
  //   {
  //     position: { top: '-200px', right: '-30px' },
  //     handle: '@ssssssssss',
  //   },
  // ];

  // Data for strategy options
  const strategyOptions = [
    {
      name: 'Long',
      textColor: 'text-[#216a53]',
      bgColor: 'bg-gradient-to-r from-[rgba(111,205,147,0.59)] to-[rgba(223,255,235,0.52)]',
      shadow: 'shadow-[0px_4px_11.1px_#6fcc936b]',
    },
    {
      name: 'Short',
      textColor: 'text-[#6a2121]',
      bgColor: 'bg-gradient-to-l from-[rgba(255,208,208,0.59)] to-[rgba(197,89,89,0.52)]',
      shadow: 'shadow-[0px_4px_11.1px_#cc6f6f6b]',
    },
    {
      name: 'Neutral',
      textColor: 'text-[#21386a]',
      bgColor: 'bg-gradient-to-r from-[rgba(111,166,205,0.59)] to-[rgba(207,241,255,0.52)]',
      shadow: 'shadow-[0px_4px_11.1px_#6f97cc6b]',
    },
  ];

  const leftSideText = 'Maximize your profits by leveraging across a variety of farming pools.';
  const rightSideText =
    'Leverage market-neutral strategies, going long or short with clearly defined risk.';

  return (
    <section className="relative container mx-auto h-screen">
      {/* Background animation */}
      <div className="absolute h-full w-full inset-0 z-0">
        <video
          src="/images/landing/upcoming/bg.webm"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col items-center relative pt-8 sm:pt-12 md:pt-[30px] px-4 sm:px-6 z-10 gap-6 sm:gap-10">
        {/* Title */}
        <Typography
          as="h1"
          className="text-4xl sm:text-6xl md:text-15xl text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-black to-[#42498c] max-w-2xl"
        >
          Upcoming On Udon Finance
        </Typography>

        {/* Main Content Area */}
        <div className="w-full relative">
          {/* Strategy Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-9 min-h-[500px] sm:min-h-[550px] md:h-[500px]">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[100vw] h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-full bg-[#8ab7f669]/40 z-0 blur-[50px] sm:blur-[75px] md:blur-[100px]"></div>
            {/* Left Strategy Card */}
            <Card className="md:col-span-7 rounded-2xl sm:rounded-3xl overflow-hidden border border-solid border-[#1f6ce82e] backdrop-blur-[10.35px] [background:radial-gradient(50%_50%_at_53%_53%,rgba(216,230,255,0.49)_0%,rgba(255,255,255,0.49)_100%)] shadow-lg">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[550px] md:min-h-[500px]">
                {/* image */}
                <div className="w-full max-w-[250px] sm:max-w-[400px] md:w-[441px] h-[150px] sm:h-[220px] md:h-[263px] relative">
                  <Image
                    src="/images/landing/upcoming/3x.png"
                    alt="3x"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Description */}
                <div className="flex flex-col items-center gap-2 sm:gap-3 mt-6 sm:mt-12 md:mt-16">
                  <Typography
                    as="h2"
                    className="text-3xl sm:text-xl text-[#424242] text-center font-medium"
                  >
                    Farming Strategy
                  </Typography>
                  <Typography className="text-[#6b6b6b] text-lg sm:text-base md:text-[15px] text-center line-clamp-3">
                    {leftSideText}
                  </Typography>
                </div>
              </CardContent>
            </Card>

            {/* Right Strategy Card */}
            <Card className="md:col-span-5 rounded-2xl sm:rounded-3xl overflow-hidden border border-solid border-[#1f6ce82e] backdrop-blur-[10.35px] bg-gradient-to-b from-[#5BB1E8] to-[#4977C2] shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-10 relative min-h-[300px] sm:min-h-[550px] md:min-h-[500px] flex flex-col justify-between">
                {/* background image */}
                <div className="absolute top-0 left-0 w-full h-full z-0 opacity-30">
                  <Image
                    src="/images/landing/upcoming/star.png"
                    alt="vector"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Strategy Options */}
                <div className="absolute top-[-20px] right-[-20px] w-[280px] sm:w-[360px] mx-auto bg-[#ffffff54] rounded-3xl backdrop-blur-[8.85px] py-6 sm:py-12 px-4 sm:px-8 z-20 shadow-lg">
                  <div className="flex flex-col gap-3 sm:gap-[18px] w-[140px] sm:w-[186px]">
                    {strategyOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-center px-3 py-2 sm:py-[15px] rounded-xl ${option.bgColor} ${option.shadow} relative z-10 border border-white/20`}
                      >
                        <Typography
                          className={`text-lg sm:text-[28px] font-medium ${option.textColor} relative z-10 drop-shadow-sm`}
                        >
                          {option.name}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col items-center gap-2 sm:gap-3 z-10 mt-auto pt-4 sm:pt-0">
                  <Typography
                    as="h2"
                    className="text-3xl sm:text-xl text-[#fbfcff] text-center font-medium drop-shadow-sm"
                  >
                    Farming Strategy
                  </Typography>
                  <Typography className="text-[#edf5ff] text-lg sm:text-base md:text-[15px] text-center line-clamp-3 drop-shadow-sm">
                    {rightSideText}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
