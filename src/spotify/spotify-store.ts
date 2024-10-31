import { createSelectors } from "@/lib/store/create-selectors";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";

type State = {
    apiSDK: SpotifyApi | null;
    accessToken: string | null;
};

interface Actions {
    setApiSDK: (apiSDK: SpotifyApi | null) => void;
    getAccessToken: () => Promise<string | null>;
    getApiSDKOrThrow: () => SpotifyApi;
}

const defaults: State = {
    apiSDK: null,
    accessToken: null,
};

export const useSpotifyStoreBase = create<State & Actions>((set, get) => ({
    ...defaults,
    setApiSDK: (apiSDK) => set(() => ({ apiSDK })),
    getAccessToken: async () => {
        let accessToken = get().accessToken;

        if (!accessToken) {
            const res = await get().apiSDK?.getAccessToken();
            set(() => ({ accessToken: res?.access_token ?? null }));
            accessToken = res?.access_token ?? null;
        }

        return accessToken;
    },
    getApiSDKOrThrow: () => {
        const apiSDK = get().apiSDK;

        // TODO : doing this to solve problem of having null/undefined spotify client in api, but this just seems strange
        // and will probably break stuff ;-;
        if (!apiSDK) {
            throw new Error("apiSDK is not set");
        }
        return apiSDK;
    },
}));

export const useSpotifyStore = createSelectors(useSpotifyStoreBase);
