document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "keyh12f4j0FAZl15E";
  const baseId = "appkOBvixsfRHT7UM";
  const tableName = "Table 1";
  const url = `https://api.airtable.com/v0/${baseid}/${tableName}?pageSize=100`;

  const headers = {
    Authorization: `Bearer ${apiKey}`
  };

  fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
      const allRecords = data.records.map(record => record.fields);

      // Filter only those with Status = "Valid"
      const validRecords = allRecords.filter(record => record.Status === "Valid");

      const cardContainer = document.getElementById("cardContainer");
      const searchInput = document.getElementById("search");

      function renderCards(records) {
        cardContainer.innerHTML = "";
        if (records.length === 0) return;

        records.forEach(record => {
          const card = document.createElement("div");
          card.className = "cert-card";
          card.innerHTML = `
            <h3>${record.Name || "No Name"}</h3>
            <p><strong>Certification:</strong> ${record.Certification || "N/A"}</p>
            <p><strong>Status:</strong> ${record.Status || "N/A"}</p>
            <p><strong>In House Instructor:</strong> ${record["In House Instructor"] || "N/A"}</p>
            <p><strong>ID:</strong> ${record.ID || "N/A"}</p>
          `;
          cardContainer.appendChild(card);
        });
      }

      renderCards(validRecords);

      searchInput.addEventListener("input", e => {
        const query = e.target.value.toLowerCase();
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
