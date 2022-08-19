import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";
import canvasToPDF from "@pdftron/canvas-to-pdf";

const App = () => {
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: "/files/PDFTRON_about.pdf",
      },
      viewer.current
    ).then(async (instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      documentViewer.addEventListener("documentLoaded", async () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,
          // values are in page coordinates with (0, 0) in the top left
          X: 0,
          Y: 0,
          Width: 300,
          Height: 300,
          Author: annotationManager.getCurrentUser(),
        });

        const draw = (ctx) => {
          ctx.fillStyle = "red";
          ctx.lineWidth = "20";
          ctx.strokeStyle = "black";
          ctx.rect(50, 50, 250, 250);
          ctx.fill();
          ctx.stroke();
        };

        const blob = await canvasToPDF(draw);
        const doc = await instance.Core.createDocument(blob, {
          extension: "pdf",
        });

        rectangleAnnot.addCustomAppearance(doc, { pageNumber: 1 });

        annotationManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
