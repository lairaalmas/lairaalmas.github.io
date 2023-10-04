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
  "<p>Atualizado pela ultima vez em: 3 de Outubro de 2023 -- por <a href='http://www.ime.usp.br/~laira'>Laira</a>.</p>";

// Cria menu de navegação
let nav = document.querySelector(".navbar");
nav.innerHTML = `
 <div class="container-fluid">
      <a class="navbar-brand" aria-current="page" target="_self" href="index.html">iFractions</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" target="_self" href="index.html#download">Download</a>
          </li>

          <li class="nav-item">
            <a class="nav-link" target="_self" href="./paginas/sobre/page_1.html">Conhecendo o iFractions</a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
              data-bs-toggle="dropdown" aria-expanded="false"> Documentação
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li><a class="dropdown-item" target="_self" href='./paginas/documentacao.html'>Início</a>
              </li>
              <li><a class="dropdown-item" target="_self" href='./paginas/documentacao.html#sou-prof'>Sou Professor</a>
              </li>
              <li><a class="dropdown-item" target="_self" href='./paginas/documentacao.html#sou-admin'>Sou
                  Administrador Moodle</a>
              </li>
              <li><a class="dropdown-item" target="_self" href='./paginas/documentacao.html#sou-dev'>Sou
                  Desenvolvedor</a>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a class="nav-link" target="_self" href="./paginas/publicacoes.html">Publicações</a>
          </li>
        </ul>
      </div>
    </div>
`;

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
if (toc) {
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
}

// Insere em todos rodapés
const updateMenu = (depth) => {
  const path = depth == 1 ? "../" : "../../";
  const semiPath = depth == 1 ? "./" : "../";
  nav.innerHTML = `
 <div class="container-fluid">
      <a class="navbar-brand" aria-current="page" target="_self" href="${path}index.html">iFractions</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" target="_self" href="${path}index.html#download">Download</a>
          </li>

          <li class="nav-item">
            <a class="nav-link" target="_self" href="${semiPath}sobre/page_1.html">Conhecendo o iFractions</a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
              data-bs-toggle="dropdown" aria-expanded="false"> Documentação
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li><a class="dropdown-item" target="_self" href='${semiPath}documentacao.html'>Início</a>
              </li>
              <li><a class="dropdown-item" target="_self" href='${semiPath}documentacao.html#sou-prof'>Sou Professor</a>
              </li>
              <li><a class="dropdown-item" target="_self" href='${semiPath}documentacao.html#sou-dev'>Sou
                  Administrador Moodle</a>
              </li>
              <li><a class="dropdown-item" target="_self" href='${semiPath}documentacao.html#sou-admin'>Sou
                  Desenvolvedor</a>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a class="nav-link" target="_self" href="${semiPath}publicacoes.html">Publicações</a>
          </li>
        </ul>
      </div>
    </div>
`;
};
