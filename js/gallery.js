let allArts = [];
let activeTags = [];
let artContainer;
let tagFilterBox;
let searchInput;

function normalizeString(str) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
    .replace(/[^\w\s]/g, '') // bỏ ký tự đặc biệt
    .trim();
}

function createArtCard(art) {
  const card = document.createElement('div');
  card.className = 'art-card';
  card.innerHTML = `
    <img src="${art.image}" alt="${art.name}">
    <div class="art-info">
      <div class="art-name"><strong>${art.name}</strong></div>
      <div class="art-tags">
        ${art.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;
  return card;
}

function filterAndRender() {
  const keyword = normalizeString(searchInput.value);
  artContainer.innerHTML = '';

  const filtered = allArts.filter(art => {
    const nameMatch = normalizeString(art.name).includes(keyword);
    const tagMatch = activeTags.length === 0 || activeTags.every(tag => art.tags.includes(tag));
    return nameMatch && tagMatch;
  });

  if (filtered.length === 0) {
    artContainer.innerHTML = '<p>Không tìm thấy kết quả phù hợp.</p>';
  } else {
    filtered.forEach(art => {
      artContainer.appendChild(createArtCard(art));
    });
  }
}

function setupTagFilters(tags) {
  tagFilterBox.innerHTML = '';
  tags.forEach(tag => {
    const btn = document.createElement('div');
    btn.className = 'filter-btn';
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        activeTags.push(tag);
      } else {
        activeTags = activeTags.filter(t => t !== tag);
      }
      filterAndRender();
    });
    tagFilterBox.appendChild(btn);
  });
}

async function loadArtData() {
  try {
    const [artRes, tagsRes] = await Promise.all([
      fetch('./cardart.json'),
      fetch('./tags.json')
    ]);

    if (!artRes.ok || !tagsRes.ok) throw new Error('Không thể tải dữ liệu');

    allArts = await artRes.json();
    const tags = await tagsRes.json();

    artContainer = document.getElementById('artContainer');
    tagFilterBox = document.getElementById('tagFilterBox');
    searchInput = document.getElementById('searchInput');

    setupTagFilters(tags);
    filterAndRender();
  } catch (err) {
    console.error(err);
    alert('Có lỗi khi tải dữ liệu.');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadArtData();
  document.getElementById('searchInput').addEventListener('input', filterAndRender);
});
