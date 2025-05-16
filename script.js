
    let topFilters;
    let tagCheckboxes = {};
    let profiles = [];
    let cardContainer;
  
    function createProfileCard(profile) {
      const card = document.createElement('div');
      card.className = 'profile-card';
      card.innerHTML = `
        <img src="${profile.image}" alt="Ảnh ${profile.name}">
        <div class="info">
          <div><strong>Tên:</strong> ${profile.name}</div>
          <div><strong>Giới tính:</strong> ${profile.gender}</div>
          <div><strong>Xu hướng tính dục:</strong> ${profile.xu_huong_tinh_duc}</div>
          <div><strong>Dáng người:</strong> ${(Array.isArray(profile.model) ? profile.model.join(', ') : profile.model)}</div>
          <div><strong>Bối cảnh:</strong> ${(Array.isArray(profile.worlbuild) ? profile.worlbuild.join(', ') : profile.worlbuild)}</div>
          <div><strong>Mô tả:</strong> ${profile.Descipt || ''}</div>
        </div>
      `;
      // Thêm sự kiện click để chuyển hướng
      if (profile.link) {
        card.style.cursor = "pointer";
        card.addEventListener('click', () => {
        window.location.href = profile.link;
        });
      }
      return card;
    }
  
    function filterCards() {
      const activeTags = Array.from(topFilters.querySelectorAll('.filter-btn.active')).map(btn => btn.textContent);
      const keyword = normalizeString(searchInput.value.trim());
      cardContainer.innerHTML = '';

      const filteredProfiles = profiles.filter(profile => {
        const profileTags = [
        ...(profile.tags || []),
        profile.gender,
        profile.role,
        profile.au,
        profile.ban_dang_gioi,
        ...(Array.isArray(profile.model) ? profile.model : [profile.model]),
        profile.xu_huong_tinh_duc,
        ...(Array.isArray(profile.worlbuild) ? profile.worlbuild : [profile.worlbuild]),
      ].filter(Boolean);


        // Gộp tất cả các thông tin dạng text vào một chuỗi lớn để tìm kiếm
        const searchableText = normalizeString([
          profile.name,
          profile.Descipt,
          profile.note,
          profile.extraDesc,
          profile.model,
          profile.role,
          profile.gender,
          profile.worlbuild
        ].filter(Boolean).join(' '));

        const matchSearch = keyword === '' || searchableText.includes(keyword);

        // Nếu không chọn tag nào thì bỏ qua bước lọc tag
        const matchTags = activeTags.length === 0 || activeTags.every(tag => profileTags.includes(tag));

        return matchSearch && matchTags;
      });

      if (filteredProfiles.length === 0) {
        cardContainer.innerHTML = '<p>Không tìm thấy kết quả phù hợp.</p>';
      } else {
        filteredProfiles.forEach(profile => {
          cardContainer.appendChild(createProfileCard(profile));
        });
      }
    }

    // Chuẩn hóa chuỗi: bỏ dấu và đưa về chữ thường
    function normalizeString(str) {
      return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
        .replace(/[^\w\s]/g, '')         // Bỏ ký tự đặc biệt
        .trim();
    }
      
    
  
    async function loadData() {
      try {
        const [profilesRes, tagsRes] = await Promise.all([
          fetch('./data/profiles.json'),
          fetch('./data/tags.json')
        ]);
  
        if (!profilesRes.ok || !tagsRes.ok) throw new Error('Không thể tải dữ liệu JSON');
  
        profiles = await profilesRes.json();
        const tags = await tagsRes.json();
  
        if (!tags || typeof tags !== 'object') throw new Error('tags.json không hợp lệ');
  
        topFilters = document.querySelector('.top-filters');
        const tagFormContent = document.getElementById('tagFormContent');
        cardContainer = document.querySelector('.card-container');
  
        // Xử lý modal
        document.getElementById('openTagSelector').addEventListener('click', () => {
          document.getElementById('tagSelectorModal').style.display = 'block';
        });
  
        document.getElementById('closeTagSelector').addEventListener('click', () => {
          document.getElementById('tagSelectorModal').style.display = 'none';
        });
  
        const addFilterButtons = (tagsList, container) => {
          tagsList.forEach(tag => {
            const btn = document.createElement('div');
            btn.className = 'filter-btn';
            btn.textContent = tag;
            btn.onclick = () => {
              btn.classList.toggle('active');
              filterCards();
            };
            container.appendChild(btn);
          });
        };
  
        const createTagGroup = (title, tagList) => {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = `<h4>${title}</h4>`;
          tagList.forEach(tag => {
            const label = document.createElement('label');
            label.style.display = 'inline-block';
            label.style.margin = '0.2rem';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = tag;
            tagCheckboxes[tag] = checkbox;
            label.appendChild(checkbox);
            label.append(` ${tag}`);
            wrapper.appendChild(label);
          });
          tagFormContent.appendChild(wrapper);
        };
  
        // Tạo checkbox nhóm
        createTagGroup('AU', tags['au'] || []);
        createTagGroup('Giới tính', tags['gioi_tinh'] || []);
        createTagGroup('Xu hướng tính dục', tags['xu_huong_tinh_duc'] || []);
        createTagGroup('Bản dạng giới', tags['ban_dang_gioi'] || []);
        createTagGroup('Model', tags['model'] || []);
        createTagGroup('Worlbuild', tags['worlbuild'] || []);

  
        // Tạo filter button
        ['au', 'gioi_tinh', 'xu_huong_tinh_duc', 'ban_dang_gioi', 'model', 'worlbuild'].forEach(key => {
          addFilterButtons(tags[key] || [], topFilters);
        });


  
        // Render lần đầu
        filterCards();
  
      } catch (error) {
        console.error(error);
        alert('Có lỗi khi tải dữ liệu.');
      }
    }
  
    document.getElementById('applyTagsBtn').addEventListener('click', () => {
      topFilters.innerHTML = '';
      const selectedTags = [];
  
      for (const tag in tagCheckboxes) {
        if (tagCheckboxes[tag].checked) {
          selectedTags.push(tag);
  
          const btn = document.createElement('div');
          btn.className = 'filter-btn active';
          btn.textContent = tag;
          btn.onclick = () => {
            btn.remove();
            tagCheckboxes[tag].checked = false;
            filterCards();
          };
          topFilters.appendChild(btn);
        }
      }
  
      topFilters.style.display = selectedTags.length > 0 ? 'flex' : 'none';
      filterCards();
      document.getElementById('tagSelectorModal').style.display = 'none';

      
    });

    document.getElementById('searchInput').addEventListener('input', () => {
      filterCards();
    });

  
    window.onload = loadData;
