/**
 * navfade.js
 */
{
  setTimeout(() => document.body.classList.add('render'), 60);
  const navDemos = Array.from(document.querySelectorAll('nav.demos > .demo'));
  const total = navDemos.length;
  const current = navDemos.findIndex(el => el.classList.contains('demo--current'));
  const navigate = (linkEl) => {
    document.body.classList.remove('render');
    document.body.addEventListener('transitionend', () => window.location = linkEl.href);
  };
  navDemos.forEach(link => link.addEventListener('click', (ev) => {
    ev.preventDefault();
    navigate(ev.target);
  }));
}
