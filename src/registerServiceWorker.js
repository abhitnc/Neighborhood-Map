const isLocalhost = Boolean(
  window.location.hostname === 'localhost'
    || window.location.hostname === '[::1]'
    || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);

export default function register() {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://goo.gl/SC7cgQ'
          );
        });
      } else {
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      if (!navigator.serviceWorker.controller) {
        return;
      }
      if (registration.waiting) {
        updateReady(registration.waiting);
        return;
      }
      if (registration.installing) {
        const installingWorker = registration.installing;
        trackInstalling(installingWorker);
        return;
      }
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        trackInstalling(installingWorker);
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl)
    .then((response) => {
      if (
        response.status === 404
        || response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
function trackInstalling(installingWorker) {
  installingWorker.addEventListener('statechange', () => {
    if (installingWorker.state === 'installed') {
      if (navigator.serviceWorker.controller) {
        console.log('New content is available; please refresh.');
        updateReady(installingWorker);
      } else {
        console.log('Content is cached for offline use.');
      }
    }
  });
}

function updateReady(worker) {
  let userConsent = false;
  userConsent = window.confirm('New version available. Do you want to update?');
  if (!userConsent) return;
  worker.postMessage('updateSW');
}
