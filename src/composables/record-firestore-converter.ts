import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
} from "@firebase/firestore";
import { Record } from "@/modules/record";

export const recordConverter = {
  toFirestore: (record: Record): DocumentData => {
    return {
      type: record.type,
      userId: record.userId,
      comment: record.comment,
      name: record.who,
      date: record.date,
      imageName: record.imageName,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Record => {
    const data = snapshot.data(options);
    return new Record(
      snapshot.id,
      data.userId,
      data.name,
      data.type,
      data.date,
      data.comment,
      // imageNameは後から追加した属性なので, undefinedである可能性がある.
      data.imageName === undefined ? null : data.imageName
    );
  },
};
