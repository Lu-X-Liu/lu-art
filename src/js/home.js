//select more info btn and paragraph
const moreInfoBtn = document.querySelector('.hero__more-info');
const moreInfoPara = document.querySelector('.hero__para');
const heroImg = document.querySelector('.hero__img');

//open more info paragraph
function showMoreInfo() {
    const heroImgBound = heroImg.getBoundingClientRect();
    moreInfoPara.style.maxWidth = heroImgBound.width + 'px';
    moreInfoPara.style.display = 'block';
    moreInfoPara.scrollIntoView();
};

moreInfoBtn.addEventListener('click', () => {
    showMoreInfo()
    moreInfoBtn.blur();
});

heroImg.addEventListener('click', () => showMoreInfo());