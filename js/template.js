let characters = JSON.parse(localStorage.getItem("characters")) || [];

const artContainer = document.getElementById("artContainer");
const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("formModal");
const closeModal = document.getElementById("closeModal");
const characterForm = document.getElementById("characterForm");
const photoInput = document.getElementById("photoInput");

// Render card theo CSS chuẩn
function renderCharacters() {
  artContainer.innerHTML = "";
  characters.forEach((char) => {
    const card = document.createElement("div");
    card.classList.add("sheet");
    card.innerHTML = `
      <div class="top-section">
        <div class="photo-box">
          ${char.photo ? `<img src="${char.photo}" alt="photo">` : "PHOTO"}
        </div>
        <img class="stamp" src="https://uploads.onecompiler.io/43hkzer56/43wxgqkvc/image-removebg-preview.png" alt="Stamp">
        <div class="info-fields">
          <div class="field"><span class="field-label">NAME:</span> ${char.name}</div>
          <div class="field"><span class="field-label">AGE:</span> ${char.age}</div>
          <div class="field"><span class="field-label">BIRTHPLACE:</span> ${char.birthplace}</div>
          <div class="field"><span class="field-label">CURRENT RESIDENCE:</span> ${char.residence}</div>
          <div class="two-cols">
            <div class="field"><span class="field-label">HAIR COLOUR:</span> ${char.hair}</div>
            <div class="field"><span class="field-label">EYE COLOUR:</span> ${char.eye}</div>
          </div>
        </div>
      </div>

      <div class="middle-section">
        <div class="left-col">
          <div class="field"><span class="field-label">HEIGHT:</span> ${char.height}</div>
          <div class="field"><span class="field-label">WEIGHT:</span> ${char.weight}</div>
          <div class="field"><span class="field-label">SIGNATURE:</span> ${char.signature}</div>
        </div>
        <div class="right-col">
          <div class="skills-big">
            <span class="field-label">SKILLS/ABILITIES:</span> ${char.skills}
          </div>
        </div>
      </div>

      <div class="big-field">
        <span class="field-label">BIOGRAPHY:</span> ${char.bio}
      </div>

      <div class="notes">
        <span class="field-label">NOTES:</span> ${char.notes}
      </div>
    `;
    artContainer.appendChild(card);
  });
}

// Modal
addBtn.onclick = () => modal.style.display = "block";
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

// Form submit
characterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const reader = new FileReader();
  reader.onload = function(event) {
    const newChar = {
      photo: event.target.result,
      name: document.getElementById("nameInput").value,
      age: document.getElementById("ageInput").value,
      birthplace: document.getElementById("birthplaceInput").value,
      residence: document.getElementById("residenceInput").value,
      hair: document.getElementById("hairInput").value,
      eye: document.getElementById("eyeInput").value,
      height: document.getElementById("heightInput").value,
      weight: document.getElementById("weightInput").value,
      signature: document.getElementById("signatureInput").value,
      skills: document.getElementById("skillsInput").value,
      bio: document.getElementById("bioInput").value,
      notes: document.getElementById("notesInput").value,
    };

    characters.push(newChar);
    localStorage.setItem("characters", JSON.stringify(characters));
    renderCharacters();
    modal.style.display = "none";
    characterForm.reset();
  };

  if (photoInput.files[0]) {
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    // Không có ảnh thì vẫn lưu
    const newChar = {
      photo: "",
      name: document.getElementById("nameInput").value,
      age: document.getElementById("ageInput").value,
      birthplace: document.getElementById("birthplaceInput").value,
      residence: document.getElementById("residenceInput").value,
      hair: document.getElementById("hairInput").value,
      eye: document.getElementById("eyeInput").value,
      height: document.getElementById("heightInput").value,
      weight: document.getElementById("weightInput").value,
      signature: document.getElementById("signatureInput").value,
      skills: document.getElementById("skillsInput").value,
      bio: document.getElementById("bioInput").value,
      notes: document.getElementById("notesInput").value,
    };
    characters.push(newChar);
    localStorage.setItem("characters", JSON.stringify(characters));
    renderCharacters();
    modal.style.display = "none";
    characterForm.reset();
  }
});

renderCharacters();
