/**
 * Umami Analytics Tracking Utility
 * Sends events to Umami analytics service
 */

const UMAMI_EVENT_NAMES = {
  PRODUCT_VIEW: 'product_view',
  PRODUCT_LINK_CLICK: 'product_link_click',
  SOCIAL_LINK_CLICK: 'social_link_click',
  CONTACT_LINK_CLICK: 'contact_link_click',
  DISCOUNT_CODE_COPY: 'discount_code_copy'
};

/**
 * Track a product view event
 * @param {string} productTitle - Product title
 * @param {string} category - Product category
 * @param {string} brand - Product brand
 */
export const trackProductView = (productTitle, category, brand) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(UMAMI_EVENT_NAMES.PRODUCT_VIEW, {
      product_name: productTitle,
      category: category || 'unknown',
      brand: brand || 'unknown'
    });
  }
};

/**
 * Track product link click/conversion
 * @param {string} productTitle - Product title
 * @param {string} category - Product category
 * @param {string} platform - Platform/channel (shopee, lazada, tiktok, other)
 * @param {string} url - Product URL
 * @param {string} brand - Product brand
 */
export const trackProductLinkClick = (productTitle, category, platform, url, brand) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(UMAMI_EVENT_NAMES.PRODUCT_LINK_CLICK, {
      product_name: productTitle,
      category: category || 'unknown',
      platform: platform || 'unknown',
      brand: brand || 'unknown',
      url: url
    });
  }
};

/**
 * Track social media link click
 * @param {string} socialPlatform - Social platform name (twitter, instagram, etc)
 * @param {string} url - Social media URL
 */
export const trackSocialLinkClick = (socialPlatform, url) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(UMAMI_EVENT_NAMES.SOCIAL_LINK_CLICK, {
      platform: socialPlatform,
      url: url
    });
  }
};

/**
 * Track contact link click
 * @param {string} contactType - Contact type (email, discord, etc)
 * @param {string} url - Contact URL
 */
export const trackContactLinkClick = (contactType, url) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(UMAMI_EVENT_NAMES.CONTACT_LINK_CLICK, {
      contact_type: contactType,
      url: url
    });
  }
};

/**
 * Track discount code copy
 * @param {string} code - Discount code copied
 * @param {string} productTitle - Product title
 */
export const trackDiscountCodeCopy = (code, productTitle) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(UMAMI_EVENT_NAMES.DISCOUNT_CODE_COPY, {
      code: code,
      product_name: productTitle
    });
  }
};
