import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db, getCurrentUser } from "@/settings/firebase";
import { Record } from "@/modules/record";
import { recordConverter } from "./record-firestore-converter";

export const addRecordToFirestore = async (
  type: number,
  comment: string,
  inputTime: Date | null = null,
  imageName = ""
): Promise<Record | null> => {
  if (type === -1) {
    alert("レコードタイプを選んでください.");
    return null;
  } else if (type === 0 && comment === "") {
    alert("コメントのみを送る場合はコメントが必須です。");
  }
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) {
    return null;
  }
  const recordsRef = doc(db, "users", uid);
  const userSnap = await getDoc(recordsRef);
  if (!userSnap.exists()) return null;
  const userName: string = userSnap.data().name;
  const newRecordRef = doc(
    collection(recordsRef, "records").withConverter(recordConverter)
  );
  // 時刻が指定されているならそれを用い, そうでなければ現在時刻を取得して用いる.
  const recordTime = inputTime
    ? Timestamp.fromDate(inputTime)
    : Timestamp.now();

  // converterを用いているのでidを含まない適当なオブジェクトを作成してセットする
  const newRecordData = new Record(
    "dummy",
    uid,
    userName,
    type,
    recordTime,
    comment,
    imageName
  );
  await setDoc(newRecordRef, newRecordData);
  // idを書き換えてからオブジェクトを返すことでリロードなしで使えるようにする.
  newRecordData.id = newRecordRef.id;
  return newRecordData;
};
