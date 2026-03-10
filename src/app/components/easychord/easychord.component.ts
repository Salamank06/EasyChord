import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChordRequest, PianoKey } from '../../models/chord.model';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-easychord',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './easychord.component.html',
  styleUrl: './easychord.component.css'
})
export class EasyChordComponent implements OnInit {
  selectedRoot = 'Do';
  selectedType: ChordRequest['type'] = 'Mayor';
  selectedOctave = 1;
  selectedSemitone = 12;

  allNotes: readonly string[] = [];
  pianoKeys: PianoKey[] = [];

  constructor(private readonly musicService: MusicService) {}

  ngOnInit(): void {
    this.allNotes = this.musicService.getAllNotes();

    const octaves = 2;
    const notes2Octaves = Array.from({ length: octaves }, () => this.allNotes).flat();

    this.pianoKeys = notes2Octaves.map((note, i) => ({
      note,
      octave: Math.floor(i / this.allNotes.length),
      semitone: i,
      isBlack: note.includes('#'),
      isActive: false
    }));

    // Por defecto, iluminar en la última octava.
    this.selectedOctave = Math.max(...this.pianoKeys.map((k) => k.octave));
    this.selectedSemitone = this.selectedOctave * this.allNotes.length;
    this.updateVisualization();
  }

  async onCalculate(): Promise<void> {
    this.selectedSemitone = this.getSemitoneFromSelection();
    this.updateVisualization();
    await this.playCurrentChord();
  }

  async onKeyPress(key: PianoKey): Promise<void> {
    this.selectedRoot = key.note;
    this.selectedOctave = key.octave;
    this.selectedSemitone = key.semitone;
    this.updateVisualization();
    await this.playCurrentChord();
  }

  private updateVisualization(): void {
    const offsets = this.getChordOffsets(this.selectedType);
    const totalKeys = this.pianoKeys.length;
    const active = new Set<number>(offsets.map((o) => (this.selectedSemitone + o) % totalKeys));
    this.pianoKeys = this.pianoKeys.map((key) => ({
      ...key,
      isActive: active.has(key.semitone)
    }));
  }

  private async playCurrentChord(): Promise<void> {
    const offsets = this.getChordOffsets(this.selectedType);
    const totalKeys = this.pianoKeys.length;
    const baseMidi = 60; // Do4
    const midiNotes = offsets.map((o) => baseMidi + ((this.selectedSemitone + o) % totalKeys));
    await this.musicService.playMidiChord(midiNotes);
  }

  private getChordOffsets(type: ChordRequest['type']): readonly number[] {
    const third = type === 'Mayor' ? 4 : 3;
    return [0, third, 7] as const;
  }

  private getSemitoneFromSelection(): number {
    const noteIndex = this.allNotes.indexOf(this.selectedRoot);
    const base = this.selectedOctave * this.allNotes.length + Math.max(0, noteIndex);
    return Math.min(Math.max(0, base), Math.max(0, this.pianoKeys.length - 1));
  }
}

