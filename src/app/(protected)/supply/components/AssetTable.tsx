'use client';

import React from 'react';
import { AssetTableShadcn } from './AssetTableShadcn';

interface AssetTableProps {
  title: string;
  showCollateral?: boolean;
}

export const AssetTable: React.FC<AssetTableProps> = ({ title, showCollateral = false }) => {
  return <AssetTableShadcn title={title} showCollateral={showCollateral} />;
};
