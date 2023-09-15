export const wordbank = ['test', 'hi', 'tree', 'leaf', 'tire', 'man', 'wedding', 'triangle', 'summer', 'magic', 'jumping', 'spacewalk', 'littering', 'raining', 'crying', 'drawing', 'magician', 'murderer', 'gun', 'mountain', 'peak', 'bank', 'shark']

export const getRandom = (num: number, bank: string[]):string[] =>{
  const gameWordSet = new Set<string>();
  
  while(gameWordSet.size < num){
    const word = bank[Math.floor(Math.random() * bank.length)]
    gameWordSet.add(word)
  }
  
  return [...gameWordSet]
}