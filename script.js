const airtableToken = "patjaXxpB8K1RxXq1.ebaec54e36bbcc44dccaca9a2fae1279b43a359d4156b7cf9e4c5e3b4ca52750";  // <-- Put your new token here
const baseId = "appkOBvixsfRHT7UM";
const tableName = "Table 1";

fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
  headers: {
    Authorization: `Bearer ${airtableToken}`
  }
})
  .then(res => res.json())
  .then(data => {
    const records = data.records.map(r => r.fields);
    const tableBody = document.querySelector("#certTable tbody");

    function renderTable(data) {
      tableBody.innerHTML = "";
      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.Name || ""}</td>
          <td>${row.Business || ""}</td>
          <td>${row.Certification || ""}</td>
          <td>${row.Issue || ""}</td>
          <td>${row.Expire || ""}</td>
          <td>${row.Instructor || ""}</td>
          <td>${row.ID || ""}</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    renderTable(records);

    document.getElementById("search").addEventListener("input", e => {
      const query = e.target.value.toLowerCase();
      const filtered = records.filter(row =>
        Object.values(row).some(
          val => val && val.toLowerCase().includes(query)
        )
      );
      renderTable(filtered);
    });
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
