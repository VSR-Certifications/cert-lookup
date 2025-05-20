document.addEventListener("DOMContentLoaded", function () {
  const airtableBaseId = "appkOBvixsfRHT7UM";
  const airtableTableName = "Table 1";
  const airtableToken = "patjaXxpB8K1RxXq1.73ec45c91ecf8626150e77f777ecab84841d1ccfd85158b38153486590ac32fc";

  const searchInput = document.getElementById("search");
  const cardContainer = document.getElementById("cardContainer");

  async function fetchData() {
    const url = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}?pageSize=100`;

    let records = [];
    let offset = null;

    try {
      do {
        const response = await fetch(`${url}${offset ? `&offset=${offset}` : ""}`, {
          headers: {
            Authorization: `Bearer ${airtableToken}`
          }
        });

        const data = await response.json();
        records = records.concat(data.records);
        offset = data.offset;
      } while (offset);

      return records.map(record => record.fields);
    } catch (error) {
      console.error("Error fetching Airtable data:", error);
      return [];
    }
  }

  function renderCards(data) {
    cardContainer.innerHTML = "";

    if (data.length === 0) {
      cardContainer.innerHTML = "<p style='text-align:center;'>No results found.</p>";
      return;
    }

    data.forEach(row => {
      const card = document.createElement("div");
      card.className = "cert-card";
      card.innerHTML = `
        <h3>${row.Name || "No Name"}</h3>
        <p><strong>Business:</strong> ${record.Business || "N/A"}</p>
        <p><strong>Certification:</strong> ${row.Certification || "N/A"}</p>
        <p><strong>In House Instructor:</strong> ${row["In House Instructor"] || "N/A"}</p>
        <p><strong>ID:</strong> ${row.ID || "N/A"}</p>
        <p><strong>Status:</strong> ${row.Status || "N/A"}</p>
      `;
      cardContainer.appendChild(card);
    });
  }

  fetchData().then(certData => {
    const validData = certData.filter(row =>
      row.Status && row.Status.toLowerCase() === "valid"
    );

    renderCards([]);

    searchInput.addEventListener("input", e => {
      const query = e.target.value.toLowerCase().trim();

      if (query === "") {
        renderCards([]);
        return;
      }

      const filtered = validData.filter(row =>
        (row.Name && row.Name.toLowerCase().includes(query)) ||
        (row.Certification && row.Certification.toLowerCase().includes(query)) ||
        (row.ID && row.ID.toLowerCase().includes(query)) ||
        (row["In House Instructor"] && row["In House Instructor"].toLowerCase().includes(query))
      );

      renderCards(filtered);
    });
  });
});
