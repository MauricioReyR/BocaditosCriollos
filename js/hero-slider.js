// Slider de imágenes para la sección hero
const heroImages = [
    'images/Arepas_huevo_Trisafica.jpg',
    'images/Combo_Arepas.jpg',
    'images/Combo_valluno.jpg',
    'images/Pipian.jpg',
    'images/Vegetarianas.jpg'
];

let currentHero = 0;

function showHeroImage(index) {
    const img = document.querySelector('.hero-image .floating-card img');
    if (img) {
        img.src = heroImages[index];
    }
}

function nextHeroImage() {
    currentHero = (currentHero + 1) % heroImages.length;
    showHeroImage(currentHero);
}


function startHeroSlider() {
    setInterval(nextHeroImage, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    showHeroImage(currentHero);
    startHeroSlider();
});
