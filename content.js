chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // grabs all the labels with the brightspace grade values (tr.d_ggl1)
    if (request.action === "getLabels") {
      const rows = document.querySelectorAll('tr.d_ggl1');
      const labels = Array.from(rows).map(row => {
        return Array.from(row.querySelectorAll('label')).map(label => label.textContent.trim());
      });
  
      const flattenedLabels = labels.flat();
  
      sendResponse({ labels: flattenedLabels });
    } else {
        console.log("error - unknown method")
    }
    return true;
  });
  