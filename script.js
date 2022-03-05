window.addEventListener("scroll", function () {
    let header = this.document.querySelector("header");
    header.classList.toggle('sticky', window.scrollY > 0);
});

window.addEventListener('load', generate);

function toggleMenu() {
    let menuToggle = document.querySelector('.toggle');
    let menu = document.querySelector('.menu');
    menuToggle.classList.toggle('active');
    menu.classList.toggle('active');
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
            return anime.random(-700, 700)
        },
        translateY: function () {
            return anime.random(-700, 700)
        },
        scale: function () {
            return anime.random(1, 4)
        }
    })
}