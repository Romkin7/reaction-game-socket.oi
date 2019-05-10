"use atrict";
const gameSection = document.querySelector("#game");
const resultsSection = document.querySelector("#results");
const startScreenSection = document.querySelector("#start-game");
const gameOverSection = document.querySelector("#overlay");
let kerrat = document.querySelector("#tries");
let aikaSpan = document.querySelector("#time");
//Pelin loogik MUUTTUJAT
var time = 1000;
var points = 0;
var result = 0;
var attempts = 3;
var tulosNaytto = document.querySelector("#tulos");
// nappulaelementit taulukkoon
var nappulat = document.querySelectorAll(".nappula");
var nykyinen = 0; // nykyinen aktiivinen nappula

// funktio, joka pyörittää konetta: aktivoi seuraavan nappulan ja ajastaa
// sitä seuraavan nappulanvaihdon
function aktivoiSeuraava(aika) {
  // arvo seuraava aktiivinen nappula
  var seuraava = arvoUusi(nykyinen);

  // päivitä nappuloiden värit: vanha mustaksi, uusi punaiseksi
  nappulat[nykyinen].classList.remove("active"); // vanha mustaksi
  nappulat[seuraava].classList.add("active"); // uusi punaiseksi

  // aseta uusi nykyinen nappula
  nykyinen = seuraava;

  // aseta ajastin seuraavalle vaihdolle
  // Koodaa niin, että vaihtumistahti kiihtyy koko ajan!
  ajastin = setTimeout(aktivoiSeuraava, aika, aika);

  function arvoUusi(edellinen) {
    // Tämä on vain demotarkoituksessa näin!
    // Koodaa tämä niin, että seuraava arvotaan. Muista, että sama ei saa
    // tulla kahta kertaa peräkkäin.
    var uusi = (edellinen + getRandomInt(1, 4)) % 4;
    return uusi;
  }
}

// Kutsu tätä funktiota, kun peli loppuu.
// Tämäkin tarvinnee täydennystä
function lopetaPeli() {
    clearTimeout(ajastin); // pysäytä ajastin
    gameSection.classList.add("display-none");
    gameOverSection.classList.remove("display-none");
    sendPoints();
    // ilmoita lopputulos
    // Vinkki: dokumentissa on valmiina taustaelementti ja elementti
    // lopputuloksen näyttämiseen. Aseta overlay-elementti näkyväksi
    // ja näytä tulos gameoover-elementissä
  }
  // onclick-käsittelyjät kaikille nappuloille
for(let i = 0; i < nappulat.length; i++) {
    nappulat[i].addEventListener("click", function(event) {
      if(Number(this.dataset.number) === nykyinen) {
        points++;
        result++;
        tulosNaytto.innerHTML = result;
        if(points === 3) {
          points = 0;
          time = time === 400 ? time : time * 0.95;
          aikaSpan.innerHTML = (time / 1000) + ' seconds';
          clearTimeout(ajastin);
          ajastin = setTimeout(aktivoiSeuraava, time, time);
        }
      let obj = {};
      obj.I = i;
      obj.Nykyinen = nykyinen;
      obj.Tulos = result;
      obj.AttempsCount = attempts;
      obj.username = document.querySelector("#user-info").innerHTML;
      sendClick(obj);
        } else {
          attempts = attempts = 0 ? 0 : attempts -= 1;
          tries.innerHTML = attempts;
          if(attempts === 0) {
            lopetaPeli();
          }
        }
    });
}
// generoi satunnaisen kokonaisluvun väliltä min - max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function startGame(user) {
  attempts = 3;
  tries.innerHTML = attempts;
  result = 0;
  points = 0;
  tulosNaytto.innerHTML = result;
  time = 1000;
  aikaSpan.innerHTML = (time / 1000) + " seconds";
  // käynnistetään kone
  // arvotaan ensimmäinen aktiivinen nappula 1500ms päästä, sitten 1000ms
  // 1500 on parametri setTimeout-funktiolle
  // 1000 on parametri aktivoiSeuraava-funktiolle
  document.querySelector("#user-info").innerHTML = user.username;
  startScreenSection.classList.add("display-none");
  gameSection.classList.remove("display-none");
  var ajastin = setTimeout(aktivoiSeuraava, 1500, time);
  return;
}
