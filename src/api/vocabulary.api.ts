import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";
import { Word, WordDefinition } from "shared/vocabulary.types";
import { ACTIONS } from "./actions";
import {
  BulkWordUploadPayload,
  BulkWordsProcessResponse,
  FileUploadPayload,
  IdPayload,
  IdsPayload,
} from "./vocabulary.types";

export const loadWordsFx = createEffect<void, Array<Word>>(() =>
  socket.emitWithAnswer<void, Array<Word>>(ACTIONS.LOAD_WORDS)
);

export const loadWordFx = createEffect<number, Word>((payload) =>
  socket.emitWithAnswer<IdPayload, Word>(ACTIONS.LOAD_WORD, {
    id: payload,
  })
);

export const deleteWordFx = createEffect<number, void, string>((payload) =>
  socket.emitWithAnswer<IdPayload, void>(ACTIONS.DELETE_WORD, {
    id: payload,
  })
);

export const deleteWordsBulkFx = createEffect<Array<number>, void, string>(
  (payload) =>
    socket.emitWithAnswer<IdsPayload, void>(ACTIONS.DELETE_WORDS_BULK, {
      ids: payload,
    })
);

export const fileUploadFx = createEffect<
  File,
  BulkWordsProcessResponse,
  string
>((file) =>
  socket.emitWithAnswer<FileUploadPayload, BulkWordsProcessResponse>(
    ACTIONS.PROCESS_FILE,
    {
      file,
      name: file.name,
    }
  )
);

export const bulkUploadWordsFx = createEffect<
  Array<WordDefinition>,
  Array<Word>,
  string
>((words) =>
  socket.emitWithAnswer<BulkWordUploadPayload, Array<Word>>(
    ACTIONS.BULK_UPLOAD_WORDS,
    { words }
  )
);
