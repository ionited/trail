import styles from './scss/index.scss';
import { Step, TrailStep } from './step';

export class TrailCore {
  step: TrailStep;
  steps: Step[];

  private stepId = null;
  private trail?: HTMLElement;

  constructor(steps?: Step[]) {
    this.addStyles();
    this.addWrapper();

    this.steps = steps ?? [];
    this.step = new TrailStep(this.steps);
  }

  back() {
    this.stepId = this.step.back(this.stepId);
  }

  next() {
    this.stepId = this.step.next(this.stepId);
  }

  stop() {
    const
      backdrop = this.trail?.querySelector('.trail-backdrop') as HTMLElement,
      content = this.trail?.querySelector('.trail-content') as HTMLElement;

    backdrop.classList.remove('visible');
    backdrop.classList.remove('interactive');
    content.classList.remove('visible');

    document.body.classList.remove('trail-body');

    setTimeout(() => {
      backdrop.classList.remove('show');
      content.classList.remove('show');
    });
  }

  destroy() {
    document.getElementById('trail-styles')?.remove();

    document.body.classList.remove('trail-body');

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
    const trail = document.querySelector('.trail') as HTMLElement;

    if (trail) return this.trail = trail;

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
