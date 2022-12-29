if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
	navigator.serviceWorker.register('https://influencerpeach.unocrm.mxservice-worker.js')
	.then(function(registration) { console.log('Service Worker Ready'); registration.update(); })
	.catch(function(error) { console.log('Registration failed with ' + error); });
  });
}