import { ProblemAttributes } from '../models/problem'
import { ProblemInfoAttributes } from '../models/problem_info'
import { UserAttributes } from '../models/user'
import axios from 'axios'
import { deserializeProblem } from './problems'
import { deserializeProblemStatus } from './problem_info'
import { deserializeUserInfo } from './users'

type leetcodeInfoType = {
  problems: Partial<ProblemAttributes>[],
  userInfo: Partial<UserAttributes>,
  problemInfo: Partial<ProblemInfoAttributes>[]
}

const getLeetcodeProblemData = async(): Promise<leetcodeInfoType>=>{
  const data = (await axios.get('https://leetcode.com/api/problems/algorithms/')).data
  const problems = data.stat_status_pairs
  return {
    problems: problems.map((problem: any) => deserializeProblem(problem)),
    userInfo: deserializeUserInfo(data),
    problemInfo: problems.map((problem: any) => deserializeProblemStatus(problem))
  }
}

export const leetcodeInfo = await getLeetcodeProblemData()