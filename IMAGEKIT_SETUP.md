# ImageKit.io Setup Guide for Oasis Travel & Tourism

## Overview
ImageKit.io is integrated to optimize all images and videos on the website, providing faster loading times, better user experience, and reduced bandwidth usage.

## Features Implemented
- ✅ Automatic image optimization
- ✅ WebP/AVIF format conversion
- ✅ Responsive image delivery
- ✅ Real-time image transformations
- ✅ Video optimization
- ✅ Lazy loading support
- ✅ CDN delivery

## Setup Steps

### 1. Create ImageKit Account
1. Go to [ImageKit.io](https://imagekit.io)
2. Sign up for a free account
3. Complete email verification

### 2. Get Your Credentials
After login, go to Developer section and copy:
- **URL Endpoint**: `https://ik.imagekit.io/your_imagekit_id/`
- **Public Key**: `public_xxxxxxxxxx`
- **Private Key**: `private_xxxxxxxxxx` (for server-side operations)

### 3. Update Configuration
Edit `imagekit-config.js`:
```javascript
this.urlEndpoint = 'https://ik.imagekit.io/your_actual_imagekit_id/';
this.publicKey = 'public_your_actual_public_key';
```

### 4. Upload Existing Images
You have two options:

#### Option A: Manual Upload via Dashboard
1. Go to ImageKit dashboard
2. Create folders: `Images`, `video`, `graphics`, etc.
3. Upload your existing images maintaining folder structure

#### Option B: Bulk Upload via API
Use the provided `imagekit-upload.js` script:
```javascript
const uploader = new ImageKitUploader();
// Upload files programmatically
```

## Image Optimization Features

### Automatic Transformations
- **Quality**: Automatically optimized (default: 85%)
- **Format**: Auto-converts to WebP/AVIF when supported
- **Compression**: Lossless compression applied
- **Progressive**: Progressive JPEG loading

### Responsive Images
```javascript
// Generate responsive srcset
const srcSet = imageKit.generateResponsiveSrcSet('Images/hero-image.jpg');
// Output: Multiple sizes for different screen resolutions
```

### Real-time Transformations
```javascript
// Resize image
const optimizedUrl = imageKit.getOptimizedImageUrl('Images/hero.jpg', {
    width: 800,
    height: 600,
    quality: 90,
    format: 'webp'
});
```

## Video Optimization

### Supported Formats
- MP4 optimization
- Automatic quality adjustment
- Bandwidth-based delivery

### Usage
```javascript
const optimizedVideo = imageKit.getOptimizedVideoUrl('video/Dubai.mp4', {
    quality: 70,
    format: 'mp4'
});
```

## Implementation Details

### Automatic Image Detection
The system automatically detects and optimizes:
- All images in `Images/` folder
- All videos in `video/` folder
- Dynamically loaded images

### Performance Benefits
- **50-80% smaller file sizes**
- **Faster page load times**
- **Better Core Web Vitals scores**
- **Reduced bandwidth costs**

## File Structure After Setup
```
project/
├── imagekit-config.js          # Main configuration
├── imagekit-upload.js          # Upload utilities
├── Images/                     # Original images (will be optimized)
├── video/                      # Original videos (will be optimized)
└── index.html                  # Updated with ImageKit scripts
```

## Testing the Integration

### 1. Check Image URLs
After setup, images should load from ImageKit CDN:
```
Before: /Images/hero.jpg
After:  https://ik.imagekit.io/your_id/tr:w-800,q-85,f-webp/Images/hero.jpg
```

### 2. Verify Optimization
- Open browser DevTools
- Check Network tab
- Confirm images are loading from ImageKit CDN
- Verify smaller file sizes

### 3. Test Responsive Images
- Resize browser window
- Check that different image sizes load for different screen sizes

## Troubleshooting

### Common Issues

#### Images not loading from ImageKit
- Check if URL endpoint is correct
- Verify public key is valid
- Ensure images are uploaded to ImageKit

#### Slow initial load
- Images need to be uploaded to ImageKit first
- Use the migration script to bulk upload

#### CORS errors
- ImageKit handles CORS automatically
- Check if domain is whitelisted in ImageKit settings

### Debug Mode
Enable console logging in `imagekit-config.js`:
```javascript
console.log(`Optimized image: ${imagePath}`);
```

## Best Practices

### Image Naming
- Use descriptive filenames
- Maintain folder structure
- Avoid special characters

### Quality Settings
- Use quality 85-90 for hero images
- Use quality 70-80 for thumbnails
- Use quality 60-70 for background images

### Lazy Loading
All images automatically get `loading="lazy"` attribute for better performance.

## Cost Optimization
- Free tier: 20GB bandwidth/month
- Paid plans start at $9/month
- Monitor usage in ImageKit dashboard

## Support
- ImageKit Documentation: https://docs.imagekit.io/
- Support: support@imagekit.io
- Community: ImageKit Discord/Forum

## Migration Checklist
- [ ] ImageKit account created
- [ ] Credentials updated in config files
- [ ] Existing images uploaded to ImageKit
- [ ] Website tested with optimized images
- [ ] Performance improvements verified
- [ ] Backup of original images maintained

---

**Note**: Keep your original images as backup. ImageKit serves optimized versions while preserving originals.