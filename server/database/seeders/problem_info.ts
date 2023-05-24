import { ProblemInfoAttributes } from '../models/problem_info'

export const deserializeProblemStatus =(problem:any): Partial<ProblemInfoAttributes> => ({
  problem_id: +problem.stat.frontend_question_id,
  status: problem.status
})
