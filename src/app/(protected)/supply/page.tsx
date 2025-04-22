// import Button from '@/components/chromia-ui-kit/button';

import { AssetTable } from './components/AssetTable';
import { StatCard } from './components/StatCard';

export default function SupplyPage() {
  return (
    // <div className="relative min-h-screen bg-[#181818] overflow-hidden">
    //   {/* Glowing effect at the top */}
    //   <div className="relative w-full h-[1480px] -mt-[135px]">
    //     <div className="absolute w-[1097px] h-[246px] top-0 left-1/2 -translate-x-1/2 bg-[#1fc3e8] rounded-[548.5px/123.1px] blur-[48.75px]">
    //       <div className="relative w-[1016px] h-52 left-[50px] bg-[#1f6ce8] rounded-[508.19px/103.8px]">
    //         <div className="relative w-[862px] h-[134px] top-6 left-[88px] bg-white rounded-[430.85px/67px]" />
    //       </div>
    //     </div>

    //     {/* Background frame image */}
    //     <div className="absolute w-full h-[1345px] top-[135px] left-0">
    //       {/* This would be the frame-250-1-1.svg */}
    //       <img
    //         className="w-full h-full object-cover"
    //         alt="Frame background"
    //         src="/images/supply/bg.gif"
    //       />
    //     </div>

    //     {/* Vector image overlay */}
    //     <div className="absolute w-[1119px] h-[1001px] top-[321px] left-1/2 -translate-x-1/2">
    //       {/* This would be the vector.svg */}
    //       <img className="w-full h-full" alt="Vector graphic" src="" />
    //     </div>

    //     {/* Navigation bar */}
    //     <header className="absolute w-full max-w-[1270px] h-[39px] top-[174px] left-1/2 -translate-x-1/2 flex justify-between items-center px-4">
    //       {/* Logo */}
    //       <div className="w-[206px] h-[30px]">
    //         <img className="w-full h-full object-cover" alt="udon finance" src="" />
    //       </div>

    //       {/* Navigation Menu */}
    //       {/* <NavigationMenu className="mx-auto">
    //         <NavigationMenuList className="flex items-center gap-[37px] px-[19px] py-2.5 bg-[#0f0f0f] rounded-[17px]">
    //           {navItems.map((item, index) => (
    //             <NavigationMenuItem key={index}>
    //               <NavigationMenuLink
    //                 className={`relative w-fit mt-[-1.00px] font-medium text-base text-center tracking-[0] leading-normal whitespace-nowrap ${
    //                   item.active ? 'text-white' : 'text-[#797979]'
    //                 }`}
    //               >
    //                 {item.label}
    //               </NavigationMenuLink>
    //             </NavigationMenuItem>
    //           ))}
    //         </NavigationMenuList>
    //       </NavigationMenu> */}

    //       {/* Launch App Button */}
    //       <Button className="flex items-center gap-3 pl-2.5 pr-[7px] py-2.5 bg-[#5bb2e9] rounded-3xl text-black hover:bg-[#5bb2e9]/90">
    //         Launch App
    //       </Button>
    //     </header>
    //   </div>
    // </div>
    // <div>Supply</div>
    <main className="container mx-auto px-4 sm:px-5 py-6 sm:py-10">
      <section className="flex flex-col items-center gap-2 sm:gap-2.5">
        <div
          dangerouslySetInnerHTML={{
            __html: `<svg id="384:1283" width="152" height="36" viewBox="0 0 152 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="title-icon w-32 h-8 sm:w-40 sm:h-10" style="max-width: 152px"> <circle cx="18" cy="18" r="17.5" stroke="white"></circle> <circle cx="47" cy="18" r="17.5" stroke="white"></circle> <circle cx="76" cy="18" r="17.5" stroke="white"></circle> <circle cx="105" cy="18" r="17.5" stroke="white"></circle> <circle cx="134" cy="18" r="17.5" stroke="white"></circle> </svg>`,
          }}
          className="mb-2"
        />
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-light text-center">
          Streamline your
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-[40px] font-light text-center">
          crypto investment on Chromia
        </h2>
      </section>

      <section className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-6 sm:mt-10">
        <StatCard
          value="$4,232,090,563"
          label="Your Deposit"
          iconUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/7b161393117b95ec6fb3542bf7f3a4d5441c8c9a?placeholderIfAbsent=true"
        />
        <StatCard
          value="$4,232,090,563"
          label="Your Borrows"
          iconUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/861e5ca763d355980e10b46091b095176e94bd44?placeholderIfAbsent=true"
        />
      </section>

      <section className="flex flex-col lg:flex-row gap-4 sm:gap-5 mt-6 sm:mt-10">
        <AssetTable title="Assets to supply" showCollateral={true} />
        <AssetTable title="Assets to borrow" />
      </section>
    </main>
  );
}
