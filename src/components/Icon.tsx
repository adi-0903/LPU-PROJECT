import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export type IconName =
  | 'home'
  | 'check-square'
  | 'help-circle'
  | 'message-circle'
  | 'user'
  | 'arrow-left'
  | 'arrow-right'
  | 'search'
  | 'eye'
  | 'eye-off'
  | 'lock'
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'clock'
  | 'calendar'
  | 'check'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'sparkles'
  | 'alert-circle'
  | 'bell'
  | 'bell-ring'
  | 'log-out'
  | 'rotate-ccw'
  | 'compass'
  | 'landmark'
  | 'book-open'
  | 'users'
  | 'activity'
  | 'credit-card'
  | 'coffee'
  | 'tv'
  | 'external-link'
  | 'send'
  | 'log-in'
  | 'check-circle'
  | 'x'
  | 'navigation'
  | 'repeat'
  | 'locate'
  | 'map'
  | 'play'
  | 'pause'
  | 'shield'
  | 'alert-triangle'
  | 'phone-call'
  | 'copy';

interface IconProps {
  name: IconName | string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = '#1E232A',
  style,
}) => {
  // SVG paths for pure vector icons that render identically everywhere without external web font loading issues
  const renderSvgContent = () => {
    switch (name) {
      case 'home':
        return (
          <>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M9 22V12h6v10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'check-square':
        return (
          <>
            <path d="M9 11l3 3L22 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'help-circle':
        return (
          <>
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="12" cy="17" r="1" fill={color} />
          </>
        );
      case 'message-circle':
        return (
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );
      case 'user':
        return (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'arrow-left':
        return (
          <>
            <path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'arrow-right':
        return (
          <>
            <path d="M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M12 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" fill="none" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'eye':
        return (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
          </>
        );
      case 'eye-off':
        return (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case 'lock':
        return (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'phone':
        return (
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth="2" fill="none" />
        );
      case 'map-pin':
        return (
          <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="2" fill="none" />
            <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" fill="none" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
            <polyline points="12 6 12 12 16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'calendar':
        return (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none" />
            <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'check':
        return (
          <polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );
      case 'check-circle':
        return (
          <>
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
            <path d="M8 12l2.5 2.5L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'chevron-right':
        return (
          <polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );
      case 'chevron-down':
        return (
          <polyline points="6 9 12 15 18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );
      case 'chevron-up':
        return (
          <polyline points="18 15 12 9 6 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );
      case 'sparkles':
        return (
          <>
            <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill={color} />
            <path d="M19 15l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill={color} />
          </>
        );
      case 'bell':
        return (
          <>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'bell-ring':
        return (
          <>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="18" cy="4" r="3" fill="#F57C00" />
          </>
        );
      case 'log-out':
        return (
          <>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'log-in':
        return (
          <>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <polyline points="10 17 15 12 10 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="15" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'rotate-ccw':
        return (
          <>
            <path d="M1 4v6h6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'send':
        return (
          <>
            <line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'x':
        return (
          <>
            <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case 'book-open':
        return (
          <>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" fill="none" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" fill="none" />
          </>
        );
      case 'users':
        return (
          <>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" />
            <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" fill="none" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" fill="none" />
          </>
        );
      case 'landmark':
        return (
          <>
            <line x1="3" y1="22" x2="21" y2="22" stroke={color} strokeWidth="2" />
            <line x1="6" y1="18" x2="6" y2="11" stroke={color} strokeWidth="2" />
            <line x1="10" y1="18" x2="10" y2="11" stroke={color} strokeWidth="2" />
            <line x1="14" y1="18" x2="14" y2="11" stroke={color} strokeWidth="2" />
            <line x1="18" y1="18" x2="18" y2="11" stroke={color} strokeWidth="2" />
            <polygon points="12 2 20 7 4 7" stroke={color} strokeWidth="2" fill="none" />
          </>
        );
      case 'activity':
        return (
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );
      case 'credit-card':
        return (
          <>
            <rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2" fill="none" />
            <line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="2" />
          </>
        );
      case 'coffee':
        return (
          <>
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke={color} strokeWidth="2" fill="none" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke={color} strokeWidth="2" fill="none" />
            <line x1="6" y1="1" x2="6" y2="4" stroke={color} strokeWidth="2" />
            <line x1="10" y1="1" x2="10" y2="4" stroke={color} strokeWidth="2" />
            <line x1="14" y1="1" x2="14" y2="4" stroke={color} strokeWidth="2" />
          </>
        );
      case 'navigation':
        return (
          <polygon points="3 11 22 2 13 21 11 13 3 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );
      case 'repeat':
        return (
          <>
            <polyline points="17 1 21 5 17 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <polyline points="7 23 3 19 7 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'locate':
        return (
          <>
            <circle cx="12" cy="12" r="7" stroke={color} strokeWidth="2" fill="none" />
            <line x1="12" y1="1" x2="12" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="19" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'map':
        return (
          <>
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="8" y1="2" x2="8" y2="18" stroke={color} strokeWidth="2" />
            <line x1="16" y1="6" x2="16" y2="22" stroke={color} strokeWidth="2" />
          </>
        );
      case 'play':
        return (
          <polygon points="5 3 19 12 5 21 5 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={color} />
        );
      case 'pause':
        return (
          <>
            <rect x="6" y="4" width="4" height="16" stroke={color} strokeWidth="2" fill={color} />
            <rect x="14" y="4" width="4" height="16" stroke={color} strokeWidth="2" fill={color} />
          </>
        );
      case 'shield':
        return (
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );
      case 'alert-triangle':
        return (
          <>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="17" r="1" fill={color} />
          </>
        );
      case 'phone-call':
        return (
          <>
            <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth="2" fill="none" />
          </>
        );
      case 'copy':
        return (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      default:
        // fallback circle
        return (
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
        );
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {renderSvgContent()}
      </svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
