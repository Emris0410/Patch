let allArts = [];
let activeTags = [];
let artContainer;
let tagFilterBox;
let tagFormContent;
let searchInput;

// Hàm normalize chuỗi (không dấu)
function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .replace(/[^\w\s]/g, '')       // xóa ký tự đặc biệt
    .trim();
}

// Tạo card ảnh
function createArtCard(art) {
  const card = document.createElement('div');
  card.className = 'art-card';
  card.innerHTML = `
    <a href="${art.image}" target="_blank">
      <img src="${art.image}" alt="${art.name}">
    </a>
    <div class="art-info">
      <div class="art-name"><strong>${art.name}</strong></div>
      <div class="art-author">Tác giả: ${art.author || 'Chưa rõ'}</div>
      <div class="art-tags">${art.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
    </div>
  `;
  return card;
}

// Lọc và render danh sách
function filterAndRender() {
  const keyword = normalizeString(searchInput.value);
  artContainer.innerHTML = '';

  const filtered = allArts.filter(art => {
    const nameMatch = normalizeString(art.name).includes(keyword);
    const tagMatch = activeTags.length === 0 || activeTags.some(tag => art.tags.includes(tag));
    return nameMatch && tagMatch;
  });

  if (filtered.length === 0) {
    artContainer.innerHTML = '<p>Không tìm thấy kết quả phù hợp.</p>';
  } else {
    filtered.forEach(art => artContainer.appendChild(createArtCard(art)));
  }
}


// Tạo checkbox lọc tags
// Tạo checkbox lọc tags
function setupTagFilters(tagsData) {
  tagFormContent.innerHTML = '';
  const coupleTags = tagsData.couple || [];

  // Thêm CSS flex-wrap cho container tag
  tagFormContent.style.display = 'flex';
  tagFormContent.style.flexWrap = 'wrap';
  tagFormContent.style.gap = '0.5rem';

  coupleTags.forEach(tag => {
    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.padding = '0.2rem 0.5rem';
    label.style.borderRadius = '8px';
    label.style.background = 'var(--bg-btn)';
    label.style.border = '1px solid var(--common-border)';
    label.innerHTML = `
      <input type="checkbox" value="${tag}" style="margin-right:0.3rem;"> ${tag}
    `;
    tagFormContent.appendChild(label);
  });
}


// Lưu các tag được chọn và lọc
function applySelectedTags() {
  activeTags = Array.from(
    tagFormContent.querySelectorAll('input[type=checkbox]:checked')
  ).map(cb => cb.value);
  filterAndRender();
  tagFilterBox.style.display = 'none';
}

// Modal full-size ảnh
function setupImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = modal.querySelector('.close');

  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.art-card img')) {
      modal.style.display = "block";
      modalImg.src = e.target.closest('img').src;
    }
  });

  closeBtn.onclick = () => modal.style.display = "none";
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
}

// Load dữ liệu
async function loadArtData() {
  try {
    const [artRes, tagsRes] = await Promise.all([
      fetch('./data/cardart.json'),
      fetch('./data/tags.json')
    ]);
    if (!artRes.ok || !tagsRes.ok) throw new Error('Lỗi tải JSON');

    allArts = await artRes.json();
    const tagsData = await tagsRes.json();

    setupTagFilters(tagsData); // setup checkbox
    filterAndRender();
  } catch (err) {
    console.error(err);
    alert('Có lỗi khi tải dữ liệu.');
  }
}

// ——— Chạy khi DOM tải xong ———
document.addEventListener('DOMContentLoaded', () => {
  // Gán các phần tử
  artContainer = document.getElementById('artContainer');
  tagFilterBox = document.getElementById('tagFilterBox');
  tagFormContent = document.getElementById('tagFormContent');
  searchInput = document.getElementById('searchInput');


  document.getElementById('openTagSelector')
    .addEventListener('click', () => tagFilterBox.style.display = 'block');

  document.getElementById('closeTagSelector')
    .addEventListener('click', () => tagFilterBox.style.display = 'none');

  document.getElementById('applyTagsBtn')
    .addEventListener('click', applySelectedTags);


  searchInput.addEventListener('input', filterAndRender);


  setupImageModal();

  loadArtData();
});
