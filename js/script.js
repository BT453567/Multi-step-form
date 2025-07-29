const steps = document.querySelectorAll('.form-content__wrapper');
const stepIndicator = document.querySelectorAll('.aside__step-number');
const nextButtons = document.querySelectorAll('.button--next');
const prevButtons = document.querySelectorAll('.button--back');

let currentStep = 1;

// step1 fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

// billing toggle
const billingToggle = document.getElementById('billingToggle');
const monthlyLabel = document.querySelector('.monthly-label');
const yearlyLabel = document.querySelector('.yearly-label');

// plan select
const planCards = document.querySelectorAll('.plan-card');

// summary
const summaryPlan = document.getElementById("summary-plan");
const summaryAddons = document.getElementById("summary-addons");
const summaryTotal = document.getElementById("summary-total");

const pricing = {
  monthly: {
    arcade: '$9/mo',
    advanced: '$12/mo',
    pro: '$15/mo',
  },
  yearly: {
    arcade: '$90/yr',
    advanced: '$120/yr',
    pro: '$150/yr',
  }
};

const addonPricing = {
  monthly: {
    onlineService: '$1/mo',
    largerStorage: '$2/mo',
    customizableProfile: '$2/mo',
  },
  yearly: {
    onlineService: '$10/yr',
    largerStorage: '$20/yr',
    customizableProfile: '$20/yr',
  }
};

// adds the class 'active' if condition true, if not 'active' is removed
function showStep(stepNumber) {

  console.log("step number in show step", stepNumber);

  steps.forEach((step, index) => {
    step.classList.toggle('active', index === stepNumber - 1);
  });

  console.log("step number", stepNumber);
  console.log("steps", steps);

  if (stepNumber === 5) return;

  stepIndicator.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === stepNumber - 1);
  });

  if (stepNumber === 3) populateAddonPrices();
  if (stepNumber === 4) populateSummary();
}

nextButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (currentStep < steps.length && checkFields()) {
      currentStep++;
      showStep(currentStep);
    }
  });
});

prevButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });
});

// check if required fields have been completed

function checkFields() {

  switch (currentStep) {
    case 1:

      let isValid = true;

      // Validate Name
      const nameValue = nameInput.value.trim();
      if (nameValue === '') {
        showError(nameInput, 'This field is required');
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(nameValue)) {
        showError(nameInput, 'Please enter a valid name');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      // Validate Email
      const emailValue = emailInput.value.trim();
      if (emailValue === '') {
        showError(emailInput, 'This field is required');
        isValid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(emailValue)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(emailInput);
      }

      // Validate Phone
      const phoneValue = phoneInput.value.trim();
      if (phoneValue === '') {
        showError(phoneInput, 'This field is required');
        isValid = false;
      } else if (!/^\+?\d+$/.test(phoneValue)) {
        showError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
      } else {
        clearError(phoneInput);
      }

      return isValid;

    case 2:
      // Validate that a plan is selected (e.g., radio buttons or some selected card)
      return true;

    case 3:
      // Validate add-ons (optional: maybe no validation needed)
      return true;

    case 4:
      return true;

    default:
      return true;
  }
}

// show and clear errors

function showError(input, message) {
  const errorSpan = input.closest('.form-group').querySelector('.error');
  errorSpan.textContent = message;
  errorSpan.classList.add("active");
  input.classList.add('input-error'); // add red border or styling via CSS
}

function clearError(input) {
  const errorSpan = input.closest('.form-group').querySelector('.error');
  errorSpan.textContent = '';
  errorSpan.classList.remove("active");
  input.classList.remove('input-error');
}

// check if a valid email

function testEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// billing toggle

billingToggle.addEventListener('change', () => {

  const isYearly = billingToggle.checked;

  planCards.forEach(card => {
    const heading = card.querySelector('h3').textContent.toLowerCase();
    const amount = card.querySelector('.plan-amount');
    const freeMonth = card.querySelector('.free-months');

    if (isYearly) {
      monthlyLabel.classList.remove('active');
      yearlyLabel.classList.add('active');
      amount.textContent = pricing.yearly[heading];
      freeMonth.classList.add('active');
    } else {
      yearlyLabel.classList.remove('active');
      monthlyLabel.classList.add('active');
      amount.textContent = pricing.monthly[heading];
      freeMonth.classList.remove('active');
    }
  });
});

// populate addon page prices
function populateAddonPrices() {
  const billingToggleCheckbox = document.getElementById('billingToggle');
  const allAddonPrices = document.querySelectorAll('.addon-card__price');

  const billingTime = billingToggleCheckbox.checked ? 'yearly' : 'monthly';

  allAddonPrices.forEach((addon) => {

    const addonName = addon.dataset.addon;
    
    addon.textContent = addonPricing[billingTime][addonName];

  });
}

// populate summary page
function populateSummary() {

  const selectedPlanInput = document.querySelector('input[name="plan"]:checked');
  const planCard = selectedPlanInput.closest('.plan-card');
  const planName = planCard.querySelector('h3').textContent;
  const planPrice = planCard.querySelector('.plan-amount').textContent;
  const billingToggleCheckbox = document.getElementById('billingToggle');

  var total = 0;

  // update plan summary section
  summaryPlan.innerHTML = `
    <div class="flex space-between">
      <div class="plan__group flex column">
        <strong class="blue-text">${planName} (${billingToggleCheckbox.checked ? 'Yearly' : 'Monthly'})</strong>
        <button type="button" class="button--change">Change</button>
      </div>
      <span class="blue-text font-weight-700">${planPrice}</span>
    </div>
  `;

  // add event listener to change button
  const changeButton = summaryPlan.querySelector('.button--change');
  if (changeButton) {
    changeButton.addEventListener('click', () => {
      currentStep = 2;
      console.log("current step in change button function", currentStep);
      showStep(currentStep);
    });
  }

  total += parseFloat(planPrice.replace(/[^\d.]/g, ''));

  // update addon summary section
  const selectedAddonInputs = document.querySelectorAll('input[name="addon"]:checked');

    var addonHTML = '';

    if (selectedAddonInputs.length !== 0) {

      addonHTML = '<hr class="plan-hr">';
    
      selectedAddonInputs.forEach((addon) => {
        const addonCard = addon.closest('.addon-card');
        const addonName = addonCard.querySelector('h3').textContent;
        const addonCost = addonCard.querySelector('.addon-card__price').textContent;
    
        addonHTML +=
          `<div class="flex space-between">
            <span class="grey-text">${addonName}</span>
            <span class="blue-text">${addonCost}</span>
          </div>
          `;

        total += parseFloat(addonCost.replace(/[^\d.]/g, ''));

      });
    }

    summaryAddons.innerHTML = addonHTML;

    // update total price summary section

    summaryTotal.innerHTML = `
      <div class="flex space-between align-items-center">
        <span class="grey-text">Total (${billingToggleCheckbox.checked ? 'per year' : 'per month'})</span>
        <span class="summary__total">+$${total}/${billingToggleCheckbox.checked ? 'yr' : 'mo'}</span>
      </div>`;
}

// handle form submit
document.addEventListener('submit', handleSubmit);

function handleSubmit(e) {

    e.preventDefault();

    currentStep++;
    showStep(currentStep);
}