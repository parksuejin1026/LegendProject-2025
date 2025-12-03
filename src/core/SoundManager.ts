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

    private initAudioContext() {
        if (!this.audioContext) {
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
        // Pitch Variation: 750Hz ~ 850Hz 사이로 랜덤 변화를 주어 자연스럽게 만듦
        const baseFreq = 800;
        const randomFreq = baseFreq + (Math.random() * 100 - 50);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(randomFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
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
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
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

        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.5);
    }
}

export default SoundManager.getInstance();
