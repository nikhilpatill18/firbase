import { db } from './firebase'
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { query, where } from 'firebase/firestore'

export const addtask = async (task, uid) => {
    // console.log(task, uid, "task");

    try {
        const docRef = await addDoc(collection(db, 'tasks'), {
            ...task,
            uid,
            createdAt: serverTimestamp(),
        });

        console.log("✅ Task Added with ID:", docRef.id);
        return { docId: docRef.id, ...task }
    } catch (error) {
        console.error("🔥 Firestore Error:", error.message);
    }
}

export const gettasks = async (uid) => {
    console.log(uid, "uid");

    try {
        const querySnapshot = await getDocs(query(collection(db, 'tasks'), where('uid', '==', uid)));
        console.log(querySnapshot.docs[0].id);

        const tasks = querySnapshot.docs.map((doc) => ({
            taskId: doc.id,
            ...doc.data(),
        }));

        console.log(tasks[0].taskId, "taks");

        return tasks;
    } catch (error) {
        console.error("🔥 Firestore Error:", error.message);
        return [];
    }

}
export const edittaskstitle = async (taskid, updatetitle) => {
    try {

        const taaskref = doc(db, "tasks", taskid)

        const updatedtask = await updateDoc(doc(db, "tasks", taskid), {
            title: updatetitle
        })
        return updatedtask


    } catch (error) {
        console.log(error);


    }

}
export const editstatus = async (taskid, sta) => {
    try {


        const updatestatus = await updateDoc(doc(db, "tasks", taskid), {
            status: sta
        })
        return updatestatus
    } catch (error) {

    }
}


export const deteletask = async (taskid) => {

    try {
        await deleteDoc(doc(db, "tasks", taskid))

    } catch (error) {

    }

}