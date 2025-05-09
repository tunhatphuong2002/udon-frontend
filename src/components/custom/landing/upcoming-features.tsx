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

      <div className="flex flex-col items-center relative pt-12 md:pt-[30px] px-6 z-10 gap-10">
        {/* Title */}
        <Typography
          as="h1"
          className="text-7xl md:text-15xl text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-black to-[#42498c] max-w-2xl"
        >
          Upcoming On Udon Finance
        </Typography>

        {/* Main Content Area */}
        <div className="w-full relative">
          {/* Notification Cards */}
          {/* {notificationCards.map((card, index) => (
            <Card
              key={index}
              className="w-[280px] h-[104px] absolute rounded-xl shadow-[0px_0px_1.7px_#00000040] backdrop-blur-[9.7px] z-20 border border-border"
              style={
                index === 0
                  ? { top: card.position.top, left: card.position.left }
                  : { top: card.position.top, right: card.position.right }
              }
            >
              <CardContent className="flex flex-col items-start gap-3 p-3">
                <div className="flex items-center justify-between relative self-stretch w-full">
                  <div className="inline-flex items-center gap-[7px]">
                    <div className="w-7 h-7 bg-[#d86479] rounded-[14px]" />
                    <div className="inline-flex flex-col items-start justify-center">
                      <div className="[font-family:'Inter-Medium',Helvetica] font-medium text-black text-sm">
                        Deposit
                      </div>
                      <div className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#8ab7f6] text-xs -mt-0.5">
                        {card.handle}
                      </div>
                    </div>
                  </div>
                  <Ellipsis className="w-6 h-6" />
                </div>
                <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-black text-[15px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                  {loremText}
                </div>
              </CardContent>
            </Card>
          ))} */}
          {/* Strategy Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-9 h-[500px]">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[100vw] h-[70vh] rounded-full bg-[#8ab7f669]/40 z-0 blur-[100px]"></div>
            {/* Left Strategy Card */}
            <Card className="md:col-span-7 rounded-3xl overflow-hidden border border-solid border-[#1f6ce82e] backdrop-blur-[10.35px] [background:radial-gradient(50%_50%_at_53%_53%,rgba(216,230,255,0.49)_0%,rgba(255,255,255,0.49)_100%)] shadow-lg">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                {/* image */}
                <div className="w-[441px] h-[263px] relative">
                  <Image
                    src="/images/landing/upcoming/3x.png"
                    alt="3x"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Description */}
                <div className="flex flex-col items-center gap-3 mt-16">
                  <Typography as="h2" className="text-xl text-[#424242] text-center font-medium">
                    Farming Strategy
                  </Typography>
                  <Typography className="text-[#6b6b6b] text-base md:text-[15px] text-center line-clamp-3">
                    {leftSideText}
                  </Typography>
                </div>
              </CardContent>
            </Card>

            {/* Right Strategy Card */}
            <Card className="md:col-span-5 rounded-3xl overflow-hidden border border-solid border-[#1f6ce82e] backdrop-blur-[10.35px] bg-gradient-to-b from-[#5BB1E8] to-[#4977C2] shadow-lg">
              <CardContent className="p-6 md:p-10 relative min-h-[500px] flex flex-col justify-between">
                {/* background image */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                  <Image
                    src="/images/landing/upcoming/star.png"
                    alt="vector"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Strategy Options */}
                <div className="absolute top-[-20px] right-[-20px] w-[360px] mx-auto bg-[#ffffff54] rounded-3xl backdrop-blur-[8.85px] py-12 px-8 z-10 shadow-lg">
                  <div className="flex flex-col gap-[18px] w-[186px]">
                    {strategyOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-center px-3 py-[15px] rounded-xl ${option.bgColor} ${option.shadow}`}
                      >
                        <Typography className={`text-[28px] font-medium ${option.textColor}`}>
                          {option.name}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col items-center gap-3 z-10 mt-auto">
                  <Typography as="h2" className="text-xl text-[#fbfcff] text-center font-medium">
                    Farming Strategy
                  </Typography>
                  <Typography className="text-[#edf5ff] text-base md:text-[15px] text-center line-clamp-3">
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
