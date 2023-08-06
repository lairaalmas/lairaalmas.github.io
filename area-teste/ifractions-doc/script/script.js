// Botao de voltar para o topo da pagina
let btnVoltar = document.getElementById("ifr__btn__backToTop");
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnVoltar.style.display = "block";
  } else {
    btnVoltar.style.display = "none";
  }
}
function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Insere em todos rodapés
let footer = document.getElementById("footer");
footer.innerHTML =
  "<p>Atualizado pela ultima vez em: 10 de Julho de 2022 -- por <a href='http://www.ime.usp.br/~laira'>Laira</a>.</p>";

// Coloca imagem no modal
const modal = document.getElementById("myModal");
let img = document.getElementsByClassName("ifr__img");
for (let i = 0; i < img.length; i++) {
  img[i].addEventListener("click", function () {
    modal.style.display = "block";
    document.getElementById("myModal-img").src = img[i].src;
    document.getElementById("caption").innerHTML = this.alt;
  });
}
let span = document.getElementsByClassName("close")[0];
span.onclick = () => (modal.style.display = "none");

// Gera indice
const toc = document.querySelector(".ifr__toc");
const sections_all = document.querySelectorAll("section");
sections_all.forEach((section_h2) => {
  const h2 = section_h2.querySelectorAll("h2")[0];
  if (h2) {
    const h2_ul = document.createElement("ul");
    const h2_li = document.createElement("li");
    const h3_ul = document.createElement("ul");
    const sections_h3 = section_h2.querySelectorAll("section");
    sections_h3.forEach((section_h3) => {
      const h3 = section_h3.querySelectorAll("h3")[0];
      if (h3) {
        const h3_li = document.createElement("li");
        h3_li.innerHTML = `<a href="#${section_h3.id}" target="_self">${h3.innerHTML}</a>`;
        h3_ul.appendChild(h3_li);
      }
    });
    h2_li.innerHTML = `<a href="#${section_h2.id}" target="_self">${h2.innerHTML}</a>`;
    h2_ul.appendChild(h2_li);
    h2_ul.appendChild(h3_ul);
    toc.appendChild(h2_ul);
  }
});
