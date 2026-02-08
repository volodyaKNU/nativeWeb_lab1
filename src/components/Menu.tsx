import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import {
  bookOutline,
  bookSharp,
  calculatorOutline,
  calculatorSharp,
  colorPaletteOutline,
  colorPaletteSharp,
} from "ionicons/icons";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Task 1",
    url: "/folder/task1",
    iosIcon: bookOutline,
    mdIcon: bookSharp,
  },
  {
    title: "Task 2",
    url: "/folder/task2",
    iosIcon: calculatorOutline,
    mdIcon: calculatorSharp,
  },
  {
    title: "Task 3",
    url: "/folder/task3",
    iosIcon: colorPaletteOutline,
    mdIcon: colorPaletteSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Лабораторна робота 1</IonListHeader>
          <IonNote>КН-31 Михайлюк Володимр Олександрович</IonNote>
          {appPages.map((appPage, index) => (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem
                className={location.pathname === appPage.url ? "selected" : ""}
                routerLink={appPage.url}
                routerDirection="none"
                lines="none"
                detail={false}
              >
                <IonIcon
                  aria-hidden="true"
                  slot="start"
                  ios={appPage.iosIcon}
                  md={appPage.mdIcon}
                />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
