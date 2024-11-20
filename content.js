chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLabels") {
      const rows = document.querySelectorAll('tr.d_ggl1');
      const labels = Array.from(rows).map(row => {
          return Array.from(row.querySelectorAll('label')).map(label => label.textContent.trim());
      });
      const flattenedLabels = labels.flat();
      sendResponse({ labels: flattenedLabels });
  } else if (request.action === "getIndividual") {
      // Select all tr elements that do not have the class d_ggl1
      const rows = document.querySelectorAll('tr:not(.d_ggl1)');
      const groupedLabels = Array.from(rows).map(row => {
          const labels = Array.from(row.querySelectorAll('label')).map(label => label.textContent.trim());
          return {
              name: labels[0] || null, // Assume first label is the name
              values: labels.slice(1, -1), // Middle labels are values. Will only need weighed grade. 
              //Values will ignore the brightspace section grades since ignores .d_ggl1, so this won't be an issue.
              grade: labels[labels.length - 1] || null // Last label is the grade
          };
      });
      sendResponse({ labels: groupedLabels });
  } else {
      console.log("error - unknown method");
  }
  return true;
});
