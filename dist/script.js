const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.style.overflow = '';
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('is-open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const quoteForm = document.querySelector('#quote-form');
const termsTrigger = document.querySelector('.terms-trigger');
const termsDetails = document.querySelector('#terms-details');
const formStatus = document.querySelector('#form-status');

termsTrigger.addEventListener('click', () => {
  const expanded = termsTrigger.getAttribute('aria-expanded') === 'true';
  termsTrigger.setAttribute('aria-expanded', String(!expanded));
  termsDetails.hidden = expanded;
});

const errorMessages = {
  firstName: 'Inserisci il nome.',
  lastName: 'Inserisci il cognome.',
  email: 'Inserisci un indirizzo email valido.',
  message: 'Descrivi brevemente il progetto.',
  terms: 'Accetta i termini e le condizioni per continuare.'
};

function showFieldError(field) {
  const isValid = field.validity.valid;
  field.setAttribute('aria-invalid', String(!isValid));
  const error = field.name === 'terms'
    ? quoteForm.querySelector('.terms-error')
    : field.closest('.form-field').querySelector('.field-error');
  error.textContent = isValid ? '' : errorMessages[field.name];
  return isValid;
}

quoteForm.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('blur', () => showFieldError(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') showFieldError(field);
  });
  field.addEventListener('change', () => {
    if (field.getAttribute('aria-invalid') === 'true') showFieldError(field);
  });
});

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...quoteForm.querySelectorAll('input, textarea')];
  const isValid = fields.map(showFieldError).every(Boolean);

  if (!isValid) {
    formStatus.textContent = 'Controlla i campi evidenziati e riprova.';
    fields.find((field) => !field.validity.valid)?.focus();
    return;
  }

  const data = new FormData(quoteForm);
  const phone = String(data.get('phone') || '').trim();
  const text = [
    'Ciao Andrea, vorrei richiedere un preventivo.',
    '',
    `Nome: ${data.get('firstName')} ${data.get('lastName')}`,
    `Email: ${data.get('email')}`,
    phone ? `Telefono: ${phone}` : null,
    '',
    'Informazioni sul progetto:',
    data.get('message')
  ].filter((line) => line !== null).join('\n');

  formStatus.textContent = 'Richiesta pronta: si aprirà WhatsApp per confermare l’invio.';
  window.open(`https://wa.me/393467255004?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
