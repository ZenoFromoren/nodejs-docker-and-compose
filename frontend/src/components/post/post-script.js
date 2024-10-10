document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    const buttons = document.getElementsByClassName('gallery__button');

    Array.from(buttons).forEach((button) => {
      console.log(button);
      button.addEventListener('click', handleClick);

      if (button.classList.contains('gallery__button-left')) {
        button.style.display = 'none';
      }
    });
  }
});

const handleClick = (e) => {
  const gallery = e.target.closest('.gallery');

  const galleryList = gallery.querySelector('.gallery__list');

  e.target
    .closest('.gallery__button')
    .classList.contains('gallery__button-left')
    ? scroll(galleryList, -galleryList.clientWidth)
    : scroll(galleryList, galleryList.clientWidth);

  if (galleryList.scrollLeft === 0) {
    gallery.querySelector('.gallery__button-left').style.display = 'none';
  } else if (
    galleryList.scrollLeft ===
    galleryList.clientWidth * (galleryList.childElementCount - 1)
  ) {
    gallery.querySelector('.gallery__button-right').style.display = 'none';
  } else {
    gallery.querySelector('.gallery__button-left').style.display = 'flex';
    gallery.querySelector('.gallery__button-right').style.display = 'flex';
  }
};

const scroll = (galleryList, length) => {
  galleryList.scrollBy({ left: length });
};
