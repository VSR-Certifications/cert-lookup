document.addEventListener("DOMContentLoaded", () => {
  const AIRTABLE_BASE_ID = "appkOBvixsfRHT7UM";
  const AIRTABLE_TABLE_NAME = "Table 1";
  const AIRTABLE_API_KEY = "keyh12f4j0FAZl15E"; // Keep your keys secret in real deployments!
  const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

  const resultsContainer = document.getElementById("resultsContainer");
  const searchInput = document.getElementById("search");

  let allRecords = [];

  // Fetch all Airtable records with pagination
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

  // Render cards in the container
  function renderTable(data) {
    resultsContainer.innerHTML = "";

    if (data.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    data.forEach(row => {
      const card = document.createElement("div");
      card.className = "cert-card";

      card.innerHTML = `
        <h3>${row.Name || "No Name"}</h3>
        <p><strong>Business:</strong> ${row.Business || "N/A"}</p>
        <p><strong>Certification:</strong> ${row.Certification || "N/A"}</p>
        <p><strong>Issue Date:</strong> ${row.Issue || "N/A"}</p>
        <p><strong>Expire Date:</strong> ${row.Expire || "N/A"}</p>
        <p><strong>In House Instructor:</strong> ${row["In House Instructor"] || "N/A"}</p>
        <p><strong>ID:</strong> ${row.ID || "N/A"}</p>
        <button class="details-btn" aria-label="View details for ${row.Name}">View Details</button>
      `;

      resultsContainer.appendChild(card);

      card.querySelector(".details-btn").addEventListener("click", () => {
        openPopup(row);
      });
    });
  }

  // Popup modal functions
  const modal = document.getElementById("popupModal");
  const popupDetails = document.getElementById("popupDetails");
  const closePopupBtn = document.getElementById("closePopup");

  function openPopup(data) {
    popupDetails.innerHTML = `
      <h2 id="popupTitle">${data.Name || "No Name"}</h2>
      <p><strong>Business:</strong> ${data.Business || "N/A"}</p>
      <p><strong>Certification:</strong> ${data.Certification || "N/A"}</p>
      <p><strong>Issue Date:</strong> ${data.Issue || "N/A"}</p>
      <p><strong>Expire Date:</strong> ${data.Expire || "N/A"}</p>
      <p><strong>In House Instructor:</strong> ${data["In House Instructor"] || "N/A"}</p>
      <p><strong>ID:</strong> ${data.ID || "N/A"}</p>
    `;
    modal.style.display = "flex";
    modal.focus();
  }

  function closePopup() {
    modal.style.display = "none";
  }

  closePopupBtn.addEventListener("click", closePopup);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closePopup();
    }
  });

  // Search function
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

  // Initial load
  (async () => {
    resultsContainer.innerHTML = "<p>Loading certifications...</p>";
    allRecords = await loadAllRecords();
    resultsContainer.innerHTML = "<p>Enter search terms above to find certifications.</p>";
  })();
});
