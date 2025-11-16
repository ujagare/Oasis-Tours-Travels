# Oasis Travel & Tourism

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Libraries Installed

- **GSAP** - Advanced animations
- **ScrollTrigger** - Scroll-based animations
- **Lenis** - Smooth scrolling
- **Tailwind CSS** - Utility-first CSS framework
- **Barba.js** - Page transitions
- **Firebase** - Backend services
- **ImageKit.io** - Image and video optimization
- **Google Analytics** - Website analytics
- **Google Search Console** - SEO monitoring

## Setup Instructions

1. Replace `GA_MEASUREMENT_ID` in index.html with your Google Analytics ID
2. Replace `your-verification-code` with your Google Search Console verification code
3. Update Firebase config in `firebase-config.js` with your project details
4. **ImageKit.io Setup:**
   - Sign up at [ImageKit.io](https://imagekit.io)
   - Get your URL endpoint, public key, and private key
   - Update `imagekit-config.js` with your ImageKit credentials:
     ```javascript
     this.urlEndpoint = 'https://ik.imagekit.io/your_imagekit_id/';
     this.publicKey = 'public_your_public_key';
     ```
5. Run `npm install` to install all dependencies
6. Run `npm run dev` to start development server

## Features

- Smooth scrolling with Lenis
- GSAP animations with ScrollTrigger
- Page transitions with Barba.js
- Responsive design with Tailwind CSS
- Firebase backend integration
- **Optimized images and videos with ImageKit.io**
- **Automatic image format conversion (WebP, AVIF)**
- **Responsive image delivery**
- **Real-time image transformations**
- Google Analytics tracking
- SEO optimized