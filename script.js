document.addEventListener("DOMContentLoaded", function () {
  const sheetUrl = "https://spreadsheets.google.com/feeds/list/1ecT0U_26RPYXRNmFw5tPGB0iYDSHavhSE5OJ57_Z6s0/od6/public/values?alt=json";

  fetch(sheetUrl)
    .then(response => response.json())
    .then(data => {
      const entries = data.feed.entry;
      const tableBody = document.querySelector("#certTable tbody");

      let certData = entries.map(row => ({
        name: row.gsx$name?.$t || "",
        business: row.gsx$business?.$t || "",
        certification: row.gsx$certification?.$t || "",
        issue: row.gsx$issue?.$t || "",
        expire: row.gsx$expire?.$t || "",
        instructor: row.gsx$instructor?.$t || "",
        id: row.gsx$id?.$t || ""
      }));

      function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.business}</td>
            <td>${row.certification}</td>
            <td>${row.issue}</td>
            <td>${row.expire}</td>
            <td>${row.instructor}</td>
            <td>${row.id}</td>
          `;
          tableBody.appendChild(tr);
        });
      }

      renderTable(certData);

      document.getElementById("search").addEventListener("input", e => {
        const query = e.target.value.toLowerCase();
        const filtered = certData.filter(row =>
          Object.values(row).some(val => val.toLowerCase().includes(query))
        );
        renderTable(filtered);
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
});
