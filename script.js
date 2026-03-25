document.addEventListener("DOMContentLoaded", () => {
  const DATA_URL = "https://airtable.com/shrXWlYbXxR05lzGq?format=json";

  const searchInput = document.getElementById("search");
  const cardContainer = document.getElementById("cardContainer");

  async function fetchRecords() {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    return data.records.map(r => r.fields);
  }

  function renderCards(records) {
    cardContainer.innerHTML = "";
    if (!records.length) return;

    records.forEach(record => {
      const card = document.createElement("div");
      card.className = "cert-card";

      card.innerHTML = `
        <h3>${record.Name || "No Name"}</h3>
        <p><strong>Business:</strong> ${record.Business || "N/A"}</p>
        <p><strong>Certification:</strong> ${record.Certification || "N/A"}</p>
        <p><strong>Status:</strong> ${record.Status || "N/A"}</p>
        <p><strong>In House Instructor:</strong> ${record["In House Instructor"] || "N/A"}</p>
        <p><strong>ID:</strong> ${record.ID || "N/A"}</p>
      `;

      cardContainer.appendChild(card);
    });
  }

  fetchRecords()
    .then(records => {
      searchInput.addEventListener("input", e => {
        const query = e.target.value.toLowerCase().trim();

        if (!query) {
          cardContainer.innerHTML = "";
          return;
        }

        const filtered = records.filter(record =>
          Object.values(record).some(
            val => typeof val === "string" && val.toLowerCase().includes(query)
          )
        );

        renderCards(filtered);
      });
    })
    .catch(err => {
      console.error("Lookup error:", err);
    });
});
``
