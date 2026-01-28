# Umami Analytics Integration - Summary

## Changes Made

### 1. Created Umami Tracking Utility
**File:** `src/utils/umami.js`

This utility module provides standardized Umami tracking functions:
- `trackProductView()` - Tracks when a product modal is opened
- `trackProductLinkClick()` - Tracks product link clicks (conversions)
- `trackSocialLinkClick()` - Tracks social media link clicks
- `trackContactLinkClick()` - Tracks contact link clicks
- `trackDiscountCodeCopy()` - Tracks discount code copies

### 2. Updated Modal Component
**File:** `src/components/Modal.jsx`

**Product View Tracking:**
- Added product view event when modal opens
- Captures: product name, category, and brand

**Product Link Click Tracking (Conversions):**
- Updated Shopee, TikTok, Lazada, and Other link clicks
- Now sends to both GTM and Umami
- Captures: product name, category, platform, brand, and URL

**Discount Code Copy Tracking:**
- Added tracking when users copy discount codes
- Captures: discount code and product name

### 3. Updated Header Component
**File:** `src/components/Header.jsx`

**Social Media Link Tracking:**
- Added tracking for all social media links (Twitter, Instagram, etc.)
- Captures: platform name and URL

**Contact Link Tracking:**
- Added tracking for contact links (Discord, Email, etc.)
- Captures: contact type and URL

## Tracked Events

### Events Sent to Umami

1. **product_view**
   - Triggered: When a product modal is opened
   - Data: product_name, category, brand

2. **product_link_click**
   - Triggered: When user clicks a product purchase link
   - Data: product_name, category, platform (shopee/tiktok/lazada/other), brand, url

3. **social_link_click**
   - Triggered: When user clicks a social media link
   - Data: platform, url

4. **contact_link_click**
   - Triggered: When user clicks a contact link
   - Data: contact_type, url

5. **discount_code_copy**
   - Triggered: When user copies a discount code
   - Data: code, product_name

## Integration Notes

- Umami script is already loaded in `index.html` (analytics.kenzchiro.link)
- All tracking functions check for `window.umami` availability
- Tracking works alongside existing GTM/GA4 setup
- No breaking changes to existing functionality
- All events are non-blocking and won't affect user experience

## How to View Analytics

Analytics data can be viewed at: https://analytics.kenzchiro.link/
