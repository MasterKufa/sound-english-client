import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { Word, WordDefinition } from "shared/vocabulary.types";
import { ACTIONS } from "./actions";
import {
  BulkWordUploadPayload,
  FileUploadPayload,
  IdPayload,
} from "./vocabulary.types";

export const loadWordsFx = createEffect<void, Array<Word>>(() =>
  socket.emitWithAnswer<void, Array<Word>>(ACTIONS.LOAD_WORDS)
);

export const loadWordFx = createEffect<number, Word>((payload) =>
  socket.emitWithAnswer<IdPayload, Word>(ACTIONS.LOAD_WORD, {
    id: payload,
  })
);

export const deleteWordFx = createEffect<number, void>((payload) =>
  socket.emitWithAnswer<IdPayload, void>(ACTIONS.DELETE_WORD, {
    id: payload,
  })
);

export const fileUploadFx = createEffect<File, Array<WordDefinition>>((file) =>
  socket.emitWithAnswer<FileUploadPayload, Array<WordDefinition>>(
    ACTIONS.PROCESS_FILE,
    {
      file,
      name: file.name,
    }
  )
);

export const bulkUploadWordsFx = createEffect<Array<WordDefinition>, void>(
  (words) =>
    socket.emitWithAnswer<BulkWordUploadPayload, void>(
      ACTIONS.BULK_UPLOAD_WORDS,
      { words }
    )
);
