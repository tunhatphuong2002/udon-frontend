import React from 'react';
import { Typography } from '@/components/common/typography';

export const InfrastructureSection: React.FC = () => {
  return (
    <section className="w-full">
      <div className="relative min-h-screen px-6 md:px-20 py-16 md:py-28 flex flex-col items-center">
        <img
          // src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/936263d2ac487036acaae554434f560eb895fb20?placeholderIfAbsent=true"
          src="https://s3-alpha-sig.figma.com/img/7ecd/c79d/bffe94c7cc279f6a4dcdbd08c7b26013?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=G-NBB~cjNojWDxRkHPV-7MlFVknaR966REhRn4mModvjZp79WE7mZA9BIgumWoxSjtDDWMchTiVjq4-Uswf8LTneaCIxIkcZpD15nqe5La9qtcGZxAs6iufdd7TPwqnBErjdE3jUOcj3RRUv4Lby80UrK-u3nfq4Wr2K41CX4-87hh~HJcYJ~4t7nmjYZIKV4w3BzU0DhWfFtgZR45sZKm8XDdRqIGnClyjQshSRWq6kBi8MFpNvu4lQf~5S18equLr7bH51Reb6UNjJDpNGgQ-1-HAsGGre-RNbEJ4ygju6dwSiIwS1xTzE9J2-YCd6Ora~rQUQVtk76s75jsOQLA__"
          className="absolute h-full w-full object-cover inset-0 z-0"
          alt="Background"
        />

        {/* Header Section */}
        {/* <div className="relative max-w-4xl mx-auto">
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <div className="bg-white/60 shadow-sm p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#D86479] rounded-full" />
                    <div>
                      <Typography className="text-black">Deposit</Typography>
                      <Typography className="text-[#8AB7F6] text-xs">@ssssssssss</Typography>
                    </div>
                  </div>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/e54c6fee9c9aba688296d7bd0ce08c42f1c67883?placeholderIfAbsent=true"
                    className="w-6 h-6"
                    alt=""
                  />
                </div>
                <Typography className="text-black mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua...
                </Typography>
              </div>
            </div>

            <div className="md:col-span-8">
              <Typography as="h2" className="text-4xl md:text-6xl text-center leading-tight">
                Open infrastructure
                <br />
                for onchain loans
              </Typography>
            </div>
          </div>
        </div> */}

        <div className="relative z-10">
          <Typography
            as="h2"
            className="text-[64px] font-normal leading-[69px] text-center relative max-md:max-w-full max-md:text-[40px] max-md:leading-[48px] max-md:mt-10"
          >
            Open infrastructure
            <br />
            for onchain loans
          </Typography>

          {/* Features Section */}
          <div className="relative mt-16 max-w-5xl mx-auto justify-end shadow-[0px_0px_44.5px_0px_rgba(31,109,233,0.18)] backdrop-blur-[3px] bg-[radial-gradient(86.19%_68.08%_at_29.32%_106.38%,rgba(216,230,255,0.49)_0%,rgba(255,255,255,0.49)_100%)] w-full pl-[23px] rounded-3xl border-2 border-solid border-white max-md:max-w-full">
            <div className="absolute top-[-180px] left-[-140px] bg-white/60 shadow-md p-6 rounded-xl w-[260px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#D86479] rounded-full" />
                  <div>
                    <Typography className="text-black">Deposit</Typography>
                    <Typography className="text-[#8AB7F6] text-xs">@ssssssssss</Typography>
                  </div>
                </div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/e54c6fee9c9aba688296d7bd0ce08c42f1c67883?placeholderIfAbsent=true"
                  className="w-6 h-6"
                  alt=""
                />
              </div>
              <Typography className="text-black mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua...
              </Typography>
            </div>

            <div className="absolute bottom-[-160px] right-[-180px] bg-white/60 shadow-md p-6 rounded-xl w-[220px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#D86479] rounded-full" />
                  <div>
                    <Typography className="text-black">Deposit</Typography>
                    <Typography className="text-[#8AB7F6] text-xs">@ssssssssss</Typography>
                  </div>
                </div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/e54c6fee9c9aba688296d7bd0ce08c42f1c67883?placeholderIfAbsent=true"
                  className="w-6 h-6"
                  alt=""
                />
              </div>
              <Typography className="text-black mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua...
              </Typography>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="md:col-span-5">
                {/* Earn Card */}
                <div className="shadow-lg p-6 rounded-xl bg-white/80">
                  <div className="flex justify-between items-center">
                    <div>
                      <Typography as="h3" className="text-xl font-semibold text-black">
                        Earn
                      </Typography>
                      <Typography className="text-neutral-800">Put your crypto to work</Typography>
                    </div>
                    <div className="bg-[#1E1E1E] px-4 py-2 rounded-full">
                      <Typography className="text-white font-semibold">Earn</Typography>
                    </div>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="p-4 rounded-xl">
                      <Typography as="h4" className="font-semibold text-neutral-800">
                        Simple
                      </Typography>
                      <Typography className="text-neutral-800">
                        Deposit and start earning
                      </Typography>
                    </div>
                    <div className="p-4 rounded-xl">
                      <Typography as="h4" className="font-semibold text-neutral-800">
                        Optimized
                      </Typography>
                      <Typography className="text-neutral-800">
                        Deposit and start earning
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Borrow Card */}
                <div className="mt-6 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Typography as="h3" className="text-xl font-semibold text-black">
                        Borrow
                      </Typography>
                      <Typography className="text-neutral-800">Put your crypto to work</Typography>
                    </div>
                    <div className="bg-[#1E1E1E] px-4 py-2 rounded-full">
                      <Typography className="text-white font-semibold">Borrow</Typography>
                    </div>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="p-4 rounded-xl">
                      <Typography as="h4" className="font-semibold text-neutral-800">
                        Low costs
                      </Typography>
                      <Typography className="text-neutral-800">
                        Deposit and start earning
                      </Typography>
                    </div>
                    <div className="p-4 rounded-xl">
                      <Typography as="h4" className="font-semibold text-neutral-800">
                        Per market rates
                      </Typography>
                      <Typography className="text-neutral-800">
                        Deposit and start earning
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="md:col-span-7">
                <div className="bg-gradient-to-b from-[#5CB4EA] to-[#4975C0] rounded-3xl p-8 h-full flex items-center justify-center shadow-lg">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/29cd8f63562e2ebaab3d30d950000aa2e7213024?placeholderIfAbsent=true"
                    className="w-full max-w-md"
                    alt="Feature illustration"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
