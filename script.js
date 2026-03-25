<!DOCTYPE html>
<html>
<head>
  <title>Certification Lookup</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f8f8f8; }
    #search { width: 100%; padding: 15px; font-size: 18px; border: 2px solid #007bff; border-radius: 8px; box-sizing: border-box; }
    .result { background: white; border: 1px solid #ddd; padding: 15px; margin: 12px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .result strong { font-size: 1.1em; color: #007bff; }
  </style>
</head>
<body>

  <input type="text" id="search" placeholder="Search by name, business, or certification..." onkeyup="searchCert()">

  <div id="results"></div>

  <script src="https://cdn.jsdelivr.net/npm/airtable@0.12.0/build/airtable.min.js"></script>
  <script>
    const base = new Airtable({apiKey: 'pat18cgn80tsiKYrv'}).base('appkOBvixsfRHT7UM');

    function searchCert() {
      const term = document.getElementById('search').value.trim().toLowerCase();
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '';
      if (term === '') return;

      base('tblisA4go2RqgLGSY').select({
        filterByFormula: `OR(SEARCH("${term}", LOWER({Name})), SEARCH("${term}", LOWER({Business})), SEARCH("${term}", LOWER({Certification})))`,
        maxRecords: 50
      }).eachPage(function page(records) {
        records.forEach(record => {
          const html = `<div class="result"><strong>${record.get('Name') || ''}</strong><br>Business: ${record.get('Business') || ''}<br>Certification: ${record.get('Certification') || ''}<br>In House Instructor: ${record.get('In House Instructor') || 'No'}</div>`;
          resultsDiv.innerHTML += html;
        });
      });
    }
  </script>
</body>
</html>
