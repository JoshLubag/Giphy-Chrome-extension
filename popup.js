const api_key = 'wKTVuOaUTS48IVDju08FuEzZI1p6QIad' // enter your api key
const search = document.querySelector("#search");
search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchImages(search.value)
    }
})
function fetchImages(value) {
    fetch(`http://api.giphy.com/v1/gifs/translate?s=${value}&weirdness=9&api_key=${api_key}`)
        .then(res => res.json())
        .then(jsonData => {
            console.log(JSON.stringify(jsonData.data.url));
            console.log(JSON.stringify(jsonData.data.images.original.embed_url));
           
            buildUI(jsonData)
        })
}
function buildUI(response) {
    // document.write(JSON.stringify(response))
    let column = document.querySelector('.columns')
    let len = response.data.length;
    column.innerHTML = '';
        let url = response.data.images.original.url;
        let img = document.createElement('img')
        img.setAttribute('src', url);
        column.appendChild(img)

}

async function getImageBlobFromUrl(url) {
    const fetchedImageData = await fetch(url)
    const blob = await fetchedImageData.blob()
    return blob
  }
  
document.body.addEventListener('click', async (e) => {
    if (e.target.tagName === "IMG")
        {
            try {
                // console.log(e.target);
                const blob = await getImageBlobFromUrl(e.target.src)
                await navigator.clipboard.write([
                  new ClipboardItem({
                    [blob.type]: blob
                  })
                ])
                alert(e.target.src)
              } catch (err) {
                console.error(err.name, err.message);
                alert('There was an error while copying image to clipboard :/')
              }
        }
       
})