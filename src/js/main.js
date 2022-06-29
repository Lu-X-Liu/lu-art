const menuIcon = document.querySelector('.menu');
const navList = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__link');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('menu--active');
    navList.classList.toggle('nav__list--active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('menu--active');
        navList.classList.remove('nav__list--active');
    })
})