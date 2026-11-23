
// نکته امنیتی: این پنل فقط یک مدیریت ساده در مرورگر است.
// برای مدیریت واقعی و امن، سرور و ورود مدیر لازم است.

function renderAdmin() {
  const games = getGames();
  const count = document.getElementById("adminGameCount");
  const container = document.getElementById("adminGames");

  if (count) count.textContent = games.length;
  if (!container) return;

  if (games.length === 0) {
    container.innerHTML = "<p>هنوز هیچ بازی‌ای ثبت نشده است.</p>";
    return;
  }

  container.innerHTML = games.map(game => `
    <div class="content-box">
      <h3>${escapeHTML(game.icon || "🎮")} ${escapeHTML(game.name)}</h3>
      <p>سازنده: ${escapeHTML(game.seller || "ناشناس")}</p>
      <p>قیمت: ${Number(game.price) || 0} ${escapeHTML(game.currency || "تومان")}</p>
      <button class="secondary-btn"
        onclick="deleteGame('${game.id}')">
        حذف بازی
      </button>
    </div>
  `).join("");
}

function deleteGame(gameId) {
  const confirmed = confirm("آیا از حذف این بازی مطمئنی؟");
  if (!confirmed) return;

  const games = getGames().filter(game => game.id !== gameId);
  saveGames(games);

  saveFavorites(getFavorites().filter(id => id !== gameId));

  notify("بازی حذف شد.");
  renderAdmin();
  renderGames();
}

function exportSiteData() {
  exportData();
}

function refreshAdmin() {
  renderAdmin();
  renderGames();
}

document.addEventListener("DOMContentLoaded", renderAdmin);
