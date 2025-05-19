document.addEventListener("DOMContentLoaded", () => {
  const AIRTABLE_BASE_ID = "appkOBvixsfRHT7UM";
  const AIRTABLE_TABLE_NAME = "Table 1";
  const AIRTABLE_API_KEY = "keyh12f4j0FAZl15E";

  const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

  const resultsContainer = document.getElementById("vertex-resultsContainer");
  const searchInput = document.getElementById("vertex-search");

  let allRecords = [];

  async function fetchRecords(offset) {
    let url = AIRTABLE_ENDPOINT + "?pageSize=100";
    if (offset) url += `&offset=${offset}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch Airtable data:", response.statusText);
      return null;
    }
    return await response.json();
  }

  async function loadAllRecords() {
    let offset = null;
    let records = [];

    do {
      const data = await fetchRecords(offset);
      if (!data) break;

      records = records.concat(data.records);
      offset = data.offset || null;
    } while (offset);

    return records;
  }

  function mapRecordToCertData(record) {
    const fields = record.fields;
    return {
      Name: fields.Name || "",
      Business: fields.Business || "",
      Certification: fields.Certification || "",
      Issue: fields.Issue || "",
      Expire: fields.Expire || "",
      "In House Instructor": fields["In House Instructor"] || "",
      ID: fields.ID || "",
    };
  }

  function renderTable(data) {
    resultsContainer.innerHTML = "";

    if (data.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    data.forEach(row => {
      const card = document.createElement("div");
      card.className = "vertex-cert-card";

      card.innerHTML = `
        <h3>${row.Name || "No Name"}</h3>
        <p><strong>Business:</strong> ${row.Business || "N/A"}</p>
        <p><strong>Certification:</strong> ${row.Certification || "N/A"}</p>
        <p><strong>Issue Date:</strong> ${row.Issue || "N/A"}</p>
        <p><strong>Expire Date:</strong> ${row.Expire || "N/A"}</p>
        <p><strong>In House Instructor:</strong> ${row["In House Instructor"] || "N/A"}</p>
        <p><strong>ID:</strong> ${row.ID || "N/A"}</p>
      `;

      resultsContainer.appendChild(card);
    });
  }

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      resultsContainer.innerHTML = "<p>Enter search terms above to find certifications.</p>";
      return;
    }
    const filtered = allRecords
      .map(mapRecordToCertData)
      .filter(row =>
        Object.values(row).some(val => val.toLowerCase().includes(query))
      );

    renderTable(filtered);
  });

  (async () => {
    resultsContainer.innerHTML = "<p>Loading certifications...</p>";
    allRecords = await loadAllRecords();
    resultsContainer.innerHTML = "<p>Enter search terms above to find certifications.</p>";
  })();
});
