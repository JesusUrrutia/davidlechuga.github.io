document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelector('.nav-content_list'),
        progressBar = document.querySelector('.progress-view'),
        porcentNumber = document.querySelector('.percentage-number'),
        secListArray = [... document.querySelectorAll('.scroll-container [id][section-scroll]')]

    if (!(navItems && progressBar && porcentNumber && secListArray.length))
        throw "Elementos faltantes en el DOM"

    const navListArray = [... navItems.querySelectorAll('[href]')]        

    if(navListArray.length !== secListArray.length)
        throw `Longitud de elementos en nav lateral y secciones en scroll-container no coincide\n
            items en navbar: ${navListArray.length}\n
            items en contenedor: ${secListArray.length}`
    
    const totalSecs = navListArray.length,
        navPrimary = document.querySelector('.navbar')
    let indexSV = 0,
        wheelAccum = 0,
        YscrollOld,
        isRunScroll = false

    const scrollCheck = (secView, wheelNow) => {
        if((indexSV === 0 && wheelNow === -1) 
        || (indexSV === totalSecs - 1 && Math.round(secView.getBoundingClientRect().top) < -24)){
            YscrollOld = scrollY
            return
        } else if( Math.abs(wheelAccum) < 30) return
        
        if(innerWidth > 1023){
            // con estas desigualdades, se cumple la condicion para hacer scroll
            // if((wheelNow === 1 && Math.round(secView.getBoundingClientRect().bottom) < innerHeight + 2)
            // || (wheelNow === -1 && Math.round(secView.getBoundingClientRect().top) > -2))
            if((wheelNow === 1 && Math.round(secView.getBoundingClientRect().bottom) > innerHeight + 2)
            || (wheelNow === -1 && Math.round(secView.getBoundingClientRect().top) < -2))
                return
        } else {
            if((wheelNow === 1 && Math.round(secView.getBoundingClientRect().bottom) > navPrimary.clientHeight + 2)
            || (wheelNow === -1 && Math.round(secView.getBoundingClientRect().top) < innerHeight - 2))
                return
        }
        indexSV += wheelNow 
        scrollExecute(secListArray[indexSV], navListArray[indexSV], innerWidth < 1024 ? false : true)
    }
    const scrollExecute = (secToView, linkToActive, doScroll = true) => {
        if(doScroll) {
            isRunScroll = true
            smoothScroll.scrollTo(secToView)
        }
        history.replaceState(null,'',linkToActive.getAttribute('href'))
        navListArray[
            navListArray.findIndex(el => el.classList.length > 1)
        ].classList.remove('content_link-active')
        changeDataView(linkToActive)
    }
    const changeDataView = (element) => {
        progressBar.style.height = `${Math.round((indexSV + 1)/totalSecs * 100)}%`
        porcentNumber.textContent = Math.floor((indexSV + 1)/totalSecs * 100)
        element.classList.add('content_link-active')
        YscrollOld = scrollY
    }
    navItems.addEventListener('click', e => {
        if(e.target.getAttribute('href') !== null){
            e.preventDefault()
            if(e.target.getAttribute('href') === location.hash) return
            indexSV = navListArray.findIndex(el => el === e.target)
            scrollExecute(secListArray[indexSV], e.target)
        }
    })
    document.addEventListener('scroll', () => {
        if(!isRunScroll){
            wheelAccum = scrollY - YscrollOld
            indexSV = secListArray.findIndex(el => el.id === location.hash.slice(1))
            scrollCheck(secListArray[indexSV], wheelAccum > 0 ? 1 : -1)
        } else if(Math.round(secListArray[indexSV].getBoundingClientRect().top) === smoothScroll.offsetY){
            YscrollOld = scrollY
            isRunScroll = false
        }
    })

    if(location.hash.length === 0)
        history.replaceState(null,'',navListArray[0].getAttribute('href'))
    else indexSV = navListArray.findIndex(el => 
        el.getAttribute('href') === location.hash)
    changeDataView(navListArray[indexSV])
})