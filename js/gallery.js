const galleryContainer = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const tagFilterContainer = document.getElementById("tagFilters");

let allCards = [];
let activeTag = null;

async function loadData() {
  const [cardsRes, tagsRes] = await Promise.all([
    fetch("cardart.json"),
    fetch("tags.json")
  ]);

  allCards = await cardsRes.json();
  const tags = await tagsRes.json();

  renderTags(tags);
  renderCards(allCards);
}

function renderTags(tags) {
  tagFilterContainer.innerHTML = "";
  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "tag-btn";
    btn.innerText = tag;
    btn.onclick = () => {
      if (activeTag === tag) {
        activeTag = null;
        btn.classList.remove("active");
      } else {
        activeTag = tag;
        document.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      }
      filterAndRender();
    };
    tagFilterContainer.appendChild(btn);
  });
}

function renderCards(cards) {
  galleryContainer.innerHTML = "";
  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "image-card";

    div.innerHTML = `
      <img src="${card.image}" alt="${card.name}">
      <div class="image-info">
        <div class="image-name">${card.name}</div>
        <div class="image-tags">
          ${card.tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
      </div>
    `;

    galleryContainer.appendChild(div);
  });
}

function filterAndRender() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = allCards.filter(card => {
    const matchName = card.name.toLowerCase().includes(keyword);
    const matchTag = !activeTag || card.tags.includes(activeTag);
    return matchName && matchTag;
  });

  renderCards(filtered);
}

searchInput.addEventListener("input", filterAndRender);

// Bắt đầu tải dữ liệu khi trang sẵn sàng
window.onload = loadData;
