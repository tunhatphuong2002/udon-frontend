import React from 'react';
import Player from 'lottie-react';
import walletAnim from '@public/anim/wallet.json';
import notfoundAnim from '@public/anim/notfound.json';
import successAnim from '@public/anim/success.json';
import failAnim from '@public/anim/fail.json';
/**
 * Popup variants
 */
export type PopupVariant = 'wallet' | 'notfound' | 'success' | 'fail';

/**
 * Props for Popup component
 */
export interface PopupProps {
  variant: PopupVariant;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const animationMap: Record<PopupVariant, unknown> = {
  wallet: walletAnim,
  notfound: notfoundAnim,
  success: successAnim,
  fail: failAnim,
};

/**
 * Popup component with Lottie animation and customizable content.
 */
export const Popup: React.FC<PopupProps> = ({
  variant,
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#232323] rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center border border-neutral-800 relative">
        <h2 className="text-white text-xl font-semibold mb-4 text-center">{title}</h2>
        <div className="w-32 h-32 flex items-center justify-center mb-6">
          <Player
            autoplay
            loop={variant === 'wallet' || variant === 'notfound'}
            animationData={animationMap[variant]}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <p className="text-gray-400 text-center mb-8 text-base">{description}</p>
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-black font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-60"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
