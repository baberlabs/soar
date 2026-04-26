export const createId = (prefix = "id") =>
  `${prefix}_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)}`;

export const createAttachmentId = () => createId("attachment");
