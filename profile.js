
function saveProfile() {
  const name = document.getElementById("profileName")?.value.trim() || "";
  const rubika = document.getElementById("profileRubika")?.value.trim() || "";
  const info = document.getElementById("profileInfo")?.value.trim() || "";

  if (!name) {
    notify("لطفاً نام خود را وارد کن.");
    return;
  }

  const profile = {
    name,
    rubika,
    info,
    updatedAt: Date.now()
  };

  if (!saveProfileData(profile)) {
    notify("ذخیره پروفایل انجام نشد.");
    return;
  }

  notify("پروفایل با موفقیت ذخیره شد! ✅");
  loadProfile();
}

function loadProfile() {
  const profile = getProfile();

  const nameInput = document.getElementById("profileName");
  const rubikaInput = document.getElementById("profileRubika");
  const infoInput = document.getElementById("profileInfo");

  if (nameInput) nameInput.value = profile.name || "";
  if (rubikaInput) rubikaInput.value = profile.rubika || "";
  if (infoInput) infoInput.value = profile.info || "";
}

function showProfile() {
  const profile = getProfile();

  const name = escapeHTML(profile.name || "کاربر زنتورا");
  const rubika = escapeHTML(profile.rubika || "ثبت نشده");
  const info = escapeHTML(profile.info || "توضیحاتی ثبت نشده است.");

  notify(
    `نام: ${name} | روبیکا: ${rubika} | درباره من: ${info}`
  );
}

document.addEventListener("DOMContentLoaded", loadProfile);
