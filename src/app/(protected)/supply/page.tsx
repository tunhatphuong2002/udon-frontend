import { AssetTable } from './components/asset-table';
import { StatCard } from './components/stat-card';
import { Typography } from '@/components/common/typography';

export default function SupplyPage() {
  return (
    <main className="container mx-auto px-4 sm:px-5 py-[180px]">
      <section className="flex flex-col items-center gap-2 sm:gap-2.5">
        <div
          dangerouslySetInnerHTML={{
            __html: `<svg id="384:1283" width="152" height="36" viewBox="0 0 152 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="title-icon w-32 h-8 sm:w-40 sm:h-10" style="max-width: 152px"> <circle cx="18" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="47" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="76" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="105" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="134" cy="18" r="17.5" stroke="currentColor"></circle> </svg>`,
          }}
          className="mb-2 text-foreground"
        />
        <Typography
          variant="h2"
          weight="normal"
          align="center"
          className="text-2xl sm:text-3xl md:text-[40px] font-light"
        >
          Streamline your
        </Typography>
        <Typography
          variant="h2"
          weight="normal"
          align="center"
          className="text-2xl sm:text-3xl md:text-[40px] font-light"
        >
          crypto investment on Chromia
        </Typography>
      </section>

      <section className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-6 sm:mt-10">
        <StatCard
          value="$4,232,090,563"
          label="Your Deposit"
          iconUrl="/images/supply/coin-stack.gif"
        />
        <StatCard
          value="$4,232,090,563"
          label="Your Borrows"
          iconUrl="/images/supply/saving-piggy.gif"
        />
      </section>

      <section className="flex flex-col lg:flex-row gap-4 sm:gap-5 mt-6 sm:mt-10 p-4 border border-solid rounded-3xl border-border">
        <AssetTable title="Assets to supply" showCollateral={true} />
        <AssetTable title="Assets to borrow" />
      </section>
    </main>
  );
}
