const base = new Airtable({apiKey: 'pat18cgn80tsiKYrv'}).base('appkOBvixsfRHT7UM');

function searchCert() {
  const term = document.getElementById('search').value.trim().toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (term === '') return;

  base('tblisA4go2RqgLGSY').select({
    filterByFormula: `OR(
      SEARCH("${term}", LOWER({Name})),
      SEARCH("${term}", LOWER({Business})),
      SEARCH("${term}", LOWER({Certification}))
    )`,
    maxRecords: 50
  }).eachPage(function page(records) {
    records.forEach(record => {
      const html = `
        <div class="result">
          <strong>${record.get('Name') || ''}</strong><br>
          Business: ${record.get('Business') || ''}<br>
          Certification: ${record.get('Certification') || ''}<br>
          In House Instructor: ${record.get('In House Instructor') || 'No'}
        </div>`;
      resultsDiv.innerHTML += html;
    });
  });
}
