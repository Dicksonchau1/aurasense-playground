import { HandwashStep } from "./types";

export const HANDWASH_STEPS: HandwashStep[] = [
  { id: "palm_to_palm", title: "Palm to palm", instruction: "Rub palm to palm.", targetSeconds: 4 },
  { id: "dorsum", title: "Right palm over left dorsum and vice versa", instruction: "Rub right palm over left dorsum and vice versa.", targetSeconds: 4 },
  { id: "fingers_interlaced", title: "Palm to palm with fingers interlaced", instruction: "Rub palm to palm with fingers interlaced.", targetSeconds: 3 },
  { id: "backs_of_fingers", title: "Backs of fingers to opposing palms with fingers interlocked", instruction: "Rub backs of fingers to opposing palms with fingers interlocked.", targetSeconds: 3 },
  { id: "thumbs", title: "Rotational rubbing of thumbs", instruction: "Rub each thumb rotationally.", targetSeconds: 3 },
  { id: "fingertips", title: "Rotational rubbing of fingertips in palms", instruction: "Rub fingertips rotationally in palms.", targetSeconds: 3 },
  { id: "wrists", title: "Wrist coverage / final coverage", instruction: "Rub wrists and finish coverage.", targetSeconds: 4 },
];
