
function renderGames() {
  const games = getGames();
  const container = document.getElementById("gamesList");
  const latest = document.getElementById("latestGames");
  const favoritesContainer = document.getElementById("favoritesList");
  const topContainer = document.getElementById("topGames");

  const search = document.getElementById("searchInput")?.value
    .trim().toLowerCase() || "";

  const category = document.getElementById("categoryFilter")?.value || "all";
  const sort = document.getElementById("sortGames")?.value || "newest";

  let filtered = games.filter(game => {
    const matchesSearch =
      (game.name || "").toLowerCase().includes(search) ||
      (game.description || "").toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || game.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "newest") {
    filtered.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "oldest") {
    filtered.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "popular") {
    filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (sort === "cheap") {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  }

  if (container) {
    container.innerHTML = filtered.length
      ? filtered.map(createGameCard).join("")
      : "<p>هنوز بازی‌ای پیدا نشد.</p>";
  }

  if (latest) {
    latest.innerHTML = games
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 4)
      .map(createGameCard)
      .join("") || "<p>هنوز بازی‌ای ثبت نشده است.</p>";
  }

  if (favoritesContainer) {
    const favorites = getFavorites();
    const favoriteGames = games.filter(game =>
      favorites.includes(game.id)
    );

    favoritesContainer.innerHTML = favoriteGames.length
      ? favoriteGames.map(createGameCard).join("")
      : "<p>هنوز بازی‌ای به علاقه‌مندی‌ها اضافه نکرده‌ای.</p>";
  }

  if (topContainer) {
    const popular = games.slice()
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 6);

    topContainer.innerHTML = popular.length
      ? popular.map(createGameCard).join("")
      : "<p>هنوز بازی‌ای ثبت نشده است.</p>";
  }

  updateGameStatistics(games);
}

function createGameCard(game) {
  const icon = escapeHTML(game.icon || "🎮");
  const name = escapeHTML(game.name || "بازی بدون نام");
  const description = escapeHTML(game.description || "بدون توضیحات");
  const currency = escapeHTML(game.currency || "تومان");
  const price = Number(game.price) || 0;

  return `
    <article class="game-card">
      <div style="font-size:55px;text-align:center;padding:12px">
        ${icon}
      </div>

      <h3>${name}</h3>
      <p>${description}</p>
      <p>دسته‌بندی: ${escapeHTML(game.category || "عمومی")}</p>
      <p>قیمت: ${price === 0 ? "رایگان" : price + " " + currency}</p>
      <p>❤️ ${Number(game.likes) || 0}</p>

      <div class="game-tools">
        <button class="primary-btn"
          onclick="openGame('${game.id}')">
          مشاهده بازی
        </button>

        <button class="secondary-btn"
          onclick="toggleFavorite('${game.id}')">
          ⭐ علاقه‌مندی
        </button>
      </div>
    </article>
  `;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function updateGameStatistics(games = getGames()) {
  const gameCount = document.getElementById("gameCount");
  const sellerCount = document.getElementById("sellerCount");
  const likeCount = document.getElementById("likeCount");

  if (gameCount) {
    gameCount.textContent = games.length;
  }

  if (sellerCount) {
    sellerCount.textContent =
      new Set(games.map(game => game.seller).filter(Boolean)).size;
  }

  if (likeCount) {
    likeCount.textContent = games.reduce(
      (total, game) => total + (Number(game.likes) || 0), 0
    );
  }
}

function toggleFavorite(gameId) {
  let favorites = getFavorites();

  if (favorites.includes(gameId)) {
    favorites = favorites.filter(id => id !== gameId);
    notify("از علاقه‌مندی‌ها حذف شد.");
  } else {
    favorites.push(gameId);
    notify("به علاقه‌مندی‌ها اضافه شد ⭐");
  }

  saveFavorites(favorites);
  renderGames();
}

function openGame(gameId) {
  const game = getGames().find(item => item.id === gameId);

  if (!game) {
    notify("بازی پیدا نشد.");
    return;
  }

  addToHistory(gameId);

  const modal = document.getElementById("gameModal");
  const details = document.getElementById("gameDetails");

  if (!modal || !details) return;

  details.innerHTML = `
    <h2>${escapeHTML(game.icon || "🎮")} ${escapeHTML(game.name)}</h2>
    <p>${escapeHTML(game.description || "")}</p>
    <p>سازنده: ${escapeHTML(game.seller || "ناشناس")}</p>
    <p>قیمت: ${Number(game.price) === 0 ? "رایگان" : escapeHTML(game.price) + " " + escapeHTML(game.currency || "تومان")}</p>
    <button class="primary-btn" onclick="visitGame('${game.id}')">
      ورود به بازی
    </button>
  `;

  modal.classList.add("show");
}

function visitGame(gameId) {
  const game = getGames().find(item => item.id === gameId);

  if (!game || !game.link) {
    notify("لینک بازی ثبت نشده است.");
    return;
  }

  if (game.price > 0) {
    notify("این بازی پولی است و باید ابتدا خرید آن بررسی شود.");
    return;
  }

  const url = safeGameURL(game.link);

  if (!url) {
    notify("لینک بازی معتبر نیست.");
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function safeGameURL(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function closeGameModal() {
  document.getElementById("gameModal")?.classList.remove("show");
}

function filterGames() {
  renderGames();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput")?.addEventListener("input", renderGames);
  document.getElementById("categoryFilter")?.addEventListener("change", renderGames);
  document.getElementById("sortGames")?.addEventListener("change", renderGames);

  renderGames();
});
