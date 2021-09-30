export interface Step {
  id: any;
  content: string;
  attachedEl?: HTMLElement | null;
}

export class TrailStep {

  steps: Step[];

  private backdrop: HTMLElement;
  private content: HTMLElement;
  private trail: HTMLElement;
  private updateFunc?: Function;

  constructor(steps: Step[]) {
    this.backdrop = document.querySelector('.trail .trail-backdrop') as HTMLElement;
    this.content = document.querySelector('.trail .trail-content') as HTMLElement;
    this.trail = document.querySelector('.trail') as HTMLElement;
    this.steps = steps;
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

    if (this.updateFunc) this.removeListeners();

    this.backdrop.classList.add('show');
    this.content.classList.add('show');

    if (this.content.classList.contains('visible')) {
      this.content.classList.remove('visible');
      this.content.ontransitionend = () => {
        this.content.innerHTML = step.content;
        this.content.classList.add('visible');
      }
    } else {
      this.content.innerHTML = step.content;

      setTimeout(() => this.content.classList.add('visible'));
    }

    setTimeout(() => this.backdrop.classList.add('visible'));

    if (step.attachedEl) {
      this.scroll(
        this.getRect(step),
        () => {
          const rect = this.getRect(step);

          this.stepPosition(rect);
          this.contentPosition(step, rect);
        }
      );
    } else this.contentPosition(step);

    this.updateFunc = this.update.bind(this, step);
    this.listeners();

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

  private scroll(rect: DOMRect, afterScroll: Function) {
    let start: number;

    const scrollY = window.scrollY;

    let scroll = scrollY + rect.top - window.innerHeight + rect.height + 16;

    scroll = scroll > 0 ? scroll : 0;

    const callback = (timestamp: number) => {
        if (!start) start = timestamp;

        const progress = timestamp - start;

        if (scrollY > scroll) window.scrollTo(0, scrollY - (((scroll > 0 ? 0 : scrollY) + scroll) * progress / 250));
        else window.scrollTo(0, scrollY + ((scroll + scrollY) * progress / 250));

        if (progress < 250) requestAnimationFrame(callback);
        else {
          window.scrollTo(0, scroll);
          
          afterScroll();
        }
      }
    ;

    requestAnimationFrame(callback);
  }

  private stepPosition(rect: DOMRect) {
    const
      x = rect.x + rect.width >= 0 ? rect.x : -rect.width - 16,
      y = rect.y + rect.height >= 0 ? rect.y : -rect.height - 16
    ;

    this.backdrop.style.transform = `translate(${x}px, ${y}px)`;
    this.backdrop.style.width = rect.width + 'px';
    this.backdrop.style.height = rect.height + 'px';
  }

  private contentPosition(step: Step, rect?: DOMRect) {
    const contentRect = this.content.getBoundingClientRect();

    let
      x = 0,
      y = 0
    ;

    if (step.attachedEl && rect) {
      if (rect.x > window.innerWidth / 2) x = rect.x - contentRect.width - 16;
      else x = rect.right + 16;

      if (rect.y > window.innerHeight / 2) y = rect.y - contentRect.height - 16;
      else y = rect.bottom + 16;
    } else {
      x = window.innerWidth / 2 - contentRect.width / 2;
      y = window.innerHeight / 2 - contentRect.height / 2;
    }

    this.content.style.transform = `translate(${x}px, ${y}px)`;
  }

  private listeners() {
    window.addEventListener('scroll', this.updateFunc as any, true);
  }

  private removeListeners() {
    window.removeEventListener('scroll', this.updateFunc as any, true);

    this.updateFunc = undefined;
  }

  private update(step: Step) {
    this.trail.classList.add('no-transition');

    if (step.attachedEl) {
      const rect = this.getRect(step);
      
      this.stepPosition(rect);
      this.contentPosition(step, rect);
    } else this.contentPosition(step);

    this.trail.classList.remove('no-transition');
  }
  
}
