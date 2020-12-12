import LightningFS from "@isomorphic-git/lightning-fs";

export const fs = new LightningFS("fs");
export const pfs = fs.promises;
