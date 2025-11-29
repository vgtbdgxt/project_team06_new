// js/ui.js

const noSelectionHint = document.getElementById('no-selection-hint');
const clinicDetails = document.getElementById('clinic-details');
const clinicNameEl = document.getElementById('clinic-name');
const clinicMetaEl = document.getElementById('clinic-meta');
const clinicContactEl = document.getElementById('clinic-contact');
const clinicHoursEl = document.getElementById('clinic-hours');
const clinicAppointmentEl = document.getElementById('clinic-appointment');
const clinicFocusEl = document.getElementById('clinic-focus');
const clinicAccessibilityEl = document.getElementById('clinic-accessibility');
const clinicDistanceEl = document.getElementById('clinic-distance');

export function clearClinicDetails() {
  noSelectionHint.style.display = 'block';
  clinicDetails.style.display = 'none';
}

export function showClinicDetails(clinic, distance) {
  noSelectionHint.style.display = 'none';
  clinicDetails.style.display = 'block';

  clinicNameEl.textContent = clinic.name;
  clinicMetaEl.textContent = `${prettyFocusSummary(clinic.focus)}`;

  clinicContactEl.innerHTML = `
    <div>${clinic.address}</div>
    <div>${clinic.phone}</div>
    <div>${clinic.email}</div>
  `;

  clinicHoursEl.textContent = clinic.hours;
  clinicAppointmentEl.textContent = clinic.appointment;

  clinicFocusEl.innerHTML = clinic.focus.map(f => {
    const label = focusLabel(f);
    return `<span class="pill blue">${label}</span>`;
  }).join(" ");

  const pills = [];

  const costMap = {
    free: "Free / no cost",
    sliding: "Sliding scale",
    insurance: "Insurance-based",
    private: "Private pay"
  };
  if (clinic.costModel) {
    pills.push(`<span class="pill green">${costMap[clinic.costModel] || clinic.costModel}</span>`);
  }

  pills.push(`<span class="pill ${clinic.online ? "blue" : ""}">${clinic.online ? "Online available" : "In-person only"}</span>`);

  pills.push(`<span class="pill ${clinic.acceptsUndiagnosed ? "green" : "red"}">${clinic.acceptsUndiagnosed ? "Accepts undiagnosed/self-referred" : "Diagnosis/referral preferred"}</span>`);

  pills.push(`<span class="pill ${clinic.multilingual ? "blue" : ""}">${clinic.multilingual ? "Multilingual support" : "Primarily English"}</span>`);

  pills.push(`<span class="pill ${clinic.noGuardianRequired ? "green" : "yellow"}">${clinic.noGuardianRequired ? "No guardian required" : "Guardian/family may be required"}</span>`);

  pills.push(`<span class="pill yellow">Typical wait: ${clinic.waitTimeDays} days</span>`);

  clinicAccessibilityEl.innerHTML = pills.join(" ");

  if (distance != null) {
    clinicDistanceEl.textContent =
      `Approx. ${distance.toFixed(1)} km from your location (straight-line distance).`;
  } else {
    clinicDistanceEl.textContent =
      "Distance from your location will appear here once you enable location access.";
  }
}

function focusLabel(f) {
  const map = {
    anxiety: "Anxiety",
    depression: "Depression",
    cbt: "CBT",
    trauma: "Trauma",
    medication: "Medication",
    family: "Family / couples",
    crisis: "Crisis"
  };
  return map[f] || f;
}

function prettyFocusSummary(focusArr) {
  if (!focusArr || focusArr.length === 0) return "No specialty info";
  const labels = focusArr.map(focusLabel);
  return labels.join(", ");
}

// slider label update
const maxDistanceValueEl = document.getElementById('max-distance-value');
export function updateMaxDistanceLabel(v) {
  maxDistanceValueEl.textContent = v;
}
