// Insere em todos rodapés
updateMenu = (depth) => {
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
              <li><a class="dropdown-item" target="_self" href='${semiPath}area_professor/page_2.html'>Sou Professor</a>
              </li>
              <li><a class="dropdown-item" target="_self" href='${semiPath}area_professor/page_1.html'>Sou
                  Administrador Moodle</a>
              </li>
              <li><a class="dropdown-item" target="_self" href='${semiPath}area_programador/page_1.html'>Sou
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
updateMenu();
