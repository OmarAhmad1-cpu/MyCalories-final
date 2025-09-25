// Theme toggle logic
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-toggle-icon');
  function setTheme(mode) {
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
    localStorage.setItem('theme', mode);
  }
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setTheme('dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      if (document.body.classList.contains('dark-mode')) {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    });
  }
});
function calculateCalories(form) {
  const fd = new FormData(form);
  const weight = parseFloat(fd.get('weight')) || 0;
  const height = parseFloat(fd.get('height')) || 0;
  const age = parseFloat(fd.get('age')) || 0;
  const gender = fd.get('gender') || 'male';
  const activity = parseFloat(fd.get('activity')) || 1.2;
  const wantTo = parseFloat(fd.get('wantTo')) || 1;

  const resultsContainer = document.getElementById('results');
  resultsContainer.textContent = '';
  resultsContainer.style.display = 'none';

  if (weight <= 0 || height <= 0 || age <= 0) {
    const error = document.createElement('div');
    error.className = 'alert alert-danger';
    error.textContent = 'Please enter valid weight, height and age.';
    resultsContainer.appendChild(error);
    resultsContainer.style.display = 'block';
    return false;
  }

  // BMR & TDEE
  const BMR = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
  let calories = Math.round(BMR * activity);
  if(wantTo === 2){
    calories = calories+500;
  }
  else if(wantTo === 3)
  {
    calories = calories - 500;
  }

  // BMI
  const bmi = weight / ((height / 100) * (height / 100));
  const bmiRounded = bmi.toFixed(1);
  let bmiCategory = '';
  if (bmi < 18.5) { bmiCategory = 'Underweight';  }
  else if (bmi < 25) { bmiCategory = 'Normal';  }
  else if (bmi < 30) { bmiCategory = 'Overweight'; }
  else { bmiCategory = 'Obesity'; }

  // Macros
  const protein = ((calories*0.25)/4).toFixed(1);
  const carbs = ((calories*0.5)/4).toFixed(1);
  const fats = ((calories*0.25)/9).toFixed(1);

  // Build results dynamically
  const title = document.createElement('h4');
  title.textContent = 'Your Results';
  title.style.textAlign = 'center';
  resultsContainer.appendChild(title);

  //Water
  const water =  ((weight * (gender === 'male' ? 35 : 30))+ (activity === 1.55 ? 250 : activity === 1.725 ? 500 : activity === 1.9 ? 750 : 0)) /1000
  //sleep
  const sleep = getRecommendedSleep(age);

  const items = [
    { label: 'BMI', value: `${bmiRounded} (${bmiCategory})` },
    { label: 'Daily Calories', value: `${calories} kcal/day` },
    { label: 'Protein', value: `${protein} g/day` },
    { label: 'Carbohydrates', value: `${carbs} g/day` },
    { label: 'Fats', value: `${fats} g/day` },
    { label: 'Water', value: `${water} liter/day` },
    { label: 'recommended sleep hours', value: `${getRecommendedSleep(age)}` },
  ];

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item d-flex justify-content-between';
    const label = document.createElement('span');
    label.textContent = item.label;
    const value = document.createElement('span');
    value.textContent = item.value;
    div.appendChild(label);
    div.appendChild(value);
    resultsContainer.appendChild(div);
  });

  const note = document.createElement('div');
  note.textContent = '*Results are estimates. Adjust according to your goals.';
  note.style.fontSize = '0.9rem';
  note.className = 'text-muted mt-2';
  resultsContainer.appendChild(note);

  resultsContainer.style.display = 'block';
  resultsContainer.scrollIntoView({ behavior: 'smooth' });

  return false; // prevent actual form submission
}


function getRecommendedSleep(age) {
  let sleepHours;

  // حساب عدد ساعات النوم بناءً على العمر
  if (age >= 0 && age <= 3) {
    sleepHours = {min: 14, max: 17};
  } else if (age >= 4 && age <= 11) {
    sleepHours = {min: 12, max: 15};
  } else if (age >= 1 && age <= 2) {
    sleepHours = {min: 11, max: 14};
  } else if (age >= 3 && age <= 5) {
    sleepHours = {min: 10, max: 13};
  } else if (age >= 6 && age <= 13) {
    sleepHours = {min: 9, max: 11};
  } else if (age >= 14 && age <= 17) {
    sleepHours = {min: 8, max: 10};
  } else if (age >= 18 && age <= 64) {
    sleepHours = {min: 7, max: 9};
  } else if (age >= 65) {
    sleepHours = {min: 7, max: 8};
  } else {
    return "Invalid age";
  }

  // إرجاع عدد ساعات النوم المثالي
  return `${sleepHours.min} to ${sleepHours.max} hours`;
}

