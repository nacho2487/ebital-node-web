(function() {
    var defaults = {
        imageLoadClassName: 'lazy-loadable', // 'lazy-loadable' || 'onload-loadable'
        options: {
            rootMargin: '360px',
            loadMode: 'lazy' // 'lazy' || 'onload'
        }
    };
    var dataSrcKey = 'data-src';
    var dataSrcFallbackKey = 'data-src-fallback';
    var dataSrcSetKey = 'data-srcset';

    // IntersectionObserver has partial support in chrome <= 57 (https://caniuse.com/#feat=intersectionobserver)
    var supportIntersectionObserver = 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'isIntersecting' in window.IntersectionObserverEntry.prototype;

  function mergeOptions(target, source) {
    var list = [target, source];
    var cloned = {};

    for (var i = 0; i <= list.length; i++) {
      if (typeof list[i] === 'object' && list[i]) {
        for (var prop in list[i]) {
          cloned[prop] = list[i][prop];
        }
      }
    }
    return cloned;
  }

  function imageLazyLoading(imageLoadClassName, options, node) {
        if (!imageLoadClassName && options && options.loadMode === 'onload') {
          imageLoadClassName = 'onload-loadable';
        }
        imageLoadClassName = imageLoadClassName || defaults.imageLoadClassName;

        options = mergeOptions(defaults.options, options);

        var lazyImages = node ? 
                              [].concat(node.classList.contains(imageLoadClassName) ? [node] : []) :
                              [].slice.call(document.querySelectorAll('.' + imageLoadClassName));

        function loadImages(img) {
            function setSource(attr, srcKey, srcFallbackKey) {
                if (img.hasAttribute(srcKey)) {
                    var dataSrc = img.getAttribute(srcKey);
                    if (srcFallbackKey && img.hasAttribute(srcFallbackKey)) {
                      var dataSrcFallback = img.getAttribute(srcFallbackKey);
                      img.onload = function() {
                        img.removeAttribute(srcFallbackKey);
                      }
                      img.onerror = function() {
                        this.src = dataSrcFallback;
                        this.srcset = dataSrcFallback;
                        img.removeAttribute(srcFallbackKey);
                        img.onerror = null;
                      };
                    }
                    img.setAttribute(attr, dataSrc);
                    img.removeAttribute(srcKey);
                }
            }

            setSource('src', dataSrcKey, dataSrcFallbackKey);
            setSource('srcset', dataSrcSetKey);

            img.classList.remove(imageLoadClassName);

            if (img.classList.length < 1) {
                img.removeAttribute('class');
            }
        }

        function loadAllImages() {
          lazyImages.forEach(function(image) {
                loadImages(image);
            });
        }

        if (supportIntersectionObserver && options.loadMode === 'lazy') {
            var lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var lazyImage = entry.target;
                    loadImages(lazyImage);
                    lazyImageObserver.unobserve(lazyImage);
                }
                });
            }, options);

            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });

            window.lazyImageObserver = lazyImageObserver;
        
          // This condition enter on fallback or loadMode is onLoad
        } else if ((!supportIntersectionObserver && options.loadMode === 'lazy') || options.loadMode === 'onload') {
            if (document.readyState === 'complete') {
                loadAllImages();
            } else {
                window.addEventListener('load', function() {
                    loadAllImages();
                });
            }
        }
    }

    function initLazyLoading() {
      imageLazyLoading();
      imageLazyLoading('onload-loadable', { loadMode: 'onload' });
    }

    window.imageLazyLoading = imageLazyLoading;
    initLazyLoading();
}());