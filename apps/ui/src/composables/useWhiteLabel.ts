import { useQueryClient } from '@tanstack/vue-query';
import { getNetwork, metadataNetwork } from '@/networks';
import { NetworkID, SkinSettings, Space } from '@/types';

type WhiteLabelConfig = {
  network?: NetworkID;
  id?: string;
  skinSettings?: SkinSettings;
};

const DEFAULT_DOMAIN = import.meta.env.VITE_HOST || 'localhost';
const WHITELABEL_MAPPING = import.meta.env.VITE_WHITELABEL_MAPPING;
// VITE_SPACE_ID locks the UI to a single space (e.g. 's:myspace.eth')
// Used by Chainreactor deployments — automatically configures white-label mode
const SPACE_ID = import.meta.env.VITE_SPACE_ID;
const domain = window.location.hostname;

// Whitelabel mappings for onchain spaces.
// Override locally with VITE_WHITELABEL_MAPPING env var for easier testing
// e.g. VITE_WHITELABEL_MAPPING='localhost;s:snapshot.eth'
// e.g. VITE_WHITELABEL_MAPPING='localhost' (org whitelabel without space)
const MAPPING: Record<string, WhiteLabelConfig> = {
  ...(SPACE_ID
    ? (() => {
        const [network, id] = SPACE_ID.split(':');
        return { [domain]: { network, id } };
      })()
    : WHITELABEL_MAPPING
      ? (() => {
          const [localDomain, localSpaceId] = WHITELABEL_MAPPING.split(';');
          if (!localSpaceId) return { [localDomain]: {} };
          const [network, id] = localSpaceId.split(':');
          return { [localDomain]: { network, id } };
        })()
      : {})
};

const isWhiteLabel = ref(false);
const isCustomDomain = ref(
  SPACE_ID ? true : WHITELABEL_MAPPING ? true : domain !== DEFAULT_DOMAIN
);
const failed = ref(false);

const isElectron = !!process.env.ELECTRON;

const resolved = ref(!isCustomDomain.value || isElectron);
const space = ref<Space | null>(null);
const skinSettings = ref<SkinSettings>();

async function getSpace(domain: string): Promise<Space | null> {
  const loadSpacesParams: Record<string, string> = {};
  let spaceNetwork = metadataNetwork;

  const mapping = MAPPING[domain];

  if (mapping) {
    if (!mapping.id || !mapping.network) return null;

    loadSpacesParams.id = mapping.id;
    spaceNetwork = mapping.network;
  } else {
    loadSpacesParams.domain = domain;
  }

  const queryClient = useQueryClient();
  const network = getNetwork(spaceNetwork);
  const space = (
    await network.api.loadSpaces({ limit: 1 }, loadSpacesParams)
  )[0];

  if (!space) return null;

  queryClient.setQueryData(
    ['spaces', 'detail', `${space.network}:${space.id}`],
    space
  );

  return space;
}

export function useWhiteLabel() {
  async function init() {
    if (resolved.value) return;

    let shouldResolve = true;

    try {
      const mapping = MAPPING[domain];

      space.value = await getSpace(domain);

      if (!space.value && !mapping) return;

      isWhiteLabel.value = true;
      skinSettings.value =
        mapping?.skinSettings || space.value?.additionalRawData?.skinSettings;
    } catch (err) {
      console.log(err);
      failed.value = true;
    } finally {
      resolved.value = shouldResolve;
    }
  }

  return {
    init,
    isWhiteLabel,
    isCustomDomain,
    failed,
    space,
    skinSettings,
    resolved
  };
}
