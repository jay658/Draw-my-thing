import { ProblemAttributes, difficulty_type } from "../models/problem"

export const deserializeProblem = (data: any): Partial <ProblemAttributes>=>({
  id: +data.stat.frontend_question_id,
  title: data.stat.question__title,
  difficulty: deserializeProblemDifficulty(data.difficulty.level),
  url: `www.leetcode.com/problems/${data.stat.question_title_slug}`,
  paid_only: data.paid_only,
  total_accepted: data.stat.total_acs,
  total_submitted: data.stat.total_submitted,
})

const deserializeProblemDifficulty =(difficulty: number): difficulty_type=> {
  if(difficulty === 1) return 'easy'
  if(difficulty === 2) return 'medium'
  else return 'hard'
}
