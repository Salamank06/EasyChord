export interface ChordRequest {
  rootNote: string;
  type: 'Mayor' | 'Menor';
}

export interface PianoKey {
  note: string;
  octave: number;
  semitone: number;
  isBlack: boolean;
  isActive: boolean;
}

