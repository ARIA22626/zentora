
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (pageId === "admin") renderAdmin();
  if (pageId === "games") renderGames();
  if (pageId === "reviews") renderReviews();
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-theme");
  saveTheme(isLight ? "light" : "dark");
}

function applySavedTheme() {
  if (getTheme() === "light") {
    document.body.classList.add("light-theme");
  }
}

function notify(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(window.zentoraToastTimer);

  window.zentoraToastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function showNotifications() {
  notify("به زنتورا خوش آمدی! 🎮");
}

function setupPublishForm() {
  const form = document.getElementById("publishForm");
  if (!form) return;

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const seller = document.getElementById("creatorName")?.value.trim() || "";
    const rubika = document.getElementById("creatorRubika")?.value.trim() || "";
    const name = document.getElementById("gameName")?.value.trim() || "";
    const category = document.getElementById("gameCategory")?.value || "عمومی";
    const price = Number(document.getElementById("gamePrice")?.value) || 0;
    const currency = document.getElementById("gameCurrency")?.value || "تومان";
    const icon = document.getElementById("gameIcon")?.value.trim() || "🎮";
    const link = document.getElementById("gameLink")?.value.trim() || "";
    const description = document.getElementById("gameDescription")?.value.trim() || "";
    const member = document.getElementById("channelMember")?.checked || false;

    if (!seller || !name || !description || !link) {
      notify("لطفاً اطلاعات ضروری بازی را کامل کن.");
      return;
    }

    if (!member) {
      notify("برای ثبت بازی، ابتدا عضویت کانال را تأیید کن.");
      return;
    }

    if (!safeGameURL(link)) {
      notify("لینک بازی باید با http یا https شروع شود.");
      return;
    }

    if (price < 0 || !Number.isFinite(price)) {
      notify("قیمت واردشده معتبر نیست.");
      return;
    }

    const games = getGames();

    games.unshift({
      id: crypto.randomUUID(),
      seller,
      rubika,
      name,
      category,
      price,
      currency,
      icon,
      link,
      description,
      likes: 0,
      createdAt: Date.now()
    });

    if (!saveGames(games)) {
      notify("ثبت بازی انجام نشد.");
      return;
    }

    form.reset();
    notify("بازی ثبت شد! 🎉");
    renderGames();
    showPage("games");
  });
}

function setupLanguage() {
  const selector = document.getElementById("languageSelect");
  if (!selector) return;

  selector.addEventListener("change", () => {
    const language = selector.value;
    notify("زبان انتخاب‌شده: " + language + "؛ ترجمه کامل در نسخه بعدی اضافه می‌شود.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  setupPublishForm();
  setupLanguage();

  renderGames();
  renderAdmin();
  renderReviews();
  loadProfile();
});
