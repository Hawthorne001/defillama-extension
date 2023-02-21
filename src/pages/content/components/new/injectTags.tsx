import { getStorage, getAccountTags, logImage, getImageUrl, getAccountTagsV1 } from "@src/pages/libs/helpers";
import takeNote from "@src/assets/img/memes/take-note-128.png";
import { makeDisplayTags, makeDisplayTagsV1 } from "@src/pages/libs/tagging-helpers";

export const injectTags = async () => {
  const tagsInjector = await getStorage("local", "settings:tagsInjector", true);
  if (!tagsInjector) {
    return;
  }

  const urlType = window.location.pathname.split("/")[1];
  const account = document.querySelector("span#mainaddress")?.textContent?.trim()?.toLowerCase();

  switch (urlType) {
    case "address":
      renderTagsOnAccountsPage();
      break;
    default:
      break;
  }

  async function renderTagsOnAccountsPage() {
    const accountData = await getAccountTagsV1(account);
    console.log(accountData);
    if (!accountData) {
      return;
    }

    // add a section .container-xxl under the first .container-xxl that can be found on the page
    const container = document.querySelector("section.container-xxl");
    const container2 = document.createElement("section");
    container2.className = "container-xxl";
    container?.parentNode?.insertBefore(container2, container.nextSibling);

    // insert a div with .card.h-100 into the new section
    const card = document.createElement("div");
    card.className = "card h-100 mt-3";
    container2.appendChild(card);

    // containers n stuff reeeeeee
    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-row gap-2 flex-wrap align-items-center";
    card.appendChild(cardBody);

    // insert a takeNote image into the card
    const takeNoteImage = document.createElement("img");
    takeNoteImage.src = getImageUrl(takeNote);
    takeNoteImage.width = 24;
    takeNoteImage.height = 24;
    takeNoteImage.className = "d-inline-block align-top mr-2";
    takeNoteImage.alt = "Llama Tagging logo";
    takeNoteImage.title = "Llama Tagging";
    cardBody.appendChild(takeNoteImage);

    const tags = makeDisplayTagsV1(accountData).map((tag) => {
      const tagContainer = document.createElement("div");
      tagContainer.className = "d-flex flex-column align-items-center";
      cardBody.appendChild(tagContainer);

      const tagText = document.createElement("span");
      tagText.className = tag.text ? "badge badge-pill " + (tag.textColor || "") + " " + (tag.bg || "") : "";
      tagText.style.fontSize = "smaller";
      tagText.textContent = tag.text;
      tagContainer.appendChild(tagText);

      if (tag.link) {
        const tagLink = document.createElement("a");
        // if there's link, wrap the tag text in an anchor tag
        tagLink.href = tag.link;
        tagLink.target = "_blank";
        tagLink.rel = "noopener noreferrer";
        tagLink.appendChild(tagText);
        tagContainer.appendChild(tagLink);
      }

      if (tag.icon) {
        const tagImage = document.createElement("img");
        tagImage.src = getImageUrl(tag.icon);
        tagImage.width = tag.text ? 14 : 18;
        tagImage.height = tag.text ? 14 : 18;
        tagImage.className = "d-inline-block align-center rounded-circle";
        tagImage.alt = `${tag.text ?? ""} icon`;
        // add right margin to the image if there is text
        if (tag.text) {
          tagImage.style.marginRight = "4px";
        }
        tagText.prepend(tagImage);
      }

      return tagContainer;
    });

    // attach the tags to the card
    cardBody.append(...tags);
  }
};
