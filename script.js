window.addEventListener("scroll", function () {
    let header = this.document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});

setInterval(() => generate(), 3000);

window.addEventListener("load", () => {
    generate();
});

function toggleMenu() {
    let menuToggle = document.querySelector(".toggle");
    let menu = document.querySelector(".menu");
    menuToggle.classList.toggle("active");
    menu.classList.toggle("active");
}

const about = document.querySelector(".about"),
    bcGenCont = document.querySelector(".bcGenCont");
about.addEventListener("click", generate);

for (let i = 1; i <= 1000; i++) {
    const blocks = document.createElement("div");
    blocks.classList.add("block");
    bcGenCont.appendChild(blocks);
}

function generate() {
    anime({
        targets: ".block",
        translateX: function () {
            return anime.random(-950, 950);
        },
        translateY: function () {
            return anime.random(-950, 950);
        },
        scale: function () {
            return anime.random(1, 4);
        },
    });
}

const projects = document.getElementById("projects");
document.addEventListener("mouseover", (e) => {
    if (e.target.matches(".iframeLink")) {
        if (projects.firstElementChild.classList.contains("ifra")) {
            projects.removeChild(projects.firstElementChild);
        }
        const href = e.target.parentNode.href;
        const iframe = document.createElement("iframe");
        iframe.src = href;
        iframe.classList.add("ifra");
        projects.insertAdjacentElement("afterbegin", iframe);
    }
});

const divTech = document.getElementById("divTech");
document.addEventListener("mouseover", (e) => {
    if (e.target.matches(".cara")) {
        divTech.textContent = e.target.parentNode.parentNode.dataset.tech;
        divTech.style.color = `#${e.target.parentNode.parentNode.dataset.color}`;
        divTech.style.background = `linear-gradient(to top, #${e.target.parentNode.parentNode.dataset.color}, #000,#000)`;
    }
    if (e.target.matches(".fa-brands")) {
        divTech.textContent =
            e.target.parentNode.parentNode.parentNode.dataset.tech;
        divTech.style.color = `#${e.target.parentNode.parentNode.parentNode.dataset.color}`;
        divTech.style.background = `linear-gradient(to top, #${e.target.parentNode.parentNode.parentNode.dataset.color}, #000,#000)`;
    }
});
