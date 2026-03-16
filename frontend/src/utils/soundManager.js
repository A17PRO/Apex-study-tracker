class SoundManager {
    constructor() {
        this.sounds = {};
    }

    play(name, src, volume = 0.5) {
        if (!this.sounds[name]) {
            const audio = new Audio(src);
            audio.loop = true;
            audio.volume = volume;
            audio.play().catch(() => { });
            this.sounds[name] = audio;
        }
    }

    stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            delete this.sounds[name];
        }
    }

    setVolume(name, volume) {
        if (this.sounds[name]) {
            this.sounds[name].volume = volume;
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(audio => audio.pause());
        this.sounds = {};
    }
}

export default new SoundManager();