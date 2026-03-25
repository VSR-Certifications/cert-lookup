document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "patjaXxpB8K1RxXq1.ebaec54e36bbcc44dccaca9a2fae1279b43a359d4156b7cf9e4c5e3b4ca52750";
  const baseId = "appkOBvixsfRHT7UM";
  const tableName = "Table 1";
  const headers = {
    Authorization: `Bearer ${apiKey}`
  };

  const searchInput = document.getElementById("search");
  const cardContainer = document.getElementById("cardContainer");

  async function fetchAllRecords() {
    let allRecords = [];
    let offset = "";
    let url;

    do {
      url = `https://api.airtable.com/v0/${baseId}/${tableName}?pageSize=100${offset ? `&offset=${offset}` : ""}`;
      const response = await fetch(url, { headers });
      const data = await response.json();
      const records = data.records.map(record => record.fields);
      allRecords = allRecords.concat(records);
      offset = data.offset;
    } while (offset);

    return allRecords;
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
