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

function createButton(text, className, title) {
  return Object.assign(document.createElement("button"), {
    textContent: text,
    className: className,
    title: title,
    style: "background: none; border: none; cursor: pointer; margin-left: 8px;",
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

    const actionBar = post.querySelector('[role="group"]');

    if (actionBar) {
      actionBar.appendChild(sadButton);
      actionBar.appendChild(muteButton);
      actionBar.appendChild(blockButton);

      const sadButton = createButton("😢", "sad-button", "Not Interested");
      const muteButton = createButton("🔕", "mute-button", "Mute User");
      const blockButton = createButton("🚫", "block-button", "Block User");

      const menuButton = post.querySelector('[aria-label="More"]');

      sadButton.addEventListener("click", () => {
        if (menuButton) {
          menuButton.click(); // Open the three-dot menu
          setTimeout(() => {
            const notInterestedButton = Array.from(
              document.querySelectorAll('[role="menuitem"]')
            ).find(
              (el) => el.textContent.trim() === "Not interested in this post"
            );
            if (notInterestedButton) {
              notInterestedButton.click();
            }
          }, 500); // Wait for the menu to open
        }
      });

      blockButton.addEventListener("click", () => {
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
