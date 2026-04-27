import Skill from '~/@types/skill'

const contain_skills = {
  params: ['skills'],

  validate(value, { skills }) {
    if (value == null || !skills) return true // 空の場合チェックしない
    const skillShortnames: string[] = skillShornames(skills)
    return !containInvalidSkill(value, skillShortnames)
  },

  message() {
    return `不明な役職が存在しています`
  }
}

const dummy_skill = {
  params: ['availableDummySkill'],

  validate(value, { availableDummySkill }) {
    if (availableDummySkill || !value) return true // 役欠けありの場合チェックしない
    return value.split('').includes('村')
  },

  message() {
    return '役欠けなしの場合村人を1名以上含めてください'
  }
}

const person_minmax = {
  validate(value) {
    if (value == null) return true // 空の場合チェックしない
    return value.length >= 5 && value.length <= 999
  },

  message() {
    return `最低5人、最大999人です`
  }
}

const containInvalidSkill = (org: string, skillnames: string[]): boolean => {
  return org.split('').some(o => !skillnames.includes(o))
}

const skillShornames = (skills: Skill[]): string[] => {
  return skills.map(s => s.short_name)
}

export { contain_skills, dummy_skill, person_minmax }
