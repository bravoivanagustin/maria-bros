import { Howl } from 'howler';

export class AudioSystem {
  private currentMusic: Howl | null = null;
  private sfxMap: Map<string, Phaser.Sound.BaseSound> = new Map();
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public playMusic(key: string): void {
    this.stopMusic();
    try {
      // Howler music: looks for the file in public/assets/audio/music/<key>.mp3
      // Silently skips if file not found (placeholder phase)
      const sound = new Howl({
        src: [`assets/audio/music/${key}.mp3`, `assets/audio/music/${key}.ogg`],
        loop: true,
        volume: 0.5,
        onloaderror: () => {
          // No audio file yet — no-op during dev
        },
      });
      this.currentMusic = sound;
      sound.play();
    } catch {
      // Graceful degradation: no music during placeholder phase
    }
  }

  public stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  public playSfx(key: string): void {
    // SFX via Phaser native (asset must be loaded in PreloadScene)
    if (this.scene.sound.get(key)) {
      this.scene.sound.play(key);
    }
    // Silently skips if SFX not loaded yet
  }

  public destroy(): void {
    this.stopMusic();
    this.sfxMap.clear();
  }
}
