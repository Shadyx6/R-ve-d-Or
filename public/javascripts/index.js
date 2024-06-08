const rightButton = document.querySelector('.s-right');
const leftButton = document.querySelector('.s-left');
const sContainer = document.querySelector('.s-container');

function scrollContent(amount) {
  let currentScroll = sContainer.scrollLeft;
  let newScroll = Math.min(Math.max(currentScroll + amount, 0), sContainer.scrollWidth - sContainer.clientWidth);
  function scrollStep() {
    currentScroll = Math.min(Math.max(currentScroll, 0), sContainer.scrollWidth - sContainer.clientWidth);
    const distance = Math.abs(newScroll - currentScroll);


    if (distance > 1) {
      currentScroll += (newScroll - currentScroll) / 10;
      sContainer.scrollLeft = currentScroll;
      requestAnimationFrame(scrollStep);
    }
  }

  scrollStep();
}

rightButton.addEventListener('click', () => scrollContent(150));
leftButton.addEventListener('click', () => scrollContent(-150));




const cards = document.querySelectorAll('.cards')
cards.forEach((card) => {
  const image2 = card.querySelector('.image2')
  card.addEventListener('mouseenter', (e) => {
    image2.style.opacity = 1
  })
  card.addEventListener('mouseleave', (e) => {
    image2.style.opacity = 0
  })
})
const container = document.querySelector('.mens-container')
container.addEventListener('mouseover', (e) => {
  document.querySelector('.mens-text').style.color = 'white'
})
container.addEventListener('mouseout', (e) => {
  document.querySelector('.mens-text').style.color = 'black'
})

function animations() {
  let tl = gsap.timeline()
  gsap.to('.link span', {
    duration: 1,
    x:15,
    repeat: -1,
  })
  const glamText = document.querySelector('.glam-text');
  tl.from('.glam', {
    duration: 1,
    y:20,
    opacity: 0,
    })
tl.from(glamText, {
  duration: 1,
  opacity: 0,
  x: 50,
  stagger: 0.1,
  ease: 'expo.inOut'
})

tl.from('.link', {
  opacity: 0,
  duration: 1,
  y:20,
  ease: 'power2.out'
})



  gsap.from('.list li', {
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.1,
    ease: 'expo.inOut'
  })
  const box = document.querySelector('.glamdiv')
  box.addEventListener('mouseenter', (e) => {
    gsap.to('.glam', {
      duration: .5,
      y: 700,
    })
    if (window.innerWidth <= 768) {
      gsap.to('.glamhover', {
        y: -280,
        duration: .5,
        opacity: 1,
      })
    } else {
      gsap.to('.glamhover', {
        y: -400,
        duration: .5,
        opacity: 1,
      })
    
  }
  }
  )

  box.addEventListener('mouseleave', (e) => {
    gsap.to('.glam', {
      duration: .5,
      y: 0,
    })
    gsap.to('.glamhover', {
      duration: .5,
      opacity: 0,

      y: 1000
    })
  })
  
}
animations()
