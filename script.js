const archiveSections = new Set(["japan", "tokyo", "tokyo-trip", "overview", "plan", "notes", "vietnam"]);

if (document.getElementById("hokkaido") && archiveSections.has(location.hash.slice(1))) {
  const archive = new URL("archive.html", location.href);
  archive.hash = location.hash;
  location.replace(archive);
}

const legacyDays = document.querySelectorAll(".day button");
legacyDays.forEach(button => {
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    legacyDays.forEach(dayButton => {
      const shouldOpen = button === dayButton && !isOpen;
      dayButton.closest(".day").classList.toggle("active", shouldOpen);
      dayButton.setAttribute("aria-expanded", String(shouldOpen));
    });
  });
});

const checklist = [...document.querySelectorAll("[data-checklist-key]")];
const progress = document.querySelector("[data-checklist-progress]");

function updateProgress() {
  if (!progress) return;
  const checked = checklist.filter(item => item.checked).length;
  progress.textContent = `${checked} / ${checklist.length} 項完成`;
  progress.hidden = false;
}

checklist.forEach(item => {
  const key = `travel-hub-${item.dataset.checklistKey}`;
  try {
    item.checked = localStorage.getItem(key) === "true";
  } catch {
    // The checklist still works for this visit when storage is unavailable.
  }

  item.addEventListener("change", () => {
    try {
      localStorage.setItem(key, String(item.checked));
    } catch {
      // Keep the current check state so the checklist remains usable.
    }
    updateProgress();
  });
});

updateProgress();
