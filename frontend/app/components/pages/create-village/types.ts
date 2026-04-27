// 村作成フォームのデータ型定義
export interface CreateVillageFormData {
  // 基本情報
  villageName: string;

  // 時間設定
  startDatetime: Date;
  noonSeconds: number;
  voteSeconds: number;
  nightSeconds: number;
  silentHours: number;

  // キャラチップ設定
  charachipIds: number[];
  dummyCharaId: number;

  // 編成
  capacityMin: number;
  capacityMax: number;
  organization: string;
  availableDummySkill: boolean;

  // 詳細ルール
  availableSkillRequest: boolean;
  openSkillInGrave: boolean;
  visibleGraveMessage: boolean;
  availableSuddenlyDeath: boolean;
  availableCommit: boolean;
  availableGuardSameTarget: boolean;

  // 参加パスワード
  joinPassword: string;
}
