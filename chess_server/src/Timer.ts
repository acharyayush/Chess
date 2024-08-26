export default class Timer {
  private seconds: number;
  private timer: NodeJS.Timeout | undefined;
  constructor(sec: number) {
    this.seconds = sec;
  }
  getTime(): number {
    return this.seconds;
  }
  start() {
    this.timer = setInterval(() => {
      this.seconds -= 1;
      if (this.seconds <= 0) clearInterval(this.timer);
    }, 1000);
  }
  pause() {
    clearInterval(this.timer);
  }
}
