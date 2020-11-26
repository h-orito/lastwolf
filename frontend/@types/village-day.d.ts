import NoonNight from '~/@types/noon-night'

interface VillageDay {
  id: number
  day: number
  noon_night: NoonNight
  epilogue: boolean
  start_datetime: string
  end_datetime: string
}

export default VillageDay
