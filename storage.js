
const STORAGE_KEYS = {
  games: "zentora_games",
  favorites: "zentora_favorites",
  profile: "zentora_profile",
  reviews: "zentora_reviews",
  history: "zentora_history",
  theme: "zentora_theme"
};

function getData(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    console.error("خطا در خواندن اطلاعات:", error);
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("خطا در ذخیره اطلاعات:", error);
    return false;
  }
}

function getGames() {
  return getData(STORAGE_KEYS.games, []);
}

function saveGames(games) {
  return saveData(STORAGE_KEYS.games, games);
}

function getFavorites() {
  return getData(STORAGE_KEYS.favorites, []);
}

function saveFavorites(favorites) {
  return saveData(STORAGE_KEYS.favorites, favorites);
}

function getProfile() {
  return getData(STORAGE_KEYS.profile, {
    name: "",
    rubika: "",
    info: ""
  });
}

function saveProfileData(profile) {
  return saveData(STORAGE_KEYS.profile, profile);
}

function getReviews() {
  return getData(STORAGE_KEYS.reviews, []);
}

function saveReviews(reviews) {
  return saveData(STORAGE_KEYS.reviews, reviews);
}

function getHistory() {
  return getData(STORAGE_KEYS.history, []);
}

function addToHistory(gameId) {
  const history = getHistory().filter(id => id !== gameId);
  history.unshift(gameId);
  return saveData(STORAGE_KEYS.history, history.slice(0, 30));
}

function getTheme() {
  return getData(STORAGE_KEYS.theme, "dark");
}

function saveTheme(theme) {
  return saveData(STORAGE_KEYS.theme, theme);
}

function exportData() {
  const backup = {};

  Object.values(STORAGE_KEYS).forEach(key => {
    backup[key] = localStorage.getItem(key);
  });

  const file = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "zentora-backup.json";
  link.click();

  URL.revokeObjectURL(link.href);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    try {
      const backup = JSON.parse(reader.result);

      Object.values(STORAGE_KEYS).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(backup, key)) {
          localStorage.setItem(key, backup[key]);
        }
      });

      alert("اطلاعات با موفقیت بازیابی شد.");
      location.reload();
    } catch (error) {
      alert("فایل پشتیبان معتبر نیست.");
    }
  };

  reader.readAsText(file);
}
