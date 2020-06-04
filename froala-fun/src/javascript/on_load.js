export const froalaBanner = (e) => {
  const froalaBanner = document.querySelectorAll('.fr-wrapper');
  froalaBanner.forEach( banner => {
    if (banner.firstElementChild.firstElementChild.nodeName === "A") {
      banner.firstElementChild.style.display = "none";
    }
  })
}
