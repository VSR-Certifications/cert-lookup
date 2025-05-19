document.addEventListener("DOMContentLoaded", function () {
  const sheetUrl = "https://spreadsheets.google.com/feeds/list/1ecT0U_26RPYXRNmFw5tPGB0iYDSHavhSE5OJ57_Z6s0/od6/public/values?alt=json";

  fetch(sheetUrl)
    .then(response => response.json())
    .then(data => {
      const entries = data.feed.entry;
      const tableBody = document.querySelector("#certTable tbody");

      let certData = entries.map(row => ({
        Name: row.gsx$Name?.$t || "",
        Business: row.gsx$Business?.$t || "",
        Certification: row.gsx$Certification?.$t || "",
        Issue: row.gsx$Issue?.$t || "",
        Expire: row.gsx$Expire?.$t || "",
        Instructor: row.gsx$Instructor?.$t || "",
        ID: row.gsx$ID?.$t || ""
      }));

      function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.Name}</td>
            <td>${row.Business}</td>
            <td>${row.Certification}</td>
            <td>${row.Issue}</td>
            <td>${row.Expire}</td>
            <td>${row.Instructor}</td>
            <td>${row.ID}</td>
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
