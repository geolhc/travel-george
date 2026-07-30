document.querySelectorAll('.day button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.day');
    const isOpen = item.classList.contains('active');
    document.querySelectorAll('.day').forEach(day => { day.classList.remove('active'); day.querySelector('button').setAttribute('aria-expanded', 'false'); });
    if (!isOpen) { item.classList.add('active'); button.setAttribute('aria-expanded', 'true'); }
  });
});

const destinationButtons = document.querySelectorAll('[data-destination-target]');
const destinationViews = document.querySelectorAll('[data-destination]');
const cityButtons = document.querySelectorAll('[data-city-target]');
const cityViews = document.querySelectorAll('[data-city]');

function showCity(city) {
  cityViews.forEach(view => {
    const isSelected = view.dataset.city === city;
    view.hidden = !isSelected;
    view.classList.toggle('active', isSelected);
  });
  cityButtons.forEach(button => {
    const isSelected = button.dataset.cityTarget === city;
    button.classList.toggle('active', isSelected);
    button.setAttribute('aria-selected', String(isSelected));
  });
}

function showDestination(destination) {
  destinationViews.forEach(view => {
    const isSelected = view.dataset.destination === destination;
    view.hidden = !isSelected;
    view.classList.toggle('active', isSelected);
  });
  destinationButtons.forEach(button => {
    const isSelected = button.dataset.destinationTarget === destination;
    button.classList.toggle('active', isSelected);
    if (button.matches('[role="tab"]')) button.setAttribute('aria-selected', String(isSelected));
  });
  if (destination === 'japan') showCity('tokyo');
}

destinationButtons.forEach(button => {
  button.addEventListener('click', event => {
    const destination = button.dataset.destinationTarget;
    showDestination(destination);
    if (button.matches('[role="tab"]')) event.preventDefault();
  });
});

cityButtons.forEach(button => {
  button.addEventListener('click', () => showCity(button.dataset.cityTarget));
});

document.querySelectorAll('[data-checklist-key]').forEach(item => {
  const key = `travel-hub-${item.dataset.checklistKey}`;
  item.checked = localStorage.getItem(key) === 'true';
  item.addEventListener('change', () => localStorage.setItem(key, String(item.checked)));
});
