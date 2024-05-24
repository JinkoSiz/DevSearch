'use strict';

document.addEventListener('DOMContentLoaded', () => {

    let searchForm = document.getElementById('searchForm')
    let pageLinks = document.getElementsByClassName('page-link')
    //const searchForm = document.querySelector('#searchForm')
    //const pageLinks = document.querySelector('page-link')

    // Ensure search form exists
    if (searchForm) {
        for (let i = 0; pageLinks.length > i; i++) {
            pageLinks[i].addEventListener('click', function (e) {
                e.preventDefault()
                // Get the data attribute
                let page = this.dataset.page

                // Add search input to form
                searchForm.innerHTML += `<input value=${page} name="page" hidden/>`

                // Submit form
                searchForm.submit()

            })
        }
    }

    let tags = document.getElementsByClassName('project-tag')

    for (let i = 0; tags.length > i; i++) {
        tags[i].addEventListener('click', (e) => {
            let tagId = e.target.dataset.tag
            let projectId = e.target.dataset.project

            fetch('http://127.0.0.1:8000/api/remove-tag/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'project': projectId, 'tag': tagId })
            })
                .then(response => response.json())
                .then(data => {
                    e.target.remove()
                })
        })
    }



    const openPopupBtn = document.querySelector('#popupBtn'),
        closePopupBtn = document.querySelector('.filter-popup-close'),
        acceptPopupBtn = document.querySelector('.filter-popup-accept'),
        bgPopup = document.querySelector('.filter-popup-bg'),
        popupFilterItem = document.querySelectorAll('.filter-popup-value-item'),
        resetBtn = document.querySelector('.filter-popup-reset'),
        popup = document.querySelector('.filter-popup');


    if(openPopupBtn != null) {
        openPopupBtn.addEventListener('click', () => {
            popup.classList.add('active');
            bgPopup.classList.add('active');
        })
    }

    if(resetBtn != null) {
        resetBtn.addEventListener('click', () => {
            popupFilterItem.forEach(item => {
                item.classList.remove('active');
            })
        })
    }
    

    document.addEventListener('click', (e) => {
        e.preventDefault;
        if ((e.target === closePopupBtn || e.target === acceptPopupBtn || e.target === bgPopup) && popup.classList.contains('active')) {
            popup.classList.remove('active');
            bgPopup.classList.remove('active');
        }

    });


    popupFilterItem.forEach(item => {
        if (item != null) {
            item.addEventListener('click', () => item.classList.toggle('active'))
        }
    })


    const slider = document.querySelector('.slider-tabs-block-visible'),
          slides = Array.from(document.querySelectorAll('.slider-tabs-item'))

    let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID = 0,
        currentIndex = 0

    if (slider != null) {
        slider.addEventListener('touchstart', touchStart(0));
        slider.addEventListener('touchend', touchEnd);
        slider.addEventListener('touchmove', touchMove);
        //
        slider.addEventListener('mousedown', touchStart(0));
        slider.addEventListener('mouseup', touchEnd);
        slider.addEventListener('mouseleave', touchEnd);
        slider.addEventListener('mousemove', touchMove);
    
        slides.forEach((slide, index) => {
    
            slide.addEventListener('dragstart', (e) => e.preventDefault());
            //
            slide.addEventListener('touchstart', touchStart(index));
            slide.addEventListener('touchend', touchEnd);
            slide.addEventListener('touchmove', touchMove);
            //
            slide.addEventListener('mousedown', touchStart(index));
            slide.addEventListener('mouseup', touchEnd);
            slide.addEventListener('mouseleave', touchEnd);
            slide.addEventListener('mousemove', touchMove);
    
            slide.addEventListener('click', (e) => {
                if(!isDragging) {
                    removeClass();
                    slide.classList.add('active');
                }
            });
        })
    }

    

    window.oncontextmenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    function removeClass() {
        slides.forEach(item => item.classList.remove('active'));
    }

    function touchStart(index) {
        return function (event) {
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            animationID = requestAnimationFrame(animation);
            slider.classList.add('grabbing');
        }
    }

    function touchEnd() {

        isDragging = false;
        cancelAnimationFrame(animationID);
        setPositionByIndex();
        slider.classList.remove('grabbing');
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    const likeBtn = document.querySelector('.like');

    if (likeBtn != null) {
        likeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            likeBtn.classList.toggle('active');
        });
    }

})


