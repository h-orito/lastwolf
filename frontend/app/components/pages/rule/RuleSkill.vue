<template>
  <div class="overflow-x-auto text-sm text-fg">
    <table class="doc-table">
      <thead>
        <tr>
          <th class="whitespace-nowrap">役職</th>
          <th class="w-16 whitespace-nowrap text-center">略称</th>
          <th class="whitespace-nowrap text-center">所属陣営</th>
          <th class="whitespace-nowrap">能力</th>
          <th class="whitespace-nowrap">占い結果</th>
          <th class="whitespace-nowrap">霊視結果</th>
          <th class="whitespace-nowrap text-center">発言可能</th>
          <th class="whitespace-nowrap text-center">勝敗判定カウント</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="skill in tableSkills" :key="skill.name">
          <tr class="row-stripe">
            <td>
              <button
                v-if="skill.description"
                class="text-link text-left"
                @click="toggleDetail(skill.name)"
              >
                {{ skill.name }}
              </button>
              <span v-else>{{ skill.name }}</span>
            </td>
            <td class="text-center">{{ skill.short_name }}</td>
            <td class="text-center" :class="skill.camp === '人狼陣営' ? 'text-wolf' : ''">
              {{ skill.camp }}
            </td>
            <td>
              <span v-for="(ability, index) in skill.abilities" :key="ability.name">
                {{ index !== 0 ? "," : "" }}
                <a :href="'#' + ability.link" class="text-link">{{ ability.name }}</a>
              </span>
            </td>
            <td :class="skill.divine_result === '人狼' ? 'text-wolf' : ''">
              {{ skill.divine_result }}
            </td>
            <td :class="skill.psychic_result === '人狼' ? 'text-wolf' : ''">
              {{ skill.psychic_result }}
            </td>
            <td class="text-center">
              <span
                v-for="(messageType, index) in skill.sayable_message_types"
                :key="messageType.name"
              >
                {{ index !== 0 ? "," : "" }}
                {{ messageType.name }}
              </span>
            </td>
            <td class="text-center" :class="skill.count_camp === '人狼' ? 'text-wolf' : ''">
              {{ skill.count_camp }}
            </td>
          </tr>
          <tr v-if="expandedSkills.has(skill.name)" :key="skill.name + '-detail'">
            <td colspan="8" class="bg-elev text-sm text-fg">
              <p v-html="skill.description.replace(/\n/g, '<br />')"></p>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type Skill = components["schemas"]["Skill"];
type Camp = components["schemas"]["Camp"];
type AbilityType = components["schemas"]["AbilityType"];
type MessageType = components["schemas"]["MessageType"];

interface TableAbility {
  name: string;
  link: string;
}

interface TableMessageType {
  name: string;
}

interface TableSkill {
  name: string;
  short_name: string;
  camp: string;
  abilities: TableAbility[];
  divine_result: string;
  psychic_result: string;
  sayable_message_types: TableMessageType[];
  count_camp: string;
  description: string;
}

const props = defineProps<{
  skillList: Skill[];
}>();

const expandedSkills = ref<Set<string>>(new Set());

const tableSkills = computed<TableSkill[]>(() => {
  if (props.skillList.length === 0) return [];
  return props.skillList.map((skill: Skill) => ({
    name: skill.name,
    short_name: skill.short_name,
    camp: skill.win_judge_camp == null ? "-" : skill.win_judge_camp.name,
    abilities: skill.manual_ability_list.map((ability: AbilityType) => ({
      name: ability.name,
      link: ability.code.toLowerCase(),
    })),
    divine_result: skill.divine_result_wolf ? "人狼" : "人狼でない",
    psychic_result: skill.psychic_result_wolf ? "人狼" : "人狼でない",
    sayable_message_types: skill.sayable_skill_message_type_list.map(
      (messageType: MessageType) => ({
        name: messageType.name,
      }),
    ),
    count_camp: countCamp(skill.count_camp),
    description: skill.description,
  }));
});

function countCamp(camp: Camp | undefined): string {
  if (camp == null) {
    return "-";
  } else if (camp.name === "村人陣営") {
    return "人間";
  } else if (camp.name === "人狼陣営") {
    return "人狼";
  } else {
    return "-";
  }
}

function toggleDetail(skillName: string): void {
  if (expandedSkills.value.has(skillName)) {
    expandedSkills.value.delete(skillName);
  } else {
    expandedSkills.value.add(skillName);
  }
}
</script>
