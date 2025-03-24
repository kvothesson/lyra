function shareOnTwitter() {
  const pageTitle = document.title;
  const pageUrl = window.location.href;
  const sessionDate = document.querySelector('.session-date')?.textContent.trim();
  let message = "Lyra IA | Análisis de sesión parlamentaria";
  if (sessionDate) {
    message = `Lyra IA | Análisis de sesión del ${sessionDate}`;
  }
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(pageUrl)}&hashtags=Lyra,Congreso,TransparenciaPolitica`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
}

function shareOnWhatsApp() {
  const pageUrl = window.location.href;
  const sessionDate = document.querySelector('.session-date')?.textContent.trim();
  let message = "Lyra IA | Análisis de sesión parlamentaria: ";
  if (sessionDate) {
    message = `Lyra IA | Análisis de sesión del ${sessionDate}: `;
  }
  message += pageUrl;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  const mainContainer = document.querySelector('main.container');
  if (mainContainer) {
    fetch('../share-buttons.html')
      .then(response => response.text())
      .then(html => {
        mainContainer.insertAdjacentHTML('beforeend', html);
      })
      .catch(error => console.error('Error loading share buttons:', error));
  }
});