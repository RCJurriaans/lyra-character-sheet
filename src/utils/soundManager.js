// Sound Manager for character sheet interactions
// Provides audio feedback for important events

class SoundManager {
  constructor() {
    this.enabled = true
    this.volume = 0.5
    this.sounds = {
      'coin-flip': this.createTone(800, 0.1, 'sine'),
      'dice-roll': this.createTone(400, 0.2, 'sine'),
      'whoosh': this.createTone(600, 0.15, 'sine'),
      'level-up': this.createTone(1200, 0.3, 'sine')
    }
  }

  createTone(frequency, duration, type = 'sine') {
    return { frequency, duration, type }
  }

  playSound(name) {
    if (!this.enabled) return

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const sound = this.sounds[name]

      if (!sound) {
        console.warn(`Sound ${name} not found`)
        return
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = sound.type
      oscillator.frequency.value = sound.frequency
      gainNode.gain.value = this.volume

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + sound.duration)
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value))
  }

  toggleMute() {
    this.enabled = !this.enabled
  }

  setEnabled(enabled) {
    this.enabled = enabled
  }
}

export const soundManager = new SoundManager()
