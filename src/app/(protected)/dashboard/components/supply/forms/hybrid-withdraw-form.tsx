// 'use client';

// import React, { useState, useCallback } from 'react';
// import { CircleX, Clock, Zap, AlertTriangle, Info, ArrowRight } from 'lucide-react';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { debounce } from 'lodash';
// import { useAssetPrice } from '@/hooks/contracts/queries/use-asset-price';
// import { useHybridWithdraw } from '@/hooks/contracts/operations/use-lsd-hybrid-withdraw';
// import { useMaxAmount } from '@/hooks/contracts/queries/use-max-amount';
// import { useMaxStchrAmountWithChr } from '@/hooks/contracts/queries/use-max-unstaked-st-asset-amount';
// import { toast } from 'sonner';

// import { Button } from '@/components/common/button';
// import { Typography } from '@/components/common/typography';
// import { Input } from '@/components/common/input';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
// import { Skeleton } from '@/components/common/skeleton';
// import { Alert, AlertDescription, AlertTitle } from '@/components/common/alert';
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip';
// import { UserAccountData, UserReserveData } from '../../../types';
// import CountUp from '@/components/common/count-up';
// import { normalize, normalizeBN, valueToBigNumber } from '@/utils/bignumber';
// import { calculateHFAfterWithdraw } from '@/utils/hf';
// import { cn } from '@/utils/tailwind';

// // Schema for hybrid option (both CHR and stCHR)
// const hybridWithdrawFormSchema = z
//   .object({
//     chrAmount: z.string().refine(
//       val => {
//         if (!val) return true; // Allow empty
//         const num = Number(val);
//         return !isNaN(num) && num >= 0;
//       },
//       {
//         message: 'Please enter a valid number',
//       }
//     ),
//     stchrAmount: z.string().refine(
//       val => {
//         if (!val) return true; // Allow empty
//         const num = Number(val);
//         return !isNaN(num) && num >= 0;
//       },
//       {
//         message: 'Please enter a valid number',
//       }
//     ),
//   })
//   .refine(
//     data => {
//       const chrAmount = Number(data.chrAmount) || 0;
//       const stchrAmount = Number(data.stchrAmount) || 0;
//       return chrAmount > 0 || stchrAmount > 0;
//     },
//     {
//       message: 'At least one amount must be greater than 0',
//       path: ['chrAmount'], // Show error on chrAmount field
//     }
//   );

// type HybridWithdrawFormValues = z.infer<typeof hybridWithdrawFormSchema>;

// export interface HybridWithdrawFormProps {
//   reserve: UserReserveData;
//   accountData: UserAccountData;
//   mutateAssets: () => void;
//   onSuccess: () => void;
// }

// // Create a debounced fetch function with lodash
// const debouncedFn = debounce((callback: () => void) => {
//   callback();
// }, 1000);

// export const HybridWithdrawForm: React.FC<HybridWithdrawFormProps> = ({
//   reserve,
//   accountData,
//   mutateAssets,
//   onSuccess,
// }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentPrice, setCurrentPrice] = useState<number | undefined>(reserve.price);
//   const [isRefetchEnabled, setIsRefetchEnabled] = useState(false);
//   const [calculatedHealthFactor, setCalculatedHealthFactor] = useState<number>(-1);

//   // State for hybrid flow
//   const [currentChrAmount, setCurrentChrAmount] = useState<number>(0);
//   const [isStchrInputEnabled, setIsStchrInputEnabled] = useState(false);

//   const form = useForm<HybridWithdrawFormValues>({
//     resolver: zodResolver(hybridWithdrawFormSchema),
//     defaultValues: {
//       chrAmount: '',
//       stchrAmount: '',
//     },
//   });

//   // Use the asset price hook with TanStack Query
//   const {
//     data: priceData,
//     isLoading: isPriceFetching,
//     refetch: fetchPrice,
//   } = useAssetPrice(reserve.assetId, isRefetchEnabled);

//   // Fetch max CHR amount
//   const { data: maxChrAmount } = useMaxAmount(
//     reserve.assetId,
//     reserve.decimals,
//     'get_max_chr_withdraw_amount_query'
//   );

//   // Fetch max stCHR amount based on CHR amount (for hybrid mode)
//   const { data: maxStchrAmountWithChr, isLoading: isMaxStchrLoading } = useMaxStchrAmountWithChr(
//     reserve.assetId,
//     reserve.decimals,
//     currentChrAmount,
//     currentChrAmount > 0 && isStchrInputEnabled
//   );

//   // Use the hybrid withdraw hook
//   const hybridWithdrawOp = useHybridWithdraw({
//     onSuccess: (result, params) => {
//       console.log('Hybrid withdraw success:', { result, params });
//       mutateAssets();
//     },
//     onError: (error, params) => {
//       console.error('Hybrid withdraw error:', { error, params });
//     },
//   });

//   // Calculate health factor based on current input
//   const calculateHealthFactor = useCallback(() => {
//     if (accountData.healthFactor === -1) {
//       setCalculatedHealthFactor(-1);
//       return;
//     }

//     const chrAmount = Number(form.watch('chrAmount')) || 0;
//     const stchrAmount = Number(form.watch('stchrAmount')) || 0;
//     const withdrawAmount = chrAmount + stchrAmount;

//     if (withdrawAmount <= 0) {
//       setCalculatedHealthFactor(
//         Number(normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18))
//       );
//       return;
//     }

//     const hf = calculateHFAfterWithdraw(
//       valueToBigNumber(accountData.totalCollateralBase.toString()),
//       valueToBigNumber(normalize(reserve.price.toString(), 18)).multipliedBy(
//         valueToBigNumber(withdrawAmount.toString())
//       ),
//       (Number(accountData.currentLiquidationThreshold) / 100).toString(),
//       reserve.liquidationThreshold.toString(),
//       valueToBigNumber(accountData.totalDebtBase.toString()),
//       valueToBigNumber(accountData.healthFactor.toString()),
//       reserve.usageAsCollateralEnabled
//     );

//     setCalculatedHealthFactor(Number(hf));
//   }, [
//     accountData,
//     form,
//     reserve.liquidationThreshold,
//     reserve.price,
//     reserve.usageAsCollateralEnabled,
//   ]);

//   // Handle price fetch with lodash debounce for hybrid forms
//   const handleFetchPrice = useCallback(() => {
//     debouncedFn(() => {
//       // Don't allow CHR amount > max CHR amount
//       const chrAmount = Number(form.watch('chrAmount')) || 0;
//       if (
//         chrAmount > 0 &&
//         maxChrAmount !== undefined &&
//         maxChrAmount !== null &&
//         chrAmount > maxChrAmount
//       ) {
//         form.setValue('chrAmount', maxChrAmount.toString());
//       }

//       // Don't allow stCHR amount > max stCHR amount (if enabled and available)
//       const stchrAmount = Number(form.watch('stchrAmount')) || 0;
//       if (
//         stchrAmount > 0 &&
//         isStchrInputEnabled &&
//         maxStchrAmountWithChr !== undefined &&
//         maxStchrAmountWithChr !== null &&
//         stchrAmount > maxStchrAmountWithChr
//       ) {
//         form.setValue('stchrAmount', maxStchrAmountWithChr.toString());
//       }

//       setIsRefetchEnabled(true);
//       fetchPrice();
//       calculateHealthFactor();
//     });
//   }, [
//     fetchPrice,
//     calculateHealthFactor,
//     form,
//     maxChrAmount,
//     maxStchrAmountWithChr,
//     isStchrInputEnabled,
//   ]);

//   // Update price when data is fetched
//   React.useEffect(() => {
//     if (priceData !== null && priceData !== undefined) {
//       setCurrentPrice(priceData);
//       setIsRefetchEnabled(false);
//     }
//   }, [priceData]);

//   // Initialize with asset price and calculate initial health factor
//   React.useEffect(() => {
//     setCurrentPrice(reserve.price);
//     calculateHealthFactor();
//   }, [reserve.price, calculateHealthFactor]);

//   // Reset hybrid flow state when component mounts
//   React.useEffect(() => {
//     setCurrentChrAmount(0);
//     setIsStchrInputEnabled(false);
//     form.setValue('chrAmount', '');
//     form.setValue('stchrAmount', '');
//   }, [form]);

//   // Handle amount change for hybrid forms
//   const handleAmountChange = (field: 'chrAmount' | 'stchrAmount', value: string) => {
//     const regex = /^$|^[0-9]+\.?[0-9]*$/;

//     if (!regex.test(value)) {
//       form.setValue(field, '0');
//       return;
//     }

//     // Handle CHR amount change
//     if (field === 'chrAmount') {
//       // Don't allow CHR amount > max CHR amount (similar to withdraw-dialog.tsx)
//       const chrAmountNum = parseFloat(value) || 0;
//       const finalChrValue =
//         chrAmountNum > 0 &&
//         maxChrAmount !== undefined &&
//         maxChrAmount !== null &&
//         chrAmountNum > maxChrAmount
//           ? maxChrAmount.toString()
//           : value;

//       form.setValue(field, finalChrValue);
//       const finalChrAmountNum = parseFloat(finalChrValue) || 0;

//       // Update CHR amount state
//       setCurrentChrAmount(finalChrAmountNum);

//       // Enable/disable stCHR input based on CHR amount
//       if (finalChrAmountNum > 0) {
//         setIsStchrInputEnabled(true);
//       } else {
//         setIsStchrInputEnabled(false);
//         // Reset stCHR amount when CHR is cleared
//         form.setValue('stchrAmount', '');
//       }

//       // If CHR amount changed and stCHR was previously entered, reset stCHR
//       if (finalChrAmountNum !== currentChrAmount && form.watch('stchrAmount')) {
//         form.setValue('stchrAmount', '');
//       }
//     }

//     // Handle stCHR amount change (only if enabled)
//     if (field === 'stchrAmount' && isStchrInputEnabled) {
//       // Don't allow stCHR amount > max stCHR amount (similar to withdraw-dialog.tsx)
//       const stchrAmountNum = parseFloat(value) || 0;
//       const finalStchrValue =
//         stchrAmountNum > 0 &&
//         maxStchrAmountWithChr !== undefined &&
//         maxStchrAmountWithChr !== null &&
//         stchrAmountNum > maxStchrAmountWithChr
//           ? maxStchrAmountWithChr.toString()
//           : value;

//       form.setValue(field, finalStchrValue);
//     }

//     const chrAmount = form.watch('chrAmount');
//     const stchrAmount = form.watch('stchrAmount');

//     if ((parseFloat(chrAmount) || 0) > 0 || (parseFloat(stchrAmount) || 0) > 0) {
//       handleFetchPrice();
//     } else {
//       setCalculatedHealthFactor(
//         accountData.healthFactor === -1
//           ? -1
//           : Number(normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18))
//       );
//     }
//   };

//   // Handle max amount for specific field in hybrid
//   const handleMaxAmount = (field: 'chrAmount' | 'stchrAmount') => {
//     let maxAmount = 0;
//     if (field === 'chrAmount') {
//       maxAmount = maxChrAmount || 0;
//     } else {
//       // Use the new max amount based on CHR input for stCHR
//       maxAmount = maxStchrAmountWithChr || 0;
//     }

//     form.setValue(field, maxAmount.toString());
//     handleFetchPrice();
//   };

//   // Submit handler
//   const onSubmit = async (data: HybridWithdrawFormValues) => {
//     try {
//       const chrAmount = Number(data.chrAmount) || 0;
//       const stchrAmount = Number(data.stchrAmount) || 0;

//       if (chrAmount <= 0 && stchrAmount <= 0) {
//         toast.error('At least one amount must be greater than 0');
//         return;
//       }

//       setIsSubmitting(true);

//       const withdrawResult = await hybridWithdrawOp({
//         assetId: reserve.assetId,
//         chrAmount: chrAmount.toString(),
//         stchrAmount: stchrAmount.toString(),
//         decimals: reserve.decimals,
//       });

//       if (withdrawResult.success) {
//         toast.success(
//           `Successfully initiated hybrid withdraw: ${chrAmount} CHR + ${stchrAmount} stCHR`
//         );
//         onSuccess();
//       } else {
//         toast.error(`Failed to withdraw: ${withdrawResult.error?.message || 'Unknown error'}`);
//       }
//     } catch (error) {
//       console.error('Error submitting hybrid withdraw:', error);
//       toast.error('Failed to submit hybrid withdraw transaction');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const currentHealthFactor =
//     accountData.healthFactor === -1
//       ? -1
//       : normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18);

//   // Get current withdraw amount for transaction overview
//   const getCurrentWithdrawAmount = () => {
//     const chrAmount = Number(form.watch('chrAmount')) || 0;
//     const stchrAmount = Number(form.watch('stchrAmount')) || 0;
//     return chrAmount + stchrAmount;
//   };

//   return (
//     <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
//       <div className="space-y-6 py-4">
//         {/* CHR Amount Input */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Typography className="flex items-center gap-1">
//               CHR Amount <Clock className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">(14 days)</span>
//             </Typography>
//           </div>

//           <div className="border px-3 py-2 rounded-lg">
//             <div className="relative">
//               <Input
//                 {...form.register('chrAmount')}
//                 autoComplete="off"
//                 placeholder="0.00"
//                 className="p-0 text-xl font-medium placeholder:text-submerged focus-visible:ring-tranparent focus-visible:outline-none focus-visible:ring-0 w-[60%]"
//                 inputMode="decimal"
//                 pattern="[0-9]*[.]?[0-9]*"
//                 min={0.0}
//                 max={maxChrAmount}
//                 step="any"
//                 onChange={e => handleAmountChange('chrAmount', e.target.value)}
//               />
//               <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
//                 {form.watch('chrAmount') && (
//                   <Button
//                     variant="none"
//                     size="icon"
//                     onClick={() => {
//                       form.setValue('chrAmount', '');
//                       handleFetchPrice();
//                     }}
//                     className="hover:opacity-70"
//                   >
//                     <CircleX className="h-6 w-6 text-embossed" />
//                   </Button>
//                 )}
//                 <Avatar className="h-7 w-7">
//                   <AvatarImage src={reserve.iconUrl} alt="CHR" />
//                   <AvatarFallback>CHR</AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-row items-center gap-1">
//                   <span className="font-medium text-lg">CHR</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between items-center text-base">
//               {isPriceFetching ? (
//                 <Skeleton className="h-5 w-20" />
//               ) : (
//                 <CountUp
//                   value={(currentPrice || 0) * Number(form.watch('chrAmount'))}
//                   prefix="$"
//                   className="text-base"
//                 />
//               )}
//               <div
//                 className="flex flex-row items-center gap-1 text-primary cursor-pointer"
//                 onClick={() => handleMaxAmount('chrAmount')}
//               >
//                 <div className="flex flex-row items-center gap-1 cursor-pointer">
//                   <Typography>Available: </Typography>
//                   <Typography className="font-bold">
//                     <CountUp value={maxChrAmount || 0} decimals={6} />
//                   </Typography>
//                   <Typography className="font-bold text-primary">MAX</Typography>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {form.formState.errors.chrAmount && (
//             <Typography className="text-destructive">
//               {form.formState.errors.chrAmount.message}
//             </Typography>
//           )}
//         </div>

//         {/* stCHR Amount Input */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Typography className="flex items-center gap-1">
//               stCHR Amount <Zap className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">(Immediate)</span>
//             </Typography>
//           </div>

//           <div className="border px-3 py-2 rounded-lg">
//             <div className="relative">
//               <Input
//                 {...form.register('stchrAmount')}
//                 autoComplete="off"
//                 placeholder={isStchrInputEnabled ? '0.00' : 'Enter CHR amount first'}
//                 className={cn(
//                   'p-0 text-xl font-medium placeholder:text-submerged focus-visible:ring-tranparent focus-visible:outline-none focus-visible:ring-0 w-[60%]',
//                   !isStchrInputEnabled && 'opacity-50 cursor-not-allowed'
//                 )}
//                 inputMode="decimal"
//                 pattern="[0-9]*[.]?[0-9]*"
//                 min={0.0}
//                 max={maxStchrAmountWithChr}
//                 step="any"
//                 disabled={!isStchrInputEnabled}
//                 onChange={e => handleAmountChange('stchrAmount', e.target.value)}
//               />
//               <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
//                 {form.watch('stchrAmount') && (
//                   <Button
//                     variant="none"
//                     size="icon"
//                     onClick={() => {
//                       form.setValue('stchrAmount', '');
//                       handleFetchPrice();
//                     }}
//                     className="hover:opacity-70"
//                   >
//                     <CircleX className="h-6 w-6 text-embossed" />
//                   </Button>
//                 )}
//                 <Avatar className="h-7 w-7">
//                   <AvatarImage src={reserve.iconUrl} alt="stCHR" />
//                   <AvatarFallback>stCHR</AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-row items-center gap-1">
//                   <span className="font-medium text-lg">stCHR</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between items-center text-base">
//               {isPriceFetching ? (
//                 <Skeleton className="h-5 w-20" />
//               ) : (
//                 <CountUp
//                   value={(currentPrice || 0) * Number(form.watch('stchrAmount'))}
//                   prefix="$"
//                   className="text-base"
//                 />
//               )}
//               <div
//                 className={cn(
//                   'flex flex-row items-center gap-1 text-primary',
//                   isStchrInputEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
//                 )}
//                 onClick={() => isStchrInputEnabled && handleMaxAmount('stchrAmount')}
//               >
//                 <div className="flex flex-row items-center gap-1">
//                   <Typography>Available: </Typography>
//                   {!isStchrInputEnabled ? (
//                     <Typography className="font-bold">_</Typography>
//                   ) : isMaxStchrLoading ? (
//                     <Skeleton className="h-5 w-20" />
//                   ) : (
//                     <Typography className="font-bold">
//                       <CountUp value={maxStchrAmountWithChr || 0} decimals={6} />
//                     </Typography>
//                   )}
//                   {isStchrInputEnabled && (
//                     <Typography className="font-bold text-primary">MAX</Typography>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {form.formState.errors.stchrAmount && (
//             <Typography className="text-destructive">
//               {form.formState.errors.stchrAmount.message}
//             </Typography>
//           )}
//         </div>

//         {/* Important Notice for Hybrid */}
//         <Alert variant="warning">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertTitle>Important Notice</AlertTitle>
//           <AlertDescription>
//             Hybrid withdraw combines both options: stCHR is immediate, CHR requires 14-day wait.
//             Cross-constraints apply between the two amounts.
//           </AlertDescription>
//         </Alert>

//         {/* Transaction Overview for Hybrid */}
//         <div className="space-y-4">
//           <Typography weight="semibold" className="text-lg">
//             Transaction overview
//           </Typography>

//           <div className="flex justify-between items-center">
//             <Typography className="flex items-center gap-1">CHR amount (14 days)</Typography>
//             <Typography weight="medium">
//               <CountUp value={Number(form.watch('chrAmount')) || 0} suffix=" CHR" decimals={6} />
//             </Typography>
//           </div>

//           <div className="flex justify-between items-center">
//             <Typography className="flex items-center gap-1">stCHR amount (immediate)</Typography>
//             <Typography weight="medium">
//               <CountUp
//                 value={Number(form.watch('stchrAmount')) || 0}
//                 suffix=" stCHR"
//                 decimals={6}
//               />
//             </Typography>
//           </div>

//           <div className="flex justify-between items-center">
//             <Typography className="flex items-center gap-1">
//               Health factor
//               <Tooltip delayDuration={100}>
//                 <TooltipTrigger type="button">
//                   <Info className="h-4 w-4" />
//                 </TooltipTrigger>
//                 <TooltipContent side="bottom">
//                   <p>Liquidation occurs when health factor is below 1.0</p>
//                 </TooltipContent>
//               </Tooltip>
//             </Typography>

//             <div className="flex flex-row items-center justify-center gap-1">
//               {Number(currentHealthFactor) === -1 ? (
//                 <Typography className="text-green-500 text-3xl text-bold">∞</Typography>
//               ) : (
//                 <CountUp
//                   value={Number(currentHealthFactor)}
//                   decimals={2}
//                   className={
//                     Number(currentHealthFactor) === -1
//                       ? 'text-green-500'
//                       : Number(currentHealthFactor) <= 1.25
//                         ? 'text-red-500'
//                         : Number(currentHealthFactor) <= 1.5
//                           ? 'text-amber-500'
//                           : 'text-green-500'
//                   }
//                 />
//               )}

//               <ArrowRight className="h-4 w-4 mb-1 text-muted-foreground" />

//               {getCurrentWithdrawAmount() === 0 ? (
//                 <Typography className="text-muted-foreground font-medium">_</Typography>
//               ) : calculatedHealthFactor === -1 ? (
//                 <Typography className="!text-green-500 text-3xl text-bold">∞</Typography>
//               ) : (
//                 <CountUp
//                   value={calculatedHealthFactor}
//                   decimals={2}
//                   className={
//                     calculatedHealthFactor === -1
//                       ? 'text-green-500'
//                       : calculatedHealthFactor <= 1.25
//                         ? 'text-red-500'
//                         : calculatedHealthFactor <= 1.5
//                           ? 'text-amber-500'
//                           : 'text-green-500'
//                   }
//                 />
//               )}
//             </div>
//           </div>

//           <div className="flex justify-between items-center">
//             <Typography className="flex items-center gap-1">Total withdraw value</Typography>
//             <div className="font-medium text-base flex flex-row items-center gap-1">
//               <CountUp value={getCurrentWithdrawAmount()} suffix=" tokens" decimals={6} />~{' '}
//               {isPriceFetching ? (
//                 <Skeleton className="inline-block h-5 w-20" />
//               ) : (
//                 <CountUp
//                   value={(currentPrice || 0) * getCurrentWithdrawAmount()}
//                   prefix="$"
//                   className="text-base"
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Submit button for hybrid */}
//       <div className="mt-4">
//         {isSubmitting ? (
//           <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
//             Processing...
//           </Button>
//         ) : !form.watch('chrAmount') && !form.watch('stchrAmount') ? (
//           <Button disabled className="w-full text-lg py-6">
//             Enter amounts
//           </Button>
//         ) : (
//           <Button variant="gradient" type="submit" className="w-full text-lg py-6">
//             Withdraw Both CHR + stCHR
//           </Button>
//         )}
//       </div>
//     </form>
//   );
// };
