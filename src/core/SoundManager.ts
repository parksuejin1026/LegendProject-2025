/**
 * SoundManager
 *
 * Web Audio API를 사용하여 게임 효과음을 생성하고 재생합니다.
 * 외부 오디오 파일 없이 코드로 소리를 합성합니다.
 */
class SoundManager {
    private audioContext: AudioContext | null = null;
    private static instance: SoundManager;
    private isMuted: boolean = false;
    private volume: number = 0.5; // 기본 볼륨 50%

    private constructor() { }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public setMute(muted: boolean) {
        this.isMuted = muted;
    }

    public getMute(): boolean {
        return this.isMuted;
    }

    public setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    public getVolume(): number {
        return this.volume;
    }

    private initAudioContext() {
        if (!this.audioContext) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    /**
     * 돌을 놓을 때 나는 소리 (짧고 둔탁한 소리)
     */
    public playPlaceStone() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // 나무판에 돌이 부딪히는 느낌 (낮은 주파수, 빠른 감쇠)
        const baseFreq = 800;
        const randomFreq = baseFreq + (Math.random() * 100 - 50);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(randomFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

        // 볼륨 적용
        const gainValue = 0.5 * this.volume;
        gainNode.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    /**
     * 승리 팡파레 (밝고 경쾌한 소리)
     */
    public playWin() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // 도-미-솔-도 아르페지오
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.audioContext!.createOscillator();
            const gain = this.audioContext!.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext!.destination);

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const startTime = now + i * 0.1;
            const peakGain = 0.3 * this.volume; // 볼륨 적용

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });
    }

    /**
     * 패배 소리 (낮고 슬픈 소리)
     */
    public playLose() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.5);

        const startGain = 0.3 * this.volume; // 볼륨 적용
        gain.gain.setValueAtTime(startGain, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.5);
    }

    public playBGM() {
        // 배경음악 제거 요청으로 인해 기능 비활성화
    }

    public stopBGM() {
        // 배경음악 제거 요청으로 인해 기능 비활성화
    }
}

export default SoundManager.getInstance();
