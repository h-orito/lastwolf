<template>
  <section class="section">
    <div class="container has-text-left is-size-7">
      <h1 class="title is-5">仕様</h1>
      <notification :closable="false">
        <ul>
          <li><a href="#create-village">村作成</a></li>
          <li><a href="#creator">村建てが行えること</a></li>
          <li><a href="#overall">流れ</a></li>
          <li><a href="#skill-assign">役職割り当て</a></li>
          <li><a href="#vote">投票</a></li>
          <li><a href="#commit">時短希望</a></li>
          <li><a href="#suddenly-death">突然死</a></li>
          <li><a href="#night-process">投票→夜時間の処理</a></li>
          <li><a href="#noon-process">夜→昼時間の処理</a></li>
          <li><a href="#skill">役職</a></li>
          <li>
            <a href="#ability">能力行使</a>
            <ul>
              <li><a href="#ability-overall">全般</a></li>
              <li><a href="#divine">占い</a></li>
              <li><a href="#psychic">霊視</a></li>
              <li><a href="#guard">護衛</a></li>
              <li><a href="#attack">襲撃</a></li>
            </ul>
          </li>
        </ul>
      </notification>
      <h3 id="create-village" class="title is-6">村作成</h3>
      <div class="content">
        <ul>
          <li>
            プレイヤーが村を作成できます。
            <ul>
              <li>
                参加している/作成した村の決着がついていない場合は作成できません。
              </li>
            </ul>
          </li>
          <li>
            作成後も募集中は設定を変更することができます。
            <ul>
              <li>
                ただし、キャラチップとダミーキャラについては後から変更できません。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">村建てが行えること</h3>
      <div class="content">
        <ul>
          <li>村の設定変更（募集中のみ）</li>
          <li>
            参加者の強制退村（募集中のみ）
            <ul>
              <li>
                点呼中は強制退村させられないので、一度点呼を中断してから強制退村させてください。
              </li>
            </ul>
          </li>
          <li>廃村（募集中のみ）</li>
          <li>点呼の開始（募集中かつ人数が揃っている場合のみ）</li>
          <li>
            点呼の中断
            <ul>
              <li>
                全員の「準備完了」状態が解除されます。
              </li>
            </ul>
          </li>
          <li>村の開始（点呼中かつ全員が「準備完了」になった場合のみ）</li>
          <li>
            参加者のIDや役職を知ることはできないため、村建てもゲームに参加しても問題ありません。
          </li>
          <li>
            村建て発言（参加の有無にかかわらずいつでも使え、全員が参照できます。）
          </li>
        </ul>
      </div>

      <h3 id="overall" class="title is-6">大まかな流れ</h3>
      <div class="content">
        <ul>
          <li>
            募集中
            <ul>
              <li>プレイヤーはキャラクターを選んで村に参加/退村できます。</li>
              <li>
                役職希望が有効な村では、プレイヤーは参加時/募集中に第二希望まで役職を希望することができます。
              </li>
              <li>村建ては参加者が揃うと点呼を開始することができます。</li>
            </ul>
          </li>
          <li>
            点呼中
            <ul>
              <li>プレイヤーは準備完了/解除することができます。</li>
              <li>村建ては全員が準備完了すると村を開始することができます。</li>
            </ul>
          </li>
          <li>
            夜時間
            <ul>
              <li>（初日の夜のみ）役職が割り当てられます。</li>
              <li>
                （初日の夜のみ）人狼の襲撃対象はダミーキャラ固定になります。
                <ul>
                  <li>そのため、狩人は初日に限り能力行使できません。</li>
                </ul>
              </li>
              <li>
                人狼は人狼同士にしか聞こえない会話をすることができます。（同共有者）
                <ul>
                  <li>
                    人狼や共有者以外はチャットを送信しても自分にしか聞こえない独り言となります。
                  </li>
                </ul>
              </li>
              <li>
                規定の時間が経過するか、全員が時短を希望すると昼時間に進みます。
              </li>
              <li>
                能力行使できる役職が行使しないまま次に進むと突然死します。
              </li>
            </ul>
          </li>
          <li>
            昼時間
            <ul>
              <li>誰を処刑するかチャットによる議論を行います。</li>
              <li>
                規定の時間が経過するか、全員が時短を希望すると投票時間に進みます。
              </li>
            </ul>
          </li>
          <li>
            投票時間
            <ul>
              <li>処刑したい人に投票を行います。</li>
              <li>会話することはできません。</li>
              <li>
                規定の時間が経過するか、全員が投票すると夜時間に進みます。
              </li>
              <li>時間内に投票しないと突然死します。</li>
              <li>
                最多票の人が処刑されますが、最多票の人が複数いる場合は再投票となります。
                <ul>
                  <li>
                    3回の投票で処刑者が決定しない場合、引き分けとなります。
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            以降
            <ul>
              <li>
                いずれかの陣営の勝利条件を満たすまで夜時間→昼時間→投票時間→夜時間..と繰り返していきます。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 id="skill-assign" class="title is-6">役職割り当て</h3>
      <div class="content">
        <ul>
          <li>村の開始時、以下のように役職が割り当てられます。</li>
          <li>
            ダミーキャラの役職割り当てが最初に行われます。
            <ul>
              <li>
                村の設定でダミー役欠けが「あり」となっている場合、襲撃で死亡する役職のいずれかが割り当てられます。
                <ul>
                  <li>
                    例. 編成が「村村村村村村村村村占霊狩狼狼狼狂狐」の場合
                  </li>
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
            <ul>
              <li>第1希望で役職を指定した人を割り当て</li>
              <li>第1希望でおまかせ（XX陣営）を指定した人を割り当て</li>
              <li>第2希望で役職を指定した人を割り当て</li>
              <li>第2希望でおまかせ（XX陣営）を指定した人を割り当て</li>
              <li>
                ここまでで割り当てられなかった人とおまかせの人を割り当て
              </li>
            </ul>
          </li>
          <li>
            村の設定で役職希望が無効となっている場合、全員がおまかせ扱いになります。
          </li>
        </ul>
      </div>
      <h3 class="title is-6" id="vote">投票</h3>
      <div class="content">
        <ul>
          <li>自分以外の生存者に投票することができます。</li>
          <li>全員が投票すると、誰が誰に投票したか公開されます。</li>
          <li>
            最多票の人が処刑されますが、最多票の人が複数いる場合は再投票となります。
          </li>
          <li>
            3回の投票で処刑者が決定しない場合、引き分けとなります。
          </li>
          <li>規定の時間が経過するか、全員が投票すると夜時間に進みます。</li>
          <li>全員が投票するまでは投票先を変更することができます。</li>
          <li>時間内に投票しなかった場合、突然死します。</li>
        </ul>
      </div>
      <h3 id="commit" class="title is-6">時短希望</h3>
      <div class="content">
        <ul>
          <li>昼時間と夜時間に、生存者は時短を希望することができます。</li>
          <li>
            全員が時短を希望した場合、すぐに次に進みます。（昼時間なら投票時間へ、夜時間なら昼時間へ）
          </li>
          <li>何人時短希望しているか知ることはできません。</li>
        </ul>
      </div>
      <h3 id="suddenly-death" class="title is-6">突然死</h3>
      <div class="content">
        <ul>
          <li>
            夜時間に能力行使をしなかった/投票時間に投票しなかった生存者は突然死します。
          </li>
          <li>突然死者はエピローグ以外で一切の発言ができなくなります。</li>
          <li>突然死者は自陣営が勝利していても敗北となります。</li>
          <li>
            突然死者は以降の村に参加することができなくなります。
            <ul>
              <li>
                突然死した方は管理者まで直接ご連絡ください。やむを得ない事情があったと判断した場合、入村制限を解除します。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 id="night-process" class="title is-6">投票→夜時間の処理</h3>
      <div class="content">
        <ol>
          <li>突然死</li>
          <li>処刑</li>
          <li>霊視</li>
          <li>勝敗判定</li>
        </ol>
      </div>
      <h3 id="noon-process" class="title is-6">夜→昼時間の処理</h3>
      <div class="content">
        <ol>
          <li>突然死</li>
          <li>呪殺</li>
          <li>襲撃</li>
          <li>勝敗判定</li>
        </ol>
      </div>
      <h3 id="skill" class="title is-6">役職</h3>
      <skill :skill-list="skillList" @scroll="scrollAbility($event)" />
      <h3 id="ability" class="title is-6">能力行使</h3>
      <ability />
      <h3 class="title is-6">陣営、勝利条件</h3>
      <div class="content">
        <b-table
          :data="camps"
          ref="table"
          striped
          narrowed
          :show-detail-icon="false"
          :mobile-cards="false"
          id="camp-table"
        >
          <template slot-scope="props">
            <b-table-column field="name" label="陣営">
              <template>
                {{ props.row.name }}
              </template>
            </b-table-column>
            <b-table-column field="win_condition" label="勝利条件">
              <template>
                {{ props.row.win_condition }}
              </template>
            </b-table-column>
          </template>
        </b-table>
        <ul>
          <li>
            「人間」「人狼」どちらにカウントされるかは役職欄の「勝敗判定カウント」を参照してください。
            <ul>
              <li>
                「勝敗判定カウント」が「-」の場合はどちらにもカウントされません。
              </li>
            </ul>
          </li>
          <li>同時に条件を満たした場合、上にあるものが優先されます。</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
// type
import Skill from '~/@types/skill'
import Skills from '~/@types/skills'
import notification from '~/components/setting/notification.vue'
const skill = () => import('~/components/rule/skill.vue')
const ability = () => import('~/components/rule/ability.vue')

interface Camp {
  name: string
  win_condition: string
}

@Component({
  components: { skill, ability, notification }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | 仕様' }
  }

  /** data */
  private skillList: Skill[] = []

  /** computed */
  private get camps(): Camp[] {
    return [
      {
        name: '狐陣営',
        win_condition:
          '人狼陣営または村人陣営が勝利条件を満たした状態で妖狐が生存'
      },
      {
        name: '人狼陣営',
        win_condition: '生存している「人狼」の数 ≧ 生存している「人間」の数'
      },
      {
        name: '村人陣営',
        win_condition: '「人狼」が全員死亡'
      }
    ]
  }

  /** created */
  private async created(): Promise<void> {
    const skills: Skills = await this.$axios.$get('/skill/list')
    this.skillList = skills.list
  }

  /** method */
}
</script>

<style lang="scss" scoped>
.b-table {
  overflow: auto;
  white-space: nowrap;
}
</style>
