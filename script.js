document.addEventListener("DOMContentLoaded", function () {
  const baseId = "appkOBvixsfRHT7UM";
  const tableName = "Table 1";
     Authorization: `Bearer ${apiKey}`
  };

  const searchInput = document.getElementById("search");
  const cardContainer = document.getElementById("cardContainer");

async function fetchAllRecords() {
  // Replace this with your actual Airtable shared view link:
  const url = "https://airtable.com/invite/l?inviteId=inv4o14HxMwS3dImc&inviteToken=30be8c3ba04436b892f0ecf7147f9d6f8be2204b1adb55f47ee0a35608bc8b9e&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts?format=json";

  const response = await fetch(url);
  const data = await response.json();

  // The shared view JSON stores records differently than the API:
  const records = data.records.map(r => r.fields);

  return records;
}
  function renderCards(records) {
    cardContainer.innerHTML = "";
    if (records.length === 0) return;

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

  fetchAllRecords()
    .then(allRecords => {
      const validRecords = allRecords.filter(record => record.Status === "Valid");

      searchInput.addEventListener("input", e => {
        const query = e.target.value.toLowerCase().trim();

        if (query === "") {
          cardContainer.innerHTML = "";
          return;
        }

        const filtered = validRecords.filter(record =>
          Object.values(record).some(val =>
            typeof val === "string" && val.toLowerCase().includes(query)
          )
        );

        renderCards(filtered);
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
});
