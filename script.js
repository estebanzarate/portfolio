const cursor = document.querySelector('.cursor');

const divTech = document.getElementById("divTech"),
    about = document.querySelector(".about"),
    bcGenCont = document.querySelector(".bcGenCont"),
    projects = document.getElementById("projects"),
    divTechP = document.getElementById("divTechP"),
    sectionTech = document.getElementById("tech");

window.addEventListener("scroll", function () {
    let header = this.document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});
about.addEventListener("click", generate);

//Menu navbar toggle media queries
function toggleMenu(e) {
	if (e.target.matches('.toggleMenu')) {
		let menuToggle = document.querySelector(".toggle");
		let menu = document.querySelector(".menu");
		menuToggle.classList.toggle("active");
		menu.classList.toggle("active");
	}
}

for (let i = 1; i <= 1000; i++) {
    const blocks = document.createElement("div");
    blocks.classList.add("block");
    bcGenCont.appendChild(blocks);
}

//About me background
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

//Projects background
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

//Skills background
document.addEventListener("mouseover", (e) => {
    if (e.target.matches(".cara")) {
        divTechP.textContent = e.target.parentNode.parentNode.dataset.tech;
        divTech.style.color = `#${e.target.parentNode.parentNode.dataset.color}`;
        divTech.style.background = `linear-gradient(to top, #${e.target.parentNode.parentNode.dataset.color}, #000,#000)`;
    }
    if (e.target.matches(".fa-brands")) {
        divTechP.textContent =
            e.target.parentNode.parentNode.parentNode.dataset.tech;
        divTech.style.color = `#${e.target.parentNode.parentNode.parentNode.dataset.color}`;
        divTech.style.background = `linear-gradient(to top, #${e.target.parentNode.parentNode.parentNode.dataset.color}, #000,#000)`;
    }
});

//Destello en skills
const destello = () => {
    setInterval(() => {
        const randomWidth = Math.floor(Math.random() * divTech.offsetWidth);
        const randomHeight = Math.floor(Math.random() * divTech.offsetHeight);
        const div = document.createElement("div");
        div.classList.add("destello");
        div.style.top = `${randomHeight}px`;
        div.style.left = `${randomWidth}px`;
        sectionTech.appendChild(div);
        setTimeout(() => {
            div.parentElement.removeChild(div);
        }, 550);
    }, 500);
};

document.addEventListener('mouseover', e => {
	cursor.setAttribute('style', 'top: ' + (e.pageY - 10) + 'px; left: ' + (e.pageX - 10) + 'px;');
});

document.addEventListener("DOMContentLoaded", () => {
    destello();
    generate();
});

document.addEventListener('click', e => {
	toggleMenu(e);
	cursor.classList.add('expand');
	setTimeout(() => {
		cursor.classList.remove('expand');
	}, 500);
});