<script setup lang="ts">
import { repository, version } from '@/../package.json';
import ICGithub from '~icons/c/github';
import ICX from '~icons/c/x';

const COMMIT_SHA = import.meta.env.VITE_COMMIT_SHA || '';
const repositoryUrl = repository.url
  .replace(/^git\+/, '')
  .replace(/\.git$/, '');

const SOCIALS = [
  {
    href: 'https://x.com/ChainReactor_io',
    icon: ICX
  },
  {
    href: 'https://github.com/matt-nowakowski/chainreactor-snapshot',
    icon: ICGithub
  }
];
</script>

<template>
  <div class="pt-6 pb-5 border-t">
    <UiContainer class="!max-w-screen-lg space-y-7">
      <div class="grid grid-col-2 md:grid-cols-4 space-y-4 md:space-y-0">
        <div class="space-y-2">
          <UiEyebrow>Chainreactor</UiEyebrow>
          <div class="space-y-1">
            <div>
              <AppLink :to="{ name: 'my-explore' }"> Explore spaces </AppLink>
            </div>
            <div>
              <AppLink :to="{ name: 'create-space-snapshot' }">
                Create a space
              </AppLink>
            </div>
            <div>
              <AppLink :to="{ name: 'site-ecosystem' }"> Ecosystem </AppLink>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <UiEyebrow>Resources</UiEyebrow>
          <div class="space-y-1">
            <div>
              <AppLink to="https://chainreactor.io">
                Website
                <IH-arrow-sm-right class="inline-block -rotate-45" />
              </AppLink>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <UiEyebrow>Company</UiEyebrow>
          <div>
            <AppLink :to="{ name: 'site-terms' }">Terms of use</AppLink>
          </div>
          <div>
            <AppLink :to="{ name: 'site-policy' }">Privacy policy</AppLink>
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="flex-grow">
          <IC-snapshot class="size-[32px] inline-block text-skin-link mr-3" />
          © {{ new Date().getFullYear() }} Chainreactor
          <AppLink
            :to="`${repositoryUrl}${COMMIT_SHA && `/tree/${COMMIT_SHA}`}`"
            class="ml-1.5"
          >
            <span
              v-text="
                `v${version}${COMMIT_SHA ? `#${COMMIT_SHA.slice(0, 7)}` : ''}`
              "
            />
            <IH-arrow-sm-right class="inline-block -rotate-45 ml-0.5" />
          </AppLink>
        </div>
        <div class="flex space-x-2.5">
          <AppLink
            v-for="social in SOCIALS"
            :key="social.href"
            :to="social.href"
            class="text-skin-text hover:text-skin-link"
          >
            <component :is="social.icon" class="size-[32px] text-skin-link" />
          </AppLink>
        </div>
      </div>
    </UiContainer>
  </div>
</template>
