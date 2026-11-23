
function submitReview(event) {
  event.preventDefault();

  const name = document.getElementById("reviewName")?.value.trim() || "";
  const rating = Number(document.getElementById("reviewRating")?.value);
  const message = document.getElementById("reviewText")?.value.trim() || "";

  if (!name || !message) {
    notify("لطفاً نام و متن نظر را وارد کن.");
    return;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    notify("امتیاز باید بین ۱ تا ۵ باشد.");
    return;
  }

  const reviews = getReviews();

  reviews.unshift({
    id: crypto.randomUUID(),
    name,
    rating,
    message,
    date: new Date().toLocaleDateString("fa-IR")
  });

  if (!saveReviews(reviews)) {
    notify("ذخیره نظر انجام نشد.");
    return;
  }

  document.getElementById("reviewForm")?.reset();

  notify("نظر شما ثبت شد! ⭐");
  renderReviews();
}

function renderReviews() {
  const container = document.getElementById("reviewsList");
  const count = document.getElementById("reviewCount");
  const reviews = getReviews();

  if (count) count.textContent = reviews.length;
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = "<p>هنوز نظری ثبت نشده است.</p>";
    return;
  }

  container.innerHTML = reviews.map(review => `
    <div class="content-box">
      <h3>${escapeHTML(review.name)}</h3>
      <p>${"⭐".repeat(review.rating)}</p>
      <p>${escapeHTML(review.message)}</p>
      <small>${escapeHTML(review.date || "")}</small>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reviewForm");

  if (form) {
    form.addEventListener("submit", submitReview);
  }

  renderReviews();
});
