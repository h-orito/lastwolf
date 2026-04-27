import { useForm } from "vee-validate";
import * as yup from "yup";
import type { Skill, SkillsView } from "~/lib/api/types";

export const useVillageFormValidation = () => {
  // 役職情報を取得
  const skillShortNames = ref<string[]>([]);

  const loadSkills = async () => {
    try {
      const { apiCall } = useApi();
      const response = await apiCall<SkillsView>("/skill/list");
      if (response?.list) {
        skillShortNames.value = response.list.map((skill: Skill) => skill.short_name);
      }
    } catch (error) {
      console.error("Failed to load skills:", error);
    }
  };

  // 初期化時に役職情報を取得
  onMounted(() => {
    loadSkills();
  });
  const validationSchema = yup.object({
    // 基本情報
    villageName: yup
      .string()
      .required("村名は必須です")
      .min(1, "村名を入力してください")
      .max(40, "村名は40文字以内で入力してください"),

    startDatetime: yup
      .date()
      .required("開始日時は必須です")
      .min(new Date(), "開始日時は現在時刻より後に設定してください"),

    silentHours: yup
      .number()
      .min(0, "沈黙時間は0以上で設定してください")
      .max(23, "沈黙時間は23時間以内で設定してください"),

    // キャラチップ設定
    charachipIds: yup
      .array()
      .of(yup.number())
      .min(1, "キャラチップを少なくとも1つ選択してください")
      .required("キャラチップは必須です"),

    dummyCharaId: yup
      .number()
      .required("ダミーキャラクターは必須です")
      .min(1, "ダミーキャラクターを選択してください"),

    // 編成
    capacityMin: yup
      .number()
      .required("最小人数は必須です")
      .min(5, "最小人数は5人以上で設定してください")
      .max(999, "最小人数は999人以下で設定してください")
      .test("capacity-min-max", "最小人数は最大人数以下である必要があります", function (value) {
        const { capacityMax } = this.parent;
        if (!value || !capacityMax) return true;
        return value <= capacityMax;
      }),

    capacityMax: yup
      .number()
      .required("最大人数は必須です")
      .min(5, "最大人数は5人以上で設定してください")
      .max(999, "最大人数は999人以下で設定してください")
      .test("capacity-max-min", "最大人数は最小人数以上である必要があります", function (value) {
        const { capacityMin } = this.parent;
        if (!value || !capacityMin) return true;
        return value >= capacityMin;
      }),

    organization: yup
      .string()
      .required("編成は必須です")
      .min(1, "編成を入力してください")
      .max(1004, "編成は1004文字以内で入力してください")
      .test(
        "valid-organization-format",
        "編成の形式が正しくありません。「{人数}人：役職構成」の形式で入力してください",
        (value) => {
          if (!value) return false;

          // 編成の形式をチェック（例: "11人：村村村村村占霊狩狼狼狂"）
          // 各行を分割して検証
          const lines = value.replace(/\r\n/g, "\n").split("\n");

          return lines.every((line) => {
            if (!line.trim()) return true; // 空行は許可

            // "人数人：役職構成" の形式をチェック（形式のみ）
            const match = line.match(/^(\d+)人：(.+)$/);
            if (!match) return false;

            return true;
          });
        },
      )
      .test("valid-person-range", "最低5人、最大999人です", (value) => {
        if (!value) return true;

        const lines = value.replace(/\r\n/g, "\n").split("\n");
        return lines.every((line) => {
          if (!line.trim()) return true;
          const match = line.match(/^(\d+)人：(.+)$/);
          if (!match) return true; // フォーマットエラーは別のバリデーションで処理

          const personNum = parseInt(match[1]!);
          // 人数範囲チェック（5〜999人）
          return personNum >= 5 && personNum <= 999;
        });
      })
      .test("valid-person-num", "人数が合っていない行があります", (value) => {
        if (!value) return true;

        const lines = value.replace(/\r\n/g, "\n").split("\n");
        return lines.every((line) => {
          if (!line.trim()) return true;
          const match = line.match(/^(\d+)人：(.+)$/);
          if (!match) return true; // フォーマットエラーは別のバリデーションで処理

          const personNum = parseInt(match[1]!);
          const organization = match[2]!;

          // 人数と役職数が一致しているかチェック
          return personNum === organization.length;
        });
      })
      .test("valid-skills", "不明な役職が存在しています", function (value) {
        if (!value) return true;

        // 役職情報が読み込まれていない場合はスキップ
        if (skillShortNames.value.length === 0) return true;

        const lines = value.replace(/\r\n/g, "\n").split("\n");
        return lines.every((line) => {
          if (!line.trim()) return true;
          const match = line.match(/^(\d+)人：(.+)$/);
          if (!match) return true;

          const organization = match[2]!;

          // 各文字が有効な役職略称かチェック
          const chars = organization.split("");
          return chars.every((char) => skillShortNames.value.includes(char));
        });
      })
      .test(
        "dummy-skill-villager",
        "役欠けなしの場合、村人を1名以上含めてください",
        function (value) {
          if (!value) return true;

          // 役欠けありの場合はチェックしない
          const availableDummySkill = this.parent.availableDummySkill;
          if (availableDummySkill === true) return true;

          const lines = value.replace(/\r\n/g, "\n").split("\n");
          return lines.every((line: string) => {
            if (!line.trim()) return true;
            const match = line.match(/^(\d+)人：(.+)$/);
            if (!match) return true;

            // 村人が最低1名いるかチェック
            return match[2]!.includes("村");
          });
        },
      ),

    availableDummySkill: yup.boolean(),

    // 詳細ルール
    availableSkillRequest: yup.boolean(),
    openSkillInGrave: yup.boolean(),
    visibleGraveMessage: yup.boolean(),
    availableSuddenlyDeath: yup.boolean(),
    availableCommit: yup.boolean(),
    availableGuardSameTarget: yup.boolean(),

    // 参加パスワード
    joinPassword: yup.string().max(20, "パスワードは20文字以内で入力してください"),
  });

  return {
    validationSchema,
    useForm,
    loadSkills,
  };
};
