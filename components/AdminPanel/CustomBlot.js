import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

class CustomEmbedBlot extends BlockEmbed {
  static blotName = "embed";
  static tagName = "div";

  static create(value) {
    const node = super.create();
    node.setAttribute("contenteditable", "false");
    node.setAttribute("data-url", value.url);

    if (value.url.includes("twitter.com") || value.url.includes("x.com")) {
      let fixedUrl = value.url
      if (value.url.includes("x.com")) {
        fixedUrl = value.url.replace("x.com", "twitter.com");
      }
      node.innerHTML = `
        <blockquote class="twitter-tweet">
          <a href="${fixedUrl}"></a>
        </blockquote>
      `;
      setTimeout(() => window.twttr?.widgets.load(), 500);
    } else if (value.url.includes("instagram.com")) {
      node.innerHTML = `
        <blockquote class="instagram-media" data-instgrm-permalink="${value.url}">
          <a href="${value.url}"></a>
        </blockquote>
      `;
      setTimeout(() => window.instgrm?.Embeds.process(), 500);
    } else if (value.url.includes("facebook.com")) {

      node.innerHTML = `
      <div class="fb-post" data-href="${value.url}" data-width="500"></div>
    `;

      setTimeout(() => {
        if (window.FB) {
          window.FB.XFBML.parse(); // ✅ Ensure Facebook post rendering
        }
      }, 500);

    } else if (value.url.includes("reddit.com")) {
      node.innerHTML = `
        <blockquote class="reddit-card">
          <a href="${value.url}"></a>
        </blockquote>
      `;
      setTimeout(() => {
        const redditScript = document.createElement("script");
        redditScript.src = "https://embed.redditmedia.com/widgets/platform.js";
        redditScript.async = true;
        document.body.appendChild(redditScript);
      }, 500);
    } else {
      node.innerHTML = `<a href="${value.url}" target="_blank">${value.url}</a>`;
    }

    return node;
  }

  static value(node) {
    return { url: node.getAttribute("data-url") };
  }
}

// ✅ Register the Custom Embed Blot
Quill.register(CustomEmbedBlot, true);

export default CustomEmbedBlot;
