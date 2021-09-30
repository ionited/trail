import styles from './scss/index.scss';
import { Step, TrailStep } from './step';

export class TrailCore {

  steps: Step[];

  private stepId = null;
  private trail?: HTMLElement;

  constructor(steps?: Step[]) {
    this.steps = steps ?? [];

    this.addStyles();
    this.addWrapper();
  }

  back() {
    const step = new TrailStep(this.steps);

    this.stepId = step.back(this.stepId);
  }

  next() {
    const step = new TrailStep(this.steps);

    this.stepId = step.next(this.stepId);
  }

  stop() {
    const
      backdrop = this.trail?.querySelector('.trail-backdrop') as HTMLElement,
      content = this.trail?.querySelector('.trail-content') as HTMLElement
    ;

    backdrop.classList.remove('visible');
    content.classList.remove('visible');

    backdrop.ontransitionend = () => {
      backdrop.classList.remove('show');
      content.classList.remove('show');

      backdrop.ontransitionend = null;
    }
  }

  destroy() {
    document.getElementById('trail-styles')?.remove();

    this.trail?.remove();
    this.trail = undefined;
  }

  private addStyles() {
    if (document.getElementById('trail-styles')) return;

    const style = document.createElement('style');

    style.id = 'trail-styles';
    style.innerText = styles;

    document.head.appendChild(style);
  }

  private addWrapper() {
    if (document.querySelector('.trail')) return;

    const wrapper = document.createElement('div');

    wrapper.className = 'trail';
    wrapper.innerHTML = `
      <div class="trail-backdrop"></div>
      <div class="trail-content"></div>
    `;

    document.body.appendChild(wrapper);

    this.trail = wrapper;
  }

}
