async function loadFungames() {
  try {
    const response = await fetch('./data/Fungame.json');
    if (!response.ok) throw new Error('Không thể tải dữ liệu FunGame');

    const data = await response.json();
    const container = document.getElementById('artContainer');

    data.forEach(game => {
      const card = document.createElement('div');
      card.className = 'card';

      // Ảnh mặc định nếu image trống
      const imgSrc = game.image?.trim() !== "" ? game.image : './assets/images/default_game.png';

      card.innerHTML = `
        <img src="${imgSrc}" alt="${game.name}">
        <h3>${game.name}</h3>
        <a href="${game.link}" target="_blank">Chơi ngay</a>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    const container = document.getElementById('artContainer');
    container.innerHTML = `<p style="color:red;">Lỗi khi tải FunGame: ${err.message}</p>`;
  }
}

// Gọi khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', loadFungames);
