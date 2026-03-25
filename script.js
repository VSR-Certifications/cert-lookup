document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("search");
  const cardContainer = document.getElementById("cardContainer");

  // ✅ Use Airtable Shared View JSON (safe, no API key required)
  const sharedViewUrl = "https://airtable.com/appkOBvixsfRHT7UM/shrNrSQj2befv1DLl?format=json";

  // ✅ Fetch data from shared view
  async function fetchAllRecords() {
    const response = await fetch(sharedViewUrl);
    const data = await response.json();

    // Shared view returns records with `.records`
    const records = data.records.map(r => r.fields);

    return records;
  }

  // ✅ Render cards
  function renderCards(records) {
    cardContainer.innerHTML = "";
    if (records.length === 0) return;

    records.forEach(record => {
      const card = document.createElement("div");
      card.className = "cert-card";

      // ✅ Get photo URL
      const photoUrl = record["Certificate Holder Photo"]
        ? record["Certificate Holder Photo"][0].url
        : null;

      card.innerHTML = `
        ${photoUrl ? `<img src="${photoUrl}" class="cert-photo" alt=" "No Name"}</h3>
        <p><strong>Business:</strong> ${record.Business || "N/A"}</p>
        <p><strong>Certification:</strong> ${record.Certification || "N/A"}</p>
        <p><strong>Status:</strong> ${record.Status || "N/A"}</p>
        <p><strong>In House Instructor:</strong> ${record["In House Instructor"] || "N/A"}</p>
        <p><strong>ID:</strong> ${record.ID || "N/A"}</p>
      `;

      cardContainer.appendChild(card);
    });
  }

  // ✅ Load and filter records
  fetchAllRecords()
    .then(allRecords => {
      // Only show valid certifications
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
