const someHost = "https://example.org"
const url = someHost + ""

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return response.text()
  }
  else if (contentType.includes("text/html")) {
    return response.text()
  }
  else {
    return response.text()
  }
}

class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace('iana', 'bananarama'),
      )
    }
  }
}

class AppendBob {
  constructor(somdata) {
    this.somdata = somdata;
  }
  element(element) {
    element.append(`<p>BOB is your uncle ${this.somdata}</p>`,{html: true});
  }
}


async function handleRequest(request) {
  const urll = new URL(request.url);
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }

  const response = await fetch(someHost+urll.pathname, init)
  const contentType = response.headers.get("Content-Type")
  const results = await gatherResponse(response)
  if (contentType.startsWith("text/html")) {
    const rewriter = new HTMLRewriter()
      .on("a", new AttributeRewriter("href"))
      .on("body div", new AppendBob(urll.pathname))

    return rewriter.transform(new Response(results, init));
  } else {
    return new Response(results, init)
  }
}


export default {
  async fetch(request) {
    let response = await handleRequest(request);
    return response;
  },
};
