import { ChevronRight } from 'lucide-react';
import React from 'react';
import { StatCard } from './stat-card';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import Image from 'next/image';
export default function Hero() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image */}
      <div className="absolute w-full max-w-[300px] md:max-w-[800px] aspect-square right-[0px] -top-5 opacity-30 md:opacity-100">
        <Image
          // src="/images/landing/hero/cube-rotate.gif"
          src="https://s3-alpha-sig.figma.com/img/d1dd/89f1/40b19c1259800133d18b0f0a6983894d?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=OWd-jHMBRf1LQobP0mic3S0xqpc3A3oIXsmqZPwufh6fUaklaX44GyFLMjh3MoC4QW2sEDaZ2Idcz4vh8mp4PE7UbZ4vnAazLffpFwIoox2z9EH2sDYyoibZQNnBKCt~lsk062fiyTo6wHs2SkokfiUqkCVfgXBQlTplAS3wYeqmmw9eh4ozzHYxyfZ5-iD-8NBreqnaUwAIJOl0LFRuh3ywyEGkUd3obzbuJhfOcnNeh1xOT1k8L~VBLhBZmmpLxtIsxNplg9bjEURKECvnsRppWlSCVXtDzGIUi7LP1TBf2GgIZ~N9GYzEAU1vD4wwexe02yIKKLrmRmR46eiT-Q__"
          alt="Hero background"
          fill
          className="object-contain"
        />
      </div>

      <div className="container mx-auto h-full flex flex-col justify-center pt-[20vh]">
        {/* Main Content Section */}
        <div className="relative flex flex-col justify-center">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left Column - Content */}
            <div className="col-span-1 md:col-span-3 space-y-6 px-4 md:px-0">
              <div className="space-y-2">
                <Typography
                  as="h1"
                  weight="semibold"
                  className="text-5xl md:text-15xl leading-tight text-center md:text-left"
                >
                  Unlocking Liquidity
                </Typography>
                <Typography className="text-3xl md:text-10xl max-w-2xl text-center md:text-left">
                  Money Markets and Leverage on Chromia
                </Typography>
                <Typography
                  weight="medium"
                  className="text-lg md:text-2xl pt-2 text-center md:text-left"
                >
                  Morpho is the most secure, efficient, and flexible lending platform.
                </Typography>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center gap-3 pb-8 md:pb-16">
                {/* Earn Button */}
                <Button className="w-full md:w-auto">
                  <Typography size="base" weight="normal">
                    Earn
                  </Typography>
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Borrow Button */}
                <Button className="w-full md:w-auto">
                  <Typography size="base" weight="normal">
                    Borrow
                  </Typography>
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Leveraged Yield Button */}
                <Button className="w-full md:w-auto">
                  <Typography size="base" weight="normal">
                    Leveraged Yield
                  </Typography>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Column */}
            <div className="hidden md:block md:col-span-2" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-9 px-4 md:px-0">
            <StatCard value="4,232,090,563" label="Total Deposits" />
            <StatCard value="4,232,090,563" label="Total Borrows" />
          </div>
        </div>
      </div>
    </div>
  );
}
