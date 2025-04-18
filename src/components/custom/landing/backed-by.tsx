import React from 'react';
import { Typography } from '@/components/common/typography';

export const BackedBySection: React.FC = () => {
  return (
    <section className="min-h-[60vh]">
      <div className="container mx-auto flex flex-col items-center py-32 md:py-40 px-6 md:px-20">
        <div className="max-w-xl w-full flex flex-col items-center">
          <Typography
            as="h2"
            className="text-4xl md:text-10xl text-center text-foreground font-normal"
          >
            Backed by
          </Typography>

          <div className="relative w-[384px] mt-8 md:mt-10">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/6cb5175bedcc46db6fe6fbe862f05735b6af59d3?placeholderIfAbsent=true"
              className="w-full h-auto object-contain rounded-lg shadow-[0px_0px_9px_rgba(255,255,255,0.92)]"
              alt="Partner logos"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
