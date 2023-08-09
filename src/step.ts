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

    this.backdrop.classList.add('show');

    this.content.classList.add('show');

    setTimeout(() => this.backdrop.classList.add('visible'));

    if (step.attachedEl) {
      const rect = this.getRect(step);

      this.scroll(rect);
      this.backdropPosition(step, rect);
    } else this.backdropPosition(step);

    this.content.classList.remove('visible');

    setTimeout(() => {
      if (typeof step.content === 'string') this.content.innerHTML = step.content;
      else {
        this.content.innerHTML = '';
        this.content.appendChild(step.content);
      }

      this.content.classList.add('visible');

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

  private backdropPosition(step: Step, rect?: DOMRect) {
    const
      x = rect ? rect.x + rect.width >= 0 ? rect.x : -rect.width - 16 : window.innerWidth / 2,
      y = rect ? rect.y + rect.height >= 0 ? rect.y : -rect.height - 16 : window.innerHeight / 2;

    this.backdrop.style.width = (rect ? rect.width : 0) + 'px';
    this.backdrop.style.height = (rect ? rect.height : 0) + 'px';
    this.backdrop.style.borderRadius = step.attachedEl ? getComputedStyle(step.attachedEl).borderRadius : '0px';

    this.backdrop.style.transform = `translate(${x}px, ${y}px)`;
  }

  private contentPosition(step: Step, rect?: DOMRect) {
    const contentRect = this.content.getBoundingClientRect();

    let
      x = 0,
      y = 0;

    if (step.attachedEl && rect) {
      if (rect.x > window.innerWidth / 2) x = rect.x - contentRect.width - 16;
      else x = rect.right + 16;

      if (rect.y > window.innerHeight / 2) y = rect.y - contentRect.height - 16;
      else y = rect.bottom + 16;

      x = x + contentRect.width >= window.innerWidth ? window.innerWidth - contentRect.width - 16 : x < 16 ? 16 : x;
    } else {
      x = window.innerWidth / 2 - contentRect.width / 2;
      y = window.innerHeight / 2 - contentRect.height / 2;
    }

    this.content.style.translate = `${x}px ${y}px`;
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

    const rect = this.currentStep.attachedEl ? this.getRect(this.currentStep) : undefined;

    this.backdropPosition(this.currentStep, rect);
    this.contentPosition(this.currentStep, rect);

    this.trail.classList.remove('no-transition');
  }
  
}
