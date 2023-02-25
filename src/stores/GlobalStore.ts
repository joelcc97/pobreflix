import { ContentPlayingType } from "~/utils";

type GlobalStoreType = {
  username?: string;
  content?: ContentPlayingType;
};

let globalStore: GlobalStoreType = {};

function setGlobalStore(data: Partial<GlobalStoreType>) {
  globalStore = { ...globalStore, ...data };
}

function getGlobalStore(): GlobalStoreType {
  return globalStore;
}

export { setGlobalStore, getGlobalStore };
