const turnPhases = ["Pick_Word", "Drawing", "End_Of_Round"] as const

const roundPhases = ['Pick_Best_Picture', 'Tallying'] as const

export type Phase = typeof turnPhases[number] | typeof roundPhases[number]