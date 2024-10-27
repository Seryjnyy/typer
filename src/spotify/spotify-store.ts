import { create, createStore } from "zustand";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { createSelectors } from "@/lib/store/create-selectors";

type State = {
    apiSDK: SpotifyApi | null;
};

interface Actions {
    setApiSDK: (apiSDK: SpotifyApi | null) => void;
}

const defaults: State = {
    apiSDK: null,
};

export const useSpotifyStoreBase = create<State & Actions>((set, get) => ({
    ...defaults,
    setApiSDK: (apiSDK) => set(() => ({ apiSDK })),
}));

export const useSpotifyStore = createSelectors(useSpotifyStoreBase);
