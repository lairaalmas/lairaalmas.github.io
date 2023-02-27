const personalProjectsContainer = document.querySelector(
  "#portfolio__personal"
);
const mastersProjectsContainer = document.querySelector("#portfolio__masters");
const aluraProjectsContainer = document.querySelector("#portfolio__alura");
const udemyProjectsContainer = document.querySelector("#portfolio__udemy");
const rocketseatProjectsContainer = document.querySelector(
  "#portfolio__rocketseat"
);

const personalProjectsContent = [
  {
    title: "Chess Prototype",
    period: "2023 - presente",
    techList: ["html5", "bootstrap", "javascript", "phaser.io"],
    img: "./assets/screens/chess-prototype.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/chess-prototype",
    linkRepo: "https://github.com/lairaalmas/chess-prototype",
    lang: "🇺🇸",
  },
  {
    title: "Flip a Coin",
    period: "2023",
    techList: ["html5", "bootstrap", "javascript"],
    img: "./assets/screens/flip-a-coin.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/flip-a-coin",
    linkRepo: "https://github.com/lairaalmas/flip-a-coin",
    lang: "🇺🇸",
  },
  {
    title: "Dado Virtual",
    period: "2023",
    // phaser
    techList: ["html5", "bootstrap", "javascript", "phaser.io"],
    img: "./assets/screens/dado-virtual.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/dado-virtual",
    linkRepo: "https://github.com/lairaalmas/dado-virtual",
    lang: "🇧🇷",
  },
];
const mastersProjectsContent = [
  {
    title: "iFractions",
    period: "2019 - presente",
    techList: ["html5", "bootstrap", "javascript", "mysql", "php", "phaser.io"],
    img: "./assets/screens/ifractions.png",
    alt: "Tela do projeto.",
    linkDemo: "http://www.usp.br/line/ifractions/",
    linkRepo: "http://200.144.254.107/git/LInE/Ifractions-web",
    lang: "🇧🇷 🇪🇸 🇺🇸 🇫🇷 🇮🇹",
  },
];
const aluraProjectsContent = [
  {
    title: "Alura Challenge Front-End",
    period: "2022",
    techList: ["html5", "css3", "javascript"],
    img: "./assets/screens/alura-challenge-front-end.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/alura-challenge-front-end/",
    linkRepo: "https://github.com/lairaalmas/alura-challenge-front-end",
    lang: "🇧🇷",
  },
  {
    title: "Barbearia Alura",
    period: "2022",
    techList: ["html5", "css3", "javascript"],
    img: "./assets/screens/barbearia-alura.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/barbearia-alura",
    linkRepo: "https://github.com/lairaalmas/barbearia-alura",
    lang: "🇧🇷",
  },
  {
    title: "Alura Store",
    period: "2022",
    // grid layout
    techList: ["html5", "css3", "javascript"],
    img: "./assets/screens/alura-store.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/alura-store",
    linkRepo: "https://github.com/lairaalmas/alura-store",
    lang: "🇧🇷",
  },
  {
    title: "Alurinha Plataforma de cursos",
    period: "2022",
    // flexbox
    techList: ["html5", "css3", "javascript"],
    img: "./assets/screens/alurinha-plataforma-cursos.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/alurinha-plataforma-cursos",
    linkRepo: "https://github.com/lairaalmas/alurinha-plataforma-cursos",
    lang: "🇧🇷",
  },
  {
    title: "Apeperia",
    period: "2022",
    // flexbox
    techList: ["html5", "css3", "javascript"],
    img: "./assets/screens/alura-apeperia.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/apeperia",
    linkRepo: "https://github.com/lairaalmas/apeperia",
    lang: "🇧🇷",
  },
  {
    title: "Doguito",
    period: "2022",
    // form validation, API, mask
    techList: ["html5", "css3", "javascript"],
    img: "./assets/screens/alura-doguito.png",
    alt: "Tela do projeto.",
    linkDemo: undefined,
    linkRepo: "https://github.com/lairaalmas/doguito",
    lang: "🇧🇷",
  },
  {
    title: "To-Do List",
    period: "2022",
    // Local storage
    techList: ["html5", "css3", "javascript"],
    img: "./assets/screens/alura-todo.png",
    alt: "Tela do projeto.",
    linkDemo: "https://lairaalmas.github.io/to-do-list/",
    linkRepo: "https://github.com/lairaalmas/to-do-list",
    lang: "🇧🇷",
  },
  // alura bank
  // alura studies
  // ceep
  // performance list
];
const udemyProjectsContent = [
  {
    title: "Expense Tracker",
    period: "2023 - presente",
    techList: ["html5", "css3", "react"],
    img: "./assets/screens/udemy-expense-tracker.png",
    alt: "Tela do projeto.",
    linkDemo: undefined,
    linkRepo: "https://github.com/lairaalmas/udemy-expense-tracker",
    lang: "🇺🇸",
  },
  {
    title: "Goals List",
    period: "2023 - presente",
    techList: ["html5", "css3", "react"],
    img: "./assets/screens/udemy-goals-list.png",
    alt: "Tela do projeto.",
    linkDemo: undefined,
    linkRepo: "https://github.com/lairaalmas/udemy-goals-list",
    lang: "🇺🇸",
  },
  {
    title: "Users List",
    period: "2023 - presente",
    techList: ["html5", "css3", "react"],
    img: "./assets/screens/udemy-user-list.png",
    alt: "Tela do projeto.",
    linkDemo: undefined,
    linkRepo: "https://github.com/lairaalmas/udemy-users-list",
    lang: "🇺🇸",
  },
  {
    title: "Form validation",
    period: "2023 - presente",
    // form validation
    techList: ["html5", "css3", "react"],
    img: "./assets/screens/udemy-form.png",
    alt: "Tela do projeto.",
    linkDemo: undefined,
    linkRepo: "https://github.com/lairaalmas/udemy-form-validation",
    lang: "🇺🇸",
  },
  {
    title: "Page login",
    period: "2023 - presente",
    // localstorage
    techList: ["html5", "css3", "react"],
    img: "./assets/screens/udemy-login.png",
    alt: "Tela do projeto.",
    linkDemo: undefined,
    linkRepo: "https://github.com/lairaalmas/udemy-login",
    lang: "🇺🇸",
  },
  {
    title: "Food order app",
    period: "2023 - presente",
    techList: ["html5", "css3", "react"],
    img: "./assets/screens/udemy-food-app.png",
    alt: "Tela do projeto.",
    linkDemo: undefined,
    linkRepo: "https://github.com/lairaalmas/udemy-food-app",
    lang: "🇺🇸",
  },
];
const rocketseatProjectsContent = [
  {
    title: "Ignite Lab Design System",
    period: "2022",
    techList: ["html5", "tailwindcss", "react", "typescript", "storybook"],
    img: "./assets/screens/rocketseat-ds.png",
    alt: "Tela do projeto.",
    linkDemo: undefined,
    linkRepo: "https://github.com/lairaalmas/rocketseat-design-system",
    lang: "🇧🇷",
  },
];

const returnTechList = (list) => {
  let msg = "";
  list.forEach((item) => {
    msg += `<li class="list-inline-item"><i class="devicon-${item}-plain"></i></li>`;
  });
  return msg;
};

const returnNewElement = (projects) => {
  let content = "";

  projects.forEach((project) => {
    content += `<li class="col-sm-12 col-md-6 col-lg-4">

    <div class="Card shadow">

      <div class="Card__header text-center">

        <img src=${project.img} alt="${project.alt}">

        <div class="Card__header__info container">
          <h4>${project.title}</h4>
        
          <small>(${project.period})</small>
        </div>

      </div>
      
      <div class="Card__content container">

        <div class="Card__content__lang">
          <strong class="me-2">Idiomas:</strong>${project.lang}
        </div>

        <div class="Card__content__tech">
          <strong class="me-2">Tecnologias:</strong> 

          <ul class="d-flex justify-content-start flex-wrap">
            ${returnTechList(project.techList)}
          </ul>
        </div>

      </div>

      <div class="Card__footer">

        <ul class="d-flex gap-2 justify-content-around">
          ${
            project.linkDemo
              ? `<li class="Card__footer__link -demo">
                  <a href=${project.linkDemo}>
                    <i class="bi bi-rocket-takeoff-fill me-2" aria-hidden="true"></i>
                    Demo
                  </a>
                </li>`
              : ""
          }
          <li class="Card__footer__link -repo">
            <a href=${project.linkRepo}>
              <i class="bi bi-code-slash me-2" aria-hidden="true"></i>
              Repositório
            </a>
          </li>
        </ul>

      </div>

    </div>

  </li>`;
  });

  return content;
};

personalProjectsContainer.innerHTML = returnNewElement(personalProjectsContent);
mastersProjectsContainer.innerHTML = returnNewElement(mastersProjectsContent);
aluraProjectsContainer.innerHTML = returnNewElement(aluraProjectsContent);
udemyProjectsContainer.innerHTML = returnNewElement(udemyProjectsContent);
rocketseatProjectsContainer.innerHTML = returnNewElement(
  rocketseatProjectsContent
);
