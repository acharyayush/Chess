import EventEmitter from 'events';
import { TIMEUP } from './events';
export default class Timer extends EventEmitter {
  private totalTime: number;
  private seconds: number;
  private timer: NodeJS.Timeout | null;
  constructor(sec: number) {
    super();
    this.seconds = sec;
    this.totalTime = sec;
    this.timer = null;
  }
  getTime(): number {
    return this.seconds;
  }
  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.seconds -= 1;
      if (this.seconds <= 0) {
        this.pause();
        this.emit(TIMEUP);
      }
    }, 1000);
  }
  pause() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }
  resetTimer() {
    if (this.timer) this.pause();
    this.seconds = this.totalTime;
  }
}
