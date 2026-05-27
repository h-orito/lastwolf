<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-4xl">
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">仕様</h1>
        </header>

        <!-- 目次 -->
        <nav class="mb-7 rounded-md border border-line-soft bg-soft/60 px-4 py-3 text-sm text-fg">
          <ul class="space-y-1 leading-relaxed">
            <li><a href="#create-village" class="text-link">村作成</a></li>
            <li><a href="#creator" class="text-link">村建てが行えること</a></li>
            <li><a href="#overall" class="text-link">流れ</a></li>
            <li><a href="#skill-assign" class="text-link">役職割り当て</a></li>
            <li><a href="#vote" class="text-link">投票</a></li>
            <li><a href="#commit" class="text-link">時短希望</a></li>
            <li><a href="#suddenly-death" class="text-link">突然死</a></li>
            <li><a href="#night-process" class="text-link">投票→夜時間の処理</a></li>
            <li><a href="#noon-process" class="text-link">夜→昼時間の処理</a></li>
            <li><a href="#skill" class="text-link">役職</a></li>
            <li>
              <a href="#ability" class="text-link">能力行使</a>
              <ul class="mt-1 space-y-1 pl-4">
                <li><a href="#ability-overall" class="text-link">全般</a></li>
                <li><a href="#divine" class="text-link">占い</a></li>
                <li><a href="#psychic" class="text-link">霊視</a></li>
                <li><a href="#guard" class="text-link">護衛</a></li>
                <li><a href="#forcesuicide" class="text-link">道連れ</a></li>
                <li><a href="#attack" class="text-link">襲撃</a></li>
                <li><a href="#foxsuicide" class="text-link">後追い（背徳者）</a></li>
              </ul>
            </li>
          </ul>
        </nav>

        <div class="space-y-7 text-sm leading-relaxed text-fg sm:text-[0.9375rem]">
          <section>
            <h2 id="create-village" class="doc-section-heading">村作成</h2>
            <ul class="list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>
                プレイヤーが村を作成できます。
                <ul class="mt-1 list-disc pl-6">
                  <li>参加している/作成した村の決着がついていない場合は作成できません。</li>
                </ul>
              </li>
              <li>
                作成後も募集中は設定を変更することができます。
                <ul class="mt-1 list-disc pl-6">
                  <li>ただし、キャラチップとダミーキャラについては後から変更できません。</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 id="creator" class="doc-section-heading">村建てが行えること</h2>
            <ul class="list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>村の設定変更（募集中のみ）</li>
              <li>
                参加者の強制退村（募集中のみ）
                <ul class="mt-1 list-disc pl-6">
                  <li>
                    点呼中は強制退村させられないので、一度点呼を中断してから強制退村させてください。
                  </li>
                </ul>
              </li>
              <li>廃村（募集中のみ）</li>
              <li>点呼の開始（募集中かつ人数が揃っている場合のみ）</li>
              <li>
                点呼の中断
                <ul class="mt-1 list-disc pl-6">
                  <li>全員の「準備完了」状態が解除されます。</li>
                </ul>
              </li>
              <li>村の開始（点呼中かつ全員が「準備完了」になった場合のみ）</li>
              <li>
                参加者のIDや役職を知ることはできないため、村建てもゲームに参加しても問題ありません。
              </li>
              <li>村建て発言（参加の有無にかかわらずいつでも使え、全員が参照できます。）</li>
            </ul>
          </section>

          <section>
            <h2 id="overall" class="doc-section-heading">大まかな流れ</h2>
            <ul class="list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>
                募集中
                <ul class="mt-1 list-disc space-y-1 pl-6">
                  <li>プレイヤーはキャラクターを選んで村に参加/退村できます。</li>
                  <li>
                    役職希望が有効な村では、プレイヤーは参加時/募集中に第二希望まで役職を希望することができます。
                  </li>
                  <li>村建ては参加者が揃うと点呼を開始することができます。</li>
                </ul>
              </li>
              <li>
                点呼中
                <ul class="mt-1 list-disc space-y-1 pl-6">
                  <li>プレイヤーは準備完了/解除することができます。</li>
                  <li>村建ては全員が準備完了すると村を開始することができます。</li>
                </ul>
              </li>
              <li>
                夜時間
                <ul class="mt-1 list-disc space-y-1 pl-6">
                  <li>（初日の夜のみ）役職が割り当てられます。</li>
                  <li>
                    （初日の夜のみ）人狼の襲撃対象はダミーキャラ固定になります。
                    <ul class="mt-1 list-disc pl-6">
                      <li>そのため、狩人は初日に限り能力行使できません。</li>
                    </ul>
                  </li>
                  <li>
                    人狼は人狼同士にしか聞こえない会話をすることができます。（同共有者）
                    <ul class="mt-1 list-disc pl-6">
                      <li>
                        人狼や共有者以外はチャットを送信しても自分にしか聞こえない独り言となります。
                      </li>
                    </ul>
                  </li>
                  <li>規定の時間が経過するか、全員が時短を希望すると昼時間に進みます。</li>
                  <li>能力行使できる役職が行使しないまま次に進むと突然死します。</li>
                </ul>
              </li>
              <li>
                昼時間
                <ul class="mt-1 list-disc space-y-1 pl-6">
                  <li>誰を処刑するかチャットによる議論を行います。</li>
                  <li>規定の時間が経過するか、全員が時短を希望すると投票時間に進みます。</li>
                </ul>
              </li>
              <li>
                投票時間
                <ul class="mt-1 list-disc space-y-1 pl-6">
                  <li>処刑したい人に投票を行います。</li>
                  <li>会話することはできません。</li>
                  <li>規定の時間が経過するか、全員が投票すると夜時間に進みます。</li>
                  <li>時間内に投票しないと突然死します。</li>
                  <li>
                    最多票の人が処刑されますが、最多票の人が複数いる場合は再投票となります。
                    <ul class="mt-1 list-disc pl-6">
                      <li>3回の投票で処刑者が決定しない場合、引き分けとなります。</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                以降
                <ul class="mt-1 list-disc pl-6">
                  <li>
                    いずれかの陣営の勝利条件を満たすまで夜時間→昼時間→投票時間→夜時間..と繰り返していきます。
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 id="skill-assign" class="doc-section-heading">役職割り当て</h2>
            <ul class="list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>村の開始時、以下のように役職が割り当てられます。</li>
              <li>
                ダミーキャラの役職割り当てが最初に行われます。
                <ul class="mt-1 list-disc space-y-1 pl-6">
                  <li>
                    村の設定でダミー役欠けが「あり」となっている場合、襲撃で死亡する役職のいずれかが割り当てられます。
                    <ul class="mt-1 list-disc space-y-1 pl-6">
                      <li>例. 編成が「村村村村村村村村村占霊狩狼狼狼狂狐」の場合</li>
                      <li>
                        村人が9/13、占い師、霊能者、狩人、狂人がそれぞれ1/13の確率で割り当てられます。
                      </li>
                      <li>
                        人狼と妖狐は襲撃できない、もしくは襲撃により死亡しないため割り当てられません。
                      </li>
                    </ul>
                  </li>
                  <li>
                    村の設定でダミー役欠けが「なし」となっている場合、必ず村人が割り当てられます。
                  </li>
                </ul>
              </li>
              <li>
                ダミーキャラの割り当て後、以下の順に役職が割り当てられます。
                <ul class="mt-1 list-disc space-y-1 pl-6">
                  <li>第1希望で役職を指定した人を割り当て</li>
                  <li>第1希望でおまかせ（XX陣営）を指定した人を割り当て</li>
                  <li>第2希望で役職を指定した人を割り当て</li>
                  <li>第2希望でおまかせ（XX陣営）を指定した人を割り当て</li>
                  <li>ここまでで割り当てられなかった人とおまかせの人を割り当て</li>
                </ul>
              </li>
              <li>村の設定で役職希望が無効となっている場合、全員がおまかせ扱いになります。</li>
            </ul>
          </section>

          <section>
            <h2 id="vote" class="doc-section-heading">投票</h2>
            <ul class="list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>自分以外の生存者に投票することができます。</li>
              <li>全員が投票すると、誰が誰に投票したか公開されます。</li>
              <li>最多票の人が処刑されますが、最多票の人が複数いる場合は再投票となります。</li>
              <li>3回の投票で処刑者が決定しない場合、引き分けとなります。</li>
              <li>規定の時間が経過するか、全員が投票すると夜時間に進みます。</li>
              <li>全員が投票するまでは投票先を変更することができます。</li>
              <li>時間内に投票しなかった場合、突然死します。</li>
            </ul>
          </section>

          <section>
            <h2 id="commit" class="doc-section-heading">時短希望</h2>
            <ul class="list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>昼時間と夜時間に、生存者は時短を希望することができます。</li>
              <li>
                全員が時短を希望した場合、すぐに次に進みます。（昼時間なら投票時間へ、夜時間なら昼時間へ）
              </li>
              <li>何人時短希望しているか知ることはできません。</li>
            </ul>
          </section>

          <section>
            <h2 id="suddenly-death" class="doc-section-heading">突然死</h2>
            <ul class="list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>夜時間に能力行使をしなかった/投票時間に投票しなかった生存者は突然死します。</li>
              <li>突然死者はエピローグ以外で一切の発言ができなくなります。</li>
              <li>突然死者は自陣営が勝利していても敗北となります。</li>
              <li>
                突然死者は以降の村に参加することができなくなります。
                <ul class="mt-1 list-disc pl-6">
                  <li>
                    突然死した方は管理者まで直接ご連絡ください。やむを得ない事情があったと判断した場合、入村制限を解除します。
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 id="night-process" class="doc-section-heading">投票→夜時間の処理</h2>
            <ol class="list-decimal space-y-1 pl-6 marker:text-blood-deep">
              <li>突然死</li>
              <li>処刑</li>
              <li>霊視</li>
              <li>勝敗判定</li>
            </ol>
          </section>

          <section>
            <h2 id="noon-process" class="doc-section-heading">夜→昼時間の処理</h2>
            <ol class="list-decimal space-y-1 pl-6 marker:text-blood-deep">
              <li>突然死</li>
              <li>呪殺</li>
              <li>襲撃</li>
              <li>勝敗判定</li>
            </ol>
          </section>

          <section>
            <h2 id="skill" class="doc-section-heading">役職</h2>
            <RuleSkill v-if="!loading && skillList.length > 0" :skill-list="skillList" />
            <div v-else-if="loading" class="text-fg-muted">読み込み中...</div>
          </section>

          <section>
            <h2 id="ability" class="doc-section-heading">能力行使</h2>
            <RuleAbility />
          </section>

          <section>
            <h2 class="doc-section-heading">陣営、勝利条件</h2>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-fg">
                <thead>
                  <tr class="bg-soft">
                    <th class="border border-line-soft px-3 py-2 text-left whitespace-nowrap">
                      陣営
                    </th>
                    <th class="border border-line-soft px-3 py-2 text-left">勝利条件</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="camp in camps" :key="camp.name" class="row-stripe">
                    <td class="border border-line-soft px-3 py-1 whitespace-nowrap">
                      {{ camp.name }}
                    </td>
                    <td class="border border-line-soft px-3 py-1">{{ camp.win_condition }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul class="mt-3 list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>
                「人間」「人狼」どちらにカウントされるかは役職欄の「勝敗判定カウント」を参照してください。
                <ul class="mt-1 list-disc pl-6">
                  <li>「勝敗判定カウント」が「-」の場合はどちらにもカウントされません。</li>
                </ul>
              </li>
              <li>同時に条件を満たした場合、上にあるものが優先されます。</li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import RuleSkill from "~/components/pages/rule/RuleSkill.vue";
import RuleAbility from "~/components/pages/rule/RuleAbility.vue";
import type { components } from "~/lib/api/schema";

type Skill = components["schemas"]["Skill"];
type SkillsView = components["schemas"]["SkillsView"];

interface Camp {
  name: string;
  win_condition: string;
}

const meta = buildPageMeta({ title: "仕様" });
useSeoMeta(meta);

const { apiCall } = useApi();

const skillList = ref<Skill[]>([]);
const loading = ref(true);

const camps = computed<Camp[]>(() => [
  {
    name: "狐陣営",
    win_condition: "人狼陣営または村人陣営が勝利条件を満たした状態で妖狐が生存",
  },
  {
    name: "人狼陣営",
    win_condition: "生存している「人狼」の数 ≧ 生存している「人間」の数",
  },
  {
    name: "村人陣営",
    win_condition: "「人狼」が全員死亡",
  },
]);

onMounted(async () => {
  try {
    const skills = await apiCall<SkillsView>("/skill/list");
    skillList.value = skills.list;
  } catch (error) {
    console.error("役職一覧の取得に失敗しました:", error);
  } finally {
    loading.value = false;
  }
});
</script>
