// 村ステータス定数
export const VILLAGE_STATUS = {
  /** 廃村 */
  CANCEL: "CANCEL",
  /** 終了 */
  COMPLETED: "COMPLETED",
  /** 決着 */
  EPILOGUE: "EPILOGUE",
  /** 進行中 */
  IN_PROGRESS: "IN_PROGRESS",
  /** 募集中 */
  PROLOGUE: "PROLOGUE",
  /** 点呼中 */
  ROLLCALLING: "ROLLCALLING",
} as const;

export type VillageStatusCode = (typeof VILLAGE_STATUS)[keyof typeof VILLAGE_STATUS];

// 村ステータス名称
export const VILLAGE_STATUS_NAME: Record<VillageStatusCode, string> = {
  [VILLAGE_STATUS.CANCEL]: "廃村",
  [VILLAGE_STATUS.COMPLETED]: "終了",
  [VILLAGE_STATUS.EPILOGUE]: "決着",
  [VILLAGE_STATUS.IN_PROGRESS]: "進行中",
  [VILLAGE_STATUS.PROLOGUE]: "募集中",
  [VILLAGE_STATUS.ROLLCALLING]: "点呼中",
};
