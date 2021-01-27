let btn;
let search;
let body;
let searchDiv;
let resultDiv;
window.onload=function()
{
    btn=document.querySelector("#submit");
    search=document.querySelector("#search");
    body=document.querySelector("body");
    searchDiv=document.querySelector("#searchDiv");
    resultDiv=document.querySelector("#resultDiv");

}

function muteSounds() {
    let audioElements=document.querySelectorAll('audio');
    audioElements.forEach((element)=>{
        element.pause();
    })
}

async function doWork() {
    let texte = search.value;
    let result;
    document.querySelector("#loadingText").innerHTML="Chargement...";
    resultDiv.innerHTML="";
    let headers = new Headers();

    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');


    try{
        let result2 = await fetch(
            'https://itunes.apple.com/search?term=' + texte,{
                headers: headers,
                mode: 'no-cors'
            }
        ).then(r => result=r.json())
            .then(data => {
                console.log(data.results.length);
                if(data.results.length==0)
                {
                    let textElement=document.createElement("p");
                    textElement.innerHTML="Aucun élément ne correspond à votre recherche";
                    resultDiv.appendChild(textElement);
                    document.querySelector("#loadingText").innerHTML="";

                }
                else
                {
                    result = data;
                    document.querySelector("#loadingText").innerHTML="";
                    alert("Chargement terminé, appuyez sur les jaquettes pour écouter un extrait");

                    result.results.forEach((element) => {
                        let textElement=document.createElement("p");
                        textElement.id="resultTitle";
                        let artwork=document.createElement("img");
                        let audioPreview=document.createElement("audio");
                        audioPreview.id       = 'audio-player';
                        audioPreview.controls = 'controls';
                        audioPreview.src      = element['previewUrl'];
                        audioPreview.type     = 'audio/mpeg';
                        resultDiv.appendChild(audioPreview);
                        artwork.addEventListener('click', function(){
                            if(!audioPreview.paused) audioPreview.pause();
                            else
                            {
                                muteSounds();
                                audioPreview.play();
                            }
                        });

                        console.log(element);
                        textElement.innerHTML=element['trackName']+' - '+element['artistName'];
                        artwork.src=element['artworkUrl100'];
                        resultDiv.appendChild(textElement);
                        resultDiv.appendChild(artwork);
                    })
                }
                //pour éviter que des musiques soient jouées après avoir fait une recherche pendant qu'on joue un extrait
                muteSounds();

            })
    }
    catch(error)
    {
        console.log(error);
    }
}
