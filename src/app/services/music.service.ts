import { Injectable } from '@angular/core';
import { ChordRequest } from '../models/chord.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private audioContext: AudioContext | null = null;

  private readonly notes: readonly string[] = [
    'Do',
    'Do#',
    'Re',
    'Re#',
    'Mi',
    'Fa',
    'Fa#',
    'Sol',
    'Sol#',
    'La',
    'La#',
    'Si'
  ] as const;

  getAllNotes(): readonly string[] {
    return this.notes;
  }

  calculateChord(request: ChordRequest): string[] {
    const rootIndex = this.notes.indexOf(request.rootNote);
    if (rootIndex < 0) {
      return [];
    }

    const thirdOffset = request.type === 'Mayor' ? 4 : 3;
    const fifthOffset = 7;

    const thirdIndex = (rootIndex + thirdOffset) % 12;
    const fifthIndex = (rootIndex + fifthOffset) % 12;

    return [this.notes[rootIndex], this.notes[thirdIndex], this.notes[fifthIndex]];
  }

  async playMidiChord(midiNotes: readonly number[], options?: { durationMs?: number; volume?: number }): Promise<void> {
    const durationMs = options?.durationMs ?? 650;
    const volume = options?.volume ?? 0.22;

    if (!midiNotes.length) return;

    const ctx = this.ensureAudioContext();
    if (ctx.state !== 'running') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const end = now + durationMs / 1000;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(volume, now + 0.015);
    master.gain.setTargetAtTime(0.0001, end - 0.08, 0.03);
    master.connect(ctx.destination);

    for (const midi of midiNotes) {
      const freq = this.midiToFrequency(midi);

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1.0, now + 0.01);
      gain.gain.setTargetAtTime(0.0001, end - 0.08, 0.03);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(end);
    }

    setTimeout(() => {
      try {
        master.disconnect();
      } catch {
        // noop
      }
    }, durationMs + 50);
  }

  async playChord(notes: readonly string[], options?: { durationMs?: number; volume?: number }): Promise<void> {
    const durationMs = options?.durationMs ?? 650;
    const volume = options?.volume ?? 0.22;

    if (!notes.length) return;

    const ctx = this.ensureAudioContext();
    if (ctx.state !== 'running') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const end = now + durationMs / 1000;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(volume, now + 0.015);
    master.gain.setTargetAtTime(0.0001, end - 0.08, 0.03);
    master.connect(ctx.destination);

    const rootIndex = this.notes.indexOf(notes[0]);
    const rootMidi = 60 + Math.max(0, rootIndex); // C4 = 60

    for (const note of notes) {
      const idx = this.notes.indexOf(note);
      if (idx < 0 || rootIndex < 0) continue;

      const semisUp = idx >= rootIndex ? idx - rootIndex : idx - rootIndex + 12;
      const midi = rootMidi + semisUp;
      const freq = this.midiToFrequency(midi);

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1.0, now + 0.01);
      gain.gain.setTargetAtTime(0.0001, end - 0.08, 0.03);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(end);
    }

    // Limpieza del master una vez termine.
    setTimeout(() => {
      try {
        master.disconnect();
      } catch {
        // noop
      }
    }, durationMs + 50);
  }

  private ensureAudioContext(): AudioContext {
    if (this.audioContext) return this.audioContext;

    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new Ctx();
    return this.audioContext;
  }

  private midiToFrequency(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
}

