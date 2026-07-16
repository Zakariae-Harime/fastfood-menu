export function lockPageScroll() {
  const scrollY = window.scrollY
  const bodyStyle = document.body.style
  const rootStyle = document.documentElement.style
  const previousBodyStyle = {
    overflow: bodyStyle.overflow,
    position: bodyStyle.position,
    top: bodyStyle.top,
    width: bodyStyle.width,
  }
  const previousScrollBehavior = rootStyle.scrollBehavior

  rootStyle.scrollBehavior = 'auto'
  bodyStyle.overflow = 'hidden'
  bodyStyle.position = 'fixed'
  bodyStyle.top = `-${scrollY}px`
  bodyStyle.width = '100%'

  return () => {
    bodyStyle.overflow = previousBodyStyle.overflow
    bodyStyle.position = previousBodyStyle.position
    bodyStyle.top = previousBodyStyle.top
    bodyStyle.width = previousBodyStyle.width
    window.scrollTo(0, scrollY)
    rootStyle.scrollBehavior = previousScrollBehavior
  }
}
