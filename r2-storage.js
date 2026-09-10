(() => {
  'use strict';

  const CONFIG = {
    endpoint: "https://f7485d8b9ded6b53b3afb2b6a33fbc4a.r2.cloudflarestorage.com",
    accessKeyId: "4ff3ab3327d4f241ab5d4dd5d7287c00",
    secretAccessKey: "83625c0799d3498115b54fbce50b9c99d752edc1b355ea74f94fa69458b3b463",
    bucketName: "oskar-images",
    publicDomain: "https://pub-f7485d8b9ded6b53b3afb2b6a33fbc4a.r2.dev"
  };

  const TARGET_BYTES = 50 * 1024;
  const SIGNED_URL_TTL = 60 * 60 * 6; // 6 hours; generated only for display, never stored in Turso.
  let s3 = null;
  let sdkPromise = null;
  const signedUrlCache = new Map();

  function ensureSdk() {
    if (window.AWS && window.AWS.S3) return Promise.resolve(window.AWS);
    if (!navigator.onLine) return Promise.reject(new Error('لا يوجد اتصال بالإنترنت.'));
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-ahmadi-aws-sdk]');
      if (existing) {
        existing.addEventListener('load', () => window.AWS?.S3 ? resolve(window.AWS) : reject(new Error('تعذر تحميل خدمة رفع الصور.')), {once:true});
        existing.addEventListener('error', () => reject(new Error('تعذر تحميل خدمة رفع الصور.')), {once:true});
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.1500.0/aws-sdk.min.js';
      script.async = true;
      script.dataset.ahmadiAwsSdk = '1';
      script.onload = () => window.AWS?.S3 ? resolve(window.AWS) : reject(new Error('تعذر تحميل خدمة رفع الصور.'));
      script.onerror = () => reject(new Error('تعذر تحميل خدمة رفع الصور. تحقق من الإنترنت.'));
      document.head.appendChild(script);
    }).catch(err => { sdkPromise = null; throw err; });
    return sdkPromise;
  }

  async function ensureClient() {
    if (s3) return s3;
    await ensureSdk();
    s3 = new window.AWS.S3({
      endpoint: CONFIG.endpoint,
      accessKeyId: CONFIG.accessKeyId,
      secretAccessKey: CONFIG.secretAccessKey,
      region: 'auto',
      signatureVersion: 'v4',
      s3ForcePathStyle: true
    });
    return s3;
  }

  function safePart(value, fallback='image') {
    const out = String(value || '')
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    return out || fallback;
  }

  function publicUrl(key) {
    return `${CONFIG.publicDomain.replace(/\/$/, '')}/${String(key).split('/').map(encodeURIComponent).join('/')}`;
  }

  function keyFromUrl(value) {
    const raw = String(value || '').trim();
    if (!raw || /^data:|^blob:/i.test(raw)) return '';
    try {
      const u = new URL(raw, location.href);
      const publicHost = new URL(CONFIG.publicDomain).host;
      const endpointHost = new URL(CONFIG.endpoint).host;
      let path = u.pathname.replace(/^\/+/, '').split('/').map(part => {
        try { return decodeURIComponent(part); } catch (_) { return part; }
      }).join('/');
      if (u.host === publicHost) return path;
      if (u.host === endpointHost) {
        const prefix = `${CONFIG.bucketName}/`;
        if (path.startsWith(prefix)) path = path.slice(prefix.length);
        return path;
      }
    } catch (_) {}
    return '';
  }

  async function signedUrl(key, expires=SIGNED_URL_TTL) {
    const clean = String(key || '').replace(/^\/+/, '');
    if (!clean) throw new Error('رابط الصورة غير صالح.');
    const now = Date.now();
    const cached = signedUrlCache.get(clean);
    if (cached && cached.expiresAt > now + 60_000) return cached.url;
    const client = await ensureClient();
    const ttl = Math.max(60, Math.min(Number(expires) || SIGNED_URL_TTL, SIGNED_URL_TTL));
    const url = await new Promise((resolve, reject) => {
      client.getSignedUrl('getObject', { Bucket: CONFIG.bucketName, Key: clean, Expires: ttl }, (err, value) => err ? reject(err) : resolve(value));
    });
    signedUrlCache.set(clean, { url, expiresAt: now + (ttl * 1000) });
    return url;
  }

  function isR2Url(value) {
    const raw = String(value || '').trim();
    if (!/^https?:/i.test(raw)) return false;
    try {
      const host = new URL(raw, location.href).host;
      return host === new URL(CONFIG.publicDomain).host || host === new URL(CONFIG.endpoint).host;
    } catch (_) { return false; }
  }

  function bindImage(img, src, key='') {
    if (!(img instanceof HTMLImageElement)) return img;
    const original = String(src || img.getAttribute('src') || '').trim();
    const cleanKey = String(key || img.dataset.r2Key || keyFromUrl(original) || '').trim();
    if (cleanKey) img.dataset.r2Key = cleanKey;
    if (original) img.dataset.r2Original = original;
    if (img.dataset.r2Bound !== '1') {
      img.dataset.r2Bound = '1';
      img.addEventListener('error', async () => {
        const current = String(img.getAttribute('src') || '');
        const source = String(img.dataset.r2Original || current || '');
        const objectKey = String(img.dataset.r2Key || keyFromUrl(source) || '');
        if (!objectKey || img.dataset.r2SignedAttempt === '1' || navigator.onLine === false) return;
        img.dataset.r2SignedAttempt = '1';
        img.classList.add('r2-image-loading');
        try {
          // R2 buckets may accept uploads while the r2.dev public URL is disabled/private.
          // A short-lived signed GET URL fixes display without storing credentials or expiring URLs in Turso.
          const fallback = await signedUrl(objectKey);
          img.src = fallback;
          img.classList.remove('r2-image-error');
        } catch (err) {
          console.warn('R2 signed image fallback failed:', err);
          img.classList.add('r2-image-error');
        } finally {
          img.classList.remove('r2-image-loading');
        }
      });
      img.addEventListener('load', () => {
        img.classList.remove('r2-image-loading', 'r2-image-error');
      });
    }
    if (original && img.getAttribute('src') !== original) {
      img.dataset.r2SignedAttempt = '0';
      img.src = original;
    }
    return img;
  }

  function setImageSource(img, src, key='') {
    if (!(img instanceof HTMLImageElement)) return;
    const value = String(src || '').trim();
    img.dataset.r2SignedAttempt = '0';
    if (key) img.dataset.r2Key = String(key);
    if (value) {
      img.dataset.r2Original = value;
      bindImage(img, value, key);
      img.src = value;
    } else {
      img.removeAttribute('data-r2-key');
      img.removeAttribute('data-r2-original');
      img.src = '';
    }
  }

  function refreshImages(root=document) {
    const scope = root && root.querySelectorAll ? root : document;
    const images = [];
    if (root instanceof HTMLImageElement) images.push(root);
    images.push(...scope.querySelectorAll('img[src],img[data-r2-key]'));
    images.forEach(img => {
      const src = String(img.dataset.r2Original || img.getAttribute('src') || '');
      if (img.dataset.r2Key || isR2Url(src)) bindImage(img, src, img.dataset.r2Key || '');
    });
  }

  const imageObserver = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes || []) {
        if (node instanceof HTMLImageElement) refreshImages(node);
        else if (node && node.querySelectorAll) refreshImages(node);
      }
    }
  });
  if (document.documentElement) imageObserver.observe(document.documentElement, { childList: true, subtree: true });

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('تعذر قراءة الصورة.'));
      reader.readAsDataURL(file);
    });
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('تعذر حفظ الصورة محلياً.'));
      reader.readAsDataURL(blob);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('تعذر فتح الصورة.'));
      img.src = src;
    });
  }

  function canvasBlob(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('تعذر تجهيز الصورة.')), 'image/jpeg', quality);
    });
  }

  async function compressImage(file, targetBytes=TARGET_BYTES) {
    if (!file || !/^image\//i.test(file.type || '')) throw new Error('اختر صورة صالحة.');
    const target = Math.max(12 * 1024, Math.min(Number(targetBytes) || TARGET_BYTES, TARGET_BYTES));
    const src = await readAsDataUrl(file);
    const img = await loadImage(src);
    const sourceW = img.naturalWidth || img.width || 1;
    const sourceH = img.naturalHeight || img.height || 1;
    const sourceMax = Math.max(sourceW, sourceH);
    let maxDim = Math.min(1600, sourceMax);
    let best = null;

    for (let round = 0; round < 12; round++) {
      const scale = Math.min(1, maxDim / sourceMax);
      const width = Math.max(64, Math.round(sourceW * scale));
      const height = Math.max(64, Math.round(sourceH * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      let lo = 0.18, hi = 0.92, candidate = null;
      for (let i = 0; i < 10; i++) {
        const q = (lo + hi) / 2;
        const blob = await canvasBlob(canvas, q);
        if (!best || Math.abs(target - blob.size) < Math.abs(target - best.size)) best = blob;
        if (blob.size <= target) {
          candidate = blob;
          lo = q;
        } else {
          hi = q;
        }
      }
      if (candidate && candidate.size <= target) return candidate;
      maxDim = Math.max(64, Math.round(maxDim * 0.82));
    }

    if (best && best.size <= target) return best;
    throw new Error('تعذر تجهيز الصورة ضمن حجم 50KB.');
  }

  async function putObject(file, key, onProgress) {
    const client = await ensureClient();
    return new Promise((resolve, reject) => {
      const request = client.upload({
        Bucket: CONFIG.bucketName,
        Key: key,
        Body: file,
        ContentType: file.type || 'image/jpeg',
        CacheControl: 'public, max-age=31536000, immutable'
      });
      if (typeof onProgress === 'function') {
        request.on('httpUploadProgress', evt => {
          const pct = evt.total ? Math.round((evt.loaded / evt.total) * 100) : 0;
          onProgress(Math.max(0, Math.min(100, pct)));
        });
      }
      request.send((err, data) => err ? reject(err) : resolve(data));
    });
  }

  async function uploadCompressedBlob(blob, originalName='image.jpg', options={}) {
    if (!navigator.onLine) throw new Error('لا يوجد اتصال بالإنترنت.');
    const folder = String(options.folder || 'ahmadi/attachments').replace(/^\/+|\/+$/g, '');
    const base = safePart(String(originalName || 'image').replace(/\.[^.]+$/, ''), 'image');
    const key = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2,8)}_${base}.jpg`;
    const uploadFile = new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
    if (typeof options.onStage === 'function') options.onStage('uploading');
    await putObject(uploadFile, key, options.onProgress);
    return { url: publicUrl(key), key, size: uploadFile.size, type: uploadFile.type, name: uploadFile.name };
  }

  async function uploadImage(file, options={}) {
    if (!navigator.onLine) throw new Error('لا يوجد اتصال بالإنترنت.');
    const targetBytes = Math.min(Number(options.targetBytes) || TARGET_BYTES, TARGET_BYTES);
    if (typeof options.onStage === 'function') options.onStage('preparing');
    const blob = await compressImage(file, targetBytes);
    return uploadCompressedBlob(blob, file.name || 'image.jpg', options);
  }

  async function prepareLocalImage(file, options={}) {
    const targetBytes = Math.min(Number(options.targetBytes) || TARGET_BYTES, TARGET_BYTES);
    if (typeof options.onStage === 'function') options.onStage('preparing');
    const blob = await compressImage(file, targetBytes);
    const url = await blobToDataUrl(blob);
    return {
      url,
      key: '',
      size: blob.size,
      type: 'image/jpeg',
      name: `${safePart(String(file.name || 'image').replace(/\.[^.]+$/, ''), 'image')}.jpg`,
      pending: true
    };
  }

  async function uploadDataUrl(dataUrl, options={}) {
    if (!navigator.onLine) throw new Error('لا يوجد اتصال بالإنترنت.');
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], options.name || 'offline-image.jpg', { type: blob.type || 'image/jpeg' });
    return uploadImage(file, options);
  }

  async function deleteObject(key) {
    if (!key) return;
    const client = await ensureClient();
    return new Promise((resolve, reject) => client.deleteObject({ Bucket: CONFIG.bucketName, Key: key }, err => err ? reject(err) : resolve(true)));
  }

  window.AhmadiR2 = {
    targetBytes: TARGET_BYTES,
    compressImage,
    prepareLocalImage,
    uploadImage,
    uploadCompressedBlob,
    uploadDataUrl,
    deleteObject,
    publicUrl,
    keyFromUrl,
    signedUrl,
    bindImage,
    setImageSource,
    refreshImages,
    isReady: () => !!(window.AWS && window.AWS.S3)
  };

  queueMicrotask(() => refreshImages(document));
})();
