// API型定義のラッパー - 自動生成されたschema.tsを使用
import type { components } from "./schema";

// 能力関連型
export type AbilityType = components["schemas"]["AbilityType"];
export type AbilityTypes = components["schemas"]["AbilityTypes"];

// キャラクター関連型
export type CharaImage = components["schemas"]["CharaImage"];
export type CharaNameView = components["schemas"]["CharaNameView"];
export type CharaName = components["schemas"]["CharaName"];
export type CharaView = components["schemas"]["CharaView"];
export type Chara = components["schemas"]["Chara"];

// キャラチップ関連型
export type CharachipView = components["schemas"]["CharachipView"];
export type CharachipsView = components["schemas"]["CharachipsView"];
export type Designer = components["schemas"]["Designer"];
export type VillageCharachip = components["schemas"]["VillageCharachip"];

// メッセージ関連型
export type MessageType = components["schemas"]["MessageType"];
export type MessageTimeView = components["schemas"]["MessageTimeView"];
export type MessageContent = components["schemas"]["MessageContent"];
export type MessageView = components["schemas"]["MessageView"];
export type MessagesView = components["schemas"]["MessagesView"];
export type VillageMessageForm = components["schemas"]["VillageMessageForm"];

// 参加者関連型
export type VillageParticipantView = components["schemas"]["VillageParticipantView"];
export type VillageParticipant = components["schemas"]["VillageParticipant"];
export type VillageParticipants = components["schemas"]["VillageParticipants"];
export type VillageParticipantsView = components["schemas"]["VillageParticipantsView"];

// スキル関連型
export type Skill = components["schemas"]["Skill"];
export type SkillsView = components["schemas"]["SkillsView"];
export type SkillRequest = components["schemas"]["SkillRequest"];
export type SkillRecord = components["schemas"]["SkillRecord"];
export type ComingOut = components["schemas"]["ComingOut"];
export type DeadView = components["schemas"]["DeadView"];
export type Dead = components["schemas"]["Dead"];

// 村関連型
export type VillageView = components["schemas"]["VillageView"];
export type VillagesView = components["schemas"]["VillagesView"];
export type SimpleVillageView = components["schemas"]["SimpleVillageView"];
export type RecruitingVillagesView = components["schemas"]["RecruitingVillagesView"];
export type RecruitingVillageView = components["schemas"]["RecruitingVillageView"];
export type VillageSettingsView = components["schemas"]["VillageSettingsView"];
export type VillageStatus = components["schemas"]["VillageStatus"];
export type VillageDay = components["schemas"]["VillageDay"];
export type VillageDays = components["schemas"]["VillageDays"];
export type VillageOrganizations = components["schemas"]["VillageOrganizations"];
export type VillageRules = components["schemas"]["VillageRules"];
export type VillageTimeView = components["schemas"]["VillageTimeView"];
export type VillagePasswordView = components["schemas"]["VillagePasswordView"];
export type VillageRegisterView = components["schemas"]["VillageRegisterView"];
export type PersonCapacity = components["schemas"]["PersonCapacity"];
export type NoonNight = components["schemas"]["NoonNight"];

// プレイヤー関連型
export type PlayerView = components["schemas"]["PlayerView"];
export type Player = components["schemas"]["Player"];
export type MyselfPlayerView = components["schemas"]["MyselfPlayerView"];
export type PlayerRecordsView = components["schemas"]["PlayerRecordsView"];
export type ParticipateVillageView = components["schemas"]["ParticipateVillageView"];
export type WinLose = components["schemas"]["WinLose"];

// 村参加・状況関連型
export type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
export type VillageParticipateSituationView =
  components["schemas"]["VillageParticipateSituationView"];
export type VillageSaySituation = components["schemas"]["VillageSaySituation"];
export type VillageVoteSituationView = components["schemas"]["VillageVoteSituationView"];
export type VillageAbilitySituationView = components["schemas"]["VillageAbilitySituationView"];
export type VillageAbilitySituationsView = components["schemas"]["VillageAbilitySituationsView"];
export type VillageCommitSituation = components["schemas"]["VillageCommitSituation"];
export type VillageComingOutSituation = components["schemas"]["VillageComingOutSituation"];
export type VillageSkillRequestSituation = components["schemas"]["VillageSkillRequestSituation"];
export type VillageCreatorSituation = components["schemas"]["VillageCreatorSituation"];
export type VillageRollCallSituation = components["schemas"]["VillageRollCallSituation"];

// 陣営・戦績関連型
export type Camp = components["schemas"]["Camp"];
export type CampRecord = components["schemas"]["CampRecord"];
export type Record = components["schemas"]["Record"];

// バージョン関連型
export type Version = components["schemas"]["Version"];

// デバッグ用村情報
export type DebugVillageView = components["schemas"]["DebugVillageView"];

// リクエストボディ型
export type VillageRegisterBody = components["schemas"]["VillageRegisterBody"];
export type VillageSettingRegisterBody = components["schemas"]["VillageSettingRegisterBody"];
export type VillageTimeCreateBody = components["schemas"]["VillageTimeCreateBody"];
export type VillageOrganizationCreateBody = components["schemas"]["VillageOrganizationCreateBody"];
export type VillageCharachipCreateBody = components["schemas"]["VillageCharachipCreateBody"];
export type VillageRuleCreateBody = components["schemas"]["VillageRuleCreateBody"];
export type VillageParticipateBody = components["schemas"]["VillageParticipateBody"];
export type VillageSayBody = components["schemas"]["VillageSayBody"];
export type VillageVoteBody = components["schemas"]["VillageVoteBody"];
export type VillageAbilityBody = components["schemas"]["VillageAbilityBody"];
export type VillageCommitBody = components["schemas"]["VillageCommitBody"];
export type VillageComingOutBody = components["schemas"]["VillageComingOutBody"];
export type VillageChangeSkillBody = components["schemas"]["VillageChangeSkillBody"];
export type VillageRollcallBody = components["schemas"]["VillageRollcallBody"];
export type CreatorSayBody = components["schemas"]["CreatorSayBody"];
export type CreatorKickBody = components["schemas"]["CreatorKickBody"];
export type AdminParticipateBody = components["schemas"]["AdminParticipateBody"];
export type AdminDummyLoginBody = components["schemas"]["AdminDummyLoginBody"];
export type PlayerUpdateNicknameBody = components["schemas"]["PlayerUpdateNicknameBody"];

// フォーム型
export type VillageListForm = components["schemas"]["VillageListForm"];

// LASTWOLFにはVillageDayViewという型名でVillageDayを使用
export type VillageDayView = components["schemas"]["VillageDay"];
// LASTWOLFにはVillageDaysViewという型名でVillageDaysを使用
export type VillageDaysView = components["schemas"]["VillageDays"];
// VillageLatestView / VillageLatestFormはLASTWOLFでは存在しない可能性があるため
// VillageMessageFormで代替
export type VillageLatestView = components["schemas"]["VillageMessageForm"];
export type VillageLatestForm = components["schemas"]["VillageMessageForm"];
// VillageAnchorMessageViewはMessagesViewで代替
export type VillageAnchorMessageView = components["schemas"]["MessagesView"];
