import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { JSX, useMemo } from "react";
import { useParams } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import LabThree from "../components/LabThree";
import TaskOne from "../components/TaskOne";
import TaskTwo from "../components/TaskTwo";
import TaskThree from "../components/TaskThree";
import "./Page.css";

const taskPages: Record<string, { title: string; view: JSX.Element }> = {
  task1: { title: "Task 1", view: <TaskOne /> },
  task2: { title: "Task 2", view: <TaskTwo /> },
  lab2: { title: "Lab 2 (JSONBin)", view: <TaskTwo /> },
  task3: { title: "Task 3", view: <TaskThree /> },
  lab3: { title: "Lab 3 (Abstract classes)", view: <LabThree /> },
};

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const normalizedName = name?.toLowerCase();
  const currentTask = normalizedName ? taskPages[normalizedName] : undefined;

  const friendlyTitle = useMemo(
    () => currentTask?.title ?? name,
    [currentTask?.title, name]
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{friendlyTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{friendlyTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>

        {currentTask ? currentTask.view : <ExploreContainer name={name} />}
      </IonContent>
    </IonPage>
  );
};

export default Page;
