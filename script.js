// Mobile navigation toggle
document.getElementById('nav-toggle').addEventListener('click', function() {
  document.getElementById('nav-menu').classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const message = document.getElementById('form-message');
  
  // Simulate form submission
  message.classList.remove('hidden');
  this.reset();
  
  setTimeout(() => {
    message.classList.add('hidden');
  }, 4000);
});

// Dynamic Profile Photo Manager
class DynamicProfilePhoto {
  constructor() {
    this.currentPhotoIndex = 0;
    this.photos = [
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80', // Professional academic
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', // Business casual
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80', // Formal suit
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80', // Speaking engagement
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80'  // Research/teaching
    ];
    this.photoDescriptions = [
      'Professional Academic Leader',
      'Business Casual Dean',
      'Formal Executive Dean',
      'Public Speaking Dean',
      'Research & Teaching Dean'
    ];
    this.initializeDynamicPhoto();
  }

  initializeDynamicPhoto() {
    const profilePhoto = document.querySelector('#home img[alt="Dr. Inderjeet Gupta"]');
    if (!profilePhoto) return;

    // Add photo controls
    this.addPhotoControls();
    
    // Set initial photo based on time of day
    this.setTimeBasedPhoto();
    
    // Add hover effect to show photo info
    this.addHoverEffect(profilePhoto);
    
    // Auto-rotate photos every 30 seconds (optional)
    this.startAutoRotation();
  }

  addPhotoControls() {
    const heroSection = document.querySelector('#home .max-w-6xl');
    if (!heroSection) return;

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'photo-controls absolute top-4 right-4 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity duration-300';
    controlsContainer.innerHTML = `
      <button id="prev-photo" class="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
        <i class="fas fa-chevron-left text-sm"></i>
      </button>
      <button id="next-photo" class="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
        <i class="fas fa-chevron-right text-sm"></i>
      </button>
      <button id="auto-rotate" class="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
        <i class="fas fa-play text-sm"></i>
      </button>
    `;

    // Insert controls into hero section
    const heroContent = heroSection.querySelector('.grid');
    heroContent.style.position = 'relative';
    heroContent.appendChild(controlsContainer);

    // Add event listeners
    document.getElementById('prev-photo').addEventListener('click', () => this.previousPhoto());
    document.getElementById('next-photo').addEventListener('click', () => this.nextPhoto());
    document.getElementById('auto-rotate').addEventListener('click', () => this.toggleAutoRotation());
  }

  addHoverEffect(profilePhoto) {
    const photoContainer = profilePhoto.parentElement;
    
    // Add photo info overlay
    const photoInfo = document.createElement('div');
    photoInfo.className = 'photo-info absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer';
    photoInfo.innerHTML = `
      <div class="text-center">
        <div class="text-sm font-semibold">${this.photoDescriptions[this.currentPhotoIndex]}</div>
        <div class="text-xs mt-1">Click to change</div>
      </div>
    `;
    
    photoContainer.style.position = 'relative';
    photoContainer.appendChild(photoInfo);
    
    // Click to change photo
    photoInfo.addEventListener('click', () => this.nextPhoto());
  }

  setTimeBasedPhoto() {
    const hour = new Date().getHours();
    let photoIndex = 0;
    
    if (hour >= 6 && hour < 12) {
      photoIndex = 0; // Morning - Professional academic
    } else if (hour >= 12 && hour < 17) {
      photoIndex = 1; // Afternoon - Business casual
    } else if (hour >= 17 && hour < 20) {
      photoIndex = 2; // Evening - Formal suit
    } else {
      photoIndex = 3; // Night - Speaking engagement
    }
    
    this.changePhoto(photoIndex);
  }

  changePhoto(index) {
    const profilePhoto = document.querySelector('#home img[alt="Dr. Inderjeet Gupta"]');
    const photoInfo = document.querySelector('.photo-info');
    
    if (!profilePhoto) return;
    
    // Add fade transition
    profilePhoto.style.opacity = '0';
    
    setTimeout(() => {
      this.currentPhotoIndex = index;
      profilePhoto.src = this.photos[index];
      profilePhoto.style.opacity = '1';
      
      // Update photo info
      if (photoInfo) {
        photoInfo.querySelector('.text-sm').textContent = this.photoDescriptions[index];
      }
    }, 300);
  }

  nextPhoto() {
    const nextIndex = (this.currentPhotoIndex + 1) % this.photos.length;
    this.changePhoto(nextIndex);
  }

  previousPhoto() {
    const prevIndex = this.currentPhotoIndex === 0 ? this.photos.length - 1 : this.currentPhotoIndex - 1;
    this.changePhoto(prevIndex);
  }

  startAutoRotation() {
    this.autoRotationInterval = setInterval(() => {
      this.nextPhoto();
    }, 10000); // Change every 10 seconds
    
    this.isAutoRotating = true;
  }

  stopAutoRotation() {
    if (this.autoRotationInterval) {
      clearInterval(this.autoRotationInterval);
      this.isAutoRotating = false;
    }
  }

  toggleAutoRotation() {
    const autoButton = document.getElementById('auto-rotate');
    if (this.isAutoRotating) {
      this.stopAutoRotation();
      autoButton.innerHTML = '<i class="fas fa-play text-sm"></i>';
    } else {
      this.startAutoRotation();
      autoButton.innerHTML = '<i class="fas fa-pause text-sm"></i>';
    }
  }

  // Change photo based on section
  changePhotoForSection(sectionName) {
    const sectionPhotoMap = {
      'about': 0,      // Professional academic
      'leadership': 2, // Formal suit
      'research': 4,   // Research & teaching
      'news': 3,       // Speaking engagement
      'contact': 1     // Business casual
    };
    
    if (sectionPhotoMap[sectionName] !== undefined) {
      this.changePhoto(sectionPhotoMap[sectionName]);
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  const dynamicPhoto = new DynamicProfilePhoto();
  
  // Add some interactive features
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        
        // Change photo based on section
        const sectionId = entry.target.id;
        if (sectionId && dynamicPhoto) {
          dynamicPhoto.changePhotoForSection(sectionId);
        }
      }
    });
  }, observerOptions);

  // Observe sections for animation
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Add dynamic photo to window for debugging
  window.dynamicPhoto = dynamicPhoto;
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }
  
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
  
  .transition {
    transition: all 0.3s ease;
  }

  /* Dynamic photo styles */
  #home img[alt="Dr. Inderjeet Gupta"] {
    transition: opacity 0.3s ease;
  }

  .photo-controls {
    z-index: 10;
  }

  .photo-info {
    z-index: 5;
  }
`;
document.head.appendChild(style);
