'use strict';

// Brutal Mode: a whole-site theme toggle + the photo gallery that only
// exists while it's on. Kept separate from script.js on purpose — this is
// one self-contained feature, not a change to the base template's behavior.
(function () {
  const root = document.documentElement;
  const STORAGE_KEY = 'brutal';

  const toggleBtn = document.querySelector('[data-brutal-toggle]');
  const toggleLabel = document.querySelector('[data-brutal-label]');

  const setLabel = function (on) {
    if (toggleLabel) toggleLabel.textContent = on ? 'Normal Mode' : 'Brutal Mode';
    if (toggleBtn) toggleBtn.setAttribute('aria-pressed', String(on));
  };

  const DEFAULT_AVATAR = './assets/images/my-avatar.webp';
  const BRUTAL_AVATAR = './assets/images/brutal-avatar.jpg';
  const avatarImg = document.querySelector('.avatar-box img');

  const setAvatar = function (on) {
    if (avatarImg) avatarImg.src = on ? BRUTAL_AVATAR : DEFAULT_AVATAR;
  };

  setLabel(root.hasAttribute('data-brutal'));
  setAvatar(root.hasAttribute('data-brutal'));

  // --- gallery -------------------------------------------------------

  const PHOTOS = [
    { src: './assets/images/gallery/image-1.jpg', caption: 'Aesthetic banne ki koshish', tag: 'Self' },
    { src: './assets/images/gallery/image-2.jpg', caption: 'Red walls, hard shadows', tag: 'Places' },
    { src: './assets/images/gallery/image-3.jpg', caption: 'Good food, good mood', tag: 'Food' },
    { src: './assets/images/gallery/image-4.jpg', caption: 'The one that started it', tag: 'Gear' },
    { src: './assets/images/gallery/image-5.jpg', caption: 'Made with care', tag: 'Food' },
  ];

  const galleryGrid = document.querySelector('[data-gallery-grid]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('[data-lightbox-caption]') : null;
  const lightboxClose = document.querySelector('[data-lightbox-close]');

  let galleryRendered = false;

  const renderGallery = function () {
    if (galleryRendered || !galleryGrid) return;
    galleryRendered = true;

    galleryGrid.innerHTML = PHOTOS.map(function (photo, i) {
      const tilt = i % 2 === 0 ? '-1.5deg' : '1.5deg';
      return (
        '<figure class="gallery-card" data-gallery-card style="--tilt:' + tilt + '">' +
          '<img src="' + photo.src + '" alt="' + photo.caption + '" loading="lazy">' +
          '<figcaption><span class="gallery-tag">' + photo.tag + '</span>' + photo.caption + '</figcaption>' +
        '</figure>'
      );
    }).join('');

    galleryGrid.querySelectorAll('[data-gallery-card]').forEach(function (card) {
      card.addEventListener('click', function () {
        const img = card.querySelector('img');
        const caption = card.querySelector('figcaption');
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.showModal();
      });
    });
  };

  if (lightbox) {
    // click on the dialog's own backdrop area (outside its padded content box)
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.close();
    });
  }
  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', function () { lightbox.close(); });
  }

  // --- toggle ----------------------------------------------------------

  const leaveGalleryIfActive = function () {
    const galleryPage = document.querySelector('[data-page="gallery"]');
    if (!galleryPage || !galleryPage.classList.contains('active')) return;

    // ponytail: Gallery only exists in brutal mode. Turning brutal mode off
    // while parked there would strand the user on a tab whose nav link just
    // vanished — send them back to About instead.
    const aboutPage = document.querySelector('[data-page="about"]');
    document.querySelectorAll('[data-page]').forEach(function (p) { p.classList.remove('active'); });
    document.querySelectorAll('[data-nav-link]').forEach(function (l, i) { l.classList.toggle('active', i === 0); });
    if (aboutPage) aboutPage.classList.add('active');
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const turningOn = !root.hasAttribute('data-brutal');

      // .sidebar (and others) carry a blanket `transition: <duration>` for
      // their own accordion/hover animations, which also crossfades every
      // background/color the theme swap touches — mid-fade colors read as
      // wrong, not just "animated". Freeze transitions for one paint so
      // the swap is instant, then let normal hover/press ones resume.
      root.classList.add('brutal-switching');

      if (turningOn) {
        root.setAttribute('data-brutal', '');
        renderGallery();
      } else {
        root.removeAttribute('data-brutal');
        leaveGalleryIfActive();
      }
      setAvatar(turningOn);

      try { localStorage.setItem(STORAGE_KEY, turningOn ? '1' : '0'); } catch (e) { /* storage unavailable, mode just won't persist */ }
      setLabel(turningOn);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.classList.remove('brutal-switching');
        });
      });
    });
  }

  if (root.hasAttribute('data-brutal')) renderGallery();
})();
