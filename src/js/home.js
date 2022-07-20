//select more info btn and paragraph
const moreInfoBtn = document.querySelector('.hero__more-info');
const moreInfoPara = document.querySelector('.hero__para');
const heroImg = document.querySelector('.hero__img');

//open more info paragraph
function showMoreInfo() {
    const heroImgBound = heroImg.getBoundingClientRect();
    const scrollDistance = heroImgBound.bottom;
    if (heroImgBound.width < 400) {
        heroImg.style.maxWidth = heroImgBound.width + 'px';
    };
    moreInfoPara.style.maxWidth = heroImgBound.width + 'px';
    moreInfoPara.style.display = 'block';
    window.scrollTo(0, scrollDistance);
};

moreInfoBtn.addEventListener('click', () => {
    showMoreInfo()
    moreInfoBtn.blur();
});

heroImg.addEventListener('click', () => showMoreInfo());