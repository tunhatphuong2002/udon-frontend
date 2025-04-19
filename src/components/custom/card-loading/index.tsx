import React from 'react';

import { LoaderCubes } from '@/components/chromia-ui-kit/icons';
import { Card, CardTitle } from '@/components/common/card';

export const CardLoading = () => (
  <Card className="min-w-52 p-6 text-center">
    <LoaderCubes className="mx-auto mb-6" />
    <CardTitle>Loading...</CardTitle>
  </Card>
);
