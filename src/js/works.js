//thumbnail grid and light box variables
const thumbImgs = document.querySelectorAll('.thumbnails__img');
const thumbImgsArr = Array.from(thumbImgs);
const lastImgIndex = thumbImgsArr.length - 1;

const lightBox = document.querySelector('.light-box');
const displayImg = document.querySelector('.light-box__img-display');
const displayImgTitle = document.querySelector('.display-info__title');
const displayImgMaterial = document.querySelector('.display-info__material');
const displayImgYear = document.querySelector('.display-info__year');
const displayImgDimension = document.querySelector('.display-info__dimension');

const closeIcon = document.querySelector('.display__cross-icon');
const arrowBtns = document.querySelectorAll('.display-btn__arrows');
const leftArrow = document.querySelector('#left');
const rightArrow = document.querySelector('#right');
let activeImgIndex;

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
    displayImgTitle.textContent = displayImg.alt;
    displayImgMaterial.textContent = img.dataset.imgMaterial;
    displayImgYear.textContent = img.dataset.imgYear;
    displayImgDimension.textContent = img.dataset.imgDimension;

    
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
