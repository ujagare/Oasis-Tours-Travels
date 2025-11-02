// Optimized Firebase Configuration for Image Upload
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Optimized image upload function
export async function uploadImage(file, folder = 'uploads') {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file selected');
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
    
    // Compress image before upload
    const compressedFile = await compressImage(file);
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, compressedFile);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL,
      filename: filename
    };
    
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Image compression function
function compressImage(file, quality = 0.8) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1200px width)
      const maxWidth = 1200;
      const maxHeight = 1200;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Save form data with image
export async function saveFormWithImage(formData, imageFile) {
  try {
    let imageUrl = null;
    
    // Upload image if provided
    if (imageFile) {
      const uploadResult = await uploadImage(imageFile, 'contact-images');
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
      } else {
        throw new Error(uploadResult.error);
      }
    }
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...formData,
      imageUrl: imageUrl,
      timestamp: new Date(),
      status: 'pending'
    });
    
    return {
      success: true,
      id: docRef.id
    };
    
  } catch (error) {
    console.error('Save error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Initialize file upload UI
export function initFileUpload() {
  // Create file input if it doesn't exist
  let fileInput = document.getElementById('image-upload');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'image-upload';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
  }
  
  // Create upload button
  let uploadBtn = document.getElementById('upload-btn');
  if (!uploadBtn) {
    uploadBtn = document.createElement('button');
    uploadBtn.id = 'upload-btn';
    uploadBtn.type = 'button';
    uploadBtn.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors';
    uploadBtn.innerHTML = '📷 Upload Image';
    
    // Add to contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      const messageField = contactForm.querySelector('#message').parentElement;
      messageField.insertAdjacentElement('afterend', uploadBtn);
    }
  }
  
  // Handle upload button click
  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  // Handle file selection
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    uploadBtn.textContent = 'Uploading...';
    uploadBtn.disabled = true;
    
    const result = await uploadImage(file);
    
    if (result.success) {
      uploadBtn.textContent = '✅ Image Uploaded';
      uploadBtn.style.backgroundColor = '#10b981';
      
      // Store URL for form submission
      uploadBtn.dataset.imageUrl = result.url;
      
      // Show preview
      showImagePreview(result.url);
    } else {
      uploadBtn.textContent = '❌ Upload Failed';
      uploadBtn.style.backgroundColor = '#ef4444';
      alert('Upload failed: ' + result.error);
      
      setTimeout(() => {
        uploadBtn.textContent = '📷 Upload Image';
        uploadBtn.style.backgroundColor = '#2563eb';
        uploadBtn.disabled = false;
      }, 3000);
    }
  });
}

// Show image preview
function showImagePreview(url) {
  let preview = document.getElementById('image-preview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'image-preview';
    preview.className = 'mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg';
    
    const uploadBtn = document.getElementById('upload-btn');
    uploadBtn.insertAdjacentElement('afterend', preview);
  }
  
  preview.innerHTML = `
    <div class="flex items-center space-x-4">
      <img src="${url}" alt="Preview" class="w-20 h-20 object-cover rounded-lg">
      <div>
        <p class="text-sm text-gray-600">Image uploaded successfully</p>
        <button type="button" onclick="removeImagePreview()" class="text-red-600 text-sm hover:underline">Remove</button>
      </div>
    </div>
  `;
}

// Remove image preview
window.removeImagePreview = function() {
  const preview = document.getElementById('image-preview');
  const uploadBtn = document.getElementById('upload-btn');
  
  if (preview) preview.remove();
  if (uploadBtn) {
    uploadBtn.textContent = '📷 Upload Image';
    uploadBtn.style.backgroundColor = '#2563eb';
    uploadBtn.disabled = false;
    delete uploadBtn.dataset.imageUrl;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initFileUpload();
});

export { storage, db };