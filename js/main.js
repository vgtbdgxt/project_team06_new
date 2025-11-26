// js/main.js

import { CLINICS } from './data.js';
import { initMap, setUserLocation, getUserLocation, setFilterFn } from './map.js';
import { showClinicDetails, clearClinicDetails, updateMaxDistanceLabel } from './ui.js';

// DOM refs
const locateMeBtn = document.getElementById('locate-me-btn');
const maxDistanceInput = document.getElementById('max-distance');
const typeCheckboxes = document.querySelectorAll('.filter-type');
const focusCheckboxes = document.querySelectorAll('.filter-focus');
const filterAcceptsUndiagnosed = document.getElementById('filter-accepts-undiagnosed');
const filterOnline = document.getElementById('filter-online');
const filterMultilingual = document.getElementById('filter-multilingual');
const filterNoGuardian = document.getElementById('filter-no-guardian');

// 初始化地图
initMap(CLINICS, (clinic, distance) => {
  showClinicDetails(clinic, distance ?? null);
});

// 自动尝试一次定位
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserLocation(pos.coords.latitude, pos.coords.longitude, true);
    },
    () => {
      // ignore; user denied or error
    }
  );
}

// Locate Me 按钮
locateMeBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserLocation(pos.coords.latitude, pos.coords.longitude, true);
    },
    (err) => {
      console.warn("Geolocation error:", err);
      alert("Could not determine your location.");
    }
  );
});

// 构造筛选函数
function buildFilterFn() {
  const maxDist = parseFloat(maxDistanceInput.value);
  const activeTypes = [];
  typeCheckboxes.forEach(cb => {
    if (cb.checked) activeTypes.push(cb.value);
  });

  const activeFocus = [];
  focusCheckboxes.forEach(cb => {
    if (cb.checked) activeFocus.push(cb.value);
  });

  const requireUndiagnosed = filterAcceptsUndiagnosed.checked;
  const requireOnline = filterOnline.checked;
  const requireMultilingual = filterMultilingual.checked;
  const requireNoGuardian = filterNoGuardian.checked;

  return function filterClinic(clinic, distance) {
    const userLoc = getUserLocation();

    if (userLoc && distance != null && distance > maxDist) {
      return false;
    }

    if (activeTypes.length > 0 && !activeTypes.includes(clinic.type)) {
      return false;
    }

    if (activeFocus.length > 0) {
      const hasAny = activeFocus.some(f => clinic.focus.includes(f));
      if (!hasAny) return false;
    }

    if (requireUndiagnosed && !clinic.acceptsUndiagnosed) return false;
    if (requireOnline && !clinic.online) return false;
    if (requireMultilingual && !clinic.multilingual) return false;
    if (requireNoGuardian && !clinic.noGuardianRequired) return false;

    return true;
  };
}

function applyFilters() {
  updateMaxDistanceLabel(maxDistanceInput.value);
  const fn = buildFilterFn();
  setFilterFn(fn);
}

// 绑定筛选器事件
maxDistanceInput.addEventListener('input', applyFilters);
typeCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
focusCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
filterAcceptsUndiagnosed.addEventListener('change', applyFilters);
filterOnline.addEventListener('change', applyFilters);
filterMultilingual.addEventListener('change', applyFilters);
filterNoGuardian.addEventListener('change', applyFilters);

// 初始状态
applyFilters();
clearClinicDetails();
