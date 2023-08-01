export interface Step {
  id: any;
  content: HTMLElement | string;
  attachedEl?: HTMLElement | null;
  interactive?: boolean;
}

export class TrailStep {

  steps: Step[];

  private backdrop: HTMLElement;
  private content: HTMLElement;
  private currentStep: Step | undefined;
  private trail: HTMLElement;
  private updateFunc: Function = this.update.bind(this);

  constructor(steps: Step[]) {
    this.backdrop = document.querySelector('.trail .trail-backdrop') as HTMLElement;
    this.content = document.querySelector('.trail .trail-content') as HTMLElement;
    this.trail = document.querySelector('.trail') as HTMLElement;
    this.steps = steps;

    this.listeners();
  }

  back(currentId: any) {
    const step = currentId === null ? this.steps[0] : this.steps[this.getStepIndex(currentId) - 1];

    return this.move(currentId, step);
  }

  next(currentId: any) {
    const step = currentId === null ? this.steps[0] : this.steps[this.getStepIndex(currentId) + 1];

    return this.move(currentId, step);
  }

  move(currentId: any, step: Step) {
    if (!step) return currentId;

    this.removeLast();

    document.body.classList.add('trail-body');

    step.attachedEl?.classList.add('trail-target');

    this.backdrop.classList.toggle('interactive', step.interactive || step.interactive === undefined);

    if (!this.content.classList.contains('show')) {
      const rect = this.getRect(step);

      this.stepPosition(rect);
    }

    this.backdrop.classList.add('show');

    if (typeof step.content === 'string') this.content.classList.add('show');
    else step.content.classList.add('show');

    setTimeout(() => this.backdrop.classList.add('visible'));

    if (step.attachedEl) {
      const rect = this.getRect(step);

      this.scroll(rect);
      this.stepPosition(rect);
    } else {
      this.backdrop.style.width = '0';
      this.backdrop.style.height = '0';
    }

    this.content.classList.remove('visible');

    setTimeout(() => {
      if (typeof step.content === 'string') {
        this.content.innerHTML = step.content;
        this.content.classList.add('visible');
      } else step.content.classList.add('visible');

      if (step.attachedEl) {
        const rect = this.getRect(step);

        this.contentPosition(step, rect);
      } else this.contentPosition(step);
    }, 250);

    this.currentStep = step;

    return step.id;
  }

  private getRect(step: Step) {
    return (step.attachedEl as HTMLElement).getBoundingClientRect();
  }

  private getStepIndex(currentId: any) {
    for (let i = 0; i < this.steps.length; i++) {
      if (this.steps[i].id === currentId) return i; 
    }

    return 0;
  }

  private scroll(rect: DOMRect) {
    let top = scrollY + rect.top - window.innerHeight + rect.height + 16;

    top = top > 0 ? top : 0;

    window.scrollTo({ top, behavior: 'smooth' });
  }

  private stepPosition(rect: DOMRect) {
    const
      x = rect.x + rect.width >= 0 ? rect.x : -rect.width - 16,
      y = rect.y + rect.height >= 0 ? rect.y : -rect.height - 16,
      vmax = Math.max(window.innerWidth, window.innerHeight),
      tx = -vmax + x,
      ty = -vmax + y;

    this.backdrop.style.width = rect.width + 'px';
    this.backdrop.style.height = rect.height + 'px';

    this.backdrop.style.transform = `translate(${tx > 0 ? 0 : rect.left < -rect.width ? -window.innerWidth - Math.ceil(rect.width) : tx}px, ${ty > 0 ? 0 : rect.top < -rect.height ? -window.innerHeight - Math.ceil(rect.height) : ty}px)`;
  }

  private contentPosition(step: Step, rect?: DOMRect) {
    const contentRect = (typeof step.content === 'string' ? this.content : step.content).getBoundingClientRect();

    let
      x = 0,
      y = 0;

    if (step.attachedEl && rect) {
      if (rect.x > window.innerWidth / 2) x = rect.x - contentRect.width - 16;
      else x = rect.right + 16;

      if (rect.y > window.innerHeight / 2) y = rect.y - contentRect.height - 16;
      else y = rect.bottom + 16;
    } else {
      x = window.innerWidth / 2 - contentRect.width / 2;
      y = window.innerHeight / 2 - contentRect.height / 2;
    }

    if (typeof step.content === 'string') this.content.style.translate = `${x}px ${y}px`;
    else step.content.style.translate = `${x}px ${y}px`;
  }

  private listeners() {
    window.addEventListener('scroll', this.updateFunc as any, true);
  }

  private removeLast() {
    document.querySelectorAll('.trail-target').forEach(q => q.classList.remove('trail-target'));
    document.querySelectorAll('.trail-step').forEach(q => q.classList.remove('visible'));
  }

  private update() {
    if (!this.currentStep) return;

    this.trail.classList.add('no-transition');

    if (this.currentStep.attachedEl) {
      const rect = this.getRect(this.currentStep);
      
      this.stepPosition(rect);
      this.contentPosition(this.currentStep, rect);
    } else this.contentPosition(this.currentStep);

    this.trail.classList.remove('no-transition');
  }
  
}
