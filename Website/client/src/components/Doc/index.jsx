import styles from "./styles.module.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
const Doc = () => {
  //Iot-Garden Automatisierung
  const docs = [
    //{ uri: "https://url-to-my-pdf.pdf" }, // Remote file
    {
      uri: require("C://Programm_React//Website//client//src//components//Documents//Gymnasium-Buckhorn-bll-final.pdf"),
    }, // Local File
  ];
  return (
    <div>
      <div className={styles.main_container}></div>
      <div>
        <h1 className={styles.h1}>Dokumentation</h1>
      </div>
      <div className={styles.filereaderbox}>
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={docs}
          config={{
            header: {
              disableHeader: false,
              disableFileName: true,
              retainURLParams: false,
            },
          }}
          //style={{ width: 1000, height: 1000, margin: 100 }}
        />
      </div>
    </div>
  );
};

export default Doc;
