//count number of times URL1 has been navigated 
count1 = 0
count2 = 0

//Value Rewriter class changes the element text
class ValueRewriter {
    constructor(txt) {
        this.txt = txt
    }
    element(element) {
        element.setInnerContent(this.txt)
    }
}

//an object for HTMLRewriter is created
const rewriter = new HTMLRewriter()
    .on('title', new ValueRewriter('New Variant')).on('h1[id=title]', new ValueRewriter('Variant-New')).on('p[id=description]', new ValueRewriter('New Description using HTMLRewriter')).on('a[id=url]', new ValueRewriter('Back to cloudflare.com'))

/**
 * Respond with .json
 * @param {url,data}
 */
async function postData(url = '', data = {},request) {
    const response = await fetch(url);
    return response.json(); // parses JSON response into native JavaScript objects
}

//listening to fetch event
addEventListener('fetch', async event => {
    init = {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    }
    res = postData('https://cfw-takehome.developers.workers.dev/api/variants')

    //console.log('response'+res)

    event.respondWith(
        (async function() {
            const body = await res

            //console.log(Object.values(body)[0])
            urls = Object.values(body)[0]

            //for evenly distribution of variants
            probability = Math.random()
            //console.log(probability)

            if (probability < 0.5) {
                sendUrl = urls[0]
                count1 += 1
            } else {
                sendUrl = urls[1]
                count2 += 1
            }
            console.log(count1, count2) //gives the times each url variant is passed

            resp = await fetch(sendUrl)
            return rewriter.transform(resp)
            //return resp
        })()
    )

})