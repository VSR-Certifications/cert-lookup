document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.getElementById("cardContainer");
  const searchInput = document.getElementById("search");

  // Replace with your actual Airtable values
  const AIRTABLE_BASE_ID = "appkOBvixsfRHT7UM";
  const AIRTABLE_TABLE_NAME = "Table 1";
  const AIRTABLE_TOKEN = "patjaXxpB8K1RxXq1.ebaec54e36bbcc44dccaca9a2fae1279b43a359d4156b7cf9e4c5e3b4ca52750";

  async function fetchRecords() {
    let allRecords = [];
    let offset = "";
    do {
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?pageSize=100&offset=${offset}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`
        }
      });
      const data = await response.json();
      allRecords.push(...data.records);
      offset = data.offset || "";
    } while (offset);
    return allRecords;
  }

  function renderCards(data) {
    cardContainer.innerHTML = "";

    if (data.length === 0) {
      // Optionally show a "No results" message when searching but no matches found
      if (searchInput.value.trim() !== "") {
        cardContainer.innerHTML = "<p>No matching certifications found.</p>";
      }
      // If search box empty, show nothing
      return;
    }

    data.forEach(record => {
      const fields = record.fields;
      const card = document.createElement("div");
      card.className = "cert-card";
      card.innerHTML = `
        <h3>${fields.Name || "No Name"}</h3>
        <p><strong>Business:</strong> ${fields.Business || ""}</p>
        <p><strong>Certification:</strong> ${fields.Certification || ""}</p>
        <p><strong>Issue Date:</strong> ${fields.Issue || ""}</p>
        <p><strong>Expiration Date:</strong> ${fields.Expire || ""}</p>
        <p><strong>In House Instructor:</strong> ${fields["In House Instructor"] || ""}</p>
        <p><strong>ID:</strong> ${fields.ID || ""}</p>
      `;
      cardContainer.appendChild(card);
    });
  }

  function filterCards(query, records) {
    query = query.toLowerCase();
    return records.filter(record =>
      Object.values(record.fields).some(val =>
        typeof val === "string" && val.toLowerCase().includes(query)
      )
    );
  }

  fetchRecords().then(records => {
    // Start with no cards shown
    renderCards([]);

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();

      if (query === "") {
        renderCards([]); // Clear cards if input is empty
      } else {
        const filtered = filterCards(query, records);
        renderCards(filtered);
      }
    });
  }).catch(error => {
    cardContainer.innerHTML = "<p>Error loading data.</p>";
    console.error(error);
  });
});
