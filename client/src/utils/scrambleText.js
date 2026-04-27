/**
 * Scramble text effect — types random characters then reveals the real text.
 * Ported from the original portfolio's scramble function.
 */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

export function scrambleText(element, target, duration = 900) {
  if (!element) return;
  let start = null;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const revealed = Math.floor(progress * target.length);
    let text = '';

    for (let i = 0; i < target.length; i++) {
      if (i < revealed) {
        text += target[i];
      } else {
        text += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }

    element.textContent = text;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target;
    }
  };

  requestAnimationFrame(step);
}
