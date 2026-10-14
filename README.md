# L’Interstice par Pier Olivier

Responsive massotherapy website, built with HTML, Bootstrap 5 CSS, GSAP, and ScrollTrigger. All fonts, scripts, images, and videos are local assets.

## Preview locally

Run `python3 -m http.server 8879` from this directory, then open http://127.0.0.1:8879.

## Publish

GitHub Pages serves the root of the `main` branch. Pushing an update to `main` publishes the updated site. `.nojekyll` preserves the static files without Jekyll processing.

## Contact and booking

Contact links call Pier Olivier at 819 351-5755. Until an online booking URL is provided, reservation buttons open an informative phone contact popup. Set `BOOKING_URL` in `script.js` when that destination is available.

## Motion

Hero text arrives incrementally with a two-second heading fade. Other reveals and testimonial typing reverse with scroll position. Hero circles draw in a loop, dots respond to mouse or touch, and section dots, the forest, and the hand use gentle parallax. The footer logo blooms in a loop with closed leaf joins. The breathing ribbons are a custom animated SVG.

Reduced-motion preferences preserve static, readable content. Ambient loops pause offscreen or when the tab is hidden.

Design and artwork by Loogart, based on the desktop and mobile Figma designs for L’Interstice.
