import {type ThemeConfig } from 'antd';

const customTheme: ThemeConfig = {
  token: {
    // === Primary Colors ===
    colorPrimary: '#1677ff',      // Main brand color
    colorSuccess: '#52c41a',      // Success color
    colorWarning: '#faad14',      // Warning color
    colorError: '#f5222d',        // Error color
    colorInfo: '#1677ff',         // Info color
    
    // === Layout Colors ===
    colorBgBase: '#ffffff',       // Base background
    colorBgContainer: '#ffffff',  // Container background
    colorBgElevated: '#ffffff',   // Elevated background (modal, dropdown)
    colorBgLayout: '#f5f5f5',     // Layout background
    
    // === Text Colors ===
    colorText: '#000000d9',       // Primary text
    colorTextSecondary: '#00000073', // Secondary text
    colorTextTertiary: '#00000040',  // Tertiary text
    colorTextQuaternary: '#00000026', // Quaternary text
    
    // === Border Colors ===
    colorBorder: '#d9d9d9',       // Default border
    colorBorderSecondary: '#f0f0f0', // Secondary border
    
    // === Typography ===
    fontSize: 14,                 // Base font size
    fontSizeHeading1: 38,         // H1 size
    fontSizeHeading2: 30,         // H2 size  
    fontSizeHeading3: 24,         // H3 size
    fontSizeHeading4: 20,         // H4 size
    fontSizeHeading5: 16,         // H5 size
    fontFamily: ' Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    
    // === Spacing & Sizing ===
    borderRadius: 6,              // Base border radius
    borderRadiusLG: 8,            // Large border radius
    borderRadiusSM: 4,            // Small border radius
    
    // === Component Specific ===
    controlHeight: 32,            // Default control height
    controlHeightLG: 40,          // Large control height
    controlHeightSM: 24,          // Small control height
    
    // === Shadows ===
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  },
  
  // === Component Level Customization ===
  components: {
    Menu: {
      itemSelectedBg: '#e6f4ff',     // Selected menu item background
      itemSelectedColor: '#1677ff',  // Selected menu item text color
      itemHoverBg: '#f5f5f5',        // Hover menu item background
      itemActiveBg: '#e6f4ff',       // Active menu item background
      groupTitleColor: '#00000073',   // Menu group title color
      iconSize: 16,                   // Menu icon size
    },
    
    Button: {
      borderRadius: 6,                // Button border radius
      controlHeight: 32,              // Button height
      fontSize: 14,                   // Button font size
    },
    
    Layout: {
      siderBg: '#ffffff',             // Sidebar background
      headerBg: '#ffffff',            // Header background
      bodyBg: '#f5f5f5',             // Body background
      footerBg: '#ffffff',            // Footer background
    },
    
    Table: {
      headerBg: '#fafafa',            // Table header background
      rowHoverBg: '#f5f5f5',         // Table row hover background
    },
    
    Card: {
      actionsBg: '#fafafa',           // Card actions background
      headerBg: '#ffffff',            // Card header background
    },
  },
};

export default customTheme;