const airtableToken = "patjaXxpB8K1RxXq1.ebaec54e36bbcc44dccaca9a2fae1279b43a359d4156b7cf9e4c5e3b4ca52750";
const baseId = "appkOBvixsfRHT7UM";
const tableName = "Table 1";
const tableBody = document.querySelector("#certTable tbody");

let allRecords = [];

function fetchPage(offset = "") {
  let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100`;
  if (offset) url += `&offset=${offset}`;

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${airtableToken}`
    }
  })
    .then(res => res.json())
    .then(data => {
      allRecords.push(...data.records.map(r => r.fields));
      if (data.offset) {
        return fetchPage(data.offset); // recursive fetch next page
      }
    });
}

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
      <td>${row.[In House Instructor] || ""}</td>
      <td>${row.ID || ""}</td>
    `;
    tableBody.appendChild(tr);
  });
}

fetchPage().then(() => {
  document.getElementById("search").addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    if (query.trim() === "") {
      tableBody.innerHTML = "";
      return;
    }

    const filtered = allRecords.filter(row =>
      Object.values(row).some(
        val => val && val.toLowerCase().includes(query)
      )
    );
    renderTable(filtered);
  });
});
