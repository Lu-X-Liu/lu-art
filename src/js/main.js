//header variables
const menuIcon = document.querySelector('.menu');
const navList = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__link');

//thumbnail grid and light box variables
const thumbImgs = document.querySelectorAll('.thumbnails__img');
const thumbImgsArr = Array.from(thumbImgs);
const lastImgIndex = thumbImgsArr.length - 1;

const lightBox = document.querySelector('.light-box');
const displayImg = document.querySelector('.light-box__img-display');
const closeIcon = document.querySelector('.display__cross-icon');
const arrowBtns = document.querySelectorAll('.display-btn__arrows');
const leftArrow = document.querySelector('#left');
const rightArrow = document.querySelector('#right');
let activeImgIndex;

//header event listeners
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

//thumbnail and light box functions
function showLightBox() {
    lightBox.classList.add('active');
};

function hideLightBox() {
    lightBox.classList.remove('active');
};

function setActiveImg(img) {
    displayImg.srcset = img.dataset.imgSrcset;
    displayImg.src = img.dataset.imgSrc;  
    displayImg.alt = img.alt.replace(' Thumbnail Image', '');
    
    activeImgIndex = thumbImgsArr.indexOf(img);
    switch (activeImgIndex) {
        case 0: 
            leftArrow.classList.add('inactive');
            rightArrow.classList.remove('inactive');
            break;
        case lastImgIndex:
            rightArrow.classList.add('inactive');
            leftArrow.classList.remove('inactive');
            break;
        default:
            arrowBtns.forEach(btn => {
                btn.classList.remove('inactive');    
                removeBtnFocus(btn);          
            });
    }
};

function removeBtnFocus(btn) {
    btn.blur();
}

function unsetActiveImg() {
    displayImg.srcset = '';
    displayImg.src = ''; 
    displayImg.alt = '';   
};

function transitionSlideLeft() {
    leftArrow.focus();
    activeImgIndex === 0 ? setActiveImg(thumbImgsArr[lastImgIndex]) :
    setActiveImg(thumbImgsArr[activeImgIndex - 1]);
};

function transitionSlideRight() {
    rightArrow.focus();
    activeImgIndex === lastImgIndex ? setActiveImg(thumbImgsArr[0]) :
    setActiveImg(thumbImgsArr[activeImgIndex + 1]);
};

function transitionSlideHandler(arrowId) {
    arrowId.includes('left') ? transitionSlideLeft() : transitionSlideRight();
};

//thumbnail and light box event listeners
thumbImgs.forEach(img => {
    img.addEventListener('click', (e) => {
        showLightBox();
        setActiveImg(img);
    })
});

closeIcon.addEventListener('click', ()=> {
    hideLightBox();
    unsetActiveImg();
});

arrowBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        transitionSlideHandler(e.currentTarget.id)
    })
});

window.addEventListener('keydown', (e) => {
   if (e.key.includes('Right') || e.key.includes('Left')) {
       e.preventDefault();
       transitionSlideHandler(e.key.toLocaleLowerCase());
   };
})
