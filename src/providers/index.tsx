'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider } from 'wagmi';
import { FtProvider } from './ft.provider';
import { wagmiConfig } from '@/configs/wagmi';
import ClientStyles from './styles.provider';
import NiceModal from '@ebay/nice-modal-react';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';

const queryClient = new QueryClient();

const defaultTheme = {
  // Font & Typography
  '--ck-font-family': 'Roboto',
  '--ck-font-weight': '400',

  // Border & Radius
  '--ck-border-radius': '20px',
  '--ck-qr-border-radius': '16px',
  '--ck-connectbutton-border-radius': '16px',
  '--ck-primary-button-border-radius': '16px',
  '--ck-secondary-button-border-radius': '16px',
  '--ck-tertiary-button-border-radius': '16px',
  '--ck-recent-badge-border-radius': '32px',

  // Overlay
  '--ck-overlay-background': '#3f393908',
  '--ck-overlay-backdrop-filter': 'blur(20px)',

  // Modal & UI
  '--ck-modal-heading-font-weight': '500',
  '--ck-modal-box-shadow': '0px 2px 4px 0px #00000005',
  '--ck-focus-color': '#1A88F8',

  // Colors
  '--ck-body-color': '#373737',
  '--ck-body-color-muted': '#999999',
  '--ck-body-color-muted-hover': '#111111',
  '--ck-body-background': '#ffffff',
  '--ck-body-background-transparent': 'rgba(255,255,255,0)',
  '--ck-body-background-secondary': '#f6f7f9',
  '--ck-body-background-secondary-hover-background': '#e0e4eb',
  '--ck-body-background-secondary-hover-outline': '#4282FF',
  '--ck-body-background-tertiary': '#F3F4F7',
  '--ck-body-action-color': '#999999',
  '--ck-body-divider': '#f7f6f8',
  '--ck-body-color-danger': '#FF4E4E',
  '--ck-body-color-valid': '#32D74B',
  '--ck-siwe-border': '#F0F0F0',

  // Disclaimer
  '--ck-body-disclaimer-background': '#f6f7f9',
  '--ck-body-disclaimer-color': '#AAAAAB',
  '--ck-body-disclaimer-link-color': '#838485',
  '--ck-body-disclaimer-link-hover-color': '#000000',

  // Tooltip
  '--ck-tooltip-background': '#ffffff',
  '--ck-tooltip-background-secondary': '#ffffff',
  '--ck-tooltip-color': '#999999',
  '--ck-tooltip-shadow': '0px 2px 10px 0 #00000014',

  // Dropdown
  '--ck-dropdown-button-color': '#999999',
  '--ck-dropdown-button-box-shadow': '0 0 0 1px rgba(0,0,0,0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)',
  '--ck-dropdown-button-background': '#fff',
  '--ck-dropdown-button-hover-color': '#8B8B8B',
  '--ck-dropdown-button-hover-background': '#F5F7F9',

  // QR Code
  '--ck-qr-dot-color': '#000000',
  '--ck-qr-background': '#ffffff',
  '--ck-qr-border-color': '#f7f6f8',

  // Misc
  '--ck-spinner-color': '#1A88F8',
  '--ck-copytoclipboard-stroke': '#CCCCCC',
  '--ck-recent-badge-color': '#777',
  '--ck-recent-badge-background': '#F6F7F9',

  // Connect Button
  '--ck-connectbutton-font-size': '15px',
  '--ck-connectbutton-color': '#373737',
  '--ck-connectbutton-background': '#F6F7F9',
  '--ck-connectbutton-background-secondary': '#FFFFFF',
  '--ck-connectbutton-box-shadow': '0 0 0 0 #ffffff',
  '--ck-connectbutton-hover-color': '#373737',
  '--ck-connectbutton-hover-background': '#F0F2F5',
  '--ck-connectbutton-hover-box-shadow': '0 0 0 0 #ffffff',
  '--ck-connectbutton-active-color': '#373737',
  '--ck-connectbutton-active-background': '#EAECF1',
  '--ck-connectbutton-active-box-shadow': '0 0 0 0 #ffffff',
  '--ck-connectbutton-balance-color': '#373737',
  '--ck-connectbutton-balance-background': '#fff',
  '--ck-connectbutton-balance-box-shadow': 'inset 0 0 0 1px #F6F7F9',
  '--ck-connectbutton-balance-hover-background': '#F6F7F9',
  '--ck-connectbutton-balance-hover-box-shadow': 'inset 0 0 0 1px #F0F2F5',
  '--ck-connectbutton-balance-active-background': '#F0F2F5',
  '--ck-connectbutton-balance-active-box-shadow': 'inset 0 0 0 1px #EAECF1',

  // Primary Button
  '--ck-primary-button-font-weight': '600',
  '--ck-primary-button-color': '#373737',
  '--ck-primary-button-background': '#F6F7F9',
  '--ck-primary-button-box-shadow': '0 0 0 0 #ffffff',
  '--ck-primary-button-hover-color': '#373737',
  '--ck-primary-button-hover-background': '#F0F2F5',
  '--ck-primary-button-hover-box-shadow': '0 0 0 0 #ffffff',
  '--ck-primary-button-active-color': '#373737',
  '--ck-primary-button-active-background': '#F0F2F5',
  '--ck-primary-button-active-box-shadow': '0 0 0 0 #ffffff',

  // Secondary Button
  '--ck-secondary-button-font-weight': '500',
  '--ck-secondary-button-color': '#373737',
  '--ck-secondary-button-background': '#F6F7F9',
  '--ck-secondary-button-box-shadow': '0 0 0 0 #ffffff',
  '--ck-secondary-button-hover-color': '#373737',
  '--ck-secondary-button-hover-background': '#dfe4ec',
  '--ck-secondary-button-hover-box-shadow': '0 0 0 0 #ffffff',
  '--ck-secondary-button-active-color': '#373737',
  '--ck-secondary-button-active-background': '#dfe4ec',
  '--ck-secondary-button-active-box-shadow': '0 0 0 0 #ffffff',

  // Tertiary Button
  '--ck-tertiary-button-font-weight': '500',
  '--ck-tertiary-button-color': '#373737',
  '--ck-tertiary-button-background': '#F6F7F9',
  '--ck-tertiary-button-box-shadow': '0 0 0 0 #ffffff',
  '--ck-tertiary-button-hover-color': '#373737',
  '--ck-tertiary-button-hover-background': '#F6F7F9',
  '--ck-tertiary-button-hover-box-shadow': '0 0 0 0 #ffffff',
  '--ck-tertiary-button-active-color': '#373737',
  '--ck-tertiary-button-active-background': '#F6F7F9',
  '--ck-tertiary-button-active-box-shadow': '0 0 0 0 #ffffff',
};

// Dark version of the theme - adapting the light theme to dark mode
const darkCustomTheme = {
  ...defaultTheme, // Kế thừa tất cả thuộc tính từ defaultTheme
  // Colors - Dark theme
  '--ck-body-color': '#FFFFFF',
  '--ck-body-color-muted': '#AAAAAA',
  '--ck-body-color-muted-hover': '#FFFFFF',
  '--ck-body-background': '#2B2B2B',
  '--ck-body-background-transparent': 'rgba(0,0,0,0)',
  '--ck-body-background-secondary': '#333333',
  '--ck-body-background-secondary-hover-background': '#3F3F3F',
  '--ck-body-background-tertiary': '#222222',
  '--ck-body-action-color': '#CCCCCC',
  '--ck-body-divider': '#333333',
  '--ck-body-disclaimer-background': '#222222',
  '--ck-body-disclaimer-color': '#999999',
  '--ck-body-disclaimer-link-color': '#CCCCCC',
  '--ck-siwe-border': '#3F3F3F',

  // Overlay & Modal
  '--ck-overlay-background': 'rgba(0, 0, 0, 0.4)',
  '--ck-modal-box-shadow': '0px 2px 4px 0px rgba(0,0,0,0.1)',

  // Tooltip
  '--ck-tooltip-background': '#2B2B2B',
  '--ck-tooltip-background-secondary': '#333333',
  '--ck-tooltip-color': '#CCCCCC',
  '--ck-tooltip-shadow': '0px 2px 10px 0 rgba(0,0,0,0.2)',

  // Dropdown
  '--ck-dropdown-button-color': '#CCCCCC',
  '--ck-dropdown-button-background': '#333333',
  '--ck-dropdown-button-hover-background': '#3F3F3F',

  // QR Code
  '--ck-qr-background': '#FFFFFF',
  '--ck-qr-dot-color': '#000000',
  '--ck-qr-border-color': '#333333',

  // Connect Button
  '--ck-connectbutton-color': '#FFFFFF',
  '--ck-connectbutton-background': '#333333',
  '--ck-connectbutton-hover-background': '#3F3F3F',
  '--ck-connectbutton-active-background': '#444444',
  '--ck-connectbutton-balance-color': '#FFFFFF',
  '--ck-connectbutton-balance-background': '#333333',
  '--ck-connectbutton-balance-box-shadow': 'inset 0 0 0 1px #444444',

  // Primary, Secondary and Tertiary Button - adapted for dark mode
  '--ck-primary-button-color': '#FFFFFF',
  '--ck-primary-button-background': '#333333',
  '--ck-primary-button-hover-background': '#3F3F3F',
  '--ck-primary-button-active-background': '#444444',

  '--ck-secondary-button-color': '#FFFFFF',
  '--ck-secondary-button-background': '#333333',
  '--ck-secondary-button-hover-background': '#3F3F3F',

  '--ck-tertiary-button-color': '#FFFFFF',
  '--ck-tertiary-button-background': '#333333',
  '--ck-tertiary-button-hover-background': '#3F3F3F',

  // Badge
  '--ck-recent-badge-color': '#CCCCCC',
  '--ck-recent-badge-background': '#333333',
};

// Custom theme provider that adapts to the current theme
function CustomConnectKitProvider({ children }: PropsWithChildren) {
  const { theme } = useTheme();

  // Choose theme based on current app theme
  const customTheme = theme !== 'dark' ? darkCustomTheme : defaultTheme;

  // Always render ConnectKitProvider, even when not mounted
  // This ensures the context is always available for child components
  return <ConnectKitProvider customTheme={customTheme}>{children}</ConnectKitProvider>;
}

// Wrapper to ensure safe hydration
function SafeHydration({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : <div style={{ visibility: 'hidden' }}>{children}</div>;
}

export function Providers(props: PropsWithChildren) {
  return (
    <ThemeProvider>
      <ClientStyles>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <CustomConnectKitProvider>
              <SafeHydration>
                <FtProvider>
                  <NiceModal.Provider>{props.children}</NiceModal.Provider>
                </FtProvider>
                <div className="bg-[#12121255]"></div>
              </SafeHydration>
            </CustomConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ClientStyles>
    </ThemeProvider>
  );
}
