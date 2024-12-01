// Load existing keywords and blocked count into the popup
document.addEventListener("DOMContentLoaded", () => {
  // Load blocked words into the input field
  chrome.storage.sync.get(
    ["blockedWords", "blockedCount"],
    ({ blockedWords, blockedCount }) => {
      if (blockedWords && blockedWords.length > 0) {
        document.getElementById("keywords").value = blockedWords.join(", ");
      }

      // Display blocked count
      const counter = document.getElementById("counter");
      counter.textContent = `Posts Blocked: ${blockedCount || 0}`;
    }
  );
});

// Save updated keywords when "Done" is clicked
document.getElementById("save").addEventListener("click", () => {
  const keywords = document
    .getElementById("keywords")
    .value.split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0); // Remove empty entries

  chrome.storage.sync.set({ blockedWords: keywords }, () => {
    console.log("Updated Keywords Saved:", keywords); // Log updated list
    alert("Keywords updated!");
  });
});
