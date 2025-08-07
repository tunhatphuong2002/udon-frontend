'use client';

import React, { useState } from 'react';
import { Typography } from '@/components/common/typography';
import Image from 'next/image';
import Link from 'next/link';
// import { EllipsisIcon } from 'lucide-react';

type HoverState = 'none' | 'simple' | 'optimized' | 'low-cost' | 'per-market-rates';

type ItemType = {
  id: HoverState;
  title: string;
  description: string;
  type: 'earn' | 'borrow';
};

const ITEMS: ItemType[] = [
  {
    id: 'simple',
    title: 'Simple',
    description: 'Deposit and start earning',
    type: 'earn',
  },
  {
    id: 'optimized',
    title: 'Optimized',
    description: 'Deposit and start earning',
    type: 'earn',
  },
  {
    id: 'low-cost',
    title: 'Low costs',
    description: 'Deposit and start earning',
    type: 'borrow',
  },
  {
    id: 'per-market-rates',
    title: 'Per market rates',
    description: 'Deposit and start earning',
    type: 'borrow',
  },
];

export const InfrastructureSection: React.FC = () => {
  const [hoverState, setHoverState] = useState<HoverState>('none');
  const [cardHover, setCardHover] = useState<'earn' | 'borrow' | null>(null);
  const [activeTab, setActiveTab] = useState<'earn' | 'borrow'>('earn');

  const getImagePath = (state: HoverState) => {
    const basePath = '/images/landing/infratructure/';
    return `${basePath}${state}.png`;
  };

  const renderItems = (type: 'earn' | 'borrow') => {
    return ITEMS.filter(item => item.type === type).map(item => (
      <div
        key={item.id}
        className={`p-4 rounded-2xl transition-all duration-300 flex items-center gap-4 cursor-pointer group ${
          hoverState === item.id
            ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-xl transform scale-105'
            : 'bg-white/50 hover:bg-white/70 hover:shadow-lg'
        }`}
        onMouseEnter={() => setHoverState(item.id)}
        onMouseLeave={() => setHoverState('none')}
        onClick={() => {
          // On mobile, clicking changes the image
          if (window.innerWidth < 768) {
            setHoverState(item.id);
            // Auto-reset after 3 seconds on mobile
            setTimeout(() => {
              setHoverState('none');
            }, 3000);
          }
        }}
      >
        {hoverState === item.id && (
          <div className="w-6 h-6 flex-shrink-0 animate-pulse">
            <Image
              src="/images/landing/infratructure/lookup-icon.svg"
              alt="Lookup"
              width={24}
              height={24}
              className="w-full h-full"
            />
          </div>
        )}
        <div className="flex-1">
          <Typography
            as="h4"
            className={`text-base font-semibold transition-colors duration-300 ${
              hoverState === item.id
                ? 'text-white'
                : 'text-neutral-800 group-hover:text-neutral-900'
            }`}
          >
            {item.title}
          </Typography>
        </div>
        {/* Subtle arrow indicator */}
        <div
          className={`w-4 h-4 transition-all duration-300 ${
            hoverState === item.id
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
          }`}
        >
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    ));
  };

  const renderDesktopItems = (type: 'earn' | 'borrow') => {
    return ITEMS.filter(item => item.type === type).map(item => (
      <div
        key={item.id}
        className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${
          hoverState === item.id ? 'bg-black text-white' : ''
        }`}
        onMouseEnter={() => setHoverState(item.id)}
        onMouseLeave={() => setHoverState('none')}
      >
        {hoverState === item.id && (
          <div className="w-6 h-6 flex-shrink-0">
            <Image
              src="/images/landing/infratructure/lookup-icon.svg"
              alt="Lookup"
              width={24}
              height={24}
            />
          </div>
        )}
        <div>
          <Typography
            as="h4"
            className={`font-semibold ${hoverState === item.id ? 'text-white' : 'text-neutral-800'}`}
          >
            {item.title}
          </Typography>
        </div>
      </div>
    ));
  };

  return (
    <section className="w-full min-h-screen my-[15vh] sm:my-0">
      <div className="relative min-h-screen px-4 sm:px-6 md:px-20 py-12 sm:py-16 md:py-28 flex flex-col items-center">
        <div className="absolute h-full w-full inset-0 z-0">
          <video
            src="/images/landing/infratructure/bg.webm"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          />
        </div>

        <div className="relative z-10 w-full">
          <Typography
            as="h2"
            className="text-5xl sm:text-5xl md:text-[64px] font-normal leading-tight sm:leading-[69px] text-center relative max-w-full px-4 sm:px-0"
          >
            Open infrastructure
            <br />
            for onchain loans
          </Typography>

          {/* Features Section */}
          {/* <div className="absolute top-[-180px] left-[-140px] bg-white/60 shadow-md p-6 rounded-xl w-[260px] z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#D86479] rounded-full" />
                  <div>
                    <Typography className="text-black">Deposit</Typography>
                    <Typography className="text-[#8AB7F6] text-xs">@ssssssssss</Typography>
                  </div>
                </div>
                <EllipsisIcon className="w-6 h-6" />
              </div>
              <Typography className="text-black mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua...
              </Typography>
            </div>

            <div className="absolute bottom-[-160px] right-[-180px] bg-white/60 shadow-md p-6 rounded-xl w-[220px] z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#D86479] rounded-full" />
                  <div>
                    <Typography className="text-black">Deposit</Typography>
                    <Typography className="text-[#8AB7F6] text-xs">@ssssssssss</Typography>
                  </div>
                </div>
                <EllipsisIcon className="w-6 h-6" />
              </div>
              <Typography className="text-black mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua...
              </Typography>
            </div> */}

          {/* Mobile Layout */}
          <div className="flex flex-col gap-4 relative md:hidden py-8">
            {/* Enhanced Background Effects */}

            {/* Enhanced Tab Navigation */}
            <div className="flex justify-center z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-2 border border-white/20 shadow-2xl">
                <div className="flex relative">
                  <div
                    className={`absolute top-0 bottom-0 bg-black rounded-2xl transition-all duration-500 ease-out shadow-lg ${
                      activeTab === 'earn'
                        ? 'left-1 w-[calc(50%-4px)]'
                        : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
                    }`}
                  />
                  <button
                    onClick={() => setActiveTab('earn')}
                    className={`relative px-8 py-4 rounded-2xl transition-all duration-300 font-semibold text-base z-10 cursor-pointer ${
                      activeTab === 'earn' ? 'text-white' : 'text-embossed hover:text-embossed/90'
                    }`}
                  >
                    Earn
                  </button>
                  <button
                    onClick={() => setActiveTab('borrow')}
                    className={`relative px-8 py-4 rounded-2xl transition-all duration-300 font-semibold text-base z-10 cursor-pointer ${
                      activeTab === 'borrow' ? 'text-white' : 'text-embossed hover:text-embossed/90'
                    }`}
                  >
                    Borrow
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Content Section */}
            <div className="z-10">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-2xl relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5CB4EA] to-[#4975C0] opacity-80" />

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Typography as="h3" className="text-2xl font-bold text-black mb-2">
                        {activeTab === 'earn' ? 'Earn' : 'Borrow'}
                      </Typography>
                      <Typography className="text-neutral-600 text-base leading-relaxed">
                        {activeTab === 'earn'
                          ? 'Generate yield on your crypto assets'
                          : 'Access liquidity without selling your assets'}
                      </Typography>
                    </div>
                    <Link
                      href="/dashboard"
                      className="bg-gradient-to-r from-[#1E1E1E] to-[#2a2a2a] px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Typography className="text-white font-semibold text-base">
                        {activeTab === 'earn' ? 'Earn' : 'Borrow'}
                      </Typography>
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">{renderItems(activeTab)}</div>
              </div>
            </div>

            {/* Enhanced Image Section */}
            <div className="z-10">
              <div className="bg-gradient-to-br from-[#5CB4EA] via-[#4A8BC8] to-[#4975C0] rounded-3xl p-6 h-[280px] w-full max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-1000" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-500" />
                </div>

                <div className="relative w-full h-full">
                  <Image
                    src={getImagePath(
                      hoverState !== 'none'
                        ? hoverState
                        : activeTab === 'earn'
                          ? 'simple'
                          : 'low-cost'
                    )}
                    alt="Feature illustration"
                    fill
                    className="object-contain transition-all duration-500 ease-out drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-8 sm:mt-12 md:mt-16 max-w-4xl mx-auto shadow-[0px_0px_44.5px_0px_rgba(31,109,233,0.18)] backdrop-blur-[3px] bg-[radial-gradient(86.19%_68.08%_at_29.32%_106.38%,rgba(216,230,255,0.49)_0%,rgba(255,255,255,0.49)_100%)] w-full pl-4 sm:pl-6 md:pl-[23px] rounded-2xl sm:rounded-3xl border-2 border-solid border-white">
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-12 gap-8 relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[200px] w-[60vw] h-[200px] rounded-full bg-[#8ab7f669]/40 z-0 blur-[100px]" />

              {/* Left Column */}
              <div className="md:col-span-5 flex flex-col justify-center py-6 z-10">
                {/* Earn Card */}
                <div
                  className={`p-6 rounded-xl mt-6 transition-all duration-300 cursor-pointer ${
                    cardHover === 'earn' ? 'shadow-2xl bg-white/80' : ''
                  }`}
                  onMouseEnter={() => {
                    setCardHover('earn');
                    setHoverState('simple');
                  }}
                  onMouseLeave={() => {
                    setCardHover(null);
                    setHoverState('none');
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Typography as="h3" className="text-xl font-semibold text-black">
                        Earn
                      </Typography>
                      <Typography className="text-neutral-800">
                        Generate yield on your crypto assets
                      </Typography>
                    </div>
                    <Link href="/dashboard" className="bg-[#1E1E1E] px-4 py-2 rounded-full">
                      <Typography className="text-white font-semibold">Earn</Typography>
                    </Link>
                  </div>
                  <div className="mt-6 space-y-6">{renderDesktopItems('earn')}</div>
                </div>

                {/* Borrow Card */}
                <div
                  className={`mt-6 p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                    cardHover === 'borrow' ? 'shadow-2xl bg-white/80' : ''
                  }`}
                  onMouseEnter={() => {
                    setCardHover('borrow');
                    setHoverState('low-cost');
                  }}
                  onMouseLeave={() => {
                    setCardHover(null);
                    setHoverState('none');
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Typography as="h3" className="text-xl font-semibold text-black">
                        Borrow
                      </Typography>
                      <Typography className="text-neutral-800">
                        Access liquidity without selling your assets
                      </Typography>
                    </div>
                    <Link href="/dashboard" className="bg-[#1E1E1E] px-4 py-2 rounded-full">
                      <Typography className="text-white font-semibold">Borrow</Typography>
                    </Link>
                  </div>
                  <div className="mt-6 space-y-6">{renderDesktopItems('borrow')}</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="md:col-span-7 z-10">
                <div className="bg-gradient-to-b from-[#5CB4EA] to-[#4975C0] rounded-3xl p-8 h-full w-[500px] mx-auto">
                  <div className="relative w-full h-full">
                    <Image
                      src={getImagePath(hoverState)}
                      alt="Feature illustration"
                      fill
                      className="object-contain transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
