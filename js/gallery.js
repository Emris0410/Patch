let allArts = [];
let activeTags = [];
let artContainer;
let tagFilterBox;
let tagFormContent;
let searchInput;

function normalizeString(str) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
}

function createArtCard(art) {
  const card = document.createElement('div');
  card.className = 'art-card';
  card.innerHTML = `
    <a href="${art.image}" target="_blank">
      <img src="${art.image}" alt="${art.name}">
    </a>
    <div class="art-info">
      <div class="art-name"><strong>${art.name}</strong></div>
      <div class="art-tags">${art.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
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

// Tạo checkbox tag couple
function setupTagFilters(tagsData) {
  tagFormContent.innerHTML = '';
  const coupleTags = tagsData.couple || [];
  
  coupleTags.forEach(tag => {
    const label = document.createElement('label');
    label.style.display = 'inline-block';
    label.style.margin = '0.3rem';
    label.innerHTML = `
      <input type="checkbox" value="${tag}"> ${tag}
    `;
    tagFormContent.appendChild(label);
  });
}

function applySelectedTags() {
  activeTags = Array.from(tagFormContent.querySelectorAll('input[type=checkbox]:checked'))
    .map(cb => cb.value);
  filterAndRender();
  tagFilterBox.style.display = 'none';
}

// Modal mở full-size ảnh
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

  closeBtn.onclick = () => { modal.style.display = "none"; };
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
}

// Tải dữ liệu
async function loadArtData() {
  try {
    const [artRes, tagsRes] = await Promise.all([
      fetch('./data/cardart.json'),
      fetch('./data/tags.json')
    ]);

    if (!artRes.ok || !tagsRes.ok) throw new Error('Không thể tải dữ liệu');

    allArts = await artRes.json();
    const tagsData = await tagsRes.json();

    artContainer = document.getElementById('artContainer');
    tagFilterBox = document.getElementById('tagFilterBox');
    tagFormContent = document.getElementById('tagFormContent');
    searchInput = document.getElementById('searchInput');

    setupTagFilters(tagsData);
    filterAndRender();

    setupImageModal();

    // Sự kiện mở/đóng popup
    document.getElementById('openTagSelector').addEventListener('click', () => {
      tagFilterBox.style.display = 'block';
    });
    document.getElementById('closeTagSelector').addEventListener('click', () => {
      tagFilterBox.style.display = 'none';
    });

    // Nút áp dụng
    document.getElementById('applyTagsBtn').addEventListener('click', applySelectedTags);
  } catch (err) {
    console.error(err);
    alert('Có lỗi khi tải dữ liệu.');
  }
}

// Sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  loadArtData();
  document.getElementById('searchInput').addEventListener('input', filterAndRender);
});
