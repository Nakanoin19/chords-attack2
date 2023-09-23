interface Chords {
    name: string;
    component: number[];
    advice: string;
}

declare module "chords.json" {
    const value: Chords[];
    export default value;
}
  