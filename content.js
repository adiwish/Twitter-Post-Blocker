let blockedCount = 0; 

function blockTweets() {
  chrome.storage.local.get("blockedWords", ({ blockedWords }) => {
    console.log("Blocked Words in content.js:", blockedWords); 

    if (!blockedWords || blockedWords.length === 0) return;

    const tweets = document.querySelectorAll("article");
    tweets.forEach((tweet) => {
      const tweetText = tweet.innerText.toLowerCase();
      const containsBlockedWord = blockedWords.some((word) =>
        tweetText.includes(word.toLowerCase())
      );

      if (containsBlockedWord) {
        console.log("Blocking Tweet:", tweetText);

        
        tweet.innerHTML = `
          <div style="text-align: center; color: gray; font-style: italic; margin: 10px 0;">
            This post was removed by Twitter Post Blocker
          </div>
        `;
        tweet.style.backgroundColor = "#f5f5f5"; 

        blockedCount++; 

        
        chrome.storage.local.set({ blockedCount });
      }
    });
  });
}

// Function to add button and handle actions
function addButtonsToPosts() {
  const posts = document.querySelectorAll('[data-testid="tweet"]');

  posts.forEach((post) => {
    if (
      post.querySelector(".sad-button") ||
      post.querySelector(".block-button") ||
      post.querySelector(".mute-button")
    )
      return;

    const sadButton = document.createElement("button");
    sadButton.textContent = "☹️";
    sadButton.className = "sad-button";
    sadButton.style.background = "none";
    sadButton.style.border = "none";
    sadButton.style.cursor = "pointer";
    sadButton.style.marginLeft = "8px";
    sadButton.title = "Not Interested";

    const blockButton = document.createElement("button");
    blockButton.textContent = "🚫";
    blockButton.className = "block-button";
    blockButton.style.background = "none";
    blockButton.style.border = "none";
    blockButton.style.cursor = "pointer";
    blockButton.style.marginLeft = "8px";
    blockButton.title = "Block User";

    const muteButton = document.createElement("button");
    muteButton.textContent = "🔕";
    muteButton.className = "mute-button";
    muteButton.style.background = "none";
    muteButton.style.border = "none";
    muteButton.style.cursor = "pointer";
    muteButton.style.marginLeft = "8px";
    muteButton.title = "Mute User";

    const actionBar = post.querySelector('[role="group"]');

    if (actionBar) {
      actionBar.appendChild(sadButton);
      actionBar.appendChild(muteButton);
      actionBar.appendChild(blockButton);

      sadButton.addEventListener("click", () => {
        const menuButton = post.querySelector('[aria-label="More"]');
        if (menuButton) {
          menuButton.click(); // Open the three-dot menu
          setTimeout(() => {
            const notInterestedButton =  Array.from(document.querySelectorAll('[role="menuitem"]')).find(el => el.textContent.trim() === "Not interested in this post");
            if(notInterestedButton){
              notInterestedButton.click();
            }
          }, 500); // Wait for the menu to open
        }
      });

      blockButton.addEventListener("click", () => {
        const menuButton = post.querySelector('[aria-label="More"]');
        if (menuButton) {
          menuButton.click();
          setTimeout(() => {
            const blockButtonMenu = Array.from(
              document.querySelectorAll('[role="menuitem"] span')
            ).find((el) => el.textContent.includes("Block"));
            if (blockButtonMenu) {
              blockButtonMenu.click(); // Click on the Block button in the menu
              setTimeout(() => {
                const confirmBlockButton = document.querySelector(
                  'button[data-testid="confirmationSheetConfirm"]'
                );
                if (confirmBlockButton) {
                  confirmBlockButton.click(); // Confirm the block in the pop-up
                  blockButton.remove();
                }
              }, 500); // Wait for the confirmation dialog to appear
            }
          }, 500);
        }
      });

      muteButton.addEventListener("click", () => {
        const menuButton = post.querySelector('[aria-label="More"]');
        if (menuButton) {
          menuButton.click();
          setTimeout(() => {
            const muteButtonMenu = Array.from(
              document.querySelectorAll('[role="menuitem"] span')
            ).find((el) => el.textContent.includes("Mute"));
            if (muteButtonMenu) {
              muteButtonMenu.click();
              muteButton.remove();
            }
          }, 500);
        }
      });
    }
  });
}

// Observe dynamic changes in the feed
const observer = new MutationObserver(() => {
  blockTweets();
  addButtonsToPosts();
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
blockTweets();
addButtonsToPosts();
